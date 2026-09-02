# R0 宿主工具盘点：2026-09-03

状态：`OBSERVED · R0 ENVIRONMENT BOUNDARY`

本记录是一次只读宿主盘点，不是工具链冻结合同，也不证明 Linux reference lab、FlowKernel
target 或干净机器恢复已经成立。后续环境变化追加新记录，不回写本次观察。

## 观察范围

工作目录为 FlowKernel 仓库。盘点只查询命令可见性、版本和 WSL 发行版状态；没有安装、启动、
升级或删除工具，也没有启动 Docker Desktop。

## 观察结果

- Git `2.55.0.windows.2` 与 Node `v24.14.0` 可用；
- Windows 上存在 MinGW GCC、CMake 和 Ninja，但它们尚未被接受为 freestanding target
  工具链；
- Windows PATH 中没有 Clang 和 `qemu-system-x86_64`；
- WSL 功能存在，但只列出已停止的 `docker-desktop` 发行版，没有可用的通用 Linux lab；
- Docker CLI 存在，但本轮没有启动或依赖 Docker Desktop。

## 裁决

| 子门 | 本次裁决 | 原因 |
| --- | --- | --- |
| Repository gate | `AVAILABLE` | 当前 Node 可以运行仓库门禁 |
| Target build/emulation | `PENDING` | 未发现已接受的 Clang/cross compiler 与 QEMU 组合 |
| Linux reference lab | `PENDING` | 没有可用通用 Linux 发行版 |
| Clean-machine recovery | `PENDING` | 尚无精确工具锁和第二环境重建证据 |

因此本次观察不能关闭 R0，也不能授权进入 R1。下一次重验应在工具链候选和通用 Linux 环境
准备完成后，以新日期、新环境和新 evidence identity 追加记录。
