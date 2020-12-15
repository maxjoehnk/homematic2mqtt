import { ApplicationInitializer } from '../../lifecycle/application-initializer';
import { Provide, ProvideInterface } from '../../ioc-container';
import { multiInject } from 'inversify';
import { MqttConnection } from '../connection';
import { SubscriberFactory } from './subscriber-factory';
import { getLogger } from '../../logger';

@Provide()
@ProvideInterface(ApplicationInitializer)
export class SubscriptionManager implements ApplicationInitializer {
  private static readonly logger = getLogger();

  constructor(
    @multiInject(SubscriberFactory)
    private subscriberFactories: SubscriberFactory[],
    private mqtt: MqttConnection
  ) {}

  order = 99;

  async initialize(): Promise<void> {
    for (const factory of this.subscriberFactories) {
      const subscribers = factory.getSubscribers();
      for (const subscriber of subscribers) {
        await this.mqtt.on(subscriber.topic, (payload) =>
          (async () => {
            await subscriber.receive(payload);
          })().catch((err) =>
            SubscriptionManager.logger.error('Subscriber threw error', {
              error: err.message,
            })
          )
        );
      }
    }
  }
}
