# 前人工作比较矩阵

状态：`R0 COMPARISON BASELINE · 2026-09-03`

本矩阵把相似词汇拆回实际职责。来源编号见[主要参考文献](references.md)，检索和证据等级见
[文献审查协议](literature-review-protocol.md)。`—` 表示来源没有公开该语义，不能自行补成
“默认支持”。

| 基线 | 问题 | 状态 | 动作 | 目标 | 策略更新时机 | 最终 authority | 验证者 | fallback | 环境 | 证据强度 | 公开限制 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Microsoft Agent Harness 与 Agent 工程指南 (`HAR-02`, `HAR-03`) | 长任务 Agent 脚手架 | 会话、上下文、待办、模式、文件与工具状态 | 模型/工具循环和审批 | 应用工具与会话 | 每轮或长任务过程中 | 宿主应用/审批策略 | Harness policy 与人工审批 | 停止、拒绝或应用定义 | Python/.NET 等应用 | `DOC` | 不提供 OS Capability 根、调度热路径或硬资源隔离 |
| Progent (`HAR-01`) | Agent 工具最小权限 | 工具调用上下文与策略 | 允许、拒绝并选择 fallback | Agent 可调用工具 | Agent 执行期 | 可编程策略执行器 | 确定性策略检查 | 被拒动作的替代路径 | Agent 工具层 | `PREPRINT` | 不等同内核资源所有权、恢复后授权或独立事实验收 |
| AIOS (`HAR-05`, `HAR-06`) | LLM Agent 的调度和资源服务 | Agent、上下文、记忆、工具等 runtime 状态 | 调度、切换和管理 Agent 资源 | LLM/工具/上下文等应用层资源 | Agent runtime 执行期 | AIOS kernel/runtime | 实现内检查与实验评价 | 实现定义 | 常规宿主 OS 上的 Agent runtime | `PAPER` + `ARTIFACT` | “OS”是 Agent 服务抽象，不是自研硬件机制或 FlowKernel C target |
| AgentRM (`HAR-07`) | Agent 阻塞、僵尸、限流与上下文退化 | Agent turn、lane 与 context tier | MLFQ、reaping、admission 与 compaction | Agent runtime 资源 | 运行时 | 中间件 resource manager | runtime 检查与实验指标 | backoff、reap、hibernate | 常规 Agent 框架中间件 | `PREPRINT` | 预印本；管理 Agent/runtime 资源，不承担 OS 权限根 |
| Agent libOS (`HAR-08`, `HAR-09`) | 长期 Agent 的进程、工具和 Capability | AgentProcess、对象、工具与持久 runtime 状态 | 调度、中断、授权、恢复和工具调停 | Agent runtime 对象与外部工具 | 运行时和显式发布/恢复点 | libOS runtime | capability/policy/持久状态检查 | 拒绝、等待人工、恢复 | 宿主 OS 之上的 library OS | `PREPRINT` + `ARTIFACT` | 明确不是硬件驱动、内核态隔离或 POSIX OS；不能替代 FlowKernel target 证据 |
| Simplex/RTA 与 shielding (`SAFE-01`, `SAFE-02`) | 不可信高级策略的安全执行 | 安全条件、控制器状态或形式化抽象 | 监视、阻断、纠正或切换控制器 | 控制动作 | 每次控制决策 | 可信 monitor/switch/shield | 形式条件或合成 shield | 可信安全控制器/安全动作 | 特定形式模型与控制环境 | `REPORT` + `PAPER` | 保证依赖模型与规范；不能直接继承到 OS 生命周期和 Capability |
| cgroup v2、PSI、BPF (`LIN-04`-`LIN-06`) | Linux 资源包络、压力与可编程机制 | cgroup 层级、资源控制和压力指标 | 限制、分配、观测和执行 BPF 程序 | Linux task/cgroup 与内核 hook | 配置时或运行时机制调用 | Linux 内核与特权控制方 | 内核规则/BPF verifier | 控制器定义或内核拒绝 | Linux | `DOC` | 不理解工作流目标、Agent 计划或外部业务事实 |
| `sched_ext` / `scx` (`LIN-01`-`LIN-03`) | 可替换 Linux CPU 调度策略 | task、CPU、DSQ 与调度器状态 | 选择 CPU、入队、派发 | Linux CPU task | 调度事件与动态加载时 | Linux scheduler core | BPF verifier、watchdog 与错误检测 | 恢复默认调度行为 | 支持 `sched_ext` 的 Linux | `DOC` + `ARTIFACT` | 是 Linux 实验/部署机制，不证明 FlowKernel 自研内核或 Agent governance |
| SchedCP (`AGOS-01`, `AGOS-02`) | Agent 自动分析并优化 Linux scheduler | workload profile、策略库、候选代码/配置 | 选择、生成、验证、部署和监控 scheduler | `sched_ext`/eBPF 调度策略 | 慢控制面与部署阶段 | SchedCP control plane + Linux mechanism | 静态检查、BPF verifier、microVM/执行验证 | token、canary、circuit breaker、旧策略 | Linux + `sched_ext` + Agent control plane | `PREPRINT` + `ARTIFACT` | 预印本/公开 artifact；不证明 C-first target、通用运行时 Proposal 或完整 Capability 动力学 |
| Kgent (`AGOS-03`) | 自然语言生成 eBPF 内核扩展 | 提示、候选程序和验证反馈 | 合成并校验 eBPF | 内核扩展程序 | 生成/验证阶段 | 工具链和部署方 | 程序理解、符号执行、eBPF verifier | 拒绝或继续反馈 | Linux/eBPF 实验 | `PAPER` | 重点是代码合成，不是长期资源 authority、生命周期或独立事实验收 |
| OCI / CRIU (`RUN-01`, `RUN-02`) | workload 隔离接口与检查点恢复 | runtime bundle、进程与可恢复状态 | 创建/执行/停止或 checkpoint/restore | Linux 容器和进程 | 生命周期边界 | runtime/宿主 OS | 规范检查与内核/工具行为 | 操作失败、保留/恢复策略由上层定义 | Linux 用户空间 | `SPEC` + `ARTIFACT` | 不保证任意外部资源可迁移，也不定义 FlowKernel authority |
| Borg、DeepRM、Decima、CPO (`CLUSTER-01`, `LEARN-01`-`LEARN-03`) | 集群放置、学习型调度和约束优化 | 资源、队列、DAG 或策略状态 | admission、placement 或学习策略动作 | 集群 job/task | 调度周期或训练/部署阶段 | 集群控制器或策略执行框架 | 规则、约束或实验评价 | 基线调度/系统定义 | 数据中心、模拟器或 Spark 集群 | `PAPER` | 研究对象与 OS 机制不同；结果不能跨 workload 和环境直接外推 |

