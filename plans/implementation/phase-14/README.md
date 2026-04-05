# Phase 14: LLM Integration (Stage 3 Start)

**Prerequisite:** Phase 13 CLOSED  
**Goal:** Replace simulated chat/listen with real AI-powered generation.

## Core Deliverables
- LLM API integration (Claude API via backend proxy)
- API key management (user-provided keys, secure storage)
- Real chat: natural language → JSON config transformations
- Real listen: voice/text input → AI interprets intent → builds site
- Prompt engineering pipeline (system prompts per purpose/tone/audience)
- Streaming responses with progress indicators
- Fallback to simulated mode when no API key configured
- Rate limiting and error handling
- Cost estimation display per generation
