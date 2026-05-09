import { useEffect, useState } from 'react'

// ===== 題目類型定義 =====
type QuestionType = 'vocab' | 'sentence' | 'parse'

interface BaseQuestion {
  id: number
  type: QuestionType
  tag: string
}

interface VocabQuestion extends BaseQuestion {
  type: 'vocab'
  word: string
  sentence: string
  image: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface SentenceQuestion extends BaseQuestion {
  type: 'sentence'
  title: string
  originalSentence: string
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface ParseQuestion extends BaseQuestion {
  type: 'parse'
  title: string
  sentence: string
  parts: { text: string; label: string; color: string }[]
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
}

interface WordCardQuestion {
  id: number
  category: string
  word: string
  sentence: string
  image: string
  options: string[]
  correctAnswer: string[]
  explanation: string
  memoryTip: string
}

type Question = VocabQuestion | SentenceQuestion | ParseQuestion

type PastPaperQuestion = Question & {
  year: number
  source: string
}

interface FeedbackSubmission {
  id: number
  name: string
  email: string
  category: string
  topic: string
  message: string
  image?: string
  imageName?: string
  createdAt: string
}

interface UserAccount {
  id: string
  name: string
  email: string
  password: string
  createdAt: string
}

interface UserStudyStat {
  userId: string
  vocabCorrect: number
  vocabTotal: number
  sentenceCorrect: number
  sentenceTotal: number
  parseCorrect: number
  parseTotal: number
  wordsCorrect: number
  wordsTotal: number
  pastpaperCorrect: number
  pastpaperTotal: number
}

interface DialogueMessage {
  id: number
  role: 'user' | 'author'
  content: string
  author: string
  timestamp: string
}

export interface AncientPost {
  id: number
  userId: string
  userName: string
  modernText: string
  ancientText: string
  style: string
  likes: number
  createdAt: string
}

interface SentencePart {
  original: string
  modern: string
  type: 'subject' | 'verb' | 'object' | 'modifier' | 'other'
}

interface ChineseKnowledgeItem {
  id: number
  type: 'polysemy' | 'semantic-shift' | 'borrowed-char'
  word: string
  meanings: Array<{
    meaning: string
    example: string
    source: string
    ancient: string
    modern: string
  }>
  image?: string
}

interface RhetoricalDevice {
  id: number
  name: string
  description: string
  examples: Array<{
    text: string
    explanation: string
    source: string
    image?: string
  }>
  category: 'comparison' | 'substitution' | 'comparison-prop' | 'exaggeration' | 'parallelism' | 'contrast' | 'contrast-prop' | 'inversion' | 'pun' | 'rhetorical-q' | 'metaphor' | 'other'
}

interface ChapterStructure {
  id: number
  name: string
  description: string
  purpose: string
  examples: Array<{
    text: string
    source: string
    analysis: string
    image?: string
  }>
}

type Page = 'home' | 'classic' | 'quiz' | 'result' | 'words' | 'words-learn' | 'words-fill' | 'words-quiz' | 'words-result' | 'grammar' | 'pastpaper' | 'wrongbook' | 'stats' | 'dialogue' | 'puzzle' | 'ancient-circle'

type ModuleCard = {
  id: Page
  emoji: string
  title: string
  desc: string
  status: 'live' | 'soon'
  accentColor: string
  iconBg: string
  iconColor: string
  count: string
}

// ===== 題庫 =====
const questions: Question[] = [
  {
    id: 1, type: 'vocab', tag: '詞義辨析',
    word: '崩殂', sentence: '先帝創業未半而中道崩殂',
    image: '/death.png',
    options: ['突然生病', '死亡（指皇帝）', '事業失敗', '離開家鄉'],
    correctAnswer: '死亡（指皇帝）',
    explanation: '「崩」指山倒塌，古代專指天子駕崩；「殂」指死亡。合稱為帝王之死。'
  },
  {
    id: 2, type: 'vocab', tag: '詞義辨析',
    word: '開張', sentence: '誠宜開張聖聽',
    image: '/kaizhang.png',
    options: ['店鋪營業', '擴大（聖聽）', '開始做事', '張開嘴巴'],
    correctAnswer: '擴大（聖聽）',
    explanation: '「開張」在此為古今異義詞，古義為「擴大、廣開」，今義為「商店開業」。'
  },
  {
    id: 3, type: 'vocab', tag: '詞義辨析',
    word: '卑鄙', sentence: '先帝不以臣卑鄙',
    image: '/beibi.png',
    options: ['品德惡劣', '語言粗俗', '身份低微、見識短淺', '膽小怕事'],
    correctAnswer: '身份低微、見識短淺',
    explanation: '「卑鄙」為古今異義詞，古義指「出身低微、見識淺陋」，今義指「品行惡劣」。'
  },
  {
    id: 4, type: 'vocab', tag: '詞義辨析',
    word: '斟酌', sentence: '至於斟酌損益，進盡忠言，則攸之、禕、允之任也',
    image: '/zhenzhuo.png',
    options: ['倒酒喝酒', '仔細考慮、權衡', '詢問他人', '隨意決定'],
    correctAnswer: '仔細考慮、權衡',
    explanation: '「斟酌」本義為倒酒，引申為「仔細考慮、權衡利弊」。此處諸葛亮將斟酌政務損益的責任託付給郭攸之、費禕、董允等人。'
  },
  {
    id: 5, type: 'vocab', tag: '詞義辨析',
    word: '駑鈍', sentence: '庶竭駑鈍，攘除姦凶',
    image: '/nudum.png',
    options: ['馬跑得快', '才能低下、愚笨', '性格固執', '身體虛弱'],
    correctAnswer: '才能低下、愚笨',
    explanation: '「駑」指劣馬，「鈍」指刀刃不鋒利。諸葛亮以「駑鈍」自謙，表示願竭盡自己平庸的才能，剷除奸邪兇惡之敵。'
  },
  {
    id: 6, type: 'vocab', tag: '詞義辨析',
    word: '託付', sentence: '恐託付不效，以傷先帝之明',
    image: '/tuofu.png',
    options: ['隨便交代', '鄭重委託重任', '借錢給人', '寫信聯絡'],
    correctAnswer: '鄭重委託重任',
    explanation: '「託付」指劉備白帝城託孤，將蜀漢大業鄭重委託給諸葛亮。此句表達諸葛亮唯恐辜負先帝所託，體現了深沉的責任感。'
  },
  {
    id: 7, type: 'sentence', tag: '特殊句式',
    title: '判斷句式類型',
    originalSentence: '此誠危急存亡之秋也',
    question: '「此誠危急存亡之秋也」屬於哪種特殊句式？',
    options: ['倒裝句（賓語前置）', '判斷句（……也）', '被動句（見……於）', '省略句'],
    correctAnswer: '判斷句（……也）',
    explanation: '句末用「也」字作判斷標誌，構成「……也」式判斷句。意為「這確實是危急存亡的關鍵時刻」。'
  },
  {
    id: 8, type: 'sentence', tag: '特殊句式',
    title: '判斷句式類型',
    originalSentence: '受任於敗軍之際，奉命於危難之間',
    question: '「受任於敗軍之際」中，「於」字引出的成分屬於什麼結構？',
    options: ['主謂結構', '狀語後置（介詞結構後置）', '賓語前置', '定語後置'],
    correctAnswer: '狀語後置（介詞結構後置）',
    explanation: '「於敗軍之際」是介詞結構，作狀語後置。正常語序應為「於敗軍之際受任」。'
  },
  {
    id: 9, type: 'sentence', tag: '特殊句式',
    title: '判斷句式類型',
    originalSentence: '先帝不以臣卑鄙，猥自枉屈，三顧臣於草廬之中',
    question: '「三顧臣於草廬之中」中，「於草廬之中」屬於哪種句式？',
    options: ['被動句', '判斷句', '狀語後置句', '賓語前置句'],
    correctAnswer: '狀語後置句',
    explanation: '「於草廬之中」是介詞結構後置，作「顧」的狀語。即「在草廬之中三次拜訪我」。'
  },
  {
    id: 10, type: 'parse', tag: '拆句理解',
    title: '句子成分分析',
    sentence: '先帝創業未半而中道崩殂',
    parts: [
      { text: '先帝', label: '主語', color: 'bg-blue-500' },
      { text: '創業未半', label: '狀語（時間）', color: 'bg-violet-500' },
      { text: '而', label: '連詞（轉折）', color: 'bg-amber-500' },
      { text: '中道', label: '狀語（情況）', color: 'bg-orange-500' },
      { text: '崩殂', label: '謂語', color: 'bg-rose-500' },
    ],
    question: '「先帝創業未半而中道崩殂」中，「而」字的作用是？',
    options: ['表示順承，意為「然後」', '表示轉折，意為「卻、但是」', '表示並列，意為「和」', '表示因果，意為「因此」'],
    correctAnswer: '表示轉折，意為「卻、但是」',
    explanation: '「而」在此錶轉折關係，強調先帝創業尚未完成，卻不幸中途去世，表達了遺憾與悲痛之情。'
  },
  {
    id: 11, type: 'parse', tag: '拆句理解',
    title: '句子成分分析',
    sentence: '苟全性命於亂世，不求聞達於諸侯',
    parts: [
      { text: '苟全性命', label: '謂語+賓語', color: 'bg-emerald-500' },
      { text: '於亂世', label: '狀語後置', color: 'bg-blue-500' },
      { text: '，', label: '', color: 'bg-transparent' },
      { text: '不求聞達', label: '謂語+賓語', color: 'bg-violet-500' },
      { text: '於諸侯', label: '狀語後置', color: 'bg-orange-500' },
    ],
    question: '「苟全性命於亂世」的正確現代語序是？',
    options: ['在亂世中苟且保全性命', '苟且保全性命，在亂世之中', '亂世中的性命苟且保全', '保全性命，苟且在亂世'],
    correctAnswer: '在亂世中苟且保全性命',
    explanation: '「於亂世」是狀語後置，還原正常語序為「於亂世苟全性命」，即「在亂世中苟且保全性命」。'
  },
]

const grammarQuestions: SentenceQuestion[] = [
  {
    id: 201,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '此誠危急存亡之秋也',
    question: '下列句子屬於哪種句式？',
    options: ['判斷句', '倒裝句', '被動句', '省略句'],
    correctAnswer: '判斷句',
    explanation: '句末「也」表判斷，構成判斷句。'
  },
  {
    id: 202,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '受任於敗軍之際，奉命於危難之間',
    question: '該句最接近下列哪種句式？',
    options: ['判斷句', '倒裝句', '被動句', '省略句'],
    correctAnswer: '倒裝句',
    explanation: '「受任於敗軍之際」是狀語後置，整體句式呈倒裝結構。'
  },
  {
    id: 203,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '被時人所棄，然心不改。',
    question: '下列句子屬於哪種句式？',
    options: ['判斷句', '倒裝句', '被動句', '省略句'],
    correctAnswer: '被動句',
    explanation: '「被時人所棄」使用被動標誌「被」，屬於被動句。'
  },
  {
    id: 204,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '臣雖駑鈍，猥自枉屈。',
    question: '下列句子屬於哪種句式？',
    options: ['判斷句', '倒裝句', '被動句', '省略句'],
    correctAnswer: '省略句',
    explanation: '「猥自枉屈」省略了「以」為賓語，屬於省略句。'
  },
  {
    id: 205,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '先帝不以臣卑鄙',
    question: '「先帝不以臣卑鄙」中的「以」字在句子中的作用是什麼？',
    options: ['引出被動對象', '引出憑藉對象', '引出原因', '引出方式'],
    correctAnswer: '引出憑藉對象',
    explanation: '「以」字是介詞，引出「臣卑鄙」作為憑藉對象。'
  },
  {
    id: 206,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '將數百之眾，轉而攻秦',
    question: '該句最接近下列哪種句式？',
    options: ['主謂倒裝', '賓語前置', '狀語後置', '定語後置'],
    correctAnswer: '賓語前置',
    explanation: '「將數百之眾」中，賓語「眾」前置到了動詞「將」前面。'
  },
  {
    id: 207,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '故不錯意也',
    question: '這個句子中「也」字的作用是什麼？',
    options: ['表感嘆', '表疑問', '表判斷', '表肯定'],
    correctAnswer: '表判斷',
    explanation: '句末的「也」是判斷標誌，表示對事物的判斷。'
  },
  {
    id: 208,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '與其殺是僮，孰若賣之',
    question: '「與其…孰若…」這個結構表示什麼意思？',
    options: ['疑問', '反問', '比較選擇', '條件'],
    correctAnswer: '比較選擇',
    explanation: '「與其…孰若…」表示「與其…不如…」，用來比較兩種做法的優劣。'
  },
  {
    id: 209,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '何以自託於趙',
    question: '「何以…」這個疑問句式表示什麼？',
    options: ['什麼時間', '用什麼工具', '怎樣、如何', '為什麼'],
    correctAnswer: '怎樣、如何',
    explanation: '「何以」相當於「如何」「怎樣」，這是古文疑問句的重要類型。'
  },
  {
    id: 210,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '豈非人事哉',
    question: '「豈…哉」這個句式的真實意思是什麼？',
    options: ['真的嗎？', '難道不是…嗎？（反問）', '為什麼…？', '怎樣…？'],
    correctAnswer: '難道不是…嗎？（反問）',
    explanation: '「豈…哉」是反問句式，表達強烈肯定。'
  },
  {
    id: 211,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '棄人用犬，雖猛何為',
    question: '「雖…何…」這個句式表示什麼意思？',
    options: ['雖然…但是…', '即使…又怎樣', '雖然…也…', '既然…就…'],
    correctAnswer: '即使…又怎樣',
    explanation: '「雖…何…」是古文中表示讓步轉折的句式。'
  },
  {
    id: 212,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '竊人之財，猶謂之盜，況貪天之功，以為己力乎',
    question: '「況…乎」這個句式表示什麼文法關係？',
    options: ['因果關係', '遞進關係（更何況）', '轉折關係', '選擇關係'],
    correctAnswer: '遞進關係（更何況）',
    explanation: '「況…乎」是文言中表遞進的句式，意為「更何況、何況」。'
  },
  {
    id: 213,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '入則無法家拂士，出則無敵國外患者，國恆亡',
    question: '這個句子使用了什麼句式特點來增強表達效果？',
    options: ['排比', '對偶', '反覆', '對比'],
    correctAnswer: '對比',
    explanation: '「入…出…」構成對比，內部矛盾和外部威脅形成對照。'
  },
  {
    id: 214,
    type: 'sentence',
    tag: '句式專練',
    title: '判斷句式類型',
    originalSentence: '我孰與城北徐公美',
    question: '「孰與…」這個句式表示什麼疑問類型？',
    options: ['是否疑問', '比較疑問', '方式疑問', '原因疑問'],
    correctAnswer: '比較疑問',
    explanation: '「孰與」意為「與…相比，哪個…」，用來提出比較性的疑問。'
  },
]

const pastpaperQuestions: PastPaperQuestion[] = [
  {
    id: 301,
    type: 'vocab',
    tag: '歷年真題',
    year: 2022,
    source: 'DSE 2022',
    word: '開張',
    sentence: '誠宜開張聖聽',
    image: '/kaizhang.png',
    options: ['店鋪營業', '擴大（聖聽）', '開始做事', '張開嘴巴'],
    correctAnswer: '擴大（聖聽）',
    explanation: '該題考古今異義，「開張」在這裡為「擴大、廣開」。'
  },
  {
    id: 302,
    type: 'sentence',
    tag: '歷年真題',
    year: 2021,
    source: 'DSE 2021',
    title: '判斷句式類型',
    originalSentence: '此誠危急存亡之秋也',
    question: '該句屬於哪種句式？',
    options: ['判斷句', '倒裝句', '被動句', '省略句'],
    correctAnswer: '判斷句',
    explanation: '句末「也」表判斷。'
  },
  {
    id: 303,
    type: 'parse',
    tag: '歷年真題',
    year: 2020,
    source: 'DSE 2020',
    title: '句子成分分析',
    sentence: '先帝創業未半而中道崩殂',
    parts: [
      { text: '先帝', label: '主語', color: 'bg-blue-500' },
      { text: '創業未半', label: '狀語（時間）', color: 'bg-violet-500' },
      { text: '，', label: '', color: 'bg-transparent' },
      { text: '中道', label: '狀語（情況）', color: 'bg-orange-500' },
      { text: '崩殂', label: '謂語', color: 'bg-rose-500' },
    ],
    question: '「而」字在句中起什麼作用？',
    options: ['表示順承', '表示轉折', '表示並列', '表示因果'],
    correctAnswer: '表示轉折',
    explanation: '「而」在此錶轉折，意為「卻、但是」。'
  },
  {
    id: 304,
    type: 'sentence',
    tag: '歷年真題',
    year: 2023,
    source: 'DSE 2023',
    title: '判斷句式類型',
    originalSentence: '三顧臣於草廬之中',
    question: '該結構最接近哪種句式？',
    options: ['被動句', '狀語後置', '判斷句', '賓語前置'],
    correctAnswer: '狀語後置',
    explanation: '「於草廬之中」是狀語後置，作「顧」的狀語。'
  },
]

const wordCards: WordCardQuestion[] = [
  {
    id: 1,
    category: '一詞多義 · 使',
    word: '使',
    sentence: '乃使蒙恬北築長城而守藩籬。',
    image: '/shi_1.png',
    options: ['派遣、命令', '役使、役用', '假使、如果', '出使 foreign mission'],
    correctAnswer: ['派遣、命令', '派遣', '命令', '派', '差遣'],
    explanation:
      '這裡的「使」是動詞，意思是「派遣、命令」。從句子結構看，「乃使蒙恬……」就是「於是派蒙恬去……」。如果解釋成「假使」或「役使」，語意都不通。例句中的重點是：秦始皇命蒙恬北築長城並守衛邊防。',
    memoryTip:
      '看到「使 + 人名 + 做某事」時，往往優先判斷為「派遣、命令」。',
  },
  {
    id: 2,
    category: '一詞多義 · 使',
    word: '使',
    sentence: '使六國各愛其人，則足以拒秦。',
    image: '/shi_2.png',
    options: ['派遣、命令', '役使、役用', '假使、如果', '讓……去做'],
    correctAnswer: ['假使、如果', '假使', '如果', '假設', '倘若', '假如'],
    explanation:
      '這一句裡的「使」不是動詞「派遣」，而是連詞，表示假設，相當於「假使、如果」。整句可譯作：「如果六國都愛護自己的百姓，就完全有力量抗拒秦國。」同一個字放在不同語境裡，詞性和意思都會變。',
    memoryTip:
      '句首的「使」後面如果接完整分句，常常不是動作，而是「假使、如果」。',
  },
  {
    id: 3,
    category: '一詞多義 · 卒',
    word: '卒',
    sentence: '語卒而單于大怒。',
    image: '/zu.png',
    options: ['士兵', '倉猝、突然', '終於、最終', '結束、完畢'],
    correctAnswer: ['結束、完畢', '結束', '完畢', '完', '說完', '終止'],
    explanation:
      '這句裡的「卒」表示「結束、完畢」。「語卒」就是「話說完了」。如果解釋成「終於」或「倉猝」，都和前面的「語」搭配不起來。判斷這類詞時，要特別看它和前後詞的固定搭配關係。',
    memoryTip:
      '像「語卒」「曲卒」這類格式裡，「卒」常表示事情結束。',
  },
  {
    id: 4,
    category: '一詞多義 · 固',
    word: '固',
    sentence: '臣固知王之不忍也。',
    image: '/gu.png',
    options: ['安守、堅守', '原來、一向、本來', '頑固、固執', '牢固、堅固'],
    correctAnswer: ['原來、一向、本來', '原來', '一向', '本來', '向來', '原本'],
    explanation:
      '這裡的「固」不是「堅固」，也不是「固執」，而是副詞，表示「本來、原來、一向」。全句可理解為：「我本來就知道大王是不忍心這樣做的。」文言文中的「固」很常見，既可作形容詞，也可作副詞，必須回到句中判斷。',
    memoryTip:
      '當「固」放在動詞前面修飾判斷、認知時，常常是副詞義：本來、原來。',
  },
  {
    id: 5,
    category: '一詞多義 · 委',
    word: '委',
    sentence: '與人期行，相委而去。',
    image: '/wei.png',
    options: ['委任、交付', '推卸、推諉', '拋棄、舍棄', '委曲、曲折'],
    correctAnswer: ['拋棄、舍棄', '拋棄', '捨棄', '丟棄', '放棄', '丟下', '撇下'],
    explanation:
      '這裡的「委」是「捨棄、拋下」的意思。「相委而去」就是「丟下對方離開了」。如果解作「委任」或「推諉」，都不符合這句的情境。這個詞在文言裡很靈活，考試很喜歡拿來做語境辨義。',
    memoryTip:
      '「委去」「相委而去」這類語境裡，多半和離開、捨棄有關。',
  },
  {
    id: 6,
    category: '一詞多義 · 以',
    word: '以',
    sentence: '富國以農，距敵恃卒。',
    image: '/words/yi.png',
    options: ['用、用來', '認為、以為', '緣故、理由', '因為'],
    correctAnswer: ['用、用來', '用', '用來', '憑', '憑藉', '依靠', '靠'],
    explanation:
      '「以」在這裡是一個很常見的文言虛詞，表示「用、憑藉」。「富國以農」即「用農業來使國家富強」。文言文中「以」出現頻率極高，必須根據上下文判斷其具體含義。',
    memoryTip:
      '「以……」結構中，「以」多表示工具、方法、憑藉等含義。',
  },
  {
    id: 7,
    category: '一詞多義 · 方',
    word: '方',
    sentence: '君子固窮，小人窮斯濫矣。',
    image: '/words/fang.png',
    options: ['正要、將要', '方法、辦法', '當時、正值', '地方'],
    correctAnswer: ['方法、辦法', '方法', '辦法', '方式', '手段', '法子'],
    explanation:
      '「方」在這裡不表時間，而是「方法、辦法」之意。同一個字在不同句子中含義完全不同，這就是「一詞多義」的魅力所在。判斷時要靠上下文語境。',
    memoryTip:
      '看到「方」要迅速判斷：是時間（"將要"）還是名詞（"方法"）。',
  },
  {
    id: 8,
    category: '古今異義 · 妻子',
    word: '妻子',
    sentence: '必使仰足以事父母，俯足以畜妻子。',
    image: '/words/qizi.png',
    options: ['妻子和丈夫', '妻子和兒女', '已婚女性', '配偶'],
    correctAnswer: ['妻子和兒女', '妻子和子女', '老婆和孩子', '妻兒', '妻子兒女', '妻和子女'],
    explanation:
      '這是典型的「古今異義」詞。古代「妻子」是個複合詞，指妻子和兒女；現代「妻子」只指已婚女性。在文言文中看到「妻子」，要注意它包括全家的女性成員。這道題的關鍵是理解古代社會的家庭結構。',
    memoryTip:
      '古文中的「妻子」記住：妻 = 妻子，子 = 兒女，所以「妻子」= 全家女眷。',
  },
  {
    id: 9,
    category: '古今異義 · 無論',
    word: '無論',
    sentence: '乃不知有漢、無論魏晉。',
    image: '/words/wulun.png',
    options: ['不管怎樣', '更不必說、何況', '不討論', '沒有評論'],
    correctAnswer: ['更不必說、何況', '更不必說', '何況', '更不用說', '遑論', '且不說'],
    explanation:
      '「無論」在文言文中是遞進關係的連詞，表示「更不必說」「何況」之意。意思是既然不知道有漢，更不必說知道魏晉了。這個詞在現代漢語中變成了「不論……都……」的讓步關係，是明顯的古今異義現象。',
    memoryTip:
      '古文中的「無論」多在句子開頭，表遞進；現代的「無論」多表讓步。',
  },
  {
    id: 10,
    category: '古今異義 · 卑鄙',
    word: '卑鄙',
    sentence: '先帝不以臣卑鄙，猥自枉屈。',
    image: '/beibi.png',
    options: ['品德惡劣、下流', '身份低微、見識淺陋', '說話粗俗', '膽小怕事'],
    correctAnswer: ['身份低微、見識淺陋', '身份低微', '見識淺陋', '出身卑微', '見識短淺', '地位低下', '出身低微'],
    explanation:
      '「卑鄙」在古代是中立詞，指「身份卑微、見識短淺」；在現代是貶義詞，指「品格低劣、行為下作」。諸葛亮用來自謙，說先帝不因為自己出身低微就不信任。這是典型的古今異義詞，必須根據上下文判斷。',
    memoryTip:
      '看到古文中的「卑鄙」，首先排除現代的"品德惡劣"義，應該理解為"身份低微"。',
  },
  {
    id: 11,
    category: '一詞多義 · 伐',
    word: '伐',
    sentence: '十年春，齊師伐我。',
    image: '/words/fa.png',
    options: ['砍伐', '攻打、進攻', '功績、功勞', '自誇'],
    correctAnswer: ['攻打、進攻', '攻打', '進攻', '討伐', '徵伐', '攻擊', '伐'],
    explanation:
      '「伐」在這裡是「攻打、進攻」的意思。同一個「伐」字在不同文言篇章中可能有三四種含義：砍伐（伐木）、攻打（伐敵）、功績（自矜功伐）、自誇（願無伐善）。判斷的關鍵是看句子的主賓搭配。',
    memoryTip:
      '「伐」+敵對方 = 進攻；「伐」+樹木 = 砍伐；「伐」+動作 = 功績/自誇。',
  },
  {
    id: 12,
    category: '古今異義 · 布衣',
    word: '布衣',
    sentence: '臣本布衣，躬耕於南陽。',
    image: '/words/buyi.png',
    options: ['布制的衣服', '平民百姓', '穿布衣的人', '貧窮的象徵'],
    correctAnswer: ['平民百姓', '平民', '百姓', '老百姓', '普通人', '庶民', '布衣'],
    explanation:
      '「布衣」古義指「平民百姓」，諸葛亮以「布衣」自稱，表明自己出身普通。現代人常以為「布衣」就是布制的衣服，但在古文中往往是社會身份的代稱。這類詞彙需要了解古代社會的身份系統才能準確理解。',
    memoryTip:
      '古文中的「布衣」不是衣服本身，而是代指「平民身份」，類似「鴻門宴」中的「樊噲」最初也是布衣。',
  },
  {
    id: 13,
    category: '古今異義 · 感激',
    word: '感激',
    sentence: '由是感激，遂許先帝以驅馳。',
    image: '/words/ganji.png',
    options: ['受到感謝而高興', '感動奮發、激勵', '感恩、感謝', '激怒'],
    correctAnswer: ['感動奮發、激勵', '感動奮發', '激勵', '感動激勵', '感動激發', '激發', '感動'],
    explanation:
      '古代的「感激」不是現在的「感謝」，而是「感動奮發」的意思。諸葛亮被先帝的知遇之恩感動而受到激勵，因此決心為蜀漢效力。這是個常見的古今異義詞，特別容易在閱讀時造成理解偏差。',
    memoryTip:
      '文言中的「感激」多在人物被某事觸動後發奮的場合出現，不是表示感恩。',
  },
  {
    id: 14,
    category: '一詞多義 · 固',
    word: '固',
    sentence: '君子固窮，小人窮斯濫矣。',
    image: '/words/gu.png',
    options: ['堅固、牢固', '本來、原來', '固然、雖然', '執著、固執'],
    correctAnswer: ['本來、原來', '本來', '原來', '原本', '向來', '一向'],
    explanation:
      '這是「固」字的另一個常見用法。當「固」作副詞時，表示「本來、原來」。君子本來就能安守窮困的境況。這類虛詞的多義是文言文閱讀的難點，需要反覆接觸和積累。',
    memoryTip:
      '「固」作副詞修飾謂語時，常表「本來、一向」；作形容詞時表「堅固」。',
  },
  {
    id: 15,
    category: '古今異義 · 交通',
    word: '交通',
    sentence: '阡陌交通，雞犬相聞。',
    image: '/words/jiaotong.png',
    options: ['運輸往來', '交錯相通', '人際交往', '城市交通'],
    correctAnswer: ['交錯相通', '互相交錯', '互相連通', '交錯貫通', '縱橫交錯', '交錯', '相通'],
    explanation:
      '古代「交通」不是現在的交通工具之意，而是「交錯相通」「互相聯繫」。在《桃花源記》中，指田間小路相互交錯貫通。這類詞在古文中的含義和現代意思差異巨大，很容易造成理解混亂。',
    memoryTip:
      '古文的「交通」在地理/田地描寫中多出現，指「路相交、相通」。',
  },
]


const modules: ModuleCard[] = [
  {
    id: 'classic' as Page,
    emoji: '📜',
    title: '範文重點詞句',
    desc: '《出師表》詞義辨析、句式結構、拆句理解',
    status: 'live' as const,
    accentColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    count: `${questions.length} 題`,
  },
  {
    id: 'words' as Page,
    emoji: '🔤',
    title: '實詞虛詞專項',
    desc: 'DSE 常考實詞虛詞、一詞多義、語境辨義、易混義項對比記憶',
    status: 'live' as const,
    accentColor: 'border-l-blue-400',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    count: `${wordCards.length} 題小樣`,
  },
  {
    id: 'grammar' as Page,
    emoji: '⚙️',
    title: '句式結構專練',
    desc: '判斷句、倒裝句、被動句、省略句系統歸納',
    status: 'live' as const,
    accentColor: 'border-l-amber-400',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    count: `${grammarQuestions.length} 題`,
  },
  {
    id: 'pastpaper' as Page,
    emoji: '📝',
    title: '歷史真題刷題',
    desc: '歷年 DSE 文言文真題，按年份、考點篩選',
    status: 'live' as const,
    accentColor: 'border-l-rose-400',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    count: `${pastpaperQuestions.length} 題`,
  },
  {
    id: 'wrongbook' as Page,
    emoji: '📕',
    title: '錯題集分類',
    desc: '自動收錄錯題，按詞義 / 句式 / 拆句分類複習',
    status: 'live' as const,
    accentColor: 'border-l-violet-400',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    count: '已累計錯題',
  },
  {
    id: 'dialogue' as Page,
    emoji: '🎭',
    title: '時空對話框',
    desc: '與古文作者對話，代入共情法理解深層情感',
    status: 'live' as const,
    accentColor: 'border-l-pink-400',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    count: '與古人聊天',
  },
  {
    id: 'puzzle' as Page,
    emoji: '🧩',
    title: '邏輯解謎器',
    desc: '拆解長難句、一鍵還原古文語序、拖拽重組句子',
    status: 'live' as const,
    accentColor: 'border-l-cyan-400',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    count: '語法拆解',
  },
  {
    id: 'ancient-circle' as Page,
    emoji: '📱',
    title: '古風朋友圈',
    desc: '現代語轉古文、分享古文朋友圈、讓文言文變時尚',
    status: 'live' as const,
    accentColor: 'border-l-orange-400',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    count: '趣味轉換器',
  },
]

// ===== 投稿說明彈窗 =====
function SubmitModal({
  onClose,
  feedbackCount,
  name,
  email,
  category,
  topic,
  message,
  success,
  error,
  setName,
  setEmail,
  setCategory,
  setTopic,
  setMessage,
  imageData,
  imageName,
  onImageChange,
  onRemoveImage,
  onSubmit,
}: {
  onClose: () => void
  feedbackCount: number
  name: string
  email: string
  category: string
  topic: string
  message: string
  imageData: string
  imageName: string
  success: boolean
  error: string | null
  setName: (value: string) => void
  setEmail: (value: string) => void
  setCategory: (value: string) => void
  setTopic: (value: string) => void
  setMessage: (value: string) => void
  onSubmit: () => void
  onImageChange: (file: File) => void
  onRemoveImage: () => void
}) {
  const categories = ['詞義解釋', '背景圖片', '題目補充', '其他']

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
      <div className="pointer-events-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl mb-1">📬</div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>投稿意見</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none mt-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-gray-600 text-sm leading-relaxed mb-4">
          你有更好的詞義解釋，或者想為某個詞語提供更貼切的背景插圖？填寫下方表單，我們會把建議記錄下來。
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 space-y-2 text-xs text-gray-500 leading-relaxed">
          <p>📌 <span className="text-gray-700 font-medium">投稿內容：</span>詞義解釋文字 / 輔助背景圖片 / 題目補充</p>
          <p>✅ <span className="text-gray-700 font-medium">採納標準：</span>內容準確、適合 DSE 備考、圖文匹配</p>
          <p>🎖️ <span className="text-gray-700 font-medium">採納獎勵：</span>頁面將標註「由同學提供」</p>
          <p>📧 <span className="text-gray-700 font-medium">提交方式：</span>直接填寫表單後提交即可，本地保存。</p>
          <p>📝 <span className="text-gray-700 font-medium">已投稿：</span>{feedbackCount} 條</p>
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">投稿類型</label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          >
            {categories.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">建議標題</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：詞義解釋更準確"
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">你的名字（可選）</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：小明"
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">你的郵箱（可選）</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">建議內容</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="請寫下你的建議、改動說明或圖片說明"
            rows={5}
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">上傳插畫（可選）</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                onImageChange(e.target.files[0])
              }
            }}
            className="w-full text-xs text-gray-500"
          />
          {imageData && (
            <div className="rounded-2xl border border-gray-200 overflow-hidden bg-gray-50">
              <img src={imageData} alt={imageName} className="w-full object-cover max-h-40" />
              <div className="flex items-center justify-between px-3 py-2 text-xs text-gray-500 bg-white">
                <span className="truncate">{imageName}</span>
                <button
                  type="button"
                  onClick={onRemoveImage}
                  className="text-emerald-600 hover:text-emerald-700"
                >
                  移除
                </button>
              </div>
            </div>
          )}
        </div>

