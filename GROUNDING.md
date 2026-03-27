# System Grounding - hey-bradley-core

> Auto-generated grounding file. Confirms all ruflo v3 systems are operational.
> Read this file at session start to verify system state.

## System Status: OPERATIONAL

| Component | Status | Details |
|-----------|--------|---------|
| RuFlo Core | v3.0.0 | Healthy, score 100/100 |
| Swarm | Active | hierarchical-mesh, max 15 agents, specialized strategy |
| Memory | Initialized | sql.js + HNSW backend, hybrid mode |
| Neural | Enabled | ReasoningBank, pattern learning, 384-dim embeddings |
| Embeddings (RuVector) | Initialized | all-MiniLM-L6-v2, hyperbolic (Poincare ball, c=-1) |
| Hooks | Active | 26 hooks across 7 types (full template) |
| MCP Server | Running | claude-flow v3, hierarchical-mesh topology |
| Security | Active | Auto-scan on edit, CVE check, threat model |

## Swarm Configuration

- **Swarm ID**: swarm-1774648571893-fg1vww
- **Topology**: hierarchical-mesh
- **Strategy**: specialized
- **Max Agents**: 15
- **Consensus**: majority
- **Communication**: message-bus
- **Auto-scaling**: enabled

## Memory / RuVector Configuration

- **Backend**: sql.js + HNSW
- **Embedding Model**: all-MiniLM-L6-v2 (384 dimensions)
- **Hyperbolic**: Poincare ball, curvature=-1
- **Cache Size**: 256
- **Features**: vector embeddings, pattern learning, temporal decay, reasoning bank
- **Grounding entries**: 3 (system-grounding, architecture-config, ruvector-config)
- **Embedding coverage**: 100%

## Hooks (26 Active)

| Type | Hooks |
|------|-------|
| PreToolUse | pre-edit, pre-command, pre-task |
| PostToolUse | post-edit, post-command, post-task |
| SessionStart | session-start, session-restore |
| SessionEnd | session-end |
| Intelligence | route, explain, pretrain, build-agents, transfer, trajectory (start/step/end), pattern (store/search), learn, attention |
| Analytics | metrics, intelligence_stats |
| Coordination | notify |
| System | init |

## Neural Features

- **HNSW**: enabled (150x-12,500x search improvement)
- **Quantization**: enabled (4-32x memory reduction)
- **Flash Attention**: not available (CPU-only environment)
- **ReasoningBank**: enabled
- **Embedding Geometries**: euclidean, poincare
- **Normalizations**: L2, L1, minmax, zscore

## Architecture Rules

- Domain-Driven Design with bounded contexts
- Files under 500 lines
- TDD London School (mock-first)
- Event sourcing for state changes
- Input validation at system boundaries

## Directory Structure

```
/src        - Source code
/tests      - Test files
/docs       - Documentation
/config     - Configuration files
/scripts    - Utility scripts
/examples   - Example code
```

## Health Checks (All Passing)

| Check | Latency |
|-------|---------|
| Swarm | 12.7ms |
| Memory | 4.4ms |
| MCP | 1.6ms |
| Neural | 25.8ms |
| Disk | 125.8ms |
| Network | 33.5ms |
| Database | 29.2ms |

## Platform

- **OS**: Linux x64 (6.8.0-1044-azure)
- **Node**: v24.11.1
- **Environment**: development
- **Shell**: bash

## Initialization Date

2026-03-27T21:56:11Z

---

*To re-verify: check `mcp__ruflo__system_health` with `deep: true`*
