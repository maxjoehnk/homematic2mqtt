import { ApplicationInitializer } from '../../application-initializer';
import { ProvideInterface, Singleton } from '../../ioc-container';
import { getLogger } from '../../logger';
import { inject } from 'inversify';
import { Config, ConfigToken } from '../../config';
import { createClient } from 'homematic-xmlrpc';
import { ParamsetKey } from '../json/interfaces-api';

@Singleton()
@ProvideInterface(ApplicationInitializer)
export class XmlRpcClient implements ApplicationInitializer {
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
    this.setupShutdownListener();
  }

  getParamset(address: string, paramsetKey: ParamsetKey): Promise<any> {
    return this.call('getParamset', [address, paramsetKey]);
  }

  private init(): Promise<void> {
    return this.call('init', [this.getUrl(), 'homematic2mqtt']);
  }

  private setupShutdownListener() {
    process.on('SIGINT', () => {
      this.call('init', [this.getUrl(), ''])
        .catch((err) => {
          XmlRpcClient.logger.error('Unregistering of rpc server failed', {
            error: err,
          });
          process.exit(1);
        })
        .then(() => process.exit(0));
    });
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
