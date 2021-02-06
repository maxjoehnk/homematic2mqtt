import { ProvideInterface, Singleton } from '../../ioc-container';
import { ApplicationInitializer } from '../../lifecycle/application-initializer';
import { Device } from '../../devices/device';
import { JsonDevicesApi } from './json/devices-api';
import { inject } from 'inversify';
import { Config, ConfigToken } from '../../config';
import { XmlRpcClient } from './xml/xml-rpc-client';
import { InterfacesApi, ParamsetKey } from './json/interfaces-api';
import { ChannelType } from './json/models/device-channel';
import { DeviceRegistry } from '../../devices/device-registry';
import { NativeDevice } from './native-device';

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
@ProvideInterface(DeviceRegistry)
export class NativeDeviceRegistry implements ApplicationInitializer, DeviceRegistry {
  private devices: NativeDevice[] = [];

  constructor(
    private devicesApi: JsonDevicesApi,
    @inject(ConfigToken) private config: Config,
    private xmlRpcClient: XmlRpcClient,
    private interfacesApi: InterfacesApi
  ) {}

  order = 2;

  async initialize(): Promise<void> {
    const devices = await this.fetchDevices();
    for (const device of devices) {
      const description = await this.interfacesApi.getDeviceDescription(
        device.interface,
        device.address
      );
      this.devices.push(new NativeDevice(device, description));
    }
    await this.fetchDeviceStates();
  }

  getDevices(): Device[] {
    return this.devices;
  }

  getDeviceForChannel(address: string): Device {
    return this.devices.find((d) => d.details.channels.some((c) => c.address === address));
  }

  private async fetchDevices() {
    const devices = await this.devicesApi.listAllDeviceDetails();

    const ignoredDevices = this.config.homematic.ignore || [];

    return devices.filter((d) => !ignoredDevices.includes(d.address));
  }

  private async fetchDeviceStates() {
    for (const device of this.devices) {
      await this.fetchDeviceState(device);
    }
  }

  private async fetchDeviceState(device: NativeDevice) {
    for (const channel of device.details.channels) {
      const state = await this.xmlRpcClient.getParamset(channel.address, ParamsetKey.Values);

      for (const key of Object.keys(state)) {
        device.updateValue(channel.address, key, state[key]);
      }
    }
    await this.fetchHeatingConfiguration(device);
  }

  private async fetchHeatingConfiguration(device: NativeDevice): Promise<void> {
    const heatingChannel = device.details.channels.find(
      (c) => c.channelType === ChannelType.HeatingClimateControlTransceiver
    );
    if (heatingChannel == null) {
      return;
    }
    const state = await this.xmlRpcClient.getParamset(heatingChannel.address, ParamsetKey.Master);

    for (const key of heatingParamsets) {
      device.updateValue(heatingChannel.address, key, state[key]);
    }
  }
}
