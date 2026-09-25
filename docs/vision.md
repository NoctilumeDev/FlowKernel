# 愿景与边界

## 问题来源

传统资源调度擅长处理瞬时状态：优先级、可运行队列、CPU 时间、I/O 等待、内存压力和
负载均衡。长周期 Agent、编译、测试、训练和推理 workload 则会暴露另一类问题：两个
资源占用相似的任务，可能分别处于“接近检查点并持续收敛”和“重复失败且没有进展”的状态。

FlowKernel 的长期目标是构建一个 C-first 实验内核，研究系统能否在不放弃确定性权限、
资源、隔离和恢复边界的前提下，让不完全可靠的策略源参与长期资源与执行决策。

原始资源研究问题仍然是：

> Can an operating system understand not only how much resource a workload
> consumes, but also where that workload is in its lifecycle, whether it is
> making meaningful progress, and whether preserving its continuity is more
> valuable than maximizing short-term utilization?

后续工程实践把它推进为更上游的问题：

> How can fallible intelligence act without becoming sovereign?

后一个问题不取消前一个。资源调度提供第一个可控实验对象；Principal、Capability、Guard、
来源记录、外部验收和恢复边界说明这类策略凭什么获得行动权，以及行动以后什么才有资格成为
事实。

## “操作系统级信任基座”的含义

FlowKernel 的公开定位是面向不可信智能体执行的 **OS-level trust and execution substrate**。
这里的“操作系统级”描述 authority、隔离、资源所有权、生命周期、撤销、恢复和可观察性的
问题等级，不表示要替代 Linux、Windows 或 macOS，也不表示已经存在跨平台实现。

本项目中的 AI Execution OS 是上述研究方向的简称。当前计划中的实验目标仍是一个以受限
freestanding C 为可信核心、以显式状态机组织特权转换、在慢路径接受受约束策略建议的系统：

```text
Principal -> Intent -> Propose -> Authorize -> Act -> Observe -> Accept
```

系统工程中的许多控制器最终都在遍历有状态实体，根据观测和规则作出动作。`if`、`for`
和 `while` 可以表达控制流，但系统是否可靠取决于状态、所有权、预算、退出条件和失败闭环
是否明确。FlowKernel 研究的是能否让学习策略承担一部分原本由人工阈值和启发式规则完成的
`Propose`，同时由 C 状态机和 Guard 保留动作边界、安全不变量和执行主权。人类审批改变的
是授权条件，不是事实资格；执行器报告成功后，仍需要独立事实源判断目标是否成立。

同一组语义未来可能通过不同 enforcement backend 落到现有宿主：Linux 可以使用 namespace、
cgroup、seccomp、LSM 或其他已验证 primitive；Windows 与 macOS 也需要各自的系统能力映射。
这些只构成待审的可移植性方向。当前仓库只冻结 C-first target 与 Linux reference lab 的研究
边界，不预先宣称 Windows/macOS adapter、统一 ABI 或跨平台兼容已经成立。

FlowKernel 也不尝试让内核理解自然语言“真实意图”。上层必须把人类目标收紧成机器可检查的
Principal、Object、动作、范围、预算、前置状态、租约、撤销和恢复条件；策略只在这些硬约束
内优化目标。事实观察可以来自内核、runtime、journal、独立 monitor 或外部 verifier，但不能
只由被审 Agent 的自我报告取得资格。

详细定义见 [执行操作系统宪法](execution-os-constitution.md)。

## 研究边界

### Fast Path

微秒到毫秒级机制必须保持确定性，包括中断、上下文切换、锁、内存页分配和基本抢占。
这些机制由 C 可信核心和架构必需的最小汇编实现，模型推理不进入这些路径。

### Slow Path

秒级到分钟级策略可以研究 AI 辅助。策略层默认位于可信核心之外或隔离边界内，只能输出
有类型、带版本和有效期的动作建议，包括：

- 资源预算和最低保障调整；
- workload 阶段与异常模式识别；
- 限流、退避、暂停和恢复；
- 检查点时机、任务放置和迁移建议；
- 长期优先级和多目标策略更新。

Slow Path 不是 RL 专属路径。静态规则、启发式、自适应阈值、RL、LLM 和 Agent 都是候选
Policy source，并输出同一种有类型、带 Principal、Object、能力范围和有效期的 Proposal。
若简单规则更好，系统应保留简单规则。

### Agent Harness 与资源机制

通用 Agent Harness 通常负责长任务所需的规划与执行循环、待办、上下文压缩、文件记忆、
工具审批和会话持久化。FlowKernel 不重复实现这些应用层能力，也不把 Harness 纳入可信调度
核心。若未来接入 Harness，它只是一种不可信 Policy source：

