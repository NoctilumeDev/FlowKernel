# 主要参考文献

状态：`R0 BIBLIOGRAPHY BASELINE · 2026-09-03`

本页为 FlowKernel 文献基线提供稳定的仓库内编号。编号不代表认可、完整性或新颖性判断。
证据类型包括：`SPEC`（规范）、`DOC`（官方文档）、`PAPER`（正式发表论文）、`PREPRINT`
（尚不能按同行评审论文使用的预印本）、`REPORT`（机构技术报告）和 `ARTIFACT`（维护者提供的
可检查实现或复现实物）。

## 保护、Capability 与职责边界

- **PROT-01 · PAPER** — Saltzer, J. H. 与 Schroeder, M. D. [The Protection of Information in Computer Systems](https://web.mit.edu/Saltzer/www/publications/protection/), 1975.
- **PROT-02 · DOC** — seL4. [Capabilities Tutorial](https://docs.sel4.systems/Tutorials/capabilities.html).
- **PROT-03 · SPEC** — seL4. [Capability Distribution Language](https://docs.sel4.systems/projects/capdl/index.html).

## Agent Harness、Agent runtime 与应用层权限

- **HAR-01 · PREPRINT** — Shi, T. 等. [Progent: Securing AI Agents with Privilege Control](https://arxiv.org/abs/2504.11703), arXiv v3, 2026.
- **HAR-02 · DOC** — Microsoft. [Agent Framework: Agent Harness](https://learn.microsoft.com/en-us/agent-framework/concepts/harness).
- **HAR-03 · DOC** — OpenAI. [A practical guide to building agents](https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/).
- **HAR-04 · DOC** — NIST. [Separation of Duty](https://csrc.nist.gov/glossary/term/separation_of_duty).
- **HAR-05 · PAPER** — Mei, K. 等. [AIOS: LLM Agent Operating System](https://openreview.net/forum?id=L4HHkCDz2x), COLM 2025.
- **HAR-06 · ARTIFACT** — AGI Research. [AIOS](https://github.com/agiresearch/AIOS).
- **HAR-07 · PREPRINT** — She, J. [AgentRM: An OS-Inspired Resource Manager for LLM Agent Systems](https://arxiv.org/abs/2603.13110), 2026.
- **HAR-08 · PREPRINT** — Zhang, Y. [Agent libOS: A Runtime Substrate for Capability-Controlled Self-Evolving LLM Agents](https://arxiv.org/abs/2606.03895), arXiv v3, 2026.
- **HAR-09 · ARTIFACT** — Agent libOS maintainers. [Agent libOS](https://github.com/yingqi-z20/Agent-libOS).

## Runtime assurance 与受约束策略

- **SAFE-01 · REPORT** — Slagel, J. T. 等. [A Formal Verification Framework for Runtime Assurance](https://ntrs.nasa.gov/citations/20240006522), NASA/NFM 2024.
- **SAFE-02 · PAPER** — Alshiekh, M. 等. [Safe Reinforcement Learning via Shielding](https://doi.org/10.1609/aaai.v32i1.11797), AAAI 2018.

## 来源、供应链与可复现性

- **EVID-01 · SPEC** — W3C. [PROV-O: The PROV Ontology](https://www.w3.org/TR/prov-o/).
- **EVID-02 · SPEC** — in-toto. [Specifications](https://in-toto.io/docs/specs/).
- **EVID-03 · SPEC** — SLSA. [Provenance, v1.2](https://slsa.dev/spec/v1.2/provenance).
- **EVID-04 · DOC** — Reproducible Builds. [Making plans](https://reproducible-builds.org/docs/plans/).

## Linux 资源、调度与观测机制

- **LIN-01 · DOC** — Linux Kernel. [Extensible Scheduler Class (`sched_ext`)](https://docs.kernel.org/scheduler/sched-ext.html).
- **LIN-02 · ARTIFACT** — sched-ext maintainers. [`scx`: sched_ext schedulers and tools](https://github.com/sched-ext/scx).
- **LIN-03 · DOC** — sched-ext maintainers. [`scx` Overview](https://github.com/sched-ext/scx/blob/main/OVERVIEW.md).
- **LIN-04 · DOC** — Linux Kernel. [Control Group v2](https://docs.kernel.org/admin-guide/cgroup-v2.html).
- **LIN-05 · DOC** — Linux Kernel. [Pressure Stall Information](https://docs.kernel.org/accounting/psi.html).
- **LIN-06 · DOC** — Linux Kernel. [BPF Documentation](https://docs.kernel.org/bpf/).

## Agentic scheduler control plane 与内核策略生成

- **AGOS-01 · PREPRINT** — Zheng, Y. 等. [Towards Agentic OS: An LLM Agent Framework for Linux Schedulers](https://arxiv.org/abs/2509.01245), 2025.
- **AGOS-02 · ARTIFACT** — eunomia-bpf. [SchedCP artifact](https://github.com/eunomia-bpf/schedcp).
- **AGOS-03 · PAPER** — Zheng, Y. 等. [Kgent: Kernel Extensions Large Language Model Agent](https://doi.org/10.1145/3672197.3673434), 2024.

## workload、恢复与集群基线

- **RUN-01 · SPEC** — Open Container Initiative. [Runtime Specification](https://github.com/opencontainers/runtime-spec).
- **RUN-02 · ARTIFACT** — CRIU maintainers. [Checkpoint/Restore In Userspace](https://github.com/checkpoint-restore/criu).
- **CLUSTER-01 · PAPER** — Verma, A. 等. [Large-scale cluster management at Google with Borg](https://research.google/pubs/large-scale-cluster-management-at-google-with-borg/), EuroSys 2015.

## 学习型调度

- **LEARN-01 · PAPER** — Mao, H. 等. [Resource Management with Deep Reinforcement Learning](https://people.csail.mit.edu/alizadeh/papers/deeprm-hotnets16.pdf), HotNets 2016.
- **LEARN-02 · PAPER** — Mao, H. 等. [Learning Scheduling Algorithms for Data Processing Clusters](https://doi.org/10.1145/3341302.3342080), SIGCOMM 2019.
- **LEARN-03 · PAPER** — Achiam, J. 等. [Constrained Policy Optimization](https://proceedings.mlr.press/v70/achiam17a), ICML 2017.

## 许可证边界

- **LIC-01 · DOC** — Linux Kernel. [Kernel licensing rules](https://docs.kernel.org/process/license-rules.html).
- **LIC-02 · DOC** — Apache Software Foundation. [Apache License v2.0 and GPL compatibility](https://www.apache.org/licenses/GPL-compatibility).

## 使用规则

- 这些来源只能支持其明确描述或报告的机制、实验和限制，不能证明 FlowKernel 的组合假设。
- `PREPRINT` 与 `ARTIFACT` 必须保留其证据等级，不得在文字中升级为已确认的同行评审结论。
- 使用 `main`、`latest` 等活文档只能作为发现基线；影响设计或实验时必须在 ADR/实验记录中
  固定实际版本、页面修订或 commit。
- 二手材料可以帮助发现文献，但不能替代此处要求的主要来源。
- 具体检索与更新方法见[文献审查协议](literature-review-protocol.md)，问题级用途见
  [研究证据追踪](research-evidence-traceability.md)。
