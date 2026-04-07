# Upstream Submodules

Shallow-linked upstream sources for the Hey Bradley core flywheel.

These are reference-only submodules (no full commit history). They pin to the latest upstream `main` at time of addition.

## ruflo — Agent Orchestration

- **Path**: `upstreams/ruflo`
- **Source**: https://github.com/ruvnet/ruflo
- **Author**: ruvnet
- **Description**: The leading agent orchestration platform for Claude. Deploy intelligent multi-agent swarms, coordinate autonomous workflows, and build conversational AI systems with distributed swarm intelligence.

## RuVector — Vector Memory DB

- **Path**: `upstreams/ruvector`
- **Source**: https://github.com/ruvnet/RuVector
- **Author**: ruvnet
- **Description**: High Performance, Real-Time, Self-Learning, Vector GNN Memory DB built in Rust.

## Usage

```bash
# Clone with submodules (shallow)
git clone --recurse-submodules --shallow-submodules <repo-url>

# Initialize submodules after clone (if missed)
git submodule update --init --depth 1

# Update submodules to latest upstream main
git submodule update --remote --depth 1
```
