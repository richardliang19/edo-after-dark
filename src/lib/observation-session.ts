// Storage is optional. Treat saved data as untrusted, including old question versions.
import { observationQuestions, observationArtworkOrder, selectObservationSession, type ObservationMode } from '../data/observation.ts';
import { legacyObservationVersion } from '../data/observation-legacy.ts';
export const observationStorageKey = 'edo-after-dark:observation:v2';
export const observationVersion = JSON.stringify(observationQuestions.map(q => [q.id, q.prompt, q.choices, q.answer, q.reflection]));
export type ObservationSnapshot = {
  version: string;
  mode: ObservationMode;
  painting: string;
  session: string[];
  index: number;
  outcomes: Record<string, 'answered' | 'skipped'>;
  answers: Record<string, number>;
  notes: Record<string, string>;
  view: 'play' | 'notebook';
};
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object' && !Array.isArray(value);
export function parseObservationSnapshot(raw: string | null): ObservationSnapshot | null {
  try {
    const value: unknown = JSON.parse(raw ?? 'null');
    if (!record(value) || ![observationVersion, legacyObservationVersion].includes(String(value.version)) || !['full', 'random', 'painting'].includes(String(value.mode))) return null;
    // The 2026-11-18 historical corrections retain all IDs and correct indices.
    // Accept only the exact previous content signature, then apply current validation.
    // Arbitrary stale/corrupt versions are still rejected.
    if (typeof value.painting !== 'string' || !observationArtworkOrder.includes(value.painting)) return null;
    if (!Array.isArray(value.session) || !value.session.length || value.session.length > observationQuestions.length) return null;
    const ids = value.session;
    if (new Set(ids).size !== ids.length || !ids.every(id => typeof id === 'string' && observationQuestions.some(q => q.id === id))) return null;
    if (!Number.isInteger(value.index) || Number(value.index) < 0 || Number(value.index) >= ids.length) return null;
    if (!record(value.outcomes) || !record(value.answers) || !record(value.notes) || !['play', 'notebook'].includes(String(value.view))) return null;
    if (value.mode === 'random') {
      if (ids.length !== 6 || new Set(ids.map(id => observationQuestions.find(q => q.id === id)!.artworkId)).size !== 3) return null;
      for (let i = 0; i < 6; i += 2) {
        const first = observationQuestions.find(q => q.id === ids[i])!;
        const second = observationQuestions.find(q => q.id === ids[i + 1])!;
        if (!first.artworkId.startsWith('A') || first.artworkId !== second.artworkId || first !== observationQuestions.find(q => q.artworkId === first.artworkId)) return null;
      }
    } else if (JSON.stringify(ids) !== JSON.stringify(selectObservationSession(value.mode as ObservationMode, value.painting))) return null;
    for (const [id, outcome] of Object.entries(value.outcomes)) {
      if (!ids.includes(id) || !['answered', 'skipped'].includes(String(outcome))) return null;
      if (outcome === 'answered' && value.answers[id] !== observationQuestions.find(q => q.id === id)!.answer) return null;
    }
    for (const [id, answer] of Object.entries(value.answers)) {
      const q = observationQuestions.find(q => q.id === id);
      if (!ids.includes(id) || !q || !Number.isInteger(answer) || Number(answer) < 0 || Number(answer) >= q.choices.length) return null;
    }
    for (const [id, note] of Object.entries(value.notes)) {
      if (!ids.includes(id) || !(id in value.outcomes) || typeof note !== 'string' || note.length > 2000) return null;
    }
    // A restored visitor must not jump past unfinished questions.
    for (const id of ids.slice(0, Number(value.index))) if (!(id in value.outcomes)) return null;
    const savedOutcomes = value.outcomes;
    if (value.view === 'notebook' && ids.some(id => !(id in savedOutcomes))) return null;
    return { ...value, version: observationVersion } as ObservationSnapshot;
  } catch { return null; }
}
