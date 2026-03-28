# Session 1: Scaffold + Shell Build

**Date:** 2026-03-28 | **Phase:** 1.0 | **Duration:** ~30 min

## What Was Done
- Created Vite + React 18 + TS project with minimal dependencies (13 production)
- Configured Tailwind with hb-* design tokens (warm cream palette at this point)
- Built 15 components via 5 parallel agents: AppShell, TopBar, StatusBar, ModeToggle, PanelLayout, TabBar, CenterCanvas, ChatInput, DraftPanel, ExpertPanel, DraftContext, ExpertContext, RealityTab, DataTab, WorkflowTab
- Set up uiStore (Zustand) with LISTEN/BUILD + DRAFT/EXPERT toggles

## Decisions
- Dropped uuid (using crypto.randomUUID()), jszip (individual downloads), class-variance-authority (conditionals), @dnd-kit (arrow buttons)
- react-resizable-panels exports Group/Separator (not PanelGroup/PanelResizeHandle)

## Outcome
- Shell renders, all toggles work, all tabs navigate
- Warm cream design looked like a generic CRM — triggered design pivot in Session 2
