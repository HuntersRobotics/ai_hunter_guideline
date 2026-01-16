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

| Mode     | Port 2.1 | Port2.2 |
| -------- | -------- | ------- |
| 10M      | √        | -       |
| 100M     | √        | -       |
| 1000M    | √        | √       |
| 2500     | √        | √       |
| Ehtercat | √        | -       |


Port2.1 <--> A and B groups  
Port2.2 <--> C and D groups

### Debug UART
This port level is 3.3V, pin define from left to right:

|     |     |     |
| --- | --- | --- |
| **TX**  | **RX**  | **GND** |


## Right
![](AI%20Hunterr%20Interface%20Details-3.png)  

### 1. TTL UART8
This port level is 3.3V, pin define from left to right:

|     |     |     |
| --- | --- | --- |
| TX  | RX  | GND |
### 2. MaskROM KEY
Press it when power on the AI Hunter, the device will enter mask  mode.  you can upgrade your  OS in the mode.

### 3. Type-C
-  The Type-C can connect to a monitor via itself DP signal.
-  You can upgrade your OS via the port.
-  Connect a USB hub as USB master

### 4. CAN1 

This port level is 3.3V, pin define from left to right:

|       |       |     |
| ----- | ----- | --- |
| CAN_H | CAN_L | GND |

### 5. CAN2
This port level is 3.3V, pin define from left to right:

|     |       |       |
| --- | ----- | ----- |
| GND | CAN_L | CAN_H |
### 6. 1.8V ADC Port
Pin define from left to right:

|      |      |      |      |     |
| ---- | ---- | ---- | ---- | --- |
| ADC3 | ADC5 | ADC6 | ADC7 | GND |
### 3.3V GPIO
Pin define from left to right:

|     |      |         |         |         |     |
| --- | ---- | ------- | ------- | ------- | --- |
| GND | PWM7 | GPIO3A6 | GPIO4A7 | GPIO4A6 | 3V3 |

## Back
![](AI%20Hunterr%20Interface%20Details-4.png)  
### Power Input
Pin define from left to right:

|     |     |
| --- | --- |
| GND | 12V |
> The input voltage must be lower than 17V, and 12V power supply is recommended. 
> 
