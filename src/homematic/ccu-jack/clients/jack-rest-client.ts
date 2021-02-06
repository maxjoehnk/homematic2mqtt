import { defaultContainer } from '../../../ioc-container';
import { getLogger } from '../../../logger';
import axios, { AxiosInstance } from 'axios';
import { JackInterfaceConfig, Config, ConfigToken } from '../../../config';

export class JackRestClient {
  private static readonly logger = getLogger();

  private get baseUrl(): string {
    return `http://${this.config.ip}:${this.config.httpPort ?? 2121}`;
  }

  constructor(
    private http: AxiosInstance,
    private config: JackInterfaceConfig
  ) {}

  async getDevices(): Promise<JackDeviceResponse[]> {
    const res = await this.http.get<JackDeviceList>(`${this.baseUrl}/device`);
    const devices = [];
    for (const link of res.data['~links']) {
      if (link.rel !== 'device') {
        continue;
      }
      const deviceResponse = await this.http.get<JackDeviceResponse>(
        `${this.baseUrl}/device/${link.href}`
      );
      devices.push(deviceResponse.data);
    }
    return devices;
  }

  async getChannels(
    device: JackDeviceResponse
  ): Promise<JackChannelResponse[]> {
    const channels = [];
    for (const link of device['~links']) {
      if (link.rel !== 'channel') {
        continue;
      }
      const channelResponse = await this.http.get<JackChannelResponse>(
        `${this.baseUrl}/device/${device.identifier}/${link.href}`
      );
      channels.push(channelResponse.data);
    }
    return channels;
  }

  async writeProperty(path: string, value: number): Promise<void> {
    JackRestClient.logger.debug('Writing property...', {
      veap: { path, value },
    });
    await this.http.put(`${this.baseUrl}/${path}/~pv`, { v: value });
  }
}

defaultContainer
  .bind(JackRestClient)
  .toDynamicValue((context) => {
    const config = context.container.get<Config>(ConfigToken);

    return new JackRestClient(axios, config.homematic.jack);
  })
  .inSingletonScope();

export interface JackResponse {
  identifier: string;
  title: string;
  '~links': JackLink[];
}

interface JackDeviceList extends JackResponse {
  description: string;
}

interface JackLink {
  rel: string;
  href: string;
  title: string;
}

export interface JackDeviceResponse extends JackResponse {
  address: string;
  aesActive: number;
  availableFirmware: string;
  children: string[];
  direction: number;
  firmware: string;
  flags: number;
  group: string;
  index: number;
  interface: string;
  interfaceType: string;
  linkSourceRoles: string;
  linkTargetRoles: string;
  paramsets: string[];
  parent: string;
  parentType: string;
  rfAddress: number;
  roaming: number;
  rxMode: number;
  team: string;
  teamChannels: unknown;
  teamTag: string;
  type: string;
  version: number;
}

export interface JackChannelResponse extends JackResponse {
  address: string;
  aesActive: number;
  availableFirmware: string;
  children: string[];
  direction: number;
  firmware: string;
  flags: number;
  group: string;
  index: number;
  interface: string;
  linkSourceRoles: string;
  linkTargetRoles: string;
  paramsets: string[];
  parent: string;
  parentType: string;
  rfAddress: number;
  roaming: number;
  rxMode: number;
  team: string;
  teamChannels: unknown;
  teamTag: string;
  type: string;
  version: number;
}
