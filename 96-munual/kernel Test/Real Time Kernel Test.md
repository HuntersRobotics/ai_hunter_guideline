---
title: "[[Real Time Kernel Test]]"
tags: ["kernel test"]
author: kaylor
date_creation: 2025-09-17
aliases:
---

# Install software
```bash
sudo apt update 
sudo apt install -y rt-tests stress
```
## cyclictest
### Test command 
```bash
sudo cyclictest -t1 -p80 -N -m -l10000
```
```
-t1 或 --threads=1：

作用： 创建 1 个测试线程。

解释： cyclictest 可以运行多个线程来模拟多任务环境。这里 -t1 表示只运行一个线程，专注于测量单个任务的延迟。如果你想测试多核或多任务竞争下的延迟，可以增加这个数字（如 -t4 表示创建4个线程，通常会分散到不同的CPU核心上）。

-p80 或 --priority=80：

作用： 将测试线程的实时优先级设置为 80。

解释： 在 Linux 的实时调度策略（如 SCHED_FIFO 或 SCHED_RR）中，优先级是一个 1-99 的数字，数字越大，优先级越高。优先级为 80 的线程会抢占几乎所有普通进程（优先级为0）和大多数内核线程，这使得测试结果更能反映系统在处理高优先级任务时的最差情况延迟。这是一个很高的优先级，常用于模拟关键的实时任务。

-n 或 --nanosleep：

作用： 使用 clock_nanosleep 系统调用而不是简单的 sleep 来实现定时。

解释： 这个选项提供了更高精度的睡眠，减少了测量中的额外误差，使测试结果更加准确。在现代系统上，这是推荐使用的选项。

-m 或 --mlockall：

作用： 为测试进程锁定所有当前和未来的内存地址空间，防止其被换出到交换分区（swap）。

解释： 这是实时系统测试的一个关键选项。如果进程的内存被换出，当需要时，将其换入（从磁盘读回内存）会导致巨大的、不可预测的延迟（页错误）。使用 -m 可以消除这个不确定性来源，确保你测量的是 CPU 调度延迟，而不是磁盘 I/O 延迟。

-l10000 或 --loops=10000：

作用： 设置测试循环次数为 10,000 次。

解释： 测试线程将会醒来、睡眠，如此循环 10,000 次。每次它都会测量实际醒来时间与预期醒来时间之间的差异（即延迟）。循环次数越多，统计结果越有代表性，越有可能捕捉到那些罕见但可能很严重的延迟峰值。10000 是一个常用的测试量。
```
### Kernel Version:  6.1.43-rt14-rockchip-rk3588
#### 4 CPUs load
![](Real%20Time%20Kernel%20Test.png)
> 1. Add Test load for RK3588
> 2. **This case is tested without load, so the latency is minimal**
> 3. This case is tested with 4 CPU load
> 4. this case is tested with 4 CPU load

#### 8 CPUs Load
![](Real%20Time%20Kernel%20Test-1.png)
