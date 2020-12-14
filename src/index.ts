import 'reflect-metadata';
import './mqtt';
import './state-publisher/state-publisher';
import './homematic/xml/xml-rpc-server';
import './homematic/xml/xml-rpc-client';
import './homematic/json/json-rpc-client';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { Config, ConfigToken } from './config';
import { defaultContainer } from './ioc-container';
import { ApplicationInitializer } from './application-initializer';

const configContent = readFileSync('config.yml', 'utf8');
const config: Config = safeLoad(configContent);

defaultContainer.bind(ConfigToken).toConstantValue(config);

async function main() {
  const initializers = defaultContainer.getAll(ApplicationInitializer);
  initializers.sort((a, b) => a.order - b.order);
  for (const initializer of initializers) {
    await initializer.initialize();
  }
}

main();
