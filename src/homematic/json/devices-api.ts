import { Provide } from '../../ioc-container';
import { JsonRpcClient } from './json-rpc-client';
import { AuthenticatedRequest, DeviceDetails } from './models';
import { methods } from './methods';
import { DeviceStatus } from './models/device-status';

@Provide()
export class DevicesApi {
  constructor(private rpc: JsonRpcClient) {}

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

  async listStatus(
    address: string,
    interfaceId: string,
    id: string
  ): Promise<DeviceStatus> {
    return await this.rpc.call(methods.deviceListStatus, {
      address,
      id,
      interface: interfaceId,
    });
  }
}
