export enum ChannelType {
  Maintenance = 'MAINTENANCE',
  HeatingClimateControlTransceiver = 'HEATING_CLIMATECONTROL_TRANSCEIVER',
  HeatingClimateControlReceiver = 'HEATING_CLIMATECONTROL_RECEIVER',
  HeatingClimateControlClReceiver = 'HEATING_CLIMATECONTROL_CL_RECEIVER',
  HeatingShutterContactReceiver = 'HEATING_SHUTTER_CONTACT_RECEIVER',
  HeatingRoomThTransceiver = 'HEATING_ROOM_TH_TRANSCEIVER',
  HeatingRoomThReceiver = 'HEATING_ROOM_TH_RECEIVER',
  HeatingKeyReceiver = 'HEATING_KEY_RECEIVER',
  ShutterContact = 'SHUTTER_CONTACT',
  AlarmCondSwitchTransmitter = 'ALARM_COND_SWITCH_TRANSMITTER',
  VirtualKey = 'VIRTUAL_KEY',
  KeyTransceiver = 'KEY_TRANSCEIVER',
}

export interface DeviceChannel {
  type: ChannelType;
  address: string;
}
