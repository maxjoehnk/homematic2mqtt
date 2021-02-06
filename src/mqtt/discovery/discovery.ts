import { Provide, ProvideInterface } from '../../ioc-container';
import { AnnouncerFactory } from './announcer';
import { ApplicationInitializer } from '../../lifecycle/application-initializer';
import { DeviceRegistry } from '../../devices/device-registry';

@Provide()
@ProvideInterface(ApplicationInitializer)
export class HomeassistantDiscovery implements ApplicationInitializer {
  constructor(private announcerFactory: AnnouncerFactory, private deviceRegistry: DeviceRegistry) {}

  order = 99;

  async initialize(): Promise<void> {
    const devices = await this.deviceRegistry.getDevices();

    for (const device of devices) {
      const announcer = this.announcerFactory.getAnnouncer(device);
      await announcer.announce(device);
    }
  }
}
