import { DeviceAnnouncer, EntityConfiguration } from './device-announcer';
import { BaseDiscoveryModel } from '../domains/base';
import { ClimateDiscoveryModel, HvacMode } from '../domains/climate';
import { Provide } from '../../../ioc-container';
import { MqttConnection } from '../../connection';
import { SensorDiscoveryModel } from '../domains/sensor';
import { SensorDeviceClass } from '../domains/sensor_device_class';
import { Device } from '../../../devices/device';
import { SensorStateClass } from '../domains/sensor_state_class';

@Provide()
export class ClimateAnnouncer extends DeviceAnnouncer {
  static supportsDevice(device: Device): boolean {
    return device.model === 'HmIP-eTRV-2';
  }

  constructor(mqtt: MqttConnection) {
    super(mqtt);
  }

  getDomainEntities(base: BaseDiscoveryModel, device: Device): EntityConfiguration[] {
    return [
      {
        domain: 'climate',
        topic: 'state',
        config: this.getHvacEntity(base, device),
      },
      {
        domain: 'sensor',
        topic: 'current_temperature',
        config: this.getTemperatureEntity(base, device),
      },
      {
        domain: 'sensor',
        topic: 'valve',
        config: this.getValveEntity(base, device),
      },
    ];
  }

  private getHvacEntity(base: BaseDiscoveryModel, device: Device): ClimateDiscoveryModel {
    return {
      ...base,
      name: base.device.name,
      unique_id: `${device.address}_climate_homematic2mqtt`,
      modes: [HvacMode.Off, HvacMode.Auto, HvacMode.Heat],
      json_attributes_topic: this.getTopic(device),
      temperature_state_topic: this.getTopic(device),
      temperature_state_template: '{{ value_json.target_temperature }}',
      mode_state_topic: this.getTopic(device),
      mode_state_template: '{{ value_json.mode }}',
      mode_command_topic: `${this.getTopic(device)}/set/mode`,
      temperature_command_topic: `${this.getTopic(device)}/set/temperature`,
      min_temp: device.state.TEMPERATURE_MINIMUM,
      max_temp: device.state.TEMPERATURE_MAXIMUM,
      temp_step: 0.5,
    };
  }

  private getTemperatureEntity(base: BaseDiscoveryModel, device: Device): SensorDiscoveryModel {
    return {
      ...base,
      name: `${base.device.name} Current Temperature`,
      device_class: SensorDeviceClass.Temperature,
      state_class: SensorStateClass.Measurement,
      unit_of_measurement: '°C',
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.current_temperature }}',
      unique_id: `${device.address}_current_temperature_homematic2mqtt`,
    };
  }

  private getValveEntity(base: BaseDiscoveryModel, device: Device): SensorDiscoveryModel {
    return {
      ...base,
      name: `${device.name} Valve`,
      state_class: SensorStateClass.Measurement,
      unit_of_measurement: '%',
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.valve }}',
      unique_id: `${device.address}_valve_homematic2mqtt`,
    };
  }
}
