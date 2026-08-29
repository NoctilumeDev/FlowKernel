# 研究问题

本文件只定义待回答的问题，不把候选答案写成既定事实。

## RQ1：生命周期如何表示

- 哪些状态可以由 FlowKernel 内核事件直接观测，哪些只能由 Linux reference lab、容器运行时
  或应用探针提供？
- `WARMING`、`RUNNING`、`WAITING_IO`、`NEAR_CHECKPOINT`、`RETRY_LOOP`、
  `STALLED`、`RECOVERING` 等状态能否可靠区分？
- 生命周期状态应由显式协议、统计推断还是二者组合产生？
- 应用提供的进度信号如何防止错误、过期或恶意上报？

## RQ2：真实进展如何衡量

- CPU、I/O 和日志活跃是否代表有效进展？
- 不同 workload 的进度、完成价值和中断成本如何归一化？
- 什么时候“保持连续性”优于回收资源？
- 如何识别重复失败、无效重试和长期停滞？

## RQ3：系统状态如何筛选

- 哪些观测对当前决策真正有因果价值？
- Attention、特征选择或规则筛选能否减少状态维度和推理成本？
- 如何解释一次策略建议主要依据了哪些状态？
- 状态缺失、延迟和噪声会怎样影响策略？

## RQ4：策略如何演进

- 静态规则、参数自适应、模仿学习和强化学习分别适合哪些阶段？
- 学习策略是否真的优于经过调优的启发式基线？
- 在线学习是否必要，还是离线训练加受控部署更安全？
- SchedCP 式离线或控制面策略选择、配置与代码合成，同运行时持续提交有界 ActionProposal
  分别适合哪些决策；两者的更新时机、验证成本和失败半径怎样公平比较？
- 策略更新单元应是可部署代码、参数配置、版本化 Artifact，还是固定动作集合内的 Proposal；
  什么证据能证明增加动态性带来的收益超过新的 authority 与回滚风险？
- 策略回滚、版本兼容和漂移检测如何设计？

## RQ5：安全边界如何保持确定性

- 哪些资源上限、最低保障和权限规则必须是硬约束？
- 受限 C 子集、资源所有权和最小汇编边界如何被持续检查？
- 生命周期状态机如何证明不存在非法跳转、重复释放和失败后悬挂资源？
- 如何在策略不可用、超时、输出非法或置信度不足时降级？
- 如何证明关键任务不会因奖励函数而饥饿？
- 如何限制动作速率，避免控制器振荡？
- Guard 自身崩溃、卡死、资源耗尽或状态损坏时，怎样避免它成为新的单点故障？

## RQ6：FlowKernel 与 Linux 对照如何成立

- 两边如何表达语义一致的 workload、生命周期状态和有限动作？
- Linux reference lab 的观测与 FlowKernel target 的内核事件存在哪些不可消除差异？
- 如何把 SchedCP 的 workload 分析、策略库、Execution Verifier、签名部署 token、canary 与
  circuit breaker 作为完整 agentic control-plane 基线，而不是只和裸 `sched_ext` 样例比较？
- Kgent / SchedCP 的代码生成、配置选择和部署验证，与 FlowKernel 的运行时有界 Proposal
  不能使用同一接口时，怎样避免把平台成熟度、Agent 成本或实现规模误当成机制收益？
- 工具链、模拟器和真实硬件结果如何分别标注，避免跨环境外推？
- C 内核新增机制的复杂度和故障面是否抵消策略收益？

## RQ7：多节点连续性如何验证

- 全局状态的一致性要求是什么，哪些信息允许延迟？
- checkpoint、迁移和恢复的成本如何进入决策？
- 节点分区或控制平面故障时，执行权如何收敛？
- workload 身份、资源所有权和重复恢复如何保持幂等？

## RQ8：评价体系是否完整

候选指标至少包括：

- latency、throughput 和 completion rate；
- fairness、starvation 和最低保障违约次数；
- memory pressure、cache locality、energy 和控制开销；
- checkpoint、migration、recovery 和失败成本；
- workflow continuity、有效进展和无效重试；
- 策略推理时间、非法建议率和 Guard 拒绝率。

任何单一指标的改善都不能自动证明整体策略更优。

## RQ9：Principal 与 authority 如何建模

- Human、Agent、Service 和策略运行时如何进入同一 Principal 模型，而不抹掉各自的责任差异？
- Capability 应怎样绑定 Object、动作、范围、资源预算、时限和版本？
- SchedCP 式签名部署 token 能证明某个策略通过了哪些验证；它与可衰减、可委托、可撤销并
  绑定运行时 Object 和预算的 Capability 之间还缺少哪些语义？
- Capability 粒度过粗会扩大爆炸半径，过细会增加传播、校验与撤销成本；怎样找到可测边界？
- 委托如何避免静默扩权，撤销如何对缓存、在途动作和恢复任务完整生效？
- 如何阻止 Agent 借用高权限执行器形成 confused deputy？
- 哪些动作可以单主体授权，哪些治理变化需要职责分离或多主体确认？
- break-glass 如何保持显式、限域、限时、可审计和可恢复？

## RQ10：执行事实与世界事实如何分开

- `ALLOW`、执行器 `SUCCEEDED`、观测结果和 `VERIFIED` 分别由谁产生，怎样避免状态混轴？
- 一个特权转换最少需要记录哪些 Principal、Capability、Proposal、前后状态和恢复引用？
- 部署前 Execution Verifier、运行时 Guard 和动作后的独立 Acceptance 各自能证明什么；如何
  防止“代码通过验证”“canary 未触发回退”被提升为世界事实已经成立？
- 来源记录怎样发现缺失、截断、重排、身份冒用和存储损坏？
- provenance、日志和签名各自能证明什么，又不能证明什么？
- 来源记录与独立读回的 CPU、内存、I/O、时延和长期存储成本会不会抵消策略收益？
- 外部 Acceptance 如何读取 runtime、artifact、database 或其他事实，却不获得修改被验对象的权力？
- 事实源冲突、资源不足或结果不可读时，怎样保护 `UNKNOWN` 而不是制造成功？

## RQ11：系统自身怎样持续存在

- workload portability、runtime portability 和 maintainer portability 的合同怎样分层？
- 原机器、凭据或托管平台失效后，哪些状态可重建、可重签发、必须备份或可以丢弃？
- authority root、Guard 和硬不变量的治理变化由谁提出、批准、发布、回滚和复核？
- 单维护者阶段能验证哪些治理机制，哪些必须等待真实社区参与？
- 多主体授权怎样既限制单点滥用，又避免审批死锁、无人可恢复和紧急情况长期停摆？
- checkpoint 与恢复怎样保持原 Capability 和隔离边界，避免“为了恢复”产生静默扩权？
- 如何证明确定性 fallback、checkpoint、仓库对象图和关键证据在声明的故障模型下可以恢复？
- 物理机所有者、固件、编译器和托管平台等边界外根权限应如何记录为 failure domain？
