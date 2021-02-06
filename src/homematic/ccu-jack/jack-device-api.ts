import { DeviceApi, DeviceStatus } from '../../devices/device-api';
import { Device } from '../../devices/device';
import { Provide, ProvideInterface } from '../../ioc-container';
import { JackRestClient } from './clients/jack-rest-client';
import { JackDevice } from './jack-device';

@Provide()
@ProvideInterface(DeviceApi)
export class JackDeviceApi implements DeviceApi {
  constructor(private client: JackRestClient) {}

  async getDeviceStatus(device: Device): Promise<DeviceStatus> {
    return device.state as DeviceStatus;
  }

  setDouble(
    device: JackDevice,
    channelAddress: string,
    property: string,
    value: number
  ): Promise<void> {
    return this.setValue(device, channelAddress, property, value);
  }

  async setValue(
    device: JackDevice,
    channelAddress: string,
    property: string,
    value: number
  ): Promise<void> {
    const channel = device.channelDefinitions.find(
      (c) => c.address === channelAddress
    );
    await this.client.writeProperty(
      `device/${device.address}/${channel.index}/${property}`,
      value
    );
  }
}
