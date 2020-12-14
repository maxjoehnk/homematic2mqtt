import { ChannelType } from './device-channel';

export interface InterfaceDevice {
  type: ChannelType | string;
  address: string;
  paramsets: string[];
  version: number;
  flags: number;
  children: string[];
  firmware: string;
  availableFirmware: string;
  updatable: string;
  firmwareUpdateState: string;
  interface: string;
  roaming: boolean;
}
