# 参与贡献

FlowKernel 当前处于研究规划阶段，尚未进入实现。贡献应帮助明确研究问题、假设、实验和
证据边界，不能把路线图描述成已经交付的能力。

## 当前接受的内容

- 操作系统调度、cgroup、`sched_ext`、eBPF 和容器生命周期相关文献或基线；
- 生命周期状态、进展信号、检查点和迁移模型；
- Principal、Capability、委托、撤销和最小权限模型；
- 机制与策略分离、确定性 Guard、fault containment 和降级设计；
- 来源记录、外部验收、维护者迁移和工程恢复边界；
- 可复现的实验设计、评价指标和失败案例；
- 文档中的错误、歧义和失效链接。

当前不接受空壳实现、技术栈堆叠，或以“AI OS”为名绕过安全边界的方案。

## 提交流程

1. 先使用 Research Proposal Issue Form 描述问题、基线、假设和验证方式。
2. 一次 Pull Request 只处理一个可审查主题。
3. 说明内容处于 Idea、Planned、Designed、Prototype、Validated 或 Rejected 哪个阶段。
4. 新增结论时同时记录替代方案、反例和演进触发条件。
5. 不提交密码、Token、Cookie、私人数据、代理配置或本机绝对路径。
6. 实现阶段开始后，代码变更必须附带测试和可重复实验入口。
7. 区分 Proposal、Authorization、Execution、AcceptanceVerdict、Evidence 和 EpistemicStatus；
   人工批准或执行成功不能自动写成事实成立。
8. 引用 Linux 或其他实现时记录来源与许可证；不确定的复制边界必须在合入前停止并审查。

## 宪法变更

[执行操作系统宪法](docs/execution-os-constitution.md) 不是不可修改的口号，但修改它需要比普通
文案更完整的理由。相关 PR 必须说明：

- 哪个实现证据、反例或前人工作推翻了现有边界；
- 对 Principal、authority、硬不变量、来源或恢复路径有什么影响；
- 哪些旧声明和实验坐标需要保留；
- 怎样回滚，而不把新结论倒写成项目最初就有的历史。

单维护者当前仍可完成这些步骤，但不能据此声称职责分离或多人治理已经得到验证。

Pull Request 必须列出实际执行的检查；未运行的验证应明确写明原因。
