export const CARD_TYPES = [
  { id: 'birthday', label: '生日', icon: '🎂' },
  { id: 'christmas', label: '聖誕節', icon: '🎄' },
  { id: 'lunarnewyear', label: '農曆新年', icon: '🧧' },
  { id: 'easter', label: '復活節', icon: '🐣' },
  { id: 'halloween', label: '萬聖節', icon: '🎃' },
  { id: 'graduation', label: '畢業', icon: '🎓' },
  { id: 'baby', label: 'BB出世', icon: '👶' },
  { id: 'newyear', label: '新一年', icon: '🎉' },
  { id: 'retirement', label: '退休', icon: '🌴' },
  { id: 'other', label: '其他', icon: '✨' },
];

// 角色變身類 — 保留真人樣貌，換上不同造型
export const CHARACTER_STYLES = [
  {
    id: 'shin-chan',
    label: '蠟筆小新',
    prompt: 'Keep the face identical. Dress this person as Crayon Shin-chan — red shirt, yellow shorts, chunky cute cartoon style, playful expression.',
  },
  {
    id: 'mario',
    label: '馬里奧',
    prompt: 'Keep the face identical. Dress this person as Mario — red cap, blue overalls, mustache, Mushroom Kingdom background with coins.',
  },
  {
    id: 'princess',
    label: '公主造型',
    prompt: 'Keep the face identical. Dress this person as a fairytale princess — elegant flowing gown, sparkling tiara, castle background.',
  },
  {
    id: 'dragonball',
    label: '龍珠戰士',
    prompt: 'Keep the face identical. Dress this person as a Dragon Ball Z fighter — orange gi, spiky hair, glowing energy aura, dynamic battle pose.',
  },
  {
    id: 'onepiece',
    label: '海賊王',
    prompt: 'Keep the face identical. Dress this person as a One Piece pirate — straw hat, pirate coat, ocean ship background, adventurous vibe.',
  },
  {
    id: 'doraemon',
    label: '多啦A夢',
    prompt: 'Keep the face identical. Transform into Doraemon cartoon style — cute rounded features, bright colors, friendly expression, gadgets nearby.',
  },
  {
    id: 'sailormoon',
    label: '美少女戰士',
    prompt: 'Keep the face identical. Dress as Sailor Moon — sailor fuku uniform, flowing ribbons, sparkling magic effects, 90s shoujo anime style.',
  },
  {
    id: 'pokemon',
    label: '精靈訓練員',
    prompt: 'Keep the face identical. Dress as a Pokémon trainer — red cap, Poké Ball in hand, cute starter Pokémon companion, bright adventure colors.',
  },
  {
    id: 'hello-kitty',
    label: 'Hello Kitty',
    prompt: 'Keep the face identical. Sanrio Hello Kitty style — soft pink white palette, red bow, cute kawaii aesthetic, pastel dreamy background.',
  },
  {
    id: 'superhero',
    label: '超級英雄',
    prompt: 'Keep the face identical. Dress as a superhero — dramatic cape, emblem on chest, heroic pose, cinematic city skyline, epic lighting.',
  },
  {
    id: 'harrypotter',
    label: '哈利波特巫師',
    prompt: 'Keep the face identical. Dress as a Hogwarts wizard — black robes, house scarf, magic wand with sparkles, castle interior.',
  },
  {
    id: 'spy-family',
    label: '間諜家家酒',
    prompt: 'Keep the face identical. Spy x Family style — elegant spy suit, clean anime art, sophisticated urban background.',
  },
  {
    id: 'hunter-x-hunter',
    label: '全職獵人',
    prompt: 'Keep the face identical. Hunter × Hunter style — green hunter jacket, Nen aura around hands, Hunter badge, adventurous anime art style.',
  },
  {
    id: 'festival-character',
    label: '節日造型',
    prompt: 'Keep the face identical. Dress this person in festive holiday outfit with seasonal accessories, celebrating joyfully, warm lighting.',
  },
  {
    id: 'professional',
    label: '職業造型',
    prompt: 'Keep the face identical. Dress this person in professional attire — suit, uniform, or formal wear, confident pose, workplace setting.',
  },
  {
    id: 'cultural',
    label: '傳統服飾',
    prompt: 'Keep the face identical. Dress this person in traditional cultural attire — authentic ethnic clothing, elegant details, rich heritage.',
  },
  {
    id: 'fantasy-world',
    label: '幻想世界',
    prompt: 'Keep the face identical. Transform into a fantasy character — magical outfit, enchanted surroundings, mystical lighting, dreamy atmosphere.',
  },
  {
    id: 'childhood',
    label: '童年版本',
    prompt: 'Keep the face identical but younger. Transform into childhood self — youthful features, playful expression, nostalgic warm tones.',
  },
  {
    id: 'anime-footballer',
    label: '日本運動番',
    prompt: 'Keep the face identical. Japanese sports anime style — dynamic action pose, anime shading, team jersey, stadium background.',
  },
  {
    id: 'anime-idol',
    label: '虛擬偶像',
    prompt: 'Keep the face identical. Virtual idol style — colorful anime outfit, glowing stage lights, charismatic performer presence, futuristic vibe.',
  },
  {
    id: 'custom-character',
    label: '自訂造型 ✏️',
    prompt: 'Keep the face identical. Custom transformation: ',
  },
];

