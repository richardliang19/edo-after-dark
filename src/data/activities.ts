// Activity text checked against the linked museum records on 2026-11-13.
// Questions in the role quiz are invented viewing scenarios, not historical testimony.
export const activitySources = {
  fireworks: { label: 'Cleveland Museum of Art｜兩國花火，1940.986', url: 'https://www.clevelandart.org/art/1940.986' },
  fireworksImage: { label: 'The Met｜兩國花火，JP642（本頁圖像）', url: 'https://www.metmuseum.org/art/collection/search/37093' },
  asakusa: { label: 'The Met｜淺草田甫酉之町詣，JP60', url: 'https://www.metmuseum.org/art/collection/search/36539' },
  manpachi: { label: 'The Met｜柳橋夜景・萬八，JP1158', url: 'https://www.metmuseum.org/art/collection/search/45306' },
  ferry: { label: 'The Met｜御廄河岸，JP1547', url: 'https://www.metmuseum.org/art/collection/search/55712' },
};

export const roleIds = ['night-visitors', 'merchants', 'night-workers', 'religious-visitors'] as const;
export type RoleId = typeof roleIds[number];
export const activityRoles = [
  { id: 'night-visitors', name: '夜遊者', subtitle: '追著風景與相聚的時刻', description: '你的選擇偏向景色、娛樂與人群。試著從觀眾的角度閱讀：人們聚在哪裡，又如何觀看城市？', artworkId: 'A03', context: 'Cleveland 館藏解說指出，觀眾在橋上、河岸與租用的遊船上欣賞煙火。', source: 'fireworks' },
  { id: 'merchants', name: '商人', subtitle: '留意熱鬧背後的供應與往來', description: '你的選擇偏向店家、交易與待客。試著從供應服務的角度閱讀：一場聚會需要哪些準備？', artworkId: 'A02', context: 'The Met 將《柳橋夜景・萬八》所屬系列介紹為廣重對江戶知名餐飲場所的描繪。', source: 'manpachi' },
  { id: 'night-workers', name: '夜間工作者', subtitle: '看見移動與服務背後的人', description: '你的選擇偏向交通、工作與協助他人。試著追問：當別人在遊賞時，誰正在工作或前往工作？', artworkId: 'A06', context: 'The Met 將《御廄河岸》的部分渡船乘客解讀為前往工作的街頭性工作者（夜鷹）；這是館方對人物的解讀。', source: 'ferry' },
  { id: 'religious-visitors', name: '參拜者', subtitle: '循著人群與祈願的方向', description: '你的選擇偏向參拜、祭典與祝願。試著觀察：畫中的人潮如何讓我們看見一場畫外的活動？', artworkId: 'A07', context: 'The Met 指出，田間小路上的人群正前往鷲大明神（鷲神社）參加酉之町祭。', source: 'asakusa' },
] satisfies Array<{ id: RoleId; name: string; subtitle: string; description: string; artworkId: string; context: string; source: keyof typeof activitySources }>;

const scenarios = [
  { prompt: '如果走進一幅江戶夜景，你最先想留意什麼？', options: ['風景與聚在一起看熱鬧的人', '店家如何準備、招呼客人', '交通與服務由誰維持', '參拜人潮與他們的祝願'] },
  { prompt: '想像你要替這趟夜行挑一個主題，你會選哪個？', options: ['尋找值得停下來欣賞的景色', '沿路認識店家與買賣', '跟著工作者的移動路線', '跟著祭典與參拜的方向'] },
  { prompt: '同行的人問你想聊什麼，你會從哪裡開始？', options: ['哪裡的風景最令人難忘', '一場聚會需要哪些供應與準備', '誰的勞動容易被我們忽略', '人們為什麼帶著心願出發'] },
  { prompt: '如果要在畫面旁寫一張提問卡，你最想問？', options: ['人們在欣賞什麼？', '服務與交易如何連起這個地方？', '誰正在工作，誰正在休息？', '人群正往哪個參拜目的地走？'] },
  { prompt: '你會用哪一種方式記錄這次觀展？', options: ['收藏風景與相聚的片刻', '畫下店家、物品與往來關係', '記下交通、工具與工作的線索', '整理祭典、人潮與祈願的線索'] },
  { prompt: '如果還有時間再看一幅畫，你最想延續哪個問題？', options: ['城市裡還有哪些遊賞的角落？', '熱鬧的場景需要哪些服務？', '夜裡還有哪些人忙碌著？', '一場祭典如何改變人們的移動？'] },
];

export const quizQuestions = scenarios.map((q, index) => {
  const choices = q.options.map((text, i) => ({ text, role: roleIds[i] }));
  const offset = index % choices.length;
  return { prompt: q.prompt, choices: [...choices.slice(offset), ...choices.slice(0, offset)] };
});

export function scoreQuiz(answers: readonly (RoleId | null)[]) {
  const scores = Object.fromEntries(roleIds.map((role) => [role, 0])) as Record<RoleId, number>;
  for (const role of answers) if (role !== null && roleIds.includes(role)) scores[role]++;
  const highest = Math.max(...Object.values(scores));
  return { scores, winners: highest ? roleIds.filter((role) => scores[role] === highest) : [] };
}

