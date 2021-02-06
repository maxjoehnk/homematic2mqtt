import { Subscriber } from '../subscriber';
import { HvacMode } from '../../discovery/domains/climate';
import { Provide, ProvideInterface } from '../../../ioc-container';
import { DeviceRegistry } from '../../../devices/device-registry';
import { SubscriberFactory } from '../subscriber-factory';
import { ClimateDevice, ClimateDeviceFactory } from '../../../devices/climate-device';

export class ClimateModeSubscriber implements Subscriber {
  constructor(private climateDevice: ClimateDevice) {}

  get topic() {
    return `homematic2mqtt/${this.climateDevice.device.name}/set/mode`;
  }

  async receive(payload: HvacMode) {
    await this.climateDevice.setMode(payload);
  }
}

@Provide()
@ProvideInterface(SubscriberFactory)
export class ClimateModeSubscriberFactory implements SubscriberFactory {
  constructor(
    private deviceRegistry: DeviceRegistry,
    private climateDeviceFactory: ClimateDeviceFactory
  ) {}

  getSubscribers(): Subscriber[] {
    const devices = this.deviceRegistry.getDevices();
    const climateDevices = devices.filter((d) => d.isClimate);

    return climateDevices.map((device) => {
      const climateDevice = this.climateDeviceFactory.getClimateDevice(device);
      return new ClimateModeSubscriber(climateDevice);
    });
  }
}
