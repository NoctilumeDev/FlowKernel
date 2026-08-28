# 前人工作与阅读地图

本文档是 R0 之前的初始阅读地图，不是系统性文献综述。条目只说明 FlowKernel 应从哪里
建立基线，不能据此宣称研究问题新颖或方案有效。正式开题前必须补充检索方法、时间范围、
纳入标准和引用版本。

## 保护、能力与可信边界

- [Saltzer 与 Schroeder：The Protection of Information in Computer Systems](https://web.mit.edu/Saltzer/www/publications/protection/)：
  提出 economy of mechanism、fail-safe defaults、complete mediation、separation of privilege、
  least privilege 等经典原则。FlowKernel 应把它们作为可信核心和权限动力学的起点，而不是
  把“C Guard”当作新发明。
- [seL4 Capabilities Tutorial](https://docs.sel4.systems/Tutorials/capabilities.html)：能力是指向
  对象、携带访问权的不可伪造授权载体。它用于校准 `Capability`、Object 与 authority 的词义；
  当前不意味着 FlowKernel 已决定采用 seL4、微内核或 CSpace 设计。
- [seL4 Capability Distribution Language](https://docs.sel4.systems/projects/capdl/index.html)：
  capability distribution 会限制系统未来可达状态，可作为静态权限图和最小系统描述的研究
  参照。
- [NIST Separation of Duty](https://csrc.nist.gov/glossary/term/separation_of_duty)：说明职责与访问
  授权可以被拆分，从而减少单一主体独立滥用系统的风险。FlowKernel 只把它作为未来高风险
  governance transition 的候选原则，不在单维护者阶段伪造多人治理。

## Runtime assurance 与不可信策略

- [NASA：A Formal Verification Framework for Runtime Assurance](https://ntrs.nasa.gov/citations/20240006522)：
  Simplex runtime assurance 允许不可信高级控制器工作，并在安全条件不满足时切换到可信回退
  控制器。它是“学习策略可失效、确定性 fallback 必须独立存在”的直接参照。
- FlowKernel 的边界比单一控制器切换更宽：还需要 Principal、Capability、来源记录、资源隔离
  和外部事实验收。不能因结构相似就宣称已经继承 Simplex 的形式化保证。

## 来源记录、供应链与可复现性

- [W3C PROV-O](https://www.w3.org/TR/prov-o/)：以 Entity、Activity、Agent 及 derivation、
  attribution、delegation 等关系表达来源。FlowKernel 可以借用词义和最小关系，不预设 RDF、
  图数据库或完整 PROV 实现。
- [in-toto Specifications](https://in-toto.io/docs/specs/)：提供软件供应链步骤、材料、产物和
  attestations 的成熟表达。它约束“谁声称做了什么”，但 attestation 仍需身份与验证策略。
- [SLSA Provenance](https://slsa.dev/spec/v1.2/provenance)：把 provenance 定义为可验证地追踪
  软件工件从哪里、何时、怎样产生的信息。FlowKernel 需要区分来源记录与业务真值，不能把
  provenance 字段齐全当成事实正确。
- [Reproducible Builds：Making plans](https://reproducible-builds.org/docs/plans/)：要求固定或记录
  构建环境、引入环境变化并提供简单的比较协议。它为 R0 干净机器恢复和供应链反查提供基线。

## Linux 机制与观测

- [Linux `sched_ext` 文档](https://docs.kernel.org/scheduler/sched-ext.html)：可动态加载 BPF
  调度器，并在错误、任务停滞等情况下恢复默认调度行为。它是早期策略实验和确定性回退的
  主要候选边界。
- [`sched-ext/scx`](https://github.com/sched-ext/scx)：上游生态中的调度器和工具集合，
  用于建立现有实现基线，避免从演示样例重新发明实验框架。
- [Control Group v2](https://docs.kernel.org/admin-guide/cgroup-v2.html)：提供层级化 CPU、
  内存、I/O 和进程组织机制，是 workload 资源包络和最低保障的候选执行层。
- [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html)：量化 CPU、内存
  和 I/O 资源竞争造成的停滞时间，可作为“资源消耗”之外的生产力损失观测。
- [Linux BPF 文档](https://docs.kernel.org/bpf/)：覆盖 verifier、maps、helper、kfunc 和
  用户态交互。任何 BPF 方案必须继承其验证、权限和可调试边界。

## workload、容器与恢复

- [OCI Runtime Specification](https://github.com/opencontainers/runtime-spec)：定义容器
  runtime bundle、生命周期和 Linux 隔离接口，是 workload 抽象与运行时边界的基线。
- [CRIU](https://github.com/checkpoint-restore/criu)：提供 Linux 用户空间 checkpoint/restore
  实现。R6 的迁移研究应先验证其适用范围、内核依赖和不可迁移资源，而不是假设任意任务都
  能透明迁移。

## 集群资源管理

- [Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/)：
  展示 admission control、任务放置、资源超卖、隔离和故障恢复的生产级权衡，为多节点
  阶段提供非学习型基线。

## 学习型调度

- [DeepRM](https://people.csail.mit.edu/alizadeh/papers/deeprm-hotnets16.pdf)：使用深度强化
  学习处理多资源集群调度，是“学习策略是否超过启发式规则”的早期代表工作。
- [Decima](https://doi.org/10.1145/3341302.3342080)：学习数据处理集群的调度策略，并在
  真实 Spark 集群中评估。FlowKernel 必须区分集群 DAG 调度与操作系统资源机制，不能直接
  把其结论外推到内核路径。
- [Constrained Policy Optimization](https://proceedings.mlr.press/v70/achiam17a)：研究带
  约束的策略优化。它可以作为安全学习的理论参照，但不能替代 FlowKernel 的确定性 Guard
  和硬不变量。

## 与 FlowKernel 的差异待证

当前只能提出五项待检验差异，不能表述为贡献：

1. 将 workload 生命周期、检查点距离和有效进展作为长期策略状态；
2. 将学习建议与拥有最终否决权的确定性执行边界组合；
3. 同时评价连续性、饥饿、恢复和控制开销，而不是只优化平均完成时间。
4. 让 Human、Agent、Service 和策略源通过同一有界授权语义参与动作，而不共享隐藏 God Mode；
5. 将授权、执行、来源记录和外部事实验收分层，并验证错误影响与工程恢复边界。

R0 开始前，需要建立文献矩阵，逐项记录问题、状态、动作、目标、约束、实验环境和公开
局限。若已有工作覆盖上述差异，应修改研究问题，而不是维护预设的新颖性。

## Linux reference lab 的许可证边界

FlowKernel 当前仓库使用 Apache-2.0；Linux 内核源码遵循其自己的 GPL-2.0-only 与兼容许可证
规则。Linux、`sched_ext`、eBPF 和相关实现可以用于运行、调用、测量、阅读与对照，但不能
因为“只是参考实验”就把源代码无来源复制进 Apache-2.0 core。

- [Linux kernel licensing rules](https://docs.kernel.org/process/license-rules.html) 是内核源码
  SPDX 与许可证规则的权威入口；
- [Apache License v2.0 and GPL compatibility](https://www.apache.org/licenses/GPL-compatibility)
  说明 Apache-2.0 与 GPLv2 的兼容性限制。

未来每份代码贡献都需要记录原始来源、SPDX 标识和是否复制/修改代码；不确定时停止合入并
寻求合适的许可证审查。这里记录的是工程风险边界，不是法律意见。
