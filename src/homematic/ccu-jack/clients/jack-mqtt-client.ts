import { ProvideInterface, Singleton } from '../../../ioc-container';
import { connect, MqttClient } from 'mqtt';
import { inject } from 'inversify';
import { Config, ConfigToken } from '../../../config';
import { ApplicationInitializer } from '../../../lifecycle/application-initializer';
import { getLogger } from '../../../logger';

@Singleton()
@ProvideInterface(ApplicationInitializer)
export class JackMqttClient implements ApplicationInitializer {
  private static readonly logger = getLogger();

  private client: MqttClient;

  constructor(@inject(ConfigToken) private config: Config) {}

  order = 2;

  async initialize(): Promise<void> {
    this.client = connect(
      `mqtt://${this.config.homematic.jack.ip}:${this.config.homematic.jack.mqttPort}`
    );
    this.client.subscribe('device/status/#');
  }

  subscribe(cb: (topic: string[], payload: unknown) => void) {
    this.client.on('message', (topic, payload) => {
      JackMqttClient.logger.debug('Received ccu-jack mqtt message', { topic });
      cb(topic.split('/'), JSON.parse(payload.toString()));
    });
  }
}
