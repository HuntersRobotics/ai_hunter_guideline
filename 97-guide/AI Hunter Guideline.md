---
title: "[[AI Hunter Guideline]]"
tags: ["ai_hunter guideline"]
author: kaylor
date_creation: 2025-07-17
aliases:
---

注意：
1. 目前所有测试和操作均在Ubuntu 22.04上进行
2. 板卡输入电压是12V

# 烧写程序
## 下载或者clone本仓库
[院内仓库](https://gitea.hunters-tech.com/HuntersRobotics/ai_hunter_guideline)  
[github](https://github.com/HuntersRobotics/ai_hunter_guideline)
## 下载AI Hunter的镜像
访问 https://downloads.hunters-tech.com/rk3588  
选择你需要的版本。
## 烧写镜像
### 进入Maskrom模式
按下maskrom按键，然后给板卡上电，板卡进入mask模式。  
> 请注意虽然上电的端子是防呆的，但是一定注意XT30的正负极，仔细看下图中的丝印。  


![](AI%20Hunter%20Guideline.png)  
进入upgrade_tool文件夹，使用指令测试确认已经进入maskrom模式
```bash
sudo ./upgrade_tool ld 
```
![](AI%20Hunter%20Guideline-1.png)  
### 烧写镜像和重启
- 先解压你的镜像
下载的镜像是gz的压缩格式，需要用gunzip解压
```bash
gunzip your_image.img.gz
```

-  烧写镜像

```
sudo ./upgrade_tool db rk3588_spl_loader_v1.18.113.bin # 烧写内存初始化固件
sudo ./upgrade_tool wl 0 your_image.img # 烧写镜像，改成你的镜像的路径
sudo ./upgrade_tool rd # 复位板卡，板卡即将重启
```
> 烧写镜像的时候会有百分比进度，完成之后可以重启

# 基本接口测试
> **默认用户是hunter，密码是一个空格**

## 串口
### Debug串口
Debug串口使用的是15000000的波特率。不是所有的串口模块都能支持这个波特率，如果需要使用调试串口的功能，建议购买FT232的串口模块。板卡调试串口使用的是超小的接口，间距1.0mm的sh1.0连接器。
![](AI%20Hunter%20Guideline-12.png)  

### 485串口
> 跟调试串口的同侧的是UART7（下图）， 另外一侧是UART4（UART7背面） 

![](AI%20Hunter%20Guideline-13.png)  
将这两个485接口短接，使用下图中的指令可以进行通信测试

![](AI%20Hunter%20Guideline-14.png)
### TTL串口
![](AI%20Hunter%20Guideline-15.png)  
靠近maskrom按键附近的连接器是UART8，测试指令请参考485接口测试
## TYPE-C
该接口是全功能type-c
- USB hub， 可以扩展接口
- DP， 直接Type-C接口的屏幕可以直接供电（一般指支持简单的便携屏幕）和显示
![](AI%20Hunter%20Guideline-2.png)  
## Micro HDMI
请自行购买MicroHDMI转HDMI的数据线
![](AI%20Hunter%20Guideline-3.png)  

## CAN测试
![](AI%20Hunter%20Guideline-5.png)
![](AI%20Hunter%20Guideline-4.png)
![](AI%20Hunter%20Guideline-7.png)  
上面图中，设置的can的通信速率是500k， 注意查看can的状态信息，如果显示是“ERROR-ACTIVE”证明这个can接口已经启动了。
### can口互联测试
安装can口测试软件
```bash
sudo apt update
sudo apt install -y can-utils
```
短接我们板卡的两个can口，然后按照以下指令测试
![](AI%20Hunter%20Guideline-8.png)  

### 进阶配置
- canfd配置  
![](AI%20Hunter%20Guideline-17.png) 
   
![](AI%20Hunter%20Guideline-19.png)  

- can配置  
![](AI%20Hunter%20Guideline-20.png) 
![](AI%20Hunter%20Guideline-21.png)  



## 网口测试
![](AI%20Hunter%20Guideline-9.png)
![](AI%20Hunter%20Guideline-10.png)   
板卡上有两个网口，一个2.5G（2个GH1.25带锁连接器），一个是1000M（2个GH1.25带锁连接器）。
### 网口物理知识
- 水晶头线序

| 1   | 2   | 3   | 4   | 5   | 6   | 7   | 8   |
| --- | --- | --- | --- | --- | --- | --- | --- |
| 橙白  | 橙色  | 绿白  | 蓝色  | 蓝白  | 绿色  | 棕白  | 棕色  |
| A组  | A组  | B组  | C组  | C组  | B组  | D组  | D组  |
> 100M以及100M一下的以太网只需要使用A组和B组的线，但是1000M以上的一定需要全部的线

- 线序交互和自动协商
因为以太网这个接口的的线序事实上是可以自动协商的，但是需要遵循一定的规则：
	- 组内交换， 同组内的线互换线序不影响通信
	- 组间交换， 组间交换需要注意，只有A和B可以交换，C和D可以交换。
### 测试以太网

板卡上的网口使用的是GH1.25连接器，从丝印可以看出来，CPU模块的连接器是A组和B组。如果使用100M网络，引出该连接器即可。如果需要1000M/2.5G，则需要两个连接器一起转成一个RJ45。  
网络的配置放在 /etc/systemd/network/ 下。
```bash
$ ls /sys/class/net
can0  can1  lo  port0  tun0  wlan0

$ cat /etc/systemd/network/port0.network
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

> 注意这里网口是port0，这是因为系统中设置了udev把原本的eth接口重新命名成了port*了  
> ls /sys/class/net 可以查看当前系统下能识别的网络设备，注意这里CAN其实也是一个网络设备  
> 仔细查看配置文件，根据你的实际情况配置网络。建议配置静态IP，方便调试。

#### 以太网带宽测试
PC端和3588都需要安装iperf3
```bash
sudo apt install -y iperf3
```

设置好PC端的IP和板卡端的IP， 我这里电脑端ip是192.168.12.111， 板卡端的IP是192.168.12.200 , 然后一个作为服务端启动，一个作为客户端连接。测试完一轮之后，服务端和客户端对调再测试一轮。如下图所示：  
![](AI%20Hunter%20Guideline-16.png)  
> 上图中是板卡作为服务器， PC客户端去连接，可以看到这个2.5G的网卡接口我们可以跑到2.33G

#### 高阶危险操作
！！！ 该小结是高阶危险操作，不要轻易尝试。  
如果使用多个英特尔I225-V网卡，默认的mac如果一样的话，需要尝试修改mac，如果不熟悉mac地址的规则，建议只修改mac后三个字节。
针对于我们这里的网卡，可以这么设置：
```bash
sudo ethtool -E eth0 magic 0x15f38086 offset 3 length 1 value 0x11
sudo ethtool -E eth0 magic 0x15f38086 offset 4 length 1 value 0x22
sudo ethtool -E eth0 magic 0x15f38086 offset 5 length 1 value 0x33
```

只有一次的修改机会，如果使用没有问题，不建议修改。

## WIFI
	板卡上预留了一个m2接口的，走PCIe的无线网卡，同时也支持蓝牙。支持英特尔9260，英特尔8265，瑞昱的RTL8822等网卡。配置无线网卡可以使用以下指令
```bash
sudo nmtui
```
![](AI%20Hunter%20Guideline-11.png)  


