import { Provide } from '../ioc-container';
import { MqttConnection } from '../mqtt';
import { DevicesApi } from '../homematic/json/devices-api';
import { DeviceStatePublisher } from './device-state-publisher';
import { Device } from '../devices/device';

@Provide()
export class DeviceStatePublisherFactory {
  constructor(private mqtt: MqttConnection, private devicesApi: DevicesApi) {}

  getPublisher(device: Device): DeviceStatePublisher {
    return new DeviceStatePublisher(device, this.mqtt, this.devicesApi);
  }
}
