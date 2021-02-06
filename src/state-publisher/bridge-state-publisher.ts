import { Provide, ProvideInterface } from '../ioc-container';
import { ApplicationInitializer } from '../lifecycle/application-initializer';
import { MqttConnection } from '../mqtt';
import { ApplicationFinalizer } from '../lifecycle/application-finalizer';

@Provide()
@ProvideInterface(ApplicationInitializer)
@ProvideInterface(ApplicationFinalizer)
export class BridgeStatePublisher implements ApplicationInitializer, ApplicationFinalizer {
  constructor(private mqtt: MqttConnection) {}

  order = 99;

  async initialize(): Promise<void> {
    await this.mqtt.publish('homematic2mqtt/bridge/availability', 'online');
  }

  async shutdown(): Promise<void> {
    await this.mqtt.publish('homematic2mqtt/bridge/availability', 'offline');
  }
}
