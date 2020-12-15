export abstract class ApplicationInitializer {
  abstract order: number;
  abstract initialize(): Promise<void>;
}
