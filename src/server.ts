import path from 'path';
import fs from 'fs';
import grpc from 'grpc';
import parseArgs from 'minimist';
import {
  Point,
  Feature,
  Rectangle,
  RouteNote,
  RouteSummary,
} from './proto/main_pb';
import { IGrpcLabServer, GrpcLabService } from './proto/main_grpc_pb';

let featureList: Feature[] = [];

function checkFeature(point: Point): Feature {
  console.log('new Feature()', new Feature());
  console.log('featureList', featureList[0].getName());
  let feature: Feature | undefined = featureList.find((item) => {
    console.log('item', item);
    let location = item.getLocation();
    return (
      location &&
      location.getLatitude() === point.getLatitude() &&
      location.getLongitude() === point.getLongitude()
    );
  });

  if (!feature) {
    feature = new Feature();
    feature.setName('');
    feature.setLocation(point);
  }

  return feature;
}

const COORD_FACTOR = 1e7;

function toRadians(num: number) {
  return (num * Math.PI) / 180;
}

function getDistance(start: Point, end: Point) {
  var R = 6371000; // earth radius in metres
  var lat1 = toRadians(start.getLatitude() / COORD_FACTOR);
  var lat2 = toRadians(end.getLatitude() / COORD_FACTOR);
  var lon1 = toRadians(start.getLongitude() / COORD_FACTOR);
  var lon2 = toRadians(end.getLongitude() / COORD_FACTOR);

  var deltalat = lat2 - lat1;
  var deltalon = lon2 - lon1;
  var a =
    Math.sin(deltalat / 2) * Math.sin(deltalat / 2) +
    Math.cos(lat1) *
      Math.cos(lat2) *
      Math.sin(deltalon / 2) *
      Math.sin(deltalon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const routeNotes: { [key: string]: any[] } = {};

function pointKey(point: Point) {
  return point.getLatitude() + ' ' + point.getLongitude();
}

class GrpcLabServer implements IGrpcLabServer {
  getFeature(call: grpc.ServerUnaryCall<Point>, callback: Function) {
    callback(null, checkFeature(call.request));
  }

  listFeatures(call: grpc.ServerWritableStream<Rectangle>) {
    const lo = call.request.getLo();
    const hi = call.request.getHi();

    let left = 0;
    let right = 0;
    let top = 0;
    let bottom = 0;
    if (lo && hi) {
      left = Math.min(lo.getLongitude(), hi.getLongitude());
      right = Math.max(lo.getLongitude(), hi.getLongitude());
      top = Math.max(lo.getLatitude(), hi.getLatitude());
      bottom = Math.min(lo.getLatitude(), hi.getLatitude());
    }

    featureList.forEach((item) => {
      if (item.getName() === '') {
        return;
      }
      const location = item.getLocation();
      if (!location) {
        return;
      }
      if (
        location.getLongitude() >= left &&
        location.getLongitude() <= right &&
        location.getLatitude() >= bottom &&
        location.getLatitude() <= top
      ) {
        call.write(item);
      }
    });

    call.end();
  }

  recordRoute(call: grpc.ServerReadableStream<Point>, callback: Function) {
    var point_count = 0;
    var feature_count = 0;
    var distance = 0;
    var previous: Point | null = null;
    // Start a timer
    var start_time = process.hrtime();
    call.on('data', function (point) {
      point_count += 1;
      if (checkFeature(point).getName() !== '') {
        feature_count += 1;
      }
      /* For each point after the first, add the incremental distance from the
       * previous point to the total distance value */
      if (previous != null) {
        distance += getDistance(previous, point);
      }
      previous = point;
    });
    call.on('end', function () {
      const routeSummary = new RouteSummary();
      routeSummary.setPointCount(point_count);
      routeSummary.setFeatureCount(feature_count);
      routeSummary.setDistance(distance | 0);
      routeSummary.setElapsedTime(process.hrtime(start_time)[0]);
      callback(null, routeSummary);
    });
  }

  routeChat(call: grpc.ServerDuplexStream<RouteNote, RouteNote>) {
    console.log('----------');
    console.log('call', call.metadata.get('mytoken'));
    console.log('----------');
    call.on('data', function (note: RouteNote) {
      console.log('note', note);
      var key = pointKey(note.getLocation() || new Point());
      if (routeNotes.hasOwnProperty(key)) {
        routeNotes[key].forEach((item) => {
          call.write(item);
        });
      } else {
        routeNotes[key] = [];
      }
      const routeNote = new RouteNote();
      const location = note.getLocation() || new Point();
      location.setLatitude(location.getLatitude());
      location.setLongitude(location.getLongitude());
      routeNote.setMessage(note.getMessage());
      routeNote.setLocation(location);
      routeNotes[key].push(routeNote);
    });

    call.on('end', function () {
      call.end();
    });
  }
}

export function getServer() {
  const creds = grpc.ServerCredentials.createSsl(
    fs.readFileSync(path.resolve(__dirname, './certs/ca.crt')),
    [
      {
        private_key: fs.readFileSync(path.resolve(__dirname, './certs/server.key')),
        cert_chain: fs.readFileSync(path.resolve(__dirname, './certs/server.crt')),
      },
    ],
    true
  );

  const server = new grpc.Server();
  server.addService<IGrpcLabServer>(GrpcLabService, new GrpcLabServer());
  server.bind(`localhost:50051`, creds);
  // server.bind(`localhost:50051`, ServerCredentials.createInsecure());

  console.log(`Listening on 50051`);

  return server;
}

if (require.main === module) {
  // If this is run as a script, start a server on an unused port
  var routeServer = getServer();
  var argv = parseArgs(process.argv, {
    string: 'db_path',
  });
  fs.readFile(path.resolve(argv.db_path), 'utf8', function (err, data) {
    if (err) throw err;
    featureList = JSON.parse(data).map((item: any) => {
      const feature = new Feature();
      const location = new Point();
      location.setLongitude(item.location.longitide);
      location.setLatitude(item.location.latitude);
      feature.setLocation(location);
      feature.setName(item.name);
      return feature;
    });
    routeServer.start();
  });
}
