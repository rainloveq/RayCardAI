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

// 背景主題 — 保留真人原圖，只換背景和裝飾
export const BACKGROUND_STYLES = [
  {
    id: 'shin-chan',
    label: '蠟筆小新',
    prompt: 'Crayon Shin-chan themed background — Nohara family living room, bright cartoon colors, playful Japanese home setting with toys and snacks.',
  },
  {
    id: 'mario',
    label: '馬里奧',
    prompt: 'Super Mario Mushroom Kingdom background — colorful blocks, gold coins, green pipes, blue sky with clouds, fun Nintendo game world.',
  },
  {
    id: 'princess',
    label: '公主童話',
    prompt: 'Fairytale princess castle background — elegant ballroom with chandeliers, rose petals, golden sparkles, magical royal atmosphere.',
  },
  {
    id: 'dragonball',
    label: '龍珠',
    prompt: 'Dragon Ball Z battlefield background — rocky terrain, glowing orange sky, energy aura effects, dramatic anime scene.',
  },
  {
    id: 'onepiece',
    label: '海賊王',
    prompt: 'One Piece pirate ship background — wooden deck, ocean waves, treasure chest, Jolly Roger flag, blue sea and sky.',
  },
  {
    id: 'doraemon',
    label: '多啦A夢',
    prompt: 'Doraemon cartoon background — Nobita room with desk and window, cute gadgets, soft pastel colors, nostalgic Japanese home.',
  },
  {
    id: 'sailormoon',
    label: '美少女戰士',
    prompt: 'Sailor Moon magical background — crescent moon, sparkling stars, pink and blue cosmic space, elegant crystal palace.',
  },
  {
    id: 'pokemon',
    label: '精靈訓練員',
    prompt: 'Pokémon world background — green meadow, Poké Ball pattern, cute starter Pokémon silhouettes, bright blue sky, grassy field.',
  },
  {
    id: 'hello-kitty',
    label: 'Hello Kitty',
    prompt: 'Hello Kitty Sanrio background — soft pink room, bows and ribbons, cute pastel decorations, fluffy clouds and hearts.',
  },
  {
    id: 'superhero',
    label: '超級英雄',
    prompt: 'Superhero city skyline background — dramatic sunset, skyscrapers, comic book halftone dots, epic cinematic lighting.',
  },
  {
    id: 'harrypotter',
    label: '哈利波特',
    prompt: 'Hogwarts castle background — grand hall with floating candles, house banners, magical bookshelves, warm fireplace glow.',
  },
  {
    id: 'spy-family',
    label: '間諜家家酒',
    prompt: 'Spy x Family elegant background — sophisticated European city street, classy café, warm sunset lighting, stylish anime aesthetic.',
  },
  {
    id: 'hunter-x-hunter',
    label: '全職獵人',
    prompt: 'Hunter × Hunter adventure background — Greed Island landscape, ruins and forests, Nen energy glow, mysterious ancient ruins.',
  },
  {
    id: 'festival-character',
    label: '節日背景',
    prompt: 'Festive celebration background — holiday decorations, warm lighting, cheerful atmosphere with seasonal ornaments and colors.',
  },
  {
    id: 'professional',
    label: '職場背景',
    prompt: 'Professional office background — modern workspace, clean desk, natural window light, sophisticated corporate atmosphere.',
  },
  {
    id: 'cultural',
    label: '傳統文化',
    prompt: 'Traditional cultural background — classic architecture, lanterns, elegant silk fabrics, rich heritage atmosphere.',
  },
  {
    id: 'fantasy-world',
    label: '幻想世界',
    prompt: 'Fantasy world background — floating islands, magical forest, glowing crystals, ethereal lighting, dreamy enchanted realm.',
  },
  {
    id: 'childhood',
    label: '童年回憶',
    prompt: 'Nostalgic childhood background — playground, warm afternoon sun, retro toys, soft golden light, heartwarming atmosphere.',
  },
  {
    id: 'anime-footballer',
    label: '日本運動番',
    prompt: 'Japanese sports anime background — bright stadium, team banners, dramatic lighting, energetic shounen art style, action lines.',
  },
  {
    id: 'anime-idol',
    label: '虛擬偶像',
    prompt: 'Virtual idol stage background — glowing concert stage, neon lights, colorful spotlights, futuristic J-pop vibe.',
  },
  {
    id: 'custom-background',
    label: '自訂背景 ✏️',
    prompt: 'Custom background: ',
  },
];

