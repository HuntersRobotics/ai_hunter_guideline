---
title: "[[AI Hunter Guideline English]]"
tags: ["AI Hunter"]
author: kaylor
date_creation: 2025-08-11
aliases:
---

# AI Hunter RK3588 Setup and Testing Guide

## Flashing the Firmware

### Download or clone this repository
[Internal Repository](https://gitea.hunters-tech.com/HuntersRobotics/ai_hunter_guideline)  
[GitHub](https://github.com/HuntersRobotics/ai_hunter_guideline)

### Download the AI Hunter Image
Visit https://downloads.hunters-tech.com/rk3588  
Or Baidu Netdisk: https://pan.baidu.com/s/1y6nbbdu52ssyxur_cvg5Rw?pwd=hvmw Extraction code: hvmw    
or Google Drive: https://drive.google.com/drive/folders/1UF_oTc2PZreQCcvoYkweERQwv4sSaitP?usp=sharing  
Select the version you need.

### Flashing the Image

#### Entering Maskrom Mode
1. Connect the board to your computer via USB
2. Press the Maskrom button
3. Power on the board to enter Maskrom mode

> **Caution**: Ensure correct polarity of the XT30 connector by checking the silkscreen markings.

![Maskrom Connection](AI%20Hunter%20Guideline.png)

Verify Maskrom mode:
bash
sudo ./upgrade_tool ld # Run on PC

![Maskrom Verification](AI%20Hunter%20Guideline-1.png)

#### Flashing the Image and Rebooting
1. Extract the image:
```bash
gunzip your_image.img.gz
```

2. Flash the image:
```bash
sudo ./upgrade_tool db rk3588_spl_loader_v1.18.113.bin
sudo ./upgrade_tool wl 0 your_image.img
sudo ./upgrade_tool rd
```


> The flashing process shows percentage progress. Reboot after completion.

---

## Basic Interface Testing
> Default credentials:  
> Username: `hunter`  
> Password: ` ` (single space)

### Serial Ports

#### Debug Serial Port
- Baud rate: 15,000,000
- Requires FT232-based serial module
- Uses SH1.0 connector (1.0mm pitch)

![Debug Serial](AI%20Hunter%20Guideline-12.png)

#### RS485 Serial Port
- UART7 (same side as debug port)
- UART4 (opposite side)

![RS485 Ports](AI%20Hunter%20Guideline-13.png)

Test communication:
![RS485 Test](AI%20Hunter%20Guideline-14.png)

#### TTL Serial Port
- UART8 (near Maskrom button)

![TTL Serial](AI%20Hunter%20Guideline-15.png)

### Type-C Port
- USB Hub functionality
- DisplayPort support (power and video)

![Type-C Port](AI%20Hunter%20Guideline-2.png)

### Micro HDMI
Requires MicroHDMI-to-HDMI cable

![Micro HDMI](AI%20Hunter%20Guideline-3.png)

### CAN Bus Testing

#### Basic Configuration
![CAN Config](AI%20Hunter%20Guideline-5.png)
![CAN Setup](AI%20Hunter%20Guideline-4.png)  


Set to 500kbps:

![CAN Status](AI%20Hunter%20Guideline-7.png)

#### Loopback Test
1. Install tools:
bash
sudo apt update
sudo apt install -y can-utils


2. Short-circuit CAN ports
3. Test communication:
![CAN Test](AI%20Hunter%20Guideline-8.png)

#### Advanced Configuration
**CAN FD:**
![CAN FD Setup](AI%20Hunter%20Guideline-17.png)
![CAN FD Config](AI%20Hunter%20Guideline-19.png)

**Standard CAN:**

![CAN Setup](AI%20Hunter%20Guideline-20.png)
![CAN Config](AI%20Hunter%20Guideline-21.png)

### Ethernet Testing

#### Port Information
- 2.5G port (two GH1.25 connectors)
- 1000M port (two GH1.25 connectors)

![Ethernet Ports](AI%20Hunter%20Guideline-9.png)
![Ethernet Details](AI%20Hunter%20Guideline-10.png)

#### Configuration
Network settings in `/etc/systemd/network/`:
```bash
cat /etc/systemd/network/port0.network
[Match]
Name=port0

[Network]
Address=192.168.11.100/24
Gateway=192.168.11.1
DNS=119.29.29.29

[Link]
RequiredForOnline=no
ActivationPolicy=always-up

```

#### Bandwidth Testing
1. Install iperf3:
```bash
sudo apt install -y iperf3
```


2. Run tests:  

![Bandwidth Test](AI%20Hunter%20Guideline-16.png)

#### Advanced MAC Modification
For Intel I225-V NICs:
```bash
sudo ethtool -E eth0 magic 0x15f38086 offset 3 length 1 value 0x11
sudo ethtool -E eth0 magic 0x15f38086 offset 4 length 1 value 0x22
sudo ethtool -E eth0 magic 0x15f38086 offset 5 length 1 value 0x33
```


### EtherCAT Testing
2.5G port supports EtherCAT:  
[EtherCAT Demo](https://github.com/HuntersRobotics/ethercat_example.git)

### Wi-Fi
Configure with:
```bash
sudo nmtui
```

![Wi-Fi Setup](AI%20Hunter%20Guideline-11.png)

### Storage Testing

#### NVMe
Check detection:
```bash
sudo lspci -vv
```
![NVMe Detection](AI%20Hunter%20Guideline-22.png)

Performance test:  

![NVMe Performance](AI%20Hunter%20Guideline-24.png)
![NVMe Speed](AI%20Hunter%20Guideline-23.png)

#### SD Card
Mounted at `/media/exfat/tf_card`
```bash
dd if=/dev/zero of=/media/exfat/tf_card/testfile bs=1G count=1
dd if=/media/exfat/tf_card/testfile of=/dev/null bs=1G count=1
```

# AI Hunter Debian Software Packages

## Add Kaylordut Software Source
```bash
cat << 'EOF' | sudo tee /etc/apt/sources.list.d/kaylordut.list 
deb [signed-by=/etc/apt/keyrings/kaylor-keyring.gpg] http://apt.kaylordut.cn/kaylordut/ kaylordut main
deb [signed-by=/etc/apt/keyrings/kaylor-keyring.gpg] http://apt.kaylordut.cn/rk3588/ubuntu jammy main
EOF
sudo mkdir /etc/apt/keyrings -pv
sudo wget -O /etc/apt/keyrings/kaylor-keyring.gpg http://apt.kaylordut.cn/kaylor-keyring.gpg
sudo apt update

```


## RK3588 Fixed Frequency
```bash
sudo apt update
sudo apt install -y rk3588-fixed-freq
```

```bash
sudo systemctl start rk3588-set-cpu-max-freq.service
sudo systemctl start rk3588-set-gpu-max-freq.service
sudo systemctl start rk3588-set-npu-max-freq.service
```

![](AI%20Hunter%20Guideline%20English.png)  
![](AI%20Hunter%20Guideline%20English-1.png)  
![](AI%20Hunter%20Guideline%20English-2.png)  