// 藝術插畫類 — 轉換畫風
export const ILLUSTRATION_STYLES = [
  {
    id: 'anime',
    label: '日式動漫',
    prompt: 'Transform this photo into a Japanese anime illustration. Clean linework, soft shading, natural colors, cinematic lighting. Keep face recognizable.',
  },
  {
    id: 'watercolor',
    label: '水彩插畫',
    prompt: 'Transform this photo into a watercolor painting. Soft brush strokes, color bleeding, light airy feeling. Keep face recognizable.',
  },
  {
    id: '3d-cartoon',
    label: '3D卡通',
    prompt: 'Transform into stylized 3D cartoon — soft rounded features, toy-like Pixar appearance. Keep face recognizable.',
  },
  {
    id: 'chibi',
    label: 'Q版公仔',
    prompt: 'Transform this photo into a chibi character — big head, small body, soft colors, cute clean design. Keep face recognizable.',
  },
  {
    id: 'sketch',
    label: '簡筆素描',
    prompt: 'Transform this photo into a pencil sketch portrait — fine lines, shading details, realistic hand-drawn style. Keep face recognizable.',
  },
  {
    id: 'flat-illustration',
    label: '扁平插畫',
    prompt: 'Transform into flat illustration — clean vector-like shapes, solid colors, minimal shading, modern stylish. Keep face recognizable.',
  },
  {
    id: 'warm-illustration',
    label: '溫暖插畫',
    prompt: 'Transform into warm illustration — soft golden tones, cozy atmosphere, gentle lighting. Keep face recognizable.',
  },
  {
    id: 'children-book',
    label: '童書插畫',
    prompt: 'Transform into children book illustration — whimsical storybook feel, soft pastel colors, magical charm. Keep face recognizable.',
  },
  {
    id: 'pastel',
    label: '粉彩插畫',
    prompt: 'Transform into pastel illustration — soft powdery colors, gentle transitions, dreamy delicate. Keep face recognizable.',
  },
  {
    id: 'bold-brush',
    label: '粗筆插畫',
    prompt: 'Transform into bold brush illustration — thick expressive strokes, strong textures, artistic vibrant. Keep face recognizable.',
  },
  {
    id: 'line-art',
    label: '線條插畫',
    prompt: 'Transform into line art — clean delicate linework, hand-drawn thin lines, elegant minimal. Keep face recognizable.',
  },
  {
    id: 'custom-illustration',
    label: '自訂風格 ✏️',
    prompt: 'Custom art style: ',
  },
];

