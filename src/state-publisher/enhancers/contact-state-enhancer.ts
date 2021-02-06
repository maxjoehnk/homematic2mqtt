import { StateEnhancer } from './state-enhancer';
import { Provide, ProvideInterface } from '../../ioc-container';
import { Device } from '../../devices/device';
import { ChannelType } from '../../devices/channels';
import { ContactDeviceState } from '../../devices/device-api';

@Provide()
@ProvideInterface(StateEnhancer)
export class ContactStateEnhancer implements StateEnhancer {
  async enhance(device: Device, state: object): Promise<object> {
    if (!device.channels.some((c) => c.type === ChannelType.ShutterContact)) {
      return state;
    }

    const contactState = device.state as ContactDeviceState;

    const value = contactState.STATE;

    return {
      ...state,
      state: value === 1 ? 'ON' : 'OFF',
    };
  }
}
