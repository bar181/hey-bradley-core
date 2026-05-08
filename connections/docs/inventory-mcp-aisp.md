# MCP + AISP External Reference

> Date: 2026-05-04 · Sources: modelcontextprotocol.io + github.com/bar181/aisp-open-core
> Author: CONNECTIONS-P1 / Agent A3 · Sibling to A1 (internal) + A2 (Claude Code plugin)
> Cite URL + retrieval per section. Direct quotes marked with `>`.

---

## Section A — Model Context Protocol (MCP)

### A1. Transports

MCP messages are JSON-RPC 2.0, UTF-8 encoded. Two standard transports:

**stdio** (preferred — `Clients SHOULD support stdio whenever possible`):
- Client launches MCP server as a subprocess.
- Server reads JSON-RPC from `stdin`, writes responses to `stdout`.
- Messages are newline-delimited and `MUST NOT` contain embedded newlines.
- Server `MAY` write UTF-8 logs to `stderr`.
- Server `MUST NOT` write anything to `stdout` that is not a valid MCP message.
- Client closes `stdin` to terminate the subprocess.

**Streamable HTTP** (replaces deprecated HTTP+SSE from protocol version `2024-11-05`):
- Server exposes a single endpoint path supporting both POST and GET (e.g. `https://example.com/mcp`).
- Every client message → new HTTP POST. `Accept` header MUST list `application/json` AND `text/event-stream`.
- Body is a single JSON-RPC request, notification, or response.
- For requests, server returns either `Content-Type: application/json` (single response) or `Content-Type: text/event-stream` (SSE stream that eventually carries the response).
- For notifications/responses from client → server returns `202 Accepted` with no body.
- Client `MAY` issue HTTP GET to open a server-initiated SSE stream.
- Sessions tracked via `Mcp-Session-Id` HTTP header (server-assigned at initialize, cryptographically secure UUID/JWT/hash, ASCII 0x21–0x7E only).
- Session termination: server returns 404 → client `MUST` re-initialize.
- Protocol version negotiated on initialize → client `MUST` echo on every subsequent request:
  `MCP-Protocol-Version: 2025-06-18` (latest version per spec date 2025-11-25).

**Security warnings (Streamable HTTP):**
- Servers `MUST` validate `Origin` header (DNS rebinding defence).
- Local servers `SHOULD` bind to `127.0.0.1` only, not `0.0.0.0`.
- Servers `SHOULD` implement authentication.

**When to use which (per preflight mandate):**
- **stdio** — Claude Code plugin (subprocess managed by host) and Cursor plugin.
- **Streamable HTTP** — hosted MCP server reachable from multiple clients.

Source: <https://modelcontextprotocol.io/docs/concepts/transports> · <https://modelcontextprotocol.io/specification>

### A2. Tool schema

Servers declaring tool support `MUST` declare the capability:

```json
{
  "capabilities": {
    "tools": {
      "listChanged": true
    }
  }
}
```

**Tool definition fields** (per spec):
- `name` — unique identifier (REQUIRED)
- `title` — optional human-readable display name
- `description` — human-readable
- `inputSchema` — JSON Schema for parameters (REQUIRED)
- `outputSchema` — optional JSON Schema for structured results
- `annotations` — optional behavior hints (clients `MUST` treat as untrusted unless server is trusted)

**Example `tools/list` entry (verbatim from spec):**

```json
{
  "name": "get_weather",
  "title": "Weather Information Provider",
  "description": "Get current weather information for a location",
  "inputSchema": {
    "type": "object",
    "properties": {
      "location": { "type": "string", "description": "City name or zip code" }
    },
    "required": ["location"]
  }
}
```

**Tool result format — unstructured `content` array:**

```json
{
  "content": [
    { "type": "text", "text": "..." }
  ],
  "isError": false
}
```

Content types: `text`, `image` (base64 + mimeType), `audio` (base64 + mimeType), `resource_link` (URI + name + description + mimeType), `resource` (embedded with text or blob).

**Structured content** lives in a sibling `structuredContent` field on the result. If `outputSchema` is declared:
- Servers `MUST` provide structured results conforming to the schema.
- Clients `SHOULD` validate against it.
- For backward compat, server `SHOULD` also serialize the JSON into a TextContent block.

