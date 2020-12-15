import { BaseDiscoveryModel } from './base';

export interface ClimateDiscoveryModel extends BaseDiscoveryModel {
  action_template?: string;
  action_topic?: string;
  aux_command_topic?: string;
  aux_state_template?: string;
  aux_state_topic?: string;
  away_mode_command_topic?: string;
  away_mode_state_template?: string;
  away_mode_state_topic?: string;
  current_temperature_template?: string;
  current_temperature_topic?: string;
  fan_mode_command_topic?: string;
  fan_mode_state_template?: string;
  fan_mode_state_topic?: string;
  fan_modes?: string[];
  hold_command_topic?: string;
  hold_state_template?: string;
  hold_state_topic?: string;
  hold_modes?: string[];
  initial?: number;
  json_attributes_template?: string;
  json_attributes_topic?: string;
  max_temp?: number;
  min_temp?: number;
  mode_command_topic?: string;
  mode_state_template?: string;
  mode_state_topic?: string;
  modes?: HvacMode[];
  name?: string;
  payload_available?: string;
  payload_not_available?: string;
  payload_off?: string;
  payload_on?: string;
  power_command_topic?: string;
  precision?: number;
  qos?: number;
  retain?: boolean;
  send_it_off?: boolean;
  swing_mode_command_topic?: string;
  swing_mode_state_template?: string;
  swing_mode_state_topic?: string;
  swing_modes?: string[];
  temperature_command_topic?: string;
  temperature_high_command_topic?: string;
  temperature_high_state_template?: string;
  temperature_high_state_topic?: string;
  temperature_low_command_topic?: string;
  temperature_low_state_template?: string;
  temperature_low_state_topic?: string;
  temperature_state_template?: string;
  temperature_state_topic?: string;
  temperature_unit?: string;
  temp_step?: number;
  unique_id?: string;
  value_template?: string;
}

export enum HvacMode {
  Auto = 'auto',
  Off = 'off',
  Cool = 'cool',
  Heat = 'heat',
  Dry = 'dry',
  FanOnly = 'fan_only',
}
