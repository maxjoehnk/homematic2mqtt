import { BaseDiscoveryModel } from './base';
import { BinaryDeviceClass } from './device_class';
import { SensorDeviceClass } from './sensor_device_class';

export interface SensorDiscoveryModel extends BaseDiscoveryModel {
  device_class?: SensorDeviceClass;
  expire_after?: number;
  force_update?: boolean;
  icon?: string;
  json_attributes_template?: string;
  json_attributes_topic?: string;
  name?: string;
  payload_available?: string;
  payload_not_available?: string;
  qos?: number;
  state_topic: string;
  unique_id?: string;
  unit_of_measurement?: string;
  value_template?: string;
}
