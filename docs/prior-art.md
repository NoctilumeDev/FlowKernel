# 前人工作与阅读地图

本文档是 R0 之前的初始阅读地图，不是系统性文献综述。条目只说明 FlowKernel 应从哪里
建立基线，不能据此宣称研究问题新颖或方案有效。正式开题前必须补充检索方法、时间范围、
纳入标准和引用版本。

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
  实现。R5 的迁移研究应先验证其适用范围、内核依赖和不可迁移资源，而不是假设任意任务都
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

当前只能提出三项待检验差异，不能表述为贡献：

1. 将 workload 生命周期、检查点距离和有效进展作为长期策略状态；
2. 将学习建议与拥有最终否决权的确定性执行边界组合；
3. 同时评价连续性、饥饿、恢复和控制开销，而不是只优化平均完成时间。

R0 开始前，需要建立文献矩阵，逐项记录问题、状态、动作、目标、约束、实验环境和公开
局限。若已有工作覆盖上述差异，应修改研究问题，而不是维护预设的新颖性。
