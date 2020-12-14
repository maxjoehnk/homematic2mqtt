import { ApplicationInitializer } from '../application-initializer';
import { Provide, ProvideInterface } from '../ioc-container';
import { DeviceStatePublisherFactory } from './factory';
import { DeviceStatePublisher } from './device-state-publisher';
import { DeviceRegistry } from '../devices/device-registry';
import { InterfacesApi } from '../homematic/json/interfaces-api';

@Provide()
@ProvideInterface(ApplicationInitializer)
export class StatePublisher implements ApplicationInitializer {
  private publishers: DeviceStatePublisher[] = [];

  constructor(
    private deviceRegistry: DeviceRegistry,
    private factory: DeviceStatePublisherFactory
  ) {}

  order = 99;

  async initialize(): Promise<void> {
    const devices = await this.deviceRegistry.getDevices();

    for (const device of devices) {
      const publisher = this.factory.getPublisher(device);
      this.publishers.push(publisher);
    }

    await this.publishAll();
  }

  private async publishAll() {
    for (const publisher of this.publishers) {
      await publisher.publishState();
    }
  }
}
