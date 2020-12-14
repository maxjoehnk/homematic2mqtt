import { StateEnhancer } from './state-enhancer';
import { Provide, ProvideInterface } from '../../ioc-container';
import { ChannelType } from '../../homematic/json/models/device-channel';
import { Device } from '../../devices/device';
import { HvacMode } from '../../mqtt/discovery/domains/hvac';

@Provide()
@ProvideInterface(StateEnhancer)
export class ThermostatStateEnhancer implements StateEnhancer {
  async enhance(device: Device, state: object): Promise<object> {
    if (
      !device.details.channels.some(
        (c) => c.channelType === ChannelType.HeatingClimateControlTransceiver
      )
    ) {
      return state;
    }

    const current_temperature = device.state.ACTUAL_TEMPERATURE;
    const target_temperature = device.state.SET_POINT_TEMPERATURE;
    const valve = device.state.LEVEL * 100;
    const mode = this.getMode(device);

    return {
      ...state,
      current_temperature,
      target_temperature:
        target_temperature === 4.5 ? null : target_temperature,
      valve,
      mode,
    };
  }

  private getMode(device: Device): HvacMode {
    if (device.state.SET_POINT_MODE === 1) {
      if (device.state.SET_POINT_TEMPERATURE === 4.5) {
        return HvacMode.Off;
      } else {
        return HvacMode.Heat;
      }
    } else {
      return HvacMode.Auto;
    }
  }
}
