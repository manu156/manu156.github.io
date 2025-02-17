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