export const FESTIVAL_DECORATIONS: Record<string, string[]> = {
  birthday: [
    '蛋糕', '氣球', '蠟燭', '彩帶', '禮物盒', '派對帽', '煙花', '彩紙屑',
    '香檳', '皇冠', '星星', '糖果', '冰淇淋', '鮮花', '音符', '愛心',
    '杯子蛋糕', '生日快樂字', '派對喇叭', '閃粉', '馬卡龍', '巧克力', '小熊公仔',
  ],
  christmas: [
    '聖誕樹', '雪花', '聖誕老人', '禮物盒', '彩燈', '冬青葉', '拐杖糖', '鈴鐺',
    '馴鹿', '雪人', '星星', '聖誕襪', '壁爐', '絲帶', '蠟燭', '熱可可',
    '松果', '薑餅人', '槲寄生', '金色鈴鐺', '紅絲絨', '白色毛絨', '雪花燈',
  ],
  lunarnewyear: [
    '燈籠', '揮春', '煙花', '紅包', '桃花', '橘子', '中國結', '舞獅',
    '鞭炮', '金元寶', '錦鯉', '梅花', '福字', '銅錢', '如意', '龍',
    '祥雲', '扇子', '窗花剪紙', '年糕', '賀年花', '金桔樹', '大紅燈籠',
  ],
  newyear: [
    '煙花', '香檳杯', '彩帶', '氣球', '星星', '倒數數字', '派對帽', '彩紙屑',
    '時鐘', '酒杯', '螢光棒', '煙火', '金色氣球', '燈串', '喇叭', '緞帶',
    '新年快樂字', '金色星星', '水晶球', '倒數鐘', '禮炮', '流蘇', '閃燈',
  ],
  easter: [
    '復活蛋', '復活兔', '小雞', '花籃', '彩帶', '蝴蝶', '春天的花', '草地',
    '糖果', '胡蘿蔔', '鬱金香', '鳥巢', '彩虹', '百合花', '太陽', '櫻花',
    '小羊', '彩色蛋殼', '蒲公英', '綠葉', '粉紅蝴蝶結', '花環', '小兔耳',
  ],
  halloween: [
    '南瓜燈', '幽靈', '蝙蝠', '蜘蛛網', '黑貓', '女巫帽', '骷髏', '月亮',
    '糖果', '鬼屋', '吸血鬼', '木乃伊', '蠟燭', '墳墓', '烏鴉', '藥水',
    '棺材', '乾冰霧', '魔法書', '假血', '南瓜', '狼人', '閃電',
  ],
  graduation: [
    '畢業帽', '畢業證書', '書本', '星星', '彩帶', '氣球', '花束', '獎牌',
    '學位袍', '鴿子', '筆', '地球儀', '榮譽繩', '禮炮', '皇冠', '相機',
    '母校徽章', '金色紙屑', '畢業熊', '向日葵', '望遠鏡', '紀念冊', '鋼筆',
  ],
  baby: [
    '奶瓶', '玩具熊', '小鞋', '星星', '月亮', '雲朵', '奶嘴', '小推車',
    '嬰兒床', '小鴨', '積木', '圍兜', '搖鈴', '布書', '音樂盒', '粉藍絲帶',
    '可愛圖案', '小腳印', '嬰兒車', '綿羊', '玩具車', '彩虹橋', '奶瓶花束',
  ],
  retirement: [
    '棕櫚樹', '日落', '帆船', '書本', '高爾夫球', '相機', '旅行', '酒杯',
    '海灘', '釣魚竿', '望遠鏡', '地圖', '向日葵', '躺椅', '熱氣球', '郵輪',
    '咖啡', '護照', '行李箱', '花園', '鳥兒', '山水畫', '陶藝',
  ],
  other: [
    '星星', '心形', '花', '蝴蝶', '絲帶', '氣球', '光芒', '彩帶',
    '羽毛', '音符', '水滴', '月亮', '太陽', '雲朵', '寶石', '貝殼',
    '葉子', '鑽石', '煙花', '光圈', '流蘇', '蕾絲', '水彩暈染',
  ],
};

export const CARD_RATIOS = [
  { id: '3:4', label: '直向 3:4', icon: '📱', desc: '適合賀卡標準格式' },
  { id: '4:3', label: '橫向 4:3', icon: '🖥️', desc: '適合橫幅風景構圖' },
  { id: '1:1', label: '正方形 1:1', icon: '📐', desc: '適合社交媒體分享' },
];

export const TEXT_POSITIONS = [
  { id: 'bottom', label: '底部', icon: '⬇️', desc: '文字顯示在卡片下方' },
  { id: 'top', label: '頂部', icon: '⬆️', desc: '文字顯示在卡片上方' },
  { id: 'auto', label: '由AI決定', icon: '🎯', desc: 'AI 自行安排文字位置' },
];

export const COLOR_TONES = [
  { id: 'warm', label: '溫暖', icon: '☀️', desc: '暖金色調，溫馨舒適' },
  { id: 'cool', label: '冷色', icon: '❄️', desc: '藍紫色調，清新優雅' },
  { id: 'bright', label: '明亮', icon: '✨', desc: '鮮明亮麗，活力滿滿' },
  { id: 'pastel', label: '柔和', icon: '🌸', desc: '粉彩色調，溫柔夢幻' },
];

export const POINTS_PER_CARD = 10;
export const SIGNUP_BONUS = 20;

export const POINTS_PLANS = [
  { id: 'basic', name: '基礎方案', priceHKD: 28, points: 150 },
  { id: 'pro', name: '超值方案', priceHKD: 98, points: 600, popular: true },
];
