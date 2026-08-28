# C-first 内核契约

**Evidence state: Designed. No implementation has been validated.**

本文定义 FlowKernel 未来实现必须遵守的语言、生命周期与学习策略边界。它是研究契约，
不是已经存在可运行内核的证明。

## 1. C-first 的准确含义

FlowKernel 的可信核心以 **freestanding C** 实现。初始实现采用经过工具链固定的 C11 子集，
不依赖宿主 libc、C++ runtime、语言虚拟机或垃圾回收器。

“C-first”不等于“所有字节都必须由 C 编译器生成”。启动入口、中断门、上下文切换和少量
原子指令等架构必需部分可以使用最小汇编，但必须满足以下约束：

- 汇编只承担 C 无法可靠表达的硬件接口，不包含调度或学习策略；
- 每个汇编入口都有 C 侧契约、保存寄存器说明和独立测试；
- 汇编规模和调用边界可枚举、可审查，不允许演变成第二套内核逻辑；
- 链接脚本、启动镜像和工具链版本属于可复现实验输入。

C 提供直接且可固定的 ABI 与内存布局控制，但 C 本身不会自动带来可靠性。越界访问、生命周期
错误、整数溢出、未定义行为、数据竞争和中断重入仍是首要风险。因此初始可信核心还必须：

- 禁止隐式内存分配、无界递归、可变长数组和无法审计的宏技巧；
- 为资源句柄定义单一所有者、借用范围和显式释放点；
- 对所有外部长度、索引、状态和枚举做边界校验；
- 将中断上下文、可睡眠上下文和持锁上下文写入接口契约；
- 同时使用编译器警告、静态分析、sanitizer 宿主测试、模拟器和故障注入；
- 把 warning 当作失败，固定工具链和编译参数，保存可重放构建证据。

## 2. C 可信核心不等于“所有确定性软件”

C-first 约束的是内核侧可信执行边界，不是要求验收器、训练器、研究脚本和仓库治理全部使用
C。可信核心只保留必须在目标权限级别完整调停的机制：

- 稳定的 Principal 与 Object 句柄；
- 对 Capability 的范围、权利、版本、有效期与撤销状态检查；
- 生命周期与资源状态机；
- 资源包络、隔离、最低保障和动作幅度限制；
- `ALLOW / CLAMP / DENY` Guard；
- 只执行 allowlist 动作的有限执行器；
- 确定性 fallback、checkpoint 和恢复钩子；
- 将特权转换锚定到持久来源记录的最小接口。

身份认证、模型推理、训练、复杂查询、实验分析和外部验收原则上位于可信核心之外。内核可以
保存身份句柄和授权关系，但不预先承诺自己实现完整账号系统、PKI、证据数据库或社区治理。

C 代码仍可能稳定地执行错误合同，因此“由 C 实现”只说明执行边界和候选可审查性，不构成
正确性证明。可信核心必须尽量小，并通过完整调停、fail-safe default、最小权限和故障注入
获得证据。

## 3. Principal、Capability 与动作合同

人、Agent、服务和策略运行时都作为 Principal。Principal 的模型能力、作者身份或人工批准
不等于执行 authority。候选能力关系是：

```text
Principal
  possesses / receives
Capability
  confers bounded authority over
Object
```

具体是否采用 seL4 式 capability space、句柄表或其他表示，要由 R0/R1 反证后决定；当前只
固定以下语义：

- Capability 必须指向明确 Object，并携带可校验的动作、范围和资源上限；
- 委托不能静默扩大权利，撤销和过期必须在后续访问中被完整调停；
- 执行器不能替调用方成为 confused deputy；
- 旧快照、旧 proposal 和旧 capability 不能在状态或版本变化后自动继续有效；
- break-glass 仍是显式、限域、限时、留痕的授权路径，不是绕过 Guard 的特殊入口。

所有特权动作使用有类型的候选合同：

```text
ActionProposal {
  principal;
  capability;
  target_object;
  expected_state_version;
  action_kind;
  bounded_parameters;
  resource_budget;
  deadline;
  policy_version;
  correlation_id;
}
```

这不是冻结 ABI。字段名称和布局可以改变，但身份、授权、目标、版本、预算、时限和因果关联
不能在实现时被省略。

## 4. 生命周期不是框架移植

Spring Boot 提供的是问题来源：对象和服务需要被发现、构造、装配、启动、运行、停机和
回收。FlowKernel 借用这套生命周期思维，但不把 Spring 容器、反射或依赖注入机制搬入
内核。