**Error handling — two channels:**

1. **Protocol errors** (JSON-RPC envelope):
```json
{ "jsonrpc": "2.0", "id": 3, "error": { "code": -32602, "message": "Unknown tool: invalid_tool_name" } }
```
2. **Tool execution errors** (in result, with flag):
```json
{ "jsonrpc": "2.0", "id": 4, "result": {
    "content": [{ "type": "text", "text": "Failed to fetch weather data: API rate limit exceeded" }],
    "isError": true
}}
```

Source: <https://modelcontextprotocol.io/docs/concepts/tools>

### A3. Server lifecycle

**`tools/list` request (verbatim):**
```json
{ "jsonrpc": "2.0", "id": 1, "method": "tools/list", "params": { "cursor": "optional-cursor-value" } }
```

**`tools/list` response includes `nextCursor` for pagination.**

**`tools/call` request:**
```json
{ "jsonrpc": "2.0", "id": 2, "method": "tools/call",
  "params": { "name": "get_weather", "arguments": { "location": "New York" } } }
```

**Initialize handshake** (mentioned in spec § 3 / Streamable HTTP sequence diagram):
1. Client → POST `InitializeRequest` (no session ID).
2. Server → `InitializeResult` with `Mcp-Session-Id` header (HTTP only).
3. Client → POST `InitializedNotification` (with session ID).
4. Server → `202 Accepted`.
5. Negotiated protocol version returned by server; client echoes via `MCP-Protocol-Version` header on every subsequent HTTP request.

**`notifications/tools/list_changed`** — server-pushed when tool list mutates and `listChanged` capability was declared:
```json
{ "jsonrpc": "2.0", "method": "notifications/tools/list_changed" }
```

**Capability negotiation** also covers Resources, Prompts, and (client-side) Sampling, Roots, Elicitation. For Hey Bradley's connections layer, **Tools is the load-bearing surface**; Resources/Prompts are TBD per ADR-C0x.

Source: <https://modelcontextprotocol.io/specification> · <https://modelcontextprotocol.io/docs/concepts/tools>

### A4. TS SDK conventions

NPM packages (split — server + client):
```
npm install @modelcontextprotocol/server
npm install @modelcontextprotocol/client
```

Server class is `McpServer`:
```ts
const server = new McpServer({ name: 'greeting-server', version: '1.0.0' });
```

`registerTool` pattern (3-arg: name + schema + handler):
```ts
server.registerTool(
  'greet',
  { description: 'Greet someone by name', inputSchema: z.object({ name: z.string() }) },
  async ({ name }) => ({ content: [{ type: 'text', text: `Hello, ${name}!` }] })
);
```

Handler returns `{ content: [...] }` (or `{ content, structuredContent }` if `outputSchema` declared).

Standard Schema validation — Zod, Valibot, ArkType all supported.

**stdio bootstrap:**
```ts
import { StdioServerTransport } from '@modelcontextprotocol/server/stdio';
const transport = new StdioServerTransport();
await server.connect(transport);
```

**HTTP bootstrap:** core lib ships Streamable HTTP capabilities directly; framework integration via `@modelcontextprotocol/express` or `@modelcontextprotocol/hono` (optional middleware packages).

Source: <https://github.com/modelcontextprotocol/typescript-sdk>

---

## Section B — AISP v5.1 (aisp-open-core)

### B1. Crystal Atom structure

**Current spec stamp:** `𝔸5.1.Platinum@2026-01-09`.
Format: `𝔸X.Y.name@YYYY-MM-DD`.

**Symbol table — `Σ_512` (8 categories × 64 symbols):**

