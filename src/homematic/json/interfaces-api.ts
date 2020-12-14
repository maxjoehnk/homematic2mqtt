import { Provide } from '../../ioc-container';
import { JsonRpcClient } from './json-rpc-client';
import { AuthenticatedRequest, DeviceDetails } from './models';
import { methods } from './methods';
import { Interface } from './models/interface';
import { InterfaceDevice } from './models/interface-device';
import { InterfaceDeviceDescription } from './models/interface-device-description';

export enum ParamsetKey {
  Master = 'MASTER',
  Values = 'VALUES',
}

@Provide()
export class InterfacesApi {
  constructor(private rpc: JsonRpcClient) {}

  async listDevices(interfaceId: string): Promise<InterfaceDevice[]> {
    return await this.rpc.call(methods.interfaceListDevices, {
      interface: interfaceId,
    });
  }

  async listInterfaces(): Promise<Interface[]> {
    return await this.rpc.call(methods.interfaceListInterfaces);
  }

  async getDeviceDescription(
    interfaceId: string,
    address: string
  ): Promise<InterfaceDeviceDescription> {
    return await this.rpc.call(methods.interfaceGetDeviceDescription, {
      interface: interfaceId,
      address,
    });
  }

  async getParamset(
    interfaceId: string,
    address: string,
    paramsetKey: ParamsetKey
  ): Promise<any> {
    return await this.rpc.call(methods.interfaceGetParamset, {
      interface: interfaceId,
      address,
      paramsetKey,
    });
  }
}
