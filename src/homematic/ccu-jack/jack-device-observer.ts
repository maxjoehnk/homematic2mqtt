import { ApplicationInitializer } from '../../lifecycle/application-initializer';
import { ProvideInterface, Singleton } from '../../ioc-container';
import { JackMqttClient } from './clients/jack-mqtt-client';
import { JackDeviceRegistry } from './jack-device-registry';
import { getLogger } from '../../logger';

@Singleton()
@ProvideInterface(ApplicationInitializer)
export class JackDeviceObserver implements ApplicationInitializer {
  private static readonly logger = getLogger();

  constructor(
    private mqttClient: JackMqttClient,
    private deviceRegistry: JackDeviceRegistry
  ) {}

  order = 50;

  async initialize(): Promise<void> {
    this.mqttClient.subscribe((topic, payload: JackStateMessage) => {
      const address = topic[2];
      const channelIndex = topic[3];
      const parameter = topic[4];

      const device = this.deviceRegistry.getDeviceByAddress(address);
      if (device == null) {
        JackDeviceObserver.logger.debug(
          'Discarding status change for unknown device',
          { address }
        );
        return;
      }
      device.updateValue(address, parameter, payload.v);
    });
  }
}
interface JackStateMessage {
  ts: number;
  v: boolean | number;
  s: number;
}