| Category | Range | Examples |
|----------|-------|----------|
| Ω (Transmuters) | [0,63] | `⊤,⊥,∧,∨,¬,→,λ,μ,fix,∎` |
| Γ (Topologics)  | [64,127] | `∈,∉,⊂,∅,𝒫,ℋ,ℳ,𝒩,𝔸` |
| ∀ (Quantifiers) | [128,191] | `∀,∃,∃!,Σ,Π,Vec,List,Maybe` |
| Δ (Contractors) | [192,255] | `State,Pre,Post,Type,Sock,Logic` |
| 𝔻 (Domains)     | [256,319] | `ℝ,ℕ,ℤ,𝔹,𝕊,Signal,Hash,Sig` |
| Ψ (Intents)     | [320,383] | `ψ,ψ_*,ψ_g,μ_f,μ_r,viable,done` |
| ⟦⟧ (Delimiters) | [384,447] | `⟦Ω⟧,⟦Σ⟧,⟦Γ⟧,⟦Λ⟧` |
| ∅ (Reserved)    | [448,511] | `⊞,✂,Φ,∂,σ,∇,conf,aff` |

**Crystal Atom block sequence (REQUIRED ordering):**

```
⟦Ω⟧ → ⟦Σ⟧ → ⟦Γ⟧ → ⟦Λ⟧ → ⟦Ε⟧
```

**Full sequence with optional context/extension blocks:**

```
𝔸 ≫ CTX? ≫ REF? ≫ ⟦Ω⟧ ≫ ⟦Σ⟧ ≫ ⟦Γ⟧ ≫ ⟦Λ⟧ ≫ ⟦Χ⟧? ≫ ⟦Ε⟧
```

**Block semantics (per Hey Bradley codebase + AISP spec):**
- **Ω (Objective)** — top-line goal / north-star intent.
- **Σ (Structure)** — typed shape declaration (data contract).
- **Γ (Grounding / topologic constraints)** — rules, invariants (e.g. `Γ R1: |contexts| ≤ 8`).
- **Λ (Logistics)** — thresholds, fallbacks, retry/escalation policy.
- **Ε (Evidence / Evaluation)** — verifications, proof claims, density measurement.
- **Χ (Extension)** — optional extra context.

Note: The spec quote names the block letters; their human-friendly mappings (Σ=Structure / Γ=Grounding / Λ=Logistics / Ε=Evaluation / Ω=Objective) match Hey Bradley's CLAUDE.md AISP conventions and ADR-053 / ADR-118 / ADR-120 atom contracts.

Source: <https://raw.githubusercontent.com/bar181/aisp-open-core/main/AI_GUIDE.md>

### B2. δ scoring

**Formal density definition (verbatim):**

```
δ ≜ λτ⃗.|{t∈τ⃗|t.k∈𝔄}|÷|{t∈τ⃗|t.k≢ws}|
```

**Plain-English:** ratio of valid AISP-symbol tokens to all non-whitespace tokens.

**Tier mapping (HIGHER δ = denser/better — note this is OPPOSITE of preflight phrasing "lower is less ambiguous"; ambiguity is a separate metric, see below):**

| Tier | Symbol | Density | Use |
|------|--------|---------|-----|
| Platinum | ◊⁺⁺ | δ ≥ 0.75 | Production specs |
| Gold     | ◊⁺  | δ ≥ 0.60 | High-quality docs |
| Silver   | ◊   | δ ≥ 0.40 | Working drafts |
| Bronze   | ◊⁻  | δ ≥ 0.20 | Initial conversions |
| Reject   | ⊘   | δ < 0.20 | Invalid |

**Validation pipeline (verbatim):**

```
validate ≜ ⌈⌉ ∘ δ ∘ Γ? ∘ ∂
```

Read right-to-left:
1. **∂ (tokenize)** — string → token list.
2. **Γ? (proof search)** — verify well-formedness via inference rules.
3. **δ (density)** — compute the ratio above.
4. **⌈⌉ (ceiling)** — map density → tier symbol.

**Ambiguity metric (separate from δ):**

```
Ambig ≜ λD. 1 - |Parse_u(D)| / |Parse_t(D)|
```

**Ambiguity constraint (verbatim):**

```
∀D ∈ AISP: Ambig(D) < 0.02
```

→ Hey Bradley preflight's "δ < 0.05 acceptable / δ < 0.02 production" is in fact the **AMBIGUITY** target, not the density target. Density target is the inverse: ≥ 0.75 for Platinum / production. **Both metrics matter independently** — A spec can be platinum-dense yet ambiguous, or unambiguous yet bronze-density. Preflight wording should be amended in `00-understanding.md` to disambiguate.

