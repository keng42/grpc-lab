// package: grpclab
// file: main.proto

/* tslint:disable */
/* eslint-disable */

import * as grpc from "grpc";
import * as main_pb from "./main_pb";

interface IGrpcLabService extends grpc.ServiceDefinition<grpc.UntypedServiceImplementation> {
    getFeature: IGrpcLabService_IGetFeature;
    listFeatures: IGrpcLabService_IListFeatures;
    recordRoute: IGrpcLabService_IRecordRoute;
    routeChat: IGrpcLabService_IRouteChat;
}

interface IGrpcLabService_IGetFeature extends grpc.MethodDefinition<main_pb.Point, main_pb.Feature> {
    path: string; // "/grpclab.GrpcLab/GetFeature"
    requestStream: false;
    responseStream: false;
    requestSerialize: grpc.serialize<main_pb.Point>;
    requestDeserialize: grpc.deserialize<main_pb.Point>;
    responseSerialize: grpc.serialize<main_pb.Feature>;
    responseDeserialize: grpc.deserialize<main_pb.Feature>;
}
interface IGrpcLabService_IListFeatures extends grpc.MethodDefinition<main_pb.Rectangle, main_pb.Feature> {
    path: string; // "/grpclab.GrpcLab/ListFeatures"
    requestStream: false;
    responseStream: true;
    requestSerialize: grpc.serialize<main_pb.Rectangle>;
    requestDeserialize: grpc.deserialize<main_pb.Rectangle>;
    responseSerialize: grpc.serialize<main_pb.Feature>;
    responseDeserialize: grpc.deserialize<main_pb.Feature>;
}
interface IGrpcLabService_IRecordRoute extends grpc.MethodDefinition<main_pb.Point, main_pb.RouteSummary> {
    path: string; // "/grpclab.GrpcLab/RecordRoute"
    requestStream: true;
    responseStream: false;
    requestSerialize: grpc.serialize<main_pb.Point>;
    requestDeserialize: grpc.deserialize<main_pb.Point>;
    responseSerialize: grpc.serialize<main_pb.RouteSummary>;
    responseDeserialize: grpc.deserialize<main_pb.RouteSummary>;
}
interface IGrpcLabService_IRouteChat extends grpc.MethodDefinition<main_pb.RouteNote, main_pb.RouteNote> {
    path: string; // "/grpclab.GrpcLab/RouteChat"
    requestStream: true;
    responseStream: true;
    requestSerialize: grpc.serialize<main_pb.RouteNote>;
    requestDeserialize: grpc.deserialize<main_pb.RouteNote>;
    responseSerialize: grpc.serialize<main_pb.RouteNote>;
    responseDeserialize: grpc.deserialize<main_pb.RouteNote>;
}

export const GrpcLabService: IGrpcLabService;

export interface IGrpcLabServer {
    getFeature: grpc.handleUnaryCall<main_pb.Point, main_pb.Feature>;
    listFeatures: grpc.handleServerStreamingCall<main_pb.Rectangle, main_pb.Feature>;
    recordRoute: grpc.handleClientStreamingCall<main_pb.Point, main_pb.RouteSummary>;
    routeChat: grpc.handleBidiStreamingCall<main_pb.RouteNote, main_pb.RouteNote>;
}

export interface IGrpcLabClient {
    getFeature(request: main_pb.Point, callback: (error: grpc.ServiceError | null, response: main_pb.Feature) => void): grpc.ClientUnaryCall;
    getFeature(request: main_pb.Point, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: main_pb.Feature) => void): grpc.ClientUnaryCall;
    getFeature(request: main_pb.Point, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.Feature) => void): grpc.ClientUnaryCall;
    listFeatures(request: main_pb.Rectangle, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<main_pb.Feature>;
    listFeatures(request: main_pb.Rectangle, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<main_pb.Feature>;
    recordRoute(callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    recordRoute(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    recordRoute(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    recordRoute(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    routeChat(): grpc.ClientDuplexStream<main_pb.RouteNote, main_pb.RouteNote>;
    routeChat(options: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<main_pb.RouteNote, main_pb.RouteNote>;
    routeChat(metadata: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<main_pb.RouteNote, main_pb.RouteNote>;
}

export class GrpcLabClient extends grpc.Client implements IGrpcLabClient {
    constructor(address: string, credentials: grpc.ChannelCredentials, options?: object);
    public getFeature(request: main_pb.Point, callback: (error: grpc.ServiceError | null, response: main_pb.Feature) => void): grpc.ClientUnaryCall;
    public getFeature(request: main_pb.Point, metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: main_pb.Feature) => void): grpc.ClientUnaryCall;
    public getFeature(request: main_pb.Point, metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.Feature) => void): grpc.ClientUnaryCall;
    public listFeatures(request: main_pb.Rectangle, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<main_pb.Feature>;
    public listFeatures(request: main_pb.Rectangle, metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientReadableStream<main_pb.Feature>;
    public recordRoute(callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    public recordRoute(metadata: grpc.Metadata, callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    public recordRoute(options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    public recordRoute(metadata: grpc.Metadata, options: Partial<grpc.CallOptions>, callback: (error: grpc.ServiceError | null, response: main_pb.RouteSummary) => void): grpc.ClientWritableStream<main_pb.Point>;
    public routeChat(options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<main_pb.RouteNote, main_pb.RouteNote>;
    public routeChat(metadata?: grpc.Metadata, options?: Partial<grpc.CallOptions>): grpc.ClientDuplexStream<main_pb.RouteNote, main_pb.RouteNote>;
}
