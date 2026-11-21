// Activity contexts independently checked on 2026-11-18; see docs/evidence-register.csv.
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
  { id: 'night-visitors', name: '遊賞的視角', subtitle: '追著風景與相聚的時刻', description: '你的選擇偏向景色、娛樂與人群。試著從觀眾的角度閱讀：人們聚在哪裡，又如何觀看城市？', artworkId: 'A03', context: 'Cleveland 對同構圖另一印本（1940.986）的解說，介紹橋上、河岸與租用遊船的煙火觀眾。這裡的圖像來自 The Met JP642。', source: 'fireworks' },
  { id: 'merchants', name: '待客與生意的視角', subtitle: '留意熱鬧背後的供應與往來', description: '你比較留意店家、交易與待客，可以接著觀察一場聚會需要哪些準備與服務。', artworkId: 'A02', context: 'The Met 將《柳橋夜景・萬八》所屬系列介紹為廣重對江戶知名餐飲場所的描繪。', source: 'manpachi' },
  { id: 'night-workers', name: '勞動的視角', subtitle: '看見移動與服務背後的人', description: '你的選擇偏向交通、工作與協助他人。試著追問：當別人在遊賞時，誰正在工作或前往工作？', artworkId: 'A06', context: 'The Met 將《御廄河岸》的部分渡船乘客解讀為前往工作的街頭性工作者（夜鷹）；這是館方對人物的解讀。', source: 'ferry' },
  { id: 'religious-visitors', name: '祭典與往來的視角', subtitle: '循著人群與祈願的方向', description: '你較常沿著人群、物品與祭典尋找連結。可以留意人潮的方向，以及畫外的祭典如何影響畫中的活動。', artworkId: 'A07', context: 'The Met 指出，田間小路上的人群正前往鷲大明神（鷲神社）參加酉之町祭。', source: 'asakusa' },
] satisfies Array<{ id: RoleId; name: string; subtitle: string; description: string; artworkId: string; context: string; source: keyof typeof activitySources }>;

const scenarios = [
  {
    "prompt": "橋上的人群與河面遊船都在看煙火。你會先把目光放在哪裡？",
    "options": [
      "橋與船各自看得見的天空",
      "沿岸店家怎樣接待聚集的人",
      "讓船在河上移動的工作",
      "人群沿著哪條路聚集而來"
    ]
  },
  {
    "prompt": "來到面向河水的料亭，若能把一處細節放大，你會選？",
    "options": [
      "座敷裡的人如何共享景色",
      "室內外往來如何接續待客",
      "被畫在角落的服務與搬運",
      "從遠處抵達、又離開的人"
    ]
  },
  {
    "prompt": "畫中人物沒有完整出現，器物與人影仍在。你會先沿哪條線索讀下去？",
    "options": [
      "由空間想像客人先前看到的景色",
      "由餐具與托盤思考宴席的準備",
      "由樂器與席間痕跡尋找待客工作",
      "由窗外與室內物件追蹤城市往來"
    ]
  },
  {
    "prompt": "窗邊有貓，遠方有人潮，近處還有熊手形髮簪。你會先替觀眾指出？",
    "options": [
      "從安靜房間望向熱鬧田野的距離",
      "祭典小物如何隨人的往來進入房間",
      "不在街上看熱鬧的人如何參與活動",
      "髮簪與參拜人群如何呼應同一場祭典"
    ]
  }
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

