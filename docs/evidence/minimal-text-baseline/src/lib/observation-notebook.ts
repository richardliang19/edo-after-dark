import { observationQuestions, observationSources } from '../data/observation.ts';
import type { ObservationSnapshot } from './observation-session.ts';

export function formatObservationNotebook(snapshot: Pick<ObservationSnapshot, 'session' | 'outcomes' | 'notes'>): string {
  const lines = ['江戶不打烊｜我的江戶夜景觀察手帖', '展覽資料查核：2026-11-18。以下區分展覽解說與觀眾自行填寫的記錄。', ''];
  for (const id of snapshot.session) {
    const q = observationQuestions.find(q => q.id === id);
    if (!q || !(id in snapshot.outcomes)) continue;
    lines.push(`${q.artworkId}｜${q.title}`, `畫面線索（展覽）：${q.observation}`, `閱讀重點（展覽）：${q.takeaway}`);
    for (const e of q.evidence) {
      lines.push(`${e.kind}：${e.text}`);
      for (const key of e.sources) {
        const s = observationSources[key];
        lines.push(`來源：${s.institution}｜${s.title}｜${s.url}`, `引用範圍：${s.scope}`);
      }
    }
    lines.push(`策展提問：${q.reflection}`, `我的記錄：${snapshot.notes[id]?.trim() || '（未填寫）'}`, '');
  }
  lines.push('回看自己的筆記時，可以分辨：我看到什麼、我如何推論、還有什麼疑問。', '本手帖在本機產生，沒有上傳到伺服器。');
  return lines.join('\r\n');
}
