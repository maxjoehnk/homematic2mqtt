import './enhancers';
import { MqttConnection } from '../mqtt';
import { DevicesApi } from '../homematic/json/devices-api';
import { DeviceStatus } from '../homematic/json/models/device-status';
import { defaultContainer } from '../ioc-container';
import { Device } from '../devices/device';
import { StateEnhancer } from './enhancers/state-enhancer';

export class DeviceStatePublisher {
  constructor(
    private device: Device,
    private mqtt: MqttConnection,
    private devicesApi: DevicesApi
  ) {
    this.device.subscribe(() => this.publishState());
  }

  async publishState() {
    const status = await this.devicesApi.listStatus(
      this.device.address,
      this.device.interface,
      this.device.id
    );

    await this.publishAvailability(status);
    const enhancers: StateEnhancer[] = defaultContainer.getAll(StateEnhancer);
    let state = {};

    for (const enhancer of enhancers) {
      state = await enhancer.enhance(this.device, state);
    }

    await this.mqtt.publish(`homematic2mqtt/${this.device.name}`, state);
  }

  private async publishAvailability(status: DeviceStatus) {
    const online = status.UNREACH === '0';
    await this.mqtt.publish(
      `homematic2mqtt/${this.device.name}/availability`,
      online ? 'online' : 'offline'
    );
  }
}
