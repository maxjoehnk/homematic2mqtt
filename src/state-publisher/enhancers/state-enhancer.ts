import { Device } from '../../devices/device';

export abstract class StateEnhancer {
  abstract enhance(device: Device, state: object): Promise<object>;
}
