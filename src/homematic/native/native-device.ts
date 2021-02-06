import { Device } from '../../devices/device';
import { DeviceDetails } from './json';
import { DeviceChannel } from '../../devices/channels';
import { InterfaceDeviceDescription } from './json/models/interface-device-description';

export class NativeDevice extends Device {
  constructor(
    public details: DeviceDetails,
    private deviceDescription: InterfaceDeviceDescription
  ) {
    super();
  }

  get name() {
    return this.details.name;
  }

  get address(): string {
    return this.details.address;
  }

  get firmwareVersion(): string {
    return this.deviceDescription.firmware;
  }

  get interfaceType(): string {
    return this.details.interface;
  }

  get model(): string {
    return this.details.type;
  }

  get channels(): DeviceChannel[] {
    return this.details.channels.map((c) => ({
      type: c.channelType,
      address: c.address,
    }));
  }
}
