[![License](https://img.shields.io/github/license/maxjoehnk/homematic2mqtt?style=flat-square)](https://github.com/maxjoehnk/homematic2mqtt/blob/master/LICENSE)
[![Docker Build Status](https://img.shields.io/docker/build/maxjoehnk/homematic2mqtt?style=flat-square)](https://hub.docker.com/r/maxjoehnk/homematic2mqtt)
[![package.json version](https://img.shields.io/github/package-json/v/maxjoehnk/homematic2mqtt?style=flat-square)](https://github.com/maxjoehnk/homematic2mqtt/blob/master/package.json)

# homematic2mqtt

Provides a bridge between a Homematic CCU / [Raspberrymatic](https://raspberrymatic.de/) and [Home Assistant](https://home-assistant.io/) via MQTT.

For improved reliability please install [CCU-Jack](https://github.com/mdzio/ccu-jack) as this will be the api I'll be primarily developing for.

## Configuration

### CCU-Jack
```yaml
mqtt: <mqtt broker host>
homematic:
  jack:
    ip: <server ip>
  ignore: [] # you can provide a list of device addresses to ignore
```

### Native CCU Apis
```yaml
mqtt: <mqtt broker host>
homematic:
  xml:
    interfaces:
      ip:
        host: <ccu ip>
        port: 2010
    local_ip: <server ip>
  json:
    host: <ccu ip>
    username: <ccu username>
    password: <ccu password>
  ignore: [] # you can provide a list of device addresses to ignore
```