**Validator surface — three parallel implementations:**
- **npm**: `aisp-converter`, `aisp-validator` (Node.js).
- **Rust**: `aisp` crate on crates.io ("Fastest performance" per README); also `aisp-converter` Rust binary.
- **WASM**: cross-platform browser support per README ("Cross-Platform: npm, Rust crate, WASM for browser").

**CLI commands (per README):**
```
npx aisp-converter "Define x as 5"          # → x≜5
npx aisp-validator validate spec.aisp
npx aisp-validator tier spec.aisp
aisp-converter "Define x as 5"
aisp validate spec.aisp
```

**Sample output:** `"✓ VALID (Gold tier, δ=0.64)"`

Source: <https://raw.githubusercontent.com/bar181/aisp-open-core/main/AI_GUIDE.md> · <https://raw.githubusercontent.com/bar181/aisp-open-core/main/README.md>

### B3. Versioning policy

**Stamp format:** `𝔸X.Y.name@YYYY-MM-DD` (e.g. `𝔸5.1.Platinum@2026-01-09`).

**Context marker:** `γ ≔ aisp.specification.complete`

**Reference set:** `ρ ≔ ⟨glossary,types,rules,functions,errors,proofs,parser,agent⟩`

**Bundle marker (Evidence block) — verbatim sample:**

```
⟦Ε⟧⟨
δ≜0.81             [actual density]
|𝔅|≜18/18          [blocks complete]
φ≜98               [completeness percentage]
τ≜◊⁺⁺              [platinum tier]
⊢ND ⊢CAT ⊢ΠΣ ⊢𝕃 ⊢μ ⊢Θ   [proof claims]
⊢Ambig<0.02        [ambiguity certified]
⟩
```

**Backward-compat policy gap:** the README and AI_GUIDE.md fetched here do **NOT** explicitly state an "aisp-1.X minor backward-compat / aisp-2.0 RFC-gated" policy. That phrasing comes from Hey Bradley's own ADR-109 / ADR-133 (`docs/adr/`) — it is a **downstream consumer policy**, not part of the AISP open-core spec itself. The aisp-open-core repo currently labels itself `5.1 Platinum` with version stamp `𝔸5.1.Platinum@2026-01-09`; no formal SemVer compatibility contract is published in the README.

→ Hey Bradley should treat its `aisp-1.X` policy as project-local (per ADR-109 / ADR-133), and pin to AISP `𝔸5.1.Platinum` for v2.0.0-RC1 by directly referencing the dated stamp.

Source: <https://raw.githubusercontent.com/bar181/aisp-open-core/main/AI_GUIDE.md>

### B4. Rust crate surface

**What `aisp` (Rust crate on crates.io) provides per README:**
- Tokenizer (`∂`).
- Parser / proof search (`Γ?`).
- Density scorer (`δ`).
- Tier classifier (`⌈⌉`).
- Conversion utilities (`aisp-converter` CLI).
- Validator binary (`aisp validate spec.aisp`, `aisp-validator validate spec.aisp`).
- WASM target for browser embedding.

