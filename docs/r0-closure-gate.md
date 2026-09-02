# R0 闭环与 R1 准入门

状态：`R0 PLANNED · CLOSURE WORK ONLY · R1 ENTRY PROHIBITED`

本门禁把“继续完善 R0”和“开始写 R1 内核”分开。R0 的目标不是堆空模块，而是留下一个可以
从干净环境恢复、运行、失败、读回并独立验收的研究底板。在本页全部关闭前，不创建 R1 内核
源码、启动汇编、链接脚本或占位模块。

## 1. 子门状态

| 子门 | 当前状态 | 关闭证据 |
| --- | --- | --- |
| R0-L 文献与前人工作 | `CLOSED` | [R0 文献门禁记录](r0-literature-gate.md) |
| R0-A 宪法、可信边界和阶段分层 | `DESIGNED` | 宪法、威胁模型、所有权、跨带依赖和重验规则接受审查 |
| R0-T 工具链 | `PENDING` | 精确版本锁、启动交接选择、干净恢复和模拟器 smoke evidence |
| R0-C 最小交接合同 | `PENDING` | 机器 schema、正反 fixtures、演进规则和独立 verifier |
| R0-LAB Linux reference lab | `PENDING` | 同语义基线、失败/恢复、独立读回和离线证据包 |
| R0-R 仓库恢复 | `PENDING` | 干净克隆只依赖仓库、公开工具来源和一个非交互入口完成 R0 验证 |

`DESIGNED` 不是 `CLOSED`。本表不能因为文档数量增加而自动升级。

## 2. R0 自身的最小纵向闭环

R0 即使不实现内核，也必须真实跑通：

```text
clean clone
→ restore locked R0 tools
→ verify versioned contracts and negative fixtures
→ launch bounded Linux reference workload
→ submit one typed ActionProposal
→ deterministic authority returns ALLOW / CLAMP / DENY
→ lab mechanism attempts only the authorized bounded action
→ read back actual state from an independent fact source
→ preserve execution, observation and recovery evidence
→ produce PASS / FAIL / INCONCLUSIVE / BOUNDARY
→ stop all lab processes
→ verify evidence offline
→ verify no undeclared residual state
```

这条闭环可以使用宿主侧 deterministic fixture 表达 R0 合同，但不能假装它是 FlowKernel C
target。它验证的是工具、合同、reference lab 与证据方法已经足以支持 R1 施工。

## 3. R0 总退出条件

只有以下条件全部成立，R0 才能从 `Planned` 更新：

1. R0-L、R0-A、R0-T、R0-C、R0-LAB 和 R0-R 均为 `CLOSED`；
2. 每条成功、失败和边界结论都有不可变 commit、环境、合同、fixture 和 evidence identity；
3. Harness、deterministic authority、resource mechanism、Acceptance 四层不共享凭据、私有可变
   状态、特权旁路或最终 authority；
4. Linux reference lab 的成功没有写成 FlowKernel target 的实现事实；
5. 负例至少覆盖越权 Proposal、撤销/过期 Capability、状态版本冲突、Guard 拒绝、机制失败、
   独立读回冲突、证据损坏、恢复失败和残留状态；
6. 干净环境能以一个文档化、非交互入口完成验证；
7. 所有 `PENDING` 要么完成，要么凭真实环境观察收敛为带重验条件的 `BOUNDARY`；
8. 公开限制、宿主 failure domain 和尚未证明的性质保持可见；
9. R0 review 记录精确 revision，并在通过后创建独立的不可变 freeze coordinate。

建议冻结坐标为 `r0-baseline-v1`，但在总门禁通过前不得创建该 tag，也不得发布暗示 R1 已开始
的版本。

## 4. 明确禁止的跨级施工

R0 关闭前不得：

- 创建“先放着”的 R1 kernel、scheduler、Guard 或 lifecycle 空实现；
- 用 Linux cgroup、eBPF 或 `sched_ext` 代码冒充 FlowKernel target；
- 把 Harness 接到真实特权执行入口后再补 Capability；
- 为了演示而绕过独立读回、失败证据或残留检查；
- 提前实现 R2–R7 的学习、多核、多节点、迁移或动态委托；
- 用本机一次成功替代干净克隆、固定工具链和离线证据验证。

## 5. 下一步且仅此一步

R0 文献线已经关闭。下一施工顺序固定为：

```text
R0-T 工具链候选验证与精确锁
→ R0-C 机器合同与正反 fixtures
→ R0-LAB reference lab runner、失败用例与独立读回
→ R0-R 干净恢复
→ R0 总复核与冻结
→ STOP
```

到达 `STOP` 只表示具备 R1 准入资格。是否开始 R1 必须由新的明确决定触发，不能由脚本、路线图
或 R0 关闭自动触发。
