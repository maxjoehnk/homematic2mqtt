import { StateEnhancer } from './state-enhancer';
import { Provide, ProvideInterface } from '../../ioc-container';
import { Device } from '../../devices/device';
import { ClimateDeviceFactory } from '../../devices/climate-device';

@Provide()
@ProvideInterface(StateEnhancer)
export class ThermostatStateEnhancer implements StateEnhancer {
  constructor(private climateDeviceFactory: ClimateDeviceFactory) {}

  async enhance(device: Device, state: object): Promise<object> {
    if (!device.isClimate) {
      return state;
    }

    const climateDevice = this.climateDeviceFactory.getClimateDevice(device);

    return {
      ...state,
      current_temperature: climateDevice.actualTemperature,
      target_temperature: climateDevice.targetTemperature,
      // target_temperature === 4.5 ? null : target_temperature,
      valve: climateDevice.valve,
      mode: climateDevice.mode,
    };
  }
}
