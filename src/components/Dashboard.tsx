// 导入React的核心库和钩子
import { useState, useEffect } from 'react';
// 导入framer-motion库，用于实现动画效果
import { motion, type Variants } from 'framer-motion';
// 从lucide-react库导入图标组件
import { Activity, MessageSquare, Command, Users, Power, RefreshCw, Trash2, FileText, Sparkles } from 'lucide-react';
// 导入自定义的Button组件
import { Button } from './ui/button';
// 导入sonner库的toast函数，用于显示通知
import { toast } from 'sonner';
// 导入语言上下文钩子，用于国际化
import { useLanguage } from '../i18n/LanguageContext';
import { useLogs, LogLevel, LogEntry } from '../logs/LogContext';

// 每日引言数据
const dailyQuotes = [
  // 科技与设计
  { text: "简单是终极的复杂", author: "达芬奇", en: "Simplicity is the ultimate sophistication." },
  { text: "未来已来，只是分布不均", author: "威廉·吉布森", en: "The future is already here, it's just not evenly distributed." },
  { text: "设计不仅是外观，更是工作原理", author: "史蒂夫·乔布斯", en: "Design is not just what it looks like, design is how it works." },
  { text: "代码如诗，优雅永存", author: "佚名", en: "Code is poetry." },
  { text: "创新区分领导者与追随者", author: "史蒂夫·乔布斯", en: "Innovation distinguishes between a leader and a follower." },
  { text: "唯一不变的是变化本身", author: "赫拉克利特", en: "The only constant is change." },
  { text: "技术的目的是让生活更美好", author: "佚名", en: "Technology should make life better." },
  { text: "AI不是为了取代人类，而是增强人类", author: "佚名", en: "AI is not about replacing humans, but augmenting them." },
  { text: "细节决定成败", author: "查尔斯·伊姆斯", en: "The details are not the details. They make the design." },
  { text: "少即是多", author: "密斯·凡德罗", en: "Less is more." },
  { text: "好的设计是显而易见的，伟大的设计是透明的", author: "乔·斯帕诺", en: "Good design is obvious. Great design is transparent." },
  { text: "任何足够先进的技术都与魔法无异", author: "亚瑟·克拉克", en: "Any sufficiently advanced technology is indistinguishable from magic." },
  { text: "完美不是没有可添加的，而是没有可删除的", author: "安托万·德·圣埃克苏佩里", en: "Perfection is achieved not when there is nothing more to add, but when there is nothing left to take away." },
  { text: "数据是新的石油", author: "克莱夫·洪比", en: "Data is the new oil." },
  { text: "在混乱中寻找秩序", author: "佚名", en: "Find order in chaos." },
  
  // 成长类
  { text: "路是走出来的，不是等出来的", author: "李大钊", en: "The road is made by walking, not by waiting." },
  { text: "成长就是不断发现自己以前是个傻子的过程", author: "鲁迅", en: "Growth is the process of constantly discovering that you were a fool before." },
  { text: "不必害怕跌倒，重要的是跌倒后能再站起来", author: "稻盛和夫", en: "Don't be afraid of falling, what matters is getting back up." },
  { text: "你今天的努力，是明天幸运的伏笔", author: "佚名", en: "Today's effort is tomorrow's luck in the making." },
  { text: "真正的进步，是优于过去的自己", author: "海明威", en: "True progress is being better than your former self." },
  { text: "别让任何人消耗你内心的晴朗", author: "佚名", en: "Don't let anyone consume your inner sunshine." },
  { text: "成长不是变得完美，而是学会接纳不完美的自己", author: "卡尔·罗杰斯", en: "Growth is not about becoming perfect, but accepting your imperfect self." },
  { text: "每一次挫折，都是通往成功的必经之路", author: "爱迪生", en: "Every setback is a necessary path to success." },
  { text: "你若盛开，蝴蝶自来；你若精彩，天自安排", author: "三毛", en: "Bloom where you are, and butterflies will come." },
  { text: "人生没有白走的路，每一步都算数", author: "李宗盛", en: "Every step in life counts, none is wasted." },
  { text: "别在该奋斗的年纪，选择了安逸", author: "李嘉诚", en: "Don't choose comfort in the age when you should strive." },
  { text: "成长的意义，是拥有更多选择的权利", author: "罗翔", en: "The meaning of growth is having more choices." },
  { text: "慢慢来，谁不是摸着石头过河呢？", author: "佚名", en: "Take it slow, we're all crossing the river by feeling the stones." },
  { text: "知识是用来解决问题的，不是用来囤积的", author: "费曼", en: "Knowledge is for solving problems, not hoarding." },
  { text: "敢于尝试，才有可能找到属于自己的路", author: "乔布斯", en: "Only by daring to try can you find your own path." },
  { text: "别纠结过去，别焦虑未来，专注当下就好", author: "佚名", en: "Don't dwell on the past, don't worry about the future, focus on now." },
  { text: "所谓成长，就是把哭声调成静音的过程", author: "佚名", en: "Growth is the process of muting your tears." },
  { text: "你不需要很厉害才能开始，但你需要开始才能变得很厉害", author: "佚名", en: "You don't need to be great to start, but you need to start to be great." },
  { text: "困难像弹簧，你强它就弱，你弱它就强", author: "佚名", en: "Difficulties are like springs - the stronger you are, the weaker they become." },
  { text: "成长路上，最大的敌人是自己的惰性", author: "苏格拉底", en: "On the path of growth, laziness is your biggest enemy." },
  { text: "每一次坚持，都在为未来的自己铺路", author: "佚名", en: "Every persistence paves the way for your future self." },
  { text: "别害怕迷茫，迷茫是找到方向的前奏", author: "刘同", en: "Don't fear confusion, it's the prelude to finding direction." },
  { text: "学习不是任务，而是让自己保持清醒的方式", author: "周国平", en: "Learning is not a task, but a way to stay awake." },
  { text: "真正的成长，是学会对自己负责", author: "弗洛姆", en: "True growth is learning to be responsible for yourself." },
  { text: "别跟别人比，跟自己的昨天比就好", author: "佚名", en: "Don't compare with others, compare with your yesterday." },
  { text: "成长需要勇气，更需要日复一日的坚持", author: "稻盛和夫", en: "Growth requires courage and day-to-day persistence." },
  { text: "你今天的选择，决定了明天的样子", author: "佚名", en: "Today's choices shape tomorrow's reality." },
  { text: "别让犹豫消耗你，想做就立刻行动", author: "马云", en: "Don't let hesitation consume you, act on your thoughts." },
  { text: "成长就是不断打破自己的舒适区", author: "尼采", en: "Growth is constantly breaking out of your comfort zone." },
  { text: "没有谁的人生一帆风顺，低谷时更要咬牙坚持", author: "任正非", en: "No one's life is smooth sailing, persist harder in the valleys." },
  { text: "知识改变命运，努力成就未来", author: "佚名", en: "Knowledge changes destiny, effort shapes the future." },
  { text: "别抱怨环境，能改变的只有自己", author: "卡耐基", en: "Don't complain about the environment, you can only change yourself." },
  { text: "成长的本质，是认知的不断升级", author: "李善友", en: "The essence of growth is continuous cognitive upgrade." },
  { text: "每一次失败，都是在排除一个错误答案", author: "爱迪生", en: "Every failure is eliminating one wrong answer." },
  { text: "别急于求成，慢慢来反而比较快", author: "丰子恺", en: "Don't rush for success, slow and steady wins the race." },
  { text: "你对生活的态度，决定了生活对你的温度", author: "佚名", en: "Your attitude toward life determines life's attitude toward you." },
  { text: "成长路上，别忘了偶尔停下来看看风景", author: "林徽因", en: "On the path of growth, remember to pause and enjoy the scenery." },
  { text: "别让别人的评价，定义你的人生", author: "巴菲特", en: "Don't let others' opinions define your life." },
  { text: "真正的强大，是能接纳自己的脆弱", author: "荣格", en: "True strength is accepting your own vulnerability." },
  { text: "你现在偷的懒，都会变成未来的坑", author: "佚名", en: "The laziness you indulge now becomes tomorrow's pit." },
  
  // 心态类
  { text: "心态对了，一切就都对了", author: "佚名", en: "When your mindset is right, everything falls into place." },
  { text: "乐观的人，总能在黑暗中找到光", author: "丘吉尔", en: "Optimists always find light in the darkness." },
  { text: "别为打翻的牛奶哭泣，过去的就让它过去", author: "卡耐基", en: "Don't cry over spilled milk, let the past be past." },
  { text: "你无法改变天气，但可以改变心情", author: "佚名", en: "You can't change the weather, but you can change your mood." },
  { text: "心大了，事就小了；心小了，事就大了", author: "星云大师", en: "A big heart makes problems small, a small heart makes them big." },
  { text: "与其抱怨，不如改变；与其焦虑，不如行动", author: "佚名", en: "Instead of complaining, change; instead of worrying, act." },
  { text: "平静的湖面练不出精悍的水手", author: "列别捷夫", en: "Calm seas don't make skilled sailors." },
  { text: "别让坏情绪，耽误了你的好时光", author: "佚名", en: "Don't let bad emotions ruin your good times." },
  { text: "真正的快乐，源于内心的平和", author: "庄子", en: "True happiness comes from inner peace." },
  { text: "焦虑的本质，是想太多而做太少", author: "佚名", en: "Anxiety is thinking too much and doing too little." },
  { text: "接纳所有的不完美，才是完整的人生", author: "叔本华", en: "Accepting all imperfections makes a complete life." },
  { text: "你怎么看待世界，世界就怎么看待你", author: "张德芬", en: "How you see the world is how the world sees you." },
  { text: "别跟自己较劲，放过自己才能活得轻松", author: "佚名", en: "Don't be hard on yourself, let go to live lightly." },
  { text: "心态好的人，运气都不会太差", author: "佚名", en: "People with good mindsets have good luck." },
  { text: "烦恼就像灰尘，扫掉了就干净了", author: "林清玄", en: "Worries are like dust, sweep them away and you're clean." },
  { text: "与其纠结结果，不如享受过程", author: "泰戈尔", en: "Instead of worrying about results, enjoy the process." },
  { text: "别让别人的错误，惩罚自己的心情", author: "佚名", en: "Don't punish your mood for others' mistakes." },
  { text: "内心强大的人，从不害怕孤独", author: "尼采", en: "The strong at heart never fear solitude." },
  { text: "简单点，糊涂点，开心点，日子就会好过点", author: "佚名", en: "Be simple, be carefree, be happy, and life gets better." },
  { text: "心态决定状态，状态决定结果", author: "佚名", en: "Mindset determines state, state determines results." },
  { text: "别为还没发生的事担忧", author: "佚名", en: "Don't worry about things that haven't happened yet." },
  { text: "快乐不是拥有得多，而是计较得少", author: "李嘉诚", en: "Happiness is not having more, but caring less." },
  { text: "能控制情绪的人，才能控制人生", author: "亚里士多德", en: "Those who control emotions control their lives." },
  { text: "换个角度看问题，烦恼会变成转机", author: "佚名", en: "Change your perspective, and troubles become opportunities." },
  { text: "别让焦虑偷走你的专注力", author: "乔布斯", en: "Don't let anxiety steal your focus." },
  { text: "心态积极的人，总能在困境中找到机会", author: "稻盛和夫", en: "Positive people find opportunities in difficulties." },
  { text: "别把自己看得太重，也别把自己看得太轻", author: "佚名", en: "Don't think too highly or too lowly of yourself." },
  { text: "真正的平静，是接纳所有的无常", author: "弘一法师", en: "True peace is accepting all impermanence." },
  { text: "烦恼都是自找的，想通了就没事了", author: "佚名", en: "Worries are self-inflicted, understand and they're gone." },
  { text: "乐观是一种能力，也是一种选择", author: "罗素", en: "Optimism is both an ability and a choice." },
  { text: "别让过去的遗憾，影响未来的精彩", author: "佚名", en: "Don't let past regrets affect future brilliance." },
  { text: "内心越丰盈，越不需要外界的认可", author: "周国平", en: "The richer your inner world, the less you need external validation." },
  { text: "心态放宽，人生处处是晴天", author: "佚名", en: "With a broad mindset, life is sunny everywhere." },
  { text: "与其羡慕别人，不如做好自己", author: "柏拉图", en: "Instead of envying others, be your best self." },
  { text: "别纠结于小事，浪费自己的精力", author: "卡耐基", en: "Don't waste energy on trivial matters." },
  { text: "真正的幸福，是内心的满足", author: "孔子", en: "True happiness is inner contentment." },
  { text: "心态好的人，能把平凡的日子过成诗", author: "佚名", en: "People with good mindsets turn ordinary days into poetry." },
  { text: "别让坏脾气，毁掉你的好人缘", author: "佚名", en: "Don't let a bad temper ruin good relationships." },
  { text: "接纳自己的不完美，才能遇见更好的自己", author: "卡尔·罗杰斯", en: "Accept your imperfections to meet a better you." },
  { text: "心态对了，困难也会变成垫脚石", author: "佚名", en: "With the right mindset, difficulties become stepping stones." },
  
  // 行动类
  { text: "行动是治愈恐惧的良药", author: "马克·吐温", en: "Action is the antidote to fear." },
  { text: "想做的事就立刻去做，别等'有空'", author: "佚名", en: "Do what you want now, don't wait for 'someday'." },
  { text: "再伟大的梦想，也需要一步步落地", author: "马云", en: "Even the greatest dreams need to be grounded step by step." },
  { text: "光有想法不够，关键是付出行动", author: "乔布斯", en: "Ideas alone aren't enough, action is key." },
  { text: "拖延会偷走你的时间，行动才能创造价值", author: "佚名", en: "Procrastination steals time, action creates value." },
  { text: "别等准备好了再开始", author: "雷军", en: "Don't wait until you're ready to start." },
  { text: "行动不一定有结果，但不行动一定没结果", author: "佚名", en: "Action may not guarantee results, but inaction guarantees none." },
  { text: "每天进步一点点，日积月累就是大改变", author: "稻盛和夫", en: "A little progress each day leads to big changes." },
  { text: "想一万次，不如做一次", author: "佚名", en: "Thinking 10,000 times is not as good as doing it once." },
  { text: "行动的速度，决定了成功的速度", author: "比尔·盖茨", en: "The speed of action determines the speed of success." },
  { text: "别为自己的懒惰找借口，行动才是硬道理", author: "佚名", en: "Don't make excuses for laziness, action is what matters." },
  { text: "目标再远大，也要从眼前的小事做起", author: "列宁", en: "No matter how big the goal, start with small things." },
  { text: "行动起来，才能摆脱焦虑和迷茫", author: "刘同", en: "Take action to overcome anxiety and confusion." },
  { text: "别让'明天'，变成'等永远'", author: "佚名", en: "Don't let 'tomorrow' become 'never'." },
  { text: "只有行动，才能让想法变成现实", author: "爱迪生", en: "Only action can turn ideas into reality." },
  { text: "拖延的本质，是对自己的不负责任", author: "佚名", en: "Procrastination is irresponsibility to yourself." },
  { text: "想到就做，别让犹豫耽误了你的人生", author: "巴菲特", en: "Think and do, don't let hesitation delay your life." },
  { text: "行动的过程，比结果更重要", author: "泰戈尔", en: "The process of action is more important than the result." },
  { text: "别停留在'想'的阶段，'做'才是关键", author: "佚名", en: "Don't stay in the 'thinking' stage, 'doing' is key." },
  { text: "再难的事，只要开始做，就已经成功了一半", author: "佚名", en: "No matter how hard, starting means you're halfway there." },
  { text: "行动能解决90%的烦恼", author: "佚名", en: "Action solves 90% of worries." },
  { text: "别让计划永远停在纸上，落地才是真本事", author: "稻盛和夫", en: "Don't let plans stay on paper, execution is the real skill." },
  { text: "立刻行动，是打败拖延的最好方法", author: "卡耐基", en: "Immediate action is the best way to beat procrastination." },
  { text: "没有行动的梦想，只是空想", author: "佚名", en: "Dreams without action are just fantasies." },
  { text: "每天做一点，离目标就近一点", author: "佚名", en: "Do a little each day, get closer to your goal." },
  { text: "行动起来，才能看到希望", author: "鲁迅", en: "Take action to see hope." },
  { text: "别害怕失败，行动中的失败更有价值", author: "马斯克", en: "Don't fear failure, failing while acting is more valuable." },
  { text: "想改变现状，就从当下的第一个行动开始", author: "佚名", en: "To change your situation, start with the first action now." },
  { text: "行动的人，永远比观望的人先看到结果", author: "佚名", en: "Those who act always see results before those who watch." },
  { text: "别让'没时间'成为借口，时间是挤出来的", author: "鲁迅", en: "Don't use 'no time' as an excuse, time is made." },
  { text: "只有付出行动，才能获得回报", author: "李嘉诚", en: "Only through action can you get returns." },
  { text: "行动起来，才能发现自己的潜力", author: "佚名", en: "Take action to discover your potential." },
  { text: "别等别人催促，主动行动才是成长的开始", author: "佚名", en: "Don't wait for others to push you, proactive action is growth." },
  { text: "再小的行动，也比不行动强", author: "佚名", en: "Even the smallest action beats inaction." },
  { text: "行动的意义，在于让自己不断向前走", author: "周国平", en: "The meaning of action is to keep moving forward." },
  { text: "别让恐惧阻止你行动", author: "佚名", en: "Don't let fear stop you from taking action." },
  { text: "目标需要行动来支撑，否则就是空谈", author: "柏拉图", en: "Goals need action to support them, or they're just talk." },
  { text: "行动起来，才能让人生更有掌控感", author: "佚名", en: "Take action to gain more control over your life." },
  { text: "别拖延到明天，今天能做的事就今天做", author: "富兰克林", en: "Don't put off till tomorrow what you can do today." },
  { text: "行动，是实现一切可能的前提", author: "佚名", en: "Action is the prerequisite for all possibilities." },
  
  // 生活类
  { text: "生活最好的状态，是既有烟火气，又有小诗意", author: "佚名", en: "Life's best state is having both fireworks and poetry." },
  { text: "日子是过出来的，不是想出来的", author: "林清玄", en: "Days are lived, not imagined." },
  { text: "生活不需要太复杂，简单点，快乐就会多一点", author: "丰子恺", en: "Life doesn't need complexity, simplicity brings more joy." },
  { text: "别为了赶路，忘了欣赏沿途的风景", author: "佚名", en: "Don't rush so fast you forget to enjoy the scenery." },
  { text: "生活的美好，藏在每一个平凡的瞬间里", author: "汪曾祺", en: "Life's beauty hides in every ordinary moment." },
  { text: "好好吃饭，好好睡觉，好好生活", author: "佚名", en: "Eat well, sleep well, live well." },
  { text: "生活就像一杯茶，平淡中自有回甘", author: "佚名", en: "Life is like tea, subtle sweetness in simplicity." },
  { text: "别让生活的压力，偷走你对生活的热爱", author: "佚名", en: "Don't let life's pressure steal your love for life." },
  { text: "用心感受生活，就能发现藏在细节里的美好", author: "朱自清", en: "Feel life with your heart to find beauty in details." },
  { text: "生活没有标准答案，适合自己的就是最好的", author: "佚名", en: "Life has no standard answer, what suits you is best." },
  { text: "偶尔放慢脚步，才能更好地感受生活的温度", author: "佚名", en: "Slow down occasionally to better feel life's warmth." },
  { text: "生活的意义，在于把每一个今天都过得有价值", author: "罗素", en: "Life's meaning is making every today valuable." },
  { text: "别抱怨生活的苦，因为总有甜在等着你", author: "佚名", en: "Don't complain about bitterness, sweetness is waiting." },
  { text: "生活就像一面镜子，你对它笑，它就对你笑", author: "萨克雷", en: "Life is a mirror, smile at it and it smiles back." },
  { text: "用心经营生活，生活才会给你想要的回馈", author: "佚名", en: "Nurture life with heart, and it will give back." },
  { text: "好好生活，慢慢相遇，一切都是最好的安排", author: "佚名", en: "Live well, meet slowly, everything is the best arrangement." },
  { text: "生活就像一场旅行，重要的是沿途的风景和心情", author: "佚名", en: "Life is a journey, what matters is the scenery and mood." },
  { text: "别让生活的琐碎，磨灭你对生活的热情", author: "佚名", en: "Don't let trivialities wear down your enthusiasm for life." },
  { text: "生活的幸福，在于珍惜眼前拥有的一切", author: "佚名", en: "Life's happiness is cherishing what you have now." },
  { text: "用心过好每一天，就是对生活最好的尊重", author: "佚名", en: "Living each day well is the best respect for life." },
  
  // 人际关系类
  { text: "真心换真心，你对别人好，别人才会对你好", author: "佚名", en: "Sincerity for sincerity, treat others well to be treated well." },
  { text: "朋友不在多，真心就好", author: "佚名", en: "Friends don't need to be many, just sincere." },
  { text: "尊重别人，就是尊重自己", author: "笛卡尔", en: "Respecting others is respecting yourself." },
  { text: "别轻易评价别人，你不知道别人经历过什么", author: "卡耐基", en: "Don't judge easily, you don't know what others have been through." },
  { text: "好的关系，是互相滋养，不是互相消耗", author: "周国平", en: "Good relationships nourish, not drain each other." },
  { text: "与人相处，多一点理解，少一点计较", author: "佚名", en: "In relationships, more understanding, less calculation." },
  { text: "真诚是最好的社交技巧，没有之一", author: "巴菲特", en: "Sincerity is the best social skill, bar none." },
  { text: "别把别人的好当成理所当然，要懂得感恩", author: "佚名", en: "Don't take others' kindness for granted, be grateful." },
  { text: "与人相处，保持适当的距离，才能长久", author: "叔本华", en: "Maintain proper distance in relationships for longevity." },
  { text: "真正的友谊，经得起时间和距离的考验", author: "亚里士多德", en: "True friendship withstands time and distance." },
  { text: "与人相处，多一点包容，少一点挑剔", author: "佚名", en: "Be more tolerant, less critical in relationships." },
  { text: "好的关系，是彼此成就，不是互相拖累", author: "稻盛和夫", en: "Good relationships elevate, not drag each other down." },
  { text: "与人相处，学会倾听，比会说更重要", author: "卡耐基", en: "Listening is more important than talking." },
  { text: "真正的朋友，会指出你的缺点", author: "孔子", en: "True friends point out your flaws." },
  { text: "与人相处，多一点真诚，少一点套路", author: "佚名", en: "More sincerity, less scheming in relationships." },
  { text: "好的关系，是细水长流，不是轰轰烈烈", author: "佚名", en: "Good relationships are steady streams, not fireworks." },
  { text: "与人相处，懂得换位思考，才能减少矛盾", author: "佚名", en: "Empathy reduces conflicts in relationships." },
  { text: "真正的感情，不需要刻意维系，却能一直都在", author: "佚名", en: "True affection doesn't need maintenance, it just stays." },
  { text: "与人相处，多一点感恩，少一点抱怨", author: "佚名", en: "More gratitude, less complaining in relationships." },
  { text: "好的朋友，会和你一起成长，一起变得更好", author: "佚名", en: "Good friends grow together and become better together." },
];

