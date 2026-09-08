/**
 * 空き状況の仮データ（ここだけ書き換えれば更新できます）
 * capacity: 定員 / remaining: 残り人数
 * 午前・午後それぞれ合計5名（ものづくり2・運動3）
 */
window.RAFU_AVAILABILITY = {
  updatedLabel: "※表示は仮の空き状況です。最新はお問い合わせください。",
  slots: {
    morning: {
      label: "午前",
      craft: { capacity: 2, remaining: 1 },
      exercise: { capacity: 3, remaining: 2 },
    },
    afternoon: {
      label: "午後",
      craft: { capacity: 2, remaining: 2 },
      exercise: { capacity: 3, remaining: 1 },
    },
  },
};
