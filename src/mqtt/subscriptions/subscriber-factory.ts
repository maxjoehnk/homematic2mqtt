import { Subscriber } from './subscriber';

export abstract class SubscriberFactory {
  abstract getSubscribers(): Subscriber[];
}
