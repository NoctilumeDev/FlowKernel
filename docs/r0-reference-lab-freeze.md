# R0 Linux Reference Lab 冻结合同

状态：`R0 PROTOCOL FROZEN · FIRST EVIDENCE RUN PENDING`

Linux reference lab 是外部对照、观测实验台和合同夹具，不是 FlowKernel target。它可以帮助
提前发现生命周期、权限、资源和验收设计错误，但其成功状态不得升级成自研内核证据。

## 1. 三条证据线

| 证据线 | 最小内容 | R0 可接受结果 |
| --- | --- | --- |
| Traditional Linux | 默认调度、nice/affinity 和 cgroup v2（可用时） | `PASS / FAIL / BOUNDARY` |
| Extensible scheduler | `sched_ext`/`scx` 的固定版本、样例 scheduler 与 fallback | `PASS / FAIL / BOUNDARY` |
| Agentic control plane | SchedCP artifact 的有界审计或复跑 | `PASS / FAIL / BOUNDARY / PENDING` |

`BOUNDARY` 必须来自真实环境探测，例如宿主内核不支持 `sched_ext`、虚拟化层不暴露所需功能或
硬件预算不足；它不是省略实验的快捷方式。`PENDING` 必须记录负责人问题、前置条件和下一次
重验触发器。

## 2. 共同 workload fixture

三条线必须使用同一版本的 workload 描述和资源预算。R0 最小集合包括：

- CPU-bound：确定性计算循环，记录工作量和进度；
- I/O-bound：固定数据规模和同步策略的读写；
- memory pressure：阶梯式申请、触碰和释放，受宿主 stop line 限制；
- retry：固定失败序列、退避和最大尝试次数；
- long-running：分段进度、checkpoint 候选点和可控终止；
- mixed：至少两类 workload 竞争同一受限资源。

每个 fixture 声明 identity、版本、seed、持续时间、并发含义、资源包络、停止条件、进度信号、
预期退出方式和允许残留。随机扰动必须保存 seed；第一次失败 fixture 不得被成功重跑覆盖。

## 3. 共同动作合同

R0 lab 只允许有限动作集合，例如：

```text
SET_CPU_WEIGHT
SET_CPU_QUOTA
SET_MEMORY_HIGH
SET_IO_WEIGHT
PAUSE
RESUME
TERMINATE
RESTORE_BASELINE
```

实际可用动作由宿主能力和权限决定。每次动作都必须经过
[R0 最小交接合同](r0-contract-freeze.md)中的 Principal、Capability、Proposal、Guard verdict、
ExecutionAttempt、Observation 和 Acceptance 交接；不允许测试脚本绕过 Guard 直接取得更高权限
后再声称权限边界有效。

## 4. 对照与唯一变量

每次实验只改变一个控制变量，并至少包含：

1. 无 Agent、无学习策略的宿主默认基线；
2. 同预算的确定性规则基线；
3. 被研究的 scheduler 或 agentic control-plane 候选（环境允许时）。

基线共享 workload、持续时间、预热、采样、资源预算和 stop line。不能让候选策略获得更高
权限、更宽资源或更长运行时间后再报告收益。

## 5. 独立读回

动作命令退出为零只说明命令报告成功。Acceptance 必须从动作入口以外的事实源读回：

- cgroup v2 文件中的实际配置和统计；
- `/proc` 中的进程、调度、内存和 I/O 状态；
- PSI、perf、eBPF 或 hardware counter（可用且已声明时）；
- workload 自身的只读进度与 checkpoint 记录；
- 退出码、信号、残留进程、残留 cgroup 和恢复后的最终状态。

如果命令结果、内核状态和 workload 观察冲突，Acceptance 必须输出 `INCONCLUSIVE` 或 `FAIL`，
不得选择最有利的数据源。

## 6. 安全包络

- R0 默认只操作 lab 创建且可枚举的进程、目录和 cgroup；
- 不修改宿主默认 scheduler、系统级网络、登录服务或非 lab workload；
- 需要 root、BPF 或 `sched_ext` 权限的步骤必须单独声明，并提供恢复和残留检查；
- memory、CPU、I/O、进程数、磁盘和运行时间都设置宿主 stop line；
- watchdog、手工终止和恢复基线不依赖 Agent Harness；
- 清理前先保存失败证据，清理后独立检查残留；
- Docker、WSL、虚拟机和原生 Linux 的结果进入不同环境线。

## 7. 证据包

一次 lab run 至少产生：

```text
manifest
environment
toolchain lock reference
contract and fixture identities
raw observations
proposal / authorization / execution chain
acceptance verdicts
metrics and summary
failure and recovery record
residual-state check
known boundaries
```

具体文件编码在机器夹具实现时冻结，但原始观察、派生摘要和验收 verdict 必须分开。报告图表
不能替代原始数据。

## 8. R0 退出条件

Reference lab 子门只有在以下条件满足时关闭：

- Traditional Linux 基线在固定 Linux 环境完成至少一次干净运行和一次命名失败运行；
- 相同 fixture 在确定性规则基线运行，预算和唯一变量可审查；
- `sched_ext`/`scx` 和 SchedCP 分别得到 `PASS`、`FAIL` 或有环境证据的 `BOUNDARY`；
- Harness 旁路、越权 Proposal、Guard 拒绝、资源耗尽和恢复用例具有独立读回；
- 证据包能在运行进程退出后由非交互 verifier 检查；
- 清理后没有超出声明范围的残留进程、cgroup、挂载或临时文件；
- 从干净克隆可重复建立 lab，不依赖作者记忆或隐藏宿主状态。

当前宿主观察见
[R0 宿主工具盘点：2026-09-03](evidence/r0-host-inventory-2026-09-03.md)。当前尚无可用通用
Linux 环境，因此本子门仍为 `PENDING`，不得据此进入 R1；后续环境变化只追加新证据记录。
