import { DeviceDetails } from '../../../homematic/json';
import { DeviceAnnouncer } from './device-announcer';
import { WindowContactAnnouncer } from './window-contact-announcer';
import { MqttConnection } from '../../connection';
import { defaultContainer, Provide } from '../../../ioc-container';
import { ClimateAnnouncer } from './climate-announcer';
import { getLogger } from '../../../logger';
import { interfaces } from 'inversify';
import { Device } from '../../../devices/device';

@Provide()
export class AnnouncerFactory {
  private static readonly logger = getLogger();

  private readonly announcers: DeviceAnnouncerFactory[] = [
    ClimateAnnouncer,
    WindowContactAnnouncer,
  ];

  constructor(private mqtt: MqttConnection) {}

  getAnnouncer(device: Device): DeviceAnnouncer {
    AnnouncerFactory.logger.debug('Constructing announcer for device', {
      device,
    });
    const Announcer = this.announcers.find((a) => a.supportsDevice(device));

    if (Announcer == null) {
      throw new Error(
        `No announcer for device ${device.name} (${device.details.type})`
      );
    }

    return defaultContainer.get<DeviceAnnouncer>(Announcer);
  }
}

type DeviceAnnouncerFactory = {
  supportsDevice(device: Device): boolean;
} & interfaces.Newable<DeviceAnnouncer>;
