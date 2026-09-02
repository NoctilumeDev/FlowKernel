# R0 最小交接合同

状态：`R0 SEMANTIC FREEZE · MACHINE FIXTURES PENDING`

R0 只冻结跨层必须共享的语义，不冻结未来 C ABI、内存布局、RPC、数据库或服务拆分。R1 以后
只能依赖这些版本化交接面，不能读取上一层私有状态或建立旁路入口。

## 1. 合同对象图

```text
PrincipalRef
    holds
CapabilityRef
    constrains
ActionProposal
    receives
AuthorizationVerdict
    binds
ExecutionAttempt
    reports
Observation
    is read by
AcceptanceRun
    produces
AcceptanceVerdict + EvidenceEnvelope
```

对象可以在同一高内聚工程内实现；分层表达所有权和依赖方向，不要求拆成微服务。

## 2. 所有合同共有的头部

每个跨层对象至少携带：

```text
schema_version
object_id
subject_id
created_at_or_logical_time
producer_identity
correlation_id
causation_id
content_digest
```

R0 fixture 使用规范化 JSON 表达这些语义，便于跨工具检查。该 JSON 不是未来内核 ABI。时间戳
可以是真实时钟或确定性逻辑时钟，但必须声明来源，不能混用后再排序。

## 3. Principal、Object 与 Capability

`PrincipalRef` 最少区分主体身份、主体类型、authority domain 和代表关系。作者、人类批准、
模型能力或 Harness 进程身份都不能自动生成执行权。

`ObjectRef` 最少区分对象身份、对象类型、authority domain 和期望状态版本。

`CapabilityRef` 最少绑定：

- issuer、holder 与 target object；
- allowlisted action kinds；
- 参数范围与资源上限；
- 生效、过期和撤销状态；
- capability version 与 policy version；
- 委托来源及不扩权证明所需引用；
- 可重放边界和使用次数限制（如适用）。

Capability 是授权输入，不是动作已发生或目标已成立的证明。

## 4. ActionProposal 与授权裁决

`ActionProposal` 最少绑定：

```text
principal
capability
target_object
expected_state_version
action_kind
bounded_parameters
resource_budget
deadline
policy_version
correlation_id
```

`AuthorizationVerdict` 独立记录 `ALLOW | CLAMP | DENY`、Guard 与规则版本、输入摘要、原因、
最终允许参数及到期点。`CLAMP` 必须生成明确的最终动作，不能让执行器自行猜测裁剪结果。

Harness 只能提交 `ActionProposal`。它不能持有 Guard 私钥、authority state 写入口、资源机制
凭据或特权执行器句柄。绕过 Harness 直接调用下一层时，下一层仍需独立验证自己的合同。

## 5. ExecutionAttempt 与 Observation

执行尝试必须绑定 proposal、authorization verdict、executor、目标状态版本、开始/结束坐标和
实际动作。Execution 使用独立状态轴：

```text
SUCCEEDED | FAILED | PARTIAL | UNKNOWN
```

`Observation` 最少包含：

- attempt identity 和观察者；
- pre-state、post-state 或其不可变摘要；
- 实际资源变化与残留状态；
- runtime、kernel、cgroup、process 或 hardware counter 的来源；
- 采样窗口、缺失字段和已知污染；
- rollback/recovery reference；
- 原始 evidence references。

执行器不能把自己的 `SUCCEEDED` 提升成 `VERIFIED`。

## 6. AcceptanceVerdict 与 EvidenceEnvelope

Acceptance 只能通过只读事实源或独立 verifier 检查声明。一次 run 的裁决为：

```text
PASS | FAIL | INCONCLUSIVE | BOUNDARY | PENDING
```

`AcceptanceVerdict` 最少绑定 Subject、assertions、固定源码/工件/环境坐标、verifier 和 policy
版本、读取的 evidence references、逐条 assertion 结果、裁决原因及未验证范围。

`EvidenceEnvelope` 最少绑定：

- source commit、toolchain lock、lab profile 与 workload fixture；
- Principal、Capability、Proposal、Authorization、Attempt、Observation 和 Acceptance 坐标；
- 原始记录的位置、摘要、媒体类型和生成者；
- environment、seed、时间来源、资源预算与 stop line；
- 完整性检查结果、缺口、冲突和 known unknowns；
- verifier 输入、输出和退出状态。

Evidence 完整或哈希一致不自动证明观察内容真实；验收仍须独立读回。记录缺失、截断、重排、
冲突或 verifier 越界不能产生 `PASS`。

## 7. 三层交接矩阵

| 生产方 | 消费方 | 只允许交付 | 禁止交付 |
| --- | --- | --- | --- |
| Agent Harness | Deterministic authority | 版本化 `ActionProposal` 与 Principal 引用 | 凭据、可变 authority state、直接执行句柄 |
| Deterministic authority | Resource mechanism | 已验证且限域的 action command、预算和期限 | 原始 Prompt、模型上下文、未裁决 proposal |
| Resource mechanism | Observation/Acceptance | attempt、原始 observation、恢复引用 | 自封的事实真值或研究结论 |
| Acceptance | Research record | verdict、evidence references、边界与失败分类 | 对被验对象的修复性写入或成功倒灌 |

同一进程内调用也必须遵守这张矩阵；地址空间相同不代表 authority 相同。

## 8. R0 机器夹具门禁

本语义冻结不能单独关闭 R0。进入 R1 前必须再提交：

1. 机器可读、带版本的合同 schema；
2. 每个合同的最小合法、边界合法和非法 fixture；
3. Harness 越权、过期/撤销 Capability、状态版本冲突、预算越界、证据损坏等负例；
4. 一个不依赖被验实现内部状态的 fixture verifier；
5. schema 演进和不兼容变更规则；
6. 固定命令、预期 verdict 和失败输出。

如果普通动作必须通过无类型字典、任意指针、隐藏全局变量或共享数据库状态才能完成，合同
边界视为失败，R0 不关闭。
