import { Provide } from '../ioc-container';
import { MqttConnection } from '../mqtt';
import { DeviceStatePublisher } from './device-state-publisher';
import { Device } from '../devices/device';
import { DeviceApi } from '../devices/device-api';

@Provide()
export class DeviceStatePublisherFactory {
  constructor(private mqtt: MqttConnection, private devicesApi: DeviceApi) {}

  getPublisher(device: Device): DeviceStatePublisher {
    return new DeviceStatePublisher(device, this.mqtt, this.devicesApi);
  }
}
