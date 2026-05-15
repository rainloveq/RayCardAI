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

// 角色變身類 — 保留樣貌，換上不同造型
export const CHARACTER_STYLES = [
  {
    id: 'festival-character',
    label: '節日角色',
    category: '角色變身類',
    prompt: 'Keep the face identical. Transform this person into a festive character wearing holiday-themed outfit and accessories, celebrating with joy and warmth. Cheerful atmosphere with soft lighting.',
  },
  {
    id: 'professional',
    label: '職業造型',
    category: '角色變身類',
    prompt: 'Keep the face identical. Transform this person into a professional with appropriate career attire and setting. Confident pose, workplace background. Clean and polished look.',
  },
  {
    id: 'cultural',
    label: '文化造型',
    category: '角色變身類',
    prompt: 'Keep the face identical. Transform this person into a traditional cultural attire look with authentic ethnic clothing and accessories. Rich cultural details, elegant composition.',
  },
  {
    id: 'fantasy-world',
    label: '幻想世界',
    category: '角色變身類',
    prompt: 'Keep the face identical. Transform this person into a fantasy world character — magical outfit, enchanted surroundings, mystical lighting. Dreamy and whimsical atmosphere.',
  },
  {
    id: 'childhood',
    label: '童年版本',
    category: '角色變身類',
    prompt: 'Keep the face identical but younger. Transform this person into a childhood version of themselves — youthful features, playful expression, nostalgic warm tones. Cute and heartwarming.',
  },
  {
    id: 'anime-footballer',
    label: '日本運動番',
    category: '角色變身類',
    prompt: 'Keep the face identical. Transform this person into a Japanese sports anime character — dynamic action pose, anime-style shading, team jersey, intense determined expression, stadium background. Energetic and passionate.',
  },
  {
    id: 'anime-idol',
    label: '虛擬偶像',
    category: '角色變身類',
    prompt: 'Keep the face identical. Transform this person into a virtual idol with colorful anime-inspired outfit, glowing stage lighting, and charismatic performer presence. Vibrant and futuristic.',
  },
  {
    id: 'shin-chan',
    label: '蠟筆小新',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into Crayon Shin-chan style — chunky cute proportions, simple bold outlines, bright solid colors, playful mischievous expression. Classic Japanese cartoon aesthetic, funny and heartwarming.',
  },
  {
    id: 'mario',
    label: '馬里奧',
    category: '遊戲角色',
    prompt: 'Keep the face identical. Transform this person into Super Mario game style — iconic red cap and blue overalls, bright Nintendo-inspired colors, playful Mushroom Kingdom background with coins and question blocks. Fun pixel-art inspired aesthetic.',
  },
  {
    id: 'princess',
    label: '公主造型',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into a beautiful princess — elegant flowing gown, sparkling tiara, fairy-tale castle background, soft magical glow. Disney-inspired royal aesthetic, graceful and enchanting.',
  },
  {
    id: 'dragonball',
    label: '龍珠戰士',
    category: '遊戲角色',
    prompt: 'Keep the face identical. Transform this person into a Dragon Ball Z fighter — orange martial arts gi, spiky anime hair, dynamic battle stance, glowing energy aura. Classic Akira Toriyama art style, powerful and intense.',
  },
  {
    id: 'onepiece',
    label: '海賊王',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into One Piece pirate style — straw hat, pirate outfit, ocean adventure background with ship and waves. Eiichiro Oda-inspired art style, adventurous and free-spirited.',
  },
  {
    id: 'doraemon',
    label: '多啦A夢',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into Doraemon cartoon style — cute rounded features, simple clean lines, bright pastel colors, friendly expression. Classic Fujiko F. Fujio aesthetic, nostalgic and warm, with iconic gadgets nearby.',
  },
  {
    id: 'sailormoon',
    label: '美少女戰士',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into Sailor Moon magical girl style — elegant sailor fuku uniform, flowing ribbons, sparkling transformation effects, crescent moon motifs. 90s shoujo anime aesthetic, graceful and powerful.',
  },
  {
    id: 'pokemon',
    label: '精靈訓練員',
    category: '遊戲角色',
    prompt: 'Keep the face identical. Transform this person into a Pokémon trainer — iconic red cap and jacket, Poké Ball in hand, cute starter Pokémon companion nearby. Bright adventurous colors, Pokémon game art style, cheerful and determined.',
  },
  {
    id: 'hello-kitty',
    label: 'Hello Kitty',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into Hello Kitty Sanrio style — soft pink and white color palette, cute adorable aesthetic, signature red bow, pastel dreamy background. Kawaii Japanese character design, sweet and charming.',
  },
  {
    id: 'superhero',
    label: '超級英雄',
    category: '遊戲角色',
    prompt: 'Keep the face identical. Transform this person into a superhero — dramatic cape, bold emblem on chest, dynamic heroic pose, cinematic city skyline background. Marvel/DC comic book style, powerful and inspiring, epic lighting.',
  },
  {
    id: 'harrypotter',
    label: '哈利波特巫師',
    category: '遊戲角色',
    prompt: 'Keep the face identical. Transform this person into a Hogwarts wizard — black robes, house scarf, holding a wand with magical sparkles, castle interior background. Harry Potter magical world aesthetic, mysterious and enchanting.',
  },
  {
    id: 'spy-family',
    label: '間諜家家酒',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into Spy x Family style — elegant spy suit or dress, clean anime art style, sophisticated urban background. Tatsuya Endo-inspired aesthetic, stylish and charming family vibe.',
  },
  {
    id: 'hunter-x-hunter',
    label: '全職獵人',
    category: '卡通角色',
    prompt: 'Keep the face identical. Transform this person into Hunter × Hunter style — green hunter jacket or battle outfit, Nen aura glowing around hands, Hunter Association badge, adventurous world background. Yoshihiro Togashi-inspired art style, determined and cool, with signature Hisoka/Killua/Gon vibe.',
  },
  {
    id: 'custom-character',
    label: '自訂造型 ✏️',
    category: '角色變身類',
    prompt: 'Keep the face identical. Custom transformation: ',
  },
];

