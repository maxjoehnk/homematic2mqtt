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

export enum DeviceChannelCategory {
  None = 'CATEGORY_NONE',
  Sender = 'CATEGORY_SENDER',
  Receiver = 'CATEGORY_RECEIVER',
}

export interface DeviceChannel {
  id: string;
  name: string;
  address: string;
  deviceId: string;
  index: number;
  partnerId: string;
  mode: string;
  category: DeviceChannelCategory;
  isReady: boolean;
  isUsable: boolean;
  isVisible: boolean;
  isLogged: boolean;
  isLogable: boolean;
  isReadable: boolean;
  isWritable: boolean;
  isEventable: boolean;
  isAesAvailable: boolean;
  isVirtual: boolean;
  channelType: ChannelType;
}
