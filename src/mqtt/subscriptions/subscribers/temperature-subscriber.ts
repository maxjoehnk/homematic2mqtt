import { Subscriber } from '../subscriber';
import { Provide, ProvideInterface } from '../../../ioc-container';
import { SubscriberFactory } from '../subscriber-factory';
import { DeviceRegistry } from '../../../devices/device-registry';
import { ClimateDevice, ClimateDeviceFactory } from '../../../devices/climate-device';

export class TemperatureSubscriber implements Subscriber {
  constructor(private climateDevice: ClimateDevice) {}

  get topic() {
    return `homematic2mqtt/${this.climateDevice.device.name}/set/temperature`;
  }

  async receive(payload: string) {
    await this.climateDevice.setTemperature(parseFloat(payload));
  }
}

@Provide()
@ProvideInterface(SubscriberFactory)
export class TemperatureSubscriberFactory implements SubscriberFactory {
  constructor(
    private deviceRegistry: DeviceRegistry,
    private climateDeviceFactory: ClimateDeviceFactory
  ) {}

  getSubscribers(): Subscriber[] {
    const devices = this.deviceRegistry.getDevices();
    const climateDevices = devices.filter((d) => d.isClimate);

    return climateDevices.map((device) => {
      const climateDevice = this.climateDeviceFactory.getClimateDevice(device);
      return new TemperatureSubscriber(climateDevice);
    });
  }
}
