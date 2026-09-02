# 文献审查协议

状态：`R0 LITERATURE PROTOCOL · CLOSED 2026-09-03`

本协议记录 R0 文献基线怎样形成。它是面向架构与实验设计的有界工程审查，不是系统性文献
综述、穷尽性历史或新颖性意见。

## 审查目标

审查回答两个问题：已有系统分别掌握哪些机制；FlowKernel 的哪些陈述仍然只是需要反证的
组合假设。分析单位是职责、权力、动作、状态、验证和失败边界，而不是项目名称。

## 时间与检索边界

- 截止日期：2026-09-03。
- 检索面：官方规范、官方项目文档、原始论文/机构报告和维护者拥有的 artifact。
- 主题族：保护原则、Capability、Agent Harness、工具权限、Agent runtime、runtime assurance、
  shielding、来源与可复现性、Linux cgroup/PSI/BPF/`sched_ext`、Agentic scheduler control plane、
  checkpoint/restore、集群资源管理、学习型调度和许可证边界。
- 对关键新近方向使用组合检索：`agent harness + resource management`、`agent operating system +
  scheduling`、`capability-controlled agent runtime`、`LLM + sched_ext`、`runtime assurance +
  untrusted controller`。
- 引用追踪只用于发现主要来源；二手摘要不进入决策证据。

## 纳入与排除

来源只有在直接定义、实现或评估至少一个研究问题所需的机制，并可归属于标准组织、项目
维护者或原作者时纳入。

排除无技术依据的营销比较、无法追溯到主要来源的性能数字、复述上游的教程，以及由本项目
文档自身循环证明的主张。未被纳入不等于无关；它只表示不属于本轮 R0 有界基线。

## 证据等级

| 类型 | 可用于证明 | 不能自动证明 |
| --- | --- | --- |
| `SPEC` | 采用该规范时必须遵守的语义与边界 | 某实现正确、快速或适合 FlowKernel |
| `DOC` | 官方维护者公开描述的接口和行为 | 未公开失败模式或生产效果 |
| `PAPER` | 作者在给定方法和环境下发表的设计与结果 | 跨 workload、跨平台或跨层外推 |
| `PREPRINT` | 可检查的候选设计、方法与报告结果 | 同行评审已完成或结论已稳定 |
| `REPORT` | 机构报告明确记录的模型、方法或结果 | 超出报告适用域的保证 |
| `ARTIFACT` | 可检查、可尝试复现的实现范围 | 论文结论已复现或实现可生产使用 |

## 三条证据线必须分开

1. **Harness/Agent runtime 线**：Prompt、上下文、记忆、计划、工具调用、Agent 级进程和应用层
   resource policy。它不能替代 OS 权限根和硬资源机制。
2. **Linux reference lab 线**：cgroup、PSI、BPF、`sched_ext`、容器与恢复机制。它可以执行和
   测量，但不自动理解业务目标、工作流事实或 FlowKernel target 的自研内核语义。
3. **FlowKernel target 线**：受限 C、Capability、生命周期、确定性 Guard、有限执行器和独立
   验收。这是待实现、待验证的研究对象，不得借用前两条线的成功状态。

三条线通过版本化 Proposal、Capability、Observation、Acceptance 和 Evidence 合同交接，
不得共享凭据、可变状态、最终 authority 或故障域。分层不要求把每层拆成微服务；进程和
地址空间边界只由威胁、故障和资源隔离证据决定。

## 综合方法

1. 在[主要参考文献](references.md)中分配稳定编号和证据类型。
2. 在[前人工作比较矩阵](prior-art-matrix.md)中逐项记录问题、状态、动作、目标、更新时机、
   authority、验证者、fallback、环境、证据强度和公开限制。
3. 在[研究证据追踪](research-evidence-traceability.md)中把来源、未决问题和 R 阶段对应。
4. 正面证据与反证控制同等保留；更简单的现有方案能满足目标时，FlowKernel 必须收缩。
5. 观察事实、工程推断和未来假设分别标注，不能互相升级。

## 版本、链接与更新

版本化规范和正式出版页优先。活文档和活动分支只用于发现；进入 ADR 或实验时必须固定版本、
修订或 commit。外部链接可达性在审查时观察，但不作为确定性 CI 门禁，因为网络可达不等于
来源质量，网络不可达也不等于仓库结构错误。

R0 关闭本轮基线，不冻结未来文献。新机制、上游语义变化或直接反证出现时，只重开受影响的
研究问题和阶段门禁；新增条目必须包含编号、证据等级、访问日期、归属 RQ 和使用它的决策或
实验。
