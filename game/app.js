/**
 * 🏛️ 《老街時空旅人》核心遊戲邏輯與聲音系統
 */

// 1. 遊戲全域狀態
const state = {
    teamName: '',
    role: '',
    score: 0,
    hp: 100,
    inventory: {
        bakery: 0,    // 鹹光餅
        wenchang: 0,  // 智慧筆
        dizang: 0     // 平安符
    },
    unlockedStages: ['tutorial'], // 已解鎖關卡
    completedStages: [],          // 已完成關卡
    badges: [],                   // 獲得勳章
    currentGps: 'tutorial',       // 當前 GPS 模擬點
    isMuted: false,               // 音效靜音狀態
    bgmInterval: null,            // BGM 隨機生成計時器
    startTime: null,              // 遊戲開始時間
    photos: [],                   // 小隊拍照與關卡成果圖
    evidenceRecords: []           // 口述、照片與文字觀察紀錄
};

// 關卡文史資料與挑戰設定
const stagesConfig = {
    'tutorial': {
        title: "🏁 拜廟禮儀：魔法路線挑戰",
        desc: "來到新莊廟街，第一步是學會如何有禮貌地進入神明的家。傳統上進廟有『龍門進、虎門出』的規矩，且廟內有『左鐘右鼓』，你走對了嗎？",
        badge: "禮儀之星"
    },
    'temple-ciyou': {
        title: "媽祖婆的溫柔密碼",
        desc: "新莊慈祐宮是老街最古老的廟宇（建於1686年），奉祀慈悲的媽祖。這裡的建築風格華麗溫柔，大門畫有威嚴的門神守護，屋簷與角落還藏有象徵祝福的木雕！",
        badge: "慈祐守護者"
    },
    'temple-wusheng': {
        title: "關聖帝君的戰神防禦",
        desc: "新莊武聖廟是北部最早的關帝廟（建於1760年）。與溫柔的媽祖廟不同，這裡供奉霸氣的戰神關公，處處展現出男兒漢的剛毅與低調！",
        badge: "正義武聖"
    },
    'bakery': {
        title: "百年老順香的戰士乾糧",
        desc: "創立於同治年間（超過150年歷史）的老順香餅店，見證了老街的興衰。這裡有一種中間有洞、形狀像貝果的傳統點心『鹹光餅』，它與歷史上的戰爭息息相關！",
        badge: "美食調查員"
    },
    'temple-guangfu': {
        title: "廣福宮：消失的客家色彩",
        desc: "廣福宮（建於1780年）是國定古蹟，也是早期客家人開墾新莊的象徵。廟內石碑記載了當時閩粵移民的衝突。後來因閩粵械鬥，客家人外移，使這裡意外保留了最古樸的原木建築風格。",
        badge: "族群和解大使"
    },
    'temple-wenchang': {
        title: "文昌祠：魁星求功名挑戰",
        desc: "建於1813年的新莊文昌祠，是大臺北地區第一座獨立文昌廟。早期附設有林泉書院，代表新莊教育文風的興起。廟裡有隻神奇的『祿馬神』，是古代讀書人的守護者！",
        badge: "文昌狀元"
    },
    'temple-chaojiang': {
        title: "潮江寺：時空防禦瞭望台",
        desc: "潮江寺原是臨溪碼頭旁的草寮工人休息處。嘉慶年間漳泉械鬥激烈，居民將其改建為二樓瞭望台，用以監視大漢溪對岸（板橋漳州人）的動向。平息後二樓供奉觀音，一樓供奉土地公。",
        badge: "時空哨兵"
    },
    'dizang': {
        title: "地藏庵：大武眾爺與官將首",
        desc: "新莊地藏庵（大眾廟，建於1757年）主要安撫早期因械鬥、瘟疫客死異鄉的亡魂。這裡也是臺灣最著名的陣頭文化『官將首』的起源地！每年大拜拜更是地方盛事。",
        badge: "民俗小專家"
    },
    'drum': {
        title: "响仁和：擊出百年的鼓聲",
        desc: "創立於1927年的响仁和鼓藝工坊，是新莊手工製鼓技藝的代表。製鼓需要經過選皮、繃鼓、踩鼓、定音等十多道工序，鼓聲宏亮耐用，聞名海內外！",
        badge: "製鼓傳人"
    },
    'alley-theater': {
        title: "🎭 戲館巷：聽見古代的聲音",
        desc: "新莊路359巷在日治時期是布袋戲與南北管藝人聚集地，小小的巷弄內整天迴盪著學唱歌、演戲的樂聲，如同古代的流行音樂中心！",
        badge: "曲藝達人"
    },
    'alley-rice': {
        title: "🌾 米市巷：搬大米上船挑戰",
        desc: "新莊平原稻米產量豐富，新莊路387巷是當時將米糧挑運至大漢溪碼頭登船的專屬通道。巷道極為狹窄，防盜又防火，挑夫們每天都在此揮汗搬運大米。",
        badge: "大力挑夫"
    },
    'alley-water': {
        title: "🪣 挑水巷：大漢溪的生命線",
        desc: "新莊路278巷是早期新莊居民到大漢溪畔挑水飲用的主要通道。當時大漢溪水清澈，養活了整條老街的人民，但也見證了挑水夫的艱辛歲月。",
        badge: "水源守護者"
    }
};

// 關卡情境圖與進階實察任務。每一關除了原有解謎，還要留下可回顧的學習證據。
const stageMediaConfig = {
    'tutorial': { image: 'temple-etiquette.jpg', type: 'photo', prompt: '拍攝廟門，並在畫面中指出龍門、虎門與中央神道。' },
    'temple-ciyou': { image: 'ciyou-details.jpg', type: 'photo', prompt: '拍攝一個具有吉祥寓意的木雕細節，確認畫面清楚可辨識。' },
    'temple-wusheng': { image: 'wusheng-door.jpg', type: 'audio', prompt: '口述 20 秒：門釘與不設門神如何表現關公的地位？' },
    'bakery': { image: 'bakery-biscuit.jpg', type: 'text', prompt: '用至少 20 個字記錄鹹光餅造型與軍人行軍需求的關係。' },
    'temple-guangfu': { image: 'history-observation.jpg', type: 'photo', prompt: '拍攝原木構件或示禁碑，留下你判讀歷史的視覺證據。' },
    'temple-wenchang': { image: 'history-observation.jpg', type: 'audio', prompt: '口述說明「包糕粽」諧音與祿馬信仰反映的求學願望。' },
    'temple-chaojiang': { image: 'history-observation.jpg', type: 'text', prompt: '用至少 20 個字推論潮江寺為何同時具有信仰與防禦功能。' },
    'dizang': { image: 'heritage-alley.jpg', type: 'audio', prompt: '口述說明官將首與新莊大拜拜守護地方的意義。' },
    'drum': { image: 'heritage-alley.jpg', type: 'audio', prompt: '錄下三次穩定拍點，再口述製鼓定音需要注意什麼。' },
    'alley-theater': { image: 'heritage-alley.jpg', type: 'audio', prompt: '模仿一小段聽到的節奏，並口述戲館巷過去聚集哪些職人。' },
    'alley-rice': { image: 'heritage-alley.jpg', type: 'photo', prompt: '拍攝巷道寬度，讓畫面能呈現挑夫搬米時的空間限制。' },
    'alley-water': { image: 'heritage-alley.jpg', type: 'text', prompt: '用至少 20 個字比較早期挑水生活與現代自來水的差異。' }
};

// 回饋不只判斷對錯，也延伸學生剛使用的文史線索。
const stageFeedback = {
    'tutorial': {
        correct: ['你們正確辨認了龍門。面向廟宇時從右側進入，也記得中央神道通常保留給神明通行。', '鐘與鼓不只是樂器，也是廟宇空間與儀式的一部分。你們已把方向觀察和禮儀連結起來了。'],
        wrong: ['先站在面向廟宇的位置重新分辨左右，並想想中央神道為什麼不適合一般參觀者行走。']
    },
    'temple-ciyou': {
        correct: ['你們從門神與木雕找到了守護和祈福的線索。蝙蝠借用「蝠」與「福」的諧音，讓建築也能傳達祝願。', '門神負責守護入口，吊筒與蝙蝠木雕則把祝福藏進建築細節。你們不只看到裝飾，也讀出了文化意思。'],
        wrong: ['再把人物位置、兵器和廟門方向一起比較；木雕題則可以從名稱的諧音與所在位置尋找線索。']
    },
    'temple-wusheng': {
        correct: ['門釘與樸實石柱共同表現關公的尊貴和剛正。這種建築選擇，比單純的華麗裝飾更能呼應神明性格。', '你們把一百零八顆門釘和關帝信仰連在一起了。大門不畫門神，是因為關公本身就被視為威武的守護者。'],
        wrong: ['不要只用「有沒有錢」解釋建築，試著把門釘、門神和關公的身分放在一起推理。']
    },
    'bakery': {
        correct: ['你們注意到餅中央的孔洞具有實用功能。食物造型會配合行軍攜帶需求，也讓今天的點心保存了一段生活史。', '鹹光餅不只是老街美食；從繩子串餅的方式，可以看見古代軍人如何解決長途攜帶乾糧的問題。'],
        wrong: ['先不要只從現代烘焙想原因，試著想像軍人長途行軍時，雙手要做什麼、乾糧又該怎麼攜帶。']
    },
    'temple-guangfu': {
        correct: ['原木色不是單純的審美選擇，它也保留了客家移民外移與廟宇少經翻修的歷史痕跡。', '示禁碑把衝突、用水規範和官府調解刻進石頭。你們已把建築材料與族群互動放在同一條歷史線上。'],
        wrong: ['重新觀察木構件和碑文，並思考「沒有重新彩繪」可能是哪些人口與經濟變化留下的結果。']
    },
    'temple-wenchang': {
        correct: ['包、糕、粽組成「包高中」的諧音祝福，祿馬則象徵前程順利，兩者都反映讀書人對功名的期待。', '你們讀懂了求學信仰如何把食物、語言和神明結合，讓抽象願望變成可以準備與祭拜的事物。'],
        wrong: ['把三種食物名稱連續念一次，再想想祿馬的「祿」和「馬」分別象徵功名與行程中的什麼願望。']
    },
    'temple-chaojiang': {
        correct: ['潮江寺的位置靠近碼頭，樓層又適合瞭望，因此同一棟建築能先回應防衛需求，後來再承載地方信仰。', '樓上觀音、樓下土地公的配置，讓你們看見建築功能會隨地方安全、交通與信仰需求而改變。'],
        wrong: ['從「靠近河岸」、「可以看得遠」和「上下兩層供奉不同神明」三個線索重新推理。']
    },
    'dizang': {
        correct: ['官將首的兵器與陣式具有驅邪守護的象徵，也和地藏庵安撫亡魂、祈求地方平安的信仰相呼應。', '新莊大拜拜不只是熱鬧繞境，它回應了早期瘟疫、械鬥與亡魂安撫等地方共同面對的問題。'],
        wrong: ['先把官將首視為守護隊伍，再從瘟疫、亡魂與地方平安三個關鍵詞思考祭典目的。']
    },
    'drum': {
        correct: ['製鼓順序會逐步改變鼓皮張力，最後的定音必須靠耳朵和經驗反覆調整，這正是職人技藝的核心。', '你們敲出的穩定節奏不只完成遊戲，也模擬了製鼓師檢查鼓面張力與共鳴是否均勻的過程。'],
        wrong: ['想想製作材料的先後關係：要先選好鼓皮並處理表面，才能繃緊、調整張力，最後定音。']
    },
    'alley-theater': {
        correct: ['戲館巷聚集的是布袋戲與南北管職人。巷弄中的聲音，正是表演技藝透過師徒練習與戲班活動傳承的證據。', '你們從樂聲判斷出曲藝活動，說明聲音也能成為研究地方歷史的線索，而不只有文字和建築。'],
        wrong: ['再聽一次音色與節奏，判斷它比較像商人計算貨物，還是戲班排練與傳統樂器演奏。']
    },
    'alley-rice': {
        correct: ['米市巷連結稻米產地與大漢溪碼頭。狹窄空間讓你們更能想像挑夫搬運、避讓和合作的難度。', '你們把巷道尺度、稻米運輸和河港貿易連起來了，街道本身就是過去產業活動留下的證據。'],
        wrong: ['從新莊平原、河港運輸和巷名三個線索判斷，哪一種貨物最可能大量通過這裡。']
    },
    'alley-water': {
        correct: ['挑水巷提醒我們，自來水出現以前，水源距離會直接影響聚落位置、每日勞動與家庭生活。', '你們把巷道、大漢溪和居民取水連在一起了，也看見自然環境如何塑造老街的生活路線。'],
        wrong: ['想像家中沒有水龍頭時，每天必須到哪裡取水，以及這條巷子為何要通往河岸。']
    }
};

