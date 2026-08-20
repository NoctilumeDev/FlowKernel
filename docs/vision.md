# 愿景与边界

## 问题来源

传统资源调度擅长处理瞬时状态：优先级、可运行队列、CPU 时间、I/O 等待、内存压力和
负载均衡。长周期 Agent、编译、测试、训练和推理 workload 则会暴露另一类问题：两个
资源占用相似的任务，可能分别处于“接近检查点并持续收敛”和“重复失败且没有进展”的状态。

FlowKernel 的长期目标是构建一个 C-first 实验内核，研究系统能否在不放弃确定性安全边界
的前提下，将生命周期和长期进展加入资源策略。

核心研究问题是：

> Can an operating system understand not only how much resource a workload
> consumes, but also where that workload is in its lifecycle, whether it is
> making meaningful progress, and whether preserving its continuity is more
> valuable than maximizing short-term utilization?

## “AI 操作系统”的含义

本项目中的 AI Operating System 不是“由模型接管内核”。它表示一个以受限 freestanding C
为可信核心、以显式生命周期状态机组织资源、在慢路径接受受约束策略建议的实验系统：

```text
Observe -> Represent -> Propose -> Guard -> Act -> Measure
```

系统工程中的许多控制器最终都在遍历有状态实体，根据观测和规则作出动作。`if`、`for`
和 `while` 可以表达控制流，但系统是否可靠取决于状态、所有权、预算、退出条件和失败闭环
是否明确。FlowKernel 研究的是能否让学习策略承担一部分原本由人工阈值和启发式规则完成的
`Propose`，同时由 C 状态机和 Guard 保留动作边界、安全不变量和执行主权。

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
5. 给出策略收益、推理开销和复杂度成本的完整权衡；
6. 让失败实验同样可以复现并形成结论。

## 非目标

- 立即承诺一个可替代 Linux 的完整通用操作系统；
- 把“使用 C”本身当作内存安全或正确性证明；
- 在最小闭环前同时实现驱动生态、文件系统、网络栈、多核和分布式控制；
- 用“AI”替代缺失的状态机和安全设计；
- 只展示吞吐量而忽略饥饿、失败和恢复；
- 把单机缩比实验描述为生产集群结论；
- 为满足路线图而强行选择强化学习。

如果简单规则在特定问题上持续优于学习策略，应保留简单规则并记录该结论。
