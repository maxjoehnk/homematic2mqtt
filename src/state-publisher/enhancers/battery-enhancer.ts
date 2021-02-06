import { StateEnhancer } from './state-enhancer';
import { Device } from '../../devices/device';
import { Provide, ProvideInterface } from '../../ioc-container';

const deviceVoltageConfigurations = new Map<string[], number>();
deviceVoltageConfigurations.set(['HmIP-eTRV-2'], 3);
deviceVoltageConfigurations.set(['HMIP-SWDO'], 1.5);

@Provide()
@ProvideInterface(StateEnhancer)
export class BatteryStateEnhancer implements StateEnhancer {
  async enhance(device: Device, state: object): Promise<object> {
    const maxVoltage = this.getMaxVoltage(device);
    const currentVoltage = device.state.OPERATING_VOLTAGE;

    const batteryPercent = this.getBatteryPercent(maxVoltage, currentVoltage);

    return {
      ...state,
      battery: batteryPercent,
      voltage: device.state.OPERATING_VOLTAGE,
    };
  }

  private getMaxVoltage(device: Device): number {
    for (let [deviceTypes, value] of deviceVoltageConfigurations) {
      if (deviceTypes.some((deviceType) => device.model === deviceType)) {
        return value;
      }
    }
    return NaN;
  }

  private getBatteryPercent(maxVoltage: number, currentVoltage) {
    if (isNaN(maxVoltage)) {
      return null;
    }
    const percent = currentVoltage / maxVoltage;

    return Math.round(percent * 100);
  }
}

function toState(state: boolean): string {
  if (state) {
    return 'on';
  }
  return 'off';
}
