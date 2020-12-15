import { MqttConnection } from '../../connection';
import { BaseDiscoveryModel } from '../domains/base';
import { getLogger } from '../../../logger';
import { InterfacesApi } from '../../../homematic/json/interfaces-api';
import { InterfaceDeviceDescription } from '../../../homematic/json/models/interface-device-description';
import { injectable } from 'inversify';
import { SensorDiscoveryModel } from '../domains/sensor';
import { BinaryDeviceClass } from '../domains/device_class';
import { SensorDeviceClass } from '../domains/sensor_device_class';
import { BinarySensorDiscoveryModel } from '../domains/binary_sensor';
import { Device } from '../../../devices/device';

@injectable()
export abstract class DeviceAnnouncer {
  private static readonly logger = getLogger();

  constructor(
    private mqtt: MqttConnection,
    private interfacesApi: InterfacesApi
  ) {}

  async announce(device: Device): Promise<void> {
    const description = await this.interfacesApi.getDeviceDescription(
      device.interface,
      device.address
    );
    const base = this.getBaseModel(device, description);
    const entities = this.getEntities(base, device);

    DeviceAnnouncer.logger.debug('Announcing device', {
      discoveryModels: entities,
    });

    for (const entity of entities) {
      await this.mqtt.publish(
        `homeassistant/${entity.domain}/${device.address}/${entity.topic}/config`,
        entity.config
      );
    }
  }

  getEntities(base: BaseDiscoveryModel, device: Device): EntityConfiguration[] {
    const domainEntities = this.getDomainEntities(base, device);
    const batteryEntity: EntityConfiguration = {
      domain: 'sensor',
      topic: 'battery',
      config: this.getBatteryEntity(base, device),
    };
    const linkEntity: EntityConfiguration = {
      domain: 'sensor',
      topic: 'linkquality',
      config: this.getLinkQualityEntity(base, device),
    };
    const voltageEntity: EntityConfiguration = {
      domain: 'sensor',
      topic: 'voltage',
      config: this.getVoltageEntity(base, device),
    };

    return [...domainEntities, batteryEntity, linkEntity, voltageEntity];
  }

  abstract getDomainEntities(
    base: BaseDiscoveryModel,
    device: Device
  ): EntityConfiguration[];

  private getBaseModel(
    device: Device,
    description: InterfaceDeviceDescription
  ): BaseDiscoveryModel {
    return {
      device: {
        name: device.name,
        identifiers: [device.address],
        model: device.details.type,
        manufacturer: 'Homematic',
        sw_version: description.firmware,
      },
      availability: [
        {
          topic: `homematic2mqtt/${device.name}/availability`,
        },
        {
          topic: 'homematic2mqtt/bridge/availability',
        },
      ],
    };
  }

  private getBatteryEntity(
    base: BaseDiscoveryModel,
    device: Device
  ): SensorDiscoveryModel {
    return {
      ...base,
      device_class: SensorDeviceClass.Battery,
      unit_of_measurement: '%',
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.battery }}',
      name: `${base.device.name} Battery`,
      unique_id: `${device.address}_battery_homematic2mqtt`,
    };
  }

  private getVoltageEntity(
    base: BaseDiscoveryModel,
    device: Device
  ): SensorDiscoveryModel {
    return {
      ...base,
      device_class: SensorDeviceClass.Voltage,
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.voltage }}',
      name: `${device.name} Voltage`,
      unique_id: `${device.address}_voltage_homematic2mqtt`,
    };
  }

  private getLinkQualityEntity(
    base: BaseDiscoveryModel,
    device: Device
  ): SensorDiscoveryModel {
    return {
      ...base,
      device_class: SensorDeviceClass.SignalStrength,
      state_topic: this.getTopic(device),
      json_attributes_topic: this.getTopic(device),
      value_template: '{{ value_json.rssi }}',
      name: `${base.device.name} Rssi`,
      unit_of_measurement: 'dBm',
      unique_id: `${device.address}_linkquality_homematic2mqtt`,
    };
  }

  protected getTopic(device: Device) {
    return `homematic2mqtt/${device.name}`;
  }
}

export interface EntityConfiguration {
  domain: string;
  config: BaseDiscoveryModel;
  topic: string;
}