```text
Agent Harness
Prompt / Context / Memory / Planning / Tool selection
        |
        | typed ActionProposal; no self-issued authority
        v
Deterministic Authority Boundary
Principal / Capability / Object / Lifecycle / Guard / Budget
        |
        | authorized, clamped and bounded command
        v
OS Resource Mechanism
Scheduler / Memory / I/O / Network / Process / Device / Isolation
```

三层只共享版本化合同与不可变标识，不共享可变状态、凭据、特权执行入口、恢复所有权或故障域。
Harness 不理解中断、页分配和调度器内部结构；资源机制不解释 Prompt、模型置信度或“任务很重要”
之类的 AI 语义。适用平台上的候选实现应优先使用不同进程、地址空间、身份和资源包络建立真实
隔离，但具体 IPC、Capability 表示和部署拓扑仍需由 R0/R1 实验决定。

这张分层图不是微服务拓扑。Agent Harness 作为不可信调用方可以位于独立进程；Authority 与
资源机制则可以留在同一个高内聚的 C 工程或内核镜像中，但各自拥有明确状态、受控入口和单向
依赖。只有跨地址空间能够实质降低声明过的风险时才增加部署单元，不能把每个概念拆成服务，
再用网络、共享数据库或消息总线重新制造更重的耦合。

目标不是证明模型不会被越狱，而是验证：即使 Harness 产生恶意或错误 Proposal，它仍不能自行
扩权、修改 Guard、触碰边界外对象或突破底层硬资源上限。

### Authority 与事实边界

- 人、Agent、服务及策略运行时作为 Principal；规则与模型是由 Principal 使用的版本化 policy
  artifact，不因作者身份、模型能力或人工审批获得隐藏旁路；
- Capability 在其权限模型内携带对特定 Object 的有界 authority，Guard 对每次特权转换完整
  调停；
- C 可信核心决定动作是否获准以及怎样有界执行，不替外部业务世界宣布真值；
- 外部验收读取 runtime、artifact、database、browser 或 verifier 事实，但不直接改写 Guard
  或被验对象；
- 治理权和运行权分开：修改 Guard、硬不变量或 authority root 本身必须形成版本化、可恢复
  的治理变化。

### 调度对象

研究对象从静态任务逐步扩展为具有生命周期、依赖、健康状态、检查点和资源包络的 workload。
FlowKernel target 是最终实验对象；Linux、容器、cgroup、`sched_ext` 和 eBPF 是对照组与
早期实验台，不是最终可信核心。

### 实现边界

- 内核主体使用受限 freestanding C；
- 启动、中断入口和上下文切换允许可枚举的最小汇编；
- Spring Boot 只提供生命周期管理的概念来源，不进入实现依赖；
- Linux reference lab 用于验证假设和建立传统基线，不代表 FlowKernel 已实现能力；
- 确定性基线必须先于 Attention、模仿学习或强化学习可用。

详细边界见 [C-first 内核契约](c-first-kernel-contract.md)。

## 成功标准

FlowKernel 的成功不以“写出多少内核代码”衡量，而以是否能够：

1. 构建可重复启动、停止、回收和故障退出的最小 C 内核闭环；
2. 定义可观测、可回放的 workload 生命周期；
3. 证明新策略相对同预算传统基线改善了明确指标；
4. 在内存错误、状态错误、奖励投机和模型异常时守住硬不变量；
5. 证明错误影响被限制在授权隔离域内，且确定性 fallback 与恢复路径真实可用；
6. 将特权转换绑定到 Principal、Capability、前后状态和恢复引用，并能交给独立验收读回；
7. 给出策略收益、推理开销和复杂度成本的完整权衡；
8. 让失败、边界和未完成实验同样可以复现并形成结论。

## 非目标

- 立即承诺一个可替代 Linux 的完整通用操作系统；
- 把“使用 C”本身当作内存安全或正确性证明；
- 在最小闭环前同时实现驱动生态、文件系统、网络栈、多核和分布式控制；
- 用“AI”替代缺失的状态机和安全设计；
- 把人工审批、日志或执行成功当成最终事实证明；
- 在单维护者阶段宣称多主体治理、去中心化控制或社区连续性已经实现；
- 只展示吞吐量而忽略饥饿、失败和恢复；
- 把单机缩比实验描述为生产集群结论；
- 为满足路线图而强行选择强化学习。

如果简单规则在特定问题上持续优于学习策略，应保留简单规则并记录该结论。
