import { DeviceAnnouncer, EntityConfiguration } from './device-announcer';
import { BinarySensorDiscoveryModel } from '../domains/binary_sensor';
import { BinaryDeviceClass } from '../domains/device_class';
import { BaseDiscoveryModel } from '../domains/base';
import { Provide } from '../../../ioc-container';
import { MqttConnection } from '../../connection';
import { Device } from '../../../devices/device';

@Provide()
export class WindowContactAnnouncer extends DeviceAnnouncer {
  static supportsDevice(device: Device): boolean {
    return device.model === 'HMIP-SWDO';
  }

  constructor(mqtt: MqttConnection) {
    super(mqtt);
  }

  getDomainEntities(base: BaseDiscoveryModel, device: Device): EntityConfiguration[] {
    return [
      {
        domain: 'binary_sensor',
        topic: 'contact',
        config: this.getContactEntity(base, device),
      },
    ];
  }

  private getContactEntity(base: BaseDiscoveryModel, device: Device): BinarySensorDiscoveryModel {
    return {
      ...base,
      device_class: BinaryDeviceClass.Window,
      name: base.device.name,
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.state }}',
      unique_id: `${device.address}_contact_homematic2mqtt`,
    };
  }
}
