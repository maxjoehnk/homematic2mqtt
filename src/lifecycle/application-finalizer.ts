export abstract class ApplicationFinalizer {
  abstract shutdown(): Promise<void>;
}