初始候选状态机是：

```text
RESET
  -> BOOTSTRAP
  -> DISCOVER
  -> CONSTRUCT
  -> BIND
  -> START
  -> RUNNING
  -> QUIESCE
  -> STOP
  -> RECLAIM
```

异常只能进入显式的 `DEGRADED`、`RECOVERING` 或 `FAILED` 路径。每个状态转换必须声明：

1. 前置条件；
2. 唯一执行所有者；
3. 资源预算和超时；
4. 成功后的不变量；
5. 失败后的补偿、回滚或隔离动作；
6. 可审计的转换原因和结果。

`if`、`for` 和 `while` 足以表达控制流，却不足以自动形成正确系统。可靠性来自状态、所有权、
预算、退出条件和失败闭环都被显式定义，而不是来自语法数量少。

## 5. 确定性基线永远先于学习策略

FlowKernel 首先实现一条不依赖模型也能完整运行的确定性路径：

```text
observed snapshot
  -> deterministic lifecycle machine
  -> rule baseline
  -> C safety guard
  -> bounded executor
  -> measured result
```

规则、启发式、强化学习、LLM 或 Agent 只能作为 Slow Path 的策略顾问加入；Attention 或其他
状态筛选只能改变它们“看什么”，同样不获得执行权：

```text
versioned snapshot
  -> external or isolated policy advisor
  -> typed action proposal
  -> C safety guard
  -> accept / clamp / reject
```

策略源不得：

- 直接写内核指针、页表、寄存器、中断状态或任意调度结构；
- 在中断、上下文切换、锁和基本内存分配路径中同步推理；
- 绕过动作 allowlist、资源上限、速率限制和权限检查；
- 删除、替换或关闭确定性基线；
- 以 reward 代替 no-starvation、最低保障和恢复所有权等硬不变量。

策略超时、崩溃、输出非法、版本不兼容、置信度不足或 Guard 拒绝时，系统必须在有界时间内
继续执行确定性基线。模型服务不可用不能成为内核不可用的原因。

## 6. 执行、来源记录与外部验收

C 可信核心对每次特权转换记录最小因果链：Principal、Capability、Proposal、目标、输入版本、
Guard 裁决、实际动作、前后状态、结果和恢复引用。必须区分：

```text
authorization -> execution -> observation
observation -> acceptance run -> AcceptanceVerdict
observation -> evidence       -> EpistemicStatus
```

`ALLOW` 不表示动作已经成功，执行器返回 `SUCCEEDED` 也不表示业务目标或系统声明已经得到证明。
外部验收通过 runtime、artifact、database、browser 或独立 verifier 读回结果；一次 run 产生
`AcceptanceVerdict`，其 evidence 可以支持 `EpistemicStatus`，但二者不自动映射。验收器不能
通过修改被验对象来制造通过。

来源记录也不是天然可信：身份冒用、记录丢失、顺序篡改、存储损坏和错误观测都必须进入威胁
模型。高风险特权动作如果无法建立其声明所需的持久记录，应被拒绝或进入预先声明的 fail-safe
路径，不能静默降级为“执行了但以后再补日志”。

## 7. Linux 的角色

Linux、cgroup、`sched_ext` 和 eBPF 继续作为：

- 传统策略对照组；
- workload 与指标采集实验台；
- 在自研内核机制成熟前验证生命周期假设的参考实现；
- 用于比较开销、正确性和收益的外部基线。

它们不是 FlowKernel 最终可信核心的实现语言或永久执行底座。任何在 Linux 实验台得到的结论
都必须标注环境，不能直接声称已在 FlowKernel 内核中成立。

## 8. 首个可实现边界

首个内核里程碑不追求通用操作系统功能齐全，只要求形成可验证的最小闭环：

- 可重复启动、停止和异常退出；
- 固定平台上的时钟、中断和最小上下文切换；
- 静态任务与资源描述；
- 静态 Principal、Object 与最小权限描述；
- 明确的生命周期状态机；
- 一条确定性调度与资源回收基线；
- 可拒绝非法建议的 C Guard；
- 串行来源记录、宿主侧可重放测试和外部验收交接；
- 明确的 failure containment domain 与可触发的恢复路径；
- 模型完全缺席时仍能正常运行。

文件系统、网络栈、驱动生态、多核扩展、在线强化学习和分布式控制都不能挤进这个最小闭环。
每增加一个机制，都必须先说明它回答哪个研究问题，以及失败时如何回到上一个稳定状态。
