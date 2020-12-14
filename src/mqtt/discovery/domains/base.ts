import { Device } from './device';

export interface BaseDiscoveryModel {
  availability?: AvailabilityModel[];
  availability_topic?: string;
  device?: Device;
}

export interface AvailabilityModel {
  payload_available?: string;
  payload_not_available?: string;
  topic: string;
}
