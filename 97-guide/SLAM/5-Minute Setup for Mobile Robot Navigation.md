---
title: "[[5-Minute Setup for Mobile Robot Navigation]]"
tags:
  - slam
author: kaylor
date_creation: 2025-11-22
aliases:
---

！！！本教程只针对AI Hunter产品，不解决其他产品不兼容的问题！！！  
！！！This tutorial is specifically for the AI Hunter product and does not address compatibility issues with other products.！！！
# Add kaylordut apt source
```bash
cat << 'EOF' | sudo tee /etc/apt/sources.list.d/kaylordut.list
deb [signed-by=/etc/apt/keyrings/kaylor-keyring.gpg] http://apt.kaylordut.cn/kaylordut/ kaylordut main
EOF
cat << 'EOF' | sudo tee /etc/apt/preferences.d/kaylordut
Package: *
Pin: release o=kaylordut kaylordut,a=kaylordut,n=kaylordut,l=kaylordut kaylordut,c=main,b=arm64
Pin-Priority: 1099
EOF
sudo apt update
```

# Install ROS2
-  X86 Host

**You can set up a simulation environment by referring to the [link](https://github.com/HuntersRobotics/simulation).**
```bash
sudo apt install -y ros2-apt-source
sudo apt update
sudo apt install -y ros-humble-desktop-full ros-humble-gazebo-* ros-humble-rivz*
sudo apt install -y liblivox-sdk2-dev ros-humble-livox-ros-driver2 ros-humble-ros2-livox-simulation
sudo apt install -y ros-humble-teleop-twist-keyboard
```
-  your AI Hunter device
```bash
sudo apt install -y ros2-apt-source
sudo apt update
sudo apt install -y ros-humble-ros-base
```

# Install ROS2 CycloneDDS
```bash
sudo apt install -y ros-humble-rmw-cyclonedds-cpp
sudo mkdir /etc/ros/dds/ -pv
cat << 'EOF' | sudo tee /etc/ros/dds/cyclonedds.xml
<?xml version="1.0" encoding="UTF-8" ?>
<CycloneDDS xmlns="" xmlns:xsi="" xsi:schemaLocation=" ">
  <Domain id="any">
    <General>
      <Interfaces>
        <NetworkInterface name="wlan0" />
      </Interfaces>
      <AllowMulticast>spdp</AllowMulticast>
      <DontRoute>true</DontRoute>
    </General>
  </Domain>
</CycloneDDS>
EOF
cat << 'EOF' | sudo tee /etc/ros/dds/service-environment.conf
[Unit]
After=network.target
Requires=systemd-networkd.service
After=systemd-networkd.service

[Service]
Environment=ROS_HOME=/root/.ros
Environment=ROS_DISTRO=humble
Environment=ROS_LOCALHOST_ONLY=0
Environment=ROS_PYTHON_VERSION=3
Environment=ROS_VERSION=2
Environment=PYTHONPATH=/opt/ros/humble/lib/python3.8/site-packages:/opt/ros/humble/lib/python3.10/site-packages:/opt/ros/humble/local/lib/python3.10/dist-packages
Environment=AMENT_PREFIX_PATH=/opt/ros/humble
Environment=PATH=/opt/ros/humble/bin:/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
Environment=LD_LIBRARY_PATH=/opt/ros/humble/opt/rviz_ogre_vendor/lib:/opt/ros/humble/lib/aarch64-linux-gnu:/opt/ros/humble/lib:/usr/local/lib/:/opt/ros/humble/lib/x86_64-linux-gnu:/opt/ros/humble/opt/openvdb_vendor/lib
Environment=RMW_IMPLEMENTATION=rmw_cyclonedds_cpp
Environment=CYCLONEDDS_URI=file:///etc/ros/dds/cyclonedds.xml
Environment=ROS_LOG_DIR=/tmp/ros
# Enable coredump
LimitCORE=infinity
Environment=ROS_DOMAIN_ID=101

Environment=ROS2_SYSTEMD_LOG_ENABLE=true
Environment=SPDLOG_STDOUT=false
Environment=SPDLOG_SYSTEMD=true
Environment=SPDLOG_LEVEL=info
Environment=RCUTILS_CONSOLE_OUTPUT_FORMAT="[{severity}] [{name}]:{message}"
StandardError=null
StandardOutput=null
EOF
```

> 1. Note the `wlan0` interface in the `/etc/ros/dds/cyclonedds.xml` configuration; it should be replaced with the actual network interface used in your environment.
> 2. If you need communication interfaces other than `wlan0`, you can duplicate the line, paste it below, and change the interface to `eth0`, making the communication interfaces `wlan0` and `eth0`.
> 3. Note the DOMAIN ID in the `/etc/ros/dds/service-environment.conf` configuration; it should match the ID used on your local network for Topic monitoring.
>
> **!!!!! IMPORTANT: Ensure the interface specified above has an IP address and is connected via Ethernet cable or connected to a wireless network. Otherwise, various ROS2 services will report errors directly !!!!!**


# Install Hunter SLAM Software Packages
```bash
sudo apt update
sudo apt install -y ros-humble-rcl ros-humble-linefit-ground-segmentation-ros ros-humble-livox-ros-driver2 liblivox-sdk2-dev
sudo apt install -y ros-humble-hunter-point-lio ros-humble-hunter-fast-lio ros-humble-hunter-pointcloud-to-laserscan  ros-humble-hunter-navigation2
sudo apt install -y ros-humble-spatio-temporal-voxel-layer
sudo apt install -y ros-humble-hunter-map-publisher ros-humble-icp-registration
```