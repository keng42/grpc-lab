// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var main_pb = require('./main_pb.js');

function serialize_grpclab_Feature(arg) {
  if (!(arg instanceof main_pb.Feature)) {
    throw new Error('Expected argument of type grpclab.Feature');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpclab_Feature(buffer_arg) {
  return main_pb.Feature.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grpclab_Point(arg) {
  if (!(arg instanceof main_pb.Point)) {
    throw new Error('Expected argument of type grpclab.Point');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpclab_Point(buffer_arg) {
  return main_pb.Point.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grpclab_Rectangle(arg) {
  if (!(arg instanceof main_pb.Rectangle)) {
    throw new Error('Expected argument of type grpclab.Rectangle');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpclab_Rectangle(buffer_arg) {
  return main_pb.Rectangle.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grpclab_RouteNote(arg) {
  if (!(arg instanceof main_pb.RouteNote)) {
    throw new Error('Expected argument of type grpclab.RouteNote');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpclab_RouteNote(buffer_arg) {
  return main_pb.RouteNote.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_grpclab_RouteSummary(arg) {
  if (!(arg instanceof main_pb.RouteSummary)) {
    throw new Error('Expected argument of type grpclab.RouteSummary');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_grpclab_RouteSummary(buffer_arg) {
  return main_pb.RouteSummary.deserializeBinary(new Uint8Array(buffer_arg));
}


// Interface exported by the server.
var GrpcLabService = exports.GrpcLabService = {
  // A simple RPC.
//
// Obtains the feature at a given position.
//
// A feature with an empty name is returned if there's no feature at the given
// position.
getFeature: {
    path: '/grpclab.GrpcLab/GetFeature',
    requestStream: false,
    responseStream: false,
    requestType: main_pb.Point,
    responseType: main_pb.Feature,
    requestSerialize: serialize_grpclab_Point,
    requestDeserialize: deserialize_grpclab_Point,
    responseSerialize: serialize_grpclab_Feature,
    responseDeserialize: deserialize_grpclab_Feature,
  },
  // A server-to-client streaming RPC.
//
// Obtains the Features available within the given Rectangle.  Results are
// streamed rather than returned at once (e.g. in a response message with a
// repeated field), as the rectangle may cover a large area and contain a
// huge number of features.
listFeatures: {
    path: '/grpclab.GrpcLab/ListFeatures',
    requestStream: false,
    responseStream: true,
    requestType: main_pb.Rectangle,
    responseType: main_pb.Feature,
    requestSerialize: serialize_grpclab_Rectangle,
    requestDeserialize: deserialize_grpclab_Rectangle,
    responseSerialize: serialize_grpclab_Feature,
    responseDeserialize: deserialize_grpclab_Feature,
  },
  // A client-to-server streaming RPC.
//
// Accepts a stream of Points on a route being traversed, returning a
// RouteSummary when traversal is completed.
recordRoute: {
    path: '/grpclab.GrpcLab/RecordRoute',
    requestStream: true,
    responseStream: false,
    requestType: main_pb.Point,
    responseType: main_pb.RouteSummary,
    requestSerialize: serialize_grpclab_Point,
    requestDeserialize: deserialize_grpclab_Point,
    responseSerialize: serialize_grpclab_RouteSummary,
    responseDeserialize: deserialize_grpclab_RouteSummary,
  },
  // A Bidirectional streaming RPC.
//
// Accepts a stream of RouteNotes sent while a route is being traversed,
// while receiving other RouteNotes (e.g. from other users).
routeChat: {
    path: '/grpclab.GrpcLab/RouteChat',
    requestStream: true,
    responseStream: true,
    requestType: main_pb.RouteNote,
    responseType: main_pb.RouteNote,
    requestSerialize: serialize_grpclab_RouteNote,
    requestDeserialize: deserialize_grpclab_RouteNote,
    responseSerialize: serialize_grpclab_RouteNote,
    responseDeserialize: deserialize_grpclab_RouteNote,
  },
};

exports.GrpcLabClient = grpc.makeGenericClientConstructor(GrpcLabService);
