# 证据规则

FlowKernel 是长期研究仓库。状态标签和证据边界必须比功能数量更可信。

## 状态词

| 状态 | 含义 |
| --- | --- |
| Idea | 尚未形成可检验问题的想法 |
| Planned | 已定义问题和候选实验，尚未实现 |
| Designed | 已形成可审查设计，尚未通过原型验证 |
| Prototype | 存在实验代码，不代表稳定或有效 |
| Validated | 在明确环境和对照组下形成可重复证据 |
| Rejected | 假设未获得支持，并保留失败原因 |

README、Issue、PR、Release 和论文草稿必须使用这些词区分计划与事实。

## 状态轴必须分开

研究成熟度不能替代一次动作的授权、执行或事实状态。FlowKernel 使用五条互相独立的语义轴：

| 状态轴 | 状态 | 说明 |
| --- | --- | --- |
| Research maturity | `Idea / Planned / Designed / Prototype / Validated / Rejected` | 假设或实现成熟度 |
| Authorization | `ALLOW / CLAMP / DENY` | Guard 对一次 Proposal 的授权裁决 |
| Execution | `SUCCEEDED / FAILED / PARTIAL / UNKNOWN` | 执行器实际结果 |
| EpistemicStatus | `UNKNOWN / UNVERIFIED / VERIFIED / REFUTED` | 某项关于现实的声明是否获得证据资格 |
| AcceptanceVerdict | `PASS / FAIL / INCONCLUSIVE / BOUNDARY / PENDING` | 一次验收 run 在声明范围内的裁决 |

不得使用以下推断：

```text
Designed     -> implemented
ALLOW        -> action happened
SUCCEEDED    -> goal is true
provenance   -> evidence is authentic
human review -> final correctness
```

EpistemicStatus `UNKNOWN` 表示 Subject、声明或必要观察尚不足以进入验证；`UNVERIFIED` 表示声明
已经明确且可检查，但 evidence 尚未达到验证或反驳门槛。Execution `UNKNOWN` 只表示动作结果
无法可靠读回。

AcceptanceVerdict 不能机械倒灌到其他状态轴：`PASS` 只支持已声明 assertion 的
`VERIFIED`；`FAIL` 可能是 Product、Execution、Validation 或 Host failure，只有事实反证才
支持 `REFUTED`；`INCONCLUSIVE`、`BOUNDARY` 与 `PENDING` 保留当前认识边界。资源不足、事实
源冲突、记录损坏或验证器越界时，不能为了结束 run 而推断成功。

## 特权转换的最低来源记录

每个需要 Guard 的动作至少绑定：

- Principal 与代表关系；
- Proposal、输入 snapshot、policy/version 和 correlation id；
- Capability、目标 Object、动作权利、范围、预算、时限和授权裁决；
- pre-state、尝试动作、实际动作、post-state 与执行结果；
- checkpoint、rollback 或 recovery reference；
- 观测与外部 evidence reference；
- 记录格式、身份和完整性校验版本。

来源记录应在逻辑上追加而不是静默回写历史，但“append-only”不是防篡改证明。签名、哈希、
持久存储和外部锚点分别需要自己的 threat model。记录只能说明它声称的因果链；事实是否成立
仍由独立读回裁决。

## 实验记录最低要求

每项性能或正确性结论至少记录：

- Commit、分支和实验脚本版本；
- 目标架构、C 编译器、链接器、编译参数、启动镜像、模拟器与宿主环境；
- 操作系统、内核、CPU、内存、存储和加速器；
- 容器、虚拟化、网络和节点拓扑；
- workload、数据规模、预热方式和持续时间；
- 并发含义：连接数、在途数、请求总量或 RPS；
- 对照组、资源预算和唯一变量；
- 随机种子、重复次数和统计方法；
- latency、throughput、公平、完成率、连续性和控制开销；
- 失败、超时、Guard 拒绝、降级、回滚和残留状态。
- Principal、Capability、Proposal、Guard verdict、执行结果和外部验收的不同坐标；
- stop line、隔离域、预计恢复路径和实际恢复时间；
- 源码、构建物、策略、来源记录和报告各自的不可变身份。

## 不接受的证据

- 单次最好结果；
- 没有同预算基线的百分比提升；
- 将仿真结果描述为真实内核或集群能力；
- 将请求总数写成同时并发；
- 隐藏失败样本、随机种子或停止条件；
- 以路线图、架构图或模型输出证明实现已经完成；
- 以“使用 C”或“代码只包含简单循环”证明内核安全、正确或稳定；
- 将 Linux reference lab 的结果描述为 FlowKernel target 已实现能力；
- 仅优化 reward，却不检查饥饿和硬不变量。
- 以模型能力、作者身份或人工批准证明动作有权执行；
- 以 Guard `ALLOW` 或执行器 `SUCCEEDED` 证明目标已经成立；
- 以日志存在、字段齐全、哈希一致或签名通过证明记录内容必然真实；
- 使用可移动分支名替代固定 commit、artifact 或 evidence identity；
- 用新机器上的成功覆盖旧宿主上的失败、资源边界或未完成证据；
- 用单维护者模拟的“双角色”证明多人职责分离已经成立。

## 安全与可恢复性

学习策略的评价必须包含：

- 非法、越界、缺失和相互冲突的动作建议；
- 推理超时、模型不可用和输出不稳定；
- Guard 拒绝率与拒绝原因；
- 回退到确定性策略的时间和业务影响；
- 策略版本回滚和状态兼容；
- 节点、控制器或观测器重启后的恢复。
- capability 过期、撤销、重放、委托泄漏与 confused deputy；
- Principal 凭据被盗、Guard/authority root 被修改和来源记录被截断或重排；
- 维护者换机、凭据重签发和主托管平台不可用时的工程恢复。

硬不变量发生一次违约，即视为该实验失败，不能用平均收益抵消。

## 外部 Acceptance 的证据边界

FlowKernel target 负责产生受控动作与运行记录，不独占事实解释权。宿主侧 Acceptance 可以读取
runtime、artifact、database、browser、hardware counter 或独立 verifier，但必须：

1. 声明 Subject、环境、固定坐标和观察范围；
2. 不修改被验对象、Guard 或权威历史来制造通过；
3. 区分 Product、Validation 与 Host failure；
4. 保留第一次失败、边界、恢复和清理证据；
5. 在证据不足时输出未验证、边界或不确定，而不是推断成功。

VeriTrail 的证据模型、GitHub required checks 和发布物读回可以作为方法参照，但当前仓库没有
实现通用 Acceptance Workbench，也不把这些外部系统写成内核组件。

## 发布规则

规划阶段不发布伪造的 `v1.0.0`。首个 Release 应对应可运行、可重复的 R0 基线，并附带
环境、脚本、原始结果摘要和已知限制。版本号表示仓库交付状态，不表示研究结论已经普适。

后续实验以追加证据线表达新宿主、新策略或新治理条件；不得回写旧 event 中各轴的原值。例如
Execution `FAILED`，AcceptanceVerdict `FAIL / INCONCLUSIVE / BOUNDARY / PENDING`，或
EpistemicStatus `UNVERIFIED / REFUTED`，都只能由新证据线补充，不能被新条件下的结果覆盖。
