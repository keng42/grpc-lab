import { resolve as pathResolve } from 'path';
import { promises as fsPromises } from 'fs';
// import { readFile } from 'fs/promises';
import * as grpc from 'grpc';
import { loadSync } from '@grpc/proto-loader';
import {
  ServerUnaryCall,
  ServerWritableStream,
  ServerReadableStream,
  ServerDuplexStream,
  ClientWritableStream,
} from 'grpc';
import parseArgs from 'minimist';
import { Point, Feature, Rectangle, RouteNote } from './proto/main_pb';

import services from './proto/main_grpc_pb';
import { features } from 'process';
import { reject } from 'lodash';

const client = new services.GrpcLabClient(
  'localhost:50051',
  grpc.credentials.createInsecure()
);

const COORD_FACTOR = 1e7;

async function runGetFeature() {
  return new Promise((resolve, reject) => {
    let count = 0;

    function featureCallback(
      error: grpc.ServiceError | null,
      feature: Feature
    ) {
      if (error) {
        reject(error);
        return;
      }
      const location: Point = feature.getLocation() || new Point();
      if (feature.getName() === '') {
        console.log(
          'Found no feature at ' +
            location.getLatitude() / COORD_FACTOR +
            ', ' +
            location.getLongitude() / COORD_FACTOR
        );
      } else {
        console.log(
          'Found feature called "' +
            feature.getName() +
            '" at ' +
            location.getLatitude() / COORD_FACTOR +
            ', ' +
            location.getLongitude() / COORD_FACTOR
        );
      }

      count += 1;
      if (count === 2) {
        resolve();
      }
    }

    const point1 = new Point();
    point1.setLatitude(409146138);
    point1.setLongitude(-746188906);

    const point2 = new Point();
    point2.setLatitude(0);
    point2.setLongitude(0);

    client.getFeature(point1, featureCallback);
    client.getFeature(point2, featureCallback);
  });
}

async function runListFeatures() {
  return new Promise((resolve, reject) => {
    const lo = new Point();
    lo.setLatitude(400000000);
    lo.setLongitude(-750000000);

    const hi = new Point();
    hi.setLatitude(420000000);
    hi.setLongitude(-730000000);

    const rectangle = new Rectangle();
    rectangle.setLo(lo);
    rectangle.setHi(hi);

    console.log('Looking for features between 40, -75 and 42, -73');
    var call = client.listFeatures(rectangle);
    call.on('data', function (feature) {
      console.log(
        'Found feature called "' +
          feature.name +
          '" at ' +
          feature.location.latitude / COORD_FACTOR +
          ', ' +
          feature.location.longitude / COORD_FACTOR
      );
    });
    call.on('end', () => {
      resolve();
    });
  });
}

async function sleep(ms: number) {
  console.log('sleep', ms, 'ms');
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

async function runRecordRoute() {
  const argv = parseArgs(process.argv, {
    string: 'db_path',
  });

  const data = await fsPromises.readFile(argv.db_path, 'utf8');

  const featureList: Feature[] = JSON.parse(data).map((item: any) => {
    const feature = new Feature();
    const location = new Point();
    location.setLongitude(item.location.longitide);
    location.setLatitude(item.location.latitude);
    feature.setLocation(location);
    feature.setName(item.name);
    return feature;
  });

  return new Promise((resolve, reject) => {
    const call = client.recordRoute(function (error, stats) {
      if (error) {
        reject(error);
        return;
      }
      console.log('Finished trip with', stats.getPointCount(), 'points');
      console.log('Passed', stats.getFeatureCount(), 'features');
      console.log('Travelled', stats.getDistance(), 'meters');
      console.log('It took', stats.getElapsedTime(), 'seconds');
      resolve();
    });

    (async () => {
      for (let i = 0; i < 10; i++) {
        const feature =
          featureList[Math.ceil(Math.random() * featureList.length - 1)];

        const location = feature.getLocation();
        const lat = location?.getLatitude() || 0;
        const lng = location?.getLongitude() || 0;

        console.log(
          'Visiting point ' + lat / COORD_FACTOR + ', ' + lng / COORD_FACTOR
        );
        const point = new Point();
        point.setLongitude(lng);
        point.setLatitude(lat);

        call.write(point);
        await sleep(Math.round(Math.random() * 1000 + 500));
      }

      call.end();
    })();
  });
}

function runRouteChat() {
  return new Promise((resolve, reject) => {
    const call = client.routeChat();

    call.on('data', function (note: RouteNote) {
      const location = note.getLocation() || new Point();
      console.log(
        'Got message "' +
          note.getMessage() +
          '" at ' +
          location.getLatitude() +
          ', ' +
          location.getLongitude()
      );
    });

    call.on('end', resolve);

    var notes = [
      {
        location: {
          latitude: 0,
          longitude: 0,
        },
        message: 'First message',
      },
      {
        location: {
          latitude: 0,
          longitude: 1,
        },
        message: 'Second message',
      },
      {
        location: {
          latitude: 1,
          longitude: 0,
        },
        message: 'Third message',
      },
      {
        location: {
          latitude: 0,
          longitude: 0,
        },
        message: 'Fourth message',
      },
    ];
    for (var i = 0; i < notes.length; i++) {
      var note = notes[i];
      console.log(
        'Sending message "' +
          note.message +
          '" at ' +
          note.location.latitude +
          ', ' +
          note.location.longitude
      );

      const routeNote = new RouteNote();
      const location = new Point();
      location.setLatitude(note.location.latitude);
      location.setLongitude(note.location.longitude);
      routeNote.setMessage(note.message);
      routeNote.setLocation(location);

      call.write(routeNote);
    }
    call.end();
  });
}

async function main() {
  // console.group('runGetFeature');
  // await runGetFeature();
  // console.groupEnd();
  // console.group('runListFeatures');
  // await runListFeatures();
  // console.groupEnd();
  // console.group('runRecordRoute');
  // await runRecordRoute();
  // console.groupEnd();
  console.group('runRouteChat');
  await runRouteChat();
  console.groupEnd();
  console.log('done');
}

if (require.main === module) {
  main();
}
