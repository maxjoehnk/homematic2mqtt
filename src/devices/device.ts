import { ChannelType } from '../homematic/native/json/models/device-channel';
import { DeviceChannel } from './channels';

export abstract class Device {
  private subscribers: (() => void)[] = [];
  private timerId = null;

  state: { [key: string]: any } = {};

  /**
   * Name of the device
   */
  abstract get name(): string;

  /**
   * Address of the device
   *
   * Equal to the serial number
   */
  abstract get address(): string;

  /**
   * Connection type to CCU
   *
   * e.g. HmIP-RF for Wireless HomeMatic IP
   */
  abstract get interfaceType(): string;

  /**
   * Returns installed firmware version
   */
  abstract get firmwareVersion(): string;

  /**
   * Returns the device model
   */
  abstract get model(): string;

  abstract get channels(): DeviceChannel[];

  updateValue(channelAddress: string, key: string, value: number | boolean) {
    this.state[key] = value;
    this.callSubscribers();
  }

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
  }

  private callSubscribers() {
    if (this.timerId != null) {
      return;
    }
    this.timerId = setImmediate(() => {
      for (const subscriber of this.subscribers) {
        subscriber();
      }
      this.timerId = null;
    });
  }

  /**
   * Returns whether this is a climate device
   */
  get isClimate(): boolean {
    return this.channels.some(
      (c) => c.type === ChannelType.HeatingClimateControlTransceiver
    );
  }
}
