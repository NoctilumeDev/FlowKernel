# 愿景与边界

## 问题来源

传统资源调度擅长处理瞬时状态：优先级、可运行队列、CPU 时间、I/O 等待、内存压力和
负载均衡。长周期 Agent、编译、测试、训练和推理 workload 则会暴露另一类问题：两个
资源占用相似的任务，可能分别处于“接近检查点并持续收敛”和“重复失败且没有进展”的状态。

FlowKernel 研究系统能否在不放弃确定性安全边界的前提下，将生命周期和长期进展加入
资源策略。

核心研究问题是：

> Can an operating system understand not only how much resource a workload
> consumes, but also where that workload is in its lifecycle, whether it is
> making meaningful progress, and whether preserving its continuity is more
> valuable than maximizing short-term utilization?

## “AI 操作系统”的含义

本项目中的 AI Operating System 不是“由模型接管内核”。它表示在传统机制之上增加一个
受约束的长期策略层：

```text
Observe -> Represent -> Propose -> Guard -> Act -> Measure
```

系统工程中的许多控制器最终都在遍历有状态实体，根据观测和规则作出动作。FlowKernel
研究的是能否让学习策略承担一部分原本由人工阈值和启发式规则完成的 `Decide`，同时保留
人类定义的状态空间、动作边界、安全不变量和执行主权。

## 研究边界

### Fast Path

微秒到毫秒级机制必须保持确定性，包括中断、上下文切换、锁、内存页分配和基本抢占。
模型推理不进入这些路径。

### Slow Path

秒级到分钟级策略可以研究 AI 辅助，包括：

- 资源预算和最低保障调整；
- workload 阶段与异常模式识别；
- 限流、退避、暂停和恢复；
- 检查点时机、任务放置和迁移建议；
- 长期优先级和多目标策略更新。

### 调度对象

研究对象从裸进程逐步扩展为具有生命周期、依赖、健康状态、检查点和资源包络的 workload。
容器和 cgroup 是早期实验边界，不是最终目标本身。

## 成功标准

FlowKernel 的成功不以“写出多少内核代码”衡量，而以是否能够：

1. 定义可观测、可复现的 workload 生命周期；
2. 证明新策略相对传统基线改善了明确指标；
3. 在故障、奖励投机和模型异常时守住硬不变量；
4. 给出策略收益、推理开销和复杂度成本的完整权衡；
5. 让失败实验同样可以复现并形成结论。

## 非目标

- 预先承诺完整自制内核；
- 用“AI”替代缺失的状态机和安全设计；
- 只展示吞吐量而忽略饥饿、失败和恢复；
- 把单机缩比实验描述为生产集群结论；
- 为满足路线图而强行选择强化学习。

如果简单规则在特定问题上持续优于学习策略，应保留简单规则并记录该结论。
