export const CARD_TYPES = [
  { id: 'birthday', label: '生日', icon: '🎂' },
  { id: 'valentine', label: '情人節', icon: '💕' },
  { id: 'lunarnewyear', label: '農曆新年', icon: '🧧' },
  { id: 'christmas', label: '聖誕節', icon: '🎄' },
  { id: 'newyear', label: '新一年', icon: '🎉' },
  { id: 'anniversary', label: '紀念日', icon: '💍' },
  { id: 'graduation', label: '畢業', icon: '🎓' },
  { id: 'baby', label: 'BB出世', icon: '👶' },
  { id: 'travel', label: '旅行', icon: '✈️' },
  { id: 'holiday', label: '放假', icon: '🏖️' },
  { id: 'offwork', label: '放工', icon: '🍻' },
  { id: 'halloween', label: '萬聖節', icon: '🎃' },
  { id: 'easter', label: '復活節', icon: '🐣' },
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
    '三層奶油蛋糕', '彩色氣球拱門', '蠟燭火光', '生日快樂橫幅', '禮物盒堆疊', '派對帽',
    '彩紙屑飄落', '香檳杯', '小皇冠', '糖果罐', '鮮花花束', '音符飄浮',
    '杯子蛋糕', '馬卡龍塔', '巧克力噴泉', '冰淇淋車', '小熊公仔', '生日卡',
    '金色星星', '緞帶蝴蝶結', '蠟燭數字', '彩虹', '派對喇叭',
  ],
  christmas: [
    '聖誕樹', '雪花紛飛', '聖誕老人', '禮物盒', '閃爍彩燈', '金色鈴鐺',
    '馴鹿', '雪人', '聖誕襪', '壁爐火焰', '拐杖糖', '薑餅人',
    '松果', '槲寄生花環', '紅絲絨緞帶', '熱可可杯', '蠟燭微光',
    '銀色星星', '冬季松枝', '白雪覆蓋', '聖誕倒數日曆', '木製雪橇',
  ],
  lunarnewyear: [
    '大紅燈籠', '揮春對聯', '煙花綻放', '紅包利是', '桃花枝', '金桔盆栽',
    '中國結', '舞獅', '鞭炮', '金元寶', '錦鯉', '梅花',
    '福字掛飾', '祥雲圖案', '銅錢', '如意', '龍形剪紙',
    '扇子', '窗花', '年糕', '水仙花', '大紅燈籠串', '賀年桔',
  ],
  newyear: [
    '煙花倒數', '香檳杯塔', '金色緞帶', '數字年份', '派對拉炮',
    '午夜時鐘', '水晶球', '螢光棒', '金色紙屑', '燈串',
    '新年快樂字', '銀色星星', '倒數計時器', '氣球雨', '酒杯碰撞',
    '煙火瀑布', '閃燈背景', '流蘇簾幕', 'DJ台', '笑臉合照',
  ],
  easter: [
    '彩繪復活蛋', '復活兔', '小雞', '花籃', '蝴蝶飛舞', '春天的花',
    '鬱金香', '鳥巢', '彩虹', '百合花', '櫻花雨', '小羊',
    '胡蘿蔔', '糖果彩蛋', '綠草地', '蒲公英', '粉紅蝴蝶結', '花環',
    '小白兔', '彩色蛋殼', '蜜蜂', '陽光灑落', '水仙花',
  ],
  halloween: [
    '南瓜燈', '小幽靈', '蝙蝠', '蜘蛛網', '黑貓', '女巫帽',
    '糖果籃', '彎月', '蠟燭', '魔法書', '藥水瓶', '烏鴉',
  ],
  graduation: [
    '畢業帽', '畢業證書', '書本堆疊', '金色彩帶', '花束', '獎牌',
    '學位袍', '白鴿飛翔', '地球儀', '榮譽繩', '畢業熊', '向日葵',
    '禮炮紙屑', '皇冠', '相機', '學校徽章', '紀念冊', '鋼筆',
    '畢業鐘聲', '氣球升空', '微笑太陽', '望遠鏡', '榮譽綬帶',
  ],
  baby: [
    '奶瓶', '玩具熊', '小鞋子', '月亮', '白雲', '奶嘴',
    '嬰兒床', '小鴨', '積木', '圍兜', '風鈴', '音樂盒',
    '小腳印', '嬰兒車', '綿羊', '彩虹橋', '粉藍絲帶', '搖鈴',
    '布書', '小星星', '氣球動物', '棉花糖雲', '天使翅膀',
  ],
  retirement: [
    '棕櫚樹', '日落海灘', '帆船', '書本', '高爾夫球', '相機',
    '旅行地圖', '望遠鏡', '向日葵', '躺椅', '熱氣球', '咖啡杯',
    '護照', '行李箱', '花園', '釣魚竿', '山水畫', '鳥兒',
    '郵輪', '陶藝', '棋盤', '紅酒杯', '夕陽剪影',
  ],
  valentine: [
    '紅玫瑰花束', '心形氣球', '巧克力禮盒', '燭光晚餐', '絲帶', '戒指盒',
    '粉色氣球', '愛心', '情書信封', '羽毛', '鑽石', '鴿子',
    '草莓', '馬卡龍', '天鵝', '玫瑰花雨', '水晶燈', '珍珠',
    '香水瓶', '音樂盒', '紅唇印', '貝殼', '蝴蝶結',
  ],
  anniversary: [
    '數字紀念', '玫瑰花環', '香檳杯', '心形燭光', '合照相框', '戒指',
    '氣球束', '禮物盒', '情書', '星光', '紅酒瓶', '珍珠',
    '燭台', '巧克力', '水晶', '天鵝', '鑽石', '花環拱門',
    '絲絨緞帶', '貝殼', '懷舊照片', '音樂盒', '流蘇',
  ],
  travel: [
    '飛機', '世界地圖', '護照', '行李箱', '相機', '太陽眼鏡',
    '棕櫚樹', '海灘', '熱氣球', '指南針', '郵輪', '火車',
    '燈塔', '帆船', '背包', '貝殼', '海鷗', '星空',
    '明信片', '冰淇淋', '日出', '衝浪板', '夏威夷花環',
  ],
  holiday: [
    '沙灘', '太陽傘', '棕櫚樹', '吊床', '雞尾酒', '游泳圈',
    '貝殼', '海鷗', '帆船', '日落', '衝浪板', '椰子',
    '躺椅', '風鈴', '燈塔', '海星', '珊瑚', '浮潛面鏡',
    '沙堡', '滑浪風帆', '草裙', '檸檬水', '烏克麗麗',
  ],
  offwork: [
    '啤酒杯', '雞尾酒', '披薩', '音樂喇叭', '派對帽', '螢光棒',
    '漢堡', '燒烤架', '卡拉OK咪', 'DJ台', '燈串', '沙發',
    '薯條', '酒杯', '桌球', '飛鏢靶', '霓虹燈', '笑臉',
    '鼓棒', '電結他', '爆谷', '骰子', '撲克牌',
  ],
  other: [
    '星星', '心形', '花', '蝴蝶', '絲帶', '光芒', '彩帶',
    '羽毛', '音符', '水滴', '月亮', '太陽', '雲朵', '寶石',
    '貝殼', '葉子', '鑽石', '煙花', '光圈', '流蘇', '蕾絲', '水彩暈染',
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
  { id: 'warm', label: '溫暖', icon: '🟠', desc: '暖金橙調，溫馨舒適' },
  { id: 'cool', label: '冷色', icon: '🔵', desc: '藍紫冰調，清新優雅' },
  { id: 'bright', label: '明亮', icon: '🟡', desc: '鮮明亮麗，活力滿滿' },
  { id: 'pastel', label: '柔和', icon: '🩷', desc: '粉彩夢幻，溫柔甜美' },
  { id: 'golden', label: '金黃', icon: '🟨', desc: '奢華金光，高貴氣派' },
  { id: 'forest', label: '森林', icon: '🟢', desc: '自然綠意，清新療癒' },
  { id: 'sunset', label: '夕陽', icon: '🟧', desc: '橙紅紫霞，浪漫迷人' },
  { id: 'ocean', label: '海洋', icon: '🩵', desc: '藍綠清涼，自由奔放' },
  { id: 'vintage', label: '復古', icon: '🟫', desc: '懷舊暖棕，經典情懷' },
  { id: 'neon', label: '霓虹', icon: '🟪', desc: '螢光炫彩，潮流電音' },
  { id: 'monochrome', label: '黑白', icon: '⬛', desc: '經典黑白，極簡高雅' },
  { id: 'candy', label: '糖果', icon: '🍬', desc: '繽紛甜美，少女心爆棚' },
];

export const GREETING_SUGGESTIONS = [
  '生日快樂 🎂', '新年快樂 🎉', '恭喜發財 🧧', '聖誕快樂 🎄',
  '我愛你 ❤️', 'I Love You 💕', '謝謝你 🙏', '夢想成真 ⭐',
  '大賺特賺 💰', '世界和平 ☮️', '身體健康 💪', '萬事如意 🍀',
  '前程似錦 🌈', '幸福美滿 🏡', '旅途愉快 ✈️', '乾杯 🍻',
  '加油 💪', '天天開心 😊', '青春常駐 🌸', '工作順利 📈',
];

export const POINTS_PER_CARD = 10;
export const SIGNUP_BONUS = 20;

export const POINTS_PLANS = [
  { id: 'basic', name: '基礎方案', priceHKD: 28, points: 150 },
  { id: 'pro', name: '超值方案', priceHKD: 98, points: 600, popular: true },
];
