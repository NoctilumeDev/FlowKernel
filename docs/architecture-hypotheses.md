# 架构假设

以下内容是待实验验证的候选结构，不是最终架构承诺。

## H1：机制与策略应严格分离

Linux 和确定性控制器提供有限动作：调整 quota/weight、限流、退避、暂停、恢复、检查点、
迁移和放置。规则或学习系统只在动作集合内提出建议，不能绕过执行层。

预期收益是策略可以独立迭代、回放和回滚；需要验证的代价是跨层状态同步与控制延迟。

## H2：Fast Path 与 Slow Path 必须分离

Fast Path 处理即时机制，Slow Path 处理长期策略。Slow Path 超时或失效时，Fast Path 仍需
独立维持系统运行。

首个原型不会让模型参与每个 CPU 时间片决策。

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

容器、cgroup 和应用侧探针可以提供较完整的实验边界，但必须测量探针开销和错误信号。

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

Guard 至少负责：

- 拒绝超出硬资源上限或权限边界的动作；
- 保留内核、控制器和关键任务的紧急资源；
- 维护最低 CPU/内存保障和 no-starvation 约束；
- 限制单位时间内的动作幅度与频率；
- 在有效 checkpoint 不存在时拒绝迁移；
- 在策略超时、异常或不可用时切回确定性规则。

这些约束通过代码、模型检查或可重复测试验证，不通过 reward 间接表达。

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
