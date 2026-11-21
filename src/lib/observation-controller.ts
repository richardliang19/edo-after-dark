import { observationQuestions, selectObservationSession, shuffled, type ObservationMode } from '../data/observation';
import { observationStorageKey, observationVersion, parseObservationSnapshot, type ObservationSnapshot } from './observation-session';
import { formatObservationNotebook } from './observation-notebook';

export function initObservationChallenge(root: HTMLElement) {
  const setup = root.querySelector<HTMLElement>('[data-observation-setup]')!;
  const sessionForm = root.querySelector<HTMLFormElement>('[data-session-form]')!;
  const picker = root.querySelector<HTMLSelectElement>('#observation-painting')!;
  const play = root.querySelector<HTMLElement>('[data-observation-play]')!;
  const result = root.querySelector<HTMLElement>('[data-observation-result]')!;
  const rounds = new Map([...root.querySelectorAll<HTMLElement>('[data-observation-round]')].map(r => [r.dataset.questionId!, r]));
  const questions = new Map(observationQuestions.map(q => [q.id, q]));
  const progress = root.querySelector<HTMLProgressElement>('progress')!;
  const prev = root.querySelector<HTMLButtonElement>('[data-round-prev]')!;
  const storageStatus = root.querySelector<HTMLElement>('[data-storage-status]')!;
  const clear = root.querySelector<HTMLButtonElement>('[data-session-clear]')!;
  const resume = root.querySelector<HTMLButtonElement>('[data-session-resume]')!;
  let outcomes: ObservationSnapshot['outcomes'] = {};
  let answers: ObservationSnapshot['answers'] = {};
  let notes: ObservationSnapshot['notes'] = {};
  let session: string[] = [], index = 0;
  let mode: ObservationMode = 'random', painting = 'A03';
  let view: ObservationSnapshot['view'] = 'play';
  let canStore = true;

  function save() {
    clear.hidden = resume.hidden = !session.length;
    if (!session.length) return;
    if (!canStore) {
      storageStatus.textContent = '此瀏覽器目前無法保存進度；本頁內仍可完成活動，離開或重新整理後不會保留。';
      return;
    }
    try {
      localStorage.setItem(observationStorageKey, JSON.stringify({ version: observationVersion, mode, painting, session, index, outcomes, answers, notes, view } satisfies ObservationSnapshot));
      storageStatus.textContent = '進度與選填觀察保存在此瀏覽器；重新整理後可接著看。開始新路線會取代原本的手帖。';
    } catch {
      canStore = false;
      storageStatus.textContent = '此瀏覽器目前無法保存進度；本頁內仍可完成活動，離開或重新整理後不會保留。';
    }
  }
  function updateProgress() {
    progress.value = session.filter(id => id in outcomes).length;
    root.querySelector<HTMLElement>('[data-notebook-return]')!.hidden = progress.value !== session.length;
  }
  function overview() {
    progress.max = session.length;
    const count = new Set(session.map(id => questions.get(id)!.artworkId)).size;
    root.querySelector('[data-session-overview]')!.textContent = (mode === 'full' ? '精讀全展' : mode === 'random' ? '隨機夜行' : '專看一幅') + ` · ${count} 幅作品 · ${session.length} 題。可回看前題，也可略過作答直接讀解說。`;
    root.querySelector('[data-observation-restart]')!.textContent = mode === 'random' ? '重新抽選三幅作品' : '重走同一路線';
  }
  function showRound(focus = true) {
    if (!session.length) return;
    view = 'play'; setup.hidden = true; play.hidden = false; result.hidden = true;
    rounds.forEach((round, id) => { round.hidden = id !== session[index]; });
    const round = rounds.get(session[index])!, question = questions.get(session[index])!;
    const group = session.filter(id => questions.get(id)!.artworkId === question.artworkId);
    root.querySelector('[data-observation-progress]')!.textContent = `第 ${index + 1}／${session.length} 題 · 本幅第 ${group.indexOf(question.id) + 1}／${group.length} 題 · ${question.phase}`;
    const img = round.querySelector<HTMLImageElement>('[data-art-viewer] img')!;
    if (!img.getAttribute('src')) img.src = img.dataset.src!;
    prev.disabled = index === 0;
    round.querySelector('[data-round-next]')!.textContent = index === session.length - 1 ? '收好我的觀察手帖 →' : '下一題 →';
    updateProgress(); save();
    if (focus) round.querySelector('h4')!.focus();
  }
  function showNotebook(focus = true) {
    view = 'notebook'; setup.hidden = true; play.hidden = true; result.hidden = false;
    const paintings = new Set(session.map(id => questions.get(id)!.artworkId));
    const skipped = session.filter(id => outcomes[id] === 'skipped').length;
    root.querySelector('[data-observation-summary]')!.textContent = `已探索 ${paintings.size} 幅作品、${session.length} 題；其中 ${skipped} 題選擇略過並閱讀解說。`;
    root.querySelectorAll<HTMLElement>('[data-notebook-painting]').forEach(el => { el.hidden = !paintings.has(el.dataset.notebookPainting!); });
    root.querySelectorAll<HTMLElement>('[data-notebook-question]').forEach(el => { el.hidden = !session.includes(el.dataset.notebookQuestion!); });
    root.querySelectorAll<HTMLElement>('[data-round-outcome]').forEach(el => { el.textContent = outcomes[el.dataset.roundOutcome!] === 'skipped' ? '略過後閱讀解說' : '完成作答與閱讀'; });
    root.querySelectorAll<HTMLElement>('[data-notebook-note]').forEach(el => {
      const note = notes[el.dataset.notebookNote!] ?? '';
      el.hidden = !note.trim(); el.querySelector('[data-note-content]')!.textContent = note;
    });
    save();
    if (focus) result.querySelector('h4')!.focus();
  }
  function paintOutcome(id: string) {
    const round = rounds.get(id)!, form = round.querySelector('form')!;
    const done = id in outcomes;
    round.querySelector<HTMLElement>('[data-explanation]')!.hidden = !done;
    form.querySelectorAll<HTMLInputElement | HTMLButtonElement>('input, [data-check], [data-skip]').forEach(el => { el.disabled = done; });
    round.querySelector<HTMLButtonElement>('[data-check]')!.disabled = done || !(id in answers);
    round.querySelector('[data-observation-feedback]')!.textContent = done ? (outcomes[id] === 'answered' ? '答對了。讀讀解說，再留下你的觀察。' : '已略過作答。可以接著讀解說，留下自己的觀察。') : '';
  }
  function resetRounds() {
    rounds.forEach((round, id) => {
      const form = round.querySelector('form')!;
      form.reset();
      const selected = form.querySelector<HTMLInputElement>(`input[value="${answers[id]}"]`);
      if (selected) selected.checked = true;
      round.querySelector<HTMLElement>('[data-hint-text]')!.hidden = true;
      round.querySelector('[data-hint]')!.setAttribute('aria-expanded', 'false');
      round.querySelector('[data-hint]')!.textContent = '給我提示';
      round.querySelector<HTMLTextAreaElement>('[data-reflection-note]')!.value = notes[id] ?? '';
      round.querySelector('[data-art-viewer]')!.dispatchEvent(new Event('viewer-reset'));
      const comparison = round.querySelector<HTMLDetailsElement>('[data-comparison]');
      if (comparison) comparison.open = false;
      if (session.includes(id)) {
        const list = round.querySelector('.answer-list')!;
        shuffled([...list.children]).forEach(label => list.append(label));
      }
      paintOutcome(id);
    });
  }
  function startSession() {
    session = selectObservationSession(mode, painting);
    outcomes = {}; answers = {}; notes = {}; index = 0;
    resetRounds(); overview(); showRound();
  }
  sessionForm.addEventListener('change', () => { picker.disabled = sessionForm.querySelector<HTMLInputElement>('input:checked')?.value !== 'painting'; });
  sessionForm.addEventListener('submit', event => {
    event.preventDefault();
    mode = sessionForm.querySelector<HTMLInputElement>('input:checked')!.value as ObservationMode;
    painting = picker.value; startSession();
  });
  resume.addEventListener('click', () => view === 'notebook' ? showNotebook() : showRound());
  root.querySelectorAll('[data-route-change]').forEach(button => button.addEventListener('click', () => {
    setup.hidden = false; play.hidden = result.hidden = true;
    const legend = sessionForm.querySelector('legend')!; legend.tabIndex = -1; legend.focus();
  }));
  clear.addEventListener('click', () => {
    session = []; outcomes = {}; answers = {}; notes = {}; index = 0;
    resetRounds(); sessionForm.reset(); picker.disabled = true;
    mode = 'random'; painting = 'A03'; view = 'play';
    setup.hidden = false; play.hidden = result.hidden = true;
    clear.hidden = resume.hidden = true;
    try { localStorage.removeItem(observationStorageKey); storageStatus.textContent = canStore ? '已清除這次的進度與觀察。可以重新選擇路線。' : '已清除這次的進度與觀察；此瀏覽器目前無法保存新進度。'; }
    catch { storageStatus.textContent = '已清除本頁的進度；瀏覽器目前無法存取儲存空間。'; }
    sessionForm.querySelector('legend')!.focus();
  });
  prev.addEventListener('click', () => { if (index > 0) { index--; showRound(); } });
  rounds.forEach((round, id) => {
    const form = round.querySelector<HTMLFormElement>('form')!, question = questions.get(id)!;
    const check = round.querySelector<HTMLButtonElement>('[data-check]')!;
    const feedback = round.querySelector<HTMLElement>('[data-observation-feedback]')!;
    const hintText = round.querySelector<HTMLElement>('[data-hint-text]')!;
    const hint = round.querySelector<HTMLButtonElement>('[data-hint]')!;
    hint.addEventListener('click', () => {
      hintText.hidden = !hintText.hidden;
      hint.setAttribute('aria-expanded', String(!hintText.hidden)); hint.textContent = hintText.hidden ? '給我提示' : '收起提示';
    });
    form.addEventListener('change', () => {
      const selected = form.querySelector<HTMLInputElement>('input:checked');
      if (selected && !(id in outcomes)) answers[id] = Number(selected.value);
      check.disabled = !selected || id in outcomes; feedback.textContent = ''; save();
    });
    function reveal(outcome: 'answered' | 'skipped') {
      if (id in outcomes) return;
      outcomes[id] = outcome; paintOutcome(id); updateProgress(); save();
      // Glide into the question's detail once the answer is revealed.
      round.querySelector('[data-art-viewer]')!.dispatchEvent(new Event('viewer-focus'));
    }
    form.addEventListener('submit', event => {
      event.preventDefault();
      if (id in outcomes) return;
      const selected = form.querySelector<HTMLInputElement>('input:checked');
      if (!selected) return;
      const value = Number(selected.value); answers[id] = value;
      if (value === question.answer) reveal('answered');
      else { feedback.textContent = question.feedback[value]; save(); }
    });
    round.querySelector('[data-skip]')!.addEventListener('click', () => reveal('skipped'));
    round.querySelector<HTMLTextAreaElement>('[data-reflection-note]')!.addEventListener('input', event => {
      if (!(id in outcomes)) return;
      notes[id] = (event.target as HTMLTextAreaElement).value.slice(0, 2000); save();
    });
    round.querySelector('[data-round-next]')!.addEventListener('click', () => {
      if (!(id in outcomes)) return;
      if (index < session.length - 1) { index++; showRound(); } else showNotebook();
    });
  });
  root.querySelectorAll<HTMLElement>('[data-review]').forEach(button => button.addEventListener('click', () => {
    const position = session.indexOf(button.dataset.review!);
    if (position >= 0) { index = position; showRound(); }
  }));
  root.querySelector('[data-observation-restart]')!.addEventListener('click', startSession);
  root.querySelector('[data-notebook-return]')!.addEventListener('click', () => showNotebook());
  root.querySelector('[data-notebook-download]')!.addEventListener('click', () => {
    const blob = new Blob(['\uFEFF', formatObservationNotebook({ session, outcomes, notes })], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url; link.download = '江戶夜景觀察手帖.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    root.querySelector('[data-download-status]')!.textContent = '已產生文字手帖；請查看瀏覽器的下載項目。來源連結與你的記錄一併收錄。';
  });
  try {
    const raw = localStorage.getItem(observationStorageKey), saved = parseObservationSnapshot(raw);
    if (saved) {
      ({ session, index, mode, painting, outcomes, answers, notes, view } = saved);
      sessionForm.querySelector<HTMLInputElement>(`input[value="${mode}"]`)!.checked = true;
      picker.value = painting; picker.disabled = mode !== 'painting';
      resetRounds(); overview();
      if (view === 'notebook') showNotebook(false); else showRound(false);
      if (canStore) storageStatus.textContent = '已恢復上次的路線、答題進度與觀察；可接著看，或清除後重新開始。';
    } else if (raw) {
      localStorage.removeItem(observationStorageKey);
      storageStatus.textContent = '先前進度與目前題庫不相容，已清除。請選擇新的路線。';
    }
  } catch {
    canStore = false;
    storageStatus.textContent = '此瀏覽器無法保存進度；活動仍可使用，請在本頁完成。';
  }
}