// 藝術插畫類 — 轉換畫風
export const ILLUSTRATION_STYLES = [
  {
    id: 'anime',
    label: '日式動漫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a Japanese anime illustration. Clean delicate linework, soft shading, natural colors, cinematic lighting. Avoid exaggerated features. High quality anime film style. Keep the face recognizable and natural.',
  },
  {
    id: 'watercolor',
    label: '水彩插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a watercolor painting. Soft brush strokes, color bleeding, light and airy feeling. Keep identity recognizable. High quality, clean composition, not overly stylized.',
  },
  {
    id: '3d-cartoon',
    label: '3D卡通',
    category: '藝術插畫類',
    prompt: 'Transform into stylized 3D cartoon, soft rounded features, toy-like appearance, simplified facial features, expressive but natural. Keep the face recognizable and natural. High quality, clean composition, warm and polished.',
  },
  {
    id: 'chibi',
    label: 'Q版公仔',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a chibi cartoon character. Big head, small body, soft colors, cute but clean design. Keep identity recognizable. High quality, clean composition, not overly stylized.',
  },
  {
    id: 'sketch',
    label: '簡筆素描',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a pencil sketch portrait. Fine lines, shading details, realistic hand-drawn style. Keep the face recognizable and natural. High quality, clean composition.',
  },
  {
    id: 'flat-illustration',
    label: '扁平插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a flat illustration style. Clean vector-like shapes, solid colors, minimal shading, modern and stylish. Keep the face recognizable and natural. High quality composition.',
  },
  {
    id: 'warm-illustration',
    label: '溫暖插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a warm illustration style. Soft golden tones, cozy atmosphere, gentle lighting. Keep the face recognizable and natural. High quality, heartwarming composition.',
  },
  {
    id: 'children-book',
    label: '童書插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a children book illustration style. Whimsical, storybook feel, soft pastel colors, magical and charming. Keep the face recognizable and natural. High quality composition.',
  },
  {
    id: 'pastel',
    label: '粉彩插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a pastel illustration. Soft powdery colors, gentle transitions, dreamy and delicate. Keep the face recognizable and natural. High quality, clean composition.',
  },
  {
    id: 'bold-brush',
    label: '粗筆插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a bold brush illustration. Thick expressive strokes, strong textures, artistic and vibrant. Keep the face recognizable. High quality composition.',
  },
  {
    id: 'line-art',
    label: '線條插畫',
    category: '藝術插畫類',
    prompt: 'Transform this photo into a line art illustration. Clean and delicate linework, thin and slightly hand-drawn lines, minimal details, elegant and modern. Keep the face recognizable.',
  },
  {
    id: 'custom-illustration',
    label: '自訂風格 ✏️',
    category: '藝術插畫類',
    prompt: 'Custom art style: ',
  },
];

export const FESTIVAL_DECORATIONS: Record<string, string[]> = {
  birthday: ['蛋糕', '氣球', '蠟燭', '彩帶', '禮物盒', '派對帽', '煙花', '彩紙屑'],
  christmas: ['聖誕樹', '雪花', '聖誕老人', '禮物盒', '彩燈', '冬青葉', '拐杖糖', '鈴鐺'],
  newyear: ['煙花', '香檳杯', '彩帶', '氣球', '星星', '倒數數字', '派對帽', '彩紙屑'],
  lunarnewyear: ['燈籠', '揮春', '煙花', '紅包', '桃花', '橘子', '中國結', '舞獅'],
  easter: ['復活蛋', '復活兔', '小雞', '花籃', '彩帶', '蝴蝶', '春天的花', '草地'],
  halloween: ['南瓜燈', '幽靈', '蝙蝠', '蜘蛛網', '黑貓', '女巫帽', '骷髏', '月亮'],
  graduation: ['畢業帽', '畢業證書', '書本', '星星', '彩帶', '氣球', '花束', '獎牌'],
  baby: ['奶瓶', '玩具熊', '小鞋', '星星', '月亮', '雲朵', '奶嘴', '小推車'],
  retirement: ['棕櫚樹', '日落', '帆船', '書本', '高爾夫球', '相機', '旅行', '酒杯'],
  other: ['星星', '心形', '花', '蝴蝶', '絲帶', '氣球', '光芒', '彩帶'],
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
