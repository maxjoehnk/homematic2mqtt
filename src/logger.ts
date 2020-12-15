import * as Logality from 'logality';
import { DeviceDetails, JsonRpcRequest } from './homematic/json';
import { BaseDiscoveryModel } from './mqtt/discovery/domains/base';

const logger = Logality({
  appName: 'homematic2mqtt',
  prettyPrint: true,
  serializers: {
    device: (device: DeviceDetails) => ({
      path: 'context.device',
      value: {
        id: device.id,
        name: device.name,
        type: device.type,
        address: device.address,
      },
    }),
    jsonRpcRequest: (request: JsonRpcRequest<any>) => ({
      path: 'context.req',
      value: {
        method: request.method,
        params: request.params,
      },
    }),
    discoveryModels: (discoveryModels: { config: BaseDiscoveryModel }[]) => ({
      path: 'context.discovery.device',
      value: discoveryModels[0].config.device,
    }),
    topic: (topic: string) => ({
      path: 'context.mqtt.topic',
      value: topic,
    }),
    xmlRpc: (xmlRpc: any) => ({
      path: 'context.xmlrpc',
      value: xmlRpc,
    }),
    error: (error: any) => ({
      path: 'context.error',
      value: error,
    }),
  },
});

export const getLogger: () => ILogger = logger.get.bind(logger);

export interface ILogger {
  alert(msg: string, context?: any);
  critical(msg: string, context?: any);
  error(msg: string, context?: any);
  warn(msg: string, context?: any);
  notice(msg: string, context?: any);
  info(msg: string, context?: any);
  debug(msg: string, context?: any);
}
