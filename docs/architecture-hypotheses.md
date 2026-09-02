# 架构假设

以下内容是待实验验证的候选结构，不是最终架构承诺。

## H0：可信核心应当 C-first、最小且可旁路 AI 运行

FlowKernel target 的内核主体使用受限 freestanding C。启动、中断入口和上下文切换允许
架构必需的最小汇编，但策略逻辑不能越过 C 接口边界。内核必须在模型完全缺席时依靠
确定性基线完成启动、运行、停止和资源回收。

预期收益是控制流、ABI、内存布局和故障边界可直接审查；需要验证的代价是 C 未定义行为、
手工所有权、并发与中断安全所带来的验证成本。

## H1：机制与策略应严格分离

FlowKernel 的 C 执行器提供有限动作：调整预算或权重、限流、退避、暂停、恢复、检查点、
迁移和放置。Linux reference lab 使用 cgroup、`sched_ext`、eBPF 和确定性控制器表达相同的
对照动作。规则或学习系统只在动作集合内提出建议，不能绕过 Guard 和执行层。

Agent Harness 若被接入，只属于不可信策略侧。它可以管理 Prompt、上下文、记忆、规划和工具
选择，但只能生成版本化 Proposal；权限边界独立完成 Capability 与状态校验，资源机制只接受
已经授权并截断到资源包络内的命令。三者不得共享可绕过合同的调用路径、凭据或可变控制状态。

严格分层不预设微服务化。候选实现优先保持同一仓库、同一工具链和能够完成纵向闭环的高内聚
C 模块；只有 Harness 等不可信调用者或经威胁模型证明需要隔离的组件才增加进程、身份或地址
空间边界。模块数量、服务数量和安全边界不能互相冒充。

预期收益是策略可以独立迭代、回放和回滚，Harness 失守也不自然升级为资源控制权；需要验证
的代价是跨层状态同步、权限衰减、控制延迟和隔离机制自身的复杂度。

## H2：Fast Path 与 Slow Path 必须分离

Fast Path 处理即时机制，Slow Path 处理长期策略。Slow Path 超时或失效时，Fast Path 仍需
独立维持系统运行。

首个原型不会让模型参与每个 CPU 时间片决策，也不会把模型服务设为启动依赖。

## H3：workload 是比裸进程更合适的早期对象

候选 workload 模型包含：

```text
identity
lifecycle_state
resource_envelope
dependencies
health
progress_evidence
retry_history
checkpoint_state
migration_constraints
minimum_guarantees
```

FlowKernel 内核事件和静态任务描述提供目标侧观测；容器、cgroup 和应用侧探针提供 Linux
对照侧观测。两边都必须测量探针开销、错误信号和语义差异。

## H4：学习策略之前必须有规则基线

预定演进顺序是：

```text
static rules
  -> adaptive thresholds
  -> imitation learning
  -> offline reinforcement learning
  -> bounded online adaptation (only if justified)
```

任何阶段如果无法稳定超过更简单的基线，就不进入下一阶段。

## H5：安全 Guard 拥有最终否决权

C Guard 至少负责：

- 拒绝超出硬资源上限或权限边界的动作；
- 保留内核、控制器和关键任务的紧急资源；
- 维护最低 CPU/内存保障和 no-starvation 约束；
- 限制单位时间内的动作幅度与频率；
- 在有效 checkpoint 不存在时拒绝迁移；
- 在策略超时、异常或不可用时切回确定性规则。

这些约束通过 C 代码审查、静态分析、模型检查或可重复测试验证，不通过 reward 间接表达。
这里的“最终”只指运行时授权链：Guard 有权拒绝动作，但无权把执行结果直接宣布为世界事实；
Guard 自身、硬不变量和 authority root 的修改还必须经过独立治理路径。

## H6：Attention 只负责“看什么”

状态筛选层用于从 CPU、memory、I/O、network、queue、locks、progress、retry、checkpoint
和 dependency 等观测中提取决策上下文。它不直接获得执行权。

必须比较 Attention 与人工特征、简单降维和完整状态输入，避免把额外复杂度误认为收益。

## H7：多节点策略必须容忍不完美全局状态

未来的多节点控制器不假设零延迟全局真相。候选设计需明确：

- 状态新鲜度与版本；
- 决策租约和执行所有权；
- checkpoint 与恢复幂等键；
- 网络分区时的本地安全策略；
- 控制平面恢复后的对账与收敛。

多节点研究只有在单机生命周期模型和 Guard 已经验证后才开始。

## H8：所有行动主体应进入同一有界授权模型

Human、Agent、Service 和策略运行时都以 Principal 身份发起或承担行动责任。规则、模型与
policy 是 Principal 使用的版本化 Artifact，不自行持有 Capability。候选 Capability 将特定
Object、动作权利、范围、预算、时限和版本绑定起来；模型能力、作者身份或人工批准不能形成
隐藏旁路。

预期收益是最小权限、委托、撤销和责任边界可以统一检查；需要验证的代价是 capability
传播、撤销缓存、在途动作和恢复所有权带来的复杂度。当前不预选具体能力表示。

## H9：授权、执行与事实应是不同协议

候选控制链是：

```text
intent
  -> typed proposal
  -> authorization
  -> bounded action
  -> observation
  -> external acceptance
```

C 可信核心对授权和执行完整调停，并锚定 Principal、Capability、输入版本、前后状态和恢复
引用。外部 Acceptance 读取运行与工件事实，给出验证、反驳或未验证结果；它不能修改被验对象
来制造通过。

预期收益是一次“成功调用”不会被误当成目标成立；需要验证的代价是来源记录、身份完整性、
外部事实源和冲突裁决的成本。W3C PROV 或供应链 attestations 只能作为词义与格式参考，不被
预设成实现依赖。

## H10：故障容纳与恢复应成为一级合同

FlowKernel 不要求策略永远正确，而要求错误影响停留在获授权的隔离域内。资源包络、动作幅度、
速率、租约、停止线、紧急保留、checkpoint 和确定性 fallback 都应能被单独触发和验证。

恢复对象不只包括 workload。研究还应区分运行时迁移、干净机器重建、凭据撤销与重签发、
维护者更换和仓库对象恢复。后几项主要属于工程治理，不得为了“统一”强塞进最小 C 内核。

预期收益是 AI、服务、人类或托管平台的错误不自然升级为全局事故；需要验证的代价是恢复路径
自身的状态空间、保留资源和长期维护成本。
