export interface Subscriber {
  topic: string;

  receive(payload: any): Promise<void>;
}
