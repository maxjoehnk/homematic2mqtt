import { BaseDiscoveryModel } from './base';
import { BinaryDeviceClass } from './device_class';

export interface BinarySensorDiscoveryModel extends BaseDiscoveryModel {
  device_class?: BinaryDeviceClass;
  expire_after?: number;
  force_update?: boolean;
  json_attributes_template?: string;
  json_attributes_topic?: string;
  name?: string;
  off_delay?: number;
  payload_available?: string;
  payload_not_available?: string;
  payload_off?: string;
  payload_on?: string;
  qos?: number;
  state_topic: string;
  unique_id?: string;
  value_template?: string;
}
