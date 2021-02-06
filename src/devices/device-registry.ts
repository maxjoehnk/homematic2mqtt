import { Device } from './device';

export abstract class DeviceRegistry {
  abstract getDevices(): Device[];
}
