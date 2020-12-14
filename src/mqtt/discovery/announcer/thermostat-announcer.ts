import { DeviceAnnouncer, EntityConfiguration } from './device-announcer';
import { BaseDiscoveryModel } from '../domains/base';
import { HvacDiscoveryModel, HvacMode } from '../domains/hvac';
import { Provide } from '../../../ioc-container';
import { MqttConnection } from '../../connection';
import { InterfacesApi } from '../../../homematic/json/interfaces-api';
import { SensorDiscoveryModel } from '../domains/sensor';
import { SensorDeviceClass } from '../domains/sensor_device_class';
import { Device } from '../../../devices/device';

@Provide()
export class ThermostatAnnouncer extends DeviceAnnouncer {
  static supportsDevice(device: Device): boolean {
    return device.details.type === 'HmIP-eTRV-2';
  }

  constructor(mqtt: MqttConnection, interfacesApi: InterfacesApi) {
    super(mqtt, interfacesApi);
  }

  getDomainEntities(
    base: BaseDiscoveryModel,
    device: Device
  ): EntityConfiguration[] {
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

  private getHvacEntity(
    base: BaseDiscoveryModel,
    device: Device
  ): HvacDiscoveryModel {
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
      min_temp: device.state.TEMPERATURE_MINIMUM,
      max_temp: device.state.TEMPERATURE_MAXIMUM,
    };
  }

  private getTemperatureEntity(
    base: BaseDiscoveryModel,
    device: Device
  ): SensorDiscoveryModel {
    return {
      ...base,
      name: `${base.device.name} Current Temperature`,
      device_class: SensorDeviceClass.Temperature,
      unit_of_measurement: '°C',
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.current_temperature }}',
      unique_id: `${device.address}_current_temperature_homematic2mqtt`,
    };
  }

  private getValveEntity(
    base: BaseDiscoveryModel,
    device: Device
  ): SensorDiscoveryModel {
    return {
      ...base,
      name: `${device.name} Valve`,
      unit_of_measurement: '%',
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.valve }}',
      unique_id: `${device.address}_valve_homematic2mqtt`,
    };
  }
}
