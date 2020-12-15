import { InterfacesApi } from '../homematic/json/interfaces-api';
import { XmlRpcClient } from '../homematic/xml/xml-rpc-client';
import { Provide } from '../ioc-container';
import { Device } from './device';
import {
  ChannelType,
  DeviceChannel,
} from '../homematic/json/models/device-channel';
import { HvacMode } from '../mqtt/discovery/domains/climate';

const OFF_VALUE = 4.5;

enum HeatingMode {
  Auto = 0,
  Manual = 1,
}

export class ClimateDevice {
  private heatingChannel: DeviceChannel;

  constructor(
    public device: Device,
    private interfacesApi: InterfacesApi,
    private xmlRpcClient: XmlRpcClient
  ) {
    this.heatingChannel = this.device.details.channels.find(
      (c) => c.channelType === ChannelType.HeatingClimateControlTransceiver
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
    await this.setValue('SET_POINT_TEMPERATURE', {
      explicitDouble: temperature,
    });
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

  private setValue(
    key: string,
    value: number | { explicitDouble: number }
  ): Promise<void> {
    return this.xmlRpcClient.setValue(this.heatingChannel.address, key, value);
  }
}

@Provide()
export class ClimateDeviceFactory {
  constructor(
    private interfacesApi: InterfacesApi,
    private xmlRpcClient: XmlRpcClient
  ) {}

  getClimateDevice(device: Device) {
    return new ClimateDevice(device, this.interfacesApi, this.xmlRpcClient);
  }
}