// 仪表盘主组件
export function Dashboard() {
  // 使用语言上下文和日志上下文
  const { t, language } = useLanguage();
  const { logs } = useLogs();
  // 状态：系统运行时长
  const [uptime, setUptime] = useState(0);
  // 状态：每日引言，随机选择一条
  const [dailyQuote, setDailyQuote] = useState(() => {
    return dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
  });


  // 副作用钩子：每秒更新运行时长
  useEffect(() => {
    const interval = setInterval(() => {
      setUptime((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 格式化运行时长显示
  const formatUptime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (language === 'zh') {
      return `${hours}时 ${minutes}分 ${secs}秒`;
    }
    return `${hours}h ${minutes}m ${secs}s`;
  };

  // 处理重启服务的操作
  const handleRestart = async () => {
    toast.loading(language === 'zh' ? '正在重启服务...' : 'Restarting service...', { id: 'restart' });
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success(language === 'zh' ? '服务已重启' : 'Service restarted', { id: 'restart' });
  };

  // 处理清空缓存的操作
  const handleClearCache = async () => {
    toast.loading(language === 'zh' ? '正在清空缓存...' : 'Clearing cache...', { id: 'cache' });
    await new Promise(resolve => setTimeout(resolve, 1500));
    toast.success(language === 'zh' ? '缓存已清空' : 'Cache cleared', { id: 'cache' });
  };

  // 处理查看日志的操作
  const handleViewLogs = () => {
    toast.info(language === 'zh' ? '跳转到日志查看器' : 'Jump to log viewer');
  };

  // 刷新每日引言
  const refreshQuote = () => {
    const newQuote = dailyQuotes[Math.floor(Math.random() * dailyQuotes.length)];
    setDailyQuote(newQuote);
  };


  // 容器动画变体
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1 // 子元素交错动画
      }
    }
  };

  // 列表项动画变体
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  };

  return (
    <div className="h-full overflow-auto p-8">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 style={{ fontSize: '2rem', fontWeight: 700 }}>{t.dashboard.title}</h1>
          <p className="text-muted-foreground mt-2">{language === 'zh' ? '欢迎回来，系统运行正常' : 'Welcome back, system running normally'}</p>
        </motion.div>

        {/* 小组件网格布局 */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
          initial="hidden"
          animate="show"
        >
          {/* 机器人状态卡片 */}
          <motion.div className="glass-card p-6 space-y-4" variants={itemVariants}>
            {/* 卡片标题 */}
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.dashboard.systemStatus}</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>

            {/* 状态显示 */}
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-success/20 border-2 border-success flex items-center justify-center relative">
                <Power className="w-8 h-8 text-success" />
              </div>
              <div className="flex-1">
                <p className="text-success" style={{ fontSize: '1.125rem', fontWeight: 600 }}>{t.dashboard.online}</p>
                <p className="text-muted-foreground" style={{ fontSize: '0.875rem' }}>{language === 'zh' ? '已稳定运行' : 'Running for'} {formatUptime(uptime)}</p>
              </div>
            </div>

            {/* 详细信息 */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{language === 'zh' ? '昵称' : 'Nickname'}</p>
                <p style={{ fontWeight: 500 }}>MoFox Bot</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{language === 'zh' ? '平台' : 'Platform'}</p>
                <p style={{ fontWeight: 500 }}>QQ</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{language === 'zh' ? 'QQ号' : 'QQ Number'}</p>
                <p style={{ fontWeight: 500 }}>123456789</p>
              </div>
              <div>
                <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{language === 'zh' ? '状态码' : 'Status Code'}</p>
                <p className="text-success" style={{ fontWeight: 500 }}>200</p>
              </div>
            </div>
          </motion.div>

          {/* 核心数据卡片 */}
          <motion.div className="glass-card p-6 space-y-4" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{language === 'zh' ? '核心数据' : 'Core Metrics'}</h3>
              <MessageSquare className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)] hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-muted-foreground">{language === 'zh' ? '今日处理消息' : 'Messages Today'}</span>
                </div>
                <span className="text-primary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>1,247</span>
              </div>

              <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)] hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-secondary/20 flex items-center justify-center">
                    <Command className="w-5 h-5 text-secondary" />
                  </div>
                  <span className="text-muted-foreground">{language === 'zh' ? '今日执行命令' : 'Commands Today'}</span>
                </div>
                <span className="text-secondary" style={{ fontSize: '1.5rem', fontWeight: 700 }}>342</span>
              </div>

              <div className="flex items-center justify-between p-4 glass rounded-[var(--radius)] hover:border-primary/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-success/20 flex items-center justify-center">
                    <Users className="w-5 h-5 text-success" />
                  </div>
                  <span className="text-muted-foreground">{language === 'zh' ? '当前互动用户' : 'Active Users'}</span>
                </div>
                <span className="text-success" style={{ fontSize: '1.5rem', fontWeight: 700 }}>89</span>
              </div>
            </div>
          </motion.div>

          {/* 快速操作卡片 */}
          <motion.div className="glass-card p-6 space-y-4" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.dashboard.quickActions}</h3>
              <Power className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-3">
              <Button
                onClick={handleRestart}
                className="w-full justify-start gap-3 glass-hover h-auto py-4 px-4 bg-primary/10 border border-primary/30 hover:border-primary text-foreground"
              >
                <RefreshCw className="w-5 h-5 text-primary" />
                <span>{t.dashboard.restartBot}</span>
              </Button>

              <Button
                onClick={handleClearCache}
                className="w-full justify-start gap-3 glass-hover h-auto py-4 px-4 bg-warning/10 border border-warning/30 hover:border-warning text-foreground"
              >
                <Trash2 className="w-5 h-5 text-warning" />
                <span>{t.dashboard.clearCache}</span>
              </Button>

              <Button
                onClick={handleViewLogs}
                className="w-full justify-start gap-3 glass-hover h-auto py-4 px-4 bg-secondary/10 border border-secondary/30 hover:border-secondary text-foreground"
              >
                <FileText className="w-5 h-5 text-secondary" />
                <span>{language === 'zh' ? '查看完整日志' : 'View Full Logs'}</span>
              </Button>
            </div>

            {/* 每日引言 */}
            <div className="pt-3 mt-3 border-t border-border relative">
              <div className="absolute -top-6 -right-6 w-48 h-48 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-[80px] pointer-events-none" />
              
              <div className="relative flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-primary" />
                  <h4 style={{ fontSize: '0.8125rem', fontWeight: 600 }}>{t.dashboard.dailyQuote}</h4>
                </div>
                
                <Button
                  onClick={refreshQuote}
                  variant="ghost"
                  size="icon"
                  className="glass-hover hover:border-primary/50 hover:text-primary shrink-0 h-7 w-7"
                  title={t.dashboard.refresh}
                >
                  <RefreshCw className="w-3 h-3" />
                </Button>
              </div>
              
              <motion.div
                key={dailyQuote.text}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="relative"
              >
                <p className="text-foreground mb-1" style={{ fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 }}>
                  {dailyQuote.text}
                </p>
                <p className="text-muted-foreground mb-1.5" style={{ fontSize: '0.75rem', fontStyle: 'italic', lineHeight: 1.3 }}>
                  {dailyQuote.en}
                </p>
                <p className="text-primary" style={{ fontSize: '0.75rem', fontWeight: 500 }}>
                  — {dailyQuote.author}
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* 最近活动卡片 */}
          <motion.div className="glass-card p-6 space-y-4" variants={itemVariants}>
            <div className="flex items-center justify-between">
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>{t.dashboard.recentLogs}</h3>
              <Activity className="w-5 h-5 text-primary" />
            </div>

            <div className="space-y-3 max-h-[300px] overflow-auto">
              {logs.slice(-10).reverse().map((log, index) => (
                <motion.div
                  key={log.id}
                  className="flex gap-3 p-3 glass rounded-[var(--radius)] hover:border-primary/30 transition-all"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.08, duration: 0.3 }}
                  whileHover={{ x: 2, transition: { duration: 0.15 } }}
                >
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
                    log.level === 'SUCCESS' ? 'bg-success' :
                    log.level === 'WARN' ? 'bg-warning' :
                    log.level === 'ERROR' ? 'bg-error' :
                    'bg-primary'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="truncate" title={log.message}>{log.message}</p>
                    <p className="text-muted-foreground" style={{ fontSize: '0.75rem' }}>{log.timestamp}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
