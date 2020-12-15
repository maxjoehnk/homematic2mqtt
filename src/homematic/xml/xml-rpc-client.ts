import { ApplicationInitializer } from '../../lifecycle/application-initializer';
import { ProvideInterface, Singleton } from '../../ioc-container';
import { getLogger } from '../../logger';
import { inject } from 'inversify';
import { Config, ConfigToken } from '../../config';
import { createClient } from 'homematic-xmlrpc';
import { ParamsetKey } from '../json/interfaces-api';
import { ApplicationFinalizer } from '../../lifecycle/application-finalizer';

@Singleton()
@ProvideInterface(ApplicationInitializer)
@ProvideInterface(ApplicationFinalizer)
export class XmlRpcClient
  implements ApplicationInitializer, ApplicationFinalizer {
  private static readonly logger = getLogger();
  private client;

  constructor(@inject(ConfigToken) private config: Config) {
    this.client = createClient({
      host: config.homematic.xml.interfaces.ip.host,
      port: config.homematic.xml.interfaces.ip.port,
    });
  }

  order = 2;

  async initialize(): Promise<void> {
    await this.init();
  }

  async shutdown(): Promise<void> {
    if (this.client == null) {
      return;
    }
    await this.call('init', [this.getUrl(), '']);
  }

  getParamset(address: string, paramsetKey: ParamsetKey): Promise<any> {
    return this.call('getParamset', [address, paramsetKey]);
  }

  setValue(address: string, valueKey: string, value: any): Promise<any> {
    return this.call('setValue', [address, valueKey, value]);
  }

  private init(): Promise<void> {
    return this.call('init', [this.getUrl(), 'homematic2mqtt']);
  }

  private call<TResponse>(
    method: string,
    params: string[]
  ): Promise<TResponse> {
    return new Promise((resolve, reject) => {
      XmlRpcClient.logger.debug('Calling xml-rpc method', {
        xmlRpc: { method, params },
      });
      this.client.methodCall(method, params, (err, res) => {
        if (err) {
          return reject(err);
        }
        return resolve(res);
      });
    });
  }

  private getUrl(): string {
    return `xmlrpc://${this.config.homematic.xml.local_ip}:2031`;
  }
}
