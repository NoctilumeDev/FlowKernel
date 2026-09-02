# 研究证据追踪

状态：`R0 TRACEABILITY BASELINE`

本表把 RQ1–RQ11 与主要来源、仍未证明的假设和负责阶段连接起来。来源只能说明已有机制和
报告结果，不能替代 FlowKernel 自己的实验。

| 研究问题 | 主要来源 | 已建立的基线 | FlowKernel 仍须回答 | 证据归属 |
| --- | --- | --- | --- | --- |
| RQ1 生命周期表示 | `LIN-05`, `RUN-01`, `RUN-02`, `HAR-05`, `HAR-08` | Linux 压力、容器/进程生命周期、Agent runtime 和恢复已有不同状态模型。 | 哪些状态可由 target 直接观测，哪些只能由探针报告；恶意/过期进度怎样处理。 | R0 合同；R1 状态机；R4 观测实验 |
| RQ2 真实进展 | `LIN-05`, `AGOS-01`, `CLUSTER-01`, `LEARN-01`, `LEARN-02` | 资源压力、workload 语义和调度指标都有既有做法。 | 有效进展、连续价值、停滞和重试成本能否跨 workload 比较。 | R4 观测语料；R5 策略对照 |
| RQ3 状态筛选 | `LIN-05`, `AGOS-01`, `LEARN-01`-`LEARN-03` | 观测、特征和学习策略可缩减或使用系统状态。 | 信息损失、延迟、噪声、推理开销和可解释性怎样共同评价。 | R4 消融与污染测试 |
| RQ4 策略演进 | `AGOS-01`-`AGOS-03`, `LEARN-01`-`LEARN-03`, `SAFE-02` | 代码合成、策略选择、强化学习和约束优化都不是空白。 | 运行时 Proposal 与部署期代码/配置更新何时各自值得；动态性收益能否覆盖 authority 与回滚风险。 | R0 对照定义；R5 同预算实验 |
| RQ5 确定性安全边界 | `PROT-01`-`PROT-03`, `HAR-01`, `SAFE-01`, `SAFE-02`, `LIN-01` | 最小权限、complete mediation、Capability、RTA、shield 和调度回退已有强基线。 | C Guard 崩溃、损坏、资源耗尽或旁路时能否 fail closed，且不把形式保证错误外推。 | R0 威胁/合同；R1-R2 故障注入 |
| RQ6 Linux 对照 | `LIN-01`-`LIN-06`, `AGOS-01`-`AGOS-03` | Linux 已提供资源、观测、BPF 与可替换调度器，SchedCP/Kgent 已覆盖 Agentic 控制和生成。 | target 与 reference lab 如何共享语义而不共享实现或成功状态。 | R0 环境与矩阵；R2 双线对照 |
| RQ7 多节点连续性 | `RUN-01`, `RUN-02`, `CLUSTER-01` | 容器合同、检查点恢复和集群管理提供直接基线。 | 分区、恢复幂等、双重执行、跨节点 ownership 和 Capability 怎样收敛。 | R6-R7，不提前进入 R0/R1 实现 |
| RQ8 评价体系 | `LIN-05`, `AGOS-01`, `HAR-07`, `CLUSTER-01`, `LEARN-01`-`LEARN-03` | 现有工作分别报告时延、吞吐、资源、调度或策略指标。 | 如何同时记录完成率、公平、连续性、控制开销、非法建议与失败成本。 | R0 测量合同；所有阶段通用证据 |
| RQ9 Principal 与 authority | `PROT-01`-`PROT-03`, `HAR-01`, `HAR-04`, `HAR-08`, `AGOS-01` | 工具策略、Capability、职责分离、Agent runtime 授权和部署 token 均有先例。 | Object/预算/时限绑定、委托衰减、撤销、在途动作与 confused deputy 如何统一。 | R0 权责合同；R1 静态能力；R6 动态委托 |
| RQ10 执行事实与世界事实 | `EVID-01`-`EVID-04`, `SAFE-01`, `AGOS-01` | 来源、attestation、构建 provenance、RTA 与部署验证都有明确适用域。 | `ALLOW`、`SUCCEEDED`、Observation、AcceptanceVerdict 和 `VERIFIED` 如何防止状态混轴。 | R0 证据合同；R3 独立读回与故障证据 |
| RQ11 持续存在 | `RUN-01`, `RUN-02`, `EVID-02`-`EVID-04`, `HAR-08`, `LIC-01`, `LIC-02` | bundle、恢复、供应链来源、许可证边界和持久 Agent runtime 有既有实践。 | 换机、凭据轮换、authority root、维护者退出、代码来源和真实多人治理分别需要什么证据。 | R0 恢复/许可证协议；R3 工程恢复；R6-R7 真实治理边界 |

## 反证与停止条件

- Agent Harness、AIOS、AgentRM 或 Agent libOS 满足应用层需求时，不得把它们重写进 C core。
- cgroup、BPF、`sched_ext` 或 SchedCP 满足实验目标时，FlowKernel target 必须说明自研机制新增的
  可测问题；“更底层”本身不是贡献。
- RTA/shielding 的形式保证只在原模型和规范内成立；结构相似不能继承证明。
- Linux reference lab 的成功不升级为 FlowKernel target 的实现证据。
- 单维护者角色模拟不升级为真实多人治理证据。
- 如果自研 C 机制的复杂度、故障面或复现成本抵消收益，研究范围应收缩或停止。

没有任何单一来源证明 FlowKernel 的三层组合假设。它仍保持 `Planned`，直到对应 R 阶段给出
可重复的构建、对照、故障和恢复证据。
