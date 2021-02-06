import { Provide } from '../../../ioc-container';
import { JsonRpcClient } from './json-rpc-client';
import { AuthenticatedRequest, DeviceDetails } from './models';
import { methods } from './methods';

@Provide()
export class ChannelsApi {
  constructor(private rpc: JsonRpcClient) {}

  async getValue(id: string): Promise<string> {
    return await this.rpc.call(methods.channelGetValue, { id });
  }
}
