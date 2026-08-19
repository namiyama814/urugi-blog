/** Maps a halfwidth kana/punctuation char (optionally combined with a following
 * halfwidth dakuten/handakuten) to its fullwidth equivalent. Two-character
 * sequences (base + ﾞ/ﾟ) are listed first so they're matched before the bare base char. */
const HALFWIDTH_KATAKANA_MAP: Record<string, string> = {
  ｶﾞ: "ガ", ｷﾞ: "ギ", ｸﾞ: "グ", ｹﾞ: "ゲ", ｺﾞ: "ゴ",
  ｻﾞ: "ザ", ｼﾞ: "ジ", ｽﾞ: "ズ", ｾﾞ: "ゼ", ｿﾞ: "ゾ",
  ﾀﾞ: "ダ", ﾁﾞ: "ヂ", ﾂﾞ: "ヅ", ﾃﾞ: "デ", ﾄﾞ: "ド",
  ﾊﾞ: "バ", ﾋﾞ: "ビ", ﾌﾞ: "ブ", ﾍﾞ: "ベ", ﾎﾞ: "ボ",
  ﾊﾟ: "パ", ﾋﾟ: "ピ", ﾌﾟ: "プ", ﾍﾟ: "ペ", ﾎﾟ: "ポ",
  ｳﾞ: "ヴ",
  ｦ: "ヲ", ｧ: "ァ", ｨ: "ィ", ｩ: "ゥ", ｪ: "ェ", ｫ: "ォ", ｬ: "ャ", ｭ: "ュ", ｮ: "ョ", ｯ: "ッ",
  ｰ: "ー", ｱ: "ア", ｲ: "イ", ｳ: "ウ", ｴ: "エ", ｵ: "オ",
  ｶ: "カ", ｷ: "キ", ｸ: "ク", ｹ: "ケ", ｺ: "コ",
  ｻ: "サ", ｼ: "シ", ｽ: "ス", ｾ: "セ", ｿ: "ソ",
  ﾀ: "タ", ﾁ: "チ", ﾂ: "ツ", ﾃ: "テ", ﾄ: "ト",
  ﾅ: "ナ", ﾆ: "ニ", ﾇ: "ヌ", ﾈ: "ネ", ﾉ: "ノ",
  ﾊ: "ハ", ﾋ: "ヒ", ﾌ: "フ", ﾍ: "ヘ", ﾎ: "ホ",
  ﾏ: "マ", ﾐ: "ミ", ﾑ: "ム", ﾒ: "メ", ﾓ: "モ",
  ﾔ: "ヤ", ﾕ: "ユ", ﾖ: "ヨ",
  ﾗ: "ラ", ﾘ: "リ", ﾙ: "ル", ﾚ: "レ", ﾛ: "ロ",
  ﾜ: "ワ", ﾝ: "ン",
  ﾞ: "゛", ﾟ: "゜",
  "｡": "。", "｢": "「", "｣": "」", "､": "、", "･": "・",
};

const HALFWIDTH_KATAKANA_PATTERN = new RegExp(
  Object.keys(HALFWIDTH_KATAKANA_MAP)
    .sort((a, b) => b.length - a.length)
    .join("|"),
  "g",
);

/** Converts halfwidth katakana (and its punctuation block) to fullwidth. Other text is left untouched. */
export function toFullWidthKatakana(text: string): string {
  return text.replace(HALFWIDTH_KATAKANA_PATTERN, (match) => HALFWIDTH_KATAKANA_MAP[match]);
}
