---
external: false
title: "My Desktop Setup / Distro / Configs / Extensions "
description: "My Desktop Setup / Distro / Configs / Extensions"
date: 2020-01-20
---

## My Desktop Setup / Distro
### Primary
OS: Arch Linux(pacman) + i3  
Terminal:   
Terminal File Manager: https://github.com/sxyazi/yazi  

### Secondary
MacOs + KarbinerElements + Maccy + kitty

## Configs
Key remapping - [https://github.com/wez/evremap](https://github.com/wez/evremap)  
### Notification on memory
system.d service:
```text
[Unit]
Description=Low Memory Alert Daemon
After=graphical.target

[Service]
ExecStart=/usr/local/bin/memory_alert.sh
Restart=always
User=<USER_NAME>
Environment=DISPLAY=:0
Environment=DBUS_SESSION_BUS_ADDRESS=unix:path=/run/user/1000/bus

[Install]
WantedBy=default.target

```
TODO: replace indices in awk, which can change for os to os
script:
```sh
#!/bin/bash

thresholds=(70 85 90)
triggered_levels=()
total_mem=$(free | awk '/^Mem:/{print $2}')

# Get active user and their environment
export DISPLAY=:0
export DBUS_SESSION_BUS_ADDRESS="unix:path=/run/user/$(id -u)/bus"

while :
do
    free_mem=$(free | awk '/^Mem:/{print $4}')
    used_mem=$((total_mem - free_mem))
    used_percent=$(( (used_mem * 100) / total_mem ))

    for threshold in "${thresholds[@]}"; do
        if (( used_percent >= threshold )); then
            if [[ ! " ${triggered_levels[@]} " =~ " ${threshold} " ]]; then
                notify-send "⚠️ Memory Alert" "Memory usage at ${used_percent}% (Threshold: ${threshold}%)"
                triggered_levels+=("$threshold")
            fi
        fi
    done

    # Reset notifications when memory drops below 70%
    if (( used_percent < 70 )); then
        if [ ${#triggered_levels[@]} -gt 0 ]; then
            notify-send "✅ Memory Recovered" "Memory usage is back below 70%."
            triggered_levels=()
        fi
    fi

    sleep 5
done

```
## Extensions
```sh
❯ ls ~/.local/share/gnome-shell/extensions | sed "s/\s+/\\n/g" -E
clipboard-indicator@tudmotu.com
cpufreq@konkor
extension-list@tu.berry
freon@UshakovVasilii_Github.yahoo.com
InternetSpeedMonitor@Rishu
lockkeys@vaina.lt
mediacontrols@cliffniff.github.com
no-titlebar-when-maximized@alec.ninja
pano@elhan.io
sermon@rovellipaolo-gmail.com
system-monitor-next@paradoxxx.zero.gmail.com
unite@hardpixel.eu

```
- powertop (todo: implement all powertop suggested optimisations)
- always on top notes (todo: note the best one here)
also see
- https://github.com/jcbritobr/linux_power_opt
- https://gist.github.com/LovetheFrogs/55e686935c4cd9e3c39c61221ee00c21
- https://github.com/AdnanHodzic/auto-cpufreq
- https://github.com/linrunner/TLP
- https://github.com/sn99/Optimizing-linux
- https://github.com/jazir555/Linux-Performance-Optimizations
- https://gist.github.com/Unixten/4483ec6e435fe6d7e2cb6dfac3f8ccd0
- https://gist.github.com/reterVision/faab6c00fb04d09334e9
- https://github.com/TheAlexDev23/power-options
## Misc
### Screen Resolution and scale setting on login
Python script for resolution (source: https://github.com/T-vK/ScaleToggle/tree/master):
```python
#!/usr/bin/python3

# https://dbus.freedesktop.org/doc/dbus-python/tutorial.html
# https://github.com/GNOME/mutter/blob/b5f99bd12ebc483e682e39c8126a1b51772bc67d/data/dbus-interfaces/org.gnome.Mutter.DisplayConfig.xml
# https://ask.fedoraproject.org/t/change-scaling-resolution-of-primary-monitor-from-bash-terminal/19892

import dbus
bus = dbus.SessionBus()

display_config_well_known_name = "org.gnome.Mutter.DisplayConfig"
display_config_object_path = "/org/gnome/Mutter/DisplayConfig"

display_config_proxy = bus.get_object(display_config_well_known_name, display_config_object_path)
display_config_interface = dbus.Interface(display_config_proxy, dbus_interface=display_config_well_known_name)

serial, physical_monitors, logical_monitors, properties = display_config_interface.GetCurrentState()

updated_logical_monitors=[]
for x, y, scale, transform, primary, linked_monitors_info, props in logical_monitors:
    if primary == 1:
        scale = 2.0 if (scale == 1.0) else 1.0 # toggle scaling between 1.0 and 2.0 for the primary monitor
    physical_monitors_config = []
    for linked_monitor_connector, linked_monitor_vendor, linked_monitor_product, linked_monitor_serial in linked_monitors_info:
        for monitor_info, monitor_modes, monitor_properties in physical_monitors:
            monitor_connector, monitor_vendor, monitor_product, monitor_serial = monitor_info
            if linked_monitor_connector == monitor_connector:
                for mode_id, mode_width, mode_height, mode_refresh, mode_preferred_scale, mode_supported_scales, mode_properties in monitor_modes:
                    if mode_properties.get("is-current", False): # ( mode_properties provides is-current, is-preferred, is-interlaced, and more)
                        physical_monitors_config.append(dbus.Struct([monitor_connector, mode_id, {}]))
                        if scale not in mode_supported_scales:
                            print("Error: " + monitor_properties.get("display-name") + " doesn't support that scaling value! (" + str(scale) + ")")
                        else:
                            print("Setting scaling of: " + monitor_properties.get("display-name") + " to " + str(scale) + "!")
    updated_logical_monitor_struct = dbus.Struct([dbus.Int32(x), dbus.Int32(y), dbus.Double(scale), dbus.UInt32(transform), dbus.Boolean(primary), physical_monitors_config])
    updated_logical_monitors.append(updated_logical_monitor_struct)

properties_to_apply = { "layout_mode": properties.get("layout-mode")}
method = 1 # 2 means show a prompt before applying settings; 1 means instantly apply settings without prompt
display_config_interface.ApplyMonitorsConfig(dbus.UInt32(serial), dbus.UInt32(method), updated_logical_monitors, properties_to_apply)
```

To update refresh rate: https://github.com/jadahl/gnome-monitor-config.git
```bash
# build and use binary
# to list
./gnome-monitor-config list
# to set
./gnome-monitor-config set -LpM eDP-2 -t normal -m 2560x1600@60.002
```