        {error && <div className="text-rose-500 text-sm mb-3">{error}</div>}
        {success && <div className="text-emerald-600 text-sm mb-3">提交成功，建議已保存！</div>}

        <div className="flex flex-col gap-3">
          <button
            onClick={onSubmit}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-bold text-white"
          >
            提交建議
          </button>
          <button
            onClick={onClose}
            className="self-end text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            取消並關閉
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== 主組件 =====
function App() {
  const [page, setPage] = useState<Page>('home')
  // ===== 模型設置 =====
  const [aiModel, setAiModel] = useState(() => localStorage.getItem('ai_model') || 'deepseek-v4-flash')
  const [arkApiKey, setArkApiKey] = useState(() => localStorage.getItem('ark_api_key') || 'REDACTED')
  const [showModelSettings, setShowModelSettings] = useState(false)
  const [modelInput, setModelInput] = useState(() => localStorage.getItem('ai_model') || 'deepseek-v4-flash')
  const [keyInput, setKeyInput] = useState(() => localStorage.getItem('ark_api_key') || 'REDACTED')

  const handleSaveSettings = () => {
    setAiModel(modelInput)
    setArkApiKey(keyInput)
    localStorage.setItem('ai_model', modelInput)
    localStorage.setItem('ark_api_key', keyInput)
    setShowModelSettings(false)
  }

  const [activeTab, setActiveTab] = useState<QuestionType | 'all'>('all')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [hasAnswered, setHasAnswered] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(true)
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]) 
  const [submitName, setSubmitName] = useState('')
  const [submitEmail, setSubmitEmail] = useState('')
  const [submitCategory, setSubmitCategory] = useState('詞義解釋')
  const [submitTopic, setSubmitTopic] = useState('')
  const [submitMessage, setSubmitMessage] = useState('')
  const [submitImageData, setSubmitImageData] = useState('')
  const [submitImageName, setSubmitImageName] = useState('')
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [accounts, setAccounts] = useState<UserAccount[]>([])
  const [currentUserId, setCurrentUserId] = useState<string | null>(null)
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [userStats, setUserStats] = useState<UserStudyStat[]>([])
  const [answerHistory, setAnswerHistory] = useState<Array<{ questionId: number; correct: boolean; type: QuestionType }>>([])
  const [wordsIndex, setWordsIndex] = useState(0)
  const [, setWordsScore] = useState(0)
  const [, setWordsSelected] = useState<string | null>(null)
  const [, setWordsAnswered] = useState(false)
  // 三階段學習
  const [, setWordsPhase] = useState<1|2|3>(1)
  const [wordsFlipped, setWordsFlipped] = useState(false)
  const [wordsFamiliar, setWordsFamiliar] = useState<Set<number>>(new Set())
  const [wordsUnfamiliar, setWordsUnfamiliar] = useState<Set<number>>(new Set())
  const [wordsPhase2Index, setWordsPhase2Index] = useState(0)
  const [wordsPhase2Score, setWordsPhase2Score] = useState(0)
  const [wordsPhase2Selected, setWordsPhase2Selected] = useState<string|null>(null)
  const [wordsPhase2Answered, setWordsPhase2Answered] = useState(false)
  const [wordsPhase3Index, setWordsPhase3Index] = useState(0)
  const [wordsPhase3Input, setWordsPhase3Input] = useState('')
  const [wordsPhase3Answered, setWordsPhase3Answered] = useState(false)
  const [wordsPhase3Score, setWordsPhase3Score] = useState(0)
  const [wordsPhase3Results, setWordsPhase3Results] = useState<Array<{word:string,sentence:string,correct:string,userInput:string,ok:boolean}>>([])
  const [quizMode, setQuizMode] = useState<'classic' | 'grammar'>('classic')
  const [wrongbook, setWrongbook] = useState<Question[]>([])
  const [wrongbookType, setWrongbookType] = useState<'all' | QuestionType>('all')
  const [pastpaperYear, setPastpaperYear] = useState<number | 'all'>('all')
  const [pastpaperType, setPastpaperType] = useState<QuestionType | 'all'>('all')
  const [pastpaperIndex, setPastpaperIndex] = useState(0)
  const [pastpaperSelected, setPastpaperSelected] = useState<string | null>(null)
  const [pastpaperAnswered, setPastpaperAnswered] = useState(false)
  const [pastpaperScore, setPastpaperScore] = useState(0)
  // 時空對話框狀態
  const [selectedAuthor, setSelectedAuthor] = useState<string>('zhuge')
  const [dialogueMessages, setDialogueMessages] = useState<DialogueMessage[]>([])
  const [dialogueInput, setDialogueInput] = useState('')
  const [dialogueLoading, setDialogueLoading] = useState(false)
  const [dialogueShowSelector, setDialogueShowSelector] = useState(true)
  const [dialogueDeleteMode, setDialogueDeleteMode] = useState(false)
  const [dialogueSelectedMsgs, setDialogueSelectedMsgs] = useState<number[]>([])
  const [customAuthors, setCustomAuthors] = useState<Array<{
    id: string; name: string; emoji: string; work: string; dynasty: string;
    intro: string; greeting: string; hints: string[]; systemPrompt: string;
  }>>(() => {
    try { return JSON.parse(localStorage.getItem('customAuthors') || '[]') } catch { return [] }
  })
  const [showCustomForm, setShowCustomForm] = useState(false)
  const [customFormName, setCustomFormName] = useState('')
  const [customFormDynasty, setCustomFormDynasty] = useState('')
  const [customFormWork, setCustomFormWork] = useState('')
  const [customFormIntro, setCustomFormIntro] = useState('')
  const [customFormLoading, setCustomFormLoading] = useState(false)
  const [dialogueHints, setDialogueHints] = useState<string[]>([])
  // 古風朋友圈社區 state
  const [communityLikes, setCommunityLikes] = useState<Record<number, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem("community_likes") || "{}") } catch { return {} }
  })
  const [communityComments, setCommunityComments] = useState<Record<number, Array<{id: number; text: string; aiReply: string; timestamp: string}>>>(() => {
    try { return JSON.parse(localStorage.getItem("community_comments") || "{}") } catch { return {} }
  })
  const [communityInput, setCommunityInput] = useState<Record<number, string>>({})
  const [communityLoading, setCommunityLoading] = useState<Record<number, boolean>>({})
  const [communityExpandedPost, setCommunityExpandedPost] = useState<number | null>(null)
  const [userPosts, setUserPosts] = useState<Array<{id: number; author: string; content: string; tags: any; time: string; likes: number; isUserPost: true; originalText?: string; bgColor?: string; borderColor?: string; textColor?: string; emoji?: string; dynasty?: string; ancientReplies?: Array<{authorName: string; emoji: string; text: string; timestamp: string}>}>>(() => {
    try { return JSON.parse(localStorage.getItem('user_posts') || '[]') } catch { return [] }
  })
  const [showPostForm, setShowPostForm] = useState(false)
  const [postFormContent, setPostFormContent] = useState('')
  const [postFormAuthor, setPostFormAuthor] = useState('')
  const [postFormTags, setPostFormTags] = useState('')
  const [postFormConverting, setPostFormConverting] = useState(false)


  const currentUser = accounts.find(account => account.id === currentUserId) ?? null

  const filteredQuestions = quizMode === 'grammar'
    ? grammarQuestions
    : activeTab === 'all'
      ? questions
      : questions.filter(q => q.type === activeTab)

  const currentQuestion = filteredQuestions[currentIndex]

  const createEmptyStat = (userId: string): UserStudyStat => ({
    userId,
    vocabCorrect: 0,
    vocabTotal: 0,
    sentenceCorrect: 0,
    sentenceTotal: 0,
    parseCorrect: 0,
    parseTotal: 0,
    wordsCorrect: 0,
    wordsTotal: 0,
    pastpaperCorrect: 0,
    pastpaperTotal: 0,
  })

  const updateUserStudyStat = (userId: string, update: Partial<Omit<UserStudyStat, 'userId'>>) => {
    setUserStats(prev => {
      const existing = prev.find(item => item.userId === userId)
      if (!existing) {
        return [{ ...createEmptyStat(userId), ...update }, ...prev]
      }
      return prev.map(item =>
        item.userId === userId
          ? {
              ...item,
              ...Object.fromEntries(
                Object.entries(update).map(([key, value]) => [key, (item as any)[key] + (value as number)])
              ),
            }
          : item
      )
    })
  }

  const recordQuizStats = () => {
    if (!currentUserId || answerHistory.length === 0) return

    const totals = answerHistory.reduce<Record<QuestionType, { correct: number; total: number }>>(
      (acc, answer) => {
        if (!acc[answer.type]) acc[answer.type] = { correct: 0, total: 0 }
        acc[answer.type].total += 1
        if (answer.correct) acc[answer.type].correct += 1
        return acc
      },
      { vocab: { correct: 0, total: 0 }, sentence: { correct: 0, total: 0 }, parse: { correct: 0, total: 0 } }
    )

    updateUserStudyStat(currentUserId, {
      vocabCorrect: totals.vocab.correct,
      vocabTotal: totals.vocab.total,
      sentenceCorrect: totals.sentence.correct,
      sentenceTotal: totals.sentence.total,
      parseCorrect: totals.parse.correct,
      parseTotal: totals.parse.total,
    })
    setAnswerHistory([])
  }

  const recordModuleResult = (userId: string | null, module: 'pastpaper' | 'words', correct: number, total: number) => {
    if (!userId) return
    if (module === 'pastpaper') {
      updateUserStudyStat(userId, { pastpaperCorrect: correct, pastpaperTotal: total })
    }
    if (module === 'words') {
      updateUserStudyStat(userId, { wordsCorrect: correct, wordsTotal: total })
    }
  }

  const handleRegister = () => {
    const trimmedName = authName.trim()
    const trimmedEmail = authEmail.trim().toLowerCase()
    if (!trimmedName || !trimmedEmail || !authPassword.trim()) {
      setAuthError('請填寫完整註冊信息。')
      return
    }
    if (accounts.some(account => account.email === trimmedEmail)) {
      setAuthError('該郵箱已註冊，請直接登錄。')
      return
    }
    const newAccount: UserAccount = {
      id: Date.now().toString(),
      name: trimmedName,
      email: trimmedEmail,
      password: authPassword,
      createdAt: new Date().toISOString(),
    }
    setAccounts(prev => [newAccount, ...prev])
    setCurrentUserId(newAccount.id)
    setAuthError(null)
    setAuthName('')
    setAuthEmail('')
    setAuthPassword('')
  }

  const handleLogin = () => {
    const trimmedEmail = authEmail.trim().toLowerCase()
    const account = accounts.find(acc => acc.email === trimmedEmail && acc.password === authPassword)
    if (!account) {
      setAuthError('郵箱或密碼錯誤。')
      return
    }
    setCurrentUserId(account.id)
    setAuthError(null)
    setAuthEmail('')
    setAuthPassword('')
  }

  const handleLogout = () => {
    setCurrentUserId(null)
    setAuthError(null)
  }

  useEffect(() => {
    const saved = localStorage.getItem('wrongbookQuestions')
    if (saved) {
      try {
        setWrongbook(JSON.parse(saved))
      } catch {
        setWrongbook([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('wrongbookQuestions', JSON.stringify(wrongbook))
  }, [wrongbook])

  useEffect(() => {
    const saved = localStorage.getItem('feedbackSubmissions')
    if (saved) {
      try {
        setFeedbacks(JSON.parse(saved))
      } catch {
        setFeedbacks([])
      }
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('feedbackSubmissions', JSON.stringify(feedbacks))
  }, [feedbacks])

  useEffect(() => {
    const savedAccounts = localStorage.getItem('userAccounts')
    if (savedAccounts) {
      try {
        setAccounts(JSON.parse(savedAccounts))
      } catch {
        setAccounts([])
      }
    }
    const savedStats = localStorage.getItem('userStudyStats')
    if (savedStats) {
      try {
        setUserStats(JSON.parse(savedStats))
      } catch {
        setUserStats([])
      }
    }
    const savedUserId = localStorage.getItem('currentUserId')
    if (savedUserId) {
      setCurrentUserId(savedUserId)
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('userAccounts', JSON.stringify(accounts))
  }, [accounts])

  useEffect(() => {
    localStorage.setItem('userStudyStats', JSON.stringify(userStats))
  }, [userStats])

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem('currentUserId', currentUserId)
    } else {
      localStorage.removeItem('currentUserId')
    }
  }, [currentUserId])

  useEffect(() => {
    setPastpaperIndex(0)
    setPastpaperSelected(null)
    setPastpaperAnswered(false)
  }, [pastpaperYear, pastpaperType])

  const filteredPastpaperQuestions = pastpaperQuestions.filter(q =>
    (pastpaperYear === 'all' || q.year === pastpaperYear) &&
    (pastpaperType === 'all' || q.type === pastpaperType)
  )
  const currentPastpaperQuestion = filteredPastpaperQuestions[pastpaperIndex]
  const pastpaperYears = Array.from(new Set(pastpaperQuestions.map(q => q.year))).sort((a, b) => b - a)

  const progress = (currentIndex / filteredQuestions.length) * 100

  const addWrongbook = (question: Question) => {
    setWrongbook(prev => {
      if (prev.some(item => item.id === question.id)) return prev
      return [...prev, question]
    })
  }

  const handleAnswer = (option: string) => {
    if (hasAnswered) return
    const correct = option === currentQuestion.correctAnswer
    setSelectedOption(option)
    setHasAnswered(true)
    setAnswerHistory(prev => [...prev, { questionId: currentQuestion.id, correct, type: currentQuestion.type }])
    if (correct) {
      setScore(s => s + 1)
    } else {
      addWrongbook(currentQuestion)
    }
  }

  const handleNext = () => {
    if (currentIndex + 1 < filteredQuestions.length) {
      setCurrentIndex(currentIndex + 1)
      setSelectedOption(null)
      setHasAnswered(false)
    } else {
      recordQuizStats()
      setPage('result')
    }
  }

  const goHome = () => {
    setPage('home')
    setQuizMode('classic')
    setCurrentIndex(0)
    setScore(0)
    setSelectedOption(null)
    setHasAnswered(false)
    setWordsIndex(0)
    setWordsScore(0)
    setWordsSelected(null)
    setWordsAnswered(false)
    setPastpaperIndex(0)
    setPastpaperSelected(null)
    setPastpaperAnswered(false)
    setPastpaperScore(0)
  }

  const startGrammar = () => {
    setQuizMode('grammar')
    setCurrentIndex(0)
    setScore(0)
    setSelectedOption(null)
    setHasAnswered(false)
    setAnswerHistory([])
    setPage('quiz')
  }

  const handlePastpaperAnswer = (option: string) => {
    if (pastpaperAnswered || !currentPastpaperQuestion) return
    const correct = option === currentPastpaperQuestion.correctAnswer
    setPastpaperSelected(option)
    setPastpaperAnswered(true)
    if (correct) {
      setPastpaperScore(s => s + 1)
    } else {
      addWrongbook(currentPastpaperQuestion)
    }
    recordModuleResult(currentUserId, 'pastpaper', correct ? 1 : 0, 1)
  }

  const handleNextPastpaper = () => {
    if (pastpaperIndex + 1 < filteredPastpaperQuestions.length) {
      setPastpaperIndex(pastpaperIndex + 1)
      setPastpaperSelected(null)
      setPastpaperAnswered(false)
    } else {
      setPastpaperIndex(0)
      setPastpaperSelected(null)
      setPastpaperAnswered(false)
    }
  }

  const clearWrongbook = () => {
    setWrongbook([])
    localStorage.removeItem('wrongbookQuestions')
  }

  const startQuiz = (tab: QuestionType | 'all') => {
    setQuizMode('classic')
    setActiveTab(tab)
    setCurrentIndex(0)
    setScore(0)
    setSelectedOption(null)
    setHasAnswered(false)
    setAnswerHistory([])
    setPage('quiz')
  }

  const startPastpaper = () => {
    setPage('pastpaper')
    setPastpaperIndex(0)
    setPastpaperSelected(null)
    setPastpaperAnswered(false)
    setPastpaperScore(0)
  }

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setSubmitError('請選擇圖片文件進行投稿。')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setSubmitError('圖片請控制在 3MB 內。')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSubmitImageData(reader.result as string)
      setSubmitImageName(file.name)
      setSubmitError(null)
    }
    reader.onerror = () => {
      setSubmitError('圖片讀取失敗，請重試。')
    }
    reader.readAsDataURL(file)
  }

  const handleFeedbackSubmit = () => {
    const trimmedTopic = submitTopic.trim()
    const trimmedMessage = submitMessage.trim()
    if (!trimmedTopic) {
      setSubmitError('請填寫建議標題。')
      setSubmitSuccess(false)
      return
    }
    if (!trimmedMessage) {
      setSubmitError('請填寫建議內容。')
      setSubmitSuccess(false)
      return
    }

    const nextFeedback: FeedbackSubmission = {
      id: Date.now(),
      name: submitName.trim() || '匿名',
      email: submitEmail.trim(),
      category: submitCategory,
      topic: trimmedTopic,
      message: trimmedMessage,
      image: submitImageData || undefined,
      imageName: submitImageName || undefined,
      createdAt: new Date().toISOString(),
    }

    setFeedbacks((prev) => [nextFeedback, ...prev])
    setSubmitSuccess(true)
    setSubmitError(null)
    setSubmitTopic('')
    setSubmitMessage('')
    setSubmitImageData('')
    setSubmitImageName('')
  }

  const startWordsSample = () => {
    setWordsIndex(0)
    setWordsScore(0)
    setWordsSelected(null)
    setWordsAnswered(false)
    setWordsPhase(1)
    setWordsFlipped(false)
    setWordsFamiliar(new Set())
    setWordsUnfamiliar(new Set())
    setWordsPhase2Index(0)
    setWordsPhase2Score(0)
    setWordsPhase2Selected(null)
    setWordsPhase2Answered(false)
    setWordsPhase3Index(0)
    setWordsPhase3Input('')
    setWordsPhase3Answered(false)
    setWordsPhase3Score(0)
    setWordsPhase3Results([])
    setPage('words-learn')
  }

  // ===== 階段1：認識卡片 =====
  const handleFamiliar = (id: number, familiar: boolean) => {
    if (familiar) {
      setWordsFamiliar(prev => new Set([...prev, id]))
    } else {
      setWordsUnfamiliar(prev => new Set([...prev, id]))
    }
    setWordsFlipped(false)
    const nextIdx = wordsIndex + 1
    if (nextIdx < wordCards.length) {
      setWordsIndex(nextIdx)
    } else {
      // 進入階段2
      setWordsPhase(2)
      setWordsPhase2Index(0)
      setWordsPhase2Score(0)
      setWordsPhase2Selected(null)
      setWordsPhase2Answered(false)
      setPage('words-quiz')
    }
  }

  // ===== 階段2：選詞義 =====
  const currentPhase2Card = wordCards[wordsPhase2Index]
  const handlePhase2Answer = (option: string) => {
    if (wordsPhase2Answered) return
    setWordsPhase2Selected(option)
    setWordsPhase2Answered(true)
    if (currentPhase2Card.correctAnswer.includes(option)) setWordsPhase2Score(s => s + 1)
  }
  const handlePhase2Next = () => {
    const nextIdx = wordsPhase2Index + 1
    if (nextIdx < wordCards.length) {
      setWordsPhase2Index(nextIdx)
      setWordsPhase2Selected(null)
      setWordsPhase2Answered(false)
    } else {
      // 進入階段3
      setWordsPhase(3)
      setWordsPhase3Index(0)
      setWordsPhase3Input('')
      setWordsPhase3Answered(false)
      setWordsPhase3Score(0)
      setWordsPhase3Results([])
      setPage('words-fill')
    }
  }

  // ===== 階段3：填空複習 =====
  const currentPhase3Card = wordCards[wordsPhase3Index]
  const handlePhase3Submit = () => {
    if (wordsPhase3Answered) return
    const userAns = wordsPhase3Input.trim()
    if (!userAns) return
    const correctArr = currentPhase3Card.correctAnswer
    const word = currentPhase3Card.word
    const sentence = currentPhase3Card.sentence
    const displayCorrect = correctArr[0]

    // 本地數組匹配：用戶答案包含任意一個可接受答案，或可接受答案包含用戶答案（且長度>=2）
    const isOk = correctArr.some((ans: string) => {
      const userLower = userAns.toLowerCase()
      const ansLower = ans.toLowerCase()
      return userLower.includes(ansLower) || (ansLower.includes(userLower) && userLower.length >= 2)
    })

    setWordsPhase3Answered(true)
    if (isOk) {
      setWordsPhase3Score(s => s + 1)
    }
    setWordsPhase3Results(prev => [...prev, {
      word, sentence, correct: displayCorrect, userInput: userAns, ok: isOk
    }])
  }
  const handlePhase3Next = () => {
    const nextIdx = wordsPhase3Index + 1
    if (nextIdx < wordCards.length) {
      setWordsPhase3Index(nextIdx)
      setWordsPhase3Input('')
      setWordsPhase3Answered(false)
    } else {
      recordModuleResult(currentUserId, 'words', wordsPhase3Score, wordCards.length)
      setPage('words-result')
    }
  }

  const getButtonStyle = (option: string) => {
    if (!hasAnswered)
      return 'bg-white border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 text-gray-800 cursor-pointer hover:shadow-sm'
    if (option === currentQuestion.correctAnswer)
      return 'bg-emerald-50 border-emerald-400 text-emerald-800'
    if (option === selectedOption)
      return 'bg-rose-50 border-rose-400 text-rose-800'
    return 'bg-white border-gray-100 text-gray-300 cursor-default'
  }

  // ==================== 主頁 ====================
  if (page === 'home') {
    return (
      <div
        className="min-h-screen bg-[#fafaf8] text-gray-900 relative"
        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
      >
        {/* 頂部導航欄 */}
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📖</span>
              <span
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                文言文學習平臺
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden md:block">香港 DSE 中文科備考</span>
              <div className="relative">
                <button
                  onClick={() => setShowModelSettings(!showModelSettings)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-emerald-50 border border-gray-200 hover:border-emerald-400 rounded-full text-xs font-medium text-gray-500 hover:text-emerald-700 transition-all"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                  API 設置
                </button>
                {showModelSettings && (
                  <div className="absolute right-0 top-10 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80 z-[9999]">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-gray-800 text-sm">API 模型設置</h3>
                      <button onClick={() => setShowModelSettings(false)} className="text-gray-400 hover:text-gray-600">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                      </button>
                    </div>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">模型名稱 (Model)</label>
                        <input type="text" value={modelInput} onChange={e => setModelInput(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="如: deepseek-v4-flash" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
                        <input type="password" value={keyInput} onChange={e => setKeyInput(e.target.value)}
                          className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                          placeholder="ark-..." />
                      </div>
                      <div className="text-xs text-gray-400 bg-gray-50 rounded-lg px-3 py-2">
                        當前模型：<span className="text-emerald-600 font-medium">{aiModel}</span>
                      </div>
                      <button onClick={handleSaveSettings}
                        className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors">
                        保存設置
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Hero 區域 */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
          <div className="flex items-end gap-4 mb-1">
            <h1
              className="text-4xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              掌握文言文，<br />從這裡開始。
            </h1>
          </div>
          <p className="text-gray-500 text-base mt-3 max-w-lg leading-relaxed">
            系統學習 DSE 核心範文詞義、句式結構與實詞虛詞，互動練習讓備考更高效。
          </p>
        </div>

        {/* 模塊網格 */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">選擇學習方式</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((mod) => (
              <button
                key={mod.id}
                onClick={() => {
                  if (mod.status !== 'live') return
                  if (mod.id === 'grammar') startGrammar()
                  else if (mod.id === 'pastpaper') startPastpaper()
                  else setPage(mod.id)
                }}
                className={`
                  relative text-left bg-white rounded-2xl border border-gray-100 border-l-4 ${mod.accentColor}
                  p-5 shadow-sm transition-all duration-200 group
                  ${mod.status === 'live'
                    ? 'hover:-translate-y-1 hover:shadow-md cursor-pointer'
                    : 'opacity-60 cursor-default'
                  }
                `}
              >
                {/* 圖標 */}
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${mod.iconBg} ${mod.iconColor} text-2xl mb-4`}>
                  {mod.emoji}
                </div>

                {/* 標題 + 狀態 */}
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="text-base font-bold text-gray-900"
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                  >
                    {mod.title}
                  </h3>
                  {mod.status === 'live' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">已上線</span>
                  )}
                  {mod.status === 'soon' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium flex items-center gap-1">
                      🔒 即將上線
                    </span>
                  )}
                </div>

                {/* 描述 */}
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{mod.desc}</p>

                {/* 底部信息 */}
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-semibold ${mod.status === 'live' ? 'text-emerald-600' : 'text-gray-400'}`}>
                    {mod.count}
                  </span>
                  {mod.status === 'live' && (
                    <span className="text-xs text-gray-400 group-hover:text-emerald-600 transition-colors font-medium">
                      開始練習 →
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右側統計與登錄面板 */}
        {!isPanelCollapsed ? (
          <div className="hidden lg:flex lg:flex-col lg:gap-4 fixed top-28 right-6 w-80 z-20">
            <div className="flex justify-end">
              <button
                onClick={() => setIsPanelCollapsed(true)}
                className="rounded-full border border-gray-200 bg-white px-3 py-1 text-xs font-medium text-gray-600 shadow-sm hover:bg-gray-50"
              >
                收起
              </button>
            </div>
            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">統計中心</div>
                  <h3 className="text-lg font-bold text-gray-900">班級匯總</h3>
                </div>
                <button
                  onClick={() => setPage('stats')}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  查看詳情
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>已註冊同學：<span className="font-semibold text-gray-900">{accounts.length}</span></p>
                <p>已記錄成績：<span className="font-semibold text-gray-900">{userStats.length}</span> 位</p>
                <p>當前登錄：<span className="font-semibold text-gray-900">{currentUser ? currentUser.name : '未登錄'}</span></p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">帳號登錄</h3>
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login')
                    setAuthError(null)
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  {authMode === 'login' ? '註冊新帳號' : '已有帳號登錄'}
                </button>
              </div>
              {currentUser ? (
                <div className="space-y-3 text-sm text-gray-600">
                  <p className="font-semibold text-gray-900">{currentUser.name}</p>
                  <p>{currentUser.email}</p>
                  <button
                    onClick={handleLogout}
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                  >
                    退出登錄
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {authMode === 'register' && (
                    <input
                      value={authName}
                      onChange={(e) => setAuthName(e.target.value)}
                      placeholder="姓名"
                      className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
                    />
                  )}
                  <input
                    value={authEmail}
                    onChange={(e) => setAuthEmail(e.target.value)}
                    placeholder="郵箱"
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
                  />
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="密碼"
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
                  />
                  {authError && <div className="text-rose-500 text-xs">{authError}</div>}
                  <button
                    onClick={authMode === 'login' ? handleLogin : handleRegister}
                    className="w-full rounded-2xl bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
                  >
                    {authMode === 'login' ? '登錄' : '註冊'}
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="hidden lg:flex fixed top-28 right-6 z-20">
            <button
              onClick={() => setIsPanelCollapsed(false)}
              className="rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
            >
              展開統計面板
            </button>
          </div>
        )}

        {/* 左下角：小貓吉祥物 */}
        <div className="fixed bottom-6 left-6 z-20 flex flex-col items-center gap-2">
          {/* 聲音開關標籤 */}
          <button
            onClick={() => {
              const v = document.getElementById('cat-mascot') as HTMLVideoElement
              if (v) {
                v.muted = !v.muted
                setIsMuted(v.muted)
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all ${
              isMuted
                ? 'bg-white border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600'
                : 'bg-emerald-50 border-emerald-300 text-emerald-600'
            }`}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? '已靜音' : '聲音開啟'}</span>
          </button>
          {/* 小貓視頻 */}
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gray-100">
            <video
              id="cat-mascot"
              src="/cat.mp4"
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* 右下角：投稿按鈕 */}
        <button
          onClick={() => setShowSubmit(true)}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-md text-sm font-medium text-gray-600 hover:text-emerald-700 group"
        >
          <span>📬</span>
          <span>投稿意見</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>

        {showSubmit && (
          <SubmitModal
            onClose={() => {
              setShowSubmit(false)
              setSubmitSuccess(false)
              setSubmitError(null)
            }}
            feedbackCount={feedbacks.length}
            name={submitName}
            email={submitEmail}
            category={submitCategory}
            topic={submitTopic}
            message={submitMessage}
            imageData={submitImageData}
            imageName={submitImageName}
            success={submitSuccess}
            error={submitError}
            setName={setSubmitName}
            setEmail={setSubmitEmail}
            setCategory={setSubmitCategory}
            setTopic={setSubmitTopic}
            setMessage={setSubmitMessage}
            onImageChange={handleImageUpload}
            onRemoveImage={() => {
              setSubmitImageData('')
              setSubmitImageName('')
            }}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </div>
    )
  }

  // ==================== 範文學習：選題型 ====================
  if (page === 'classic') {
    const quizModes = [
      { tab: 'all' as const, emoji: '🎯', title: '全部題型', desc: `共 ${questions.length} 題，詞義 + 句式 + 拆句`, accent: 'border-l-gray-400', iconBg: 'bg-gray-50', iconColor: 'text-gray-600' },
      { tab: 'vocab' as const, emoji: '📖', title: '詞義辨析', desc: `共 ${questions.filter(q => q.type === 'vocab').length} 題，古今異義 · 實詞虛詞`, accent: 'border-l-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { tab: 'sentence' as const, emoji: '🔤', title: '特殊句式', desc: `共 ${questions.filter(q => q.type === 'sentence').length} 題，判斷句 · 倒裝句 · 被動句`, accent: 'border-l-amber-400', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
      { tab: 'parse' as const, emoji: '🔍', title: '拆句理解', desc: `共 ${questions.filter(q => q.type === 'parse').length} 題，成分分析 · 語序還原`, accent: 'border-l-violet-400', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    ]

    return (
      <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 頂部導航 */}
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium">
              ← 返回
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              📜 範文重點詞句 · 《出師表》
            </span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 pt-10 pb-20">
          <h2
            className="text-2xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            選擇練習題型
          </h2>
          <p className="text-gray-500 text-sm mb-8">根據你的備考需要，選擇專項練習或全部混合練習。</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quizModes.map(({ tab, emoji, title, desc, accent, iconBg, iconColor }) => (
              <button
                key={tab}
                onClick={() => startQuiz(tab)}
                className={`text-left bg-white rounded-2xl border border-gray-100 border-l-4 ${accent} p-5 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-200 group`}
              >
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${iconBg} ${iconColor} text-2xl mb-4`}>
                  {emoji}
                </div>
                <h3
                  className="text-base font-bold text-gray-900 mb-1"
                  style={{ fontFamily: "'Noto Serif SC', serif" }}
                >
                  {title}
                </h3>
                <p className="text-gray-500 text-xs leading-relaxed mb-3">{desc}</p>
                <span className="text-xs text-gray-400 group-hover:text-emerald-600 transition-colors font-medium">
                  開始練習 →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 左下角：小貓吉祥物 */}
        <div className="fixed bottom-6 left-6 z-20 flex flex-col items-center gap-2">
          <button
            onClick={() => {
              const v = document.getElementById('cat-mascot2') as HTMLVideoElement
              if (v) {
                v.muted = !v.muted
                setIsMuted(v.muted)
              }
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border shadow-sm transition-all ${
              isMuted
                ? 'bg-white border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600'
                : 'bg-emerald-50 border-emerald-300 text-emerald-600'
            }`}
          >
            <span>{isMuted ? '🔇' : '🔊'}</span>
            <span>{isMuted ? '已靜音' : '聲音開啟'}</span>
          </button>
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gray-100">
            <video id="cat-mascot2" src="/cat.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        </div>
        {/* 投稿按鈕 */}
        <button
          onClick={() => setShowSubmit(true)}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-md text-sm font-medium text-gray-600 hover:text-emerald-700"
        >
          <span>📬</span>
          <span>投稿意見</span>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        </button>
        {showSubmit && (
          <SubmitModal
            onClose={() => {
              setShowSubmit(false)
              setSubmitSuccess(false)
              setSubmitError(null)
            }}
            feedbackCount={feedbacks.length}
            name={submitName}
            email={submitEmail}
            category={submitCategory}
            topic={submitTopic}
            message={submitMessage}
            imageData={submitImageData}
            imageName={submitImageName}
            success={submitSuccess}
            error={submitError}
            setName={setSubmitName}
            setEmail={setSubmitEmail}
            setCategory={setSubmitCategory}
            setTopic={setSubmitTopic}
            setMessage={setSubmitMessage}
            onImageChange={handleImageUpload}
            onRemoveImage={() => {
              setSubmitImageData('')
              setSubmitImageName('')
            }}
            onSubmit={handleFeedbackSubmit}
          />
        )}
      </div>
    )
  }

  // ==================== 實詞虛詞專項：專題入口 ====================
  if (page === 'words') {
    return (
      <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium">
              ← 返回
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              🔤 實詞虛詞專項
            </span>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
                <span>百詞斬式卡片練習</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>{wordCards.length} 個詞卡</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                用詞語卡片，
                <br />
                把實詞虛詞記牢。
              </h1>
              <p className="text-gray-500 leading-relaxed text-base md:text-lg max-w-2xl mb-6">
                每張卡片都會給出一個重點詞語、一條例句、一張輔助圖片和四個易混淆選項，幫助學生在真實語境裡分清詞義，而不是只靠死背現代意思。
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-1">看圖記詞</p>
                  <p className="text-xs leading-relaxed text-gray-500">用畫面建立詞義聯想，降低純文字記憶的疲勞感。</p>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-1">例句辨義</p>
                  <p className="text-xs leading-relaxed text-gray-500">每道題都直接回到《出師表》的文脈裡判斷含義。</p>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-1">易混幹擾</p>
                  <p className="text-xs leading-relaxed text-gray-500">專門加入現代常見誤解，訓練考試時的辨析能力。</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={startWordsSample} className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold shadow-sm">
                  開始學習 →
                </button>
                <span className="text-sm text-gray-400">三階段學習：認識 → 選詞義 → 填空複習</span>
              </div>
            </div>

            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm p-5 md:p-6">
              <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-gray-50 aspect-[4/3] mb-5">
                <img src={wordCards[0].image} alt={wordCards[0].word} className="w-full h-full object-cover" />
              </div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">示例卡片</span>
                <span className="text-xs text-gray-400">{wordCards[0].category}</span>
              </div>
              <h3 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: "'Noto Serif SC', serif" }}>{wordCards[0].word}</h3>
              <p className="text-sm italic text-gray-500 mb-4">「{wordCards[0].sentence}」</p>
              <div className="grid gap-2">
                {wordCards[0].options.map((option) => (
                  <div key={option} className={`rounded-xl border px-4 py-3 text-sm ${wordCards[0].correctAnswer.includes(option) ? 'border-blue-300 bg-blue-50 text-blue-700 font-semibold' : 'border-gray-100 bg-white text-gray-500'}`}>
                    {option}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 實詞虛詞專項：階段1 認識卡片 ====================
  if (page === 'words-learn') {
    const card = wordCards[wordsIndex]
    const progress = ((wordsIndex) / wordCards.length) * 100
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 頂部進度 */}
        <div className="w-full max-w-2xl mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2">
              <button onClick={() => setPage('words')} className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium">← 返回</button>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">第一階段：認識卡片</span>
              <span className="text-gray-400 text-xs">{wordsIndex + 1} / {wordCards.length}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-emerald-600">✓ 認識 {wordsFamiliar.size}</span>
              <span className="text-rose-400">✗ 不認識 {wordsUnfamiliar.size}</span>
            </div>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-blue-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {/* 卡片 */}
        <div
          className="bg-white rounded-[32px] p-6 shadow-sm max-w-2xl w-full border border-gray-100 cursor-pointer select-none"
          onClick={() => setWordsFlipped(f => !f)}
        >
          <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-6 items-stretch">
            {/* 圖片 */}
            <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-gray-50 min-h-[240px]">
              <img src={card.image} alt={card.word} className="w-full h-full object-cover" />
            </div>
            {/* 內容 */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">{card.category}</span>
                  <span className="text-xs text-gray-400">點擊翻轉</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>{card.word}</h2>
                <p className="text-gray-500 italic text-sm leading-relaxed mb-4">「{card.sentence}」</p>
                {!wordsFlipped ? (
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4 text-center">
                    <p className="text-sm text-slate-500">你認識這個詞在句中的意思嗎？</p>
                    <p className="text-xs text-slate-400 mt-1">點擊卡片翻轉查看答案</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-4">
                    <p className="text-xs text-emerald-500 mb-1 font-semibold uppercase tracking-widest">正確詞義</p>
                    <p className="text-lg font-bold text-emerald-800 mb-2">{card.correctAnswer[0]}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.memoryTip}</p>
                  </div>
                )}
              </div>
              {wordsFlipped && (
                <div className="flex gap-3 mt-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFamiliar(card.id, false) }}
                    className="flex-1 py-3 rounded-2xl border-2 border-rose-200 bg-rose-50 text-rose-600 font-bold text-sm hover:bg-rose-100 transition-colors"
                  >
                    ✗ 不認識
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFamiliar(card.id, true) }}
                    className="flex-1 py-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-colors"
                  >
                    ✓ 認識
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">點擊卡片翻轉 · 看完答案再選擇</p>
      </div>
    )
  }


  if (page === 'words-quiz') {
    const card = currentPhase2Card
    const progress2 = ((wordsPhase2Index + 1) / wordCards.length) * 100
    // 找出同一個詞的其他義項（一字多義展示）
    const sameWordCards = wordCards.filter(c => c.word === card.word && c.id !== card.id)
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="w-full max-w-2xl mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setPage('words')} className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium">← 返回</button>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">第二階段：選詞義</span>
              <span className="text-gray-400 text-xs">{wordsPhase2Index + 1} / {wordCards.length}</span>
            </div>
            <span className="text-purple-600 font-bold text-sm">得分 {wordsPhase2Score}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-purple-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress2}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-5 md:p-6 shadow-sm max-w-2xl w-full border border-gray-100">
          <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-6 items-stretch">
            <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-gray-50 min-h-[280px]">
              <img src={card.image} alt={card.word} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between gap-3 mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-purple-50 text-purple-600 font-semibold">{card.category}</span>
                <span className="text-xs text-gray-400">選詞義</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>{card.word}</h2>
              <p className="text-gray-500 italic text-sm md:text-base leading-relaxed mb-4">「{card.sentence}」</p>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">請判斷</p>
                <p className="text-sm text-slate-700 font-semibold">句中「{card.word}」的意思是？</p>
              </div>
              <div className="grid gap-3">
                {card.options.map((option) => {
                  const btnStyle = !wordsPhase2Answered
                    ? 'bg-white border-gray-200 hover:border-purple-400 hover:bg-purple-50 text-gray-800 cursor-pointer'
                    : card.correctAnswer.includes(option)
                      ? 'bg-purple-50 border-purple-400 text-purple-800'
                      : option === wordsPhase2Selected
                        ? 'bg-rose-50 border-rose-400 text-rose-800'
                        : 'bg-white border-gray-100 text-gray-300 cursor-default'
                  return (
                    <button key={option} onClick={() => handlePhase2Answer(option)}
                      className={`py-3 px-4 rounded-2xl border transition-all text-sm font-medium text-left flex justify-between items-center ${btnStyle}`}>
                      <span>{option}</span>
                      {wordsPhase2Answered && card.correctAnswer.includes(option) && <span className="text-purple-500">✓</span>}
                      {wordsPhase2Answered && option === wordsPhase2Selected && !card.correctAnswer.includes(option) && <span className="text-rose-400">✗</span>}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {wordsPhase2Answered && (
            <div className="mt-5 rounded-[28px] border border-gray-100 bg-gray-50 px-5 py-5">
              <div className={`text-center mb-2 text-base font-bold ${card.correctAnswer.includes(wordsPhase2Selected ?? '') ? 'text-purple-600' : 'text-rose-500'}`}>
                {card.correctAnswer.includes(wordsPhase2Selected ?? '') ? '答對了！' : `正確答案：${card.correctAnswer[0]}`}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed text-center mb-2">{card.explanation}</p>
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2 text-center mb-3">{card.memoryTip}</p>
              {sameWordCards.length > 0 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 mb-3">
                  <p className="text-xs font-bold text-amber-700 mb-2">「{card.word}」的其他常見義項：</p>
                  {sameWordCards.map(c => (
                    <div key={c.id} className="text-xs text-amber-800 mb-1">
                      <span className="font-semibold">{c.correctAnswer[0]}</span>
                      <span className="text-amber-600 ml-2">—「{c.sentence}」</span>
                    </div>
                  ))}
                </div>
              )}
              <button onClick={handlePhase2Next}
                className="w-full py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition-colors text-base font-bold text-white shadow-sm">
                {wordsPhase2Index + 1 < wordCards.length ? '下一題 →' : '進入第三階段：填空複習 →'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== 實詞虛詞專項：階段3 填空複習 ====================
  if (page === 'words-fill') {
    const card = currentPhase3Card
    const progress3 = ((wordsPhase3Index + 1) / wordCards.length) * 100
    // 挖空：把例句中的詞替換為下劃線
    const blankedSentence = card.sentence.replace(card.word, '＿＿')
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="w-full max-w-2xl mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setPage('words')} className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium">← 返回</button>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">第三階段：填空複習</span>
              <span className="text-gray-400 text-xs">{wordsPhase3Index + 1} / {wordCards.length}</span>
            </div>
            <span className="text-emerald-600 font-bold text-sm">得分 {wordsPhase3Score}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2">
            <div className="bg-emerald-400 h-2 rounded-full transition-all duration-500" style={{ width: `${progress3}%` }} />
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-5 md:p-6 shadow-sm max-w-2xl w-full border border-gray-100">
          <div className="grid md:grid-cols-[0.95fr_1.05fr] gap-6 items-stretch">
            <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-gray-50 min-h-[240px]">
              <img src={card.image} alt={card.word} className="w-full h-full object-cover" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 font-semibold">{card.category}</span>
                <span className="text-xs text-gray-400">填空</span>
              </div>
              <h2 className="text-4xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>{card.word}</h2>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4">
                <p className="text-xs text-slate-400 mb-1">例句（詞已挖空）</p>
                <p className="text-base font-semibold text-slate-800 leading-relaxed">「{blankedSentence}」</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">請寫出「{card.word}」在句中的意思：</p>
              <input
                type="text"
                value={wordsPhase3Input}
                onChange={e => setWordsPhase3Input(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !wordsPhase3Answered && handlePhase3Submit()}
                disabled={wordsPhase3Answered}
                placeholder="輸入詞義…"
                className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 disabled:bg-gray-50 disabled:text-gray-400 mb-3"
              />
              {!wordsPhase3Answered ? (
                <button onClick={handlePhase3Submit} disabled={!wordsPhase3Input.trim()}
                  className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 disabled:bg-gray-200 disabled:text-gray-400 transition-colors text-sm font-bold text-white flex items-center justify-center gap-2">
                  提交答案
                </button>
              ) : (
                <div>
                  {(() => {
                    const userAns = wordsPhase3Input.trim()
                    const correctArr = card.correctAnswer
                    const ok = correctArr.some((ans: string) => {
                      const u = userAns.toLowerCase()
                      const a = ans.toLowerCase()
                      return u.includes(a) || (a.includes(u) && u.length >= 2)
                    })
                    return (
                      <div className={`rounded-2xl px-4 py-3 mb-3 ${ok ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                        <p className={`text-sm font-bold mb-1 ${ok ? 'text-emerald-700' : 'text-rose-600'}`}>
                          {ok ? '✓ 答對了！' : '✗ 再想想'}
                        </p>
                        <p className="text-xs text-gray-600">正確答案：<span className="font-semibold">{card.correctAnswer[0]}</span></p>
                        <p className="text-xs text-gray-500 mt-1">{card.explanation}</p>
                      </div>
                    )
                  })()}
                  <button onClick={handlePhase3Next}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-bold text-white">
                    {wordsPhase3Index + 1 < wordCards.length ? '下一題 →' : '查看學習成績 →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 實詞虛詞專項：答題頁（舊，保留兼容）====================
  // ==================== 實詞虛詞專項：成績頁 ====================
  if (page === 'words-result') {
    const p2pct = Math.round((wordsPhase2Score / wordCards.length) * 100)
    const p3pct = Math.round((wordsPhase3Score / wordCards.length) * 100)
    const needReview = wordsPhase3Results.filter(r => !r.ok)
    const allCorrect = needReview.length === 0
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-lg w-full border border-gray-100">
          <div className="text-center mb-6">
            <div className="text-5xl mb-3">{allCorrect ? '🏆' : p3pct >= 70 ? '✨' : '📝'}</div>
            <h2 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              {allCorrect ? '三輪全部掌握！' : p3pct >= 70 ? '學得不錯，繼續加油' : '建議再刷一輪'}
            </h2>
            <p className="text-gray-400 text-sm">實詞虛詞 · 三階段學習完成</p>
          </div>

          {/* 三階段得分 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-center">
              <p className="text-xs text-blue-500 font-semibold mb-1">認識卡片</p>
              <p className="text-xl font-black text-blue-700">{wordsFamiliar.size}<span className="text-sm text-blue-400">/{wordCards.length}</span></p>
              <p className="text-xs text-blue-400 mt-1">認識</p>
            </div>
            <div className="rounded-2xl bg-purple-50 border border-purple-100 p-3 text-center">
              <p className="text-xs text-purple-500 font-semibold mb-1">選詞義</p>
              <p className="text-xl font-black text-purple-700">{wordsPhase2Score}<span className="text-sm text-purple-400">/{wordCards.length}</span></p>
              <p className="text-xs text-purple-400 mt-1">{p2pct}% 正確</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-xs text-emerald-500 font-semibold mb-1">填空複習</p>
              <p className="text-xl font-black text-emerald-700">{wordsPhase3Score}<span className="text-sm text-emerald-400">/{wordCards.length}</span></p>
              <p className="text-xs text-emerald-400 mt-1">{p3pct}% 正確</p>
            </div>
          </div>

          {/* 複習清單 */}
          {needReview.length > 0 && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4 mb-5">
              <p className="text-sm font-bold text-amber-700 mb-3">📌 需要複習的詞（{needReview.length} 個）</p>
              <div className="space-y-2">
                {needReview.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="font-black text-amber-800 text-base w-8 shrink-0" style={{ fontFamily: "'Noto Serif SC', serif" }}>{r.word}</span>
                    <div>
                      <p className="text-amber-700 italic mb-0.5">「{r.sentence}」</p>
                      <p className="text-gray-500">正確：<span className="font-semibold text-emerald-700">{r.correct}</span>　你寫：<span className="text-rose-500">{r.userInput || '（未填）'}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPage('words')} className="py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm">
              返回專題頁
            </button>
            <button onClick={startWordsSample} className="py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-bold text-white text-sm">
              再來一輪
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 佔位頁面 ====================
  if (page === 'pastpaper') {
    const years = ['all', ...pastpaperYears] as const
    const types: Array<'all' | QuestionType> = ['all', 'vocab', 'sentence', 'parse']

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-5xl w-full">
          <div className="mb-6 flex items-center gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主頁</button>
            <div className="text-sm text-gray-500">歷年真題練習 · 共 {filteredPastpaperQuestions.length} 題</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">歷史真題刷題</h2>
              <p className="text-sm text-gray-500 mt-1">按年份與題型篩選練習題，錯題自動加入錯題集。</p>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {years.map((year) => (
                <button
                  key={year}
                  onClick={() => setPastpaperYear(year)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition ${pastpaperYear === year ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {year === 'all' ? '全部年份' : `${year}年`}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  onClick={() => setPastpaperType(type)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition ${pastpaperType === type ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {type === 'all' ? '全部題型' : type === 'vocab' ? '詞義' : type === 'sentence' ? '句式' : '拆句'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">當前題目</div>
                <div className="text-lg font-semibold text-gray-900">{filteredPastpaperQuestions.length === 0 ? '請調整篩選條件' : `${pastpaperIndex + 1} / ${filteredPastpaperQuestions.length}`}</div>
              </div>
              <div className="text-sm text-gray-500">已得分 {pastpaperScore}</div>
            </div>

            {filteredPastpaperQuestions.length === 0 ? (
              <div className="py-16 text-center text-gray-500">當前篩選條件下暫無題目，請選擇「全部年份」或改變題型。</div>
            ) : (
              <>
                <div className="rounded-3xl bg-gray-50 p-5 border border-gray-100 mb-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-widest mb-2">{currentPastpaperQuestion.tag} · {currentPastpaperQuestion.year}年 {currentPastpaperQuestion.source}</div>
                      {currentPastpaperQuestion.type === 'vocab' ? (
                        <div className="text-base font-bold text-gray-900">{(currentPastpaperQuestion as VocabQuestion).word}</div>
                      ) : (
                        <div className="text-base font-bold text-gray-900">{currentPastpaperQuestion.title}</div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">題型：{currentPastpaperQuestion.type === 'vocab' ? '詞義' : currentPastpaperQuestion.type === 'sentence' ? '句式' : '拆句'}</div>
                  </div>
                  <div className="mt-4 text-gray-700">
                    {currentPastpaperQuestion.type === 'vocab' ? (
                      <p className="text-sm text-gray-600">「{(currentPastpaperQuestion as VocabQuestion).sentence}」</p>
                    ) : currentPastpaperQuestion.type === 'sentence' ? (
                      <p className="text-sm text-gray-700">「{(currentPastpaperQuestion as SentenceQuestion).originalSentence}」</p>
                    ) : (
                      <div className="text-sm text-gray-700">
                        <div className="mb-3">句子：</div>
                        <div className="flex flex-wrap gap-2">
                          {(currentPastpaperQuestion as ParseQuestion).parts.map((part, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-200 text-gray-700">{part.text}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid gap-3">
                  {currentPastpaperQuestion.options.map((option) => {
                    const buttonStyle = !pastpaperAnswered
                      ? 'bg-white border-gray-200 hover:border-rose-400 hover:bg-rose-50 text-gray-800 cursor-pointer'
                      : option === currentPastpaperQuestion.correctAnswer
                        ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                        : option === pastpaperSelected
                          ? 'bg-rose-50 border-rose-400 text-rose-800'
                          : 'bg-white border-gray-100 text-gray-300 cursor-default'
                    return (
                      <button
                        key={option}
                        onClick={() => handlePastpaperAnswer(option)}
                        className={`py-4 px-5 rounded-2xl border transition-all text-left text-sm font-medium flex justify-between items-center ${buttonStyle}`}
                      >
                        <span>{option}</span>
                        {pastpaperAnswered && option === currentPastpaperQuestion.correctAnswer && <span className="text-emerald-500">✓</span>}
                        {pastpaperAnswered && option === pastpaperSelected && option !== currentPastpaperQuestion.correctAnswer && <span className="text-rose-400">✗</span>}
                      </button>
                    )
                  })}
                </div>

                {pastpaperAnswered && (
                  <div className="mt-5 text-center">
                    <div className={`mb-3 text-base font-bold ${pastpaperSelected === currentPastpaperQuestion.correctAnswer ? 'text-emerald-600' : 'text-rose-500'}`}>
                      {pastpaperSelected === currentPastpaperQuestion.correctAnswer ? '答對了！' : `正確答案：${currentPastpaperQuestion.correctAnswer}`}
                    </div>
                    <p className="text-gray-500 text-xs mb-4 px-2 leading-relaxed">{currentPastpaperQuestion.explanation}</p>
                    <button
                      onClick={handleNextPastpaper}
                      className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-bold text-white"
                    >
                      {pastpaperIndex + 1 < filteredPastpaperQuestions.length ? '下一題 →' : '重新開始'}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (page === 'wrongbook') {
    const filters: Array<'all' | QuestionType> = ['all', 'vocab', 'sentence', 'parse']
    const displayWrongbook = wrongbookType === 'all'
      ? wrongbook
      : wrongbook.filter(item => item.type === wrongbookType)

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-5xl w-full">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主頁</button>
            <div className="text-sm text-gray-500">錯題集 · 共 {wrongbook.length} 題</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">錯題集分類</h2>
              <p className="text-sm text-gray-500 mt-1">按題型查看錯題，支持移出已掌握題目。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((type) => (
                <button
                  key={type}
                  onClick={() => setWrongbookType(type)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition ${wrongbookType === type ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {type === 'all' ? '全部題型' : type === 'vocab' ? '詞義' : type === 'sentence' ? '句式' : '拆句'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {displayWrongbook.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                當前沒有錯題，繼續練習可以自動收錄錯題。
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <span className="text-sm text-gray-500">已篩選 {displayWrongbook.length} 題</span>
                  <button onClick={clearWrongbook} className="text-xs px-3 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition">清空錯題集</button>
                </div>
                {displayWrongbook.map((item) => (
                  <div key={item.id} className="rounded-3xl border border-gray-100 p-5 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-3">
                      <div>
                        <div className="text-xs uppercase tracking-widest text-gray-400">{item.tag}</div>
                        <div className="mt-1 text-base font-semibold text-gray-900">
                          {item.type === 'vocab' ? (item as VocabQuestion).word : item.type === 'sentence' ? (item as SentenceQuestion).title : (item as ParseQuestion).title}
                        </div>
                      </div>
                      <button
                        onClick={() => setWrongbook(prev => prev.filter(q => q.id !== item.id))}
                        className="text-xs px-3 py-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition"
                      >
                        移出錯題
                      </button>
                    </div>
                    <div className="text-sm text-gray-700 mb-3">
                      {item.type === 'vocab' ? (
                        <p>「{(item as VocabQuestion).sentence}」</p>
                      ) : item.type === 'sentence' ? (
                        <p>「{(item as SentenceQuestion).originalSentence}」</p>
                      ) : (
                        <div className="flex flex-wrap gap-2">
                          {(item as ParseQuestion).parts.map((part, index) => (
                            <span key={index} className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-600">{part.text}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-gray-500">正確答案：{item.correctAnswer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==================== 時空對話框頁面 ====================
  if (page === 'dialogue') {


    // ---- 預設作者列表 ----
    const PRESET_AUTHORS_DATA = [
      {
        id: 'zhuge', name: '諸葛亮', emoji: '🪬', work: '《出師表》', dynasty: '三國·蜀漢',
        intro: '蜀漢丞相，忠義智慧的化身',
        greeting: '吾乃諸葛孔明。汝有何疑惑，盡可相問，吾必知無不言。',
        hints: ['你寫出師表時是什麼心情？', '「卑鄙」在古代是什麼意思？', '你最擔心後主劉禪什麼？'],
        systemPrompt: `你現在扮演三國時期蜀漢丞相諸葛亮（字孔明），正在與一位香港中學生進行跨時空對話。你是《出師表》的作者，深知劉備託孤之重，一心北伐、興復漢室。你博學多才，通曉天文地理、兵法謀略，為人忠誠謙遜。說話時偶爾引用文言文原句，但會主動用現代語言解釋。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文，語氣親切溫和。`,
      },
      {
        id: 'ouyang', name: '歐陽修', emoji: '🏮', work: '《醉翁亭記》', dynasty: '北宋',
        intro: '唐宋八大家之一，寄情山水',
        greeting: '吾乃歐陽永叔。滁州山水之樂，皆在吾文中矣。汝有何疑問？',
        hints: ['你寫醉翁亭記時的心情是什麼？', '「也」字在文中有什麼作用？', '你真的很喜歡喝酒嗎？'],
        systemPrompt: `你現在扮演北宋文學家歐陽修（字永叔，號醉翁），正在與一位香港中學生進行跨時空對話。你是《醉翁亭記》的作者，被貶滁州時寄情山水，以文抒懷。你是唐宋八大家之一，文章講究韻律與意境。語氣豁達開朗，雖遭貶謫但不失幽默。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文。`,
      },
      {
        id: 'sima', name: '司馬遷', emoji: '📜', work: '《廉頗藺相如列傳》', dynasty: '西漢',
        intro: '《史記》作者，忍辱負重完成千古巨著',
        greeting: '吾乃司馬子長。史家之事，在於秉筆直書。汝欲問何事？',
        hints: ['你寫史記時最難的是什麼？', '廉頗和藺相如誰更厲害？', '你受宮刑後是怎麼堅持下去的？'],
        systemPrompt: `你現在扮演西漢史學家司馬遷（字子長），正在與一位香港中學生進行跨時空對話。你是《史記》的作者，受宮刑後忍辱負重，完成史學巨著。你對廉頗、藺相如等歷史人物有深刻的理解和評價。語氣沉穩而堅毅，有歷史學家的客觀與深度。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文。`,
      },
      {
        id: 'han', name: '韓愈', emoji: '🖋️', work: '《師說》', dynasty: '唐朝',
        intro: '唐宋八大家之首，力倡古文運動',
        greeting: '吾乃韓退之。師者，所以傳道受業解惑也。汝有何惑，盡可相問。',
        hints: ['你寫師說是為了批評什麼？', '「師者」這句話是什麼意思？', '你覺得現代學生應該怎樣對待老師？'],
        systemPrompt: `你現在扮演唐代文學家韓愈（字退之），正在與一位香港中學生進行跨時空對話。你是《師說》的作者，力倡古文運動，反對士大夫恥於從師的風氣。你是唐宋八大家之首，文章氣勢磅礴，邏輯嚴密。語氣嚴正而有力，有強烈的社會責任感。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文。`,
      },
      {
        id: 'tao', name: '陶淵明', emoji: '🌾', work: '《桃花源記》', dynasty: '東晉',
        intro: '田園詩人，歸隱山林，嚮往世外桃源',
        greeting: '餘本布衣，不願為五鬥米折腰。桃花源之境，乃吾心中理想。汝欲問何事？',
        hints: ['桃花源真的存在嗎？', '你為什麼要辭官歸隱？', '「不為五鬥米折腰」是什麼意思？'],
        systemPrompt: `你現在扮演東晉田園詩人陶淵明（字元亮，號五柳先生），正在與一位香港中學生進行跨時空對話。你是《桃花源記》的作者，不願與世俗同流合汙，辭官歸隱，過著耕讀自足的生活。你嚮往自然、淡泊名利，語氣平和而灑脫，充滿對自由生活的熱愛。每次回答控制在100-200字以內，可以適當用第一人稱"餘"，但不要全篇文言文。`,
      },
      {
        id: 'fan', name: '範仲淹', emoji: '🌊', work: '《嶽陽樓記》', dynasty: '北宋',
        intro: '政治家、文學家，「先天下之憂而憂」',
        greeting: '餘登嶽陽樓，覽洞庭湖之大觀，感慨萬千。汝有何問，盡可道來。',
        hints: ['「先天下之憂而憂」是什麼意思？', '你寫嶽陽樓記時在想什麼？', '你覺得做官最重要的是什麼？'],
        systemPrompt: `你現在扮演北宋政治家、文學家範仲淹（字希文），正在與一位香港中學生進行跨時空對話。你是《嶽陽樓記》的作者，以"先天下之憂而憂，後天下之樂而樂"為人生信條。你一生憂國憂民，多次被貶仍堅守理想。語氣沉穩而充滿憂國情懷，有強烈的責任感和使命感。每次回答控制在100-200字以內，可以適當用第一人稱"餘"，但不要全篇文言文。`,
      },
      {
        id: 'su', name: '蘇軾', emoji: '🎋', work: '《赤壁賦》', dynasty: '北宋',
        intro: '豪放派詞人，曠達樂觀，才華橫溢',
        greeting: '吾乃蘇子瞻。赤壁之下，江山如畫，人生如夢。汝有何疑，盡可相問。',
        hints: ['你被貶黃州時是什麼心情？', '「人生如夢」你真的這樣想嗎？', '赤壁賦裡的「客」是真實存在的人嗎？'],
        systemPrompt: `你現在扮演北宋文學家蘇軾（字子瞻，號東坡居士），正在與一位香港中學生進行跨時空對話。你是《赤壁賦》的作者，多次被貶卻始終保持曠達樂觀的心態。你是豪放派詞人的代表，才華橫溢，通曉詩詞書畫。語氣豁達幽默，充滿哲理，善於從逆境中找到人生的意義。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文。`,
      },
      {
        id: 'liuzongyuan', name: '柳宗元', emoji: '🐟', work: '《捕蛇者說》', dynasty: '唐朝',
        intro: '唐宋八大家之一，以文揭露苛政之害',
        greeting: '吾乃柳子厚。苛政猛於虎，此言非虛。汝欲問何事？',
        hints: ['捕蛇者說想表達什麼？', '「苛政猛於虎」是什麼意思？', '你被貶永州時有什麼感受？'],
        systemPrompt: `你現在扮演唐代文學家柳宗元（字子厚），正在與一位香港中學生進行跨時空對話。你是《捕蛇者說》的作者，以此文深刻揭露了苛政對百姓的殘害。你是唐宋八大家之一，被貶永州十年，寄情山水，以文章抒發憂國憂民之情。語氣沉鬱而有力，充滿對民間疾苦的同情。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文。`,
      },
    ]

    // 合併預設 + 自定義作者
    const ALL_AUTHORS = [...PRESET_AUTHORS_DATA, ...customAuthors]
    const currentAuthorConfig = ALL_AUTHORS.find(a => a.id === selectedAuthor) || PRESET_AUTHORS_DATA[0]
    const STORAGE_KEY = `dialogue_messages_${selectedAuthor}`

    const loadMessages = (): DialogueMessage[] => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) return JSON.parse(saved)
      } catch {}
      // 用 currentAuthorConfig（已在本次渲染中正確解析）
      return [{
        id: 1, role: 'author' as const,
        content: currentAuthorConfig.greeting,
        author: currentAuthorConfig.name,
        timestamp: new Date().toISOString(),
      }]
    }

    const saveMessages = (msgs: DialogueMessage[]) => {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(msgs)) } catch {}
    }

    const handleSelectAuthor = (authorId: string) => {
      setSelectedAuthor(authorId)
      const authorConfig = ALL_AUTHORS.find(a => a.id === authorId) || PRESET_AUTHORS_DATA[0]
      const key = `dialogue_messages_${authorId}`
      // 設置初始快捷問題
      setDialogueHints(authorConfig.hints)
      try {
        const saved = localStorage.getItem(key)
        if (saved) {
          setDialogueMessages(JSON.parse(saved))
        } else {
          const initMsg: DialogueMessage[] = [{
            id: 1, role: 'author',
            content: authorConfig.greeting,
            author: authorConfig.name,
            timestamp: new Date().toISOString(),
          }]
          setDialogueMessages(initMsg)
          localStorage.setItem(key, JSON.stringify(initMsg))
        }
      } catch {
        setDialogueMessages([{
          id: 1, role: 'author',
          content: authorConfig.greeting,
          author: authorConfig.name,
          timestamp: new Date().toISOString(),
        }])
      }
      setDialogueShowSelector(false)
      setDialogueDeleteMode(false)
      setDialogueSelectedMsgs([])
    }

    // 清除全部記錄
    const handleClearAll = () => {
      const initMsg: DialogueMessage[] = [{
        id: 1, role: 'author',
        content: currentAuthorConfig.greeting,
        author: currentAuthorConfig.name,
        timestamp: new Date().toISOString(),
      }]
      setDialogueMessages(initMsg)
      localStorage.removeItem(STORAGE_KEY)
      setDialogueDeleteMode(false)
      setDialogueSelectedMsgs([])
    }

    // 刪除選中的消息
    const handleDeleteSelected = () => {
      if (dialogueSelectedMsgs.length === 0) return
      const remaining = dialogueMessages.filter(m => !dialogueSelectedMsgs.includes(m.id))
      setDialogueMessages(remaining)
      saveMessages(remaining)
      setDialogueSelectedMsgs([])
      setDialogueDeleteMode(false)
    }

    // 切換消息選中狀態
    const toggleMsgSelect = (id: number) => {
      setDialogueSelectedMsgs(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
    }

    // 保存自定義作者
    const handleSaveCustomAuthor = async () => {
      if (!customFormName.trim() || !customFormWork.trim()) return
      setCustomFormLoading(true)

      const name = customFormName.trim()
      const work = customFormWork.trim()
      const dynasty = customFormDynasty.trim() || '未知朝代'
      const intro = customFormIntro.trim() || `${work}的作者`
      const systemPrompt = `你現在扮演${dynasty}文人${name}，正在與一位香港中學生進行跨時空對話。你是${work}的作者。${customFormIntro.trim() ? customFormIntro.trim() + '。' : ''}請根據你的身份和作品，回答學生關於文言文學習和歷史背景的問題。每次回答控制在100-200字以內，可以適當用第一人稱"吾"、"餘"，但不要全篇文言文，語氣親切，像在與學生面對面交流。`

      // 默認值（AI 生成失敗時使用）
      let greeting = `吾乃${name}。汝有何疑惑，盡可相問。`
      let hints = [`你寫${work}時是什麼心情？`, `${work}最想表達什麼？`, '你最希望後人記住你什麼？']

      try {
        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${arkApiKey}`,
          },
          body: JSON.stringify({
            model: aiModel,
            messages: [
              {
                role: 'system',
                content: `你是一個文言文學習平臺的角色生成助手。根據用戶提供的古文作者信息，生成：
1. 一句符合該人物身份和性格的個性化開場白（20-40字，用第一人稱，可帶文言文風格，但要讓中學生看懂）
2. 三個適合學生向該作者提問的問題（每個不超過15字）

嚴格按以下格式輸出，不要其他內容：
開場白：[開場白內容]
問題1：[問題內容]
問題2：[問題內容]
問題3：[問題內容]`,
              },
              {
                role: 'user',
                content: `作者姓名：${name}
朝代：${dynasty}
代表作品：${work}
簡介：${intro}`,
              },
            ],
          }),
        })
        if (res.ok) {
          const data = await res.json()
          const text = data.choices?.[0]?.message?.content || ''
          const greetingMatch = text.match(/開場白：(.+)/)
          const q1 = text.match(/問題1：(.+)/)
          const q2 = text.match(/問題2：(.+)/)
          const q3 = text.match(/問題3：(.+)/)
          if (greetingMatch) greeting = greetingMatch[1].trim()
          const newHints = [q1, q2, q3].map(m => m?.[1]?.trim()).filter(Boolean) as string[]
          if (newHints.length === 3) hints = newHints
        }
      } catch {
        // AI 生成失敗，使用默認值
      }

      const newAuthor = {
        id: `custom_${Date.now()}`,
        name,
        emoji: '✍️',
        work,
        dynasty,
        intro,
        greeting,
        hints,
        systemPrompt,
      }
      const updated = [...customAuthors, newAuthor]
      setCustomAuthors(updated)
      try { localStorage.setItem('customAuthors', JSON.stringify(updated)) } catch {}
      setCustomFormName('')
      setCustomFormDynasty('')
      setCustomFormWork('')
      setCustomFormIntro('')
      setCustomFormLoading(false)
      setShowCustomForm(false)
      handleSelectAuthor(newAuthor.id)
    }

    // 刪除自定義作者
    const handleDeleteCustomAuthor = (authorId: string) => {
      const updated = customAuthors.filter(a => a.id !== authorId)
      setCustomAuthors(updated)
      try { localStorage.setItem('customAuthors', JSON.stringify(updated)) } catch {}
      try { localStorage.removeItem(`dialogue_messages_${authorId}`) } catch {}
    }

    const handleSendMessage = async () => {
      if (!dialogueInput.trim() || dialogueLoading) return

      const userMsg: DialogueMessage = {
        id: dialogueMessages.length + 1,
        role: 'user',
        content: dialogueInput,
        author: currentUser?.name || '你',
        timestamp: new Date().toISOString(),
      }

      const updatedWithUser = [...dialogueMessages, userMsg]
      setDialogueMessages(updatedWithUser)
      saveMessages(updatedWithUser)
      setDialogueInput('')
      setDialogueLoading(true)

      const historyForApi = dialogueMessages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content,
      }))

      try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${arkApiKey}`,
          },
          body: JSON.stringify({
            model: aiModel,
            messages: [
              { role: 'system', content: currentAuthorConfig.systemPrompt },
              ...historyForApi,
              { role: 'user', content: dialogueInput },
            ],
          }),
        })

        if (!response.ok) throw new Error(`API 請求失敗：${response.status}`)
        const data = await response.json()
        const aiReply = data.choices?.[0]?.message?.content || `${currentAuthorConfig.name}一時語塞，請再問一次。`

        const authorMsg: DialogueMessage = {
          id: updatedWithUser.length + 1,
          role: 'author',
          content: aiReply,
          author: currentAuthorConfig.name,
          timestamp: new Date().toISOString(),
        }
        const finalMessages = [...updatedWithUser, authorMsg]
        setDialogueMessages(finalMessages)
        saveMessages(finalMessages)

        // 根據 AI 回復動態生成新的快捷問題
        try {
          const hintRes = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${arkApiKey}`,
            },
            body: JSON.stringify({
              model: aiModel,
              messages: [
                {
                  role: 'system',
                  content: `你是一個學習助手，幫助學生深入理解文言文。根據以下對話內容，生成3個簡短的追問問題（每個不超過15字），幫助學生繼續深入探討。只輸出3個問題，每行一個，不要編號，不要其他內容。`,
                },
                {
                  role: 'user',
                  content: `作者：${currentAuthorConfig.name}
學生問：${dialogueInput}
作者答：${aiReply}

請生成3個追問問題：`,
                },
              ],
            }),
          })
          if (hintRes.ok) {
            const hintData = await hintRes.json()
            const hintText = hintData.choices?.[0]?.message?.content || ''
            const newHints = hintText.split('').map((h: string) => h.trim()).filter((h: string) => h.length > 0).slice(0, 3)
            if (newHints.length > 0) setDialogueHints(newHints)
          }
        } catch {
          // 生成快捷問題失敗不影響主流程
        }
      } catch {
        const errorMsg: DialogueMessage = {
          id: updatedWithUser.length + 1,
          role: 'author',
          content: '（時空信號不穩定，暫時無法回應，請稍後再試。）',
          author: currentAuthorConfig.name,
          timestamp: new Date().toISOString(),
        }
        const finalMessages = [...updatedWithUser, errorMsg]
        setDialogueMessages(finalMessages)
        saveMessages(finalMessages)
      } finally {
        setDialogueLoading(false)
      }
    }

    if (dialogueMessages.length === 0) {
      setDialogueMessages(loadMessages())
      if (dialogueHints.length === 0) {
        setDialogueHints(currentAuthorConfig.hints)
      }
    }

    // ---- 自定義作者表單 ----
    if (showCustomForm) {
      return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
          <div className="max-w-2xl w-full">
            <button onClick={() => setShowCustomForm(false)} className="mb-4 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回選擇</button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">✍️</div>
                <h2 className="text-xl font-bold text-gray-900">自定義對話作者</h2>
                <p className="text-sm text-gray-500 mt-1">填寫作者信息，AI 會自動扮演該角色與你對話</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">作者姓名 <span className="text-rose-400">*</span></label>
                  <input
                    value={customFormName}
                    onChange={e => setCustomFormName(e.target.value)}
                    placeholder="例如：李白、杜甫、王安石…"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">對應篇目 <span className="text-rose-400">*</span></label>
                  <input
                    value={customFormWork}
                    onChange={e => setCustomFormWork(e.target.value)}
                    placeholder="例如：《靜夜思》、《春望》…"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">朝代（選填）</label>
                  <input
                    value={customFormDynasty}
                    onChange={e => setCustomFormDynasty(e.target.value)}
                    placeholder="例如：唐朝、宋朝、明朝…"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">簡介（選填，幫助 AI 更好地扮演）</label>
                  <textarea
                    value={customFormIntro}
                    onChange={e => setCustomFormIntro(e.target.value)}
                    placeholder="例如：唐代浪漫主義詩人，號青蓮居士，一生遊歷四方，詩風豪放飄逸…"
                    rows={3}
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400 resize-none"
                  />
                </div>

                <button
                  onClick={handleSaveCustomAuthor}
                  disabled={!customFormName.trim() || !customFormWork.trim() || customFormLoading}
                  className="w-full py-3 bg-emerald-500 text-white rounded-2xl font-semibold hover:bg-emerald-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {customFormLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-1">正在生成個性籤名…</span>
                    </span>
                  ) : '開始對話 →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // ---- 作者選擇界面 ----
    if (dialogueShowSelector) {
      return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
          <div className="max-w-2xl w-full">
            <button onClick={goHome} className="mb-4 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主頁</button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4 text-center">
              <div className="text-4xl mb-2">🎭</div>
              <h2 className="text-2xl font-bold text-gray-900">時空對話框</h2>
              <p className="text-sm text-gray-500 mt-1">選擇一位古文作者，開始跨時空對話</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI 驅動 · 實時對話
              </div>
            </div>

            {/* 預設作者列表 */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">預設作者</p>
            <div className="grid grid-cols-1 gap-3 mb-4">
              {PRESET_AUTHORS_DATA.map((author) => {
                const hasHistory = (() => { try { return !!localStorage.getItem(`dialogue_messages_${author.id}`) } catch { return false } })()
                return (
                  <button
                    key={author.id}
                    onClick={() => handleSelectAuthor(author.id)}
                    className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 text-left hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 group"
                  >
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{author.emoji}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">{author.name}</span>
                          <span className="text-xs text-gray-400">{author.dynasty}</span>
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{author.work}</span>
                          {hasHistory && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">有記錄</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{author.intro}</p>
                      </div>
                      <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">→</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* 自定義作者列表 */}
            {customAuthors.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">我的自定義作者</p>
                <div className="grid grid-cols-1 gap-3 mb-4">
                  {customAuthors.map((author) => {
                    const hasHistory = (() => { try { return !!localStorage.getItem(`dialogue_messages_${author.id}`) } catch { return false } })()
                    return (
                      <div key={author.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
                        <button
                          onClick={() => handleSelectAuthor(author.id)}
                          className="flex-1 flex items-center gap-3 text-left group"
                        >
                          <div className="text-3xl">{author.emoji}</div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                              <span className="font-bold text-gray-900 text-sm">{author.name}</span>
                              <span className="text-xs text-gray-400">{author.dynasty}</span>
                              <span className="text-xs px-2 py-0.5 rounded-full bg-purple-50 text-purple-600 font-medium">{author.work}</span>
                              {hasHistory && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">有記錄</span>}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{author.intro}</p>
                          </div>
                          <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">→</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCustomAuthor(author.id)}
                          className="text-gray-300 hover:text-rose-400 transition-colors text-lg px-1"
                          title="刪除此作者"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* 添加自定義作者按鈕 */}
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600 transition-colors text-sm font-medium"
            >
              ＋ 自定義作者 / 添加其他篇目
            </button>
          </div>
        </div>
      )
    }

    // ---- 對話界面 ----
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-2xl w-full">
          {/* 頂部導航 */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { setDialogueShowSelector(true); setDialogueDeleteMode(false); setDialogueSelectedMsgs([]) }} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 換一位作者</button>
            <div className="flex items-center gap-2">
              {dialogueDeleteMode ? (
                <>
                  <span className="text-xs text-gray-400">已選 {dialogueSelectedMsgs.length} 條</span>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={dialogueSelectedMsgs.length === 0}
                    className="text-xs px-3 py-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-40"
                  >
                    刪除所選
                  </button>
                  <button
                    onClick={handleClearAll}
                    className="text-xs px-3 py-1.5 rounded-full border border-rose-200 text-rose-400 hover:bg-rose-50 transition-colors"
                  >
                    清空全部
                  </button>
                  <button
                    onClick={() => { setDialogueDeleteMode(false); setDialogueSelectedMsgs([]) }}
                    className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    取消
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setDialogueDeleteMode(true)}
                  className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:border-rose-200 hover:text-rose-400 transition-colors"
                >
                  🗑 管理記錄
                </button>
              )}
            </div>
          </div>

          {/* 標題卡片 */}
          <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 mb-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{currentAuthorConfig.emoji}</div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                  <h2 className="text-lg font-bold text-gray-900">{currentAuthorConfig.name}</h2>
                  <span className="text-xs text-gray-400">{currentAuthorConfig.dynasty}</span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium">{currentAuthorConfig.work}</span>
                </div>
                <p className="text-xs text-gray-500">{currentAuthorConfig.intro}</p>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI
              </div>
            </div>
          </div>

          {/* 對話區域 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4 max-h-[420px] overflow-y-auto">
            {dialogueDeleteMode && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium">
                點擊消息可選中，選中後點擊「刪除所選」即可刪除
              </div>
            )}
            <div className="space-y-4">
              {dialogueMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} ${dialogueDeleteMode ? 'cursor-pointer' : ''}`}
                  onClick={() => dialogueDeleteMode && toggleMsgSelect(msg.id)}
                >
                  <div className={`max-w-sm px-4 py-3 rounded-2xl transition-all ${
                    dialogueDeleteMode && dialogueSelectedMsgs.includes(msg.id)
                      ? 'ring-2 ring-rose-400 opacity-60'
                      : ''
                  } ${msg.role === 'user' ? 'bg-emerald-100 text-emerald-900' : 'bg-gray-100 text-gray-900'}`}>
                    {dialogueDeleteMode && (
                      <div className={`w-4 h-4 rounded-full border-2 mb-1 inline-flex items-center justify-center ${dialogueSelectedMsgs.includes(msg.id) ? 'bg-rose-400 border-rose-400' : 'border-gray-300'}`}>
                        {dialogueSelectedMsgs.includes(msg.id) && <span className="text-white text-xs">✓</span>}
                      </div>
                    )}
                    <p className="text-xs font-semibold mb-1 opacity-60">{msg.author}</p>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              ))}
              {dialogueLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 text-gray-900 px-4 py-3 rounded-2xl max-w-sm">
                    <p className="text-xs font-semibold mb-1 opacity-60">{currentAuthorConfig.name}</p>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* 輸入區域（刪除模式下隱藏） */}
          {!dialogueDeleteMode && (
            <>
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-2">
                <input
                  value={dialogueInput}
                  onChange={(e) => setDialogueInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={`問問${currentAuthorConfig.name}...`}
                  disabled={dialogueLoading}
                  className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-emerald-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={dialogueLoading || !dialogueInput.trim()}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dialogueLoading ? '...' : '發送'}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {(dialogueHints.length > 0 ? dialogueHints : currentAuthorConfig.hints).map((hint) => (
                  <button
                    key={hint}
                    onClick={() => setDialogueInput(hint)}
                    className="text-xs px-3 py-1.5 rounded-full bg-white border border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                  >
                    {hint}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  // ==================== 邏輯解謎器頁面 ====================
  if (page === 'puzzle') {
    const exampleSentence = '乃使蒙恬北築長城而守藩籬。'
    const sentenceParts: SentencePart[] = [
      { original: '乃', modern: '於是', type: 'modifier' },
      { original: '使', modern: '派遣', type: 'verb' },
      { original: '蒙恬', modern: '蒙恬（人名）', type: 'object' },
      { original: '北築長城而守藩籬', modern: '向北修築長城並守衛邊境', type: 'other' }
    ]

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-3xl w-full">
          <button onClick={goHome} className="mb-4 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主頁</button>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🧩</div>
              <h2 className="text-2xl font-bold text-gray-900">邏輯解謎器</h2>
              <p className="text-sm text-gray-500 mt-1">拆解長難句，理解語序變化，掌握語法規律</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">原句</p>
              <p className="text-lg leading-relaxed text-gray-900 font-serif mb-4">「{exampleSentence}」</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">語法拆解</p>
              <div className="space-y-2">
                {sentenceParts.map((part, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">{part.type === 'verb' ? '謂' : part.type === 'object' ? '賓' : part.type === 'subject' ? '主' : '其他'}</div>
                    <div className="flex-1">
                      <p className="font-serif text-lg text-gray-900">{part.original}</p>
                      <p className="text-sm text-gray-500">= {part.modern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">現代漢語</p>
              <p className="text-base leading-relaxed text-gray-800 bg-blue-50 p-4 rounded-xl border border-blue-100">於是派遣蒙恬向北修築長城並守衛邊疆。</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800"><span className="font-bold">💡 語法規律：</span>文言文中"使+賓語+謂語"構成使役句。賓語位置比現代漢語更靠前，這是倒裝的特點。</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">📚 常見語法現象</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: '使役句', example: '使+賓語+謂語' },
                { name: '被動句', example: '被/為+主語+動詞' },
                { name: '倒裝句', example: '賓語前置、定語後置' },
                { name: '省略句', example: '省略主語、賓語等' }
              ].map((item) => (
                <div key={item.name} className="p-3 rounded-xl bg-gray-50 border border-gray-100">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-xs text-gray-500">{item.example}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 古風朋友圈社區頁面 ====================
  if (page === 'ancient-circle') {


    // ---- 預設古人動態 ----
    const PRESET_POSTS = [
      {
        id: 1, author: '蘇軾', dynasty: '北宋', emoji: '🎋',
        content: '大江東去，浪淘盡，千古風流人物。',
        work: '《念奴嬌·赤壁懷古》',
        tags: ['#豁達', '#歷史', '#赤壁'],
        time: '元豐五年 · 中秋夜',
        aiPersona: '你是北宋文學家蘇軾，豁達樂觀，即使屢遭貶謫也保持曠達心態。用第一人稱回複評論，語氣溫和幽默，偶爾引用自己的詩詞，100字以內。',
        presetComments: [
          { author: '李白', text: '子瞻兄此詞氣勢磅礴，吾不及也！', emoji: '🍷' },
          { author: '歐陽修', text: '永叔讀此詞，亦感慨萬千。', emoji: '🏮' },
        ],
        likes: 142, bgColor: 'from-amber-50 to-orange-50', borderColor: 'border-amber-100', textColor: 'text-amber-900',
      },
      {
        id: 2, author: '李白', dynasty: '唐', emoji: '🍷',
        content: '舉頭望明月，低頭思故鄉。',
        work: '《靜夜思》',
        tags: ['#思鄉', '#月亮', '#夜晚'],
        time: '天寶元年 · 深秋',
        aiPersona: '你是唐代詩人李白，豪放不羈，愛酒愛月，自稱謫仙人。用第一人稱回複評論，語氣灑脫豪邁，偶爾提到月亮和美酒，100字以內。',
        presetComments: [
          { author: '杜甫', text: '太白兄，吾亦思念故土，讀此淚下。', emoji: '🌿' },
          { author: '王維', text: '簡潔而意境深遠，摩詰佩服。', emoji: '🏔️' },
        ],
        likes: 238, bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-100', textColor: 'text-blue-900',
      },
      {
        id: 3, author: '杜甫', dynasty: '唐', emoji: '🌿',
        content: '烽火連三月，家書抵萬金。',
        work: '《春望》',
        tags: ['#憂國', '#戰亂', '#思家'],
        time: '至德二年 · 春',
        aiPersona: '你是唐代詩人杜甫，憂國憂民，經歷安史之亂，深知百姓疾苦。用第一人稱回複評論，語氣沉鬱真誠，充滿對國家和人民的關懷，100字以內。',
        presetComments: [
          { author: '李白', text: '子美憂國之心，令吾汗顏。', emoji: '🍷' },
          { author: '白居易', text: '讀此詩，樂天亦感戰亂之苦。', emoji: '📖' },
        ],
        likes: 186, bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-100', textColor: 'text-green-900',
      },
      {
        id: 4, author: '陶淵明', dynasty: '東晉', emoji: '🌾',
        content: '採菊東籬下，悠然見南山。',
        work: '《飲酒·其五》',
        tags: ['#歸隱', '#田園', '#自由'],
        time: '義熙年間 · 秋日',
        aiPersona: '你是東晉田園詩人陶淵明，不為五鬥米折腰，歸隱田園，淡泊名利。用第一人稱回複評論，語氣平和灑脫，喜歡談論自然和自由，100字以內。',
        presetComments: [
          { author: '蘇軾', text: '靖節先生此境，子瞻嚮往已久！', emoji: '🎋' },
          { author: '王維', text: '摩詰亦愛此等閒適，深有同感。', emoji: '🏔️' },
        ],
        likes: 203, bgColor: 'from-yellow-50 to-lime-50', borderColor: 'border-yellow-100', textColor: 'text-yellow-900',
      },
      {
        id: 5, author: '王維', dynasty: '唐', emoji: '🏔️',
        content: '獨在異鄉為異客，每逢佳節倍思親。',
        work: '《九月九日憶山東兄弟》',
        tags: ['#思親', '#重陽', '#異鄉'],
        time: '開元年間 · 重陽節',
        aiPersona: '你是唐代詩人王維，精通詩畫音樂，晚年信佛，號摩詰居士。用第一人稱回複評論，語氣溫雅平靜，偶爾提到佛理和山水，100字以內。',
        presetComments: [
          { author: '李白', text: '摩詰此句，道盡天下遊子之心！', emoji: '🍷' },
          { author: '杜甫', text: '子美亦是異鄉客，讀此心有戚戚。', emoji: '🌿' },
        ],
        likes: 175, bgColor: 'from-purple-50 to-violet-50', borderColor: 'border-purple-100', textColor: 'text-purple-900',
      },
      {
        id: 6, author: '範仲淹', dynasty: '北宋', emoji: '🌊',
        content: '先天下之憂而憂，後天下之樂而樂。',
        work: '《嶽陽樓記》',
        tags: ['#憂國', '#責任', '#理想'],
        time: '慶曆六年 · 秋',
        aiPersona: '你是北宋政治家範仲淹，以天下為己任，多次被貶仍堅守理想。用第一人稱回複評論，語氣沉穩有力，充滿憂國情懷和責任感，100字以內。',
        presetComments: [
          { author: '歐陽修', text: '希文兄此志，令永叔敬佩不已！', emoji: '🏮' },
          { author: '蘇軾', text: '子瞻讀此，深感己之不足。', emoji: '🎋' },
        ],
        likes: 312, bgColor: 'from-cyan-50 to-teal-50', borderColor: 'border-cyan-100', textColor: 'text-cyan-900',
      },
      {
        id: 7, author: '諸葛亮', dynasty: '三國·蜀漢', emoji: '🪬',
        content: '鞠躬盡瘁，死而後已。',
        work: '《後出師表》',
        tags: ['#忠義', '#北伐', '#使命'],
        time: '建興六年 · 出徵前夕',
        aiPersona: '你是三國蜀漢丞相諸葛亮，忠義智慧，一心輔佐後主北伐中原。用第一人稱回複評論，語氣沉穩謙遜，充滿對蜀漢的忠誠，偶爾引用出師表原句，100字以內。',
        presetComments: [
          { author: '範仲淹', text: '孔明先生此志，千古楷模！', emoji: '🌊' },
          { author: '蘇軾', text: '讀孔明之文，子瞻肅然起敬。', emoji: '🎋' },
        ],
        likes: 289, bgColor: 'from-rose-50 to-pink-50', borderColor: 'border-rose-100', textColor: 'text-rose-900',
      },
      {
        id: 8, author: '歐陽修', dynasty: '北宋', emoji: '🏮',
        content: '醉翁之意不在酒，在乎山水之間也。',
        work: '《醉翁亭記》',
        tags: ['#山水', '#豁達', '#滁州'],
        time: '慶曆六年 · 滁州',
        aiPersona: '你是北宋文學家歐陽修，號醉翁，被貶滁州時寄情山水。用第一人稱回複評論，語氣豁達開朗，喜歡談論山水之樂，偶爾自嘲，100字以內。',
        presetComments: [
          { author: '蘇軾', text: '永叔此句，子瞻每讀必會心一笑！', emoji: '🎋' },
          { author: '範仲淹', text: '希文讀此，亦感滁州山水之美。', emoji: '🌊' },
        ],
        likes: 167, bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-100', textColor: 'text-orange-900',
      },
    ]

    // 合併預設帖子和用戶帖子，用戶帖子插入其中形成錯落感
    const allPosts = (() => {
      const result: any[] = []
      const userPostsCopy = [...userPosts]
      PRESET_POSTS.forEach((p, i) => {
        result.push({ ...p, isUserPost: false })
        if (i === 1 && userPostsCopy.length > 0) result.push(userPostsCopy.shift())
        if (i === 4 && userPostsCopy.length > 0) result.push(userPostsCopy.shift())
      })
      userPostsCopy.forEach(p => result.push(p))
      return result
    })()

    // 分成左右兩列（奇偶分配）
    const leftCol = allPosts.filter((_, i) => i % 2 === 0)
    const rightCol = allPosts.filter((_, i) => i % 2 === 1)

    const handleToggleLike = (postId: number) => {
      const updated = { ...communityLikes, [postId]: !communityLikes[postId] }
      setCommunityLikes(updated)
      try { localStorage.setItem('community_likes', JSON.stringify(updated)) } catch {}
    }

    const handleSendComment = async (post: any) => {
      const text = communityInput[post.id]?.trim()
      if (!text) return
      setCommunityLoading(prev => ({ ...prev, [post.id]: true }))
      setCommunityInput(prev => ({ ...prev, [post.id]: '' }))

      let aiReply = '（時空信號不穩定，稍後再試）'
      if (!post.isUserPost) {
        try {
          const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkApiKey}` },
            body: JSON.stringify({
              model: aiModel,
              messages: [
                { role: 'system', content: post.aiPersona },
                { role: 'user', content: `有學生評論了你的「${post.content}」，評論內容是：「${text}」，請用你的身份回復他。` },
              ],
            }),
          })
          if (res.ok) {
            const data = await res.json()
            aiReply = data.choices?.[0]?.message?.content || aiReply
          }
        } catch {}
      } else {
        aiReply = '（這是同學發的帖子，暫不支持 AI 回復）'
      }

      const newComment = { id: Date.now(), text, aiReply, timestamp: new Date().toISOString() }
      const updated = { ...communityComments, [post.id]: [...(communityComments[post.id] || []), newComment] }
      setCommunityComments(updated)
      try { localStorage.setItem('community_comments', JSON.stringify(updated)) } catch {}
      setCommunityLoading(prev => ({ ...prev, [post.id]: false }))
    }

    const handleConvertAndPost = async () => {
      if (!postFormContent.trim()) return
      setPostFormConverting(true)
      const authorName = postFormAuthor.trim() || '匿名同學'
      let ancientText = postFormContent.trim()

      try {
        const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkApiKey}` },
          body: JSON.stringify({
            model: aiModel,
            messages: [
              { role: 'system', content: '你是一個古文翻譯助手。將用戶輸入的現代漢語句子翻譯成簡潔優美的文言文，15-30字以內，不加任何解釋，只輸出文言文原文。' },
              { role: 'user', content: postFormContent.trim() },
            ],
          }),
        })
        if (res.ok) {
          const data = await res.json()
          ancientText = data.choices?.[0]?.message?.content?.trim() || ancientText
        }
      } catch {}

      const tagArr = postFormTags.trim()
        ? postFormTags.trim().split(/[,，\s]+/).filter(Boolean).map(t => t.startsWith('#') ? t : `#${t}`)
        : ['#同學分享']

      const newPost = {
        id: Date.now(),
        author: authorName,
        content: ancientText,
        tags: tagArr,
        time: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
        likes: 0,
        isUserPost: true as const,
        originalText: postFormContent.trim(),
        bgColor: 'from-slate-50 to-gray-50',
        borderColor: 'border-slate-100',
        textColor: 'text-slate-800',
        emoji: '✍️',
        dynasty: '現代',
      }

      const updatedPosts = [newPost, ...userPosts]
      setUserPosts(updatedPosts)
      try { localStorage.setItem('user_posts', JSON.stringify(updatedPosts)) } catch {}
      setPostFormContent('')
      setPostFormAuthor('')
      setPostFormTags('')
      setPostFormConverting(false)
      setShowPostForm(false)

      // 觸發古人延遲回復（發帖後 3-10 秒內陸續收到 2-3 位古人評論）
      const ANCIENT_COMMENTERS = [
        { name: '蘇軾', emoji: '🎋', persona: '你是北宋文學家蘇軾，豁達幽默，喜歡用詩詞表達感想。' },
        { name: '李白', emoji: '🍷', persona: '你是唐代詩人李白，豪放不羈，喜歡用浪漫的方式評論。' },
        { name: '杜甫', emoji: '🌿', persona: '你是唐代詩人杜甫，憂國憂民，評論充滿真情實感。' },
        { name: '陶淵明', emoji: '🌾', persona: '你是東晉詩人陶淵明，淡泊灑脫，喜歡從自然角度評論。' },
        { name: '王維', emoji: '🏔️', persona: '你是唐代詩人王維，溫雅平靜，評論充滿禪意。' },
        { name: '範仲淹', emoji: '🌊', persona: '你是北宋政治家範仲淹，以天下為己任，評論充滿責任感。' },
        { name: '歐陽修', emoji: '🏮', persona: '你是北宋文學家歐陽修，豁達開朗，評論風趣有文採。' },
        { name: '諸葛亮', emoji: '🪬', persona: '你是三國蜀漢丞相諸葛亮，智慧沉穩，評論充滿哲理。' },
      ]
      // 隨機選 2-3 位古人
      const shuffled = [...ANCIENT_COMMENTERS].sort(() => Math.random() - 0.5)
      const selectedCommenters = shuffled.slice(0, Math.random() > 0.5 ? 3 : 2)
      const postId = newPost.id
      const postContent = ancientText
      const postOriginal = postFormContent.trim()

      selectedCommenters.forEach((commenter, idx) => {
        const delay = 3000 + idx * (2000 + Math.random() * 2000)
        setTimeout(async () => {
          let replyText = `${commenter.name}路過，深有同感。`
          try {
            const res = await fetch('https://api.deepseek.com/v1/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkApiKey}` },
              body: JSON.stringify({
                model: aiModel,
                messages: [
                  { role: 'system', content: commenter.persona + ' 用第一人稱，以古文作者身份評論同學的朋友圈動態，語氣親切自然，20-40字以內，可帶一點文言文風格但要讓中學生看懂，不要加任何前綴說明。' },
                  { role: 'user', content: `一位同學發了一條朋友圈，原話是「${postOriginal}」，轉成古文是「${postContent}」，請你評論一下。` },
                ],
              }),
            })
            if (res.ok) {
              const data = await res.json()
              replyText = data.choices?.[0]?.message?.content?.trim() || replyText
            }
          } catch {}

          const newReply = { authorName: commenter.name, emoji: commenter.emoji, text: replyText, timestamp: new Date().toISOString() }
          setUserPosts(prev => {
            const updated = prev.map(p => {
              if (p.id !== postId) return p
              return { ...p, ancientReplies: [...(p.ancientReplies || []), newReply] }
            })
            try { localStorage.setItem('user_posts', JSON.stringify(updated)) } catch {}
            return updated
          })
        }, delay)
      })
    }

    const renderCard = (post: any) => {
      const isLiked = !!communityLikes[post.id]
      const likeCount = (post.likes || 0) + (isLiked ? 1 : 0)
      const comments = communityComments[post.id] || []
      const isExpanded = communityExpandedPost === post.id
      const isLoading = !!communityLoading[post.id]
      const bgColor = post.bgColor || 'from-amber-50 to-orange-50'
      const borderColor = post.borderColor || 'border-amber-100'
      const textColor = post.textColor || 'text-amber-900'

      return (
        <div key={post.id} className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden mb-4">
          <div className="px-4 pt-4 pb-3">
            {/* 作者信息 */}
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-xl shrink-0">
                {post.emoji || '✍️'}
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-bold text-gray-900 text-sm">{post.author}</span>
                  <span className="text-xs text-gray-400">{post.dynasty || '現代'}</span>
                  {post.isUserPost && <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">同學</span>}
                </div>
                <p className="text-xs text-gray-400">{post.time}</p>
              </div>
            </div>

            {/* 正文 */}
            <div className={`bg-gradient-to-br ${bgColor} rounded-2xl px-4 py-3 mb-2 border ${borderColor}`}>
              {post.isUserPost && post.originalText && (
                <p className="text-xs text-gray-400 mb-1.5 leading-relaxed">"{post.originalText}"</p>
              )}
              <p className={`font-bold ${textColor} leading-relaxed`} style={{ fontFamily: "'Noto Serif SC', serif", fontSize: '15px' }}>
                「{post.content}」
              </p>
            </div>

            {/* 標籤 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                ))}
              </div>
            )}

            {/* 預設古人評論（預設帖子） */}
            {!post.isUserPost && post.presetComments && (
              <div className="bg-gray-50 rounded-xl px-3 py-2 mb-2 space-y-1.5">
                {post.presetComments.map((c: any, i: number) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-sm shrink-0">{c.emoji}</span>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      <span className="font-semibold text-gray-800">{c.author}：</span>{c.text}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {/* 古人延遲回復（用戶帖子） */}
            {post.isUserPost && post.ancientReplies && post.ancientReplies.length > 0 && (
              <div className="bg-amber-50 rounded-xl px-3 py-2 mb-2 space-y-1.5 border border-amber-100">
                <p className="text-xs text-amber-500 font-medium mb-1">✨ 古人來評論了</p>
                {post.ancientReplies.map((r: any, i: number) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-sm shrink-0">{r.emoji}</span>
                    <p className="text-xs text-amber-900 leading-relaxed">
                      <span className="font-semibold">{r.authorName}：</span>{r.text}
                    </p>
                  </div>
                ))}
              </div>
            )}
            {post.isUserPost && (!post.ancientReplies || post.ancientReplies.length === 0) && (
              <div className="bg-gray-50 rounded-xl px-3 py-2 mb-2 border border-dashed border-gray-200">
                <p className="text-xs text-gray-400 text-center">⏳ 古人正在趕來評論…</p>
              </div>
            )}

            {/* 點讚 + 評論 */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleToggleLike(post.id)}
                className={`flex items-center gap-1 text-xs font-medium transition-all ${isLiked ? 'text-rose-500' : 'text-gray-400 hover:text-rose-400'}`}
              >
                <span>{isLiked ? '❤️' : '🤍'}</span>
                <span>{likeCount}</span>
              </button>
              <button
                onClick={() => setCommunityExpandedPost(isExpanded ? null : post.id)}
                className="flex items-center gap-1 text-xs text-gray-400 hover:text-emerald-500 transition-colors"
              >
                <span>💬</span>
                <span>{comments.length > 0 ? `${comments.length}` : '評論'}</span>
              </button>
            </div>
          </div>

          {/* 評論區 */}
          {isExpanded && (
            <div className="border-t border-gray-100 px-4 py-3 bg-gray-50">
              {comments.length > 0 && (
                <div className="space-y-2 mb-3">
                  {comments.map((c: any) => (
                    <div key={c.id} className="space-y-1.5">
                      <div className="flex items-start gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-xs font-bold text-emerald-600 shrink-0">我</div>
                        <div className="bg-white rounded-xl px-2.5 py-1.5 text-xs text-gray-700 flex-1 border border-gray-100">{c.text}</div>
                      </div>
                      <div className="flex items-start gap-1.5 pl-3">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-sm shrink-0">{post.emoji || '✍️'}</div>
                        <div className={`bg-gradient-to-br ${bgColor} rounded-xl px-2.5 py-1.5 flex-1 border ${borderColor}`}>
                          <p className="text-xs font-semibold text-gray-600 mb-0.5">{post.author}：</p>
                          <p className={`text-xs ${textColor} leading-relaxed`}>{c.aiReply}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-1.5">
                <input
                  value={communityInput[post.id] || ''}
                  onChange={e => setCommunityInput(prev => ({ ...prev, [post.id]: e.target.value }))}
                  onKeyDown={e => e.key === 'Enter' && !isLoading && handleSendComment(post)}
                  placeholder={`和${post.author}說點什麼…`}
                  disabled={isLoading}
                  className="flex-1 rounded-xl border border-gray-200 bg-white px-2.5 py-1.5 text-xs outline-none focus:border-emerald-400 disabled:opacity-50"
                />
                <button
                  onClick={() => handleSendComment(post)}
                  disabled={isLoading || !communityInput[post.id]?.trim()}
                  className="px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-xs font-medium hover:bg-emerald-600 transition-colors disabled:opacity-40 shrink-0"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-1 h-1 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                    </span>
                  ) : '發'}
                </button>
              </div>
            </div>
          )}
        </div>
      )
    }

    return (
      <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-3xl mx-auto px-4 py-6">
          {/* 頂部導航 */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主頁</button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">古風朋友圈</h1>
              <p className="text-xs text-gray-400">古人也發朋友圈</p>
            </div>
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <span>✏️</span>
              <span>發帖</span>
            </button>
          </div>

          {/* 發帖彈窗 */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">✏️ 發一條古風動態</h2>
                  <button onClick={() => setShowPostForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">你想說什麼？（現代話也行，AI 幫你轉古文）</label>
                    <textarea
                      value={postFormContent}
                      onChange={e => setPostFormContent(e.target.value)}
                      placeholder="例如：今天考試考砸了，心情很鬱悶…"
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">你的名字（選填）</label>
                    <input
                      value={postFormAuthor}
                      onChange={e => setPostFormAuthor(e.target.value)}
                      placeholder="匿名同學"
                      className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">標籤（選填，用逗號分隔）</label>
                    <input
                      value={postFormTags}
                      onChange={e => setPostFormTags(e.target.value)}
                      placeholder="例如：思鄉, 考試, 努力"
                      className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                </div>

                <button
                  onClick={handleConvertAndPost}
                  disabled={!postFormContent.trim() || postFormConverting}
                  className="mt-4 w-full py-3 bg-emerald-500 text-white rounded-2xl font-semibold hover:bg-emerald-600 transition-colors text-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {postFormConverting ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: '300ms' }} />
                      <span className="ml-1">AI 正在轉換古文…</span>
                    </span>
                  ) : '✨ 轉成古文並發布'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">AI 會將你的話轉成文言文風格後發布</p>
              </div>
            </div>
          )}

          {/* 雙列瀑布流 */}
          <div className="flex gap-3 items-start">
            {/* 左列 */}
            <div className="flex-1 min-w-0">
              {leftCol.map(post => renderCard(post))}
            </div>
            {/* 右列 */}
            <div className="flex-1 min-w-0 mt-6">
              {rightCol.map(post => renderCard(post))}
            </div>
          </div>

          <div className="mt-4 text-center text-xs text-gray-400 pb-4">
            以上古人內容由 AI 扮演生成，僅供學習參考
          </div>
        </div>
      </div>
    )
  }

  // ==================== 成績單 ====================
  if (page === 'result') {
    const total = filteredQuestions.length
    const pct = Math.round((score / total) * 100)
    const tabLabel = quizMode === 'grammar' ? '句式結構專練' : activeTab === 'all' ? '全部題型' : activeTab === 'vocab' ? '詞義辨析' : activeTab === 'sentence' ? '特殊句式' : '拆句理解'
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="bg-white rounded-3xl p-10 shadow-sm max-w-md w-full border border-gray-100 text-center">
          <div className="text-6xl mb-6">{pct === 100 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h2
            className="text-3xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {pct === 100 ? '完美！' : pct >= 60 ? '不錯！' : '繼續加油！'}
          </h2>
          <p className="text-gray-400 text-sm mb-6">{tabLabel}</p>
          <div className="text-5xl font-bold text-emerald-500 mb-2">
            {score} <span className="text-2xl text-gray-300">/ {total}</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-8 mt-4">
            <div className="bg-emerald-400 h-2.5 rounded-full transition-all" style={{ width: `${pct}%` }} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={goHome}
              className="py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-semibold text-gray-700"
            >
              返回主頁
            </button>
            <button
              onClick={() => { setCurrentIndex(0); setScore(0); setPage('quiz'); setSelectedOption(null); setHasAnswered(false) }}
              className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors font-bold text-white"
            >
              再來一次
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 答題界面 ====================

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
      {/* 頂部進度條 */}
      <div className="w-full max-w-lg mb-5">
        <div className="flex justify-between items-center mb-2 px-1">
          <div className="flex items-center gap-2">
            <button
              onClick={() => quizMode === 'grammar' ? goHome() : setPage('classic')}
              className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium"
            >
              ← 返回
            </button>
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-500 font-medium">{currentQuestion.tag}</span>
            <span className="text-gray-400 text-xs">{currentIndex + 1} / {filteredQuestions.length}</span>
          </div>
          <span className="text-emerald-600 font-bold text-sm">得分 {score}</span>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-1.5">
          <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* 詞義題 */}
      {currentQuestion.type === 'vocab' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-lg w-full border border-gray-100">
          <div className="aspect-square bg-gray-50 rounded-2xl mb-6 overflow-hidden border border-gray-100">
            <img src={currentQuestion.image} alt={currentQuestion.word} className="w-full h-full object-cover" />
          </div>
          <div className="text-center mb-6">
            <h2
              className="text-5xl font-black text-gray-900 mb-3"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              {currentQuestion.word}
            </h2>
            <p className="text-gray-400 italic text-sm">「{currentQuestion.sentence}」</p>
          </div>
          <div className="grid gap-3 mb-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`py-4 px-5 rounded-xl border transition-all text-sm font-medium text-left flex justify-between items-center ${getButtonStyle(option)}`}
                onClick={() => handleAnswer(option)}
              >
                <span>{option}</span>
                {hasAnswered && option === currentQuestion.correctAnswer && <span className="text-emerald-500">✓</span>}
                {hasAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <span className="text-rose-400">✗</span>}
              </button>
            ))}
          </div>
          {hasAnswered && (
            <div className="mt-2">
              <div className={`text-center mb-2 text-base font-bold ${selectedOption === currentQuestion.correctAnswer ? 'text-emerald-600' : 'text-rose-500'}`}>
                {selectedOption === currentQuestion.correctAnswer ? '答對了！' : `正確答案：${currentQuestion.correctAnswer}`}
              </div>
              <p className="text-gray-500 text-xs text-center mb-4 px-2 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-base font-bold text-white"
              >
                {currentIndex + 1 < filteredQuestions.length ? '下一題 →' : '查看成績'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 句式題 */}
      {currentQuestion.type === 'sentence' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-lg w-full border border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <p className="text-gray-400 text-xs mb-2 uppercase tracking-wider font-medium">原文</p>
            <p
              className="text-xl leading-relaxed text-gray-900"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              「{currentQuestion.originalSentence}」
            </p>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-base font-bold text-gray-800">{currentQuestion.question}</h2>
          </div>
          <div className="grid gap-3 mb-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`py-4 px-5 rounded-xl border transition-all text-sm font-medium text-left flex justify-between items-center ${getButtonStyle(option)}`}
                onClick={() => handleAnswer(option)}
              >
                <span>{option}</span>
                {hasAnswered && option === currentQuestion.correctAnswer && <span className="text-emerald-500">✓</span>}
                {hasAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <span className="text-rose-400">✗</span>}
              </button>
            ))}
          </div>
          {hasAnswered && (
            <div className="mt-2">
              <div className={`text-center mb-2 text-base font-bold ${selectedOption === currentQuestion.correctAnswer ? 'text-emerald-600' : 'text-rose-500'}`}>
                {selectedOption === currentQuestion.correctAnswer ? '答對了！' : `正確答案：${currentQuestion.correctAnswer}`}
              </div>
              <p className="text-gray-500 text-xs text-center mb-4 px-2 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-base font-bold text-white"
              >
                {currentIndex + 1 < filteredQuestions.length ? '下一題 →' : '查看成績'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 拆句題 */}
      {currentQuestion.type === 'parse' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-lg w-full border border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider font-medium">句子結構拆解</p>
            <div className="flex flex-wrap gap-3 mb-2">
              {currentQuestion.parts.map((part, i) => (
                part.text === '，' ? (
                  <span key={i} className="text-gray-400 text-xl self-end pb-1">，</span>
                ) : (
                  <div key={i} className="flex flex-col items-center gap-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full text-white font-medium ${part.color}`}>{part.label}</span>
                    <span
                      className="text-xl text-gray-900"
                      style={{ fontFamily: "'Noto Serif SC', serif" }}
                    >
                      {part.text}
                    </span>
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="text-center mb-6">
            <h2 className="text-base font-bold text-gray-800">{currentQuestion.question}</h2>
          </div>
          <div className="grid gap-3 mb-4">
            {currentQuestion.options.map((option) => (
              <button
                key={option}
                className={`py-4 px-5 rounded-xl border transition-all text-sm font-medium text-left flex justify-between items-center ${getButtonStyle(option)}`}
                onClick={() => handleAnswer(option)}
              >
                <span>{option}</span>
                {hasAnswered && option === currentQuestion.correctAnswer && <span className="text-emerald-500">✓</span>}
                {hasAnswered && option === selectedOption && option !== currentQuestion.correctAnswer && <span className="text-rose-400">✗</span>}
              </button>
            ))}
          </div>
          {hasAnswered && (
            <div className="mt-2">
              <div className={`text-center mb-2 text-base font-bold ${selectedOption === currentQuestion.correctAnswer ? 'text-emerald-600' : 'text-rose-500'}`}>
                {selectedOption === currentQuestion.correctAnswer ? '答對了！' : `正確答案：${currentQuestion.correctAnswer}`}
              </div>
              <p className="text-gray-500 text-xs text-center mb-4 px-2 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-base font-bold text-white"
              >
                {currentIndex + 1 < filteredQuestions.length ? '下一題 →' : '查看成績'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 模型設置懸浮按鈕與面板 */}
      <div className="fixed top-4 left-4 z-[9999] flex flex-col items-start">
        {showModelSettings && (
          <div className="mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 p-5 w-80">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-800 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                API 模型設置
              </h3>
              <button onClick={() => setShowModelSettings(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">模型名稱 (Model)</label>
                <input
                  type="text"
                  value={modelInput}
                  onChange={e => setModelInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="如: deepseek-v4-flash"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">API Key</label>
                <input
                  type="password"
                  value={keyInput}
                  onChange={e => setKeyInput(e.target.value)}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  placeholder="ark-..."
                />
              </div>
              <div className="text-xs text-gray-400 bg-gray-50 rounded-lg p-2">
                當前模型：<span className="text-emerald-600 font-medium">{aiModel}</span>
              </div>
              <button
                onClick={handleSaveSettings}
                className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                保存設置
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setShowModelSettings(!showModelSettings)}
          className="flex items-center gap-2 px-4 py-2.5 bg-white text-gray-600 rounded-full shadow-lg border border-gray-200 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-400 transition-all text-sm font-medium"
          title="模型設置"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
          <span>API 設置</span>
        </button>
      </div>
    </div>
  )
}

export default App