// 2. 🎵 Web Audio API 聲音合成器
let audioCtx = null;
let currentFeedbackAudio = null;
let evidenceRecorder = null;
let evidenceStream = null;
let evidenceChunks = [];

function initAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

// 播放本地音效檔案 (如果有的話，否則自動 Fallback 到模擬合成聲)
function playSound(fileName, fallbackFunc) {
    if (state.isMuted) return;
    
    // 試圖播放本地音效
    const audio = new Audio(`assets/audio/${fileName}`);
    audio.volume = 1;
    if (fileName.includes('correct') || fileName.includes('wrong')) {
        if (currentFeedbackAudio) {
            currentFeedbackAudio.pause();
            currentFeedbackAudio.currentTime = 0;
        }
        currentFeedbackAudio = audio;
    }
    audio.play().then(() => {
        console.log(`Playing audio file: ${fileName}`);
    }).catch(err => {
        console.warn(`Audio file assets/audio/${fileName} not loaded or browser blocked. Using Web Audio API fallback...`);
        // 執行 Fallback 程式合成聲音
        try {
            initAudioContext();
            if (fallbackFunc) fallbackFunc();
        } catch (e) {
            console.error("Web Audio API not supported or blocked: ", e);
        }
    });
}

// 🔊 [Fallback] 模擬木魚點擊聲
function synthClick() {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, audioCtx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, audioCtx.currentTime + 0.08);
    
    gain.gain.setValueAtTime(0.5, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.08);
    
    osc.start();
    osc.stop(audioCtx.currentTime + 0.08);
}

// 🔊 [Fallback] 模擬答錯沉悶敲擊聲 (低音悶鑼)
function synthWrong() {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.3);
    
    gain.gain.setValueAtTime(0.5, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    
    osc.start(now);
    osc.stop(now + 0.4);
}

// 🔊 [Fallback] 模擬大鼓敲擊聲 (響仁和咚咚聲)
function synthMuffledDrum() {
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(160, now);
    osc.frequency.exponentialRampToValueAtTime(40, now + 0.25);
    
    gain.gain.setValueAtTime(0.8, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    
    osc.start(now);
    osc.stop(now + 0.3);
}

// 🔊 新手關專用：模擬廟宇大鐘 (比答對磬音更大、更長、泛音更厚)
function synthTempleBell() {
    const now = audioCtx.currentTime;
    // 含基音與多個泛音（末段加入不諧泛音，營造金屬鐘體質感），總振幅 < 1 避免破音
    const partials = [
        { f: 440,  g: 0.34 }, // 基音
        { f: 880,  g: 0.24 }, // 八度
        { f: 1320, g: 0.16 }, // 五度泛音
        { f: 1760, g: 0.10 }, // 高泛音
        { f: 2640, g: 0.06 }, // 金屬感不諧泛音
    ];
    partials.forEach(p => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(p.f, now);
        gain.gain.setValueAtTime(p.g, now);
        gain.gain.exponentialRampToValueAtTime(0.0008, now + 2.8); // 比磬音長的尾韻
        osc.start(now);
        osc.stop(now + 2.9);
    });
}

// 🔊 單一大鼓敲擊 (可指定時間與音量)，供節奏排程使用
function synthDrumHitAt(when, level) {
    // 低頻鼓身：音高快速下滑製造「咚」的厚實感
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.type = 'sine';
    osc.frequency.setValueAtTime(180, when);
    osc.frequency.exponentialRampToValueAtTime(45, when + 0.25);
    gain.gain.setValueAtTime(level, when);
    gain.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
    osc.start(when);
    osc.stop(when + 0.35);

    // 敲擊瞬間的噪音 (鼓棒擊面)，增加打擊感與可聽度
    const noiseLen = 0.05;
    const buffer = audioCtx.createBuffer(1, Math.floor(audioCtx.sampleRate * noiseLen), audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const nGain = audioCtx.createGain();
    nGain.gain.setValueAtTime(level * 0.4, when);
    nGain.gain.exponentialRampToValueAtTime(0.001, when + noiseLen);
    noise.connect(nGain);
    nGain.connect(audioCtx.destination);
    noise.start(when);
    noise.stop(when + noiseLen);
}

// 🔊 新手關專用：一小段報廟大鼓節奏 (咚 — 咚-咚 — 咚)，比單擊更大聲、有層次
function synthDrumRhythm() {
    const now = audioCtx.currentTime;
    synthDrumHitAt(now + 0.00, 1.0);  // 重拍
    synthDrumHitAt(now + 0.35, 0.85);
    synthDrumHitAt(now + 0.52, 0.85);
    synthDrumHitAt(now + 0.85, 1.0);  // 收尾重拍
}

// 🔊 [Fallback] 模擬老虎怒吼聲 (警告走錯虎門)
function synthTigerRoar() {
    const now = audioCtx.currentTime;
    // 使用白雜訊與調變鋸齒波合成獸吼
    const bufferSize = audioCtx.sampleRate * 1.5;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    
    // 填充隨機白雜訊
    for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
    }
    
    const noiseNode = audioCtx.createBufferSource();
    noiseNode.buffer = buffer;
    
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(250, now);
    filter.frequency.exponentialRampToValueAtTime(60, now + 1.2);
    
    const osc = audioCtx.createOscillator();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(45, now + 1.2);
    
    const gain = audioCtx.createGain();
    
    noiseNode.connect(filter);
    osc.connect(filter);
    filter.connect(gain);
    gain.connect(audioCtx.destination);
    
    gain.gain.setValueAtTime(0.7, now);
    gain.gain.linearRampToValueAtTime(0.9, now + 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.5);
    
    noiseNode.start(now);
    osc.start(now);
    noiseNode.stop(now + 1.5);
    osc.stop(now + 1.5);
}

// 🔊 [Fallback] 模擬戲館巷傳統北管/嗩吶旋律
function synthOperaMelody() {
    const now = audioCtx.currentTime;
    // 播放一段簡單的五聲音階旋律
    const melody = [587.33, 659.25, 783.99, 880.00, 987.77, 880.00, 783.99, 587.33]; // D5, E5, G5, A5, B5...
    const duration = 0.25;
    
    melody.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'triangle'; // 類似嗩吶/竹笛的高頻感
        osc.frequency.setValueAtTime(freq, now + idx * duration);
        // 加入些微顫音 (Vibrato)
        osc.frequency.linearRampToValueAtTime(freq + 10, now + idx * duration + 0.1);
        osc.frequency.linearRampToValueAtTime(freq - 10, now + idx * duration + 0.2);
        
        gain.gain.setValueAtTime(0.0, now + idx * duration);
        gain.gain.linearRampToValueAtTime(0.3, now + idx * duration + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, now + (idx + 1) * duration);
        
        osc.start(now + idx * duration);
        osc.stop(now + (idx + 1) * duration);
    });
}

// 🎵 [Fallback] 模擬古琴《高山》背景音樂 (隨機宮商角徵羽五聲音階旋律)
function playSynthBgm() {
    if (state.isMuted) return;
    
    // 宮商角徵羽頻率 (C5, D5, E5, G5, A5)
    const pentatonic = [523.25, 587.33, 659.25, 783.99, 880.00];
    
    if (state.bgmInterval) clearInterval(state.bgmInterval);
    
    const playNote = () => {
        if (state.isMuted || state.screen !== 'game') return;
        
        initAudioContext();
        const now = audioCtx.currentTime;
        const note = pentatonic[Math.floor(Math.random() * pentatonic.length)];
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.type = 'sine'; // 古琴柔和的弦音
        osc.frequency.setValueAtTime(note, now);
        
        gain.gain.setValueAtTime(0.0, now);
        gain.gain.linearRampToValueAtTime(0.15, now + 0.1); // 柔和起音
        gain.gain.exponentialRampToValueAtTime(0.001, now + 2.5); // 長尾音衰減
        
        osc.start(now);
        osc.stop(now + 2.6);
    };
    
    // 每 3 秒隨機播放一個古琴音符，模擬古琴即興演奏
    state.bgmInterval = setInterval(playNote, 2200);
    playNote();
}

// 全域切換靜音
function toggleMute() {
    state.isMuted = !state.isMuted;
    
    const btnOn = document.getElementById('audio-icon-on');
    const btnOff = document.getElementById('audio-icon-off');
    
    if (state.isMuted) {
        btnOn.style.display = 'none';
        btnOff.style.display = 'block';
        if (currentFeedbackAudio) {
            currentFeedbackAudio.pause();
            currentFeedbackAudio.currentTime = 0;
        }
        if (state.bgmInterval) {
            clearInterval(state.bgmInterval);
            state.bgmInterval = null;
        }
    } else {
        btnOn.style.display = 'block';
        btnOff.style.display = 'none';
        initAudioContext();
        playSynthBgm();
    }
    
    // 播放一個點擊反饋音效
    triggerClickSfx();
}

// 簡化播放全域音效介面
function triggerClickSfx() { playSound('sfx_click.mp3', synthClick); }
function triggerWrongSfx() { playSound('sfx_wrong.mp3', synthWrong); }
function triggerTigerSfx() { playSound('sfx_tiger.mp3', synthTigerRoar); }
function triggerDrumSfx() { playSound('sfx_drum_big.mp3', synthMuffledDrum); }
function triggerOperaSfx() { playSound('sfx_opera.mp3', synthOperaMelody); }

