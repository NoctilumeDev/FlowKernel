# R0 文献门禁记录

状态：`LITERATURE BASELINE CLOSED · R0 REMAINS PLANNED`

关闭日期：2026-09-03

本记录关闭的是 R0 开工前的文献信息缺口，不是 R0 实现阶段，也不是安全、性能、可复现性或
自研内核能力的验收。

## 关闭结果

- 35 个主要来源已有稳定编号和证据等级；
- 检索边界、纳入/排除、综合方法、活文档版本规则与更新条件已经记录；
- RQ1–RQ11 都有来源、剩余假设和负责阶段；
- 比较矩阵包含问题、状态、动作、目标、策略更新时机、authority、验证者、fallback、环境、
  证据强度和公开限制；
- Agent Harness、Linux reference lab 与 FlowKernel target 三条证据线已经分开。

## 文献结论

现有工作已经证明或实现了大量组成部分：Agent loop 与工具审批、应用层 privilege policy、
Agent 级调度和上下文管理、capability-controlled Agent runtime、Linux 资源控制和可扩展调度、
Agentic scheduler control plane、eBPF 代码合成、runtime assurance、shielding、来源记录、恢复和
学习型调度。

因此 FlowKernel 不得把这些单项声明为原创。仍待验证的是一个更窄的组合边界：不可信 Harness
只能提出 typed Proposal；独立 authority 层持有 Principal、Capability、状态和 Guard；资源机制
只执行经过授权的有限命令；三层不共享最终 authority、凭据、可变状态或故障域。

## R0 必须据此固定的输入

1. 受限 freestanding C 子集、编译器、链接器、模拟器和 warning/sanitizer/static-analysis 门槛；
2. `ActionProposal`、Capability、Observation、AcceptanceVerdict 与 Evidence 的最小版本合同；
3. FlowKernel target 与 Linux reference lab 的同语义 workload 和动作夹具；
4. 传统 Linux、`sched_ext`/`scx` 与 SchedCP 的分级直接基线；
5. Harness 越狱、越权 Proposal、旁路调用、Guard 故障与资源耗尽的失败用例；
6. 干净机器只依靠仓库恢复 R0 的步骤、停止线和证据保存位置；
7. 受宿主硬件限制无法运行的 artifact，明确记录为有界未完成审计，不伪造成复现成功。

## 当前边界

R0 仍为 `Planned`。当前单机和硬件条件允许文档、合同、工具链与部分 Linux reference lab 工作，
但不能据此声称完成自研操作系统、目标硬件验证、多核/多节点、生产安全或 SchedCP 全量复现。
未来硬件和环境只追加新证据线，不覆盖今天的限制。

外部链接可达性不是 CI 的确定性门禁；本地链接、必需文档、边界语句、研究问题覆盖和证据
等级标记才进入仓库校验。涉及活文档的具体设计或实验必须另行固定上游版本、修订或 commit。

文献基线至此闭环。下一步仍是 R0 的工具链、合同、基线和干净恢复协议，不能越过 R0 去堆
R1–R7 的实现。
