import axios, { AxiosInstance } from 'axios';
import { defaultContainer, ProvideInterface } from '../../ioc-container';
import { Config, ConfigToken, JsonInterfaceConfig } from '../../config';
import { AuthenticatedRequest, LoginRequest } from './models';
import { methods } from './methods';
import { getLogger } from '../../logger';
import { ApplicationInitializer } from '../../application-initializer';

@ProvideInterface(ApplicationInitializer)
export class JsonRpcClient implements ApplicationInitializer {
  private static readonly logger = getLogger();
  private sessionId: string;

  constructor(
    private http: AxiosInstance,
    private config: JsonInterfaceConfig
  ) {}

  order = 0;

  initialize(): Promise<void> {
    return this.login(this.config.username, this.config.password);
  }

  async call<TRequest, TResponse>(
    method: string,
    params?: TRequest
  ): Promise<TResponse> {
    const body: JsonRpcRequest<TRequest> = {
      version: '1.1',
      method,
      params: {
        ...this.authParams,
        ...params,
      },
    };
    JsonRpcClient.logger.debug('Calling json-rpc method', {
      jsonRpcRequest: body,
    });
    const res = await this.http.post<JsonRpcResponse<TResponse>>(
      `http://${this.config.host}/api/homematic.cgi`,
      body
    );
    if (res.data.error) {
      throw new Error(JSON.stringify(res.data.error));
    }
    return res.data.result;
  }

  private get authParams(): AuthenticatedRequest {
    return { _session_id_: this.sessionId };
  }

  private async login(username: string, password: string): Promise<void> {
    this.sessionId = await this.call<LoginRequest, string>(methods.login, {
      username,
      password,
    });
  }
}

defaultContainer
  .bind(JsonRpcClient)
  .toDynamicValue((context) => {
    const config = context.container.get<Config>(ConfigToken);

    return new JsonRpcClient(axios, config.homematic.json);
  })
  .inSingletonScope();

export interface JsonRpcRequest<TRequest> {
  version: string;
  method: string;
  params: TRequest;
}

export interface JsonRpcResponse<TResponse> {
  version: string;
  result?: TResponse;
  error?: any;
}
