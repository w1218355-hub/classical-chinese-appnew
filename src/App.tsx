import { useEffect, useState } from 'react'

// ===== 题目类型定义 =====
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

type Page = 'home' | 'classic' | 'quiz' | 'result' | 'words' | 'words-learn' | 'words-fill' | 'words-quiz' | 'words-result' | 'grammar' | 'pastpaper' | 'wrongbook' | 'stats' | 'dialogue' | 'puzzle' | 'ancient-circle' | 'knowledge' | 'rhetoric' | 'structure'

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

// ===== 题库 =====
const questions: Question[] = [
  {
    id: 1, type: 'vocab', tag: '词义辨析',
    word: '崩殂', sentence: '先帝创业未半而中道崩殂',
    image: '/death.png',
    options: ['突然生病', '死亡（指皇帝）', '事业失败', '离开家乡'],
    correctAnswer: '死亡（指皇帝）',
    explanation: '「崩」指山倒塌，古代专指天子驾崩；「殂」指死亡。合称为帝王之死。'
  },
  {
    id: 2, type: 'vocab', tag: '词义辨析',
    word: '开张', sentence: '诚宜开张圣听',
    image: '/kaizhang.png',
    options: ['店铺营业', '扩大（圣听）', '开始做事', '张开嘴巴'],
    correctAnswer: '扩大（圣听）',
    explanation: '「开张」在此为古今异义词，古义为「扩大、广开」，今义为「商店开业」。'
  },
  {
    id: 3, type: 'vocab', tag: '词义辨析',
    word: '卑鄙', sentence: '先帝不以臣卑鄙',
    image: '/beibi.png',
    options: ['品德恶劣', '语言粗俗', '身份低微、见识短浅', '胆小怕事'],
    correctAnswer: '身份低微、见识短浅',
    explanation: '「卑鄙」为古今异义词，古义指「出身低微、见识浅陋」，今义指「品行恶劣」。'
  },
  {
    id: 4, type: 'vocab', tag: '词义辨析',
    word: '斟酌', sentence: '陛下亦宜自谋，以咨诹善道，察纳雅言',
    image: '/zhenzhuo.png',
    options: ['倒酒喝酒', '仔细考虑、权衡', '询问他人', '随意决定'],
    correctAnswer: '仔细考虑、权衡',
    explanation: '「斟酌」本义为倒酒，引申为「仔细考虑、权衡利弊」，此处指诸葛亮请后主慎重处理政务。'
  },
  {
    id: 5, type: 'vocab', tag: '词义辨析',
    word: '驽钝', sentence: '臣虽驽钝，猥自枉屈',
    image: '/nudum.png',
    options: ['马跑得快', '才能低下、愚笨', '性格固执', '身体虚弱'],
    correctAnswer: '才能低下、愚笨',
    explanation: '「驽」指劣马，「钝」指不锋利。诸葛亮以「驽钝」自谦，表示自己才能平庸。'
  },
  {
    id: 6, type: 'vocab', tag: '词义辨析',
    word: '托付', sentence: '受任于败军之际，奉命于危难之间',
    image: '/tuofu.png',
    options: ['随便交代', '郑重委托重任', '借钱给人', '写信联络'],
    correctAnswer: '郑重委托重任',
    explanation: '先帝白帝城托孤，将蜀汉大业郑重委托给诸葛亮，体现了君臣之间深厚的信任。'
  },
  {
    id: 7, type: 'sentence', tag: '特殊句式',
    title: '判断句式类型',
    originalSentence: '此诚危急存亡之秋也',
    question: '「此诚危急存亡之秋也」属于哪种特殊句式？',
    options: ['倒装句（宾语前置）', '判断句（……也）', '被动句（见……于）', '省略句'],
    correctAnswer: '判断句（……也）',
    explanation: '句末用「也」字作判断标志，构成「……也」式判断句。意为「这确实是危急存亡的关键时刻」。'
  },
  {
    id: 8, type: 'sentence', tag: '特殊句式',
    title: '判断句式类型',
    originalSentence: '受任于败军之际，奉命于危难之间',
    question: '「受任于败军之际」中，「于」字引出的成分属于什么结构？',
    options: ['主谓结构', '状语后置（介词结构后置）', '宾语前置', '定语后置'],
    correctAnswer: '状语后置（介词结构后置）',
    explanation: '「于败军之际」是介词结构，作状语后置。正常语序应为「于败军之际受任」。'
  },
  {
    id: 9, type: 'sentence', tag: '特殊句式',
    title: '判断句式类型',
    originalSentence: '先帝不以臣卑鄙，猥自枉屈，三顾臣于草庐之中',
    question: '「三顾臣于草庐之中」中，「于草庐之中」属于哪种句式？',
    options: ['被动句', '判断句', '状语后置句', '宾语前置句'],
    correctAnswer: '状语后置句',
    explanation: '「于草庐之中」是介词结构后置，作「顾」的状语。即「在草庐之中三次拜访我」。'
  },
  {
    id: 10, type: 'parse', tag: '拆句理解',
    title: '句子成分分析',
    sentence: '先帝创业未半而中道崩殂',
    parts: [
      { text: '先帝', label: '主语', color: 'bg-blue-500' },
      { text: '创业未半', label: '状语（时间）', color: 'bg-violet-500' },
      { text: '而', label: '连词（转折）', color: 'bg-amber-500' },
      { text: '中道', label: '状语（情况）', color: 'bg-orange-500' },
      { text: '崩殂', label: '谓语', color: 'bg-rose-500' },
    ],
    question: '「先帝创业未半而中道崩殂」中，「而」字的作用是？',
    options: ['表示顺承，意为「然后」', '表示转折，意为「却、但是」', '表示并列，意为「和」', '表示因果，意为「因此」'],
    correctAnswer: '表示转折，意为「却、但是」',
    explanation: '「而」在此表转折关系，强调先帝创业尚未完成，却不幸中途去世，表达了遗憾与悲痛之情。'
  },
  {
    id: 11, type: 'parse', tag: '拆句理解',
    title: '句子成分分析',
    sentence: '苟全性命于乱世，不求闻达于诸侯',
    parts: [
      { text: '苟全性命', label: '谓语+宾语', color: 'bg-emerald-500' },
      { text: '于乱世', label: '状语后置', color: 'bg-blue-500' },
      { text: '，', label: '', color: 'bg-transparent' },
      { text: '不求闻达', label: '谓语+宾语', color: 'bg-violet-500' },
      { text: '于诸侯', label: '状语后置', color: 'bg-orange-500' },
    ],
    question: '「苟全性命于乱世」的正确现代语序是？',
    options: ['在乱世中苟且保全性命', '苟且保全性命，在乱世之中', '乱世中的性命苟且保全', '保全性命，苟且在乱世'],
    correctAnswer: '在乱世中苟且保全性命',
    explanation: '「于乱世」是状语后置，还原正常语序为「于乱世苟全性命」，即「在乱世中苟且保全性命」。'
  },
]

const grammarQuestions: SentenceQuestion[] = [
  {
    id: 201,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '此诚危急存亡之秋也',
    question: '下列句子属于哪种句式？',
    options: ['判断句', '倒装句', '被动句', '省略句'],
    correctAnswer: '判断句',
    explanation: '句末“也”表判断，构成判断句。'
  },
  {
    id: 202,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '受任于败军之际，奉命于危难之间',
    question: '该句最接近下列哪种句式？',
    options: ['判断句', '倒装句', '被动句', '省略句'],
    correctAnswer: '倒装句',
    explanation: '“受任于败军之际”是状语后置，整体句式呈倒装结构。'
  },
  {
    id: 203,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '被时人所弃，然心不改。',
    question: '下列句子属于哪种句式？',
    options: ['判断句', '倒装句', '被动句', '省略句'],
    correctAnswer: '被动句',
    explanation: '“被时人所弃”使用被动标志“被”，属于被动句。'
  },
  {
    id: 204,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '臣虽驽钝，猥自枉屈。',
    question: '下列句子属于哪种句式？',
    options: ['判断句', '倒装句', '被动句', '省略句'],
    correctAnswer: '省略句',
    explanation: '“猥自枉屈”省略了“以”为宾语，属于省略句。'
  },
  {
    id: 205,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '先帝不以臣卑鄙',
    question: '「先帝不以臣卑鄙」中的「以」字在句子中的作用是什么？',
    options: ['引出被动对象', '引出凭借对象', '引出原因', '引出方式'],
    correctAnswer: '引出凭借对象',
    explanation: '「以」字是介词，引出「臣卑鄙」作为凭借对象。'
  },
  {
    id: 206,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '将数百之众，转而攻秦',
    question: '该句最接近下列哪种句式？',
    options: ['主谓倒装', '宾语前置', '状语后置', '定语后置'],
    correctAnswer: '宾语前置',
    explanation: '「將數百之眾」中，宾语「眾」前置到了动词「將」前面。'
  },
  {
    id: 207,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '故不错意也',
    question: '这个句子中「也」字的作用是什么？',
    options: ['表感叹', '表疑问', '表判断', '表肯定'],
    correctAnswer: '表判断',
    explanation: '句末的「也」是判断标志，表示对事物的判断。'
  },
  {
    id: 208,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '与其杀是僮，孰若卖之',
    question: '「與其…孰若…」这个结构表示什么意思？',
    options: ['疑问', '反问', '比较选择', '条件'],
    correctAnswer: '比较选择',
    explanation: '「與其…孰若…」表示「与其…不如…」，用来比较两种做法的优劣。'
  },
  {
    id: 209,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '何以自托于赵',
    question: '「何以…」这个疑问句式表示什么？',
    options: ['什么时间', '用什么工具', '怎样、如何', '为什么'],
    correctAnswer: '怎样、如何',
    explanation: '「何以」相当于「如何」「怎样」，这是古文疑问句的重要类型。'
  },
  {
    id: 210,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '豈非人事哉',
    question: '「豈…哉」这个句式的真实意思是什么？',
    options: ['真的吗？', '难道不是…吗？（反问）', '为什么…？', '怎样…？'],
    correctAnswer: '难道不是…吗？（反问）',
    explanation: '「豈…哉」是反问句式，表达强烈肯定。'
  },
  {
    id: 211,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '棄人用犬，雖猛何為',
    question: '「雖…何…」这个句式表示什么意思？',
    options: ['虽然…但是…', '即使…又怎样', '虽然…也…', '既然…就…'],
    correctAnswer: '即使…又怎样',
    explanation: '「雖…何…」是古文中表示让步转折的句式。'
  },
  {
    id: 212,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '竊人之財，猶謂之盜，況貪天之功，以為己力乎',
    question: '「況…乎」这个句式表示什么文法关系？',
    options: ['因果关系', '递进关系（更何况）', '转折关系', '选择关系'],
    correctAnswer: '递进关系（更何况）',
    explanation: '「況…乎」是文言中表递进的句式，意为「更何况、何况」。'
  },
  {
    id: 213,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '入则無法家拂士，出则無敵國外患者，國恆亡',
    question: '这个句子使用了什么句式特点来增强表达效果？',
    options: ['排比', '对偶', '反复', '对比'],
    correctAnswer: '对比',
    explanation: '「入…出…」构成对比，内部矛盾和外部威胁形成对照。'
  },
  {
    id: 214,
    type: 'sentence',
    tag: '句式专练',
    title: '判断句式类型',
    originalSentence: '我孰與城北徐公美',
    question: '「孰與…」这个句式表示什么疑问类型？',
    options: ['是否疑问', '比较疑问', '方式疑问', '原因疑问'],
    correctAnswer: '比较疑问',
    explanation: '「孰與」意为「与…相比，哪个…」，用来提出比较性的疑问。'
  },
]

const pastpaperQuestions: PastPaperQuestion[] = [
  {
    id: 301,
    type: 'vocab',
    tag: '历年真题',
    year: 2022,
    source: 'DSE 2022',
    word: '开张',
    sentence: '诚宜开张圣听',
    image: '/kaizhang.png',
    options: ['店铺营业', '扩大（圣听）', '开始做事', '张开嘴巴'],
    correctAnswer: '扩大（圣听）',
    explanation: '该题考古今异义，“开张”在这里为“扩大、广开”。'
  },
  {
    id: 302,
    type: 'sentence',
    tag: '历年真题',
    year: 2021,
    source: 'DSE 2021',
    title: '判断句式类型',
    originalSentence: '此诚危急存亡之秋也',
    question: '该句属于哪种句式？',
    options: ['判断句', '倒装句', '被动句', '省略句'],
    correctAnswer: '判断句',
    explanation: '句末“也”表判断。'
  },
  {
    id: 303,
    type: 'parse',
    tag: '历年真题',
    year: 2020,
    source: 'DSE 2020',
    title: '句子成分分析',
    sentence: '先帝创业未半而中道崩殂',
    parts: [
      { text: '先帝', label: '主语', color: 'bg-blue-500' },
      { text: '创业未半', label: '状语（时间）', color: 'bg-violet-500' },
      { text: '，', label: '', color: 'bg-transparent' },
      { text: '中道', label: '状语（情况）', color: 'bg-orange-500' },
      { text: '崩殂', label: '谓语', color: 'bg-rose-500' },
    ],
    question: '“而”字在句中起什么作用？',
    options: ['表示顺承', '表示转折', '表示并列', '表示因果'],
    correctAnswer: '表示转折',
    explanation: '“而”在此表转折，意为“却、但是”。'
  },
  {
    id: 304,
    type: 'sentence',
    tag: '历年真题',
    year: 2023,
    source: 'DSE 2023',
    title: '判断句式类型',
    originalSentence: '三顾臣于草庐之中',
    question: '该结构最接近哪种句式？',
    options: ['被动句', '状语后置', '判断句', '宾语前置'],
    correctAnswer: '状语后置',
    explanation: '“于草庐之中”是状语后置，作“顾”的状语。'
  },
]

