import { Provide } from '../ioc-container';
import { Device } from './device';
import { HvacMode } from '../mqtt/discovery/domains/climate';
import { DeviceChannel, ChannelType } from './channels';
import { DeviceApi } from './device-api';

const OFF_VALUE = 4.5;

enum HeatingMode {
  Auto = 0,
  Manual = 1,
}

export class ClimateDevice {
  private heatingChannel: DeviceChannel;

  constructor(public device: Device, private deviceApi: DeviceApi) {
    this.heatingChannel = this.device.channels.find(
      (c) => c.type === ChannelType.HeatingClimateControlTransceiver
    );
  }

  get actualTemperature(): number {
    return this.device.state.ACTUAL_TEMPERATURE;
  }

  get targetTemperature(): number {
    return this.device.state.SET_POINT_TEMPERATURE;
  }

  get valve(): number {
    return this.device.state.LEVEL * 100;
  }

  get mode(): HvacMode {
    if (this.device.state.SET_POINT_MODE === HeatingMode.Manual) {
      if (this.targetTemperature === OFF_VALUE) {
        return HvacMode.Off;
      } else {
        return HvacMode.Heat;
      }
    } else {
      return HvacMode.Auto;
    }
  }

  async setTemperature(temperature: number) {
    await this.setDouble('SET_POINT_TEMPERATURE', temperature);
  }

  async setMode(mode: HvacMode) {
    switch (mode) {
      case HvacMode.Auto:
        await this.setValue('SET_POINT_MODE', HeatingMode.Auto);
        break;
      case HvacMode.Heat:
        await this.setValue('SET_POINT_MODE', HeatingMode.Manual);
        break;
      case HvacMode.Off:
        await this.setTemperature(OFF_VALUE);
        break;
    }
  }

  private setDouble(key: string, value: number): Promise<void> {
    return this.deviceApi.setDouble(
      this.device,
      this.heatingChannel.address,
      key,
      value
    );
  }

  private setValue(key: string, value: number): Promise<void> {
    return this.deviceApi.setValue(
      this.device,
      this.heatingChannel.address,
      key,
      value
    );
  }
}

@Provide()
export class ClimateDeviceFactory {
  constructor(private deviceApi: DeviceApi) {}

  getClimateDevice(device: Device) {
    return new ClimateDevice(device, this.deviceApi);
  }
}
