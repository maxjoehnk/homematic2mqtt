export const ConfigToken = Symbol('config');

export interface Config {
  mqtt: string;
  homematic: HomematicConfig;
}

export interface HomematicConfig {
  json?: JsonInterfaceConfig;
  xml?: {
    interfaces: { [key: string]: XmlInterfaceConfig };
    local_ip: string;
  };
  jack?: JackInterfaceConfig;
  ignore: string[];
  entities: {
    battery?: boolean;
    voltage?: boolean;
    rssi?: boolean;
  };
}

export interface XmlInterfaceConfig {
  host: string;
  port: number;
}

export interface JsonInterfaceConfig {
  host: string;
  username: string;
  password: string;
}

export interface JackInterfaceConfig {
  ip: string;
  httpPort?: number;
  mqttPort?: number;
}
