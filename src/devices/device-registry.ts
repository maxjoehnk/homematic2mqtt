import { ApplicationInitializer } from '../application-initializer';
import { ProvideInterface, Singleton } from '../ioc-container';
import { DevicesApi } from '../homematic/json/devices-api';
import { Config, ConfigToken } from '../config';
import { inject } from 'inversify';
import { Device } from './device';
import { ParamsetKey } from '../homematic/json/interfaces-api';
import { ChannelType } from '../homematic/json/models/device-channel';
import { XmlRpcClient } from '../homematic/xml/xml-rpc-client';

const heatingParamsets = [
  'TEMPERATURE_MINIMUM',
  'TEMPERATURE_MAXIMUM',
  'TEMPERATURE_WINDOW_OPEN',
  'TEMPERATUREFALL_MODUS',
  'VALVE_ERROR_RUN_POSITION',
  'BUTTON_RESPONSE_WITHOUT_BACKLIGHT',
  'BOOST_POSITION',
  'VALVE_MAXIMUM_POSITION',
  'TEMPERATURE_OFFSET',
];

@Singleton()
@ProvideInterface(ApplicationInitializer)
export class DeviceRegistry implements ApplicationInitializer {
  private devices: Device[] = [];

  constructor(
    private devicesApi: DevicesApi,
    @inject(ConfigToken) private config: Config,
    private xmlRpcClient: XmlRpcClient
  ) {}

  order = 2;

  async initialize(): Promise<void> {
    const devices = await this.fetchDevices();
    this.devices = devices.map((details) => new Device(details));
    await this.fetchDeviceStates();
  }

  getDevices(): Device[] {
    return this.devices;
  }

  getDeviceForChannel(address: string): Device {
    return this.devices.find((d) =>
      d.details.channels.some((c) => c.address === address)
    );
  }

  private async fetchDevices() {
    const devices = await this.devicesApi.listAllDeviceDetails();

    const ignoredDevices = this.config.homematic.ignore || [];

    return devices.filter((d) => !ignoredDevices.includes(parseInt(d.id, 10)));
  }

  private async fetchDeviceStates() {
    for (const device of this.devices) {
      await this.fetchDeviceState(device);
    }
  }

  private async fetchDeviceState(device: Device) {
    for (const channel of device.details.channels) {
      const state = await this.xmlRpcClient.getParamset(
        channel.address,
        ParamsetKey.Values
      );

      for (const key of Object.keys(state)) {
        device.updateValue(channel.address, key, state[key]);
      }
    }
    await this.fetchHeatingConfiguration(device);
  }

  private async fetchHeatingConfiguration(device: Device): Promise<void> {
    const heatingChannel = device.details.channels.find(
      (c) => c.channelType === ChannelType.HeatingClimateControlTransceiver
    );
    if (heatingChannel == null) {
      return;
    }
    const state = await this.xmlRpcClient.getParamset(
      heatingChannel.address,
      ParamsetKey.Master
    );

    for (const key of heatingParamsets) {
      device.updateValue(heatingChannel.address, key, state[key]);
    }
  }
}