const wordCards: WordCardQuestion[] = [
  {
    id: 1,
    category: '一词多义 · 使',
    word: '使',
    sentence: '乃使蒙恬北筑长城而守藩篱。',
    image: '/shi_1.png',
    options: ['派遣、命令', '役使、役用', '假使、如果', '出使 foreign mission'],
    correctAnswer: ['派遣、命令', '派遣', '命令', '派', '差遣'],
    explanation:
      '这里的「使」是动词，意思是「派遣、命令」。从句子结构看，「乃使蒙恬……」就是「于是派蒙恬去……」。如果解释成「假使」或「役使」，语意都不通。例句中的重点是：秦始皇命蒙恬北筑长城并守卫边防。',
    memoryTip:
      '看到「使 + 人名 + 做某事」时，往往优先判断为「派遣、命令」。',
  },
  {
    id: 2,
    category: '一词多义 · 使',
    word: '使',
    sentence: '使六國各愛其人，則足以拒秦。',
    image: '/shi_2.png',
    options: ['派遣、命令', '役使、役用', '假使、如果', '让……去做'],
    correctAnswer: ['假使、如果', '假使', '如果', '假设', '倘若', '假如'],
    explanation:
      '这一句里的「使」不是动词「派遣」，而是连词，表示假设，相当于「假使、如果」。整句可译作：「如果六国都爱护自己的百姓，就完全有力量抗拒秦国。」同一个字放在不同语境里，词性和意思都会变。',
    memoryTip:
      '句首的「使」后面如果接完整分句，常常不是动作，而是「假使、如果」。',
  },
  {
    id: 3,
    category: '一词多义 · 卒',
    word: '卒',
    sentence: '語卒而單于大怒。',
    image: '/zu.png',
    options: ['士兵', '仓猝、突然', '終於、最終', '結束、完畢'],
    correctAnswer: ['結束、完畢', '结束', '完毕', '完', '说完', '终止'],
    explanation:
      '这句里的「卒」表示「结束、完毕」。「語卒」就是「话说完了」。如果解释成「终于」或「仓猝」，都和前面的「語」搭配不起来。判断这类词时，要特别看它和前后词的固定搭配关系。',
    memoryTip:
      '像「語卒」「曲卒」这类格式里，「卒」常表示事情结束。',
  },
  {
    id: 4,
    category: '一词多义 · 固',
    word: '固',
    sentence: '臣固知王之不忍也。',
    image: '/gu.png',
    options: ['安守、堅守', '原來、一向、本來', '頑固、固執', '牢固、堅固'],
    correctAnswer: ['原來、一向、本來', '原来', '一向', '本来', '向来', '原本'],
    explanation:
      '这里的「固」不是「坚固」，也不是「固执」，而是副词，表示「本来、原来、一向」。全句可理解为：「我本来就知道大王是不忍心这样做的。」文言文中的「固」很常见，既可作形容词，也可作副词，必须回到句中判断。',
    memoryTip:
      '当「固」放在动词前面修饰判断、认知时，常常是副词义：本来、原来。',
  },
  {
    id: 5,
    category: '一词多义 · 委',
    word: '委',
    sentence: '與人期行，相委而去。',
    image: '/wei.png',
    options: ['委任、交付', '推卸、推诿', '抛棄、舍棄', '委曲、曲折'],
    correctAnswer: ['抛棄、舍棄', '抛弃', '舍弃', '丢弃', '放弃', '丢下', '撇下'],
    explanation:
      '这里的「委」是「舍弃、抛下」的意思。「相委而去」就是「丢下对方离开了」。如果解作「委任」或「推诿」，都不符合这句的情境。这个词在文言里很灵活，考试很喜欢拿来做语境辨义。',
    memoryTip:
      '「委去」「相委而去」这类语境里，多半和离开、舍弃有关。',
  },
  {
    id: 6,
    category: '一词多义 · 以',
    word: '以',
    sentence: '富國以農，距敵恃卒。',
    image: '/words/yi.png',
    options: ['用、用来', '认为、以为', '缘故、理由', '因为'],
    correctAnswer: ['用、用来', '用', '用来', '凭', '凭借', '依靠', '靠'],
    explanation:
      '「以」在这里是一个很常见的文言虚词，表示「用、凭藉」。「富國以農」即「用农业来使国家富强」。文言文中「以」出现频率极高，必须根据上下文判断其具体含义。',
    memoryTip:
      '「以……」结构中，「以」多表示工具、方法、凭藉等含义。',
  },
  {
    id: 7,
    category: '一词多义 · 方',
    word: '方',
    sentence: '君子固窮，小人窮斯濫矣。',
    image: '/words/fang.png',
    options: ['正要、将要', '方法、办法', '当时、正值', '地方'],
    correctAnswer: ['方法、办法', '方法', '办法', '方式', '手段', '法子'],
    explanation:
      '「方」在这里不表时间，而是「方法、办法」之意。同一个字在不同句子中含义完全不同，这就是「一词多义」的魅力所在。判断时要靠上下文语境。',
    memoryTip:
      '看到「方」要迅速判断：是时间（"将要"）还是名词（"方法"）。',
  },
  {
    id: 8,
    category: '古今异义 · 妻子',
    word: '妻子',
    sentence: '必使仰足以事父母，俯足以畜妻子。',
    image: '/words/qizi.png',
    options: ['妻子和丈夫', '妻子和儿女', '已婚女性', '配偶'],
    correctAnswer: ['妻子和儿女', '妻子和子女', '老婆和孩子', '妻儿', '妻子儿女', '妻和子女'],
    explanation:
      '这是典型的「古今异义」词。古代「妻子」是个复合词，指妻子和儿女；现代「妻子」只指已婚女性。在文言文中看到「妻子」，要注意它包括全家的女性成员。这道题的关键是理解古代社会的家庭结构。',
    memoryTip:
      '古文中的「妻子」记住：妻 = 妻子，子 = 儿女，所以「妻子」= 全家女眷。',
  },
  {
    id: 9,
    category: '古今异义 · 无论',
    word: '无论',
    sentence: '乃不知有漢、無論魏晉。',
    image: '/words/wulun.png',
    options: ['不管怎样', '更不必说、何况', '不讨论', '没有评论'],
    correctAnswer: ['更不必说、何况', '更不必说', '何况', '更不用说', '遑论', '且不说'],
    explanation:
      '「無論」在文言文中是递进关系的连词，表示「更不必说」「何况」之意。意思是既然不知道有汉，更不必说知道魏晋了。这个词在现代汉语中变成了「不论……都……」的让步关系，是明显的古今异义现象。',
    memoryTip:
      '古文中的「無論」多在句子开头，表递进；现代的「無論」多表让步。',
  },
  {
    id: 10,
    category: '古今异义 · 卑鄙',
    word: '卑鄙',
    sentence: '先帝不以臣卑鄙，猥自枉屈。',
    image: '/beibi.png',
    options: ['品德恶劣、下流', '身份低微、见识浅陋', '说话粗俗', '胆小怕事'],
    correctAnswer: ['身份低微、见识浅陋', '身份低微', '见识浅陋', '出身卑微', '见识短浅', '地位低下', '出身低微'],
    explanation:
      '「卑鄙」在古代是中立词，指「身份卑微、见识短浅」；在现代是贬义词，指「品格低劣、行为下作」。诸葛亮用来自谦，说先帝不因为自己出身低微就不信任。这是典型的古今异义词，必须根据上下文判断。',
    memoryTip:
      '看到古文中的「卑鄙」，首先排除现代的"品德恶劣"义，应该理解为"身份低微"。',
  },
  {
    id: 11,
    category: '一词多义 · 伐',
    word: '伐',
    sentence: '十年春，齊師伐我。',
    image: '/words/fa.png',
    options: ['砍伐', '攻打、进攻', '功绩、功劳', '自誇'],
    correctAnswer: ['攻打、进攻', '攻打', '进攻', '讨伐', '征伐', '攻击', '伐'],
    explanation:
      '「伐」在这里是「攻打、进攻」的意思。同一个「伐」字在不同文言篇章中可能有三四种含义：砍伐（伐木）、攻打（伐敌）、功绩（自矜功伐）、自誇（願無伐善）。判断的关键是看句子的主宾搭配。',
    memoryTip:
      '「伐」+敌对方 = 进攻；「伐」+树木 = 砍伐；「伐」+动作 = 功绩/自誇。',
  },
  {
    id: 12,
    category: '古今异义 · 布衣',
    word: '布衣',
    sentence: '臣本布衣，躬耕於南陽。',
    image: '/words/buyi.png',
    options: ['布制的衣服', '平民百姓', '穿布衣的人', '贫穷的象征'],
    correctAnswer: ['平民百姓', '平民', '百姓', '老百姓', '普通人', '庶民', '布衣'],
    explanation:
      '「布衣」古义指「平民百姓」，诸葛亮以「布衣」自称，表明自己出身普通。现代人常以为「布衣」就是布制的衣服，但在古文中往往是社会身份的代称。这类词汇需要了解古代社会的身份系统才能准确理解。',
    memoryTip:
      '古文中的「布衣」不是衣服本身，而是代指「平民身份」，类似「鴻門宴」中的「樊噲」最初也是布衣。',
  },
  {
    id: 13,
    category: '古今异义 · 感激',
    word: '感激',
    sentence: '由是感激，遂許先帝以驅馳。',
    image: '/words/ganji.png',
    options: ['受到感谢而高兴', '感动奋发、激励', '感恩、感谢', '激怒'],
    correctAnswer: ['感动奋发、激励', '感动奋发', '激励', '感动激励', '感动激发', '激发', '感动'],
    explanation:
      '古代的「感激」不是现在的「感谢」，而是「感动奋发」的意思。诸葛亮被先帝的知遇之恩感动而受到激励，因此决心为蜀汉效力。这是个常见的古今异义词，特别容易在阅读时造成理解偏差。',
    memoryTip:
      '文言中的「感激」多在人物被某事触动后发奋的场合出现，不是表示感恩。',
  },
  {
    id: 14,
    category: '一词多义 · 固',
    word: '固',
    sentence: '君子固窮，小人窮斯濫矣。',
    image: '/words/gu.png',
    options: ['坚固、牢固', '本来、原来', '固然、虽然', '执着、固执'],
    correctAnswer: ['本来、原来', '本来', '原来', '原本', '向来', '一向'],
    explanation:
      '这是「固」字的另一个常见用法。当「固」作副词时，表示「本来、原来」。君子本来就能安守穷困的境况。这类虚词的多义是文言文阅读的难点，需要反复接触和积累。',
    memoryTip:
      '「固」作副词修饰谓语时，常表「本来、一向」；作形容词时表「坚固」。',
  },
  {
    id: 15,
    category: '古今异义 · 交通',
    word: '交通',
    sentence: '阡陌交通，雞犬相聞。',
    image: '/words/jiaotong.png',
    options: ['运输往来', '交错相通', '人际交往', '城市交通'],
    correctAnswer: ['交错相通', '互相交错', '互相连通', '交错贯通', '纵横交错', '交错', '相通'],
    explanation:
      '古代「交通」不是现在的交通工具之意，而是「交错相通」「互相联系」。在《桃花源记》中，指田间小路相互交错贯通。这类词在古文中的含义和现代意思差异巨大，很容易造成理解混乱。',
    memoryTip:
      '古文的「交通」在地理/田地描写中多出现，指「路相交、相通」。',
  },
]


// ===== 文言知识库 =====
const chineseKnowledge: ChineseKnowledgeItem[] = [
  {
    id: 1,
    type: 'polysemy',
    word: '方',
    meanings: [
      {
        meaning: '将要、正要',
        example: '世溷濁而莫余知兮，吾方高馳而不顧',
        source: '《楚辭·涉江》',
        ancient: '正值开始',
        modern: '将、快要'
      },
      {
        meaning: '正值、当时',
        example: '方季子之南遊也，驅車癢癲之鄉',
        source: '魏禧《吾廬記》',
        ancient: '在某时刻',
        modern: '当、正当'
      },
      {
        meaning: '方法、办法',
        example: '聖人百慮，其所同也，異用之方異也',
        source: '《論語》',
        ancient: '方法',
        modern: '方式、方法'
      }
    ]
  },
  {
    id: 2,
    type: 'polysemy',
    word: '以',
    meanings: [
      {
        meaning: '仰赖、凭借',
        example: '富國以農，距敵恃卒',
        source: '《韓非子·五蠹》',
        ancient: '用、靠',
        modern: '用...来、凭借'
      },
      {
        meaning: '认为',
        example: '我以日始出時去人近',
        source: '《列子·湯問》',
        ancient: '认为、以为',
        modern: '认为、看成'
      },
      {
        meaning: '缘故、理由',
        example: '宋人執而問其以',
        source: '《列子·周穆王》',
        ancient: '原因',
        modern: '原因、因由'
      }
    ]
  },
  {
    id: 3,
    type: 'semantic-shift',
    word: '妻子',
    meanings: [
      {
        meaning: '（古义）妻子和儿女',
        example: '必使仰足以事父母，俯足以畜妻子',
        source: '《孟子·梁惠王上》',
        ancient: '妻子+儿女',
        modern: '男子的配偶'
      },
      {
        meaning: '（今义）男子的配偶',
        example: '（现代用法）',
        source: '现代汉语',
        ancient: '古代：妻子+儿女',
        modern: '今代：男子配偶'
      }
    ]
  },
  {
    id: 4,
    type: 'semantic-shift',
    word: '无论',
    meanings: [
      {
        meaning: '（古义）更不必说',
        example: '乃不知有漢、無論魏晉',
        source: '陶淵明《桃花源記》',
        ancient: '更何况、更不用说',
        modern: '不管、不论'
      },
      {
        meaning: '（今义）不管、无所谓',
        example: '无论如何都要坚持',
        source: '现代汉语',
        ancient: '表示递进',
        modern: '表示让步'
      }
    ]
  },
  {
    id: 5,
    type: 'borrowed-char',
    word: '亡',
    meanings: [
      {
        meaning: '本字：无',
        example: '河曲智叟亡以應',
        source: '《列子·湯問》',
        ancient: '通假为"无"',
        modern: '本义：逃亡'
      }
    ]
  }
]

