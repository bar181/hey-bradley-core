// 800 ms debounced auto-save: writes the active project's config to the DB.
// Spec: plans/implementation/mvp-plan/02-phase-16-local-db.md §2 (pseudocode).
// Decision record: docs/adr/ADR-040-local-sqlite-persistence.md.
//
// Subscribes to `useConfigStore` (config mutations) and `useProjectStore`
// (active project changes). Coalesces bursts via setTimeout. No-op when no
// project is active. Idempotent: safe to call once at boot.

import { useConfigStore } from '@/store/configStore';
import { useProjectStore } from '@/store/projectStore';
import { upsertProject } from './repositories/projects';

const DEBOUNCE_MS = 800;

export function setupAutosave(): () => void {
  let timer: ReturnType<typeof setTimeout> | null = null;

  const flush = (): void => {
    timer = null;
    const { activeProject, projects } = useProjectStore.getState();
    if (!activeProject) return;
    const meta = projects.find((p) => p.slug === activeProject);
    if (!meta) return;
    const { config } = useConfigStore.getState();
    try {
      upsertProject({ id: meta.slug, name: meta.name, config });
      // P114 / A1 fix #4 — flip TopBar "Unsaved" → "Saved" once the row lands.
      // Closes G8 (markSaved was a dead path with zero callers). Inside the
      // try/catch so a failed upsert does NOT clear isDirty and mislead the
      // user (fire-and-forget contract per ADR-126 D4 preserved).
      useConfigStore.getState().markSaved();
    } catch (err) {
      if (import.meta.env.DEV) {
        // eslint-disable-next-line no-console
        console.warn('[autosave] upsertProject failed', err);
      }
    }
  };

  const schedule = (): void => {
    if (useProjectStore.getState().activeProject === null) return;
    if (timer !== null) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_MS);
  };

  const unsubConfig = useConfigStore.subscribe((state, prev) => {
    if (state.config !== prev.config) schedule();
  });

  const unsubProject = useProjectStore.subscribe((state, prev) => {
    if (state.activeProject !== prev.activeProject) schedule();
  });

  return () => {
    unsubConfig();
    unsubProject();
    if (timer !== null) {
      clearTimeout(timer);
      timer = null;
    }
  };
}
