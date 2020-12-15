import { StateEnhancer } from './state-enhancer';
import { Provide, ProvideInterface } from '../../ioc-container';
import { ChannelType } from '../../homematic/json/models/device-channel';
import { Device } from '../../devices/device';

@Provide()
@ProvideInterface(StateEnhancer)
export class ContactStateEnhancer implements StateEnhancer {
  async enhance(device: Device, state: object): Promise<object> {
    if (
      !device.details.channels.some(
        (c) => c.channelType === ChannelType.ShutterContact
      )
    ) {
      return state;
    }

    const value = device.state.STATE;

    return {
      ...state,
      state: value === 1 ? 'on' : 'off',
    };
  }
}