function speakFeedback(message) {
    if (state.isMuted || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(message);
    utterance.lang = 'zh-TW';
    utterance.rate = 0.94;
    utterance.pitch = 1.02;
    utterance.volume = 1;
    const taiwanVoice = window.speechSynthesis.getVoices().find(voice => voice.lang === 'zh-TW');
    if (taiwanVoice) utterance.voice = taiwanVoice;
    window.speechSynthesis.speak(utterance);
}

// 答對時播放該題答案的延伸補充音檔（內含肯定語與文史延伸），取代原本的提示音效。
// 檔名對應 stageFeedback[stageId].correct[clipNumber-1]；若音檔不存在或被瀏覽器擋下，
// 自動退回原本的答對音效＋語音合成，確保仍有回饋。
function playCorrectFeedback(stageId, clipNumber, message) {
    if (state.isMuted) return;

    const fileName = `feedback_${stageId}_correct_${clipNumber}.mp3`;
    const audio = new Audio(`assets/audio/${fileName}`);
    audio.volume = 1;

    // 沿用 currentFeedbackAudio 機制：開始新回饋前先停掉前一段回饋
    if (currentFeedbackAudio) {
        currentFeedbackAudio.pause();
        currentFeedbackAudio.currentTime = 0;
    }
    currentFeedbackAudio = audio;

    audio.play()
        .then(() => console.log(`Playing feedback audio: ${fileName}`))
        .catch(err => {
            console.warn(`Feedback audio assets/audio/${fileName} unavailable; fallback to TTS only.`, err);
            speakFeedback(message);
        });
}

function giveContextFeedback(type, explicitMessage = '') {
    const pool = stageFeedback[currentStageId] && stageFeedback[currentStageId][type];
    const index = currentQuestData.feedbackIndex || 0;
    const message = explicitMessage || (pool ? pool[index % pool.length] : (type === 'correct'
        ? '你們已經把觀察到的線索和歷史意義連結起來了。'
        : '再看一次現場線索，調整推理後繼續挑戰。'));
    currentQuestData.feedbackIndex = index + 1;

    if (type === 'correct') {
        // 決定要播放哪一段延伸音檔：終極挑戰用題號，一般關卡對齊所選回饋文字
        let clipNumber;
        if (currentStageId === 'final') {
            clipNumber = currentQuestData.currentQ || 1;
        } else if (pool && pool.length) {
            clipNumber = (index % pool.length) + 1;
        } else {
            clipNumber = 1;
        }
        playCorrectFeedback(currentStageId, clipNumber, message);
    } else {
        triggerWrongSfx();
        speakFeedback(message);
    }
    showAnswerFeedback(type, message);
    return message;
}


// 3. 🖥️ 畫面導航與初始化
window.addEventListener('DOMContentLoaded', () => {
    // 模擬載入進度條
    let progress = 0;
    const progressFill = document.getElementById('loading-progress');
    const saved = loadProgress();
    const loadTimer = setInterval(() => {
        progress += 4;
        progressFill.style.width = `${progress}%`;
        if (progress >= 100) {
            clearInterval(loadTimer);
            // 若偵測到先前未完成的探索進度，直接回復到遊戲畫面
            if (saved && saved.teamName && saved.role) {
                restoreProgress(saved);
            } else {
                showScreen('screen-intro');
            }
        }
    }, 80);
});

// 遊戲內非阻斷式通知（取代原生 alert，避免卡住背景音樂與動畫）
// 類型依訊息前綴自動判斷：成功（金）、警示（紅）、資訊（預設）。
function showToast(message, options = {}) {
    let stack = document.getElementById('toast-stack');
    if (!stack) {
        stack = document.createElement('div');
        stack.id = 'toast-stack';
        stack.className = 'toast-stack';
        document.body.appendChild(stack);
    }

    let type = options.type;
    if (!type) {
        if (/【(破解成功|獲得寶物|發現新關卡|使用道具|任務開始)】/.test(message)) {
            type = 'success';
        } else if (/【(警告|時空迷霧|探索證據未完成)】|尚未|請先|請輸入|無法|不能|不足|已滿|沒有|歸零|被時空迷霧/.test(message)) {
            type = 'warn';
        } else {
            type = 'info';
        }
    }

    const icons = { success: '🎉', warn: '⚠️', info: '📜' };
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;

    const icon = document.createElement('span');
    icon.className = 'toast-icon';
    icon.textContent = icons[type];
    toast.appendChild(icon);

    const textWrap = document.createElement('div');
    textWrap.className = 'toast-text';
    message.split('\n').filter(line => line.trim() !== '').forEach((line, index) => {
        const row = document.createElement('div');
        row.className = index === 0 ? 'toast-title' : 'toast-line';
        row.textContent = line;
        textWrap.appendChild(row);
    });
    toast.appendChild(textWrap);

    stack.appendChild(toast);

    const duration = options.duration ?? (type === 'success' ? 4000 : 3200);
    const dismiss = () => {
        if (toast.dataset.dismissing) return;
        toast.dataset.dismissing = 'true';
        toast.classList.add('toast-out');
        setTimeout(() => toast.remove(), 300);
    };
    const timer = setTimeout(dismiss, duration);
    toast.addEventListener('click', () => {
        clearTimeout(timer);
        dismiss();
    });
    return toast;
}

// 進度自動保存（localStorage）— 避免平板誤觸重整導致整場進度歸零
const SAVE_KEY = 'xinzhuang-oldstreet-save-v1';
const PERSIST_FIELDS = [
    'teamName', 'role', 'score', 'hp', 'inventory',
    'unlockedStages', 'completedStages', 'badges',
    'currentGps', 'isMuted', 'photos', 'evidenceRecords', 'screen'
];

function saveProgress() {
    // 尚未選好隊名／角色（還沒正式開始）就不保存
    if (!state.teamName || !state.role) return;

    const data = {};
    PERSIST_FIELDS.forEach(key => { data[key] = state[key]; });
    data.startTime = state.startTime ? state.startTime.toISOString() : null;

    try {
        localStorage.setItem(SAVE_KEY, JSON.stringify(data));
    } catch (err) {
        // 多半是實拍照片的 base64 撐爆配額：改存不含照片影像的精簡版
        try {
            const slim = {
                ...data,
                photos: (data.photos || []).map(photo => ({
                    ...photo,
                    src: photo.src && photo.src.startsWith('data:') ? null : photo.src
                }))
            };
            localStorage.setItem(SAVE_KEY, JSON.stringify(slim));
        } catch (err2) {
            console.warn('進度保存失敗：', err2);
        }
    }
}

function loadProgress() {
    try {
        const raw = localStorage.getItem(SAVE_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function clearProgress() {
    try { localStorage.removeItem(SAVE_KEY); } catch {}
}

// 將存檔還原為可遊玩的遊戲畫面
function restoreProgress(data) {
    state.teamName = data.teamName;
    state.role = data.role;
    state.score = data.score ?? 0;
    state.hp = data.hp ?? 100;
    state.inventory = data.inventory ?? { bakery: 0, wenchang: 0, dizang: 0 };
    state.unlockedStages = data.unlockedStages ?? ['tutorial'];
    state.completedStages = data.completedStages ?? [];
    state.badges = data.badges ?? [];
    state.currentGps = data.currentGps ?? 'tutorial';
    state.isMuted = !!data.isMuted;
    state.photos = (data.photos ?? []).filter(photo => photo.src);
    state.evidenceRecords = data.evidenceRecords ?? [];
    state.startTime = data.startTime ? new Date(data.startTime) : new Date();

    // 重建頂部與背包 / 體力 / 分數 UI
    applyRoleDisplay();
    updateInventoryUI();
    modifyHp(0);
    modifyScore(0);

    // 重建地圖鎖定狀態與 GPS 面板
    updateMapStagesState();
    const gpsConfig = stagesConfig[state.currentGps];
    if (gpsConfig) {
        document.getElementById('gps-status').innerText = `目前位置：靠近 ${gpsConfig.title.split('：')[0]}`;
    }
    document.querySelectorAll('.gps-buttons .btn').forEach(btn => btn.classList.remove('active'));
    const gpsBtn = document.querySelector(`.gps-buttons .btn[onclick*="${state.currentGps}"]`);
    if (gpsBtn) gpsBtn.classList.add('active');

    checkGameCompletion();

    // 還原靜音圖示（不在此切換音樂，交給 showScreen 處理）
    document.getElementById('audio-icon-on').style.display = state.isMuted ? 'none' : 'block';
    document.getElementById('audio-icon-off').style.display = state.isMuted ? 'block' : 'none';

    showScreen('screen-game');
    showToast('【任務開始】\n已自動回復上次的探索進度，繼續守護老街！', { type: 'success' });
}

// 切換主畫面
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(scr => {
        scr.classList.remove('active');
    });
    const activeScreen = document.getElementById(screenId);
    activeScreen.classList.add('active');
    state.screen = screenId.replace('screen-', '');
    
    // 如果進入遊戲探索地圖，開啟背景音樂
    if (state.screen === 'game') {
        initAudioContext();
        if (!state.isMuted && !state.bgmInterval) {
            playSynthBgm();
        }
    } else {
        if (state.bgmInterval) {
            clearInterval(state.bgmInterval);
            state.bgmInterval = null;
        }
    }
}

// 故事背景畫面按下「下一步」
function proceedToIntroNext() {
    triggerClickSfx();
    const teamNameInput = document.getElementById('team-name').value.trim();
    if (!teamNameInput) {
        showToast("請輸入小隊名稱！");
        return;
    }
    state.teamName = teamNameInput;
    showScreen('screen-role-select');
}

// 選擇探險角色/職業
function selectRole(roleId) {
    triggerClickSfx();
    state.role = roleId;
    
    // 移除所有 card 的選取樣式
    document.querySelectorAll('.role-card').forEach(card => {
        card.classList.remove('selected');
    });
    
    // 為被點選的 card 加入選取樣式
    event.currentTarget.classList.add('selected');
    
    // 啟用確認按鈕
    const btn = document.getElementById('btn-start-game');
    btn.removeAttribute('disabled');
    btn.classList.remove('disabled');
}

// 依目前角色更新頂部顯示（startGame 與回復進度共用）
function applyRoleDisplay() {
    let roleText = "歷史解碼師";
    let roleIcon = "🔍";
    if (state.role === 'surveyor') {
        roleText = "建築測量士";
        roleIcon = "📐";
    } else if (state.role === 'folklorist') {
        roleText = "民俗調查員";
        roleIcon = "🏮";
    }
    document.getElementById('display-team-name').innerText = state.teamName;
    document.getElementById('display-role-name').innerText = roleText;
    document.getElementById('display-role-icon').innerText = roleIcon;
}

// 確認角色出發
function startGame() {
    triggerClickSfx();
    state.startTime = new Date();

    applyRoleDisplay();

    showScreen('screen-game');
    saveProgress();

    // 提示新手關卡可以點擊
    showToast(`【任務開始】\n請從小隊背包或地圖上的 🏁「拜廟禮儀」關卡開始解密！`);
}


// 4. 🛰️ GPS 模擬器與關卡解鎖邏輯
function toggleGpsPanel() {
    triggerClickSfx();
    const body = document.getElementById('gps-panel-body');
    const arrow = document.getElementById('gps-toggle-arrow');
    if (body.style.display === 'none') {
        body.style.display = 'flex';
        arrow.innerText = '▲';
    } else {
        body.style.display = 'none';
        arrow.innerText = '▼';
    }
}

// 模擬 GPS 定位改變
function simulateGps(stageId) {
    triggerClickSfx();
    
    // 移除所有模擬按鈕的 active 狀態
    document.querySelectorAll('.gps-buttons .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    // 將當前點選的按鈕設為 active
    event.currentTarget.classList.add('active');
    
    state.currentGps = stageId;
    const config = stagesConfig[stageId] || { title: '老街巷弄' };
    document.getElementById('gps-status').innerText = `目前位置：靠近 ${config.title.split('：')[0]}`;
    
    // 檢查是否可觸發解鎖
    tryUnlockStage(stageId);
}

// 嘗試解鎖關卡 (根據 GPS 與關卡相依性)
function tryUnlockStage(stageId) {
    // 如果關卡已解鎖，不做任何事
    if (state.unlockedStages.includes(stageId)) return;
    
    // 解鎖相依性判定：
    // - ciyou (慈祐宮) 需要完成 tutorial
    // - wusheng (武聖廟)、bakery (老順香) 與其他支線，需要完成 ciyou
    let canUnlock = false;
    
    if (stageId === 'temple-ciyou' && state.completedStages.includes('tutorial')) {
        canUnlock = true;
    } else if (stageId !== 'tutorial' && stageId !== 'temple-ciyou' && state.completedStages.includes('temple-ciyou')) {
        canUnlock = true;
    }
    
    if (canUnlock) {
        state.unlockedStages.push(stageId);
        saveProgress();
        // 更新 SVG 地圖 Marker
        const marker = document.getElementById(`marker-${stageId}`);
        if (marker) {
            marker.classList.remove('locked');
        }
        
        // 抵達與解鎖只提供位置提示，不播放作答鼓勵或掌聲。
        showToast(`【發現新關卡】\n你已抵達 ${stagesConfig[stageId].title}，解鎖新闖關任務！`);
    } else {
        // 如果是主線未開，顯示警告
        showToast(`【時空迷霧】\n此處尚未解鎖！請依序完成前面的主線探索（必須先完成新手關卡與慈祐宮關卡）。`);
    }
}

// 點擊地圖上的 Marker
document.querySelectorAll('.map-marker').forEach(marker => {
    marker.addEventListener('pointerenter', function() {
        if (this.classList.contains('locked')) return;
        this.classList.remove('flash-once');
        requestAnimationFrame(() => {
            this.classList.add('flash-once');
            setTimeout(() => this.classList.remove('flash-once'), 320);
        });
    });

    marker.addEventListener('animationend', function(event) {
        if (event.animationName === 'markerFlashOnce') this.classList.remove('flash-once');
    });

    marker.addEventListener('click', function() {
        const stageId = this.id.replace('marker-', '');
        
        // 檢查是否已解鎖
        if (!state.unlockedStages.includes(stageId)) {
            triggerClickSfx();
            showToast("此景點被時空迷霧籠罩，請先完成前置關卡並移動至該景點附近！");
            return;
        }
        
        // 檢查是否已完成
        if (state.completedStages.includes(stageId)) {
            triggerClickSfx();
            showToast("此關卡已成功破解！");
            return;
        }
        
        // 檢查體力值
        if (state.hp <= 0) {
            triggerClickSfx();
            showToast("體力值為 0！請先打開小隊背包使用「鹹光餅」補充體力！");
            return;
        }
        
        // 先立即呈現題目，再於下一個畫面更新播放點擊音效。
        openQuestModal(stageId);
        requestAnimationFrame(triggerClickSfx);
    });
});


// 5. 🎒 背包與道具系統
function updateInventoryUI() {
    document.getElementById('count-bakery').innerText = state.inventory.bakery;
    document.getElementById('count-wenchang').innerText = state.inventory.wenchang;
    document.getElementById('count-dizang').innerText = state.inventory.dizang;
    saveProgress();
}

// 使用背包道具
function useInventoryItem(itemId) {
    if (state.inventory[itemId] <= 0) {
        showToast("你目前沒有這個道具！可在特定關卡挑戰成功後獲得。");
        return;
    }
    
    triggerClickSfx();
    
    if (itemId === 'bakery') {
        // 鹹光餅：恢復 50 體力
        if (state.hp >= 100) {
            showToast("小隊體力值已滿，無須吃鹹光餅！");
            return;
        }
        state.inventory.bakery--;
        modifyHp(50);
        showToast("【使用道具】\n吃下了平安鹹光餅！小隊體力恢復 50 點！");
    } else if (itemId === 'wenchang') {
        // 智慧筆：只能在答題關卡內使用
        const modal = document.getElementById('modal-quest');
        if (!modal.classList.contains('active')) {
            showToast("智慧筆只能在關卡解謎答題時使用！");
            return;
        }
        state.inventory.wenchang--;
        // 觸發關卡智慧筆效果 (由關卡當前邏輯處理，這裡給提示)
        triggerWenchangItemEffect();
    } else if (itemId === 'dizang') {
        // 平安符：抵擋答錯扣分
        const modal = document.getElementById('modal-quest');
        if (!modal.classList.contains('active')) {
            showToast("平安符只能在關卡解謎中抵擋惡靈扣分！");
            return;
        }
        state.inventory.dizang--;
        state.hasDizangBuff = true;
        document.getElementById('item-slot-dizang').classList.add('active');
        showToast("【使用道具】\n啟用了地藏平安符！將會自動抵擋下一次答錯的扣分與扣體力懲罰！");
    }
    
    updateInventoryUI();
}

// 修改體力值
function modifyHp(amount) {
    state.hp = Math.max(0, Math.min(100, state.hp + amount));
    document.getElementById('hp-bar').style.width = `${state.hp}%`;
    document.getElementById('hp-text').innerText = `${state.hp}/100`;
    saveProgress();

    // 如果體力扣到 0，發出嚴重警報
    if (state.hp <= 0) {
        triggerWrongSfx();
        showToast("【警告】小隊體力值歸零！請立即吃鹹光餅補充體力，否則無法開啟新關卡！");
    }
}

// 修改積分
function modifyScore(amount) {
    state.score = Math.max(0, state.score + amount);
    document.getElementById('score-text').innerText = state.score;
    saveProgress();
}


// 6. 🧩 關卡模組詳細互動設計與渲染
let currentStageId = null;
let currentQuestData = {}; // 存放關卡當前暫存狀態 (例如連線配對已點選的項目)

function openQuestModal(stageId) {
    currentStageId = stageId;
    currentQuestData = {};
    const config = stagesConfig[stageId];
    const media = stageMediaConfig[stageId];
    
    document.getElementById('quest-title').innerText = config.title;
    
    const body = document.getElementById('quest-body-container');
    const footer = document.getElementById('quest-footer-container');
    
    // 預設渲染
    body.innerHTML = `
        <div class="quest-intro-text">${config.desc}</div>
        <section class="quest-audio-guide">
            <div>
                <strong>🎧 景點語音導覽</strong>
                <span>建議先聽完介紹，再開始觀察與作答。</span>
            </div>
            <audio id="stage-intro-audio" controls preload="metadata" src="assets/audio/intro_${stageId}.mp3" onplay="markIntroPlayed()"></audio>
            <div class="guide-status" id="guide-status">尚未播放導覽</div>
        </section>
        <figure class="quest-scene">
            <img src="assets/images/${media.image}" alt="${config.title}的觀察情境圖">
            <figcaption>先觀察圖片線索，再比對現場實景。</figcaption>
        </figure>
        <div id="quest-interaction-area"></div>
        <div id="quest-evidence-area">${renderEvidenceTask(stageId)}</div>
    `;
    
    footer.innerHTML = `
        <button class="btn btn-primary" id="btn-submit-quest" onclick="submitQuest('${stageId}')">提交解答</button>
    `;
    
    // 依據不同 Stage 渲染特定的互動組件
    renderQuestInteraction(stageId, document.getElementById('quest-interaction-area'));
    
    document.getElementById('modal-quest').classList.add('active');
}

function closeQuestModal() {
    triggerClickSfx();
    document.getElementById('modal-quest').classList.remove('active');
    currentStageId = null;
    
    // 移除道具使用狀態
    state.hasDizangBuff = false;
    document.getElementById('item-slot-dizang').classList.remove('active');
    
    // 清理可能在關卡中啟動的定時器
    if (currentQuestData.timer) clearInterval(currentQuestData.timer);
    const introAudio = document.getElementById('stage-intro-audio');
    if (introAudio) introAudio.pause();
    if ('speechSynthesis' in window) window.speechSynthesis.cancel();
    if (evidenceRecorder && evidenceRecorder.state === 'recording') evidenceRecorder.stop();
    stopEvidenceStream();
}

function markIntroPlayed() {
    currentQuestData.introPlayed = true;
    const status = document.getElementById('guide-status');
    if (status) {
        status.classList.add('played');
        status.innerText = '▶ 正在播放景點介紹';
    }
}

function renderEvidenceTask(stageId) {
    const task = stageMediaConfig[stageId];
    const labels = { photo: '📷 現場拍照任務', audio: '🎙️ 口述錄音任務', text: '📝 文字田野筆記' };
    let control = '';

    if (task.type === 'photo') {
        control = `
            <label class="evidence-upload btn btn-outline">
                開啟相機／選擇照片
                <input type="file" accept="image/*" capture="environment" onchange="handlePhotoEvidence(this)">
            </label>
            <img id="evidence-photo-preview" class="evidence-preview" alt="探索照片預覽">
        `;
    } else if (task.type === 'audio') {
        control = `
            <div class="evidence-actions">
                <button type="button" class="btn btn-outline" id="btn-record-start" onclick="startEvidenceRecording()">● 開始錄音</button>
                <button type="button" class="btn btn-outline" id="btn-record-stop" onclick="stopEvidenceRecording()" disabled>■ 停止並保存</button>
            </div>
            <label class="evidence-upload evidence-upload-secondary">
                或上傳既有錄音
                <input type="file" accept="audio/*" capture onchange="handleAudioEvidence(this)">
            </label>
            <audio id="evidence-audio-preview" class="evidence-audio" controls></audio>
        `;
    } else {
        control = `
            <textarea class="evidence-text" rows="4" maxlength="240" placeholder="寫下觀察到的細節與推論（至少 20 個字）" oninput="saveTextEvidence(this.value)"></textarea>
            <div class="evidence-counter"><span id="evidence-text-count">0</span> / 20 字以上</div>
        `;
    }

    return `
        <section class="evidence-card" data-evidence-type="${task.type}">
            <div class="evidence-heading">${labels[task.type]} <span>必做</span></div>
            <p>${task.prompt}</p>
            ${control}
            <div class="evidence-status" id="evidence-status">尚未完成探索紀錄</div>
        </section>
    `;
}

function setEvidenceReady(evidence, message) {
    currentQuestData.evidence = evidence;
    currentQuestData.evidenceReady = true;
    const status = document.getElementById('evidence-status');
    if (status) {
        status.classList.add('completed');
        status.innerText = `✓ ${message}`;
    }
}

function handlePhotoEvidence(input) {
    const file = input.files && input.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        const image = new Image();
        image.onload = () => {
            const scale = Math.min(1, 1280 / Math.max(image.width, image.height));
            const canvas = document.createElement('canvas');
            canvas.width = Math.round(image.width * scale);
            canvas.height = Math.round(image.height * scale);
            canvas.getContext('2d').drawImage(image, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg', 0.82);
            const preview = document.getElementById('evidence-photo-preview');
            preview.src = dataUrl;
            preview.style.display = 'block';
            setEvidenceReady({ type: 'photo', dataUrl, fileName: file.name }, '照片已保存');
        };
        image.src = reader.result;
    };
    reader.readAsDataURL(file);
}

async function startEvidenceRecording() {
    try {
        evidenceStream = await navigator.mediaDevices.getUserMedia({ audio: true });
        evidenceChunks = [];
        evidenceRecorder = new MediaRecorder(evidenceStream);
        evidenceRecorder.ondataavailable = event => {
            if (event.data.size > 0) evidenceChunks.push(event.data);
        };
        evidenceRecorder.onstop = () => {
            const blob = new Blob(evidenceChunks, { type: evidenceRecorder.mimeType || 'audio/webm' });
            const url = URL.createObjectURL(blob);
            const preview = document.getElementById('evidence-audio-preview');
            preview.src = url;
            preview.style.display = 'block';
            setEvidenceReady({ type: 'audio', url, durationNote: '現場錄音' }, '錄音已保存，可播放檢查');
            stopEvidenceStream();
        };
        evidenceRecorder.start();
        document.getElementById('btn-record-start').disabled = true;
        document.getElementById('btn-record-stop').disabled = false;
        document.getElementById('evidence-status').innerText = '錄音中…請完整說明觀察與推論';
    } catch (error) {
        showToast('無法啟用麥克風。請允許瀏覽器使用麥克風，或改用「上傳既有錄音」。');
    }
}

function stopEvidenceRecording() {
    if (evidenceRecorder && evidenceRecorder.state === 'recording') {
        evidenceRecorder.stop();
        document.getElementById('btn-record-start').disabled = false;
        document.getElementById('btn-record-stop').disabled = true;
    }
}

function stopEvidenceStream() {
    if (evidenceStream) evidenceStream.getTracks().forEach(track => track.stop());
    evidenceStream = null;
}

function handleAudioEvidence(input) {
    const file = input.files && input.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    const preview = document.getElementById('evidence-audio-preview');
    preview.src = url;
    preview.style.display = 'block';
    setEvidenceReady({ type: 'audio', url, fileName: file.name }, '錄音檔已保存，可播放檢查');
}

function saveTextEvidence(value) {
    const length = value.trim().length;
    document.getElementById('evidence-text-count').innerText = length;
    currentQuestData.evidenceReady = length >= 20;
    currentQuestData.evidence = { type: 'text', text: value.trim() };
    const status = document.getElementById('evidence-status');
    status.classList.toggle('completed', length >= 20);
    status.innerText = length >= 20 ? '✓ 田野筆記已達標' : `還需要 ${20 - length} 個字才能完成`;
}

// 根據景點 ID 渲染特定的互動 UI
function renderQuestInteraction(stageId, container) {
    switch (stageId) {
        case 'tutorial':
            // 拜廟禮儀：走位與鐘鼓選擇
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">1. 請點選正確的入口跨入廟宇：</p>
                <div class="match-container">
                    <button class="btn btn-outline" style="flex:1;" onclick="chooseTutorialGate('left')">🚪 從廟口左邊進入 (面朝廟宇的左門)</button>
                    <button class="btn btn-outline" style="flex:1;" onclick="chooseTutorialGate('right')">🚪 從廟口右邊進入 (面朝廟宇的右門)</button>
                </div>
                <div id="tutorial-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">2. 進廟了！請在下方點擊，敲響用來「迎接神明」與「報時」的鐘和鼓：</p>
                    <div style="display:flex; justify-content:space-around; gap: 20px;">
                        <button class="btn btn-outline" style="font-size: 2rem; padding: 20px; flex:1;" id="btn-tutorial-bell" onclick="clickTutorialInstrument('bell')">🔔<br><span style="font-size:1rem;">大鐘</span></button>
                        <button class="btn btn-outline" style="font-size: 2rem; padding: 20px; flex:1;" id="btn-tutorial-drum" onclick="clickTutorialInstrument('drum')">🥁<br><span style="font-size:1rem;">大鼓</span></button>
                    </div>
                </div>
            `;
            break;
            
        case 'temple-ciyou':
            // 慈祐宮：門神拖線配對 + 數蝙蝠
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">1. 門神連連看：點選門神與正確的站姿位置進行配對</p>
                <div class="match-container">
                    <div class="match-column">
                        <div class="match-item" id="ciyou-left-hero" onclick="clickMatch('hero', '秦叔寶')">秦叔寶 將軍</div>
                        <div class="match-item" id="ciyou-right-hero" onclick="clickMatch('hero', '尉遲恭')">尉遲恭 將軍</div>
                    </div>
                    <div class="match-column">
                        <div class="match-item" id="ciyou-left-pos" onclick="clickMatch('pos', '守護左邊門閥')">守護大門左側</div>
                        <div class="match-item" id="ciyou-right-pos" onclick="clickMatch('pos', '守護右邊門閥')">守護大門右側</div>
                    </div>
                </div>
                
                <div id="ciyou-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">2. AR尋寶：在大殿窗框與屋簷下，用相機找出 3 隻飛來的蝙蝠 (點擊牠們)：</p>
                    <div class="ar-hunt-bg" id="ciyou-ar-hunt">
                        <div class="ar-hunt-overlay">找到蝙蝠：<span id="ciyou-bat-count">0</span> / 3</div>
                        <div class="hunt-target" style="top: 25px; left: 60px;" onclick="clickBat(this)">🦇</div>
                        <div class="hunt-target" style="top: 140px; left: 190px;" onclick="clickBat(this)">🦇</div>
                        <div class="hunt-target" style="top: 35px; right: 50px;" onclick="clickBat(this)">🦇</div>
                    </div>
                </div>
            `;
            break;
            
        case 'temple-wusheng':
            // 武聖廟：108顆門釘點擊 + 龍柱選擇題
            currentQuestData.nailsClicked = 0;
            container.innerHTML = `
                <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-accent);">1. 武聖廟大門不設門神，而是使用 108 顆門釘！請手動敲擊大門，感受帝王級的防禦陣法 (點擊 9 顆門釘代表陣法)：</p>
                <div class="door-grid">
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                    <button class="nail-btn" onclick="clickNail(this)"></button>
                </div>
                <div id="wusheng-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-accent);">2. 觀察武聖廟的前殿，為什麼門口故意不放置華麗的龍柱？</p>
                    <div class="option-list">
                        <button class="option-btn" onclick="clickOption(this, false)">A. 因為古代蓋廟時經費不夠，只好用普通石柱代替</button>
                        <button class="option-btn" onclick="clickOption(this, true)">B. 為了尊敬關公，故意不放華麗龍柱，展現剛正不阿的性格</button>
                        <button class="option-btn" onclick="clickOption(this, false)">C. 為了符合環保概念，不使用石雕製品</button>
                    </div>
                </div>
            `;
            break;
            
        case 'bakery':
            // 老順香：鹹光餅問答
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">大吉！來到 150 年的老順香餅店。請回答鹹光餅中間為什麼有一個洞？</p>
                <div class="option-list">
                    <button class="option-btn" onclick="clickOption(this, false)">A. 為了烘烤時能受熱均勻，吃起來口感更蓬鬆</button>
                    <button class="option-btn" onclick="clickOption(this, true)">B. 古代軍人打仗時方便將餅串在脖子上當作乾糧，現在吃它保平安</button>
                    <button class="option-btn" onclick="clickOption(this, false)">C. 為了做成類似西式甜甜圈的造型，吸引外國遊客</button>
                </div>
            `;
            break;
            
        case 'temple-guangfu':
            // 廣福宮：示禁碑虛擬拓印 Canvas
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">1. 廣福宮是新莊唯一的粵籍客家信仰廟宇。請問它為什麼呈現古樸無漆的原木色？</p>
                <div class="option-list">
                    <button class="option-btn" onclick="clickOption(this, true)">A. 因閩粵衝突客家人外移，香火漸冷，反而沒錢改建而保留了清代原貌</button>
                    <button class="option-btn" onclick="clickOption(this, false)">B. 客家人不喜歡彩繪，所以故意塗掉色彩</button>
                </div>
                <div id="guangfu-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-accent);">2. 用手指/滑鼠在下方石碑上「塗抹」進行虛擬拓印，解密這塊閩粵水源和解的歷史碑文：</p>
                    <div class="scratch-container">
                        <div class="scratch-underlay">
                            <div class="stele-text">
                                【 奉兩憲示禁碑 】
                                乾隆四十五年立
                                閩南粵東，共灌良田
                                嚴禁霸佔水源、濫收稅規
                                兩造和睦，同享安寧
                            </div>
                        </div>
                        <canvas class="scratch-canvas" id="stele-canvas" width="400" height="250"></canvas>
                    </div>
                </div>
            `;
            break;
            
        case 'temple-wenchang':
            // 文昌祠：模擬餵馬 + 諧音連線
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">1. 讀書人祈求功名，會祭拜文昌祠祿馬殿的祿馬神。請拖曳牧草餵食祿馬神，獲得祈福功名：</p>
                <div style="display:flex; justify-content:space-around; align-items:center; background-color: var(--color-bg-dark); padding: 15px; border-radius: var(--radius-md);">
                    <div id="wenchang-grass" style="font-size: 3rem; cursor: grab;" draggable="true" ondragstart="dragGrass(event)">🌾</div>
                    <div style="font-size: 1.2rem;">➔ 拖曳草料 ➔</div>
                    <div id="wenchang-horse" style="font-size: 3rem; border: 2px dashed var(--color-border); padding: 10px; border-radius: 50%;" ondragover="allowDrop(event)" ondrop="dropGrass(event)">🐴</div>
                </div>
                
                <div id="wenchang-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">2. 考生拜文昌常祭拜「包子、蛋糕、粽子」，這代表什麼意思？</p>
                    <div class="option-list">
                        <button class="option-btn" onclick="clickOption(this, false)">A. 代表祝考生考試順利，天天都有美味的點心吃</button>
                        <button class="option-btn" onclick="clickOption(this, true)">B. 「包、糕、粽」諧音「包高中」，祈求考試金榜題名</button>
                        <button class="option-btn" onclick="clickOption(this, false)">C. 象徵新莊老街當地的特色下午茶美食組合</button>
                    </div>
                </div>
            `;
            break;
            
        case 'temple-chaojiang':
            // 潮江寺：360度環景哨兵 (大漢溪防禦)
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">潮江寺在漳泉械鬥時期作為『防禦瞭望台』。請拖曳下方大漢溪環景圖片，找出對岸板橋可能侵入的敵船 (點選船隻拉響警報)：</p>
                <div class="panorama-container" id="pano-box" onmousedown="startPanoDrag(event)" onmousemove="panoDrag(event)" onmouseup="endPanoDrag()">
                    <div class="panorama-scroll" id="pano-scroll">
                        <span style="position:absolute; left: 100px; top: 100px; font-size:1.5rem; color:#aaa;">大漢溪碼頭 ⛵</span>
                        <span style="position:absolute; left: 500px; top: 80px; font-family: var(--font-heading); font-size:1.4rem; color: var(--color-accent);">觀音守護瞭望</span>
                        <!-- 敵船標記 -->
                        <div class="panorama-item" id="pano-enemy" style="left: 950px; top: 90px;" onclick="clickEnemyShip(this)">⛵☠️</div>
                        <span style="position:absolute; left: 1300px; top: 120px; font-size:1.5rem; color:#aaa;">板橋沙洲對岸 🌾</span>
                    </div>
                </div>
            `;
            break;
            
        case 'dizang':
            // 地藏庵：官將首拼圖 (臉譜)
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">地藏庵是著名陣頭『官將首』的起源地。請配對官將首護法大將的專屬兵器：</p>
                <div class="match-container">
                    <div class="match-column">
                        <div class="match-item" id="dizang-l-item" onclick="clickFolkMatch('char', '損將軍')">損將軍 (站在中央/增將軍的左右手)</div>
                        <div class="match-item" id="dizang-r-item" onclick="clickFolkMatch('char', '增將軍')">增將軍 (站在左右/分化為二人)</div>
                    </div>
                    <div class="match-column">
                        <div class="match-item" id="dizang-l-weapon" onclick="clickFolkMatch('weapon', '手持三叉戟')">手持三叉戟與令旗</div>
                        <div class="match-item" id="dizang-r-weapon" onclick="clickFolkMatch('weapon', '手持火籤與虎牌')">手持火籤與手銬</div>
                    </div>
                </div>
                <div id="dizang-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-accent);">2. 每年農曆五月初一的「大眾爺繞境（新莊大拜拜）」最主要的目的是？</p>
                    <div class="option-list">
                        <button class="option-btn" onclick="clickOption(this, true)">A. 驅除瘟疫、安撫因械鬥客死異鄉的孤魂，祈求地方平安</button>
                        <button class="option-btn" onclick="clickOption(this, false)">B. 慶祝新莊老街的商業碼頭貿易額突破清代紀錄</button>
                    </div>
                </div>
            `;
            break;
            
        case 'drum':
            // 响仁和：步驟排序 + 節奏踩鼓
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">1. 排序手工製鼓步驟：請在腦海中比對，並選擇正確的製鼓順序：</p>
                <div class="option-list">
                    <button class="option-btn" onclick="clickOption(this, true)">A. 1.選皮 ➔ 2.燙皮除毛 ➔ 3.繃鼓踩鼓 ➔ 4.定音裝飾</button>
                    <button class="option-btn" onclick="clickOption(this, false)">B. 1.繃鼓 ➔ 2.燙皮 ➔ 3.裝飾 ➔ 4.選皮</button>
                </div>
                
                <div id="drum-step-2" style="display:none; margin-top:20px;">
                    <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-accent);">2. 踩鼓調音體驗：點擊下方大鼓 Pad，發出低沉的大鼓聲調音 (點擊 3 次)：</p>
                    <div class="drum-game-container">
                        <div class="drum-pad" onclick="clickDrumPad()">🥁<br>敲擊鼓面</div>
                        <div style="margin-top: 10px; font-size: 0.85rem; color: var(--color-accent);">調音進度：<span id="drum-hits">0</span> / 3</div>
                    </div>
                </div>
            `;
            break;
            
        case 'alley-theater':
            // 戲館巷：播放北管聽音問答
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">1. 點擊下方播放鈕，聆聽古代戲館巷最常聽到的聲音：</p>
                <button class="btn btn-outline" style="margin-bottom: 15px;" onclick="triggerOperaSfx()">🎵 播放流行曲藝片段</button>
                <p style="margin-bottom: 8px; font-weight: bold; color: var(--color-accent);">2. 聽完後，請問當時聚集在此巷弄的人們主要是從事何種行業？</p>
                <div class="option-list">
                    <button class="option-btn" onclick="clickOption(this, false)">A. 碼頭米商，在此計算稻米的出口價格</button>
                    <button class="option-btn" onclick="clickOption(this, true)">B. 傳統布袋戲、南北管的曲藝職人與戲班學徒</button>
                </div>
            `;
            break;
            
        case 'alley-rice':
            // 米市巷：搬米大挑戰選擇題
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">米市巷是挑夫挑米前往大漢溪碼頭的通道。為防盜與防止火災蔓延，巷子蓋得非常狹窄。請問當時挑夫們在此忙碌搬運的作物是？</p>
                <div class="option-list">
                    <button class="option-btn" onclick="clickOption(this, true)">A. 大米 (新莊平原稻穀產量極大)</button>
                    <button class="option-btn" onclick="clickOption(this, false)">B. 茶葉 (新莊山區生產的烏龍茶)</button>
                    <button class="option-btn" onclick="clickOption(this, false)">C. 煤礦 (附近山區開採的黑金)</button>
                </div>
            `;
            break;
            
        case 'alley-water':
            // 挑水巷：挑水夫陀螺儀模擬/選擇題
            container.innerHTML = `
                <p style="margin-bottom: 12px; font-weight: bold; color: var(--color-accent);">挑水巷是早期居民往返大漢溪挑取飲用水的專用道路。請問早期居民不打井水，而要辛苦挑取大漢溪水的原因是？</p>
                <div class="option-list">
                    <button class="option-btn" onclick="clickOption(this, true)">A. 大漢溪當時水質清澈甘甜，而地下水可能鹹澀不宜飲用</button>
                    <button class="option-btn" onclick="clickOption(this, false)">B. 當時大漢溪水有神明保佑，喝了能治百病</button>
                </div>
            `;
            break;
    }
}

// === 關卡內部互動邏輯函數 ===

// 1. 新手關卡
function chooseTutorialGate(gate) {
    triggerClickSfx();
    if (gate === 'right') {
        // 選對龍門＝新手關的「答對」：播放延伸音檔並顯示文字橫幅
        giveContextFeedback('correct');
        showToast("【正確】\n龍門進（面朝廟的右手邊）！迎好運成功！開啟進廟第二步。");
        document.getElementById('tutorial-step-2').style.display = 'block';
        currentQuestData.gatePassed = true;
    } else {
        const message = giveContextFeedback('wrong');
        modifyHp(-20);
        showToast(`【重新判讀方向】\n${message}\n體力減少 20 點，調整方向後再試一次。`);
    }
}

function clickTutorialInstrument(inst) {
    if (inst === 'bell') {
        if (!state.isMuted) {
            initAudioContext();
            synthTempleBell(); // 廟宇大鐘：更大、更長的鐘聲
        }
        showToast("【鐘聲響起】\n迎接神明，宣告你的到來！");
        currentQuestData.bellClicked = true;
    } else {
        if (!state.isMuted) {
            initAudioContext();
            synthDrumRhythm(); // 報廟大鼓：更大聲、帶一小段節奏
        }
        showToast("【大鼓重擊】\n大鼓通報，宣告探險隊伍抵達！");
        currentQuestData.drumClicked = true;
    }
}

// 2. 慈祐宮
function clickMatch(type, value) {
    triggerClickSfx();
    if (type === 'hero') {
        currentQuestData.hero = value;
        document.querySelectorAll('[id^="ciyou-"][id$="-hero"]').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    } else {
        currentQuestData.pos = value;
        document.querySelectorAll('[id^="ciyou-"][id$="-pos"]').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    }
    
    // 檢查配對
    if (currentQuestData.hero && currentQuestData.pos) {
        let isMatched = false;
        if (currentQuestData.hero === '秦叔寶' && currentQuestData.pos === '守護左邊門閥') {
            isMatched = true;
            document.getElementById('ciyou-left-hero').classList.add('matched');
            document.getElementById('ciyou-left-pos').classList.add('matched');
        } else if (currentQuestData.hero === '尉遲恭' && currentQuestData.pos === '守護右邊門閥') {
            isMatched = true;
            document.getElementById('ciyou-right-hero').classList.add('matched');
            document.getElementById('ciyou-right-pos').classList.add('matched');
        }
        
        if (isMatched) {
            currentQuestData.matches = (currentQuestData.matches || 0) + 1;
            currentQuestData.hero = null;
            currentQuestData.pos = null;

            if (currentQuestData.matches >= 2) {
                // 門神全數歸位＝慈祐宮的「答對」：播放延伸音檔並顯示文字橫幅
                giveContextFeedback('correct');
                showToast("【門神解鎖】\n秦叔寶與尉遲恭兩位門神將軍歸位！解密成功，開啟第二步。");
                document.getElementById('ciyou-step-2').style.display = 'block';
            }
        } else {
            const message = giveContextFeedback('wrong');
            showToast(message);
            document.querySelectorAll('.match-item:not(.matched)').forEach(el => el.classList.remove('selected'));
            currentQuestData.hero = null;
            currentQuestData.pos = null;
        }
    }
}

function clickBat(el) {
    el.classList.add('found');
    el.innerText = '✨';
    currentQuestData.batsFound = (currentQuestData.batsFound || 0) + 1;
    document.getElementById('ciyou-bat-count').innerText = currentQuestData.batsFound;

    if (currentQuestData.batsFound >= 3) {
        // 三隻蝙蝠全數尋獲＝慈祐宮第二步的「答對」：播放延伸音檔並顯示文字橫幅
        giveContextFeedback('correct');
        showToast("【蝙蝠賜福】\n成功找出所有 3 隻隱藏的蝙蝠！福氣飛來，挑戰完成！");
    }
}

// 3. 武聖廟
function clickNail(btn) {
    triggerClickSfx();
    if (!btn.classList.contains('clicked')) {
        btn.classList.add('clicked');
        currentQuestData.nailsClicked++;
        
        if (currentQuestData.nailsClicked >= 9) {
            showToast("【防禦啟動】\n敲擊大門啟動了 108 門釘神盾防禦！開啟第二步問答。");
            document.getElementById('wusheng-step-2').style.display = 'block';
        }
    }
}

// 4. 選擇題選項點選
function clickOption(btn, isCorrect) {
    const parent = btn.parentElement;
    parent.querySelectorAll('.option-btn').forEach(b => {
        b.classList.remove('selected', 'correct', 'wrong');
        b.setAttribute('disabled', 'true');
    });
    
    if (isCorrect) {
        btn.classList.add('correct');
        giveContextFeedback('correct');
        currentQuestData.questionPassed = true;
        
        // 額外邏輯：解鎖後續步驟
        if (currentStageId === 'temple-guangfu') {
            document.getElementById('guangfu-step-2').style.display = 'block';
            initGuangfuCanvas();
        } else if (currentStageId === 'temple-wenchang') {
            document.getElementById('wenchang-step-2').style.display = 'block';
        } else if (currentStageId === 'dizang') {
            document.getElementById('dizang-step-2').style.display = 'block';
        } else if (currentStageId === 'drum') {
            document.getElementById('drum-step-2').style.display = 'block';
        }
    } else {
        btn.classList.add('wrong');
        giveContextFeedback('wrong');
        
        if (state.hasDizangBuff) {
            showToast("【平安符抵擋】\n答錯了！但使用中的「地藏平安符」為你們擋下了體力扣除懲罰！");
            state.hasDizangBuff = false;
            document.getElementById('item-slot-dizang').classList.remove('active');
        } else {
            modifyHp(-20);
            showToast("【再挑戰】這次答案還不正確，體力減少 20 點。別急，重新觀察現場線索再試一次！");
        }
        
        // 重新啟用按鈕讓學生重答
        setTimeout(() => {
            parent.querySelectorAll('.option-btn').forEach(b => {
                b.removeAttribute('disabled');
                b.classList.remove('wrong');
            });
        }, 1200);
    }
}

function showAnswerFeedback(type, message) {
    const oldFeedback = document.getElementById('answer-feedback-banner');
    if (oldFeedback) oldFeedback.remove();
    const banner = document.createElement('div');
    banner.id = 'answer-feedback-banner';
    banner.className = `answer-feedback ${type}`;
    banner.innerText = message;
    const modalBody = document.getElementById('quest-body-container');
    modalBody.prepend(banner);
    setTimeout(() => banner.remove(), 4200);
}

// 5. 廣福宮拓印 Canvas
function initGuangfuCanvas() {
    const canvas = document.getElementById('stele-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // 繪製灰色覆蓋層
    ctx.fillStyle = '#6e6363';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // 繪製「石碑泥土覆蓋」示意紋路
    ctx.strokeStyle = '#4f4444';
    ctx.lineWidth = 4;
    for (let i = 0; i < 15; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, 0);
        ctx.lineTo(Math.random() * canvas.width, canvas.height);
        ctx.stroke();
    }
    
    let isDrawing = false;
    
    const getPos = (e) => {
        const rect = canvas.getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        return {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
    };
    
    const draw = (e) => {
        if (!isDrawing) return;
        const pos = getPos(e);
        ctx.globalCompositeOperation = 'destination-out';
        ctx.beginPath();
        ctx.arc(pos.x, pos.y, 24, 0, Math.PI * 2);
        ctx.fill();
        
        // 播放木魚聲作為沙沙聲反饋
        if (Math.random() < 0.15) {
            triggerClickSfx();
        }
    };
    
    canvas.addEventListener('mousedown', (e) => { isDrawing = true; draw(e); });
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => { isDrawing = false; checkCanvasCleared(); });
    canvas.addEventListener('touchstart', (e) => { isDrawing = true; draw(e); });
    canvas.addEventListener('touchmove', draw);
    canvas.addEventListener('touchend', () => { isDrawing = false; checkCanvasCleared(); });
}

function checkCanvasCleared() {
    const canvas = document.getElementById('stele-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imgData.data;
    
    let transparentPixels = 0;
    for (let i = 3; i < pixels.length; i += 4) {
        if (pixels[i] === 0) transparentPixels++;
    }
    
    // 當擦除比例超過 45% 時，視同完成拓印
    const ratio = transparentPixels / (canvas.width * canvas.height);
    if (ratio > 0.45 && !currentQuestData.scratchPassed) {
        currentQuestData.scratchPassed = true;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // 全部擦除
        // 碑文拓印完成＝廣福宮的「答對」：播放延伸音檔並顯示文字橫幅
        giveContextFeedback('correct');
        showToast("【拓印成功】\n歷史碑文『奉兩憲示禁碑』重見天日！閩粵兩族和平共處，挑戰成功！");
    }
}

// 6. 文昌祠拖曳餵馬
function allowDrop(ev) {
    ev.preventDefault();
}

function dragGrass(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function dropGrass(ev) {
    ev.preventDefault();

    const grass = document.getElementById('wenchang-grass');
    grass.style.display = 'none';
    
    const horse = document.getElementById('wenchang-horse');
    horse.innerText = '🐴😋';
    horse.style.borderColor = 'var(--color-secondary)';
    
    showToast("【餵食成功】\n祿馬神享用了新鮮草料，發出嘶鳴！開啟第二步諧音挑戰。");
    currentQuestData.horseFed = true;
    document.getElementById('wenchang-step-2').style.display = 'block';
}

// 7. 潮江寺 360 度環景拖曳
let panoDragState = {
    isDragging: false,
    startX: 0,
    currentScroll: 0
};

function startPanoDrag(e) {
    panoDragState.isDragging = true;
    panoDragState.startX = e.pageX || e.touches[0].pageX;
    const scroll = document.getElementById('pano-scroll');
    // 從 transform: translateX(-Xpx) 中解析出數值
    const matrix = window.getComputedStyle(scroll).transform;
    if (matrix !== 'none') {
        panoDragState.currentScroll = parseFloat(matrix.split(',')[4]);
    } else {
        panoDragState.currentScroll = 0;
    }
}

function panoDrag(e) {
    if (!panoDragState.isDragging) return;
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - panoDragState.startX) * 1.5; // 移動倍率
    let scrollVal = panoDragState.currentScroll + walk;
    
    // 限制滾動範圍 (防止滾過頭露出空白)
    const scroll = document.getElementById('pano-scroll');
    const container = document.getElementById('pano-box');
    const maxScroll = -(2000 - container.clientWidth);
    scrollVal = Math.max(maxScroll, Math.min(0, scrollVal));
    
    scroll.style.transform = `translateX(${scrollVal}px)`;
}

function endPanoDrag() {
    panoDragState.isDragging = false;
}

function clickEnemyShip(ship) {
    // 找到敵船＝潮江寺的「答對」：播放延伸音檔並顯示文字橫幅
    giveContextFeedback('correct');
    ship.innerText = '💥🔥';
    ship.style.borderColor = 'var(--color-secondary)';
    currentQuestData.shipFound = true;
    showToast("【警報大作】\n發現對岸入侵的敵船！哨兵擊鼓示警，全老街民兵戒備！挑戰成功！");
}

// 8. 地藏庵官將首兵器配對
function clickFolkMatch(type, value) {
    triggerClickSfx();
    if (type === 'char') {
        currentQuestData.char = value;
        document.querySelectorAll('[id^="dizang-"][id$="-item"]').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    } else {
        currentQuestData.weapon = value;
        document.querySelectorAll('[id^="dizang-"][id$="-weapon"]').forEach(el => el.classList.remove('selected'));
        event.currentTarget.classList.add('selected');
    }
    
    // 檢查配對
    if (currentQuestData.char && currentQuestData.weapon) {
        let isMatched = false;
        if (currentQuestData.char === '損將軍' && currentQuestData.weapon === '手持三叉戟') {
            isMatched = true;
            document.getElementById('dizang-l-item').classList.add('matched');
            document.getElementById('dizang-l-weapon').classList.add('matched');
        } else if (currentQuestData.char === '增將軍' && currentQuestData.weapon === '手持火籤與虎牌') {
            isMatched = true;
            document.getElementById('dizang-r-item').classList.add('matched');
            document.getElementById('dizang-r-weapon').classList.add('matched');
        }
        
        if (isMatched) {
            currentQuestData.matches = (currentQuestData.matches || 0) + 1;
            currentQuestData.char = null;
            currentQuestData.weapon = null;

            if (currentQuestData.matches >= 2) {
                // 官將首兵器全數歸位＝地藏庵的「答對」：播放延伸音檔並顯示文字橫幅
                giveContextFeedback('correct');
                showToast("【官將首降臨】\n增、損將軍兵器歸位，展現威武身段！解密成功，開啟第二步。");
                document.getElementById('dizang-step-2').style.display = 'block';
            }
        } else {
            const message = giveContextFeedback('wrong');
            showToast(message);
            document.querySelectorAll('#modal-quest .match-item:not(.matched)').forEach(el => el.classList.remove('selected'));
            currentQuestData.char = null;
            currentQuestData.weapon = null;
        }
    }
}

// 9. 响仁和踩鼓大鼓
function clickDrumPad() {
    triggerDrumSfx(); // 播放低沉鼓聲
    currentQuestData.drumHits = (currentQuestData.drumHits || 0) + 1;
    document.getElementById('drum-hits').innerText = currentQuestData.drumHits;
    
    // 鼓 Pad 動態縮放反饋
    const pad = event.currentTarget;
    pad.style.transform = 'scale(0.92)';
    setTimeout(() => { pad.style.transform = 'scale(1)'; }, 50);
    
    if (currentQuestData.drumHits >= 3) {
        // 大鼓定音完成＝响仁和的「答對」：播放延伸音檔並顯示文字橫幅
        giveContextFeedback('correct');
        showToast("【擊鼓定音】\n百年大鼓定音完成！發出宏亮敦厚的聲音，挑戰成功！");
    }
}


// === 智慧筆使用效果 (關卡提示) ===
function triggerWenchangItemEffect() {
    showToast("【使用智慧筆】\n開啟考前大加持！文昌魁星賜予智慧，直接為你們點出正確答案！");
    const container = document.getElementById('quest-interaction-area');
    const correctBtn = container.querySelector('.option-btn[onclick*="true"]');
    if (correctBtn) {
        correctBtn.style.borderColor = 'var(--color-accent)';
        correctBtn.style.backgroundColor = 'rgba(212,175,55,0.2)';
        correctBtn.classList.add('selected');
        // 自動點擊正確答案
        setTimeout(() => { correctBtn.click(); }, 800);
    } else {
        showToast("此關卡沒有選擇題，智慧筆無法生效，已退回背包！");
        state.inventory.wenchang++;
    }
}

// === 提交解答判定 ===
function submitQuest(stageId) {
    let passed = false;

    if (!currentQuestData.evidenceReady) {
        const task = stageMediaConfig[stageId];
        const typeName = { photo: '拍照', audio: '口述錄音', text: '文字紀錄' }[task.type];
        showToast(`【探索證據未完成】\n完成原有解謎後，還必須提交「${typeName}」任務才能過關。`);
        document.getElementById('quest-evidence-area').scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
    }
    
    switch (stageId) {
        case 'tutorial':
            if (currentQuestData.gatePassed && currentQuestData.bellClicked && currentQuestData.drumClicked) {
                passed = true;
            } else {
                showToast("您尚未走對路線，或尚未敲響大鐘與大鼓通報！");
            }
            break;
            
        case 'temple-ciyou':
            if (currentQuestData.matches >= 2 && currentQuestData.batsFound >= 3) {
                passed = true;
            } else {
                showToast("您尚未完成門神配對，或尚未找出 3 隻吉祥蝙蝠！");
            }
            break;
            
        case 'temple-wusheng':
            if (currentQuestData.nailsClicked >= 9 && currentQuestData.questionPassed) {
                passed = true;
            } else {
                showToast("您尚未觸摸門釘，或尚未回答龍柱的問題！");
            }
            break;
            
        case 'bakery':
            if (currentQuestData.questionPassed) {
                passed = true;
                // 鹹光餅關卡特權：獲得 2 個實體鹹光餅！
                state.inventory.bakery += 2;
                updateInventoryUI();
                showToast("【獲得寶物】\n獲得老店現烤『鹹光餅 x2』！可放入背包隨時食用恢復體力。");
            } else {
                showToast("您尚未回答鹹光餅中間為什麼有洞！");
            }
            break;
            
        case 'temple-guangfu':
            if (currentQuestData.questionPassed && currentQuestData.scratchPassed) {
                passed = true;
            } else {
                showToast("您尚未回答廣福宮建築特色，或尚未塗抹完成示禁碑拓印！");
            }
            break;
            
        case 'temple-wenchang':
            if (currentQuestData.horseFed && currentQuestData.questionPassed) {
                passed = true;
                // 文昌祠特權：獲得智慧筆 x1
                state.inventory.wenchang += 1;
                updateInventoryUI();
                showToast("【獲得寶物】\n文昌君加持，獲得『智慧筆 x1』！可在答題關卡直接鎖定答案。");
            } else {
                showToast("您尚未餵食祿馬神，或尚未回答包糕粽問題！");
            }
            break;
            
        case 'temple-chaojiang':
            if (currentQuestData.shipFound) {
                passed = true;
            } else {
                showToast("哨兵尚未在河港中找出進犯的敵軍船隻！請左右滑動地圖尋找。");
            }
            break;
            
        case 'dizang':
            if (currentQuestData.matches >= 2 && currentQuestData.questionPassed) {
                passed = true;
                // 地藏庵特權：獲得平安符 x1
                state.inventory.dizang += 1;
                updateInventoryUI();
                showToast("【獲得寶物】\n大眾爺庇佑，獲得『平安符 x1』！可用於抵擋惡靈答錯的扣分懲罰。");
            } else {
                showToast("您尚未配對官將首兵器，或尚未回答新莊大拜拜問題！");
            }
            break;
            
        case 'drum':
            if (currentQuestData.questionPassed && currentQuestData.drumHits >= 3) {
                passed = true;
            } else {
                showToast("您尚未排序製鼓步驟，或尚未敲擊大鼓完成定音！");
            }
            break;
            
        case 'alley-theater':
        case 'alley-rice':
        case 'alley-water':
            if (currentQuestData.questionPassed) {
                passed = true;
            } else {
                showToast("您尚未完成本巷弄的歷史挑戰答題！");
            }
            break;
    }
    
    if (passed) {
        // 1. 移入已完成
        state.completedStages.push(stageId);
        
        // 2. 加分
        let scoreReward = 100;
        if (stageId.startsWith('alley-')) scoreReward = 50; // 巷弄支線 50 分
        modifyScore(scoreReward);
        
        // 3. 頒發勳章
        const config = stagesConfig[stageId];
        state.badges.push(config.badge);

        // 4. 保存這一關的田野學習證據
        state.evidenceRecords.push({
            stageId,
            stageTitle: config.title.split('：')[0],
            ...currentQuestData.evidence,
            time: new Date().toLocaleTimeString()
        });
        
        // 5. 成果牆優先使用學生實拍；非拍照關卡使用關卡情境圖
        state.photos.push({
            stageTitle: config.title.split('：')[0],
            badgeName: config.badge,
            src: currentQuestData.evidence.type === 'photo'
                ? currentQuestData.evidence.dataUrl
                : `assets/images/${stageMediaConfig[stageId].image}`,
            time: new Date().toLocaleTimeString()
        });
        
        // 6. 解鎖地圖連帶點
        updateMapStagesState();

        // 7. 保存完整進度（含勳章、成果牆、田野紀錄）
        saveProgress();

        showToast(`【破解成功】\n挑戰完成！\n小隊獲得積分 +${scoreReward}，並榮獲『${config.badge}』勳章！`);
        closeQuestModal();
        
        // 檢查是否所有 3 個主線與 5 個支線都完成，以顯示終極挑戰
        checkGameCompletion();
    }
}

// 根據完成狀態更新 SVG 地圖的鎖定狀態
function updateMapStagesState() {
    // 遍歷所有 Marker
    document.querySelectorAll('.map-marker').forEach(marker => {
        const stageId = marker.id.replace('marker-', '');
        
        // 檢查當前關卡是否已解鎖，已解鎖則移除 locked
        if (state.unlockedStages.includes(stageId)) {
            marker.classList.remove('locked');
        }
    });
}

// 檢查遊戲是否可進入終極挑戰
function checkGameCompletion() {
    // 如果 3 大主線 (temple-ciyou, temple-wusheng, bakery) 都完成了，就可以解鎖終極挑戰！
    const mainStages = ['temple-ciyou', 'temple-wusheng', 'bakery'];
    const allMainDone = mainStages.every(s => state.completedStages.includes(s));
    
    if (allMainDone) {
        document.getElementById('btn-final-container').style.display = 'block';
    }
}


// 7. 🏆 終極挑戰與成果學習單
function triggerFinalChallenge() {
    triggerClickSfx();
    
    // 四個終極問題對答 Modal
    const config = {
        title: "🏆 終極考驗：新莊老街小小守護者認證",
        desc: "探險小隊，你們已經實地踏查了老街的街角巷弄。現在，請回答以下 4 個由大眾爺與媽祖婆設下的終極歷史提問，以獲得完整認證！"
    };
    
    currentStageId = 'final';
    currentQuestData = { currentQ: 1, correctCount: 0 };
    
    const body = document.getElementById('quest-body-container');
    const footer = document.getElementById('quest-footer-container');
    
    body.innerHTML = `
        <div class="quest-intro-text">${config.desc}</div>
        <div id="final-question-container"></div>
    `;
    
    footer.innerHTML = ``; // 答案點擊後自動跳下一題
    
    renderFinalQuestion(1);
    document.getElementById('modal-quest').classList.add('active');
}

const finalQuestions = [
    {
        q: "1. 請問新莊最古老的廟宇是哪一間？祂的大門上畫有哪兩位威嚴將軍門神，且角落藏有象徵飛來福氣的蝙蝠？",
        feedback: "慈祐宮的門神負責守護入口，蝙蝠木雕則利用蝠與福的諧音傳達祝願。你們把廟宇身分、人物與裝飾線索整合得很好。",
        hint: "回想哪座媽祖廟同時出現秦叔寶、尉遲恭與象徵福氣的蝙蝠木雕。",
        options: [
            { text: "A. 新莊武聖廟", correct: false },
            { text: "B. 新莊地藏庵", correct: false },
            { text: "C. 新莊慈祐宮", correct: true }
        ]
    },
    {
        q: "2. 請問北部最早的關帝廟（武聖廟），為什麼大門上沒有畫任何門神，而是使用 108 顆金色門釘？",
        feedback: "關公本身被視為威武的守護者，因此不需要另外繪製門神；一百零八顆門釘也進一步呈現關帝信仰的尊貴地位。",
        hint: "不要只從修繕或經費推理，請把關公的武神身分和大門的尊貴規格放在一起思考。",
        options: [
            { text: "A. 因為當時大門彩繪褪色，沒錢修復", correct: false },
            { text: "B. 因為關公本人即是超強戰神，不需要別的門神保護", correct: true },
            { text: "C. 為了展現古代帝王不喜歡畫像的習慣", correct: false }
        ]
    },
    {
        q: "3. 當小隊要進入老街廟宇進行參觀時，應該遵守哪種有禮貌的魔法進出路線？",
        feedback: "面向廟宇時由右側龍門進、左側虎門出，同時避開中央神道，這不只是方向題，也是尊重信仰空間的參觀禮儀。",
        hint: "先站在面向廟宇的位置分辨左右，並記得中央通道通常保留給神明。",
        options: [
            { text: "A. 走左手邊的虎門進入，從右手邊的龍門出來", correct: false },
            { text: "B. 走中央神明專用的神道進出，最顯得威武", correct: false },
            { text: "C. 走右手邊的龍門進入（迎好運），從左手邊的虎門出來（保平安）", correct: true }
        ]
    },
    {
        q: "4. 新莊老街上創立超過 150 年的老店『老順香』，其代表性美食『鹹光餅』中間有一個洞，其歷史典故是？",
        feedback: "餅中央的孔洞方便用繩串起攜帶，顯示食物造型會配合軍人行軍需求。今天吃到的老街點心，也可能是一份生活史證據。",
        hint: "想像軍人長途行軍時雙手需要拿武器，乾糧要如何攜帶才不會妨礙行動。",
        options: [
            { text: "A. 古代軍人打仗時方便用繩子串在脖子上當作乾糧", correct: true },
            { text: "B. 為了減少麵粉的使用量，節省成本", correct: false },
            { text: "C. 模仿外國的貝果甜甜圈設計，方便油炸", correct: false }
        ]
    }
];

function renderFinalQuestion(qIndex) {
    const qData = finalQuestions[qIndex - 1];
    const container = document.getElementById('final-question-container');
    
    container.innerHTML = `
        <div style="background-color: var(--color-card); padding: 15px; border-radius: var(--radius-md); border: 1px solid var(--color-border); margin-bottom: 20px;">
            <p style="font-weight: bold; font-size: 1.05rem; line-height: 1.5; color: var(--color-accent);">${qData.q}</p>
        </div>
        <div class="option-list">
            ${qData.options.map((opt, i) => `
                <button class="option-btn" onclick="submitFinalAnswer(${i}, ${opt.correct})">${opt.text}</button>
            `).join('')}
        </div>
        <p style="text-align: right; font-size: 0.8rem; color: var(--color-text-muted);">進度：${qIndex} / 4</p>
    `;
}

function submitFinalAnswer(optIndex, isCorrect) {
    const answeredQuestion = finalQuestions[currentQuestData.currentQ - 1];
    if (isCorrect) {
        const message = giveContextFeedback('correct', answeredQuestion.feedback);
        currentQuestData.correctCount++;
        showToast(message);
    } else {
        const message = giveContextFeedback('wrong', answeredQuestion.hint);
        modifyHp(-10); // 答錯扣 10 體力
        showToast(message);
    }
    
    currentQuestData.currentQ++;
    if (currentQuestData.currentQ <= 4) {
        renderFinalQuestion(currentQuestData.currentQ);
    } else {
        // 完成終極考驗
        closeQuestModal();
        showFinalReport();
    }
}

// 顯示終極認證發表與 PDF 下載頁
function showFinalReport() {
    // 1. 積分結算
    const timeSpent = Math.round((new Date() - state.startTime) / 1000 / 60); // 單位：分鐘
    const finalScore = state.score + currentQuestData.correctCount * 50; // 每對一題終極題加 50 分
    
    document.getElementById('report-final-score').innerText = finalScore;
    
    // 2. 稱號結算
    let titleText = "老街時空旅人";
    if (state.role === 'decoder') titleText = "新莊歷史解碼師";
    else if (state.role === 'surveyor') titleText = "古蹟建築測量家";
    else if (state.role === 'folklorist') titleText = "傳統民俗工藝員";
    document.getElementById('report-team-desc').innerText = `${state.teamName} · ${titleText}`;
    
    // 3. 渲染勳章牆
    const badgeContainer = document.getElementById('badge-display-container');
    badgeContainer.innerHTML = '';
    
    // 遊戲中所有可能的勳章與對應 Icon
    const allBadges = [
        { name: "禮儀之星", icon: "🎖️" },
        { name: "慈祐守護者", icon: "媽" },
        { name: "正義武聖", icon: "關" },
        { name: "美食調查員", icon: "餅" },
        { name: "族群和解大使", icon: "石" },
        { name: "文昌狀元", icon: "筆" },
        { name: "時空哨兵", icon: "哨" },
        { name: "民俗小專家", icon: "首" },
        { name: "製鼓傳人", icon: "鼓" },
        { name: "曲藝達人", icon: "戲" },
        { name: "大力挑夫", icon: "米" },
        { name: "水源守護者", icon: "水" }
    ];
    
    allBadges.forEach(b => {
        const hasIt = state.badges.includes(b.name);
        const item = document.createElement('div');
        item.className = `badge-item ${hasIt ? '' : 'grayed'}`;
        item.innerHTML = `
            <div class="badge-medal">${b.icon}</div>
            <div class="badge-name">${b.name}</div>
        `;
        badgeContainer.appendChild(item);
    });
    
    // 4. 渲染實拍與關卡情境成果牆
    const photoContainer = document.getElementById('photo-display-container');
    photoContainer.innerHTML = '';
    
    state.photos.forEach(p => {
        const item = document.createElement('div');
        item.className = 'photo-item';
        item.innerHTML = `
            <img src="${p.src}" alt="${p.stageTitle}探索成果">
            <div class="photo-caption">${p.badgeName}</div>
        `;
        photoContainer.appendChild(item);
    });
    
    // 5. 填寫學習總結表格
    const tableBody = document.getElementById('learning-table-body');
    tableBody.innerHTML = '';
    
    // 將所有關卡渲染進表格
    Object.keys(stagesConfig).forEach(stageId => {
        const config = stagesConfig[stageId];
        const isDone = state.completedStages.includes(stageId);
        
        let learningFocus = "進廟禮儀與古蹟鐘鼓定位";
        if (stageId === 'temple-ciyou') learningFocus = "媽祖文化與門神將軍、蝙蝠木雕";
        else if (stageId === 'temple-wusheng') learningFocus = "關帝信仰與108金色門釘、無龍柱原因";
        else if (stageId === 'bakery') learningFocus = "鹹光餅與軍人乾糧歷史典故";
        else if (stageId === 'temple-guangfu') learningFocus = "粵籍客家信仰與閩粵衝突示禁碑拓印";
        else if (stageId === 'temple-wenchang') learningFocus = "林泉書院與祿馬殿求功名傳統";
        else if (stageId === 'temple-chaojiang') learningFocus = "水運瞭望台防禦功能與雙重信仰結構";
        else if (stageId === 'dizang') learningFocus = "地藏信仰與官將首發源、新莊大拜拜";
        else if (stageId === 'drum') learningFocus = "手工製鼓工序與擊鼓節奏調音";
        else if (stageId === 'alley-theater') learningFocus = "戲館巷曲藝與南北管布袋戲傳承";
        else if (stageId === 'alley-rice') learningFocus = "米市巷與大漢溪水運稻米出口";
        else if (stageId === 'alley-water') learningFocus = "挑水巷與常民生活水源獲取";
        
        const row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight:bold;">${config.title.split('：')[0]}</td>
            <td>${learningFocus}</td>
            <td style="color: ${isDone ? 'var(--color-secondary)' : '#666'}; font-weight:bold;">
                ${isDone ? '✅ 成功守護' : '❌ 未探索'}
            </td>
        `;
        tableBody.appendChild(row);
    });
    
    // 切換至成果發表 Screen
    showScreen('screen-report');
}

// 重新開始遊戲
function restartGame() {
    triggerClickSfx();

    // 清除存檔，避免重整後又回到舊進度
    clearProgress();

    // 重設狀態
    state.score = 0;
    state.hp = 100;
    state.inventory = { bakery: 0, wenchang: 0, dizang: 0 };
    state.unlockedStages = ['tutorial'];
    state.completedStages = [];
    state.badges = [];
    state.currentGps = 'tutorial';
    state.photos = [];
    state.evidenceRecords = [];
    
    // 更新 UI
    updateInventoryUI();
    modifyHp(0);
    modifyScore(0);
    
    // 重設 SVG 地圖鎖定
    document.querySelectorAll('.map-marker').forEach(marker => {
        const stageId = marker.id.replace('marker-', '');
        if (stageId !== 'tutorial') {
            marker.classList.add('locked');
        }
    });
    
    // 重設 GPS Panel 選取
    document.querySelectorAll('.gps-buttons .btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector('.gps-buttons .btn[onclick*="tutorial"]').classList.add('active');
    document.getElementById('gps-status').innerText = "目前位置：模擬廟埕廣場 (已解鎖新手關)";
    document.getElementById('btn-final-container').style.display = 'none';
    
    showScreen('screen-loading');
}
