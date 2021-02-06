import './enhancers';
import { MqttConnection } from '../mqtt';
import { defaultContainer } from '../ioc-container';
import { Device } from '../devices/device';
import { StateEnhancer } from './enhancers/state-enhancer';
import { DeviceApi, DeviceStatus } from '../devices/device-api';

export class DeviceStatePublisher {
  constructor(
    private device: Device,
    private mqtt: MqttConnection,
    private devicesApi: DeviceApi
  ) {
    this.device.subscribe(() => this.publishState());
  }

  async publishState() {
    const status = await this.devicesApi.getDeviceStatus(this.device);

    await this.publishAvailability(status);
    const enhancers: StateEnhancer[] = defaultContainer.getAll(StateEnhancer);
    let state = {};

    for (const enhancer of enhancers) {
      state = await enhancer.enhance(this.device, state);
    }

    await this.mqtt.publish(`homematic2mqtt/${this.device.name}`, state);
  }

  private async publishAvailability(status: DeviceStatus) {
    const online = !status.UNREACH;
    await this.mqtt.publish(
      `homematic2mqtt/${this.device.name}/availability`,
      online ? 'online' : 'offline'
    );
  }
}
