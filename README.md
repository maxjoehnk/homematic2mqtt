![Docker Build Status](https://img.shields.io/docker/build/maxjoehnk/homematic2mqtt?style=flat-square)
![License](https://img.shields.io/github/license/maxjoehnk/homematic2mqtt?style=flat-square)
![GitHub package.json version](https://img.shields.io/github/package-json/v/maxjoehnk/homematic2mqtt?style=flat-square)

# homematic2mqtt

Provides a bridge between a Homematic CCU / [Raspberrymatic](https://raspberrymatic.de/) and [Home Assistant](https://home-assistant.io/) via MQTT.

## Configuration

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
  ignore: [] # you can provide a list of device ids to ignore
```
