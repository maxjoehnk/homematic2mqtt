import { Device } from '../../devices/device';
import {
  JackChannelResponse,
  JackDeviceResponse,
} from './clients/jack-rest-client';
import { ChannelType, DeviceChannel } from '../../devices/channels';

export class JackDevice extends Device {
  constructor(
    private jackDevice: JackDeviceResponse,
    public channelDefinitions: JackChannelResponse[]
  ) {
    super();
  }

  get address() {
    return this.jackDevice.address;
  }

  get channels(): DeviceChannel[] {
    return this.channelDefinitions.map((c) => ({
      type: c.type as ChannelType,
      address: c.address,
    }));
  }

  get firmwareVersion(): string {
    return this.jackDevice.firmware;
  }

  get interfaceType(): string {
    return this.jackDevice.interfaceType;
  }

  get model(): string {
    return this.jackDevice.type;
  }

  get name() {
    return this.jackDevice.title;
  }
}
