import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { observationQuestions, observationSources, observationArtworkOrder, selectObservationSession, shuffled } from '../src/data/observation.ts';

const artworks = JSON.parse(readFileSync(new URL('../src/data/artworks.json', import.meta.url), 'utf8'));
const byId = new Map(observationQuestions.map((q) => [q.id, q]));
function generator(seed) {
  return () => { seed = (Math.imul(1664525, seed) + 1013904223) >>> 0; return seed / 2 ** 32; };
}

test('all eleven exhibition works have multiple sourced, usable questions', () => {
  assert.equal(observationQuestions.length, 26);
  assert.equal(byId.size, observationQuestions.length);
  assert.deepEqual([...observationArtworkOrder].sort(), artworks.map((a) => a.id).sort());
  for (const artwork of artworks) {
    assert.ok(observationQuestions.filter((q) => q.artworkId === artwork.id).length >= 2, artwork.id);
  }
  for (const q of observationQuestions) {
    assert.ok(artworks.find((a) => a.id === q.artworkId)?.image, q.id);
    assert.ok(Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.choices.length, q.id);
    assert.ok(q.focus.x >= 0 && q.focus.x <= 1 && q.focus.y >= 0 && q.focus.y <= 1 && q.focus.scale >= 1, q.id);
    assert.ok(q.evidence.some((e) => e.sources.length > 0), q.id);
    for (const evidence of q.evidence) for (const source of evidence.sources) {
      assert.ok(observationSources[source]?.scope, q.id + ': ' + source);
      assert.equal(new URL(observationSources[source].url).protocol, 'https:');
    }
  }
});

test('complete and single-painting routes retain all questions in context', () => {
  const full = selectObservationSession('full');
  assert.equal(new Set(full).size, 26);
  assert.equal(full[0], observationQuestions.find((q) => q.artworkId === 'B03').id);
  for (const id of observationArtworkOrder) {
    assert.deepEqual(selectObservationSession('painting', id), observationQuestions.filter((q) => q.artworkId === id).map((q) => q.id));
  }
});

test('random routes cover exactly three paintings, two unique questions each, grouped with an introduction', () => {
  const sessions = new Set();
  for (let seed = 1; seed <= 100; seed++) {
    const session = selectObservationSession('random', 'A03', generator(seed));
    sessions.add(session.join(','));
    assert.equal(session.length, 6);
    assert.equal(new Set(session).size, 6);
    assert.equal(new Set(session.map((id) => byId.get(id).artworkId)).size, 3);
    for (let i = 0; i < session.length; i += 2) {
      const first = byId.get(session[i]);
      assert.equal(byId.get(session[i + 1]).artworkId, first.artworkId);
      assert.equal(first.id, observationQuestions.find((q) => q.artworkId === first.artworkId).id);
    }
  }
  assert.ok(sessions.size > 20, 'replays should produce varied sessions');
});

test('shuffling answer display order preserves answer identities and does not mutate data', () => {
  for (const q of observationQuestions) {
    const options = q.choices.map((text, id) => ({ text, id }));
    const original = structuredClone(options);
    const display = shuffled(options, generator(67));
    assert.deepEqual(options, original);
    assert.equal(display.find((option) => option.id === q.answer).text, q.choices[q.answer]);
    assert.deepEqual(display.map((option) => option.id).sort(), options.map((option) => option.id).sort());
  }
});
