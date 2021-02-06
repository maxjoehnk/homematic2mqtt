import { ApplicationInitializer } from '../../lifecycle/application-initializer';
import { DeviceRegistry } from '../../devices/device-registry';
import { ProvideInterface, Singleton } from '../../ioc-container';
import { Device } from '../../devices/device';
import { JackDeviceResponse, JackRestClient } from './clients/jack-rest-client';
import { JackDevice } from './jack-device';
import { Config, ConfigToken } from '../../config';
import { inject } from 'inversify';

@Singleton()
@ProvideInterface(ApplicationInitializer)
@ProvideInterface(DeviceRegistry)
export class JackDeviceRegistry implements ApplicationInitializer, DeviceRegistry {
  private devices: JackDevice[] = [];

  order = 2;

  constructor(private restClient: JackRestClient, @inject(ConfigToken) private config: Config) {}

  async initialize(): Promise<void> {
    const devices = await this.fetchDevices();

    for (const device of devices) {
      const channels = await this.restClient.getChannels(device);
      this.devices.push(new JackDevice(device, channels));
    }
  }

  private async fetchDevices(): Promise<JackDeviceResponse[]> {
    const devices = await this.restClient.getDevices();

    const ignoredDevices = this.config.homematic.ignore || [];

    return devices.filter((d) => !ignoredDevices.includes(d.address));
  }

  getDevices(): Device[] {
    return this.devices;
  }

  getDeviceByAddress(address: string): Device {
    return this.devices.find((d) => d.address === address);
  }
}