## 三层对照结论

```text
Agent Harness / Agent runtime
    负责意图、计划、上下文、工具和应用层资源
                 │ typed proposal only
                 ▼
Deterministic authority boundary
    负责 Principal、Capability、状态所有权与 Guard
                 │ bounded command only
                 ▼
OS resource mechanism
    负责 CPU、内存、I/O、隔离、调度与恢复动作
```

第一层越狱最多应产生违规 Proposal；如果它可以签发权限、修改 Guard 或直达机制，失败就是跨层
权限提升。第三层只落实已经授权的有限命令，不解释 Prompt 或业务重要性。中间层是 FlowKernel
计划验证的安全断点，但当前尚未实现，因此这张图是合同假设，不是安全保证。

## FlowKernel 尚待反证的组合差异

现有工作已经覆盖 Agent loop、工具策略、Agent 级资源管理、Capability-controlled runtime、
学习型调度、Agentic Linux scheduler control plane、内核扩展生成、runtime assurance 和受监控
回退。FlowKernel 只能继续检验更窄的组合：

- 多种策略源在运行时提交同类型、有限、可回放的 Proposal；
- 独立 C-first authority 依据 Capability、生命周期和硬资源不变量裁决；
- 自研 target 与 Linux reference lab 使用同一语义合同但保留不同事实线；
- 授权、执行、Observation、AcceptanceVerdict 与 EpistemicStatus 分别拥有状态；
- Harness 失守不会自然获得 authority 或机制入口。

若 Agent libOS、AIOS、SchedCP、直接 Linux 机制或更简单的组合以更低复杂度满足首个实验目标，
FlowKernel 必须缩小研究范围，而不是维持预设差异。
