import { inject } from 'inversify';
import { Config, ConfigToken } from '../../../config';
import { createServer } from 'homematic-xmlrpc';
import { ApplicationInitializer } from '../../../lifecycle/application-initializer';
import { ProvideInterface, Singleton } from '../../../ioc-container';
import { getLogger } from '../../../logger';
import { DeviceRegistry } from '../../../devices/device-registry';
import { NativeDeviceRegistry } from '../native-device-registry';

@Singleton()
@ProvideInterface(ApplicationInitializer)
export class XmlRpcServer implements ApplicationInitializer {
  private static readonly logger = getLogger();
  private server;

  constructor(
    @inject(ConfigToken) private config: Config,
    private deviceRegistry: NativeDeviceRegistry
  ) {}

  order = 1;

  async initialize(): Promise<void> {
    if (this.config.homematic.xml == null) {
      return;
    }
    await this.createServer();
    this.server.on('event', (err, params, callback) => {
      XmlRpcServer.logger.debug('Received event', {
        xmlRpc: { event: 'event', params },
      });
      this.handleEvent(params);
      callback(null, '');
    });

    this.server.on('system.listMethods', function (err, params, callback) {
      XmlRpcServer.logger.debug('Received listMethods', {
        xmlRpc: { event: 'system.listMethods', params },
      });
      callback(null, ['system.listMethods', 'system.multicall', 'event', 'listDevices']);
    });
    this.server.on('listDevices', function (err, params, callback) {
      XmlRpcServer.logger.debug('Received listDevices', {
        xmlRpc: { event: 'listDevices', params },
      });
      callback(null, []);
    });
    this.server.on('system.multicall', (err, params, callback) => {
      XmlRpcServer.logger.debug('Received multicall', {
        xmlRpc: { event: 'system.multicall', params },
      });
      for (const call of params[0]) {
        if (call.methodName === 'event') {
          this.handleEvent(call.params);
        }
      }
      params[0].forEach(function (call) {
        console.log(' <', call.methodName, JSON.stringify(call.params));
      });
      callback(null, '');
    });
  }

  private createServer(): Promise<void> {
    // TODO: add configuration option
    const port = 2031;
    return new Promise((resolve) => {
      this.server = createServer({ host: '0.0.0.0', port }, () => {
        XmlRpcServer.logger.info('XML-RPC Server listening', { port });
        resolve();
      });
    });
  }

  private handleEvent(params: any[]) {
    const [interfaceId, channelAddress, key, value] = params;
    this.updateDevice(interfaceId, channelAddress, key, value);
  }

  private updateDevice(
    interfaceId: string,
    channelAddress: string,
    key: string,
    value: boolean | number
  ) {
    XmlRpcServer.logger.debug('Handling event...', {
      xmlRpc: { event: 'event', channelAddress, key, value },
    });
    const device = this.deviceRegistry.getDeviceForChannel(channelAddress);
    if (device == null) {
      XmlRpcServer.logger.debug(`Dismissing event for channel ${channelAddress}`);
      return;
    }
    device.updateValue(channelAddress, key, value);
  }
}
