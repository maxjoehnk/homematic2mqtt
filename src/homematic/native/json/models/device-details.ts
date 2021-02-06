import { JsonDeviceChannel } from './device-channel';

export interface DeviceDetails {
  id: string;
  name: string;
  address: string;
  interface: string;
  type: string;
  operateGroupOnly: string;
  isReady: string;
  enabledServiceMsg: string;
  channels: JsonDeviceChannel[];
}
