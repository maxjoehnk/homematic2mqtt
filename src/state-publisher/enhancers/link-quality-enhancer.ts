import { StateEnhancer } from './state-enhancer';
import { Device } from '../../devices/device';
import { Provide, ProvideInterface } from '../../ioc-container';

@Provide()
@ProvideInterface(StateEnhancer)
export class LinkQualityStateEnhancer implements StateEnhancer {
  async enhance(device: Device, state: object): Promise<object> {
    return {
      ...state,
      rssi: device.state.RSSI_DEVICE,
    };
  }
}
