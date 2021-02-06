import { connect, MqttClient } from 'mqtt';
import { Config, ConfigToken } from '../config';
import { inject } from 'inversify';
import { Singleton } from '../ioc-container';
import { getLogger } from '../logger';

@Singleton()
export class MqttConnection {
  private readonly logger = getLogger();
  private client: MqttClient;

  constructor(@inject(ConfigToken) private config: Config) {
    this.client = connect(`mqtt://${config.mqtt}`);
  }

  async publish(topic: string, message: any): Promise<void> {
    this.logger.debug('Publishing mqtt message', { topic });
    const payload = this.serializePayload(message);
    return new Promise((resolve, reject) => {
      this.client.publish(
        topic,
        payload,
        {
          retain: true,
        },
        (err) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        }
      );
    });
  }

  private serializePayload(message: any): string {
    if (typeof message === 'object') {
      return JSON.stringify(message);
    } else if (typeof message === 'string') {
      return message;
    }
    throw new Error(`No serializer for message type ${typeof message}: ${message}`);
  }

  async on(topic: string, callback: (payload: any) => void): Promise<void> {
    await this.subscribe(topic);
    this.client.on('message', (msgTopic, payload) => {
      if (topic !== msgTopic) {
        return;
      }
      this.logger.debug('Received mqtt message', { topic });
      const message = payload.toString();
      callback(message);
    });
  }

  private subscribe(topic: string): Promise<void> {
    this.logger.debug('Subscribing to mqtt topic', { topic });
    return new Promise((resolve, reject) => {
      this.client.subscribe(topic, (err) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  }
}