**For Hey Bradley connections layer (per preflight Phase 4 — Rust crate enhancements priority #4):**
- Existing `aisp` crate is the **delta + ambiguity + tier engine** — Hey Bradley should consume, not re-implement.
- Per preflight: Phase-4 crate enhancements are: **Crystal Atom builder** (compose Ω/Σ/Γ/Λ/Ε programmatically) · **DDD extractor** (DDD_ATOM Σ → bounded contexts) · **CLAUDE.md formatter** (atom array → markdown bundle per ADR-122) · **ambiguity diff** (compare two specs and score the change in ambiguity).
- These are NEW surfaces that build on the published crate; the connections-layer Rust work would either upstream them into `aisp-open-core` or live in a Hey-Bradley-side companion crate (decision deferred to ADR-C0x).

Source: <https://github.com/bar181/aisp-open-core> · <https://raw.githubusercontent.com/bar181/aisp-open-core/main/README.md>

---

## Section C — Gaps / unknowns

1. **MCP `initialize` request payload schema** — fetched pages describe the handshake but not the field-by-field shape. The authoritative source is `schema.ts` linked from the spec page (`https://github.com/modelcontextprotocol/specification/blob/main/schema/2025-11-25/schema.ts`). Action for Phase 2: fetch `schema.ts` directly when designing connections-layer client/server initialisation.

2. **TS SDK package names** — the WebFetch returned `@modelcontextprotocol/server` and `@modelcontextprotocol/client` as split packages with helper transports `@modelcontextprotocol/server/stdio`. The actual packages on npm are widely documented as `@modelcontextprotocol/sdk` (single combined package). The split-package claim should be verified by reading `package.json` from the typescript-sdk repo before code is written. **Likely WebFetch summarizer paraphrase, not literal install command.**

3. **AISP δ vs Ambiguity terminology** — the preflight conflates the two ("δ < 0.05 acceptable; < 0.02 production"). Spec is explicit: **δ is density (higher = better, ≥ 0.75 for Platinum); Ambig is a separate metric (lower = better, < 0.02 hard constraint).** The `00-understanding.md` synthesizer (A4) should correct this and the connections-layer ADRs should use "Ambig" when targeting < 0.02 and "δ" when targeting ≥ 0.75.

4. **AISP versioning RFC policy** — not present in upstream `aisp-open-core` README/AI_GUIDE. Phrasing "aisp-1.X minor backward-compat / aisp-2.0 RFC-gated" originates in Hey Bradley's ADR-109 + ADR-133 and is project-local. Connections layer ADRs should not over-claim that AISP itself enforces a backward-compat contract.

5. **AISP Crystal Atom block letter ↔ name mapping** — the spec quotes block delimiters (`⟦Ω⟧ ⟦Σ⟧ ⟦Γ⟧ ⟦Λ⟧ ⟦Ε⟧`) but the human-friendly names (Objective / Structure / Grounding / Logistics / Evaluation) come from Hey Bradley's atom modules (PATCH_ATOM / INTENT_ATOM / DDD_ATOM source headers). Both views are consistent; downstream docs should preserve both labelings to keep AI and human readers aligned.

6. **MCP Resources + Prompts surface** — fetched material focuses on Tools (the load-bearing surface for connections layer). Resources (file-like data exposure) and Prompts (templated workflows) may matter for the Claude Code plugin path (e.g. expose AISP bundle markdown as a Resource, expose `/spec` slash-command body as a Prompt). Worth fetching `https://modelcontextprotocol.io/docs/concepts/resources` and `https://modelcontextprotocol.io/docs/concepts/prompts` in Phase 2 if those primitives are scoped in.

7. **No 404s encountered.** All 8 attempted URLs returned content. The quickstart server page returned a large output (94.9KB; persisted — full per-language tutorial available if needed in Phase 2).

8. **Validator runtime location for Hey Bradley** — three published implementations (npm / Rust / WASM). Phase 2 ADR will need to choose: **NPX path** = bundle `aisp-validator` npm at install time; **Rust path** = ship `aisp` binary with the crate; **WASM path** = embed in browser-side workbench. Open question per preflight Phase 4 priority list.

---

## Retrieval log

| URL | Result | Notes |
|-----|--------|-------|
| modelcontextprotocol.io/specification | OK | Spec dated 2025-11-25; schema.ts referenced |
| modelcontextprotocol.io/quickstart/server | OK (94.9KB, persisted) | Full tutorial, multi-language |
| modelcontextprotocol.io/docs/concepts/transports | OK | stdio + Streamable HTTP fully quoted |
| modelcontextprotocol.io/docs/concepts/tools | OK | Tool schema + result types + error model verbatim |
| github.com/modelcontextprotocol/typescript-sdk | OK | SDK API summary; package names need re-verify (Gap #2) |
| github.com/bar181/aisp-open-core | OK | Version + tier table + CLI surface |
| raw.githubusercontent.com/.../AI_GUIDE.md | OK | Symbol table + δ formula + Ambig formula + bundle marker verbatim |
| raw.githubusercontent.com/.../README.md | OK | CLI commands + tier table + WASM mention |

No 404s. No redirects requiring follow-up.
