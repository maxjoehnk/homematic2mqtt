import 'reflect-metadata';
import './mqtt';
import './state-publisher/state-publisher';
import './state-publisher/bridge-state-publisher';
import loadNative from './homematic/native';
import loadCcuJack from './homematic/ccu-jack';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { Config, ConfigToken } from './config';
import { defaultContainer } from './ioc-container';
import { ApplicationInitializer } from './lifecycle/application-initializer';
import { ApplicationFinalizer } from './lifecycle/application-finalizer';

const configContent = readFileSync('config.yml', 'utf8');
const config: Config = safeLoad(configContent);

defaultContainer.bind(ConfigToken).toConstantValue(config);

async function main() {
  if (config.homematic.jack != null) {
    await loadCcuJack();
  } else {
    await loadNative();
  }
  const initializers = defaultContainer.getAll(ApplicationInitializer);
  initializers.sort((a, b) => a.order - b.order);
  for (const initializer of initializers) {
    await initializer.initialize();
  }
}

process.on('SIGINT', () => {
  (async () => {
    const finalizers = defaultContainer.getAll(ApplicationFinalizer);
    for (const finalizer of finalizers) {
      await finalizer.shutdown();
    }
  })()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
});

main();
