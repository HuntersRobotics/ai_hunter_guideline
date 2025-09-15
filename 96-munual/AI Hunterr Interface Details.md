---
title: "[[AI Hunterr Interface Details]]"
tags: ["AI_Hunter"]
author: kaylor
date_creation: 2025-09-15
aliases:
---

## Front

![](AI%20Hunterr%20Interface%20Details.png)  

### 1. RS485 or TTL (UART7)
	Pin define from left to right: 

| **TTL**   | **VCC** | **RX** | **TX** | **GND** |
| --------- | ------- | ------ | ------ | ------- |
| **RS485** | **VCC** | **A**  | **B**  | **GND** |
> default VCC is 5V, mode is RS485

![](AI%20Hunterr%20Interface%20Details-1.png)  



### 2. RS485(UART4)
	Pin define from left to right: 

| **GND** | **TX** | **RX** | **VCC** |
| ------- | ------ | ------ | ------- |
| **GND** | **B**  | **A**  | **VCC** |
> default VCC is 5V, mode is RS485

### 3. 1.8V GPIO
Pin define from left to right: 

|     |         |         |        |         |
| --- | ------- | ------- | ------ | ------- |
| GND | GPIO1D5 | GPIO1D3 | GPIO2C | GPIO4C6 |

### 4. TF card
### 5. Micro HDMI
## Left
![](AI%20Hunterr%20Interface%20Details-2.png)  
### 1000M Ethernet

| Mode  | Port 1.1 | Port1.2 |
| ----- | -------- | ------- |
| 10M   | √        | -       |
| 100M  | √        | -       |
| 1000M | √        | √       |
|       |          |         |
|       |          |         |

Port1.1 <--> A and B groups
Port1.2 <--> C and D groups


### 2500M Ethernet/Ethercat

| Mode     | Port 1.1 | Port1.2 |
| -------- | -------- | ------- |
| 10M      | √        | -       |
| 100M     | √        | -       |
| 1000M    | √        | √       |
| 2500     | √        | √       |
| Ehtercat | √        | -       |


Port2.1 <--> A and B groups
Port2.2 <--> C and D groups
