import { StateEnhancer } from './state-enhancer';
import { DevicesApi } from '../../homematic/json/devices-api';
import { ChannelsApi } from '../../homematic/json/channels-api';
import { InterfacesApi } from '../../homematic/json/interfaces-api';
import { Provide, ProvideInterface } from '../../ioc-container';
import { ChannelType } from '../../homematic/json/models/device-channel';
import { Device } from '../../devices/device';

@Provide()
@ProvideInterface(StateEnhancer)
export class ContactStateEnhancer implements StateEnhancer {
  constructor(
    private deviceApi: DevicesApi,
    private channelsApi: ChannelsApi,
    private interfacesApi: InterfacesApi
  ) {}

  async enhance(device: Device, state: object): Promise<object> {
    if (
      !device.details.channels.some(
        (c) => c.channelType === ChannelType.ShutterContact
      )
    ) {
      return state;
    }

    const shutterChannel = device.details.channels.find(
      (c) => c.channelType === ChannelType.ShutterContact
    );

    const value = await this.channelsApi.getValue(shutterChannel.id);

    return {
      ...state,
      state: value === '1' ? 'on' : 'off',
    };
  }
}
