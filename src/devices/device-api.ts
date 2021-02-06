import { Device } from './device';

export abstract class DeviceApi {
  abstract getDeviceStatus(device: Device): Promise<DeviceStatus>;

  abstract setValue(
    device: Device,
    channelAddress: string,
    property: string,
    value: number
  ): Promise<void>;
  abstract setDouble(
    device: Device,
    channelAddress: string,
    property: string,
    value: number
  ): Promise<void>;
}

export interface DeviceStatus {
  RSSI_DEVICE: number;
  LOW_BAT: boolean;
  OPERATING_VOLTAGE: number;
  OPERATING_VOLTAGE_STATUS: 0 | 1;
  DUTY_CYCLE: boolean;
  UNREACH: boolean;
  CONFIG_PENDING: boolean;
  UPDATE_PENDING: boolean;
}

export interface ClimateDeviceStatus {
  VALVE_STATE: number;
  ACTUAL_TEMPERATURE: number;
  BOOST_TIME: number;
  SWITCH_POINT_OCCURED: boolean;
  ACTUAL_TEMPERATURE_STATUS: number;
  BOOST_MODE: boolean;
  PARTY_MODE: boolean;
  QUICK_VETO_TIME: number;
  SET_POINT_MODE: number;
  WINDOW_STATE: number;
  FROST_PROTECTION: boolean;
  ACTIVE_PROFILE: number;
  SET_POINT_TEMPERATURE: number;
  LEVEL_STATUS: number;
}

export interface ContactDeviceState {
  STATE: number;
}