// ===== 修辞手法库 =====
const rhetoricalDevices: RhetoricalDevice[] = [
  {
    id: 1,
    name: '比喻',
    description: '根据两样本质不同的事物之间的相似之处，将某一事物（本体）比作另一事物（喻体）。主要分为明喻、暗喻和借喻三种。',
    category: 'comparison',
    examples: [
      {
        text: '那手也不是我所记得的红活圆实的手，卻又粗又笨而且开裂，像是松树皮了',
        explanation: '明喻：用"像"字明确标示比较关系。手的粗糙与松树皮的纹理相比。',
        source: '鲁迅《故乡》',
        image: '暂未上传'
      },
      {
        text: '买棉花糖，一枝空棒子绕着轮子转，轮子嗞嗞地吐丝，结成一个硕大的球，比小孩的头还大，粉红色，又是一朵天上的云霞',
        explanation: '暗喻：没有用比喻词，直接说"又是一朵天上的云霞"。棉花糖的蓬松形状暗示了云的特点。',
        source: '钟晓阳《贩夫风景》',
        image: '暂未上传'
      },
      {
        text: '落光了叶子的柳树上掛满了毛茸茸亮晶晶的银条儿',
        explanation: '借喻：省略了"像"，直接用"银条儿"代称冰晶。不说是"像银条"而是直接说"就是银条"。',
        source: '峻青《第一场雪》',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 2,
    name: '借代',
    description: '不直接说出要说的人或事物，而是借用与其关系密切的东西来代替。可引发联想，加深读者印象。',
    category: 'substitution',
    examples: [
      {
        text: '红眼睛原知道他家裏只有一个老娘，可是没有料到他竟会那麼窮，榨不出一点油水',
        explanation: '"油水"借代"钱"。指代具体的金钱利益，语言更生动含蓄。',
        source: '鲁迅《药》',
        image: '暂未上传'
      },
      {
        text: '他用笔杆写出了英雄的故事',
        explanation: '"笔杆"借代笔或笔者。代指书写工具或从事创作的人。',
        source: '常用例',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 3,
    name: '比拟',
    description: '把物当作人、把人当作物，或将某一事物当作另一事物来写。分为擬人和擬物两种。',
    category: 'comparison-prop',
    examples: [
      {
        text: '问余何事棲碧山，笑而不答，山已经代我答了',
        explanation: '擬人：把山拟人化，使其有"回答"的能力。赋予山人的特点。',
        source: '余光中《沙田山居》',
        image: '暂未上传'
      },
      {
        text: '我想起的，不只是那一小片橢圓的黃色薄光，更有一段永远不能擰熄的时日',
        explanation: '擬物：把"时日"这个抽象概念拟成可以"擧灭"的东西（如灯火）。',
        source: '胡燕青《双层牀》',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 4,
    name: '誇飾',
    description: '故意言过其实，擴大或縮小所寫對象的特質。令事物的形象更鮮明突出，加強表達效果。',
    category: 'exaggeration',
    examples: [
      {
        text: '好幾秒鐘，屋子裏靜寂得聽得見螞蟻在地下爬——可是當時沒有螞蟻',
        explanation: '極端誇飾安靜到荒誕的程度。用"没有螞蟻"的補充增加效果。',
        source: '錢鍾書《圍城》',
        image: '暂未上传'
      },
      {
        text: '泪流成河',
        explanation: '极度夸大眼泪的量。',
        source: '常用例',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 5,
    name: '对偶',
    description: '把结构相同或相似、字数相等、意思相关的两个语句并列在一起。增强语言的节奏感，显得整齐、匀称。',
    category: 'parallelism',
    examples: [
      {
        text: '兩個黃鸝鳴翠柳，一行白鷺上青天。\n窗含西嶺千秋雪，門泊東吳萬里船',
        explanation: '前两句对偶：黄鹂与白鹭对照，翠柳与青天对应。后两句对偶：窗与门对照，雪与船对应。',
        source: '杜甫《绝句》',
        image: '暂未上传'
      }
    ]
  }
]

// ===== 篇章结构作用库 =====
const chapterStructures: ChapterStructure[] = [
  {
    id: 1,
    name: '开门见山',
    description: '文章一起首即切入正题，点明题旨。',
    purpose: '迅速抓住读者注意力，确立写作方向。',
    examples: [
      {
        text: '臣本布衣，躬耕於南陽，苟全性命於亂世，不求聞達於諸侯。',
        analysis: '《出師表》開篇就自我介紹身份背景，為下文表述忠心奠定基礎。',
        source: '諸葛亮《出師表》',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 2,
    name: '首尾呼應',
    description: '文章開首和結尾互相呼應，有助突出主旨，使文章結構嚴謹。',
    purpose: '強化主題，形成完整的論述結構。',
    examples: [
      {
        text: '開：「心之官則思」\n結：「思之，思之，又何求焉」',
        analysis: '開篇提出心能思考的觀點，結尾重複強化這一思想，形成首尾呼應。',
        source: '《孟子》',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 3,
    name: '設置懸念',
    description: '就後文將要出現的人物、事件或論述，預先作暗示或提示，引起懸念。',
    purpose: '吸引讀者繼續閱讀，保持閱讀的連貫性。',
    examples: [
      {
        text: '忽聞河東獅吼...',
        analysis: '用「河東獅吼」引發讀者好奇，何為「河東獅吼」？是誰在「吼」？',
        source: '蘇軾詩',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 4,
    name: '先抑後揚',
    description: '先對人物、事物或觀點等作出否定、貶抑，然後指出其可取之處，予以肯定和褒揚。',
    purpose: '通過對比突顯對象的優點，令讀者印象更深刻。',
    examples: [
      {
        text: '先說某人庸碌無能，後揭示其深藏不露的才能',
        analysis: '先貶低再讚揚，製造反轉效果。',
        source: '常用手法',
        image: '暂未上传'
      }
    ]
  },
  {
    id: 5,
    name: '層層深入',
    description: '內容層層深入，各段之間緊密連結，逐步引出文章主題。',
    purpose: '使讀者逐步理解複雜的論述，層次分明。',
    examples: [
      {
        text: '從社會現象→個人經歷→深層思考→普遍啟示',
        analysis: '逐層推進，從表面問題深入到本質思考。',
        source: '常用結構',
        image: '暂未上传'
      }
    ]
  }
]

// ===== 模块配置 =====
const modules: ModuleCard[] = [
  {
    id: 'classic' as Page,
    emoji: '📜',
    title: '范文重点词句',
    desc: '《出师表》词义辨析、句式结构、拆句理解',
    status: 'live' as const,
    accentColor: 'border-l-emerald-500',
    iconBg: 'bg-emerald-50',
    iconColor: 'text-emerald-600',
    count: `${questions.length} 题`,
  },
  {
    id: 'words' as Page,
    emoji: '🔤',
    title: '实词虚词专项',
    desc: 'DSE 常考實詞虛詞、一詞多義、語境辨義、易混義項對比記憶',
    status: 'live' as const,
    accentColor: 'border-l-blue-400',
    iconBg: 'bg-blue-50',
    iconColor: 'text-blue-500',
    count: `${wordCards.length} 题小样`,
  },
  {
    id: 'grammar' as Page,
    emoji: '⚙️',
    title: '句式结构专练',
    desc: '判断句、倒装句、被动句、省略句系统归纳',
    status: 'live' as const,
    accentColor: 'border-l-amber-400',
    iconBg: 'bg-amber-50',
    iconColor: 'text-amber-600',
    count: `${grammarQuestions.length} 题`,
  },
  {
    id: 'pastpaper' as Page,
    emoji: '📝',
    title: '历史真题刷题',
    desc: '历年 DSE 文言文真题，按年份、考点筛选',
    status: 'live' as const,
    accentColor: 'border-l-rose-400',
    iconBg: 'bg-rose-50',
    iconColor: 'text-rose-500',
    count: `${pastpaperQuestions.length} 题`,
  },
  {
    id: 'wrongbook' as Page,
    emoji: '📕',
    title: '错题集分类',
    desc: '自动收录错题，按词义 / 句式 / 拆句分类复习',
    status: 'live' as const,
    accentColor: 'border-l-violet-400',
    iconBg: 'bg-violet-50',
    iconColor: 'text-violet-500',
    count: '已累计错题',
  },
  {
    id: 'dialogue' as Page,
    emoji: '🎭',
    title: '时空对话框',
    desc: '与古文作者对话，代入共情法理解深层情感',
    status: 'live' as const,
    accentColor: 'border-l-pink-400',
    iconBg: 'bg-pink-50',
    iconColor: 'text-pink-500',
    count: '与古人聊天',
  },
  {
    id: 'puzzle' as Page,
    emoji: '🧩',
    title: '逻辑解谜器',
    desc: '拆解长难句、一键还原古文语序、拖拽重组句子',
    status: 'live' as const,
    accentColor: 'border-l-cyan-400',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    count: '语法拆解',
  },
  {
    id: 'ancient-circle' as Page,
    emoji: '📱',
    title: '古风朋友圈',
    desc: '现代语转古文、分享古文朋友圈、让文言文变时尚',
    status: 'live' as const,
    accentColor: 'border-l-orange-400',
    iconBg: 'bg-orange-50',
    iconColor: 'text-orange-500',
    count: '趣味转换器',
  },
  {
    id: 'knowledge' as Page,
    emoji: '📚',
    title: '文言知识库',
    desc: '一詞多義、古今異義、通假字系統整理，從詞義到用法全覆蓋',
    status: 'live' as const,
    accentColor: 'border-l-indigo-400',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-600',
    count: `${chineseKnowledge.length} 个词`,
  },
  {
    id: 'rhetoric' as Page,
    emoji: '✨',
    title: '修辞手法库',
    desc: '比喻、借代、比拟、誇飾、對偶等常見修辭手法深度解析',
    status: 'live' as const,
    accentColor: 'border-l-teal-400',
    iconBg: 'bg-teal-50',
    iconColor: 'text-teal-600',
    count: `${rhetoricalDevices.length} 个手法`,
  },
  {
    id: 'structure' as Page,
    emoji: '🏗️',
    title: '篇章结构与写作',
    desc: '開門見山、首尾呼應、層層深入等篇章結構，附帶真題示例分析',
    status: 'live' as const,
    accentColor: 'border-l-fuchsia-400',
    iconBg: 'bg-fuchsia-50',
    iconColor: 'text-fuchsia-600',
    count: `${chapterStructures.length} 个结构`,
  },
]

// ===== 投稿说明弹窗 =====
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
  const categories = ['词义解释', '背景图片', '题目补充', '其他']

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
      <div className="pointer-events-auto bg-white border border-gray-200 rounded-2xl shadow-2xl p-6 max-w-sm w-full">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="text-2xl mb-1">📬</div>
            <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: "'Noto Serif SC', serif" }}>投稿意见</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none mt-1 transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="text-gray-600 text-sm leading-relaxed mb-4">
          你有更好的词义解释，或者想为某个词语提供更贴切的背景插图？填写下方表单，我们会把建议记录下来。
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 border border-gray-100 space-y-2 text-xs text-gray-500 leading-relaxed">
          <p>📌 <span className="text-gray-700 font-medium">投稿内容：</span>词义解释文字 / 辅助背景图片 / 题目补充</p>
          <p>✅ <span className="text-gray-700 font-medium">采纳标准：</span>内容准确、适合 DSE 备考、图文匹配</p>
          <p>🎖️ <span className="text-gray-700 font-medium">采纳奖励：</span>页面将标注「由同学提供」</p>
          <p>📧 <span className="text-gray-700 font-medium">提交方式：</span>直接填写表单后提交即可，本地保存。</p>
          <p>📝 <span className="text-gray-700 font-medium">已投稿：</span>{feedbackCount} 条</p>
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">投稿类型</label>
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
          <label className="block text-xs font-medium text-gray-500">建议标题</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="例如：词义解释更准确"
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">你的名字（可选）</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例如：小明"
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">你的邮箱（可选）</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@mail.com"
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">建议内容</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="请写下你的建议、改动说明或图片说明"
            rows={5}
            className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
          />
        </div>

        <div className="space-y-3 mb-4">
          <label className="block text-xs font-medium text-gray-500">上传插画（可选）</label>
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
        {success && <div className="text-emerald-600 text-sm mb-3">提交成功，建议已保存！</div>}

        <div className="flex flex-col gap-3">
          <button
            onClick={onSubmit}
            className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-bold text-white"
          >
            提交建议
          </button>
          <button
            onClick={onClose}
            className="self-end text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            取消并关闭
          </button>
        </div>
      </div>
    </div>
  )
}

// ===== 主组件 =====
function App() {
  const [page, setPage] = useState<Page>('home')
  // ===== 模型設置 =====
  const [aiModel, setAiModel] = useState(() => localStorage.getItem('ai_model') || 'doubao-seed-2-0-pro-260215')
  const [arkApiKey, setArkApiKey] = useState(() => localStorage.getItem('ark_api_key') || 'ark-9f9dd7dc-a0f0-427a-a7e0-74536870b75b-6ee40')
  const [showModelSettings, setShowModelSettings] = useState(false)
  const [modelInput, setModelInput] = useState(() => localStorage.getItem('ai_model') || 'doubao-seed-2-0-pro-260215')
  const [keyInput, setKeyInput] = useState(() => localStorage.getItem('ark_api_key') || 'ark-9f9dd7dc-a0f0-427a-a7e0-74536870b75b-6ee40')

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
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false)
  const [feedbacks, setFeedbacks] = useState<FeedbackSubmission[]>([]) 
  const [submitName, setSubmitName] = useState('')
  const [submitEmail, setSubmitEmail] = useState('')
  const [submitCategory, setSubmitCategory] = useState('词义解释')
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
  // 三阶段学习
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
  // 时空对话框状态
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
  // 古风朋友圈社区 state
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
      setAuthError('请填写完整注册信息。')
      return
    }
    if (accounts.some(account => account.email === trimmedEmail)) {
      setAuthError('该邮箱已注册，请直接登录。')
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
      setAuthError('邮箱或密码错误。')
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
      setSubmitError('请选择图片文件进行投稿。')
      return
    }
    if (file.size > 3 * 1024 * 1024) {
      setSubmitError('图片请控制在 3MB 内。')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setSubmitImageData(reader.result as string)
      setSubmitImageName(file.name)
      setSubmitError(null)
    }
    reader.onerror = () => {
      setSubmitError('图片读取失败，请重试。')
    }
    reader.readAsDataURL(file)
  }

  const handleFeedbackSubmit = () => {
    const trimmedTopic = submitTopic.trim()
    const trimmedMessage = submitMessage.trim()
    if (!trimmedTopic) {
      setSubmitError('请填写建议标题。')
      setSubmitSuccess(false)
      return
    }
    if (!trimmedMessage) {
      setSubmitError('请填写建议内容。')
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

  // ===== 阶段1：认识卡片 =====
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
      // 进入阶段2
      setWordsPhase(2)
      setWordsPhase2Index(0)
      setWordsPhase2Score(0)
      setWordsPhase2Selected(null)
      setWordsPhase2Answered(false)
      setPage('words-quiz')
    }
  }

  // ===== 阶段2：选词义 =====
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
      // 进入阶段3
      setWordsPhase(3)
      setWordsPhase3Index(0)
      setWordsPhase3Input('')
      setWordsPhase3Answered(false)
      setWordsPhase3Score(0)
      setWordsPhase3Results([])
      setPage('words-fill')
    }
  }

  // ===== 阶段3：填空复习 =====
  const currentPhase3Card = wordCards[wordsPhase3Index]
  const handlePhase3Submit = () => {
    if (wordsPhase3Answered) return
    const userAns = wordsPhase3Input.trim()
    if (!userAns) return
    const correctArr = currentPhase3Card.correctAnswer
    const word = currentPhase3Card.word
    const sentence = currentPhase3Card.sentence
    const displayCorrect = correctArr[0]

    // 本地数组匹配：用户答案包含任意一个可接受答案，或可接受答案包含用户答案（且长度>=2）
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

  // ==================== 主页 ====================
  if (page === 'home') {
    return (
      <div
        className="min-h-screen bg-[#fafaf8] text-gray-900 relative"
        style={{ fontFamily: "'Noto Sans SC', sans-serif" }}
      >
        {/* 顶部导航栏 */}
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-5xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-xl">📖</span>
              <span
                className="text-lg font-bold text-gray-900"
                style={{ fontFamily: "'Noto Serif SC', serif" }}
              >
                文言文学习平台
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-400 hidden md:block">香港 DSE 中文科备考</span>
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
                          placeholder="如: doubao-seed-2-0-pro-260215" />
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

        {/* Hero 区域 */}
        <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
          <div className="flex items-end gap-4 mb-1">
            <h1
              className="text-4xl font-black text-gray-900 leading-tight"
              style={{ fontFamily: "'Noto Serif SC', serif" }}
            >
              掌握文言文，<br />从这里开始。
            </h1>
          </div>
          <p className="text-gray-500 text-base mt-3 max-w-lg leading-relaxed">
            系统学习 DSE 核心范文词义、句式结构与实词虚词，互动练习让备考更高效。
          </p>
        </div>

        {/* 模块网格 */}
        <div className="max-w-5xl mx-auto px-6 pb-20">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">选择学习方式</p>
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
                {/* 图标 */}
                <div className={`inline-flex items-center justify-center w-11 h-11 rounded-xl ${mod.iconBg} ${mod.iconColor} text-2xl mb-4`}>
                  {mod.emoji}
                </div>

                {/* 标题 + 状态 */}
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className="text-base font-bold text-gray-900"
                    style={{ fontFamily: "'Noto Serif SC', serif" }}
                  >
                    {mod.title}
                  </h3>
                  {mod.status === 'live' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 font-semibold">已上线</span>
                  )}
                  {mod.status === 'soon' && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-400 font-medium flex items-center gap-1">
                      🔒 即将上线
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
                      开始练习 →
                    </span>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 右侧统计与登录面板 */}
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
                  <div className="text-xs uppercase tracking-[0.18em] text-gray-400 mb-1">统计中心</div>
                  <h3 className="text-lg font-bold text-gray-900">班级汇总</h3>
                </div>
                <button
                  onClick={() => setPage('stats')}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  查看详情
                </button>
              </div>
              <div className="space-y-2 text-sm text-gray-600">
                <p>已注册同学：<span className="font-semibold text-gray-900">{accounts.length}</span></p>
                <p>已记录成绩：<span className="font-semibold text-gray-900">{userStats.length}</span> 位</p>
                <p>当前登录：<span className="font-semibold text-gray-900">{currentUser ? currentUser.name : '未登录'}</span></p>
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-5 shadow-xl">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-gray-900">账号登录</h3>
                <button
                  onClick={() => {
                    setAuthMode(authMode === 'login' ? 'register' : 'login')
                    setAuthError(null)
                  }}
                  className="text-xs text-emerald-600 hover:text-emerald-700"
                >
                  {authMode === 'login' ? '注册新账号' : '已有账号登录'}
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
                    退出登录
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
                    placeholder="邮箱"
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
                  />
                  <input
                    type="password"
                    value={authPassword}
                    onChange={(e) => setAuthPassword(e.target.value)}
                    placeholder="密码"
                    className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm text-gray-800 outline-none focus:border-emerald-400"
                  />
                  {authError && <div className="text-rose-500 text-xs">{authError}</div>}
                  <button
                    onClick={authMode === 'login' ? handleLogin : handleRegister}
                    className="w-full rounded-2xl bg-emerald-500 py-2 text-sm font-semibold text-white hover:bg-emerald-600 transition-colors"
                  >
                    {authMode === 'login' ? '登录' : '注册'}
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
              展开统计面板
            </button>
          </div>
        )}

        {/* 左下角：小猫吉祥物 */}
        <div className="fixed bottom-6 left-6 z-20 flex flex-col items-center gap-2">
          {/* 声音开关标签 */}
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
            <span>{isMuted ? '已静音' : '声音开启'}</span>
          </button>
          {/* 小猫视频 */}
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

        {/* 右下角：投稿按钮 */}
        <button
          onClick={() => setShowSubmit(true)}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-md text-sm font-medium text-gray-600 hover:text-emerald-700 group"
        >
          <span>📬</span>
          <span>投稿意见</span>
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

  // ==================== 范文学习：选题型 ====================
  if (page === 'classic') {
    const quizModes = [
      { tab: 'all' as const, emoji: '🎯', title: '全部题型', desc: `共 ${questions.length} 题，词义 + 句式 + 拆句`, accent: 'border-l-gray-400', iconBg: 'bg-gray-50', iconColor: 'text-gray-600' },
      { tab: 'vocab' as const, emoji: '📖', title: '词义辨析', desc: `共 ${questions.filter(q => q.type === 'vocab').length} 题，古今异义 · 实词虚词`, accent: 'border-l-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600' },
      { tab: 'sentence' as const, emoji: '🔤', title: '特殊句式', desc: `共 ${questions.filter(q => q.type === 'sentence').length} 题，判断句 · 倒装句 · 被动句`, accent: 'border-l-amber-400', iconBg: 'bg-amber-50', iconColor: 'text-amber-600' },
      { tab: 'parse' as const, emoji: '🔍', title: '拆句理解', desc: `共 ${questions.filter(q => q.type === 'parse').length} 题，成分分析 · 语序还原`, accent: 'border-l-violet-400', iconBg: 'bg-violet-50', iconColor: 'text-violet-600' },
    ]

    return (
      <div className="min-h-screen bg-[#fafaf8]" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 顶部导航 */}
        <header className="border-b border-gray-100 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 transition-colors text-sm font-medium">
              ← 返回
            </button>
            <div className="w-px h-4 bg-gray-200" />
            <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: "'Noto Serif SC', serif" }}>
              📜 范文重点词句 · 《出师表》
            </span>
          </div>
        </header>

        <div className="max-w-4xl mx-auto px-6 pt-10 pb-20">
          <h2
            className="text-2xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            选择练习题型
          </h2>
          <p className="text-gray-500 text-sm mb-8">根据你的备考需要，选择专项练习或全部混合练习。</p>

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
                  开始练习 →
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 左下角：小猫吉祥物 */}
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
            <span>{isMuted ? '已静音' : '声音开启'}</span>
          </button>
          <div className="w-28 h-28 rounded-full overflow-hidden border-2 border-white shadow-lg bg-gray-100">
            <video id="cat-mascot2" src="/cat.mp4" autoPlay loop muted playsInline className="w-full h-full object-cover" />
          </div>
        </div>
        {/* 投稿按钮 */}
        <button
          onClick={() => setShowSubmit(true)}
          className="fixed bottom-6 right-6 z-20 flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50 transition-all shadow-md text-sm font-medium text-gray-600 hover:text-emerald-700"
        >
          <span>📬</span>
          <span>投稿意见</span>
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

  // ==================== 实词虚词专项：专题入口 ====================
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
              🔤 实词虚词专项
            </span>
          </div>
        </header>

        <div className="max-w-5xl mx-auto px-6 pt-10 pb-16">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold mb-4">
                <span>百词斩式卡片练习</span>
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                <span>{wordCards.length} 个词卡</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-gray-900 leading-tight mb-4" style={{ fontFamily: "'Noto Serif SC', serif" }}>
                用词语卡片，
                <br />
                把实词虚词记牢。
              </h1>
              <p className="text-gray-500 leading-relaxed text-base md:text-lg max-w-2xl mb-6">
                每张卡片都会给出一个重点词语、一条例句、一张辅助图片和四个易混淆选项，帮助学生在真实语境里分清词义，而不是只靠死背现代意思。
              </p>

              <div className="grid sm:grid-cols-3 gap-3 mb-8">
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-1">看图记词</p>
                  <p className="text-xs leading-relaxed text-gray-500">用画面建立词义联想，降低纯文字记忆的疲劳感。</p>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-1">例句辨义</p>
                  <p className="text-xs leading-relaxed text-gray-500">每道题都直接回到《出师表》的文脉里判断含义。</p>
                </div>
                <div className="rounded-2xl bg-white border border-gray-100 p-4 shadow-sm">
                  <p className="text-sm font-bold text-gray-900 mb-1">易混干扰</p>
                  <p className="text-xs leading-relaxed text-gray-500">专门加入现代常见误解，训练考试时的辨析能力。</p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button onClick={startWordsSample} className="px-6 py-3 rounded-2xl bg-blue-500 hover:bg-blue-600 transition-colors text-white font-bold shadow-sm">
                  开始学习 →
                </button>
                <span className="text-sm text-gray-400">三阶段学习：认识 → 选词义 → 填空复习</span>
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

  // ==================== 实词虚词专项：阶段1 认识卡片 ====================
  if (page === 'words-learn') {
    const card = wordCards[wordsIndex]
    const progress = ((wordsIndex) / wordCards.length) * 100
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 顶部进度 */}
        <div className="w-full max-w-2xl mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2">
              <button onClick={() => setPage('words')} className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium">← 返回</button>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-50 text-blue-600 font-medium">第一阶段：认识卡片</span>
              <span className="text-gray-400 text-xs">{wordsIndex + 1} / {wordCards.length}</span>
            </div>
            <div className="flex gap-2 text-xs">
              <span className="text-emerald-600">✓ 认识 {wordsFamiliar.size}</span>
              <span className="text-rose-400">✗ 不认识 {wordsUnfamiliar.size}</span>
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
            {/* 图片 */}
            <div className="rounded-[28px] overflow-hidden border border-gray-100 bg-gray-50 min-h-[240px]">
              <img src={card.image} alt={card.word} className="w-full h-full object-cover" />
            </div>
            {/* 内容 */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs px-3 py-1 rounded-full bg-blue-50 text-blue-600 font-semibold">{card.category}</span>
                  <span className="text-xs text-gray-400">点击翻转</span>
                </div>
                <h2 className="text-5xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>{card.word}</h2>
                <p className="text-gray-500 italic text-sm leading-relaxed mb-4">「{card.sentence}」</p>
                {!wordsFlipped ? (
                  <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-4 text-center">
                    <p className="text-sm text-slate-500">你认识这个词在句中的意思吗？</p>
                    <p className="text-xs text-slate-400 mt-1">点击卡片翻转查看答案</p>
                  </div>
                ) : (
                  <div className="rounded-2xl bg-emerald-50 border border-emerald-100 px-4 py-4">
                    <p className="text-xs text-emerald-500 mb-1 font-semibold uppercase tracking-widest">正确词义</p>
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
                    ✗ 不认识
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleFamiliar(card.id, true) }}
                    className="flex-1 py-3 rounded-2xl border-2 border-emerald-200 bg-emerald-50 text-emerald-700 font-bold text-sm hover:bg-emerald-100 transition-colors"
                  >
                    ✓ 认识
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-4">点击卡片翻转 · 看完答案再选择</p>
      </div>
    )
  }


  if (page === 'words-quiz') {
    const card = currentPhase2Card
    const progress2 = ((wordsPhase2Index + 1) / wordCards.length) * 100
    // 找出同一个词的其他义项（一字多义展示）
    const sameWordCards = wordCards.filter(c => c.word === card.word && c.id !== card.id)
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="w-full max-w-2xl mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setPage('words')} className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium">← 返回</button>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-50 text-purple-600 font-medium">第二阶段：选词义</span>
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
                <span className="text-xs text-gray-400">选词义</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black text-gray-900 mb-3" style={{ fontFamily: "'Noto Serif SC', serif" }}>{card.word}</h2>
              <p className="text-gray-500 italic text-sm md:text-base leading-relaxed mb-4">「{card.sentence}」</p>
              <div className="rounded-2xl bg-slate-50 border border-slate-100 px-4 py-3 mb-4">
                <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">请判断</p>
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
                {card.correctAnswer.includes(wordsPhase2Selected ?? '') ? '答对了！' : `正确答案：${card.correctAnswer[0]}`}
              </div>
              <p className="text-gray-600 text-sm leading-relaxed text-center mb-2">{card.explanation}</p>
              <p className="text-xs text-blue-600 bg-blue-50 border border-blue-100 rounded-2xl px-4 py-2 text-center mb-3">{card.memoryTip}</p>
              {sameWordCards.length > 0 && (
                <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-3 mb-3">
                  <p className="text-xs font-bold text-amber-700 mb-2">「{card.word}」的其他常见义项：</p>
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
                {wordsPhase2Index + 1 < wordCards.length ? '下一题 →' : '进入第三阶段：填空复习 →'}
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ==================== 实词虚词专项：阶段3 填空复习 ====================
  if (page === 'words-fill') {
    const card = currentPhase3Card
    const progress3 = ((wordsPhase3Index + 1) / wordCards.length) * 100
    // 挖空：把例句中的词替换为下划线
    const blankedSentence = card.sentence.replace(card.word, '＿＿')
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="w-full max-w-2xl mb-5">
          <div className="flex justify-between items-center mb-2 px-1">
            <div className="flex items-center gap-2 flex-wrap">
              <button onClick={() => setPage('words')} className="text-gray-400 hover:text-gray-700 text-xs transition-colors font-medium">← 返回</button>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-600 font-medium">第三阶段：填空复习</span>
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
                <p className="text-xs text-slate-400 mb-1">例句（词已挖空）</p>
                <p className="text-base font-semibold text-slate-800 leading-relaxed">「{blankedSentence}」</p>
              </div>
              <p className="text-sm text-gray-600 mb-3">请写出「{card.word}」在句中的意思：</p>
              <input
                type="text"
                value={wordsPhase3Input}
                onChange={e => setWordsPhase3Input(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !wordsPhase3Answered && handlePhase3Submit()}
                disabled={wordsPhase3Answered}
                placeholder="输入词义…"
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
                          {ok ? '✓ 答对了！' : '✗ 再想想'}
                        </p>
                        <p className="text-xs text-gray-600">正确答案：<span className="font-semibold">{card.correctAnswer[0]}</span></p>
                        <p className="text-xs text-gray-500 mt-1">{card.explanation}</p>
                      </div>
                    )
                  })()}
                  <button onClick={handlePhase3Next}
                    className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-bold text-white">
                    {wordsPhase3Index + 1 < wordCards.length ? '下一题 →' : '查看学习成绩 →'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 实词虚词专项：答题页（旧，保留兼容）====================
  // ==================== 实词虚词专项：成绩页 ====================
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
              {allCorrect ? '三轮全部掌握！' : p3pct >= 70 ? '学得不错，继续加油' : '建议再刷一轮'}
            </h2>
            <p className="text-gray-400 text-sm">实词虚词 · 三阶段学习完成</p>
          </div>

          {/* 三阶段得分 */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="rounded-2xl bg-blue-50 border border-blue-100 p-3 text-center">
              <p className="text-xs text-blue-500 font-semibold mb-1">认识卡片</p>
              <p className="text-xl font-black text-blue-700">{wordsFamiliar.size}<span className="text-sm text-blue-400">/{wordCards.length}</span></p>
              <p className="text-xs text-blue-400 mt-1">认识</p>
            </div>
            <div className="rounded-2xl bg-purple-50 border border-purple-100 p-3 text-center">
              <p className="text-xs text-purple-500 font-semibold mb-1">选词义</p>
              <p className="text-xl font-black text-purple-700">{wordsPhase2Score}<span className="text-sm text-purple-400">/{wordCards.length}</span></p>
              <p className="text-xs text-purple-400 mt-1">{p2pct}% 正确</p>
            </div>
            <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-xs text-emerald-500 font-semibold mb-1">填空复习</p>
              <p className="text-xl font-black text-emerald-700">{wordsPhase3Score}<span className="text-sm text-emerald-400">/{wordCards.length}</span></p>
              <p className="text-xs text-emerald-400 mt-1">{p3pct}% 正确</p>
            </div>
          </div>

          {/* 复习清单 */}
          {needReview.length > 0 && (
            <div className="rounded-2xl bg-amber-50 border border-amber-100 px-4 py-4 mb-5">
              <p className="text-sm font-bold text-amber-700 mb-3">📌 需要复习的词（{needReview.length} 个）</p>
              <div className="space-y-2">
                {needReview.map((r, i) => (
                  <div key={i} className="flex items-start gap-3 text-xs">
                    <span className="font-black text-amber-800 text-base w-8 shrink-0" style={{ fontFamily: "'Noto Serif SC', serif" }}>{r.word}</span>
                    <div>
                      <p className="text-amber-700 italic mb-0.5">「{r.sentence}」</p>
                      <p className="text-gray-500">正确：<span className="font-semibold text-emerald-700">{r.correct}</span>　你写：<span className="text-rose-500">{r.userInput || '（未填）'}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => setPage('words')} className="py-3 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 transition-colors font-semibold text-gray-700 text-sm">
              返回专题页
            </button>
            <button onClick={startWordsSample} className="py-3 rounded-xl bg-blue-500 hover:bg-blue-600 transition-colors font-bold text-white text-sm">
              再来一轮
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 占位页面 ====================
  if (page === 'pastpaper') {
    const years = ['all', ...pastpaperYears] as const
    const types: Array<'all' | QuestionType> = ['all', 'vocab', 'sentence', 'parse']

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-5xl w-full">
          <div className="mb-6 flex items-center gap-3">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主页</button>
            <div className="text-sm text-gray-500">历年真题练习 · 共 {filteredPastpaperQuestions.length} 题</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">历史真题刷题</h2>
              <p className="text-sm text-gray-500 mt-1">按年份与题型筛选练习题，错题自动加入错题集。</p>
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
                  {type === 'all' ? '全部题型' : type === 'vocab' ? '词义' : type === 'sentence' ? '句式' : '拆句'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-widest mb-2">当前题目</div>
                <div className="text-lg font-semibold text-gray-900">{filteredPastpaperQuestions.length === 0 ? '请调整筛选条件' : `${pastpaperIndex + 1} / ${filteredPastpaperQuestions.length}`}</div>
              </div>
              <div className="text-sm text-gray-500">已得分 {pastpaperScore}</div>
            </div>

            {filteredPastpaperQuestions.length === 0 ? (
              <div className="py-16 text-center text-gray-500">当前筛选条件下暂无题目，请选择“全部年份”或改变题型。</div>
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
                    <div className="text-xs text-gray-500">题型：{currentPastpaperQuestion.type === 'vocab' ? '词义' : currentPastpaperQuestion.type === 'sentence' ? '句式' : '拆句'}</div>
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
                      {pastpaperSelected === currentPastpaperQuestion.correctAnswer ? '答对了！' : `正确答案：${currentPastpaperQuestion.correctAnswer}`}
                    </div>
                    <p className="text-gray-500 text-xs mb-4 px-2 leading-relaxed">{currentPastpaperQuestion.explanation}</p>
                    <button
                      onClick={handleNextPastpaper}
                      className="w-full py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-sm font-bold text-white"
                    >
                      {pastpaperIndex + 1 < filteredPastpaperQuestions.length ? '下一题 →' : '重新开始'}
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
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主页</button>
            <div className="text-sm text-gray-500">错题集 · 共 {wrongbook.length} 题</div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-6">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-gray-900">错题集分类</h2>
              <p className="text-sm text-gray-500 mt-1">按题型查看错题，支持移出已掌握题目。</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.map((type) => (
                <button
                  key={type}
                  onClick={() => setWrongbookType(type)}
                  className={`px-3 py-2 rounded-full text-xs font-medium transition ${wrongbookType === type ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {type === 'all' ? '全部题型' : type === 'vocab' ? '词义' : type === 'sentence' ? '句式' : '拆句'}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            {displayWrongbook.length === 0 ? (
              <div className="text-center py-16 text-gray-500">
                当前没有错题，继续练习可以自动收录错题。
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4 gap-3">
                  <span className="text-sm text-gray-500">已筛选 {displayWrongbook.length} 题</span>
                  <button onClick={clearWrongbook} className="text-xs px-3 py-2 rounded-full bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition">清空错题集</button>
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
                        移出错题
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
                    <div className="text-xs text-gray-500">正确答案：{item.correctAnswer}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==================== 时空对话框页面 ====================
  if (page === 'dialogue') {


    // ---- 预设作者列表 ----
    const PRESET_AUTHORS_DATA = [
      {
        id: 'zhuge', name: '诸葛亮', emoji: '🪬', work: '《出师表》', dynasty: '三国·蜀汉',
        intro: '蜀汉丞相，忠义智慧的化身',
        greeting: '吾乃诸葛孔明。汝有何疑惑，尽可相问，吾必知无不言。',
        hints: ['你写出师表时是什么心情？', '「卑鄙」在古代是什么意思？', '你最担心后主刘禅什么？'],
        systemPrompt: `你现在扮演三国时期蜀汉丞相诸葛亮（字孔明），正在与一位香港中学生进行跨时空对话。你是《出师表》的作者，深知刘备托孤之重，一心北伐、兴复汉室。你博学多才，通晓天文地理、兵法谋略，为人忠诚谦逊。说话时偶尔引用文言文原句，但会主动用现代语言解释。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文，语气亲切温和。`,
      },
      {
        id: 'ouyang', name: '欧阳修', emoji: '🏮', work: '《醉翁亭记》', dynasty: '北宋',
        intro: '唐宋八大家之一，寄情山水',
        greeting: '吾乃欧阳永叔。滁州山水之乐，皆在吾文中矣。汝有何疑问？',
        hints: ['你写醉翁亭记时的心情是什么？', '「也」字在文中有什么作用？', '你真的很喜欢喝酒吗？'],
        systemPrompt: `你现在扮演北宋文学家欧阳修（字永叔，号醉翁），正在与一位香港中学生进行跨时空对话。你是《醉翁亭记》的作者，被贬滁州时寄情山水，以文抒怀。你是唐宋八大家之一，文章讲究韵律与意境。语气豁达开朗，虽遭贬谪但不失幽默。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文。`,
      },
      {
        id: 'sima', name: '司马迁', emoji: '📜', work: '《廉颇蔺相如列传》', dynasty: '西汉',
        intro: '《史记》作者，忍辱负重完成千古巨著',
        greeting: '吾乃司马子长。史家之事，在于秉笔直书。汝欲问何事？',
        hints: ['你写史记时最难的是什么？', '廉颇和蔺相如谁更厉害？', '你受宫刑后是怎么坚持下去的？'],
        systemPrompt: `你现在扮演西汉史学家司马迁（字子长），正在与一位香港中学生进行跨时空对话。你是《史记》的作者，受宫刑后忍辱负重，完成史学巨著。你对廉颇、蔺相如等历史人物有深刻的理解和评价。语气沉稳而坚毅，有历史学家的客观与深度。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文。`,
      },
      {
        id: 'han', name: '韩愈', emoji: '🖋️', work: '《师说》', dynasty: '唐朝',
        intro: '唐宋八大家之首，力倡古文运动',
        greeting: '吾乃韩退之。师者，所以传道受业解惑也。汝有何惑，尽可相问。',
        hints: ['你写师说是为了批评什么？', '「师者」这句话是什么意思？', '你觉得现代学生应该怎样对待老师？'],
        systemPrompt: `你现在扮演唐代文学家韩愈（字退之），正在与一位香港中学生进行跨时空对话。你是《师说》的作者，力倡古文运动，反对士大夫耻于从师的风气。你是唐宋八大家之首，文章气势磅礴，逻辑严密。语气严正而有力，有强烈的社会责任感。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文。`,
      },
      {
        id: 'tao', name: '陶渊明', emoji: '🌾', work: '《桃花源记》', dynasty: '东晋',
        intro: '田园诗人，归隐山林，向往世外桃源',
        greeting: '余本布衣，不愿为五斗米折腰。桃花源之境，乃吾心中理想。汝欲问何事？',
        hints: ['桃花源真的存在吗？', '你为什么要辞官归隐？', '「不为五斗米折腰」是什么意思？'],
        systemPrompt: `你现在扮演东晋田园诗人陶渊明（字元亮，号五柳先生），正在与一位香港中学生进行跨时空对话。你是《桃花源记》的作者，不愿与世俗同流合污，辞官归隐，过着耕读自足的生活。你向往自然、淡泊名利，语气平和而洒脱，充满对自由生活的热爱。每次回答控制在100-200字以内，可以适当用第一人称"余"，但不要全篇文言文。`,
      },
      {
        id: 'fan', name: '范仲淹', emoji: '🌊', work: '《岳阳楼记》', dynasty: '北宋',
        intro: '政治家、文学家，「先天下之忧而忧」',
        greeting: '余登岳阳楼，览洞庭湖之大观，感慨万千。汝有何问，尽可道来。',
        hints: ['「先天下之忧而忧」是什么意思？', '你写岳阳楼记时在想什么？', '你觉得做官最重要的是什么？'],
        systemPrompt: `你现在扮演北宋政治家、文学家范仲淹（字希文），正在与一位香港中学生进行跨时空对话。你是《岳阳楼记》的作者，以"先天下之忧而忧，后天下之乐而乐"为人生信条。你一生忧国忧民，多次被贬仍坚守理想。语气沉稳而充满忧国情怀，有强烈的责任感和使命感。每次回答控制在100-200字以内，可以适当用第一人称"余"，但不要全篇文言文。`,
      },
      {
        id: 'su', name: '苏轼', emoji: '🎋', work: '《赤壁赋》', dynasty: '北宋',
        intro: '豪放派词人，旷达乐观，才华横溢',
        greeting: '吾乃苏子瞻。赤壁之下，江山如画，人生如梦。汝有何疑，尽可相问。',
        hints: ['你被贬黄州时是什么心情？', '「人生如梦」你真的这样想吗？', '赤壁赋里的「客」是真实存在的人吗？'],
        systemPrompt: `你现在扮演北宋文学家苏轼（字子瞻，号东坡居士），正在与一位香港中学生进行跨时空对话。你是《赤壁赋》的作者，多次被贬却始终保持旷达乐观的心态。你是豪放派词人的代表，才华横溢，通晓诗词书画。语气豁达幽默，充满哲理，善于从逆境中找到人生的意义。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文。`,
      },
      {
        id: 'liuzongyuan', name: '柳宗元', emoji: '🐟', work: '《捕蛇者说》', dynasty: '唐朝',
        intro: '唐宋八大家之一，以文揭露苛政之害',
        greeting: '吾乃柳子厚。苛政猛于虎，此言非虚。汝欲问何事？',
        hints: ['捕蛇者说想表达什么？', '「苛政猛于虎」是什么意思？', '你被贬永州时有什么感受？'],
        systemPrompt: `你现在扮演唐代文学家柳宗元（字子厚），正在与一位香港中学生进行跨时空对话。你是《捕蛇者说》的作者，以此文深刻揭露了苛政对百姓的残害。你是唐宋八大家之一，被贬永州十年，寄情山水，以文章抒发忧国忧民之情。语气沉郁而有力，充满对民间疾苦的同情。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文。`,
      },
    ]

    // 合并预设 + 自定义作者
    const ALL_AUTHORS = [...PRESET_AUTHORS_DATA, ...customAuthors]
    const currentAuthorConfig = ALL_AUTHORS.find(a => a.id === selectedAuthor) || PRESET_AUTHORS_DATA[0]
    const STORAGE_KEY = `dialogue_messages_${selectedAuthor}`

    const loadMessages = (): DialogueMessage[] => {
      try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved) return JSON.parse(saved)
      } catch {}
      // 用 currentAuthorConfig（已在本次渲染中正确解析）
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
      // 设置初始快捷问题
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

    // 清除全部记录
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

    // 删除选中的消息
    const handleDeleteSelected = () => {
      if (dialogueSelectedMsgs.length === 0) return
      const remaining = dialogueMessages.filter(m => !dialogueSelectedMsgs.includes(m.id))
      setDialogueMessages(remaining)
      saveMessages(remaining)
      setDialogueSelectedMsgs([])
      setDialogueDeleteMode(false)
    }

    // 切换消息选中状态
    const toggleMsgSelect = (id: number) => {
      setDialogueSelectedMsgs(prev =>
        prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
      )
    }

    // 保存自定义作者
    const handleSaveCustomAuthor = async () => {
      if (!customFormName.trim() || !customFormWork.trim()) return
      setCustomFormLoading(true)

      const name = customFormName.trim()
      const work = customFormWork.trim()
      const dynasty = customFormDynasty.trim() || '未知朝代'
      const intro = customFormIntro.trim() || `${work}的作者`
      const systemPrompt = `你现在扮演${dynasty}文人${name}，正在与一位香港中学生进行跨时空对话。你是${work}的作者。${customFormIntro.trim() ? customFormIntro.trim() + '。' : ''}请根据你的身份和作品，回答学生关于文言文学习和历史背景的问题。每次回答控制在100-200字以内，可以适当用第一人称"吾"、"余"，但不要全篇文言文，语气亲切，像在与学生面对面交流。`

      // 默认值（AI 生成失败时使用）
      let greeting = `吾乃${name}。汝有何疑惑，尽可相问。`
      let hints = [`你写${work}时是什么心情？`, `${work}最想表达什么？`, '你最希望后人记住你什么？']

      try {
        const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
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
                content: `你是一个文言文学习平台的角色生成助手。根据用户提供的古文作者信息，生成：
1. 一句符合该人物身份和性格的个性化开场白（20-40字，用第一人称，可带文言文风格，但要让中学生看懂）
2. 三个适合学生向该作者提问的问题（每个不超过15字）

严格按以下格式输出，不要其他内容：
开场白：[开场白内容]
问题1：[问题内容]
问题2：[问题内容]
问题3：[问题内容]`,
              },
              {
                role: 'user',
                content: `作者姓名：${name}
朝代：${dynasty}
代表作品：${work}
简介：${intro}`,
              },
            ],
          }),
        })
        if (res.ok) {
          const data = await res.json()
          const text = data.choices?.[0]?.message?.content || ''
          const greetingMatch = text.match(/开场白：(.+)/)
          const q1 = text.match(/问题1：(.+)/)
          const q2 = text.match(/问题2：(.+)/)
          const q3 = text.match(/问题3：(.+)/)
          if (greetingMatch) greeting = greetingMatch[1].trim()
          const newHints = [q1, q2, q3].map(m => m?.[1]?.trim()).filter(Boolean) as string[]
          if (newHints.length === 3) hints = newHints
        }
      } catch {
        // AI 生成失败，使用默认值
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

    // 删除自定义作者
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
        const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
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

        if (!response.ok) throw new Error(`API 请求失败：${response.status}`)
        const data = await response.json()
        const aiReply = data.choices?.[0]?.message?.content || `${currentAuthorConfig.name}一时语塞，请再问一次。`

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

        // 根据 AI 回复动态生成新的快捷问题
        try {
          const hintRes = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
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
                  content: `你是一个学习助手，帮助学生深入理解文言文。根据以下对话内容，生成3个简短的追问问题（每个不超过15字），帮助学生继续深入探讨。只输出3个问题，每行一个，不要编号，不要其他内容。`,
                },
                {
                  role: 'user',
                  content: `作者：${currentAuthorConfig.name}
学生问：${dialogueInput}
作者答：${aiReply}

请生成3个追问问题：`,
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
          // 生成快捷问题失败不影响主流程
        }
      } catch {
        const errorMsg: DialogueMessage = {
          id: updatedWithUser.length + 1,
          role: 'author',
          content: '（时空信号不稳定，暂时无法回应，请稍后再试。）',
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

    // ---- 自定义作者表单 ----
    if (showCustomForm) {
      return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
          <div className="max-w-2xl w-full">
            <button onClick={() => setShowCustomForm(false)} className="mb-4 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回选择</button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
              <div className="text-center mb-6">
                <div className="text-4xl mb-2">✍️</div>
                <h2 className="text-xl font-bold text-gray-900">自定义对话作者</h2>
                <p className="text-sm text-gray-500 mt-1">填写作者信息，AI 会自动扮演该角色与你对话</p>
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
                  <label className="block text-sm font-semibold text-gray-700 mb-1">对应篇目 <span className="text-rose-400">*</span></label>
                  <input
                    value={customFormWork}
                    onChange={e => setCustomFormWork(e.target.value)}
                    placeholder="例如：《静夜思》、《春望》…"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">朝代（选填）</label>
                  <input
                    value={customFormDynasty}
                    onChange={e => setCustomFormDynasty(e.target.value)}
                    placeholder="例如：唐朝、宋朝、明朝…"
                    className="w-full rounded-2xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-emerald-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">简介（选填，帮助 AI 更好地扮演）</label>
                  <textarea
                    value={customFormIntro}
                    onChange={e => setCustomFormIntro(e.target.value)}
                    placeholder="例如：唐代浪漫主义诗人，号青莲居士，一生游历四方，诗风豪放飘逸…"
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
                      <span className="ml-1">正在生成个性签名…</span>
                    </span>
                  ) : '开始对话 →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    // ---- 作者选择界面 ----
    if (dialogueShowSelector) {
      return (
        <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
          <div className="max-w-2xl w-full">
            <button onClick={goHome} className="mb-4 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主页</button>

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4 text-center">
              <div className="text-4xl mb-2">🎭</div>
              <h2 className="text-2xl font-bold text-gray-900">时空对话框</h2>
              <p className="text-sm text-gray-500 mt-1">选择一位古文作者，开始跨时空对话</p>
              <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 text-xs font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                AI 驱动 · 实时对话
              </div>
            </div>

            {/* 预设作者列表 */}
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">预设作者</p>
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
                          {hasHistory && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">有记录</span>}
                        </div>
                        <p className="text-xs text-gray-500 truncate">{author.intro}</p>
                      </div>
                      <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">→</span>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* 自定义作者列表 */}
            {customAuthors.length > 0 && (
              <>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3 px-1">我的自定义作者</p>
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
                              {hasHistory && <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600 font-medium">有记录</span>}
                            </div>
                            <p className="text-xs text-gray-500 truncate">{author.intro}</p>
                          </div>
                          <span className="text-gray-300 group-hover:text-emerald-500 transition-colors">→</span>
                        </button>
                        <button
                          onClick={() => handleDeleteCustomAuthor(author.id)}
                          className="text-gray-300 hover:text-rose-400 transition-colors text-lg px-1"
                          title="删除此作者"
                        >
                          ×
                        </button>
                      </div>
                    )
                  })}
                </div>
              </>
            )}

            {/* 添加自定义作者按钮 */}
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full py-4 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-emerald-300 hover:text-emerald-600 transition-colors text-sm font-medium"
            >
              ＋ 自定义作者 / 添加其他篇目
            </button>
          </div>
        </div>
      )
    }

    // ---- 对话界面 ----
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-2xl w-full">
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => { setDialogueShowSelector(true); setDialogueDeleteMode(false); setDialogueSelectedMsgs([]) }} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 换一位作者</button>
            <div className="flex items-center gap-2">
              {dialogueDeleteMode ? (
                <>
                  <span className="text-xs text-gray-400">已选 {dialogueSelectedMsgs.length} 条</span>
                  <button
                    onClick={handleDeleteSelected}
                    disabled={dialogueSelectedMsgs.length === 0}
                    className="text-xs px-3 py-1.5 rounded-full bg-rose-500 text-white hover:bg-rose-600 transition-colors disabled:opacity-40"
                  >
                    删除所选
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
                  🗑 管理记录
                </button>
              )}
            </div>
          </div>

          {/* 标题卡片 */}
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

          {/* 对话区域 */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4 max-h-[420px] overflow-y-auto">
            {dialogueDeleteMode && (
              <div className="mb-3 p-3 rounded-xl bg-amber-50 border border-amber-100 text-xs text-amber-700 font-medium">
                点击消息可选中，选中后点击「删除所选」即可删除
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

          {/* 输入区域（删除模式下隐藏） */}
          {!dialogueDeleteMode && (
            <>
              <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex gap-2">
                <input
                  value={dialogueInput}
                  onChange={(e) => setDialogueInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                  placeholder={`问问${currentAuthorConfig.name}...`}
                  disabled={dialogueLoading}
                  className="flex-1 rounded-2xl border border-gray-200 px-4 py-2 text-sm outline-none focus:border-emerald-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={dialogueLoading || !dialogueInput.trim()}
                  className="px-4 py-2 bg-emerald-500 text-white rounded-2xl font-medium hover:bg-emerald-600 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {dialogueLoading ? '...' : '发送'}
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

  // ==================== 逻辑解谜器页面 ====================
  if (page === 'puzzle') {
    const exampleSentence = '乃使蒙恬北筑长城而守藩篱。'
    const sentenceParts: SentencePart[] = [
      { original: '乃', modern: '于是', type: 'modifier' },
      { original: '使', modern: '派遣', type: 'verb' },
      { original: '蒙恬', modern: '蒙恬（人名）', type: 'object' },
      { original: '北筑长城而守藩篱', modern: '向北修筑长城并守卫边境', type: 'other' }
    ]

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="max-w-3xl w-full">
          <button onClick={goHome} className="mb-4 text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主页</button>
          
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🧩</div>
              <h2 className="text-2xl font-bold text-gray-900">逻辑解谜器</h2>
              <p className="text-sm text-gray-500 mt-1">拆解长难句，理解语序变化，掌握语法规律</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 mb-4">
            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">原句</p>
              <p className="text-lg leading-relaxed text-gray-900 font-serif mb-4">「{exampleSentence}」</p>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">语法拆解</p>
              <div className="space-y-2">
                {sentenceParts.map((part, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                    <div className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 text-xs font-bold">{part.type === 'verb' ? '谓' : part.type === 'object' ? '宾' : part.type === 'subject' ? '主' : '其他'}</div>
                    <div className="flex-1">
                      <p className="font-serif text-lg text-gray-900">{part.original}</p>
                      <p className="text-sm text-gray-500">= {part.modern}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-500 uppercase tracking-wider font-medium mb-2">现代汉语</p>
              <p className="text-base leading-relaxed text-gray-800 bg-blue-50 p-4 rounded-xl border border-blue-100">于是派遣蒙恬向北修筑长城并守卫边疆。</p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <p className="text-sm text-yellow-800"><span className="font-bold">💡 语法规律：</span>文言文中"使+宾语+谓语"构成使役句。宾语位置比现代汉语更靠前，这是倒装的特点。</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
            <h3 className="font-bold text-gray-900 mb-4">📚 常见语法现象</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {[
                { name: '使役句', example: '使+宾语+谓语' },
                { name: '被动句', example: '被/为+主语+动词' },
                { name: '倒装句', example: '宾语前置、定语后置' },
                { name: '省略句', example: '省略主语、宾语等' }
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

  // ==================== 古风朋友圈社区页面 ====================
  if (page === 'ancient-circle') {


    // ---- 预设古人动态 ----
    const PRESET_POSTS = [
      {
        id: 1, author: '苏轼', dynasty: '北宋', emoji: '🎋',
        content: '大江东去，浪淘尽，千古风流人物。',
        work: '《念奴娇·赤壁怀古》',
        tags: ['#豁达', '#历史', '#赤壁'],
        time: '元丰五年 · 中秋夜',
        aiPersona: '你是北宋文学家苏轼，豁达乐观，即使屡遭贬谪也保持旷达心态。用第一人称回复评论，语气温和幽默，偶尔引用自己的诗词，100字以内。',
        presetComments: [
          { author: '李白', text: '子瞻兄此词气势磅礴，吾不及也！', emoji: '🍷' },
          { author: '欧阳修', text: '永叔读此词，亦感慨万千。', emoji: '🏮' },
        ],
        likes: 142, bgColor: 'from-amber-50 to-orange-50', borderColor: 'border-amber-100', textColor: 'text-amber-900',
      },
      {
        id: 2, author: '李白', dynasty: '唐', emoji: '🍷',
        content: '举头望明月，低头思故乡。',
        work: '《静夜思》',
        tags: ['#思乡', '#月亮', '#夜晚'],
        time: '天宝元年 · 深秋',
        aiPersona: '你是唐代诗人李白，豪放不羁，爱酒爱月，自称谪仙人。用第一人称回复评论，语气洒脱豪迈，偶尔提到月亮和美酒，100字以内。',
        presetComments: [
          { author: '杜甫', text: '太白兄，吾亦思念故土，读此泪下。', emoji: '🌿' },
          { author: '王维', text: '简洁而意境深远，摩诘佩服。', emoji: '🏔️' },
        ],
        likes: 238, bgColor: 'from-blue-50 to-indigo-50', borderColor: 'border-blue-100', textColor: 'text-blue-900',
      },
      {
        id: 3, author: '杜甫', dynasty: '唐', emoji: '🌿',
        content: '烽火连三月，家书抵万金。',
        work: '《春望》',
        tags: ['#忧国', '#战乱', '#思家'],
        time: '至德二年 · 春',
        aiPersona: '你是唐代诗人杜甫，忧国忧民，经历安史之乱，深知百姓疾苦。用第一人称回复评论，语气沉郁真诚，充满对国家和人民的关怀，100字以内。',
        presetComments: [
          { author: '李白', text: '子美忧国之心，令吾汗颜。', emoji: '🍷' },
          { author: '白居易', text: '读此诗，乐天亦感战乱之苦。', emoji: '📖' },
        ],
        likes: 186, bgColor: 'from-green-50 to-emerald-50', borderColor: 'border-green-100', textColor: 'text-green-900',
      },
      {
        id: 4, author: '陶渊明', dynasty: '东晋', emoji: '🌾',
        content: '采菊东篱下，悠然见南山。',
        work: '《饮酒·其五》',
        tags: ['#归隐', '#田园', '#自由'],
        time: '义熙年间 · 秋日',
        aiPersona: '你是东晋田园诗人陶渊明，不为五斗米折腰，归隐田园，淡泊名利。用第一人称回复评论，语气平和洒脱，喜欢谈论自然和自由，100字以内。',
        presetComments: [
          { author: '苏轼', text: '靖节先生此境，子瞻向往已久！', emoji: '🎋' },
          { author: '王维', text: '摩诘亦爱此等闲适，深有同感。', emoji: '🏔️' },
        ],
        likes: 203, bgColor: 'from-yellow-50 to-lime-50', borderColor: 'border-yellow-100', textColor: 'text-yellow-900',
      },
      {
        id: 5, author: '王维', dynasty: '唐', emoji: '🏔️',
        content: '独在异乡为异客，每逢佳节倍思亲。',
        work: '《九月九日忆山东兄弟》',
        tags: ['#思亲', '#重阳', '#异乡'],
        time: '开元年间 · 重阳节',
        aiPersona: '你是唐代诗人王维，精通诗画音乐，晚年信佛，号摩诘居士。用第一人称回复评论，语气温雅平静，偶尔提到佛理和山水，100字以内。',
        presetComments: [
          { author: '李白', text: '摩诘此句，道尽天下游子之心！', emoji: '🍷' },
          { author: '杜甫', text: '子美亦是异乡客，读此心有戚戚。', emoji: '🌿' },
        ],
        likes: 175, bgColor: 'from-purple-50 to-violet-50', borderColor: 'border-purple-100', textColor: 'text-purple-900',
      },
      {
        id: 6, author: '范仲淹', dynasty: '北宋', emoji: '🌊',
        content: '先天下之忧而忧，后天下之乐而乐。',
        work: '《岳阳楼记》',
        tags: ['#忧国', '#责任', '#理想'],
        time: '庆历六年 · 秋',
        aiPersona: '你是北宋政治家范仲淹，以天下为己任，多次被贬仍坚守理想。用第一人称回复评论，语气沉稳有力，充满忧国情怀和责任感，100字以内。',
        presetComments: [
          { author: '欧阳修', text: '希文兄此志，令永叔敬佩不已！', emoji: '🏮' },
          { author: '苏轼', text: '子瞻读此，深感己之不足。', emoji: '🎋' },
        ],
        likes: 312, bgColor: 'from-cyan-50 to-teal-50', borderColor: 'border-cyan-100', textColor: 'text-cyan-900',
      },
      {
        id: 7, author: '诸葛亮', dynasty: '三国·蜀汉', emoji: '🪬',
        content: '鞠躬尽瘁，死而后已。',
        work: '《后出师表》',
        tags: ['#忠义', '#北伐', '#使命'],
        time: '建兴六年 · 出征前夕',
        aiPersona: '你是三国蜀汉丞相诸葛亮，忠义智慧，一心辅佐后主北伐中原。用第一人称回复评论，语气沉稳谦逊，充满对蜀汉的忠诚，偶尔引用出师表原句，100字以内。',
        presetComments: [
          { author: '范仲淹', text: '孔明先生此志，千古楷模！', emoji: '🌊' },
          { author: '苏轼', text: '读孔明之文，子瞻肃然起敬。', emoji: '🎋' },
        ],
        likes: 289, bgColor: 'from-rose-50 to-pink-50', borderColor: 'border-rose-100', textColor: 'text-rose-900',
      },
      {
        id: 8, author: '欧阳修', dynasty: '北宋', emoji: '🏮',
        content: '醉翁之意不在酒，在乎山水之间也。',
        work: '《醉翁亭记》',
        tags: ['#山水', '#豁达', '#滁州'],
        time: '庆历六年 · 滁州',
        aiPersona: '你是北宋文学家欧阳修，号醉翁，被贬滁州时寄情山水。用第一人称回复评论，语气豁达开朗，喜欢谈论山水之乐，偶尔自嘲，100字以内。',
        presetComments: [
          { author: '苏轼', text: '永叔此句，子瞻每读必会心一笑！', emoji: '🎋' },
          { author: '范仲淹', text: '希文读此，亦感滁州山水之美。', emoji: '🌊' },
        ],
        likes: 167, bgColor: 'from-orange-50 to-red-50', borderColor: 'border-orange-100', textColor: 'text-orange-900',
      },
    ]

    // 合并预设帖子和用户帖子，用户帖子插入其中形成错落感
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

    // 分成左右两列（奇偶分配）
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

      let aiReply = '（时空信号不稳定，稍后再试）'
      if (!post.isUserPost) {
        try {
          const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkApiKey}` },
            body: JSON.stringify({
              model: aiModel,
              messages: [
                { role: 'system', content: post.aiPersona },
                { role: 'user', content: `有学生评论了你的「${post.content}」，评论内容是：「${text}」，请用你的身份回复他。` },
              ],
            }),
          })
          if (res.ok) {
            const data = await res.json()
            aiReply = data.choices?.[0]?.message?.content || aiReply
          }
        } catch {}
      } else {
        aiReply = '（这是同学发的帖子，暂不支持 AI 回复）'
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
      const authorName = postFormAuthor.trim() || '匿名同学'
      let ancientText = postFormContent.trim()

      try {
        const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkApiKey}` },
          body: JSON.stringify({
            model: aiModel,
            messages: [
              { role: 'system', content: '你是一个古文翻译助手。将用户输入的现代汉语句子翻译成简洁优美的文言文，15-30字以内，不加任何解释，只输出文言文原文。' },
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
        : ['#同学分享']

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
        dynasty: '现代',
      }

      const updatedPosts = [newPost, ...userPosts]
      setUserPosts(updatedPosts)
      try { localStorage.setItem('user_posts', JSON.stringify(updatedPosts)) } catch {}
      setPostFormContent('')
      setPostFormAuthor('')
      setPostFormTags('')
      setPostFormConverting(false)
      setShowPostForm(false)

      // 触发古人延迟回复（发帖后 3-10 秒内陆续收到 2-3 位古人评论）
      const ANCIENT_COMMENTERS = [
        { name: '苏轼', emoji: '🎋', persona: '你是北宋文学家苏轼，豁达幽默，喜欢用诗词表达感想。' },
        { name: '李白', emoji: '🍷', persona: '你是唐代诗人李白，豪放不羁，喜欢用浪漫的方式评论。' },
        { name: '杜甫', emoji: '🌿', persona: '你是唐代诗人杜甫，忧国忧民，评论充满真情实感。' },
        { name: '陶渊明', emoji: '🌾', persona: '你是东晋诗人陶渊明，淡泊洒脱，喜欢从自然角度评论。' },
        { name: '王维', emoji: '🏔️', persona: '你是唐代诗人王维，温雅平静，评论充满禅意。' },
        { name: '范仲淹', emoji: '🌊', persona: '你是北宋政治家范仲淹，以天下为己任，评论充满责任感。' },
        { name: '欧阳修', emoji: '🏮', persona: '你是北宋文学家欧阳修，豁达开朗，评论风趣有文采。' },
        { name: '诸葛亮', emoji: '🪬', persona: '你是三国蜀汉丞相诸葛亮，智慧沉稳，评论充满哲理。' },
      ]
      // 随机选 2-3 位古人
      const shuffled = [...ANCIENT_COMMENTERS].sort(() => Math.random() - 0.5)
      const selectedCommenters = shuffled.slice(0, Math.random() > 0.5 ? 3 : 2)
      const postId = newPost.id
      const postContent = ancientText
      const postOriginal = postFormContent.trim()

      selectedCommenters.forEach((commenter, idx) => {
        const delay = 3000 + idx * (2000 + Math.random() * 2000)
        setTimeout(async () => {
          let replyText = `${commenter.name}路过，深有同感。`
          try {
            const res = await fetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${arkApiKey}` },
              body: JSON.stringify({
                model: aiModel,
                messages: [
                  { role: 'system', content: commenter.persona + ' 用第一人称，以古文作者身份评论同学的朋友圈动态，语气亲切自然，20-40字以内，可带一点文言文风格但要让中学生看懂，不要加任何前缀说明。' },
                  { role: 'user', content: `一位同学发了一条朋友圈，原话是「${postOriginal}」，转成古文是「${postContent}」，请你评论一下。` },
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
                  <span className="text-xs text-gray-400">{post.dynasty || '现代'}</span>
                  {post.isUserPost && <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-600 font-medium">同学</span>}
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

            {/* 标签 */}
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {post.tags.map((tag: string, i: number) => (
                  <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">{tag}</span>
                ))}
              </div>
            )}

            {/* 预设古人评论（预设帖子） */}
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

            {/* 古人延迟回复（用户帖子） */}
            {post.isUserPost && post.ancientReplies && post.ancientReplies.length > 0 && (
              <div className="bg-amber-50 rounded-xl px-3 py-2 mb-2 space-y-1.5 border border-amber-100">
                <p className="text-xs text-amber-500 font-medium mb-1">✨ 古人来评论了</p>
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
                <p className="text-xs text-gray-400 text-center">⏳ 古人正在赶来评论…</p>
              </div>
            )}

            {/* 点赞 + 评论 */}
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
                <span>{comments.length > 0 ? `${comments.length}` : '评论'}</span>
              </button>
            </div>
          </div>

          {/* 评论区 */}
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
                  placeholder={`和${post.author}说点什么…`}
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
                  ) : '发'}
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
          {/* 顶部导航 */}
          <div className="flex items-center justify-between mb-5">
            <button onClick={goHome} className="text-gray-400 hover:text-gray-700 text-sm transition-colors font-medium">← 返回主页</button>
            <div className="text-center">
              <h1 className="text-lg font-bold text-gray-900">古风朋友圈</h1>
              <p className="text-xs text-gray-400">古人也发朋友圈</p>
            </div>
            <button
              onClick={() => setShowPostForm(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500 text-white rounded-xl text-sm font-medium hover:bg-emerald-600 transition-colors"
            >
              <span>✏️</span>
              <span>发帖</span>
            </button>
          </div>

          {/* 发帖弹窗 */}
          {showPostForm && (
            <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-xl">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-bold text-gray-900">✏️ 发一条古风动态</h2>
                  <button onClick={() => setShowPostForm(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">你想说什么？（现代话也行，AI 帮你转古文）</label>
                    <textarea
                      value={postFormContent}
                      onChange={e => setPostFormContent(e.target.value)}
                      placeholder="例如：今天考试考砸了，心情很郁闷…"
                      rows={3}
                      className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400 resize-none"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">你的名字（选填）</label>
                    <input
                      value={postFormAuthor}
                      onChange={e => setPostFormAuthor(e.target.value)}
                      placeholder="匿名同学"
                      className="w-full rounded-2xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1 block">标签（选填，用逗号分隔）</label>
                    <input
                      value={postFormTags}
                      onChange={e => setPostFormTags(e.target.value)}
                      placeholder="例如：思乡, 考试, 努力"
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
                      <span className="ml-1">AI 正在转换古文…</span>
                    </span>
                  ) : '✨ 转成古文并发布'}
                </button>
                <p className="text-xs text-gray-400 text-center mt-2">AI 会将你的话转成文言文风格后发布</p>
              </div>
            </div>
          )}

          {/* 双列瀑布流 */}
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
            以上古人内容由 AI 扮演生成，仅供学习参考
          </div>
        </div>
      </div>
    )
  }

  // ==================== 文言知识库页面 ====================
  if (page === 'knowledge') {
    const [selectedKnowledge, setSelectedKnowledge] = useState<ChineseKnowledgeItem | null>(chineseKnowledge[0])

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 顶部栏 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between p-4">
          <button onClick={() => setPage('home')} className="text-lg">←</button>
          <h1 className="text-xl font-bold text-gray-900">文言知识库</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-2xl mx-auto p-4 space-y-4">
            {/* 知识类别筛选 */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {(['polysemy', 'semantic-shift', 'borrowed-char'] as const).map((type) => (
                <button
                  key={type}
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedKnowledge?.type === type
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => {
                    const filtered = chineseKnowledge.find(k => k.type === type)
                    if (filtered) setSelectedKnowledge(filtered)
                  }}
                >
                  {type === 'polysemy' ? '一词多义' : type === 'semantic-shift' ? '古今异义' : '通假字'}
                </button>
              ))}
            </div>

            {/* 知识条目列表 */}
            <div className="space-y-3">
              {chineseKnowledge.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSelectedKnowledge(item)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedKnowledge?.id === item.id
                      ? 'border-indigo-400 bg-indigo-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="font-bold text-lg text-gray-900">{item.word}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {item.type === 'polysemy' ? '一词多义' : item.type === 'semantic-shift' ? '古今异义' : '通假字'}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 详情展示 */}
        {selectedKnowledge && (
          <div className="border-t border-gray-100 bg-white p-4 max-w-2xl mx-auto w-full">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{selectedKnowledge.word}</h2>
            <div className="space-y-4">
              {selectedKnowledge.meanings.map((m, idx) => (
                <div key={idx} className="bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl p-4 border border-indigo-100">
                  <p className="font-bold text-indigo-900 mb-2">{m.meaning}</p>
                  <div className="bg-white rounded-lg p-3 mb-2 border border-indigo-100">
                    <p className="text-sm italic text-gray-700">「{m.example}」</p>
                    <p className="text-xs text-gray-500 mt-1">— {m.source}</p>
                  </div>
                  <div className="text-sm text-gray-700">
                    <p><span className="font-medium text-amber-700">古义：</span>{m.ancient}</p>
                    <p><span className="font-medium text-cyan-700">今义：</span>{m.modern}</p>
                  </div>
                  {m.meaning.includes('图') && <div className="mt-2 text-gray-500 text-xs">🖼️ 暂未上传</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  // ==================== 修辞手法库页面 ====================
  if (page === 'rhetoric') {
    const [selectedRhetoric, setSelectedRhetoric] = useState<RhetoricalDevice | null>(rhetoricalDevices[0])
    const [expandedIdx, setExpandedIdx] = useState<number | null>(0)

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 顶部栏 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between p-4">
          <button onClick={() => setPage('home')} className="text-lg">←</button>
          <h1 className="text-xl font-bold text-gray-900">修辞手法库</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4">
            {/* 手法卡片列表 */}
            <div className="space-y-3 mb-6">
              {rhetoricalDevices.map((device) => (
                <button
                  key={device.id}
                  onClick={() => {
                    setSelectedRhetoric(device)
                    setExpandedIdx(0)
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedRhetoric?.id === device.id
                      ? 'border-teal-400 bg-teal-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="font-bold text-lg text-gray-900">{device.name}</div>
                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{device.description}</div>
                </button>
              ))}
            </div>

            {/* 详情展示 */}
            {selectedRhetoric && (
              <div className="bg-white rounded-2xl border border-teal-100 overflow-hidden">
                <div className="bg-gradient-to-r from-teal-50 to-cyan-50 p-6 border-b border-teal-100">
                  <h2 className="text-3xl font-bold text-teal-900">{selectedRhetoric.name}</h2>
                  <p className="text-teal-700 mt-2">{selectedRhetoric.description}</p>
                </div>

                <div className="p-6 space-y-4">
                  {selectedRhetoric.examples.map((example, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-xl p-4 border border-teal-200">
                      <button
                        onClick={() => setExpandedIdx(expandedIdx === idx ? null : idx)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-serif text-base text-gray-900 italic">「{example.text}」</p>
                            <p className="text-xs text-gray-500 mt-1">— {example.source}</p>
                          </div>
                          <div className="ml-2 text-lg">{expandedIdx === idx ? '▼' : '▶'}</div>
                        </div>
                      </button>

                      {expandedIdx === idx && (
                        <div className="mt-3 pt-3 border-t border-teal-200">
                          <p className="text-sm text-gray-700">{example.explanation}</p>
                          {example.image && <div className="mt-2 text-gray-500 text-xs">🖼️ {example.image}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==================== 篇章结构与写作页面 ====================
  if (page === 'structure') {
    const [selectedStructure, setSelectedStructure] = useState<ChapterStructure | null>(chapterStructures[0])
    const [expandedExample, setExpandedExample] = useState<number | null>(0)

    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        {/* 顶部栏 */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between p-4">
          <button onClick={() => setPage('home')} className="text-lg">←</button>
          <h1 className="text-xl font-bold text-gray-900">篇章结构与写作</h1>
          <div className="w-6"></div>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-4xl mx-auto p-4">
            {/* 结构卡片列表 */}
            <div className="space-y-3 mb-6">
              {chapterStructures.map((structure) => (
                <button
                  key={structure.id}
                  onClick={() => {
                    setSelectedStructure(structure)
                    setExpandedExample(0)
                  }}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-colors ${
                    selectedStructure?.id === structure.id
                      ? 'border-fuchsia-400 bg-fuchsia-50'
                      : 'border-gray-100 bg-white hover:border-gray-200'
                  }`}
                >
                  <div className="font-bold text-lg text-gray-900">{structure.name}</div>
                  <div className="text-sm text-gray-600 mt-1 line-clamp-2">{structure.description}</div>
                </button>
              ))}
            </div>

            {/* 详情展示 */}
            {selectedStructure && (
              <div className="bg-white rounded-2xl border border-fuchsia-100 overflow-hidden">
                <div className="bg-gradient-to-r from-fuchsia-50 to-pink-50 p-6 border-b border-fuchsia-100">
                  <h2 className="text-3xl font-bold text-fuchsia-900">{selectedStructure.name}</h2>
                  <p className="text-fuchsia-700 mt-2">{selectedStructure.description}</p>
                  <div className="mt-3 inline-block bg-white px-3 py-1 rounded-full text-sm text-fuchsia-900 border border-fuchsia-200">
                    <span className="font-medium">作用：</span>{selectedStructure.purpose}
                  </div>
                </div>

                <div className="p-6 space-y-4">
                  {selectedStructure.examples.map((example, idx) => (
                    <div key={idx} className="bg-gradient-to-br from-fuchsia-50 to-pink-50 rounded-xl p-4 border border-fuchsia-200">
                      <button
                        onClick={() => setExpandedExample(expandedExample === idx ? null : idx)}
                        className="w-full text-left"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-serif text-base text-gray-900 italic line-clamp-2">「{example.text}」</p>
                            <p className="text-xs text-gray-500 mt-1">— {example.source}</p>
                          </div>
                          <div className="ml-2 text-lg">{expandedExample === idx ? '▼' : '▶'}</div>
                        </div>
                      </button>

                      {expandedExample === idx && (
                        <div className="mt-3 pt-3 border-t border-fuchsia-200">
                          <div className="text-sm text-gray-700 mb-2">
                            <p className="font-medium text-fuchsia-900 mb-1">全文或段落：</p>
                            <p className="italic text-gray-800 py-2 px-2 bg-white rounded border border-fuchsia-100">「{example.text}」</p>
                          </div>
                          <div className="text-sm text-gray-700">
                            <p className="font-medium text-fuchsia-900 mb-1">结构分析：</p>
                            <p>{example.analysis}</p>
                          </div>
                          {example.image && <div className="mt-2 text-gray-500 text-xs">🖼️ {example.image}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ==================== 成绩单 ====================
  if (page === 'result') {
    const total = filteredQuestions.length
    const pct = Math.round((score / total) * 100)
    const tabLabel = quizMode === 'grammar' ? '句式结构专练' : activeTab === 'all' ? '全部题型' : activeTab === 'vocab' ? '词义辨析' : activeTab === 'sentence' ? '特殊句式' : '拆句理解'
    return (
      <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
        <div className="bg-white rounded-3xl p-10 shadow-sm max-w-md w-full border border-gray-100 text-center">
          <div className="text-6xl mb-6">{pct === 100 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h2
            className="text-3xl font-black text-gray-900 mb-2"
            style={{ fontFamily: "'Noto Serif SC', serif" }}
          >
            {pct === 100 ? '完美！' : pct >= 60 ? '不错！' : '继续加油！'}
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
              返回主页
            </button>
            <button
              onClick={() => { setCurrentIndex(0); setScore(0); setPage('quiz'); setSelectedOption(null); setHasAnswered(false) }}
              className="py-3 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors font-bold text-white"
            >
              再来一次
            </button>
          </div>
        </div>
      </div>
    )
  }

  // ==================== 答题界面 ====================

  return (
    <div className="min-h-screen bg-[#fafaf8] flex flex-col items-center justify-center p-4" style={{ fontFamily: "'Noto Sans SC', sans-serif" }}>
      {/* 顶部进度条 */}
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

      {/* 词义题 */}
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
                {selectedOption === currentQuestion.correctAnswer ? '答对了！' : `正确答案：${currentQuestion.correctAnswer}`}
              </div>
              <p className="text-gray-500 text-xs text-center mb-4 px-2 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-base font-bold text-white"
              >
                {currentIndex + 1 < filteredQuestions.length ? '下一题 →' : '查看成绩'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 句式题 */}
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
                {selectedOption === currentQuestion.correctAnswer ? '答对了！' : `正确答案：${currentQuestion.correctAnswer}`}
              </div>
              <p className="text-gray-500 text-xs text-center mb-4 px-2 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-base font-bold text-white"
              >
                {currentIndex + 1 < filteredQuestions.length ? '下一题 →' : '查看成绩'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* 拆句题 */}
      {currentQuestion.type === 'parse' && (
        <div className="bg-white rounded-3xl p-8 shadow-sm max-w-lg w-full border border-gray-100">
          <div className="bg-gray-50 rounded-2xl p-5 mb-6 border border-gray-100">
            <p className="text-gray-400 text-xs mb-4 uppercase tracking-wider font-medium">句子结构拆解</p>
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
                {selectedOption === currentQuestion.correctAnswer ? '答对了！' : `正确答案：${currentQuestion.correctAnswer}`}
              </div>
              <p className="text-gray-500 text-xs text-center mb-4 px-2 leading-relaxed">{currentQuestion.explanation}</p>
              <button
                onClick={handleNext}
                className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-600 transition-colors text-base font-bold text-white"
              >
                {currentIndex + 1 < filteredQuestions.length ? '下一题 →' : '查看成绩'}
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
                  placeholder="如: doubao-seed-2-0-pro-260215"
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