// 角色扮演 — 保留樣貌，換上角色造型（全卡通風格）
export const CHARACTER_STYLES = [
  {
    id: 'shin-chan',
    label: '蠟筆小新',
    prompt: 'Keep the face identical. Dress this person as Crayon Shin-chan — red shirt, yellow shorts, chunky cute cartoon style, playful expression. Transform the entire image into cartoon.',
  },
  {
    id: 'mario',
    label: '馬里奧',
    prompt: 'Keep the face identical. Dress this person as Mario — red cap, blue overalls, Mushroom Kingdom background with coins and blocks. Full Nintendo cartoon style.',
  },
  {
    id: 'princess',
    label: '公主童話',
    prompt: 'Keep the face identical. Dress this person as a fairytale princess — elegant gown, sparkling tiara, castle background. Disney-style cartoon illustration.',
  },
  {
    id: 'dragonball',
    label: '龍珠',
    prompt: 'Keep the face identical. Dress this person as Dragon Ball Z fighter — orange gi, spiky hair, energy aura. Akira Toriyama anime style.',
  },
  {
    id: 'onepiece',
    label: '海賊王',
    prompt: 'Keep the face identical. Dress this person as One Piece pirate — straw hat, pirate coat, ocean ship. Eiichiro Oda anime style.',
  },
  {
    id: 'doraemon',
    label: '多啦A夢',
    prompt: 'Keep the face identical. Dress this person in Doraemon cartoon style — cute rounded features, bright colors, gadgets nearby. Fujiko F. Fujio style.',
  },
  {
    id: 'sailormoon',
    label: '美少女戰士',
    prompt: 'Keep the face identical. Dress as Sailor Moon — sailor fuku, flowing ribbons, magic sparkles. 90s shoujo anime style.',
  },
  {
    id: 'pokemon',
    label: '精靈訓練員',
    prompt: 'Keep the face identical. Dress as Pokémon trainer — red cap, Poké Ball, starter companion. Pokémon game art style.',
  },
  {
    id: 'hello-kitty',
    label: 'Hello Kitty',
    prompt: 'Keep the face identical. Sanrio Hello Kitty style — pink white palette, red bow, kawaii aesthetic, pastel dreamy background.',
  },
  {
    id: 'superhero',
    label: '超級英雄',
    prompt: 'Keep the face identical. Dress as superhero — cape, emblem, heroic pose, city skyline. Comic book style.',
  },
  {
    id: 'harrypotter',
    label: '哈利波特',
    prompt: 'Keep the face identical. Dress as Hogwarts wizard — black robes, wand, castle hall. Magical illustration style.',
  },
  {
    id: 'spy-family',
    label: '間諜家家酒',
    prompt: 'Keep the face identical. Spy x Family style — elegant spy suit, clean anime art, urban background.',
  },
  {
    id: 'hunter-x-hunter',
    label: '全職獵人',
    prompt: 'Keep the face identical. Hunter × Hunter style — green jacket, Nen aura, adventure anime art. Togashi style.',
  },
  {
    id: 'festival-character',
    label: '節日造型',
    prompt: 'Keep the face identical. Dress in festive holiday outfit with seasonal accessories, cheerful cartoon illustration style.',
  },
  {
    id: 'fantasy-world',
    label: '幻想角色',
    prompt: 'Keep the face identical. Transform into fantasy character — magical robes, enchanted staff, mystical background. RPG game art style.',
  },
  {
    id: 'anime-idol',
    label: '虛擬偶像',
    prompt: 'Keep the face identical. Virtual idol style — colorful anime outfit, glowing stage, futuristic J-pop vibe.',
  },
  {
    id: 'custom-character',
    label: '自訂造型 ✏️',
    prompt: 'Keep the face identical. Custom transformation: ',
  },
];

// 藝術畫風 — 整張圖轉換畫風（人物 + 背景一同轉換）
export const ILLUSTRATION_STYLES = [
  {
    id: 'anime',
    label: '日式動漫',
    prompt: 'Transform the ENTIRE image into Japanese anime illustration — clean linework, soft shading, cinematic lighting. Preserve the person appearance faithfully in anime style.',
  },
  {
    id: 'watercolor',
    label: '水彩插畫',
    prompt: 'Transform the ENTIRE image into watercolor painting — soft brush strokes, color bleeding, light airy feeling. Preserve the person appearance faithfully.',
  },
  {
    id: '3d-cartoon',
    label: '3D卡通',
    prompt: 'Transform the ENTIRE image into 3D Pixar-style cartoon — soft rounded features, toy-like appearance. Preserve the person faithfully in 3D cartoon style.',
  },
  {
    id: 'chibi',
    label: 'Q版公仔',
    prompt: 'Transform the ENTIRE image into chibi style — big head, small body, soft colors, cute clean design. Preserve the person faithfully as a chibi character.',
  },
  {
    id: 'sketch',
    label: '簡筆素描',
    prompt: 'Transform the ENTIRE image into pencil sketch portrait — fine lines, shading details, hand-drawn style. Preserve the person faithfully in sketch style.',
  },
  {
    id: 'flat-illustration',
    label: '扁平插畫',
    prompt: 'Transform the ENTIRE image into flat illustration — clean vector shapes, solid colors, minimal shading. Preserve the person faithfully in flat art style.',
  },
  {
    id: 'warm-illustration',
    label: '溫暖插畫',
    prompt: 'Transform the ENTIRE image into warm illustration — soft golden tones, cozy atmosphere, gentle lighting. Preserve the person faithfully.',
  },
  {
    id: 'children-book',
    label: '童書插畫',
    prompt: 'Transform the ENTIRE image into children book illustration — whimsical storybook feel, soft pastel colors. Preserve the person faithfully.',
  },
  {
    id: 'pastel',
    label: '粉彩插畫',
    prompt: 'Transform the ENTIRE image into pastel illustration — soft powdery colors, gentle transitions, dreamy look. Preserve the person faithfully.',
  },
  {
    id: 'bold-brush',
    label: '粗筆插畫',
    prompt: 'Transform the ENTIRE image into bold brush illustration — thick expressive strokes, strong textures. Preserve the person faithfully.',
  },
  {
    id: 'line-art',
    label: '線條插畫',
    prompt: 'Transform the ENTIRE image into line art — clean delicate linework, elegant minimal style. Preserve the person faithfully.',
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
