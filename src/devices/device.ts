import { DeviceDetails } from '../homematic/json';

export class Device {
  private subscribers: (() => void)[] = [];
  private timerId = null;

  state: { [key: string]: any } = {};

  details: DeviceDetails;

  get id() {
    return this.details.id;
  }

  get name() {
    return this.details.name;
  }

  get address() {
    return this.details.address;
  }

  get interface(): string {
    return this.details.interface;
  }

  constructor(details: DeviceDetails) {
    this.details = details;
  }

  updateValue(channelAddress: string, key: string, value: number | boolean) {
    this.state[key] = value;
    this.callSubscribers();
  }

  subscribe(callback: () => void) {
    this.subscribers.push(callback);
  }

  callSubscribers() {
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
}
