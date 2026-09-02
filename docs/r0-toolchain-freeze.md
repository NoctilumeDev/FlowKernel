# R0 工具链冻结合同

状态：`R0 DESIGN FROZEN · EXECUTABLE LOCK PENDING`

本文固定 R0 必须锁定的工具角色、平台边界、版本证据和停止条件。它不声称当前机器已经具备
这些工具，也不授权开始 R1 内核实现。

## 1. 四条工具链必须分开

| 工具链 | 用途 | 不得证明 |
| --- | --- | --- |
| Repository gate | 检查文档、合同、链接、状态词和仓库卫生 | 内核可启动或 Linux 行为正确 |
| Contract fixture tool | 校验 R0 交换合同及正反例 | C ABI、权限隔离或执行事实 |
| Target build/emulation | 未来构建和启动固定的 freestanding C target | 真实硬件、多核或生产安全 |
| Linux reference lab | 运行传统 Linux、cgroup、`sched_ext`/`scx` 和 agentic 对照 | FlowKernel target 已实现相同能力 |

四条线可以共享不可变源码坐标和合同版本，不能共享成功状态。任何一条线缺失时，只将对应
结论标为 `PENDING` 或 `BOUNDARY`，不能借另一条线代替。

## 2. R0 首选平台边界

- **合同与仓库门禁：** 能运行仓库固定 Node 入口的受支持宿主。
- **Linux reference lab：** 原生或虚拟化的 x86-64 Linux；必须记录发行版、内核、cgroup
  模式、虚拟化层和可用权限。
- **FlowKernel target：** x86-64 单核模拟目标；只允许在 R0 锁定的模拟器机器型号、CPU
  模型和启动交接格式上进入 R1。
- **容器：** 可以提供辅助环境，但不能成为唯一恢复路径，也不能掩盖宿主内核、cgroup 或
  `sched_ext` 的实际能力。

R0 必须在第一次 target build 前单独冻结启动交接格式。GRUB/Multiboot、UEFI/OVMF、Limine
或其他方案当前都不是既成事实；在选择及反证完成前，`R1 ENTRY` 保持禁止。

## 3. 可接受工具族

R0 允许在证据比较后从以下角色中各选一个首选实现，并保留一个可替代性说明：

| 角色 | 首选候选 | 冻结前必须回答 |
| --- | --- | --- |
| C compiler | Clang/LLVM 或 freestanding GCC cross toolchain | C11 子集、target triple、内建函数和未定义行为策略 |
| Linker | LLD 或 GNU ld | 链接脚本、段布局、入口、重定位和 map 文件 |
| Binary inspection | LLVM tools 或 GNU binutils | ELF header、section、symbol 和反汇编证据 |
| Emulator | QEMU system emulation | machine、CPU、memory、single-core、headless 和退出通道 |
| Host tests | compiler sanitizer + static analysis | 哪些测试只在 hosted build 中成立 |
| Lab observation | `/proc`、cgroup v2、PSI、perf/eBPF where available | 权限、采样污染、缺失指标和读回来源 |

“系统里能找到某个命令”不等于工具链已冻结。冻结坐标必须进入版本锁文件并经过干净环境重建。

## 4. 版本锁的最低内容

R0 关闭前必须提交机器可读的 `r0-toolchain-lock`，至少记录：

- schema version；
- 每个工具的名称、版本、上游下载坐标和内容摘要；
- 宿主 OS、目标 triple、模拟器 machine/CPU 和启动交接格式；
- 完整编译、链接、检查、启动和退出参数；
- 必需环境变量及允许的默认值；
- 可选工具和缺失时的 `BOUNDARY` 行为；
- 许可证与再分发边界；
- 生成该锁的 commit 和验证命令。

浮动的 `latest`、未固定的容器标签、只写产品名不写版本、依赖个人 PATH 或 IDE 配置都不能
通过 R0 工具链门禁。

## 5. C 和构建门槛

首选工具链无论选用 Clang 还是 GCC，都必须落实现有
[C-first 内核契约](c-first-kernel-contract.md)：

- freestanding C11 子集；
- warning 作为失败；
- 禁止隐式分配、可变长数组、无界递归和未审计宏技巧；
- hosted sanitizer 测试与 freestanding target build 分开；
- 编译器、链接器、静态分析器和模拟器输出进入不同证据项；
- 汇编文件、链接脚本和 map 文件可枚举并进入来源记录。

具体 warning 列表、target flags 和链接参数只能在候选最小程序上验证后写入锁文件，不能从
另一个操作系统项目复制后直接宣称有效。

## 6. 当前证据与规范分离

宿主工具可见性属于会变化的 evidence，不能写成稳定工具链规则。本轮只读观察单独保存在
[R0 宿主工具盘点：2026-09-03](evidence/r0-host-inventory-2026-09-03.md)。它显示 repository gate
可运行，而 target toolchain、Linux reference lab 和干净机器恢复仍为 `PENDING`；该观察不能
被写成 R0 已关闭。

## 7. 冻结与重开

工具链子门只有在以下事实同时成立时关闭：

1. 精确锁文件、下载来源和摘要已提交；
2. 干净环境可以按一个非交互入口恢复工具链；
3. hosted checks、target build、binary inspection 和 emulator smoke test 的证据互相分开；
4. 缺失的 Linux、`sched_ext` 或硬件能力被明确标为 `BOUNDARY`；
5. 首次失败、修复和重验记录均被保留。

更换编译器族、target triple、启动交接格式或模拟器机器型号必须重开本子门。补丁版本升级可以
追加新证据线，但不能覆盖旧锁和旧失败。
