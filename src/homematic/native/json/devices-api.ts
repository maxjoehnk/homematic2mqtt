import { Provide, ProvideInterface } from '../../../ioc-container';
import { JsonRpcClient } from './json-rpc-client';
import { AuthenticatedRequest, DeviceDetails } from './models';
import { methods } from './methods';
import { JsonDeviceStatus } from './models/device-status';
import { DeviceApi, DeviceStatus } from '../../../devices/device-api';
import { Device } from '../../../devices/device';
import { NativeDevice } from '../native-device';
import { XmlRpcClient } from '../xml/xml-rpc-client';

@Provide()
@ProvideInterface(DeviceApi)
export class JsonDevicesApi implements DeviceApi {
  constructor(private rpc: JsonRpcClient, private xmlRpcClient: XmlRpcClient) {}

  async listAllDevices(): Promise<string[]> {
    return await this.rpc.call<AuthenticatedRequest, string[]>(
      methods.deviceListAll
    );
  }

  async listAllDeviceDetails(): Promise<DeviceDetails[]> {
    return await this.rpc.call<AuthenticatedRequest, DeviceDetails[]>(
      methods.deviceListAllDetail
    );
  }

  async listStatus(device: NativeDevice): Promise<JsonDeviceStatus> {
    return await this.rpc.call(methods.deviceListStatus, {
      address: device.address,
      id: device.details.id,
      interface: device.details.interface,
    });
  }

  async getDeviceStatus(device: Device): Promise<DeviceStatus> {
    const status = await this.listStatus(device as NativeDevice);

    return {
      OPERATING_VOLTAGE_STATUS: parseInt(status.OPERATING_VOLTAGE_STATUS, 10),
      RSSI_DEVICE: parseInt(status.RSSI_DEVICE, 10),
      LOW_BAT: status.LOW_BAT === '1',
      UNREACH: status.UNREACH === '1',
      CONFIG_PENDING: status.CONFIG_PENDING === '1',
      DUTY_CYCLE: status.DUTY_CYCLE === '1',
      OPERATING_VOLTAGE: parseFloat(status.OPERATING_VOLTAGE),
    } as DeviceStatus;
  }

  setDouble(
    device: Device,
    channelAddress: string,
    property: string,
    value: number
  ) {
    return this.xmlRpcClient.setValue(channelAddress, property, {
      explicitDouble: value,
    });
  }

  setValue(
    device: Device,
    channelAddress: string,
    property: string,
    value: number
  ) {
    return this.xmlRpcClient.setValue(channelAddress, property, value);
  }
}
