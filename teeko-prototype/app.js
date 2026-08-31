(() => {
  "use strict";

  const STORAGE_KEY = "teeko-c-prototype-v2";
  const CHANNEL_KEY = "teeko-classroom-prototype-v2";
  const app = document.querySelector("#app");
  const toastRegion = document.querySelector("#toast-region");
  const DEFAULT_QUESTION_COUNT = 6;
  const MAX_QUESTION_COUNT = 25;

  const questions = [
    {
      id: "q1",
      type: "單選題",
      text: "當平行光線通過凸透鏡後，光線會如何前進？",
      options: ["向外發散", "會聚於焦點", "沿原方向前進", "完全被吸收"],
      answer: [1],
      explanation: "凸透鏡會令平行光線折射並會聚於主焦點。"
    },
    {
      id: "q2",
      type: "多選題",
      text: "以下哪些物品會運用凸透鏡？",
      options: ["放大鏡", "相機鏡頭", "近視眼鏡", "顯微鏡"],
      answer: [0, 1, 3],
      explanation: "放大鏡、相機及顯微鏡均會利用凸透鏡聚光或成像。"
    },
    {
      id: "q3",
      type: "判斷題",
      text: "物件放在凸透鏡焦點內，可能形成放大的虛像。",
      options: ["正確", "錯誤"],
      answer: [0],
      explanation: "物件位於焦點內時，可透過凸透鏡看到正立放大的虛像。"
    },
    {
      id: "q4",
      type: "單選題",
      text: "焦距較短的凸透鏡，通常有甚麼特點？",
      options: ["聚光能力較強", "完全不折射", "只能形成虛像", "厚度一定較薄"],
      answer: [0],
      explanation: "焦距較短通常代表透鏡的聚光能力較強。"
    },
    {
      id: "q5",
      type: "單選題",
      text: "要在白紙上取得清晰實像，應該調整哪一項？",
      options: ["紙張顏色", "光源音量", "透鏡與白紙距離", "室內溫度"],
      answer: [2],
      explanation: "調整透鏡和屏幕的距離，才能令影像在屏幕上聚焦。"
    },
    {
      id: "q6",
      type: "判斷題",
      text: "投票和信號燈的結果會被計算為正式題正確率。",
      options: ["正確", "錯誤"],
      answer: [1],
      explanation: "投票和信號燈是獨立課堂工具，不會計入正式題正確率。"
    }
  ];

  const cityQuestions = [
    { id: "city-q1", type: "單選題", text: "Which phrase is the most polite way to ask for directions?", options: ["Tell me the station.", "Could you show me the way to the station?", "Where station?", "You go there."], answer: [1], explanation: "Could you show me the way is a polite and complete request." },
    { id: "city-q2", type: "多選題", text: "Which words can describe a place in a city?", options: ["crowded", "quiet", "convenient", "deliciously"], answer: [0, 1, 2], explanation: "Crowded, quiet and convenient can all describe a city place." },
    { id: "city-q3", type: "判斷題", text: "Turn left at the library gives an instruction about direction.", options: ["True", "False"], answer: [0], explanation: "The sentence tells someone where to turn." },
    { id: "city-q4", type: "單選題", text: "If the café is opposite the park, where is it?", options: ["Across from the park", "Inside the park", "Behind the speaker", "Under the road"], answer: [0], explanation: "Opposite means across from another place." },
    { id: "city-q5", type: "單選題", text: "Which sentence clearly describes a location?", options: ["The museum is beside the bank.", "The museum yesterday.", "Beside very quickly.", "Bank the museum."], answer: [0], explanation: "The first sentence uses a complete structure and a location phrase." },
    { id: "city-q6", type: "判斷題", text: "You can use ‘Could you repeat that, please?’ when you do not hear clearly.", options: ["True", "False"], answer: [0], explanation: "The sentence is a polite request for someone to say something again." }
  ];

  const historyQuestions = [
    { id: "history-q1", type: "單選題", text: "時間軸最適合幫助我們理解哪一項資訊？", options: ["事件的先後次序", "人物的聲線", "建築物的重量", "課室的溫度"], answer: [0], explanation: "時間軸用來整理事件發生的先後及彼此關係。" },
    { id: "history-q2", type: "多選題", text: "研究香港城市變遷時，可參考哪些歷史材料？", options: ["舊地圖", "人口統計", "歷史照片", "未經說明的想像圖"], answer: [0, 1, 2], explanation: "舊地圖、統計和照片都可作為互相印證的歷史材料。" },
    { id: "history-q3", type: "判斷題", text: "比較不同年代的地圖，可以觀察城市範圍的變化。", options: ["正確", "錯誤"], answer: [0], explanation: "跨年代地圖能呈現海岸線、道路及建成區的轉變。" },
    { id: "history-q4", type: "單選題", text: "分析歷史變遷時，為甚麼要比較多種史料？", options: ["互相印證並補充不同角度", "令答案變得更長", "避免閱讀任何文字", "只保留單一觀點"], answer: [0], explanation: "多種史料可提供不同角度，並幫助檢查證據是否一致。" },
    { id: "history-q5", type: "單選題", text: "若舊地圖與文字記錄出現差異，最合適的做法是甚麼？", options: ["查找更多同期史料", "只接受其中一份", "忽略所有證據", "按個人印象決定"], answer: [0], explanation: "應繼續查找同期資料，比較來源和背景後再作判斷。" },
    { id: "history-q6", type: "判斷題", text: "人口統計可以協助我們理解城市發展的規模。", options: ["正確", "錯誤"], answer: [0], explanation: "人口數量及分布變化是觀察城市發展規模的重要資料。" }
  ];

  function generatedQuestionsFor({ title, subject, language }) {
    if (subject === "英文" || language === "英文") return structuredClone(cityQuestions);
    if (subject === "歷史") return structuredClone(historyQuestions);
    const topic = title || subject || "本課內容";
    return [
      { id: `ai-q1-${Date.now()}`, type: "單選題", text: `以下哪一項最能概括「${topic}」的核心學習重點？`, options: ["作品中反覆說明的主要概念", "與本課無關的生活細節", "沒有證據支持的猜測", "只記住畫面顏色"], answer: [0], explanation: "應根據作品中的主要概念及例證作答。" },
      { id: `ai-q2-${Date.now()}`, type: "多選題", text: `學習「${topic}」時，哪些方法有助檢查理解？`, options: ["用自己的話重述", "把概念應用到新例子", "比較例子與反例", "略過所有關鍵步驟"], answer: [0, 1, 2], explanation: "重述、遷移和比較都能幫助教師檢查概念理解。" },
      { id: `ai-q3-${Date.now()}`, type: "判斷題", text: "能把本課概念應用到新情境，通常代表理解不只停留在記憶。", options: ["正確", "錯誤"], answer: [0], explanation: "把概念遷移到新情境是理解的重要表現。" },
      { id: `ai-q4-${Date.now()}`, type: "單選題", text: "遇到不確定的答案時，最合適的下一步是甚麼？", options: ["回到作品中的證據再判斷", "隨機選擇", "忽略題目條件", "只看答案長短"], answer: [0], explanation: "應回到內容和證據，逐項檢查題目條件。" },
      { id: `ai-q5-${Date.now()}`, type: "單選題", text: `以下哪一個例子最適合用來解釋「${topic}」？`, options: ["能呈現核心概念的具體例子", "與本課無關的資料", "沒有條件的猜測", "只重複題目字句"], answer: [0], explanation: "有效例子應能具體呈現作品中的核心概念。" },
      { id: `ai-q6-${Date.now()}`, type: "判斷題", text: `只要記住「${topic}」的名稱，就等同於理解整個概念。`, options: ["正確", "錯誤"], answer: [1], explanation: "理解還包括解釋、比較和應用，不能只停留在記住名稱。" }
    ];
  }

  function questionBatchFor(work) {
    const template = work.subject === "科學" ? questions : generatedQuestionsFor(work);
    const stamp = Date.now();
    return clone(template).slice(0, DEFAULT_QUESTION_COUNT).map((question, index) => ({
      ...question,
      id: `ai-${stamp}-${index + 1}`
    }));
  }

  const resources = [
    {
      id: "r1",
      title: "凸透鏡與成像實驗",
      subject: "科學",
      language: "繁體中文",
      type: "互動 HTML",
      description: "透過可調焦距的模擬實驗，帶領學生理解實像、虛像與生活應用。",
      cover: "physics"
    },
    {
      id: "r2",
      title: "City Voices 城市英語任務",
      subject: "英文",
      language: "英文",
      type: "情境遊戲",
      description: "在城市任務中練習問路、描述位置和日常對話。",
      cover: "english"
    },
    {
      id: "r3",
      title: "香港開埠與城市變遷",
      subject: "歷史",
      language: "繁體中文",
      type: "時間軸",
      description: "以地圖和時間軸探索十九世紀香港的城市發展。",
      cover: "history-cover"
    },
    {
      id: "r4",
      title: "分數加法視覺實驗室",
      subject: "數學",
      language: "繁體中文",
      type: "互動模型",
      description: "用圖像分割與拖動示範理解同分母及異分母分數加法。",
      cover: "physics"
    },
    {
      id: "r5",
      title: "古詩中的聲音與畫面",
      subject: "中國語文",
      language: "繁體中文",
      type: "動畫課件",
      description: "以聲景和插畫拆解詩句的節奏、意象與情感。",
      cover: "history-cover"
    },
    {
      id: "r6",
      title: "Our Changing Climate",
      subject: "地理",
      language: "英文",
      type: "資料故事",
      description: "Read climate data through maps, charts and guided classroom prompts.",
      cover: "english"
    }
  ];

  const defaultState = {
    version: 2,
    authenticated: false,
    activated: false,
    teacher: {
      name: "陳芷晴",
      email: "teacher@teeko.hk",
      entitlement: "2027 年 7 月 31 日"
    },
    favorites: ["r2"],
    prep: {
      subject: "",
      language: "",
      requirements: "",
      file: null,
      reportContext: null
    },
    generation: {
      status: "idle",
      progress: 0,
      stage: 0,
      mode: "new",
      workId: "w-new",
      resourceId: null,
      draft: null
    },
    reportTask: {
      status: "idle",
      progress: 0
    },
    works: [
      {
        id: "w1",
        title: "凸透鏡：光線如何成像？",
        subject: "科學",
        language: "繁體中文",
        type: "互動 HTML",
        updatedAt: "今天 09:42",
        pages: 6,
        cover: "physics",
        source: "獨立備課",
        versionId: "ver-lens-003",
        hostedUrl: "https://61645698-1600-400a-946d-1a2d7727cf01.hwgz.zhique.cn/7fb9a3b5-23b1-4dc0-9d7e-936c30a26bea/index.html",
        summary: "透過折射光線與焦距調整實驗，理解凸透鏡的成像規律及生活應用。",
        questions: structuredClone(questions)
      },
      {
        id: "w2",
        title: "City Voices 城市英語任務",
        subject: "英文",
        language: "英文",
        type: "情境遊戲",
        updatedAt: "昨天 16:18",
        pages: 5,
        cover: "english",
        source: "平台資源個人版本",
        versionId: "ver-city-002",
        hostedUrl: "https://a.zhique.cn/home",
        summary: "透過城市情境任務練習問路、描述位置及日常英語對話。",
        questions: structuredClone(cityQuestions)
      },
      {
        id: "w3",
        title: "香港開埠與城市變遷",
        subject: "歷史",
        language: "繁體中文",
        type: "時間軸 HTML",
        updatedAt: "8 月 24 日",
        pages: 7,
        cover: "history-cover",
        source: "獨立備課",
        versionId: "ver-history-001",
        hostedUrl: "https://a.zhique.cn/home",
        summary: "以地圖和時間軸理解十九世紀香港的城市發展及社會轉變。",
        questions: structuredClone(historyQuestions)
      }
    ],
    classroom: {
      id: "c1",
      code: "834219",
      status: "waiting",
      workId: "w1",
      participants: 23,
      online: 21,
      page: 2,
      total: 6,
      snapshot: null,
      playing: false,
      focus: 46,
      active: null,
      rounds: [],
      createdAt: null,
      startedAt: null,
      endedAt: null
    },
    student: {
      joined: false,
      anonymousId: "024",
      selection: [],
      submitted: false,
      answers: {},
      questionIndex: 0,
      completed: false,
      reviewing: false,
      connected: true,
      resultDismissed: false
    },
    report: {
      id: "rep1",
      workId: "w1",
      title: "凸透鏡：光線如何成像？",
      subject: "科學",
      language: "繁體中文",
      workVersionId: "ver-lens-003",
      date: "2026 年 8 月 27 日 10:15",
      participants: 24,
      duration: "38 分鐘",
      questionRounds: 3,
      responseRate: 92,
      accuracy: 76,
      rounds: [
        { id: "sample-q1", type: "question", title: "當平行光線通過凸透鏡後，光線會如何前進？", responses: 23, accuracy: 85 },
        { id: "sample-q2", type: "question", title: "以下哪些物品會運用凸透鏡？", responses: 22, accuracy: 58 },
        { id: "sample-q3", type: "question", title: "物件在焦點內可能形成放大的虛像。", responses: 23, accuracy: 83 },
        { id: "sample-poll", type: "poll", title: "下一步想先看示範還是先討論？", responses: 24 },
        { id: "sample-signal", type: "signal", title: "目前掌握得怎樣？", responses: 24 }
      ],
      status: "ready"
    }
  };

  const ui = {
    loginEmail: "",
    loginError: "",
    activationCode: "",
    activationStatus: "idle",
    activationError: "",
    prepErrors: {},
    workTab: "content",
    resourceTab: "all",
    resourceSearch: "",
    modal: null,
    drawer: null,
    generationTimer: null,
    reportTimer: null,
    pollOptions: ["選項 A", "選項 B"],
    reportFeedback: ["question", "signal"],
    studentLocalSelection: null,
    selectedQuestionIds: [],
    questionGeneration: null,
    contentRevision: null,
    contentRevisionTimer: null,
    guideOpen: false,
    workFilter: "all",
    workPage: 2
  };

  function clone(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return clone(defaultState);
      const parsed = JSON.parse(raw);
      if (parsed.version !== 2) return clone(defaultState);
      return parsed;
    } catch (error) {
      return clone(defaultState);
    }
  }

  let state = loadState();
  state.generation = { ...clone(defaultState.generation), ...(state.generation || {}) };
  state.works = (state.works || clone(defaultState.works)).map(work => ({
    versionId: `ver-${work.id || Date.now()}`,
    hostedUrl: "https://a.zhique.cn/home",
    summary: "由 AI 根據教師要求建立的互動教學作品。",
    ...work
  }));
  const cityWork = state.works.find(work => work.id === "w2");
  if (cityWork?.questions?.[0]?.id === "q1") cityWork.questions = structuredClone(cityQuestions);
  const historyWork = state.works.find(work => work.id === "w3");
  if (historyWork?.questions?.[0]?.id?.startsWith("q")) historyWork.questions = structuredClone(historyQuestions);
  state.classroom = { ...clone(defaultState.classroom), ...(state.classroom || {}) };
  state.student = { ...clone(defaultState.student), ...(state.student || {}) };
  state.student.answers = state.student.answers || {};
  state.student.questionIndex = Number.isFinite(state.student.questionIndex) ? state.student.questionIndex : 0;
  state.student.completed = Boolean(state.student.completed);
  state.student.reviewing = Boolean(state.student.reviewing);
  state.report = { ...clone(defaultState.report), ...(state.report || {}) };
  const channel = "BroadcastChannel" in window ? new BroadcastChannel(CHANNEL_KEY) : null;

  function persist({ broadcast = true } = {}) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    if (broadcast && channel) channel.postMessage(clone(state));
  }

  if (channel) {
    channel.addEventListener("message", event => {
      if (!event.data || event.data.version !== 2) return;
      state = event.data;
      render();
    });
  }

  window.addEventListener("storage", event => {
    if (event.key !== STORAGE_KEY || !event.newValue) return;
    try {
      state = JSON.parse(event.newValue);
      render();
    } catch (error) {
      return;
    }
  });

  function escapeHTML(value = "") {
    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function routeInfo() {
    const raw = (location.hash || "#/signin").slice(1);
    const [pathPart, queryPart = ""] = raw.split("?");
    return {
      path: pathPart || "/signin",
      query: new URLSearchParams(queryPart)
    };
  }

  function navigate(path) {
    const next = path.startsWith("/") ? path : `/${path}`;
    if (location.hash === `#${next}`) {
      render();
      return;
    }
    location.hash = next;
  }

  function showToast(message) {
    const toast = document.createElement("div");
    toast.className = "toast";
    toast.textContent = message;
    toastRegion.append(toast);
    window.setTimeout(() => toast.remove(), 2800);
  }

  function brandLockup({ light = false, compact = false } = {}) {
    return `
      <span class="brand-lockup ${light ? "is-light" : ""}">
        <span class="brand-mark" ${compact ? 'style="width:36px;height:36px;border-radius:12px"' : ""}>
          <img src="./assets/teeko-brand-mark.png" alt="" />
        </span>
        <span>
          <span class="brand-word">TEEKO</span>
          <span class="brand-meta">Hong Kong · AI Lesson Studio</span>
        </span>
      </span>`;
  }

  function button(label, action, variant = "primary", extra = "") {
    const customClass = extra.match(/class="([^"]*)"/);
    const classes = customClass ? customClass[1] : `btn btn-${variant}`;
    const attributes = customClass ? extra.replace(customClass[0], "") : extra;
    return `<button type="button" class="${classes}" data-action="${action}" ${attributes}>${label}</button>`;
  }

  const navItems = [
    { key: "home", label: "首頁", route: "/home" },
    { key: "prepare", label: "備課", route: "/prepare" },
    { key: "resources", label: "資源", route: "/resources" },
    { key: "works", label: "作品", route: "/works" },
    { key: "history", label: "課堂", route: "/history" }
  ];

  function navIcon(key) {
    const paths = {
      home: '<path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10.5V20h13v-9.5"/><path d="M9 20v-6h6v6"/>',
      prepare: '<path d="m15 4 5 5L9 20l-6 1 1-6Z"/><path d="m13 6 5 5"/><path d="M3 3h6"/>',
      resources: '<circle cx="12" cy="12" r="9"/><path d="m15.5 8.5-2 5-5 2 2-5Z"/>',
      works: '<path d="M3 7h6l2 2h10v10H3Z"/><path d="M3 7V5h7l2 2"/>',
      history: '<path d="M4 19V9"/><path d="M10 19V5"/><path d="M16 19v-7"/><path d="M22 19H2"/>'
    };
    return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[key] || paths.home}</svg>`;
  }

  function navMarkup(active, mobile = false) {
    const links = navItems.map(item => `
      <button type="button" class="rail-link ${active === item.key ? "is-active" : ""}" data-action="navigate" data-route="${item.route}" aria-label="${item.label}" ${active === item.key ? 'aria-current="page"' : ""}>
        <span class="nav-symbol">${navIcon(item.key)}</span>
        <span>${item.label}</span>
      </button>`).join("");
    if (mobile) return `<nav class="mobile-nav" aria-label="主要導覽">${links}</nav>`;
    return `
      <aside class="side-rail">
        <button type="button" class="rail-brand" data-action="navigate" data-route="/home" aria-label="返回 Teeko 首頁">
          <span class="brand-mark"><img src="./assets/teeko-brand-mark.png" alt="Teeko" /></span>
        </button>
        <nav class="rail-nav" aria-label="主要導覽">${links}</nav>
        <div class="rail-account">
          <button type="button" class="rail-link ${active === "account" ? "is-active" : ""}" data-action="navigate" data-route="/account" aria-label="帳號與權益" ${active === "account" ? 'aria-current="page"' : ""}>
            <span class="avatar">陳</span>
            <span>我的</span>
          </button>
        </div>
      </aside>`;
  }

  function teacherShell({ title, active, content, wide = false, topActions = "" }) {
    return `
      <div class="app-root platform-shell">
        ${navMarkup(active)}
        ${navMarkup(active, true)}
        <main class="platform-content">
          <header class="topbar">
            <div class="topbar-title">${escapeHTML(title)}</div>
            <div class="topbar-actions">
              <button type="button" class="status-pill" data-action="navigate" data-route="/account">
                <span class="dot" style="color:#20a588"></span>
                權益有效
              </button>
              ${topActions}
              <button type="button" class="avatar" data-action="navigate" data-route="/account" aria-label="帳號與權益">陳</button>
            </div>
          </header>
          ${content}
        </main>
        <button type="button" class="quick-guide" data-action="show-guide" aria-label="查看原型導覽">?</button>
      </div>`;
  }

  function pageHead(eyebrow, title, description, actions = "") {
    return `
      <div class="page-head">
        <div>
          <p class="eyebrow">${escapeHTML(eyebrow)}</p>
          <h1 class="home-display">${escapeHTML(title)}</h1>
          <p>${escapeHTML(description)}</p>
        </div>
        ${actions ? `<div class="button-row">${actions}</div>` : ""}
      </div>`;
  }

  function workById(id) {
    return state.works.find(work => work.id === id)
      || (state.generation.draft?.id === id ? state.generation.draft : null);
  }

  function isSavedWork(work) {
    return Boolean(work && state.works.some(item => item.id === work.id));
  }

  function markWorkChanged(work) {
    work.updatedAt = "剛剛";
    if (isSavedWork(work)) work.pendingSave = true;
  }

  function saveGeneratedDraft(workId) {
    if (state.works.some(work => work.id === workId)) return true;
    const draft = state.generation.draft;
    if (!draft || draft.id !== workId) return false;
    draft.updatedAt = "剛剛";
    delete draft.pendingSave;
    state.works.unshift(draft);
    state.generation.draft = null;
    return true;
  }

  function snapshotForWork(work) {
    return {
      work: {
        id: work.id,
        title: work.title,
        subject: work.subject,
        language: work.language,
        type: work.type,
        updatedAt: work.updatedAt,
        pages: work.pages,
        cover: work.cover,
        source: work.source,
        versionId: work.versionId,
        hostedUrl: work.hostedUrl,
        summary: work.summary
      },
      questions: clone(work.questions)
    };
  }

  function classroomWork() {
    return state.classroom.snapshot?.work || workById(state.classroom.workId);
  }

  function classroomQuestions() {
    return state.classroom.snapshot?.questions || workById(state.classroom.workId).questions;
  }

  function activeQuestionIds(active = state.classroom.active) {
    if (!active || active.type !== "question") return [];
    if (Array.isArray(active.questionIds) && active.questionIds.length) return active.questionIds;
    return active.questionId ? [active.questionId] : [];
  }

  function publishedQuestionIds() {
    return new Set(
      state.classroom.rounds
        .filter(round => round.type === "question")
        .flatMap(round => Array.isArray(round.questionIds) && round.questionIds.length ? round.questionIds : [round.questionId])
        .filter(Boolean)
    );
  }

  function isExactAnswer(question, selected = []) {
    const normalizedSelected = [...selected].sort((a, b) => a - b);
    const normalizedAnswer = [...(question?.answer || [])].sort((a, b) => a - b);
    return normalizedSelected.length === normalizedAnswer.length
      && normalizedSelected.every((value, index) => value === normalizedAnswer[index]);
  }

  function recordActiveInteraction(active = state.classroom.active) {
    if (!active) return;
    const existingIndex = state.classroom.rounds.findIndex(round => round.id === active.id);
    if (existingIndex >= 0) state.classroom.rounds[existingIndex] = clone(active);
    else state.classroom.rounds.push(clone(active));
  }

  function resourceById(id) {
    return resources.find(resource => resource.id === id) || resources[0];
  }

  function authBrand() {
    return `
      <section class="auth-brand" aria-label="Teeko 教學伙伴">
        ${brandLockup({ light: true })}
        <div class="auth-story">
          <p class="eyebrow" style="color:#8ed5c8">你的教學節奏</p>
          <h1 class="home-display">讓每一堂課，接得上下一堂。</h1>
          <p>從教學想法到互動課堂，再把整體回饋帶回備課。Teeko 幫你把每一步自然接起來。</p>
          <div class="auth-points">
            <div class="auth-point"><span class="auth-check">✓</span><span>AI 生成可直接授課的教學作品</span></div>
            <div class="auth-point"><span class="auth-check">✓</span><span>學生匿名掃碼，平板只讀跟隨內容</span></div>
            <div class="auth-point"><span class="auth-check">✓</span><span>整體課堂報告承接下一次備課</span></div>
          </div>
        </div>
        <div class="auth-foot">Teeko · 從教學想法走到課堂成效</div>
      </section>`;
  }

  function renderSignin() {
    return `
      <main class="auth-page">
        ${authBrand()}
        <section class="auth-form-wrap">
          <div class="auth-card" id="signin-card">
            <p class="eyebrow">教師帳號</p>
            <h2>登入你的教學空間</h2>
            <p>使用教師個人帳號進入。學生無需登入，只需掃描當堂二維碼。</p>
            <div class="field">
              <label class="field-label" for="login-email">電郵地址</label>
              <input id="login-email" class="input ${ui.loginError ? "is-error" : ""}" type="email" placeholder="name@example.com" value="${escapeHTML(ui.loginEmail)}" data-ui-field="loginEmail" autocomplete="email" />
              ${ui.loginError ? `<span class="field-error">${escapeHTML(ui.loginError)}</span>` : `<span class="field-hint">示範原型不會發送或儲存真實電郵。</span>`}
            </div>
            <div class="demo-account">
              <div>
                <strong>使用示範教師帳號</strong>
                <span>teacher@teeko.hk · 已有使用權益</span>
              </div>
              ${button("自動填入", "fill-demo-account", "secondary", 'data-email="teacher@teeko.hk"')}
            </div>
            ${button("登入 Teeko", "login", "primary", 'class="btn btn-primary btn-lg btn-full"')}
            <div class="auth-divider">或</div>
            ${button("使用未啟用示範帳號", "login-unactivated", "outline", 'class="btn btn-outline btn-full"')}
            <p class="auth-note">登入後只會顯示你的個人作品、收藏、課堂記錄與報告。</p>
          </div>
        </section>
      </main>`;
  }

  function renderActivate() {
    const success = ui.activationStatus === "success";
    return `
      <main class="auth-page">
        ${authBrand()}
        <section class="auth-form-wrap">
          <div class="auth-card">
            ${success ? `
              <div class="activation-success">
                <div class="success-mark">✓</div>
                <p class="eyebrow">啟用完成</p>
                <h2>Teeko 已準備好</h2>
                <p>你的使用權益已啟用，有效期至 ${escapeHTML(state.teacher.entitlement)}。</p>
                ${button("開始使用 Teeko", "activation-finish", "primary", 'class="btn btn-primary btn-lg btn-full"')}
              </div>` : `
              <p class="eyebrow">學校使用權益</p>
              <h2>啟用教師使用權益</h2>
              <p>輸入學校發放的啟用碼。啟用後，權益會綁定目前的教師個人帳號。</p>
              <div class="field">
                <label class="field-label" for="activation-code">學校啟用碼</label>
                <input id="activation-code" class="input code-input ${ui.activationError ? "is-error" : ""}" type="text" placeholder="TEEKO-HK-2026" value="${escapeHTML(ui.activationCode)}" data-ui-field="activationCode" autocomplete="off" />
                ${ui.activationError ? `<span class="field-error">${escapeHTML(ui.activationError)}</span>` : `<span class="field-hint">示範碼：TEEKO-HK-2026</span>`}
              </div>
              <div class="button-row" style="margin-top:24px">
                ${button("返回登入", "navigate", "outline", 'data-route="/signin" style="flex:1"')}
                ${button(ui.activationStatus === "checking" ? "正在驗證..." : "啟用權益", "activate", "primary", 'style="flex:1"')}
              </div>
              <p class="auth-note">正式產品的啟用碼有效期、疊加及申訴規則仍待確認。</p>`}
          </div>
        </section>
      </main>`;
  }

  function renderHome() {
    const latestReport = state.report;
    const prep = state.prep;
    const content = `
      <section class="page">
        <section class="home-dialog" aria-labelledby="home-dialog-title">
          <div class="home-dialog-heading">
            <img src="./assets/teeko-brand-mark.png" alt="" />
            <p class="eyebrow">早晨，陳老師</p>
            <h1 id="home-dialog-title" class="home-display">今天想怎樣教？</h1>
          </div>
          <div class="home-composer ${ui.prepErrors.input ? "is-error" : ""}">
            <label class="sr-only" for="home-requirements">教學想法</label>
            <textarea id="home-requirements" data-prep-field="requirements" placeholder="例如：用生活例子介紹光的折射，加入一個可操作的示範，最後用圖像整理重點。">${escapeHTML(prep.requirements)}</textarea>
            ${prep.file ? `
              <div class="home-file">
                <span><strong>${escapeHTML(prep.file.name)}</strong><small>已完成模擬解析 · ${escapeHTML(prep.file.size)}</small></span>
                ${button("移除", "remove-file", "ghost", 'class="btn btn-ghost btn-sm"')}
              </div>` : ""}
            <div class="home-composer-footer">
              <div class="home-composer-tools">
                ${button("＋ 上傳教案（選填）", "simulate-upload", "outline", 'class="btn btn-outline home-upload"')}
                <label class="sr-only" for="home-subject">學科，可選</label>
                <select id="home-subject" class="home-filter" aria-label="學科，可選" data-prep-field="subject">
                  <option value="">學科：不指定</option>
                  ${["中國語文", "英文", "數學", "科學", "歷史", "地理", "視覺藝術", "音樂", "其他"].map(item => `<option value="${item}" ${prep.subject === item ? "selected" : ""}>學科：${item}</option>`).join("")}
                </select>
                <label class="sr-only" for="home-language">教學語言，可選</label>
                <select id="home-language" class="home-filter" aria-label="教學語言，可選" data-prep-field="language">
                  <option value="">語言：不指定</option>
                  <option value="繁體中文" ${prep.language === "繁體中文" ? "selected" : ""}>語言：繁體中文</option>
                  <option value="英文" ${prep.language === "英文" ? "selected" : ""}>語言：英文</option>
                </select>
              </div>
              ${button("生成教學作品", "submit-prep", "primary", 'class="btn btn-primary btn-lg home-generate"')}
            </div>
          </div>
          ${ui.prepErrors.input ? `<span class="field-error home-dialog-error">${ui.prepErrors.input}</span>` : ""}
        </section>

        <div class="section-row">
          <h2>接著上次的工作</h2>
          ${button("查看全部作品", "navigate", "link", 'data-route="/works"')}
        </div>
        <div class="dashboard-grid">
          <article class="card recent-work">
            <div class="work-cover physics">
              <span class="cover-kicker">互動 HTML · 科學</span>
              <strong>凸透鏡<br />光線如何成像？</strong>
            </div>
            <div class="recent-work-body">
              <span class="badge badge-jade">已儲存 · 6 道配套題</span>
              <h3>凸透鏡：光線如何成像？</h3>
              <p>今天 09:42 更新。可以繼續修改，或直接建立新課堂。</p>
              <div class="button-row">
                ${button("繼續編輯", "navigate", "primary", 'data-route="/work/w1"')}
                ${button("建立課堂", "create-class", "outline", 'data-work-id="w1"')}
              </div>
            </div>
          </article>
          <article class="card report-mini accent-card">
            <p class="eyebrow">最近課堂報告</p>
            <h3 style="margin:0;color:#082f36;font-size:18px">${escapeHTML(latestReport.title)}</h3>
            <div class="metric-row">
              <div class="metric"><strong>${latestReport.participants}</strong><span>匿名參與</span></div>
              <div class="metric"><strong>${Number.isFinite(latestReport.accuracy) ? `${latestReport.accuracy}%` : "暫無"}</strong><span>正式題正確率</span></div>
              <div class="metric"><strong>${Number.isFinite(latestReport.responseRate) ? `${latestReport.responseRate}%` : "暫無"}</strong><span>平均回應率</span></div>
            </div>
            <div class="button-row">
              ${button("查看報告", "navigate", "secondary", `data-route="/report/${latestReport.id}"`)}
              ${button("繼續下一次備課", "open-report-feedback", "ghost")}
            </div>
          </article>
        </div>
      </section>`;
    return teacherShell({ title: "教師首頁", active: "home", content });
  }

  function renderPrepare() {
    const prep = state.prep;
    const context = prep.reportContext;
    const content = `
      <section class="page">
        ${pageHead("備課", context ? "基於課堂回饋繼續備課" : "新增備課", context ? "上一堂課的整體回饋已帶入，你仍可調整學科、語言及新的教學要求。" : "先說明教學意圖，Teeko 會生成可直接授課的作品及配套正式題。")}
        <div class="form-layout">
          <aside class="card brief-panel accent-card">
            <p class="eyebrow">開始之前</p>
            <h2>只需準備三件事</h2>
            <p>教學要求與教案至少提供一項。學科和教學語言可按需要補充。</p>
            <div class="brief-steps">
              <div class="brief-step"><span class="brief-number">1</span><div><strong>按需選擇學科與語言</strong><span>兩項均可略過，AI 會先根據教學內容判斷。</span></div></div>
              <div class="brief-step"><span class="brief-number">2</span><div><strong>說明你想怎樣教</strong><span>描述目標、課堂節奏或希望加入的互動。</span></div></div>
              <div class="brief-step"><span class="brief-number">3</span><div><strong>按需上傳教案</strong><span>原型會模擬解析，不會真的上載檔案。</span></div></div>
            </div>
          </aside>
          <div class="card form-card">
            ${context ? `
              <div class="report-context">
                <div>
                  <strong>已帶入課堂報告回饋</strong>
                  <p>來源：${escapeHTML(state.report.title)}。你已選擇 ${context.feedback.length} 項整體回饋作為下一次備課背景。</p>
                </div>
                <div class="button-row">
                  ${button("查看報告", "navigate", "ghost", `class="btn btn-ghost btn-sm" data-route="/report/${context.reportId}"`)}
                  ${button("移除", "remove-report-context", "ghost", 'class="btn btn-ghost btn-sm"')}
                </div>
              </div>` : ""}
            <p class="eyebrow">備課資料</p>
            <h2>這一堂課要教甚麼？</h2>
            <p>不需要選擇年級。你可以直接在教學要求中補充學生程度或教學情境。</p>
            <div class="two-cols" style="margin-top:24px">
              <div class="field">
                <label class="field-label" for="prep-subject">學科 <span class="optional-label">可選</span></label>
                <select id="prep-subject" class="select" data-prep-field="subject">
                  <option value="">不指定</option>
                  ${["中國語文", "英文", "數學", "科學", "歷史", "地理", "視覺藝術", "音樂", "其他"].map(item => `<option value="${item}" ${prep.subject === item ? "selected" : ""}>${item}</option>`).join("")}
                </select>
              </div>
              <div class="field" style="margin-top:0">
                <span class="field-label">教學語言 <span class="optional-label">可選</span></span>
                <div class="segmented" role="group" aria-label="教學語言">
                  <button type="button" class="${!prep.language ? "is-active" : ""}" data-action="set-language" data-language="" aria-pressed="${!prep.language}">不指定</button>
                  <button type="button" class="${prep.language === "繁體中文" ? "is-active" : ""}" data-action="set-language" data-language="繁體中文" aria-pressed="${prep.language === "繁體中文"}">繁體中文</button>
                  <button type="button" class="${prep.language === "英文" ? "is-active" : ""}" data-action="set-language" data-language="英文" aria-pressed="${prep.language === "英文"}">英文</button>
                </div>
              </div>
            </div>
            <div class="field">
              <label class="field-label" for="prep-requirements">教學要求</label>
              <textarea id="prep-requirements" class="textarea ${ui.prepErrors.input ? "is-error" : ""}" data-prep-field="requirements" placeholder="例如：以生活例子引入，加入一個可操作的示範，最後用圖像整理重點。">${escapeHTML(prep.requirements)}</textarea>
              <span class="field-hint">可以描述教學目標、重點、課堂長度、活動形式或學生程度。</span>
            </div>
            <div class="field">
              <span class="field-label">上傳教案 <span class="optional-label">可選</span></span>
              ${prep.file ? `
                <div class="upload-zone has-file">
                  <div class="file-info"><span class="upload-symbol" style="margin:0">案</span><div><strong>${escapeHTML(prep.file.name)}</strong><span class="caption">已完成模擬解析 · ${escapeHTML(prep.file.size)}</span></div></div>
                  ${button("移除", "remove-file", "ghost", 'class="btn btn-ghost btn-sm"')}
                </div>` : `
                <div class="upload-zone">
                  <div>
                    <span class="upload-symbol">＋</span>
                    <strong style="display:block;margin-bottom:5px;color:#173337;font-size:13px">加入一份現有教案</strong>
                    <span class="caption">支援規則仍待確認，原型會使用示範文件。</span>
                    <div style="margin-top:12px">${button("使用範例教案", "simulate-upload", "outline", 'class="btn btn-outline btn-sm"')}</div>
                  </div>
                </div>`}
              ${ui.prepErrors.input ? `<span class="field-error">${ui.prepErrors.input}</span>` : ""}
            </div>
            <div class="form-actions">
              ${button("取消", "navigate", "ghost", 'data-route="/home"')}
              <div class="button-row">
                ${button("清空重填", "clear-prep", "outline")}
                ${button("生成教學作品", "submit-prep", "primary", 'class="btn btn-primary btn-lg"')}
              </div>
            </div>
          </div>
        </div>
      </section>`;
    return teacherShell({ title: "備課", active: "prepare", content });
  }

  function beginGeneration({ mode, workId, resourceId = null, message = "" }) {
    state.generation = {
      status: "running",
      progress: resourceId ? 6 : 4,
      stage: 0,
      mode,
      workId,
      resourceId,
      draft: null
    };
    persist();
    navigate("/generate");
    if (message) showToast(message);
  }

  const generationStages = ["分析教學內容", "建立內容結構", "生成互動作品", "準備可編輯草稿", "生成配套題"];
  const resourceGenerationStages = ["讀取平台資源", "複製作品內容", "建立未儲存草稿", "生成配套題", "準備進入編輯"];

  function ensureGenerationTimer() {
    if (state.generation.status !== "running" || ui.generationTimer) return;
    ui.generationTimer = window.setInterval(() => {
      state.generation.progress = Math.min(100, state.generation.progress + 9 + Math.round(Math.random() * 7));
      state.generation.stage = Math.min(4, Math.floor(state.generation.progress / 20));
      if (state.generation.progress >= 100) {
        state.generation.status = "complete";
        window.clearInterval(ui.generationTimer);
        ui.generationTimer = null;
        if (!state.generation.draft && !state.works.some(work => work.id === state.generation.workId)) {
          const sourceResource = state.generation.resourceId ? resourceById(state.generation.resourceId) : null;
          state.generation.draft = {
            id: state.generation.workId,
            title: sourceResource ? `${sourceResource.title} · 我的版本` : `${state.prep.subject || "跨學科"}新課：${state.prep.reportContext ? "鞏固光學概念" : "互動探索"}`,
            subject: sourceResource?.subject || state.prep.subject || "跨學科",
            language: sourceResource?.language || state.prep.language || "繁體中文",
            type: sourceResource?.type || "互動 HTML",
            updatedAt: "剛剛",
            pages: sourceResource ? 5 : 6,
            cover: sourceResource?.cover || "physics",
            source: sourceResource ? "平台資源個人版本" : state.prep.reportContext ? "課堂報告繼續備課" : "獨立備課",
            versionId: `ver-${Date.now()}`,
            hostedUrl: "https://a.zhique.cn/home",
            summary: sourceResource?.description || state.prep.requirements || "由 AI 根據教師的備課要求生成的互動教學作品。",
            questions: sourceResource?.id === "r1"
              ? structuredClone(questions)
              : generatedQuestionsFor({
                  title: sourceResource?.title || state.prep.requirements.slice(0, 28),
                  subject: sourceResource?.subject || state.prep.subject,
                  language: sourceResource?.language || state.prep.language
                })
          };
        }
        if (routeInfo().path === "/generate") {
          persist();
          ui.workTab = "content";
          ui.workPage = 1;
          navigate(`/work/${state.generation.workId}`);
          showToast(state.generation.mode === "resource" ? "個人草稿與配套題已準備好，確認後請按「儲存課件」。 " : "課件已生成，確認後請按「儲存課件」。 ");
          return;
        }
      }
      persist();
      render();
    }, 620);
  }

  function renderGenerate() {
    ensureGenerationTimer();
    const task = state.generation;
    const complete = task.status === "complete";
    const failed = task.status === "failed";
    const resourceMode = task.mode === "resource";
    const stages = resourceMode ? resourceGenerationStages : generationStages;
    const completedWork = complete ? workById(task.workId) : null;
    const completedSaved = isSavedWork(completedWork);
    const title = complete ? resourceMode ? "個人草稿已準備好" : "教學作品已準備好" : failed ? resourceMode ? "資源草稿建立未完成" : "這次生成未完成" : resourceMode ? "正在建立可修改的個人草稿" : "正在把教學想法變成作品";
    const detail = complete
      ? completedSaved
        ? `課件與 ${completedWork?.questions.length || DEFAULT_QUESTION_COUNT} 道配套題已儲存到我的作品。`
        : resourceMode
          ? `個人草稿與 ${completedWork?.questions.length || DEFAULT_QUESTION_COUNT} 道配套題已建立，請進入編輯頁確認並儲存。`
          : `課件草稿與 ${completedWork?.questions.length || DEFAULT_QUESTION_COUNT} 道配套題已生成，請進入編輯頁確認並儲存。`
      : failed
        ? resourceMode ? "平台原資源未受影響，你可以直接重試或返回資源詳情。" : "已保留你的教學要求，你可以直接重試或返回修改。"
        : stages[task.stage] || stages[0];
    const content = `
      <section class="page page-narrow">
        <div class="card generate-card accent-card">
          <div class="generate-orbit">${brandLockup({ compact: true }).replace(/<span>\s*<span class="brand-word">[\s\S]*?<\/span>\s*<\/span>$/, "")}</div>
          <p class="eyebrow">${resourceMode ? "平台資源使用並修改" : "AI 教學作品生成"}</p>
          <h1 class="home-display">${title}</h1>
          <p class="muted" style="margin-bottom:0;font-size:13px">${detail}</p>
          <div class="progress-track" aria-label="生成進度"><div class="progress-bar" style="width:${task.progress}%"></div></div>
          <strong style="color:#082f36;font-size:24px">${task.progress}%</strong>
          <div class="stage-list">
            ${stages.map((stage, index) => `<div class="stage-item ${index < task.stage || complete ? "is-done" : index === task.stage ? "is-active" : ""}">${stage}</div>`).join("")}
          </div>
          <div class="status-message">${complete ? completedSaved ? "已加入我的作品，可繼續編輯或建立課堂。" : "目前仍是未儲存草稿，不會出現在我的作品；內容版本、托管連結、摘要及配套題已建立。" : failed ? resourceMode ? "平台原資源沒有被修改或刪除。" : "原作品沒有被修改或刪除。" : resourceMode ? "平台原資源不受影響。你可以離開此頁，草稿會在背景繼續建立。" : "你可以離開此頁，原型會在本機背景繼續模擬生成。"}</div>
          <div class="button-row" style="justify-content:center">
            ${complete ? `${button("進入編輯", "view-generated-work", "primary", 'class="btn btn-primary btn-lg"')}${button("返回首頁", "navigate", "outline", 'data-route="/home"')}` : failed ? resourceMode ? `${button("重試建立", "retry-generation", "primary")}${button("返回資源詳情", "navigate", "outline", `data-route="/resource/${task.resourceId}"`)}` : `${button("重試生成", "retry-generation", "primary")}${button("修改備課要求", "navigate", "outline", 'data-route="/prepare"')}` : resourceMode ? `${button("返回首頁，背景繼續", "navigate", "outline", 'data-route="/home"')}${button("返回資源詳情", "navigate", "ghost", `data-route="/resource/${task.resourceId}"`)}` : `${button("返回首頁，背景繼續", "navigate", "outline", 'data-route="/home"')}${button("修改備課要求", "navigate", "ghost", 'data-route="/prepare"')}`}
          </div>
        </div>
      </section>`;
    return teacherShell({ title: "生成進度", active: "prepare", content });
  }

  function workCard(work) {
    const pendingSave = Boolean(work.pendingSave);
    const generatingQuestions = ui.questionGeneration?.workId === work.id;
    return `
      <article class="work-card" data-work-card="${work.id}">
        <div class="work-cover ${work.cover}">
          <span class="cover-kicker">${escapeHTML(work.type)} · ${escapeHTML(work.subject)}</span>
          <strong>${escapeHTML(work.title)}</strong>
        </div>
        <div class="card-body">
          <span class="badge ${pendingSave ? "badge-neutral" : "badge-jade"}">${pendingSave ? "有未儲存修改" : "已儲存"}</span>
          <h3>${escapeHTML(work.title)}</h3>
          <p>${escapeHTML(work.source)} · ${work.questions.length} 道配套題 · ${escapeHTML(work.updatedAt)}更新</p>
          <div class="card-actions">
            ${button("開啟編輯", "navigate", "secondary", `class="btn btn-secondary btn-sm" data-route="/work/${work.id}"`)}
            ${button("建立課堂", "create-class", "outline", `class="btn btn-outline btn-sm" data-work-id="${work.id}" ${pendingSave || generatingQuestions ? `disabled title="${generatingQuestions ? "請等待配套題生成" : "請先儲存修改"}"` : ""}`)}
            ${button("預覽", "open-work-preview", "ghost", `class="btn btn-ghost btn-sm" data-work-id="${work.id}"`)}
          </div>
        </div>
      </article>`;
  }

  function renderWorks() {
    const listedWorks = state.works.filter(work => {
      if (ui.workFilter === "resource") return work.source.includes("平台資源");
      if (ui.workFilter === "html") return work.type.includes("HTML") || work.type.includes("遊戲");
      return true;
    });
    const content = `
      <section class="page page-wide">
        ${pageHead("個人作品", "我的作品", "這裡儲存你生成及從平台資源改編的個人版本。每份作品都可以繼續修改或建立課堂。", button("新增備課", "navigate", "primary", 'data-route="/prepare"'))}
        <div class="filter-bar">
          <div>
            <span class="badge badge-jade">${state.works.length} 份個人作品</span>
            <span class="caption" style="margin-left:8px">最近更新優先</span>
          </div>
          <div class="segmented" aria-label="作品類型">
            <button type="button" class="${ui.workFilter === "all" ? "is-active" : ""}" data-action="filter-works" data-filter="all" aria-pressed="${ui.workFilter === "all"}">全部</button>
            <button type="button" class="${ui.workFilter === "html" ? "is-active" : ""}" data-action="filter-works" data-filter="html" aria-pressed="${ui.workFilter === "html"}">互動內容</button>
            <button type="button" class="${ui.workFilter === "resource" ? "is-active" : ""}" data-action="filter-works" data-filter="resource" aria-pressed="${ui.workFilter === "resource"}">資源版本</button>
          </div>
        </div>
        ${listedWorks.length ? `<div class="work-grid">${listedWorks.map(workCard).join("")}</div>` : `<div class="empty-state"><div><h3>這個分類暫時沒有作品</h3><p>你可以回到全部作品，或新增一份備課。</p>${button("查看全部", "filter-works", "primary", 'data-filter="all"')}</div></div>`}
      </section>`;
    return teacherShell({ title: "我的作品", active: "works", content });
  }

  const slideContent = [
    { kicker: "01 · 引起動機", title: "光為甚麼會轉彎？", body: "從水杯裡看起來折斷的飲管開始，找出光線改變方向的線索。" },
    { kicker: "02 · 核心概念", title: "從折射到聚焦", body: "平行光線穿過凸透鏡後會折射，並在另一側會聚於焦點。" },
    { kicker: "03 · 互動實驗", title: "一起調整焦距", body: "改變透鏡弧度，觀察焦點位置及光線路徑怎樣改變。" },
    { kicker: "04 · 成像規律", title: "實像與虛像", body: "物距和焦距的關係，決定影像能否投射在屏幕上。" },
    { kicker: "05 · 生活連結", title: "我們在哪裡用到凸透鏡？", body: "相機、顯微鏡和放大鏡都運用相同的光學原理。" },
    { kicker: "06 · 課堂整理", title: "三句話帶走重點", body: "會聚、焦距、成像，將今天的觀察整理成可遷移的概念。" }
  ];

  const englishSlideContent = [
    { kicker: "01 · WARM UP", title: "How do we move through a city?", body: "Notice the words we use to name places, describe locations and ask for help." },
    { kicker: "02 · KEY LANGUAGE", title: "Ask for directions politely", body: "Use Could you show me the way to... to begin a clear and polite request." },
    { kicker: "03 · CITY MISSION", title: "Find the hidden café", body: "Read the map, follow two instructions and explain the final location to a partner." },
    { kicker: "04 · SPEAKING", title: "Give one step at a time", body: "Use turn left, go straight and opposite to make each direction easy to follow." },
    { kicker: "05 · REFLECTION", title: "Which phrase helped most?", body: "Choose one useful phrase and apply it to a new route through the city." }
  ];

  const historySlideContent = [
    { kicker: "01 · 歷史提問", title: "城市是如何改變的？", body: "從一幅舊地圖開始，找出海岸線、道路與聚落的變化。" },
    { kicker: "02 · 史料閱讀", title: "讓地圖與照片互相說話", body: "比較不同類型史料，辨認它們提供的證據及未能回答的問題。" },
    { kicker: "03 · 時間軸", title: "把轉變放回時間之中", body: "排列重要事件，觀察港口、人口與城市空間之間的關係。" },
    { kicker: "04 · 多重角度", title: "誰經歷了這些轉變？", body: "從商人、工人及居民角度理解城市發展帶來的不同影響。" },
    { kicker: "05 · 歷史結論", title: "用證據支持你的解釋", body: "選取兩項史料，說明它們如何支持你對城市變遷的理解。" },
    { kicker: "06 · 延伸探索", title: "今天的城市留下了甚麼線索？", body: "把歷史地圖與現代街景並置，尋找仍然可見的城市記憶。" },
    { kicker: "07 · 課堂整理", title: "證據、變化與因果", body: "用三個關鍵詞整理今天的歷史推論。" }
  ];

  function lessonCanvas(page = state.classroom.page, { compact = false, work = classroomWork() } = {}) {
    const slides = work.cover === "english" ? englishSlideContent : work.cover === "history-cover" ? historySlideContent : slideContent;
    const slide = slides[Math.max(0, Math.min(slides.length - 1, page - 1))] || slides[0];
    const theme = work.cover === "english" ? "theme-english" : work.cover === "history-cover" ? "theme-history" : "theme-science";
    const artLabel = theme === "theme-english" ? "A" : theme === "theme-history" ? "史" : "";
    return `
      <div class="lesson-canvas ${theme} ${compact ? "is-compact" : ""}" aria-label="${escapeHTML(work.title)}第 ${page} 頁">
        <div class="lesson-content">
          <span class="slide-kicker">${slide.kicker}</span>
          <h2 class="home-display">${slide.title}</h2>
          <p>${slide.body}</p>
        </div>
        <div class="lens-demo" style="${theme === "theme-science" ? `transform:scaleX(${Math.max(0.34, state.classroom.focus / 95)})` : `--work-effect:${0.9 + state.classroom.focus / 500}`}" ><span>${artLabel}</span></div>
      </div>`;
  }

  function renderWorkDetail(id) {
    const work = workById(id);
    if (!work) {
      return teacherShell({
        title: "作品詳情",
        active: "works",
        content: `<section class="page page-narrow"><div class="empty-state"><div><h3>找不到這份作品</h3><p>它可能尚未生成完成，或已不在目前的個人作品庫。</p>${button("返回我的作品", "navigate", "primary", 'data-route="/works"')}</div></div></section>`
      });
    }
    const saved = isSavedWork(work);
    const pendingSave = saved && Boolean(work.pendingSave);
    const generatingQuestions = ui.questionGeneration?.workId === work.id;
    const canCreateClass = saved && !pendingSave && !generatingQuestions;
    const contentRevision = ui.contentRevision?.workId === work.id ? ui.contentRevision : null;
    ui.workPage = Math.max(1, Math.min(work.pages, ui.workPage));
    const tab = ui.workTab;
    let tabContent = "";
    if (tab === "content") {
      tabContent = `
        <div class="lesson-stage">${lessonCanvas(ui.workPage, { work })}</div>
        <div class="lesson-stage-controls">
          ${button("上一頁", "work-page", "outline", 'class="btn btn-outline btn-sm" data-direction="prev"')}
          <span class="page-counter">${ui.workPage} / ${work.pages}</span>
          ${button("下一頁", "work-page", "outline", 'class="btn btn-outline btn-sm" data-direction="next"')}
        </div>`;
    } else if (tab === "questions") {
      const atQuestionLimit = work.questions.length >= MAX_QUESTION_COUNT;
      const canAppendBatch = work.questions.length + DEFAULT_QUESTION_COUNT <= MAX_QUESTION_COUNT;
      tabContent = `
        <div class="detail-toolbar">
          <span class="caption">${generatingQuestions ? "AI 正在生成題目，請稍候…" : `目前 ${work.questions.length} / ${MAX_QUESTION_COUNT} 道。AI 預設生成 ${DEFAULT_QUESTION_COUNT} 道，課堂可單選、多選或全選發布。`}</span>
          <div class="button-row">
            ${button(generatingQuestions && ui.questionGeneration.mode === "replace" ? "正在生成…" : "重新生成 6 題", "ask-regenerate-questions", "outline", `class="btn btn-outline btn-sm" data-work-id="${work.id}" ${generatingQuestions ? "disabled" : ""}`)}
            ${button(generatingQuestions && ui.questionGeneration.mode === "append" ? "正在追加…" : "追加生成 6 題", "append-questions", "secondary", `class="btn btn-secondary btn-sm" data-work-id="${work.id}" ${canAppendBatch && !generatingQuestions ? "" : 'disabled title="剩餘題目容量不足 6 道或已有生成任務"'}`)}
            ${button("新增題目", "open-question-editor", "primary", `class="btn btn-primary btn-sm" data-work-id="${work.id}" ${atQuestionLimit || generatingQuestions ? 'disabled title="生成期間不可新增；每份作品最多 25 道題"' : ""}`)}
          </div>
        </div>
        <div class="question-list">
          ${work.questions.map((question, index) => `
            <article class="question-item">
              <span class="question-number">Q${index + 1}</span>
              <div>
                <h3>${escapeHTML(question.text)}</h3>
                <p>${question.type} · 適用於整份作品 · 答案已設定</p>
              </div>
              <div class="question-actions">
                <button type="button" class="icon-text-btn" data-action="open-question-editor" data-work-id="${work.id}" data-question-id="${question.id}" ${generatingQuestions ? "disabled" : ""}>編輯</button>
                <button type="button" class="icon-text-btn" data-action="ask-delete-question" data-work-id="${work.id}" data-question-id="${question.id}" ${generatingQuestions ? "disabled" : ""}>刪除</button>
              </div>
            </article>`).join("")}
        </div>`;
    } else {
      tabContent = `
        <div class="basic-grid">
          <div class="basic-cell"><span>作品名稱</span><strong>${escapeHTML(work.title)}</strong></div>
          <div class="basic-cell"><span>作品形態</span><strong>${escapeHTML(work.type)}</strong></div>
          <div class="basic-cell"><span>學科</span><strong>${escapeHTML(work.subject)}</strong></div>
          <div class="basic-cell"><span>教學語言</span><strong>${escapeHTML(work.language)}</strong></div>
          <div class="basic-cell"><span>作品來源</span><strong>${escapeHTML(work.source)}</strong></div>
          <div class="basic-cell"><span>最後更新</span><strong>${escapeHTML(work.updatedAt)}</strong></div>
          <div class="basic-cell"><span>版本識別</span><strong>${escapeHTML(work.versionId || "個人版本")}</strong></div>
          <div class="basic-cell"><span>內容摘要</span><strong>${escapeHTML(work.summary || "已由 AI 建立")}</strong></div>
        </div>`;
    }
    const content = `
      <section class="page page-wide">
        ${pageHead(saved ? "個人作品" : "未儲存草稿", work.title, `${work.type} · ${work.subject} · ${work.language}`, `${button(saved ? "返回作品庫" : "返回生成進度", "navigate", "ghost", `data-route="${saved ? "/works" : "/generate"}"`)}${button("預覽作品", "open-work-preview", "outline", `data-work-id="${work.id}"`)}`)}
        ${saved ? pendingSave ? `<div class="notice" style="margin-bottom:18px"><strong>有未儲存修改</strong><br />內容或配套題的調整已套用到編輯稿，請按「儲存修改」完成保存後再建立課堂。</div>` : "" : `<div class="notice" style="margin-bottom:18px"><strong>尚未加入我的作品</strong><br />你可以先預覽和修改內容；確認後請按「儲存課件」。</div>`}
        <div class="work-detail-grid">
          <div class="card detail-main">
            <div class="detail-toolbar">
              <div class="detail-tabs" role="tablist">
                <button type="button" role="tab" aria-selected="${tab === "content"}" class="${tab === "content" ? "is-active" : ""}" data-action="work-tab" data-tab="content">教學內容</button>
                <button type="button" role="tab" aria-selected="${tab === "questions"}" class="${tab === "questions" ? "is-active" : ""}" data-action="work-tab" data-tab="questions">配套題 ${work.questions.length}</button>
                <button type="button" role="tab" aria-selected="${tab === "basic"}" class="${tab === "basic" ? "is-active" : ""}" data-action="work-tab" data-tab="basic">基本資料</button>
              </div>
              <span class="badge ${saved && !pendingSave ? "badge-jade" : "badge-neutral"}">${pendingSave ? "有未儲存修改" : saved ? "已儲存" : "未儲存"}</span>
            </div>
            ${tabContent}
          </div>
          <aside class="side-stack">
            <section class="card info-card accent-card">
              <p class="eyebrow">主要操作</p>
              <h3>準備下一步</h3>
              <div class="button-row" style="display:grid">
                ${saved ? pendingSave ? button(generatingQuestions ? "等待配套題生成" : "儲存修改", "save-work-changes", "primary", `class="btn btn-primary btn-full" data-work-id="${work.id}" ${generatingQuestions ? 'disabled title="請等待配套題生成完成"' : ""}`) : "" : button(generatingQuestions ? "等待配套題生成" : "儲存課件", "save-generated-work", "primary", `class="btn btn-primary btn-full" data-work-id="${work.id}" ${generatingQuestions ? 'disabled title="請等待配套題生成完成"' : ""}`)}
                ${button("建立課堂", "create-class", canCreateClass ? "primary" : "outline", `class="btn btn-${canCreateClass ? "primary" : "outline"} btn-full" data-work-id="${work.id}" ${canCreateClass ? "" : `disabled title="${generatingQuestions ? "請等待配套題生成" : pendingSave ? "請先儲存修改" : "請先儲存課件"}"`}`)}
                ${button(contentRevision?.status === "running" ? "修改生成中…" : contentRevision?.status === "ready" ? "查看修改結果" : contentRevision?.candidate ? "繼續修改候選版本" : "修改教學內容", "open-content-editor", "secondary", `class="btn btn-secondary btn-full" data-work-id="${work.id}"`)}
                ${button("開啟原互動作品", "open-original-work", "ghost", `class="btn btn-ghost btn-full" data-work-id="${work.id}"`)}
              </div>
            </section>
            <section class="card info-card">
              <h3>作品狀態</h3>
              <div class="info-list">
                <div class="info-row"><span>儲存狀態</span><strong>${pendingSave ? "有未儲存修改" : saved ? "已加入我的作品" : "待教師確認"}</strong></div>
                <div class="info-row"><span>內容版本</span><strong>${escapeHTML(work.versionId || "生成草稿")}</strong></div>
                <div class="info-row"><span>配套題</span><strong>${work.questions.length} 道</strong></div>
                <div class="info-row"><span>學生端</span><strong>支援只讀同步</strong></div>
                <div class="info-row"><span>原作品連結</span><strong>可存取</strong></div>
              </div>
            </section>
            <div class="prototype-note">${pendingSave ? "修改已保留在編輯稿中；儲存成功後才可用最新內容建立新課堂。" : saved ? "這是非 PPT 作品，因此配套題只關聯整份作品，不會顯示頁面關聯。" : "草稿修改會暫存在目前生成任務中，只有教師主動儲存後才會加入我的作品。"}</div>
          </aside>
        </div>
      </section>`;
    return teacherShell({ title: "作品詳情", active: "works", content });
  }

  function resourceCard(resource) {
    const favorite = state.favorites.includes(resource.id);
    return `
      <article class="resource-card" data-resource-card="${resource.id}" data-search="${escapeHTML(`${resource.title} ${resource.subject} ${resource.language}`)}">
        <div class="work-cover ${resource.cover}">
          <div class="cover-top"><button type="button" class="favorite-btn" data-action="toggle-favorite" data-resource-id="${resource.id}" aria-label="${favorite ? "取消收藏" : "收藏"}">${favorite ? "♥" : "♡"}</button></div>
          <span class="cover-kicker">平台資源 · ${escapeHTML(resource.type)}</span>
          <strong>${escapeHTML(resource.title)}</strong>
        </div>
        <div class="card-body">
          <span class="badge badge-neutral">${escapeHTML(resource.subject)}</span>
          <span class="badge badge-neutral">${escapeHTML(resource.language)}</span>
          <h3>${escapeHTML(resource.title)}</h3>
          <p>${escapeHTML(resource.description)}</p>
          <div class="card-meta">
            <span class="caption">由 Teeko 平台提供</span>
            ${button("查看詳情", "navigate", "link", `data-route="/resource/${resource.id}"`)}
          </div>
        </div>
      </article>`;
  }

  function visibleResources() {
    let items = ui.resourceTab === "favorites" ? resources.filter(resource => state.favorites.includes(resource.id)) : resources;
    const query = ui.resourceSearch.trim().toLowerCase();
    if (query) items = items.filter(resource => `${resource.title} ${resource.subject} ${resource.language}`.toLowerCase().includes(query));
    return items;
  }

  function renderResources() {
    const items = visibleResources();
    const content = `
      <section class="page page-wide">
        ${pageHead("平台資源", "資源廣場", "瀏覽 Teeko 平台提供的教學資源。收藏只保留入口，使用並修改才會建立你的個人版本。")}
        <div class="filter-bar">
          <div class="segmented" role="tablist">
            <button type="button" role="tab" aria-selected="${ui.resourceTab === "all"}" class="${ui.resourceTab === "all" ? "is-active" : ""}" data-action="resource-tab" data-tab="all">全部資源</button>
            <button type="button" role="tab" aria-selected="${ui.resourceTab === "favorites"}" class="${ui.resourceTab === "favorites" ? "is-active" : ""}" data-action="resource-tab" data-tab="favorites">我的收藏 ${state.favorites.length}</button>
          </div>
          <div class="search-field">
            <input class="input" id="resource-search" type="search" aria-label="搜尋資源主題或學科" placeholder="搜尋主題或學科" value="${escapeHTML(ui.resourceSearch)}" data-ui-field="resourceSearch" />
          </div>
          <div class="button-row">
            ${button("搜尋", "search-resources", "secondary", 'class="btn btn-secondary btn-sm"')}
            ${ui.resourceSearch ? button("清除", "clear-resource-search", "ghost", 'class="btn btn-ghost btn-sm"') : ""}
          </div>
        </div>
        ${items.length ? `<div class="resource-grid">${items.map(resourceCard).join("")}</div>` : `
          <div class="empty-state">
            <div><h3>${ui.resourceTab === "favorites" ? "還沒有符合條件的收藏" : "找不到相關資源"}</h3><p>調整搜尋字詞，或回到全部資源繼續探索。</p>${button("探索全部資源", "show-all-resources", "primary")}</div>
          </div>`}
      </section>`;
    return teacherShell({ title: "資源廣場", active: "resources", content });
  }

  function renderResourceDetail(id) {
    const resource = resourceById(id);
    const favorite = state.favorites.includes(resource.id);
    const content = `
      <section class="page page-wide">
        ${pageHead("平台資源", "資源詳情", "平台資源本身不含正式配套題。使用後會先建立可編輯草稿並自動生成題目，由你確認後儲存。", button("返回資源廣場", "navigate", "ghost", 'data-route="/resources"'))}
        <div class="resource-detail">
          <article class="card resource-preview">
            <div class="work-cover ${resource.cover}">
              <span class="cover-kicker">${escapeHTML(resource.type)} · ${escapeHTML(resource.subject)}</span>
              <strong>${escapeHTML(resource.title)}</strong>
            </div>
            <div class="resource-preview-foot">
              <div class="button-row" style="justify-content:space-between">
                <span class="caption">預覽 1 / 5 · 學生端支援只讀同步</span>
                ${button("預覽完整內容", "open-resource-preview", "outline", `class="btn btn-outline btn-sm" data-resource-id="${resource.id}"`)}
              </div>
            </div>
          </article>
          <aside class="card resource-detail-side accent-card">
            <span class="badge badge-jade">Teeko 平台精選</span>
            <h1 class="home-display">${escapeHTML(resource.title)}</h1>
            <p>${escapeHTML(resource.description)} 內容可以複製為個人版本，按你的課堂需要修改並儲存，不會影響平台原資源。</p>
            <div class="resource-points">
              <div><b>✓</b><span>先建立獨立可編輯草稿</span></div>
              <div><b>✓</b><span>自動生成單選、多選及判斷題</span></div>
              <div><b>✓</b><span>教師確認儲存後可建立課堂</span></div>
            </div>
            <div class="info-list" style="margin-bottom:22px">
              <div class="info-row"><span>學科</span><strong>${escapeHTML(resource.subject)}</strong></div>
              <div class="info-row"><span>教學語言</span><strong>${escapeHTML(resource.language)}</strong></div>
              <div class="info-row"><span>內容形態</span><strong>${escapeHTML(resource.type)}</strong></div>
              <div class="info-row"><span>正式題目</span><strong>平台資源不包含</strong></div>
            </div>
            <div class="button-row" style="display:grid">
              ${button("使用並修改", "use-resource", "primary", `class="btn btn-primary btn-lg btn-full" data-resource-id="${resource.id}"`)}
              ${button(favorite ? "取消收藏" : "收藏資源", "toggle-favorite", "outline", `class="btn btn-outline btn-full" data-resource-id="${resource.id}"`)}
            </div>
          </aside>
        </div>
      </section>`;
    return teacherShell({ title: "資源詳情", active: "resources", content });
  }

  function qrMarkup() {
    return `<div class="qr-wrap"><div class="qr-code" aria-label="模擬課堂二維碼"></div></div>`;
  }

  function renderLobby() {
    const work = classroomWork();
    const people = state.classroom.participants;
    const content = `
      <section class="page">
        ${pageHead("課堂候課", "候課室", "學生使用平板掃描二維碼，無需帳號、姓名或學號。", button("返回作品", "navigate", "ghost", `data-route="/work/${work.id}"`))}
        <div class="lobby-grid">
          <section class="card lobby-main accent-card">
            <span class="badge badge-jade" style="justify-self:center"><span class="pulse-dot"></span> 等待學生加入</span>
            <h1 class="home-display">掃碼進入這堂課</h1>
            <p>${escapeHTML(work.title)}</p>
            ${qrMarkup()}
            <div class="class-code">${state.classroom.code.slice(0, 3)} ${state.classroom.code.slice(3)}</div>
            <div class="button-row" style="justify-content:center;margin-top:21px">
              ${button("複製課堂連結", "copy-class-link", "outline")}
              ${button("放大二維碼", "show-qr", "secondary")}
              ${button("開啟學生端預覽", "open-student-tab", "ghost")}
            </div>
          </section>
          <aside class="lobby-side">
            <section class="card participant-card">
              <p class="eyebrow">即時參與</p>
              <div class="participant-count">${people}</div>
              <p class="muted" style="font-size:12px">位匿名學生已加入</p>
              <div class="participant-people">
                <span class="mini-avatar">21</span><span class="mini-avatar">22</span><span class="mini-avatar">23</span><span class="mini-avatar">24</span>
              </div>
              <span class="caption">學生只會看到本堂臨時編號</span>
            </section>
            <section class="card info-card accent-card">
              <h3>開始前檢查</h3>
              <div class="info-list">
                <div class="info-row"><span>教學作品</span><strong>已凍結 ${escapeHTML(work.versionId || "本次版本")}</strong></div>
                <div class="info-row"><span>配套正式題</span><strong>${classroomQuestions().length} 道</strong></div>
                <div class="info-row"><span>學生端同步</span><strong>正常</strong></div>
                <div class="info-row"><span>匿名加入</span><strong>已開放</strong></div>
              </div>
              <div class="button-row" style="display:grid;margin-top:20px">
                ${button("開始課堂", "start-class", "primary", 'class="btn btn-primary btn-lg btn-full"')}
                ${button("取消這堂課", "ask-cancel-class", "ghost", 'class="btn btn-ghost btn-full"')}
              </div>
            </section>
          </aside>
        </div>
      </section>`;
    return teacherShell({ title: "候課室", active: "works", content });
  }

  function activeInteractionLabel(active) {
    if (!active) return "";
    if (active.type === "question") return `正式題 · ${activeQuestionIds(active).length} 道`;
    if (active.type === "poll") return "投票";
    return "信號燈";
  }

  function interactionResults(active) {
    if (!active) return "";
    const counts = active.type === "signal" ? [14, 6, 4] : [15, 9];
    const labels = active.type === "signal" ? ["明白", "不確定", "需協助"] : ["先示範", "先討論"];
    const max = Math.max(...counts);
    return `
      <div class="bar-chart">
        ${counts.map((count, index) => `
          <div class="bar-row"><span>${labels[index]}</span><div class="bar-track"><div class="bar-fill" style="width:${Math.round(count / max * 100)}%"></div></div><strong>${count}</strong></div>`).join("")}
      </div>`;
  }

  function questionSetSummary(active, { includeAccuracy = false } = {}) {
    const questionsById = new Map(classroomQuestions().map(question => [question.id, question]));
    return `<div class="question-set-summary">
      ${activeQuestionIds(active).map((questionId, index) => {
        const question = questionsById.get(questionId);
        const stats = active.questionStats?.[questionId] || {};
        return `<div class="question-set-row">
          <span class="question-mini-number">${index + 1}</span>
          <span class="question-set-title">${escapeHTML(question?.text || "正式題")}</span>
          <strong>${Number.isFinite(stats.responses) ? stats.responses : 0} 人</strong>
          ${includeAccuracy ? `<span class="badge ${stats.accuracy < 65 ? "badge-amber" : "badge-jade"}">${Number.isFinite(stats.accuracy) ? stats.accuracy : 0}%</span>` : ""}
        </div>`;
      }).join("")}
    </div>`;
  }

  function teacherInteractionPanel() {
    const active = state.classroom.active;
    if (!active) {
      return `
        <div class="interaction-launchers">
          <button type="button" class="interaction-launcher" data-action="open-question-picker"><span class="launcher-symbol">題</span><span>正式題</span></button>
          <button type="button" class="interaction-launcher" data-action="open-poll"><span class="launcher-symbol">投</span><span>投票</span></button>
          <button type="button" class="interaction-launcher" data-action="open-signal"><span class="launcher-symbol">燈</span><span>信號燈</span></button>
        </div>
        <p class="caption" style="margin:12px 0 0">同一時間只會有一個互動正在收集。發布時會暫停時間型內容。</p>`;
    }

    const isCollecting = active.stage === "collecting";
    const isClosed = active.stage === "closed";
    const isPublished = active.stage === "published";
    const isQuestionSet = active.type === "question";
    const questionIds = activeQuestionIds(active);
    const completed = Number.isFinite(active.completed) ? active.completed : active.responses ?? 0;
    const answeredCount = isQuestionSet
      ? questionIds.reduce((sum, id) => sum + (active.questionStats?.[id]?.responses || 0), 0)
      : 0;
    return `
      <div class="interaction-active">
        <div class="button-row" style="justify-content:space-between">
          <span class="badge ${isCollecting ? "badge-jade" : isPublished ? "badge-amber" : "badge-neutral"}">${isCollecting ? "正在收集" : isClosed ? "已截止" : "結果已公布"}</span>
          <span class="caption">${activeInteractionLabel(active)}</span>
        </div>
        <h3>${isQuestionSet ? `已發布 ${questionIds.length} 道題` : escapeHTML(active.title)}</h3>
        <div class="response-number"><strong>${isQuestionSet ? completed : active.responses ?? 0}</strong><span>/ ${state.classroom.participants} ${isQuestionSet ? "已完成全部題目" : "已提交"}</span></div>
        ${isQuestionSet ? `<span class="caption">已收到 ${answeredCount} 份單題答案，學生可按自己的速度作答。</span>${questionSetSummary(active, { includeAccuracy: !isCollecting })}` : isCollecting ? `<div class="progress-track" style="margin:0" role="progressbar" aria-label="學生提交進度" aria-valuemin="0" aria-valuemax="${state.classroom.participants}" aria-valuenow="${active.responses ?? 0}"><div class="progress-bar" style="width:${Math.round((active.responses ?? 0) / Math.max(1, state.classroom.participants) * 100)}%"></div></div>` : interactionResults(active)}
        <div class="button-row" style="display:grid">
          ${isCollecting ? button("結束收集", "close-interaction", "primary", 'class="btn btn-primary btn-full"') : isClosed ? `${button("公佈結果", "publish-results", "primary", 'class="btn btn-primary btn-full"')}${button("不公佈，繼續教學", "continue-teaching", "ghost", 'class="btn btn-ghost btn-full"')}` : button("繼續教學", "continue-teaching", "primary", 'class="btn btn-primary btn-full"')}
        </div>
      </div>`;
  }

  function renderTeacherLive() {
    const work = classroomWork();
    return `
      <main class="classroom-live-shell">
        <header class="classroom-command-bar">
          <div class="classroom-title">
            <span class="brand-mark"><img src="./assets/teeko-brand-mark.png" alt="Teeko" /></span>
            <div><strong>${escapeHTML(work.title)}</strong><span><span class="pulse-dot" style="display:inline-block;margin-right:6px"></span>課堂進行中 · ${state.classroom.participants} 位匿名學生</span></div>
          </div>
          <div class="button-row">
            ${button("顯示課堂碼", "show-qr", "outline", 'class="btn btn-outline btn-sm"')}
            ${button("學生端預覽", "open-student-tab", "secondary", 'class="btn btn-secondary btn-sm"')}
            ${button("全螢幕", "toggle-fullscreen", "ghost", 'class="btn btn-ghost btn-sm"')}
            ${button("結束課堂", "ask-end-class", "danger", 'class="btn btn-danger btn-sm"')}
          </div>
        </header>
        <div class="classroom-grid">
          <section class="classroom-stage-frame">
            <div class="classroom-stage">${lessonCanvas(state.classroom.page)}</div>
            <div class="classroom-control-dock">
              <button type="button" class="control-round" data-action="lesson-prev" aria-label="上一頁">上一頁</button>
              <button type="button" class="control-round" data-action="toggle-play" aria-label="${state.classroom.playing ? "暫停" : "播放"}">${state.classroom.playing ? "暫停" : "播放"}</button>
              <span class="page-counter">${state.classroom.page} / ${state.classroom.total}</span>
              <button type="button" class="control-round" data-action="lesson-next" aria-label="下一頁">下一頁</button>
              <span style="width:1px;height:28px;background:#d9e3df"></span>
              ${work.subject === "科學" ? `
                <button type="button" class="control-round" data-action="change-focus" data-change="-8">焦距 -</button>
                <span class="caption">${state.classroom.focus} mm</span>
                <button type="button" class="control-round" data-action="change-focus" data-change="8">焦距 +</button>` : `
                <button type="button" class="control-round" data-action="reset-work-effect">重設互動</button>
                <span class="caption">操作效果同步</span>
                <button type="button" class="control-round" data-action="demo-work-effect">執行互動</button>`}
            </div>
          </section>
          <aside class="classroom-side">
            <section class="classroom-side-card">
              <div class="side-card-head"><h2>學生端同步</h2><span class="badge badge-jade"><span class="pulse-dot"></span>正常</span></div>
              <div class="side-card-body">
                <div class="sync-preview">${lessonCanvas(state.classroom.page, { compact: true })}<span class="sync-overlay"><span class="pulse-dot"></span>只讀跟隨</span></div>
                <div class="info-row" style="margin-top:11px"><span>目前畫面</span><strong>第 ${state.classroom.page} 頁</strong></div>
                <div class="info-row" style="margin-top:8px"><span>內容狀態</span><strong>${state.classroom.playing ? "播放中" : "已暫停"}</strong></div>
              </div>
            </section>
            <section class="classroom-side-card">
              <div class="side-card-head"><h2>課堂互動</h2><span class="caption">${state.classroom.rounds.length} 輪已記錄</span></div>
              <div class="side-card-body">${teacherInteractionPanel()}</div>
            </section>
            <section class="classroom-side-card">
              <div class="side-card-head"><h3>課堂狀態</h3></div>
              <div class="side-card-body">
                <div class="info-list">
                  <div class="info-row"><span>匿名加入</span><strong>${state.classroom.participants} 人</strong></div>
                  <div class="info-row"><span>目前在線</span><strong>${state.classroom.online} 人</strong></div>
                  <div class="info-row"><span>課堂代碼</span><strong>${state.classroom.code}</strong></div>
                </div>
              </div>
            </section>
          </aside>
        </div>
      </main>`;
  }

  function renderJoin(code = state.classroom.code) {
    const freshEntry = code === "new";
    const unavailable = ["ended", "cancelled"].includes(state.classroom.status) && !freshEntry;
    const cancelled = state.classroom.status === "cancelled";
    const invalid = !freshEntry && code !== state.classroom.code;
    const inputCode = freshEntry ? "" : code;
    return `
      <main class="join-page">
        <section class="join-card">
          ${brandLockup()}
          ${unavailable ? `
            <div class="waiting-visual" style="margin-top:12px">${cancelled ? "止" : "完"}</div>
            <h1>${cancelled ? "這堂課已經取消" : "這堂課已經結束"}</h1>
            <p>課堂代碼已失效，無法再加入或提交答案。</p>
            ${button("重新輸入課堂代碼", "reset-join-code", "outline", 'class="btn btn-outline btn-full"')}` : `
            <p class="eyebrow">匿名課堂</p>
            <h1>加入 Teeko 課堂</h1>
            <p>你不需要帳號或姓名。系統只會建立一個在本堂有效的匿名編號。</p>
            <label class="field-label" for="join-code">課堂代碼</label>
            <input id="join-code" class="input code-input ${invalid ? "is-error" : ""}" value="${escapeHTML(inputCode)}" maxlength="6" inputmode="numeric" data-ui-field="joinCode" />
            ${invalid ? `<div class="field-error" style="margin-bottom:14px">課堂代碼無效，請檢查後再試。</div>` : ""}
            ${button("匿名加入課堂", "join-class", "primary", 'class="btn btn-primary btn-lg btn-full"')}
            <p class="auth-note">臨時編號會在課堂結束後失效，也不會用作跨課堂識別。</p>`}
        </section>
      </main>`;
  }

  function studentHeader() {
    return `
      <header class="student-session-bar">
        <div class="student-brand"><span class="brand-mark"><img src="./assets/teeko-brand-mark.png" alt="" /></span><div><strong>TEEKO 學生端</strong><span>只在本堂課有效</span></div></div>
        <div class="student-code"><span class="pulse-dot"></span>匿名 ${state.student.anonymousId}</div>
      </header>`;
  }

  function studentQuestion(active) {
    const availableQuestions = classroomQuestions();
    const questionIds = activeQuestionIds(active);
    const questionIndex = Math.max(0, Math.min(questionIds.length - 1, state.student.questionIndex || 0));
    const questionId = questionIds[questionIndex];
    const question = availableQuestions.find(item => item.id === questionId) || availableQuestions[0];
    const selected = state.student.answers?.[question.id] || [];
    const answeredCount = questionIds.filter(id => (state.student.answers?.[id] || []).length).length;
    const remainingCount = questionIds.length - answeredCount;
    const closed = active.stage === "closed";

    if (state.student.completed && !state.student.reviewing) {
      return `
        <section class="student-question-card student-complete-card">
          <div class="waiting-visual">${answeredCount}</div>
          <span class="badge badge-jade">${closed ? "收集已截止" : "答案已儲存"}</span>
          <h1>${closed ? "等待老師公佈結果" : "你已完成全部題目"}</h1>
          <p>本次共 ${questionIds.length} 道題。${closed ? "現在不能再修改答案。" : "老師結束收集前，你仍可返回檢查和修改。"}</p>
          ${closed ? "" : button("返回檢查答案", "student-review-answers", "outline", 'class="btn btn-outline btn-lg btn-full"')}
        </section>`;
    }

    return `
      <section class="student-question-card">
        <div class="button-row" style="justify-content:space-between;margin-bottom:14px">
          <span class="badge badge-jade">${question.type}</span>
          <span class="caption">第 ${questionIndex + 1} / ${questionIds.length} 題 · ${closed ? "已截止" : "答案自動儲存"}</span>
        </div>
        ${questionIds.length > 1 ? `<nav class="student-question-nav" aria-label="題目目錄">${questionIds.map((id, index) => `<button type="button" class="student-question-jump ${index === questionIndex ? "is-current" : ""} ${(state.student.answers?.[id] || []).length ? "is-answered" : ""}" data-action="student-go-question" data-index="${index}" aria-label="前往第 ${index + 1} 題" ${index === questionIndex ? 'aria-current="step"' : ""}>${index + 1}</button>`).join("")}</nav>` : ""}
        <h1>${escapeHTML(question.text)}</h1>
        <p>${question.type === "多選題" ? "可選擇多於一個答案，必須完全匹配才算答對。" : "選擇答案後會立即儲存。"}</p>
        <div class="answer-options">
          ${question.options.map((option, index) => `
            <button type="button" class="answer-option ${selected.includes(index) ? "is-selected" : ""}" data-action="student-select-answer" data-question-id="${question.id}" data-index="${index}" data-multiple="${question.type === "多選題"}" ${closed ? "disabled" : ""}>
              <span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span>
            </button>`).join("")}
        </div>
        ${closed ? `<div class="notice">收集已截止，未作答題目會記為未提交。請等待老師公佈結果或繼續教學。</div>` : `
          <div class="student-question-controls">
            ${questionIds.length > 1 ? button("上一題", "student-go-question", "outline", `data-index="${Math.max(0, questionIndex - 1)}" ${questionIndex === 0 ? "disabled" : ""}`) : ""}
            <span class="caption">已作答 ${answeredCount} / ${questionIds.length}</span>
            ${questionIndex < questionIds.length - 1
              ? button("下一題", "student-go-question", "primary", `data-index="${questionIndex + 1}"`)
              : button(remainingCount ? `尚有 ${remainingCount} 題` : "完成作答", "student-complete-questions", "primary", `${remainingCount ? "disabled" : ""}`)}
          </div>`}
      </section>`;
  }

  function studentPoll(active) {
    const selected = Array.isArray(ui.studentLocalSelection) ? ui.studentLocalSelection : state.student.selection;
    const closed = active.stage === "closed";
    return `
      <section class="student-question-card">
        <div class="button-row" style="justify-content:space-between;margin-bottom:14px"><span class="badge badge-jade">即時投票</span><span class="caption">單選 · 結束前可修改</span></div>
        <h1>${escapeHTML(active.title)}</h1>
        <p>這是課堂投票，不會計算正確率。</p>
        <div class="answer-options">
          ${(active.options || ["先看老師示範", "先與同學討論"]).map((option, index) => `<button type="button" class="answer-option ${selected.includes(index) ? "is-selected" : ""}" data-action="student-select-answer" data-index="${index}" data-multiple="false" ${closed ? "disabled" : ""}><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></button>`).join("")}
        </div>
        ${closed ? `<div class="notice">投票已截止，請等待老師下一步。</div>` : button(state.student.submitted ? "更新投票" : "提交投票", "student-submit-answer", "primary", 'class="btn btn-primary btn-lg btn-full"')}
      </section>`;
  }

  function studentSignal(active) {
    const selected = Array.isArray(ui.studentLocalSelection) ? ui.studentLocalSelection[0] : state.student.selection[0];
    const closed = active.stage === "closed";
    const signals = [
      { name: "明白", className: "signal-green" },
      { name: "不確定", className: "signal-yellow" },
      { name: "需要協助", className: "signal-red" }
    ];
    return `
      <section class="student-question-card">
        <div class="button-row" style="justify-content:space-between;margin-bottom:14px"><span class="badge badge-jade">信號燈</span><span class="caption">即時理解回饋</span></div>
        <h1>${escapeHTML(active.title)}</h1>
        <p>選擇最貼近你目前理解狀態的一項。這不會計算正確率。</p>
        <div class="signal-options">
          ${signals.map((signal, index) => `<button type="button" class="signal-btn ${signal.className} ${selected === index ? "is-selected" : ""}" data-action="student-select-answer" data-index="${index}" data-multiple="false" ${closed ? "disabled" : ""}><span class="signal-light"></span><span>${signal.name}</span></button>`).join("")}
        </div>
        ${closed ? `<div class="notice">信號燈已截止，請等待老師下一步。</div>` : button(state.student.submitted ? "更新狀態" : "提交狀態", "student-submit-answer", "primary", 'class="btn btn-primary btn-lg btn-full"')}
      </section>`;
  }

  function studentResult(active) {
    const isQuestion = active.type === "question";
    if (isQuestion) {
      const questionsById = new Map(classroomQuestions().map(question => [question.id, question]));
      const questionIds = activeQuestionIds(active);
      const correctCount = questionIds.filter(id => isExactAnswer(questionsById.get(id), state.student.answers?.[id] || [])).length;
      return `
        <section class="student-result-card">
          <span class="badge badge-amber">老師已公佈結果</span>
          <div class="result-hero">
            <span class="result-icon">${correctCount}</span>
            <div><h1 style="margin-bottom:5px">答對 ${correctCount} / ${questionIds.length} 題</h1><p style="margin:0" class="muted">以下按每道題顯示你的答案、正確答案、解析和全班匿名分布。</p></div>
          </div>
          <div class="student-result-list">
            ${questionIds.map((id, index) => {
              const question = questionsById.get(id);
              const selected = [...(state.student.answers?.[id] || [])].sort((a, b) => a - b);
              const correct = isExactAnswer(question, selected);
              const selectedLabel = selected.length ? selected.map(answerIndex => String.fromCharCode(65 + answerIndex)).join("、") : "未提交";
              const answerLabel = (question?.answer || []).map(answerIndex => String.fromCharCode(65 + answerIndex)).join("、");
              const stats = active.questionStats?.[id] || {};
              return `<article class="student-result-item ${correct ? "is-correct" : "is-incorrect"}">
                <div class="student-result-head"><span class="question-mini-number">${index + 1}</span><strong>${escapeHTML(question?.text || "正式題")}</strong><span class="badge ${correct ? "badge-jade" : "badge-amber"}">${correct ? "答對" : selected.length ? "答錯" : "未提交"}</span></div>
                <p>你的答案：${selectedLabel}　正確答案：${answerLabel}</p>
                <div class="notice">解析：${escapeHTML(question?.explanation || "暫無解析")}</div>
                <details class="result-distribution"><summary>查看全班分布</summary><div class="info-list"><div class="info-row"><span>有效提交</span><strong>${Number.isFinite(stats.responses) ? stats.responses : 0} 人</strong></div><div class="info-row"><span>完全答對</span><strong>${Number.isFinite(stats.accuracy) ? stats.accuracy : 0}%</strong></div></div></details>
              </article>`;
            }).join("")}
          </div>
          <div style="margin-top:22px">${button("查看目前課堂內容", "student-view-content", "outline", 'class="btn btn-outline btn-full"')}</div>
        </section>`;
    }
    return `
      <section class="student-result-card">
        <span class="badge badge-amber">老師已公佈結果</span>
        <div class="result-hero">
          <span class="result-icon">察</span>
          <div><h1 style="margin-bottom:5px">已收到你的回饋</h1><p style="margin:0" class="muted">以下是全班的匿名整體分布。</p></div>
        </div>
        <h2 style="color:#082f36;font-size:17px">全班分布</h2>
        ${interactionResults(active)}
        <div style="margin-top:22px">${button("查看目前課堂內容", "student-view-content", "outline", 'class="btn btn-outline btn-full"')}</div>
      </section>`;
  }

  function renderStudentLive() {
    const classroom = state.classroom;
    if (!state.student.connected) {
      return `<main class="student-shell">${studentHeader()}<div class="student-main"><section class="waiting-card"><div class="waiting-visual">連</div><h1>暫時失去連線</h1><p>已保留最後畫面和匿名編號。重新連線後會取得老師目前的課堂狀態。</p>${button("重新連線", "student-reconnect", "primary", 'class="btn btn-primary btn-lg"')}</section></div></main>`;
    }
    if (["ended", "cancelled"].includes(classroom.status)) {
      const cancelled = classroom.status === "cancelled";
      return `<main class="student-shell">${studentHeader()}<div class="student-main"><section class="student-ended-card"><div class="waiting-visual">${cancelled ? "止" : "完"}</div><p class="eyebrow">${cancelled ? "課堂已取消" : "課堂已結束"}</p><h1>${cancelled ? "老師取消了這堂課" : "今天的課堂完成了"}</h1><p>你的匿名編號會在本堂結束後失效。${cancelled ? "請向老師確認新的課堂代碼。" : "感謝參與。"}</p>${button("完成", "student-finish", "primary", 'class="btn btn-primary btn-lg"')}</section></div></main>`;
    }
    if (classroom.status === "waiting") {
      return `<main class="student-shell">${studentHeader()}<div class="student-main"><section class="waiting-card"><div class="waiting-visual">${state.student.anonymousId}</div><p class="eyebrow">已加入</p><h1>等待老師開始</h1><p>這是你在本堂課的匿名編號。課堂開始後，教學內容會自動顯示。</p><div class="status-pill" style="margin:12px auto 0;width:max-content"><span class="pulse-dot"></span>正在等待</div></section></div></main>`;
    }
    const active = classroom.active;
    let body = "";
    if (!active || state.student.resultDismissed) {
      body = `
        <section class="student-lesson-panel">
          ${lessonCanvas(classroom.page)}
          <span class="read-only-banner"><span class="pulse-dot"></span>跟隨老師中 · 只讀</span>
          <div class="student-panel-foot"><span class="caption">老師目前顯示第 ${classroom.page} 頁 · ${classroom.playing ? "播放中" : "已暫停"}</span><span class="badge badge-neutral">你無需操作內容</span></div>
        </section>
        <div class="notice" style="margin-top:16px">教學作品中的按鈕、拖動和遊戲操作由老師控制。需要你回答時，Teeko 會自動切換到互動頁。</div>`;
    } else if (active.stage === "published") {
      body = studentResult(active);
    } else if (active.type === "question") {
      body = studentQuestion(active);
    } else if (active.type === "poll") {
      body = studentPoll(active);
    } else {
      body = studentSignal(active);
    }
    return `<main class="student-shell">${studentHeader()}<div class="student-main">${body}</div></main>`;
  }

  function buildReportFromClassroom() {
    const work = classroomWork();
    const questionSource = classroomQuestions();
    const endedAt = new Date(state.classroom.endedAt || Date.now());
    const startedAt = new Date(state.classroom.startedAt || endedAt.getTime());
    const durationMinutes = Math.max(1, Math.round((endedAt.getTime() - startedAt.getTime()) / 60000));
    const accuracySamples = [85, 58, 83, 74, 89, 67];
    const rounds = clone(state.classroom.rounds).flatMap((round, roundIndex) => {
      if (round.type !== "question") return [round];
      const questionIds = Array.isArray(round.questionIds) && round.questionIds.length ? round.questionIds : [round.questionId];
      return questionIds.filter(Boolean).map((questionId, questionIndex) => {
        const question = questionSource.find(item => item.id === questionId);
        const stats = round.questionStats?.[questionId] || round;
        return {
          ...round,
          id: questionIds.length > 1 ? `${round.id}-${questionId}` : round.id,
          groupId: questionIds.length > 1 ? round.id : round.groupId,
          questionId,
          title: question?.text || round.title,
          questionType: question?.type || "正式題",
          responses: Number.isFinite(stats.responses) ? stats.responses : 0,
          accuracy: Number.isFinite(stats.accuracy) ? stats.accuracy : accuracySamples[(roundIndex + questionIndex) % accuracySamples.length]
        };
      });
    });
    const questionRounds = rounds.filter(round => round.type === "question");
    const responseRounds = rounds.filter(round => Number.isFinite(round.responses));
    const responseRate = responseRounds.length
      ? Math.round(responseRounds.reduce((sum, round) => sum + Math.min(100, round.responses / Math.max(1, state.classroom.participants) * 100), 0) / responseRounds.length)
      : null;
    const accuracy = questionRounds.length
      ? Math.round(questionRounds.reduce((sum, round) => sum + round.accuracy, 0) / questionRounds.length)
      : null;

    state.report = {
      id: `rep-${Date.now()}`,
      workId: work.id,
      title: work.title,
      subject: work.subject,
      language: work.language,
      workVersionId: work.versionId || "本次課堂版本",
      date: new Intl.DateTimeFormat("zh-HK", { year: "numeric", month: "long", day: "numeric", hour: "2-digit", minute: "2-digit", hour12: false }).format(endedAt),
      participants: state.classroom.participants,
      duration: `${durationMinutes} 分鐘`,
      questionRounds: questionRounds.length,
      responseRate,
      accuracy,
      rounds,
      status: "generating"
    };
    const feedbackIds = [];
    if (questionRounds.length) feedbackIds.push("question");
    if (rounds.some(round => round.type === "signal")) feedbackIds.push("signal");
    if (responseRounds.length) feedbackIds.push("pace");
    ui.reportFeedback = feedbackIds.slice(0, 2);
  }

  function ensureReportTimer() {
    if (state.reportTask.status !== "running" || ui.reportTimer) return;
    ui.reportTimer = window.setInterval(() => {
      state.reportTask.progress = Math.min(100, state.reportTask.progress + 13);
      if (state.reportTask.progress >= 100) {
        state.reportTask.status = "ready";
        state.report.status = "ready";
        window.clearInterval(ui.reportTimer);
        ui.reportTimer = null;
      }
      persist();
      render();
    }, 480);
  }

  function renderReportGenerating() {
    ensureReportTimer();
    const task = state.reportTask;
    const ready = task.status === "ready";
    const failed = task.status === "failed";
    const content = `
      <section class="page page-narrow">
        <div class="card generate-card accent-card">
          <div class="generate-orbit"><span class="brand-mark" style="width:62px;height:62px;border-radius:19px"><img src="./assets/teeko-brand-mark.png" alt="" /></span></div>
          <p class="eyebrow">課堂匯總</p>
          <h1 class="home-display">${ready ? "課堂報告已準備好" : failed ? "報告生成未完成" : "正在整理這堂課"}</h1>
          <p class="muted" style="font-size:13px">${ready ? "只會保留匿名整體匯總，不會展示臨時編號或個人答題軌跡。" : failed ? "課堂已安全結束，基礎資料仍然保留，可以重新生成報告。" : "正在匯總正式題、投票與信號燈資料。三類資料會分開呈現。"}</p>
          <div class="progress-track"><div class="progress-bar" style="width:${task.progress}%"></div></div>
          <strong style="color:#082f36;font-size:24px">${task.progress}%</strong>
          <div class="stage-list" style="grid-template-columns:repeat(4,1fr)">
            ${["凍結課堂", "整理互動", "建立匯總", "完成報告"].map((item, index) => `<div class="stage-item ${task.progress >= (index + 1) * 25 ? "is-done" : task.progress >= index * 25 ? "is-active" : ""}">${item}</div>`).join("")}
          </div>
          <div class="button-row" style="justify-content:center">
            ${ready ? button("查看課堂報告", "navigate", "primary", `class="btn btn-primary btn-lg" data-route="/report/${state.report.id}"`) : failed ? `${button("重新生成", "retry-report", "primary")}${button("前往課堂記錄", "navigate", "outline", 'data-route="/history"')}` : button("返回首頁，背景繼續", "navigate", "outline", 'data-route="/home"')}
          </div>
        </div>
      </section>`;
    return teacherShell({ title: "報告生成", active: "history", content });
  }

  function reportBar(label, value, color = "#087a6c") {
    return `<div class="bar-row" style="grid-template-columns:82px 1fr 36px"><span>${label}</span><div class="bar-track"><div class="bar-fill" style="width:${value}%;background:${color}"></div></div><strong>${value}%</strong></div>`;
  }

  function renderReport() {
    const report = state.report;
    const questionRounds = (report.rounds || []).filter(round => round.type === "question");
    const toolRounds = (report.rounds || []).filter(round => round.type === "poll" || round.type === "signal");
    const lowestQuestion = [...questionRounds].sort((a, b) => a.accuracy - b.accuracy)[0];
    const signalRound = toolRounds.find(round => round.type === "signal");
    const scoreLabel = Number.isFinite(report.accuracy) ? `${report.accuracy}%` : "暫無";
    const responseLabel = Number.isFinite(report.responseRate) ? `${report.responseRate}%` : "暫無";
    const content = `
      <section class="page report-shell">
        ${pageHead("課堂報告", "課堂報告", "這份報告只呈現課堂整體匯總，用於教師個人教學反思。", `${button("返回課堂記錄", "navigate", "ghost", 'data-route="/history"')}${button("基於本次課堂繼續備課", "open-report-feedback", "primary")}`)}
        <article class="report-hero">
          <div>
            <span class="badge badge-jade">整體報告 · 已完成</span>
            <h1 class="home-display">${escapeHTML(report.title)}</h1>
            <p>${escapeHTML(report.date)} · ${escapeHTML(report.subject)} · ${escapeHTML(report.language)} · 版本 ${escapeHTML(report.workVersionId)}</p>
            <div class="button-row" style="margin-top:18px">
              ${button("查看教學作品", "navigate", "outline", `class="btn btn-outline btn-sm" data-route="/work/${report.workId}"`)}
              ${button("再次開設課堂", "create-class", "ghost", `class="btn btn-ghost btn-sm" data-work-id="${report.workId}"`)}
            </div>
          </div>
          <div class="report-score"><strong>${scoreLabel}</strong><span>正式題平均正確率</span></div>
        </article>
        <div class="report-summary">
          <div class="card summary-card"><strong>${report.participants}</strong><span>匿名參與人數</span></div>
          <div class="card summary-card"><strong>${report.duration}</strong><span>課堂時長</span></div>
          <div class="card summary-card"><strong>${report.questionRounds}</strong><span>正式題輪次</span></div>
          <div class="card summary-card"><strong>${responseLabel}</strong><span>平均回應率</span></div>
        </div>
        <div class="report-grid">
          <div class="side-stack" style="display:grid;grid-template-columns:1fr">
            <section class="card report-panel accent-card">
              <p class="eyebrow">教學反思</p>
              <h2>值得帶入下一堂的訊號</h2>
              <div class="insight-list">
                ${lowestQuestion ? `<div class="insight"><strong>正式題仍有鞏固空間</strong><span>「${escapeHTML(lowestQuestion.title)}」的模擬整體正確率為 ${lowestQuestion.accuracy}%，可在下一課加入短回顧。</span></div>` : `<div class="insight"><strong>本堂未發布正式題</strong><span>報告保留課堂基本資訊，不推斷學生的概念掌握情況。</span></div>`}
                ${signalRound ? `<div class="insight"><strong>信號燈反映理解差異</strong><span>本堂收集了 ${signalRound.responses || 0} 份理解狀態，可在下一課先確認學生需要。</span></div>` : `<div class="insight"><strong>未使用信號燈</strong><span>下一堂可按需要加入一次快速理解檢查。</span></div>`}
                <div class="insight"><strong>互動節奏可延續</strong><span>${Number.isFinite(report.responseRate) ? `各輪互動平均回應率為 ${report.responseRate}%。` : "本堂沒有互動回應資料。"}教師可自行決定是否沿用目前節奏。</span></div>
              </div>
              <div style="margin-top:18px">${button("選擇回饋，繼續備課", "open-report-feedback", "primary", 'class="btn btn-primary btn-full"')}</div>
            </section>
            <section class="card report-panel">
              <h2>課堂工具匯總</h2>
              ${toolRounds.length ? `<div class="info-list">${toolRounds.map(round => `<div class="info-row"><span>${round.type === "poll" ? "投票" : "信號燈"}：${escapeHTML(round.title)}</span><strong>${round.responses || 0} 份回應</strong></div>`).join("")}</div>` : `<div class="notice">本堂沒有使用投票或信號燈。</div>`}
              <p class="caption" style="margin:15px 0 0">投票和信號燈不會被計算為正式題正確率。</p>
            </section>
          </div>
          <section class="card report-panel">
            <div class="section-row" style="margin:0 0 17px"><h2 style="margin:0">正式題表現</h2><span class="badge badge-neutral">有效提交為分母</span></div>
            ${questionRounds.length ? `<div class="question-report">${questionRounds.map((round, index) => `<article class="report-evidence-card"><div class="evidence-head"><strong>Q${index + 1} ${escapeHTML(round.title)}</strong><span class="badge ${round.accuracy < 65 ? "badge-amber" : "badge-jade"}">${round.accuracy}%</span></div>${reportBar(round.questionType === "多選題" ? "完全正確" : "答對", round.accuracy, round.accuracy < 65 ? "#d59b38" : "#087a6c")}</article>`).join("")}</div>` : `<div class="empty-state" style="min-height:210px"><div><h3>本堂未發布正式題</h3><p>因此不顯示正確率或概念掌握推斷。</p></div></div>`}
            <div class="prototype-note">正確率按有效提交計算；未提交人數另行記錄。多選題在這個原型中採用完全匹配。</div>
          </section>
        </div>
      </section>`;
    return teacherShell({ title: "課堂報告", active: "history", content });
  }

  function renderHistory() {
    const reportReady = state.reportTask.status === "ready" || state.report.status === "ready";
    const report = state.report;
    const dateParts = String(report.date || "8 月 27 日").match(/(\d{1,2})\s*月\s*(\d{1,2})\s*日/);
    const dateDay = dateParts?.[2] || "27";
    const dateMonth = dateParts?.[1] || "8";
    const content = `
      <section class="page">
        ${pageHead("課堂記錄", "課堂記錄", "查看你個人的歷史課堂與整體報告。這裡不會顯示班級或學生身份。", button("從作品建立課堂", "navigate", "primary", 'data-route="/works"'))}
        <div class="history-list">
          <article class="card history-item">
            <div class="history-date"><strong>${escapeHTML(dateDay)}</strong><span>${escapeHTML(dateMonth)} 月</span></div>
            <div class="history-info"><h3>${escapeHTML(report.title)}</h3><p>${report.participants} 位匿名參與 · ${escapeHTML(report.duration)} · ${reportReady ? "報告已完成" : "報告生成中"}</p></div>
            <div class="button-row">
              ${reportReady ? `${button("查看報告", "navigate", "secondary", `class="btn btn-secondary btn-sm" data-route="/report/${report.id}"`)}${button("繼續備課", "open-report-feedback", "ghost", 'class="btn btn-ghost btn-sm"')}` : button("查看進度", "navigate", "secondary", 'class="btn btn-secondary btn-sm" data-route="/report-generating"')}
            </div>
          </article>
          <article class="card history-item">
            <div class="history-date"><strong>21</strong><span>8 月</span></div>
            <div class="history-info"><h3>City Voices 城市英語任務</h3><p>27 位匿名參與 · 42 分鐘 · 報告已完成</p></div>
            <div class="button-row">
              ${button("查看報告", "show-historical-report", "secondary", 'class="btn btn-secondary btn-sm"')}
              ${button("再次開課", "create-class", "ghost", 'class="btn btn-ghost btn-sm" data-work-id="w2"')}
            </div>
          </article>
          <article class="card history-item">
            <div class="history-date"><strong>14</strong><span>8 月</span></div>
            <div class="history-info"><h3>香港開埠與城市變遷</h3><p>0 位匿名參與 · 4 分鐘 · 基礎報告已完成</p></div>
            <div class="button-row">
              ${button("查看基礎報告", "show-empty-report", "outline", 'class="btn btn-outline btn-sm"')}
            </div>
          </article>
        </div>
        <div class="prototype-note">只要課堂成功開始並由教師結束，就會形成一條歷史記錄。0 人參與時只生成基礎資訊，不推斷學習表現。</div>
      </section>`;
    return teacherShell({ title: "課堂記錄", active: "history", content });
  }

  function renderAccount() {
    const content = `
      <section class="page page-narrow">
        ${pageHead("帳號", "帳號與權益", "管理教師個人登入狀態及學校發放的使用權益。")}
        <div class="account-layout">
          <section class="card account-profile">
            <div class="profile-avatar">陳</div>
            <h2>${escapeHTML(state.teacher.name)}</h2>
            <p>${escapeHTML(state.teacher.email)}</p>
            <span class="badge badge-jade">教師個人帳號</span>
          </section>
          <section class="card entitlement-card accent-card">
            <div class="entitlement-hero">
              <div><strong>Teeko 使用權益有效</strong><span>由學校採購並發放啟用碼</span></div>
              <span class="badge" style="color:#fff;background:rgba(255,255,255,.13)">已啟用</span>
            </div>
            <div class="info-list">
              <div class="info-row"><span>權益狀態</span><strong>使用中</strong></div>
              <div class="info-row"><span>有效期至</span><strong>${escapeHTML(state.teacher.entitlement)}</strong></div>
              <div class="info-row"><span>個人作品</span><strong>${state.works.length} 份</strong></div>
              <div class="info-row"><span>收藏資源</span><strong>${state.favorites.length} 份</strong></div>
            </div>
            <div class="button-row" style="margin-top:25px">
              ${button("輸入新啟用碼", "go-activate", "outline")}
              ${button("返回首頁", "navigate", "secondary", 'data-route="/home"')}
              ${button("登出", "logout", "ghost")}
            </div>
            <div class="prototype-note">費用、啟用碼疊加及到期後的查看、編輯、開課權限仍待確認，因此本原型不放購買或續費入口。</div>
          </section>
        </div>
        <div class="button-row" style="justify-content:center;margin-top:24px">
          ${button("重設所有示範資料", "ask-reset-demo", "danger")}
        </div>
      </section>`;
    return teacherShell({ title: "帳號與權益", active: "account", content });
  }

  function modalShell({ title, description = "", body, footer = "", large = false }) {
    return `
      <div class="modal-backdrop" data-layer="modal">
        <section class="modal ${large ? "modal-lg" : ""}" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}" tabindex="-1">
          <header class="modal-head"><div><h2>${escapeHTML(title)}</h2>${description ? `<p>${escapeHTML(description)}</p>` : ""}</div><button type="button" class="modal-close" data-action="close-layer" aria-label="關閉">×</button></header>
          <div class="modal-body">${body}</div>
          ${footer ? `<footer class="modal-foot">${footer}</footer>` : ""}
        </section>
      </div>`;
  }

  function drawerShell({ title, description = "", body, footer = "" }) {
    return `
      <div class="drawer-backdrop" data-layer="drawer">
        <section class="drawer" role="dialog" aria-modal="true" aria-label="${escapeHTML(title)}" tabindex="-1">
          <header class="drawer-head"><div><h2>${escapeHTML(title)}</h2>${description ? `<p>${escapeHTML(description)}</p>` : ""}</div><button type="button" class="modal-close" data-action="close-layer" aria-label="關閉">×</button></header>
          <div class="drawer-body">${body}</div>
          <footer class="drawer-foot">${footer}</footer>
        </section>
      </div>`;
  }

  function renderQuestionEditor(drawer) {
    const work = workById(drawer.workId);
    const existing = work.questions.find(question => question.id === drawer.questionId);
    const question = existing || { type: "單選題", text: "", options: ["", "", "", ""], answer: [0], explanation: "" };
    return modalShell({
      title: existing ? "編輯配套題" : "新增配套題",
      description: "只支援單選題、多選題及判斷題。非 PPT 作品不會關聯特定頁面。",
      large: true,
      body: `
        <div class="field">
          <label class="field-label" for="question-type">題型</label>
          <select id="question-type" class="select" data-editor-field="type">
            ${["單選題", "多選題", "判斷題"].map(type => `<option ${question.type === type ? "selected" : ""}>${type}</option>`).join("")}
          </select>
        </div>
        <div class="field">
          <label class="field-label" for="question-text">題目</label>
          <textarea id="question-text" class="textarea" data-editor-field="text" placeholder="輸入題目內容">${escapeHTML(question.text)}</textarea>
        </div>
        <div class="field">
          <span class="field-label">選項</span>
          <div style="display:grid;gap:9px">
            ${question.options.map((option, index) => `<input class="input" data-question-option="${index}" value="${escapeHTML(option)}" placeholder="選項 ${String.fromCharCode(65 + index)}" />`).join("")}
          </div>
        </div>
        <div class="field">
          <span class="field-label">正確答案</span>
          <div id="question-answer-list" class="answer-options" style="gap:8px">
            ${question.options.map((option, index) => `<label class="answer-option" style="cursor:pointer;padding:11px 13px"><input type="${question.type === "多選題" ? "checkbox" : "radio"}" name="correct-answer" data-correct-answer value="${index}" ${question.answer.includes(index) ? "checked" : ""} /><span><strong>${String.fromCharCode(65 + index)}</strong> ${escapeHTML(option || `選項 ${String.fromCharCode(65 + index)}`)}</span></label>`).join("")}
          </div>
          <span id="question-answer-hint" class="field-hint">${question.type === "多選題" ? "可選擇多於一個正確答案，判分採完全匹配。" : "請選擇一個正確答案。"}</span>
        </div>
        <div class="field">
          <label class="field-label" for="question-explanation">答案解析</label>
          <textarea id="question-explanation" class="textarea" data-editor-field="explanation" style="min-height:90px">${escapeHTML(question.explanation)}</textarea>
        </div>`,
      footer: `${button("取消", "close-layer", "ghost")}${button("套用題目修改", "save-question", "primary", `data-work-id="${work.id}" data-question-id="${existing?.id || ""}"`)}`
    });
  }

  function renderOverlay() {
    const layer = ui.drawer || ui.modal;
    if (!layer) return "";

    if (ui.drawer?.type === "question-editor") return renderQuestionEditor(ui.drawer);

    if (ui.drawer?.type === "content-editor") {
      const work = workById(ui.drawer.workId);
      const revision = ui.contentRevision?.workId === work.id ? ui.contentRevision : { status: "editing" };
      if (revision.status === "running") {
        return modalShell({
          title: "正在生成修改版本",
          description: "修改要求已提交至知雀，Teeko 正在等待新的不可變版本、託管連結及內容摘要。",
          large: true,
          body: `${revision.candidate ? `<div class="info-row" style="margin-bottom:16px"><span>本輪基於</span><strong>${escapeHTML(revision.candidate.versionId)}</strong></div>` : ""}<div class="notice"><strong>修改要求</strong><br />${escapeHTML(revision.request)}</div><div class="prototype-note">你可以先關閉此視窗，生成會在背景繼續。已儲存版本在套用候選並儲存修改前不會改變。</div>`,
          footer: button("關閉", "close-layer", "ghost")
        });
      }
      if (revision.status === "ready") {
        const previewPage = Math.max(1, Math.min(work.pages, ui.drawer.page || 1));
        const previewWork = { ...work, ...revision.candidate };
        return modalShell({
          title: "確認修改結果",
          description: "知雀已返回候選版本，修改結果預覽如下。",
          large: true,
          body: `
            <div class="info-list">
              <div class="info-row"><span>目前版本</span><strong>${escapeHTML(work.versionId)}</strong></div>
              <div class="info-row"><span>候選版本</span><strong>${escapeHTML(revision.candidate.versionId)}</strong></div>
              <div class="info-row"><span>修改要求</span><strong>${escapeHTML(revision.request)}</strong></div>
              <div class="info-row"><span>內容摘要</span><strong>${escapeHTML(revision.candidate.summary)}</strong></div>
            </div>
            <div class="lesson-stage" style="min-height:220px;padding:12px;margin-top:16px">${lessonCanvas(previewPage, { work: previewWork })}</div>
            <div class="lesson-stage-controls">
              ${button("上一頁", "revision-page", "outline", 'class="btn btn-outline btn-sm" data-direction="prev"')}
              <span class="page-counter">${previewPage} / ${work.pages}</span>
              ${button("下一頁", "revision-page", "outline", 'class="btn btn-outline btn-sm" data-direction="next"')}
            </div>
            <div class="notice">套用後會成為作品的未儲存修改；返回作品頁按「儲存修改」才完成保存。配套題不會自動更新，已凍結的課堂也不受影響。</div>`,
          footer: `${button("放棄修改", "discard-work-revision", "ghost")}${button("繼續修改", "continue-work-revision", "outline", `data-work-id="${work.id}"`)}${button("套用新版本", "confirm-work-revision", "primary", `data-work-id="${work.id}"`)}`
        });
      }
      const refining = Boolean(revision.candidate);
      return modalShell({
        title: refining ? "繼續修改候選版本" : "修改教學內容",
        description: refining ? "輸入下一輪修改要求，知雀會以目前候選版本繼續生成。" : "輸入修改要求後提交至知雀。返回的新版本需要先預覽和套用，再回到作品頁儲存修改。",
        large: true,
        body: `
          ${refining ? `<div class="info-row" style="margin-bottom:16px"><span>修改基底</span><strong>${escapeHTML(revision.candidate.versionId)}</strong></div>` : ""}
          <div class="field"><label class="field-label" for="edit-work-note">${refining ? "下一輪修改要求" : "修改要求"}</label><textarea id="edit-work-note" class="textarea" placeholder="例如：補充一個生活應用例子，並縮短概念說明。"></textarea><span class="field-hint">請說明需要增加、刪除或調整的內容。</span></div>
          <div class="notice">${refining ? "本輪會繼續修改候選版本；個人作品已儲存版本仍保持不變。" : "提交修改不等於保存新版本。候選結果套用後，仍需在作品頁儲存修改。"}</div>`,
        footer: `${refining ? button("返回修改結果", "return-work-revision", "ghost", `data-work-id="${work.id}"`) : button("取消", "close-layer", "ghost")}${button(refining ? "提交繼續修改" : "提交修改", "submit-work-revision", "primary", `data-work-id="${work.id}"`)}`
      });
    }

    if (ui.modal?.type === "replace-unsaved-draft") {
      const draft = state.generation.draft;
      return modalShell({
        title: "先處理未儲存課件",
        description: "開始新的生成任務會取代目前草稿。",
        body: `<div class="notice"><strong>${escapeHTML(draft?.title || "未儲存課件")}</strong><br />這份草稿尚未加入我的作品。你可以返回編輯並儲存，或明確放棄後繼續。</div>`,
        footer: `${button("返回編輯", "navigate", "ghost", `data-route="/work/${draft?.id || ""}"`)}${button("放棄草稿並繼續", "discard-draft-and-generate", "danger")}`
      });
    }

    if (ui.modal?.type === "guide") {
      return modalShell({
        title: "原型體驗導覽",
        description: "所有資料均在本機模擬，建議按以下路線體驗完整閉環。",
        body: `
          <div class="brief-steps">
            <div class="brief-step"><span class="brief-number">1</span><div><strong>先備課及查看作品</strong><span>從首頁開始備課，完成生成後修改一題配套題。</span></div></div>
            <div class="brief-step"><span class="brief-number">2</span><div><strong>建立課堂並開學生分頁</strong><span>候課室可開啟學生端預覽，兩個分頁會同步本機狀態。</span></div></div>
            <div class="brief-step"><span class="brief-number">3</span><div><strong>操作內容與發布互動</strong><span>教師翻頁、調整焦距、發題、投票或信號燈，學生端會跟隨。</span></div></div>
            <div class="brief-step"><span class="brief-number">4</span><div><strong>結束課堂並繼續備課</strong><span>查看匿名整體報告，選擇回饋帶入新的獨立備課。</span></div></div>
          </div>
          <div class="prototype-note">學生端示範使用同一瀏覽器的另一個分頁。若瀏覽器阻擋新分頁，可在候課室複製本堂動態學生連結。</div>`,
        footer: `${button("關閉", "close-layer", "primary")}`
      });
    }

    if (ui.modal?.type === "original-link") {
      return modalShell({
        title: "開啟原互動作品",
        description: "原作品由現有教學作品生成服務託管，會在新分頁開啟。",
        body: `<div class="notice" style="word-break:break-all">${escapeHTML(ui.modal.url)}</div><a class="btn btn-primary btn-lg btn-full" href="${escapeHTML(ui.modal.url)}" target="_blank" rel="noopener noreferrer">在新分頁開啟原作品</a>`,
        footer: `${button("複製連結", "copy-original-link", "outline")}${button("完成", "close-layer", "ghost")}`
      });
    }

    if (ui.modal?.type === "preview") {
      const previewWork = ui.modal.workId ? workById(ui.modal.workId) : ui.modal.resourceId ? resourceById(ui.modal.resourceId) : classroomWork();
      return modalShell({
        title: ui.modal.title || "預覽教學作品",
        description: "這是全螢幕作品預覽。原型使用模擬互動內容。",
        large: true,
        body: `<div class="lesson-stage" style="min-height:420px;padding:18px">${lessonCanvas(ui.modal.page || 2, { work: previewWork })}</div>`,
        footer: `${button("上一頁", "preview-page", "outline", 'data-direction="prev"')}${button("下一頁", "preview-page", "outline", 'data-direction="next"')}${button("完成預覽", "close-layer", "primary")}`
      });
    }

    if (ui.modal?.type === "confirm-delete-question") {
      return modalShell({
        title: "刪除這道題？",
        description: "刪除後會更新目前編輯稿的配套題列表。",
        body: `<div class="notice" style="border-color:#eccfc8;background:#fff7f5;color:#9b4237">刪除後仍需在作品頁儲存修改；已凍結的歷史課堂不受影響。</div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("確認刪除", "delete-question", "danger", `data-work-id="${ui.modal.workId}" data-question-id="${ui.modal.questionId}"`)}`
      });
    }

    if (ui.modal?.type === "confirm-regenerate-questions") {
      return modalShell({
        title: "重新生成 6 道題？",
        description: "AI 會以目前作品內容重新建立一組配套題。",
        body: `<div class="notice" style="border-color:#eccfc8;background:#fff7f5;color:#9b4237">目前的 ${workById(ui.modal.workId).questions.length} 道題會在編輯稿中被新的 6 道題取代，完成後仍需儲存修改。已凍結的課堂不受影響。</div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("取代並生成", "regenerate-questions", "danger", `data-work-id="${ui.modal.workId}"`)}`
      });
    }

    if (ui.modal?.type === "qr") {
      return modalShell({
        title: "學生掃碼加入",
        description: `課堂代碼 ${state.classroom.code.slice(0, 3)} ${state.classroom.code.slice(3)}`,
        body: `${qrMarkup()}<div class="class-code" style="text-align:center">${state.classroom.code.slice(0, 3)} ${state.classroom.code.slice(3)}</div>`,
        footer: `${button("複製課堂連結", "copy-class-link", "outline")}${button("開啟學生端", "open-student-tab", "primary")}`
      });
    }

    if (ui.modal?.type === "student-link") {
      return modalShell({
        title: "學生端預覽",
        description: ui.modal.blocked ? "瀏覽器阻擋了新分頁，你仍可複製連結，或在目前分頁查看。" : "選擇在新分頁模擬學生平板，或暫時在目前分頁查看學生端。",
        body: `<div class="notice">課堂代碼：${state.classroom.code.slice(0, 3)} ${state.classroom.code.slice(3)}。使用另一個分頁時，教師與學生操作會在本機即時同步。</div>`,
        footer: `${button("複製學生連結", "copy-class-link", "outline")}${button("在新分頁開啟", "launch-student-tab", "secondary")}${button("在此分頁查看", "navigate", "primary", `data-route="/join/${state.classroom.code}"`)}`
      });
    }

    if (ui.modal?.type === "cancel-class") {
      return modalShell({
        title: "取消候課中的課堂？",
        description: "取消後二維碼會失效，已加入學生會看到課堂已取消。",
        body: `<div class="notice">此原型會返回來源作品，不會建立課堂報告。</div>`,
        footer: `${button("返回候課室", "close-layer", "ghost")}${button("確認取消", "cancel-class", "danger")}`
      });
    }

    if (ui.modal?.type === "class-in-progress") {
      return modalShell({
        title: "已有課堂正在進行",
        description: "同一教師帳號同一時間只可進行一堂課，避免學生端和報告資料互相覆蓋。",
        body: `<div class="notice">請先返回目前課堂並正常結束，再建立另一堂課。</div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("返回目前課堂", "navigate", "primary", 'data-route="/classroom"')}`
      });
    }

    if (ui.modal?.type === "replace-waiting-class") {
      return modalShell({
        title: "取代候課中的課堂？",
        description: "目前已有一堂課正在候課。建立新課堂後，原課堂碼會立即失效。",
        body: `<div class="notice">已加入原候課室的學生需要使用新課堂碼重新加入。</div>`,
        footer: `${button("保留原課堂", "navigate", "ghost", 'data-route="/lobby"')}${button("取代並建立", "confirm-replace-class", "danger", `data-work-id="${ui.modal.workId}"`)}`
      });
    }

    if (ui.modal?.type === "question-picker") {
      const availableQuestions = classroomQuestions();
      const usedIds = publishedQuestionIds();
      const selectableQuestions = availableQuestions.filter(question => !usedIds.has(question.id));
      ui.selectedQuestionIds = ui.selectedQuestionIds.filter(id => selectableQuestions.some(question => question.id === id));
      const selectedCount = ui.selectedQuestionIds.length;
      const allSelected = selectableQuestions.length > 0 && selectedCount === selectableQuestions.length;
      return modalShell({
        title: "選擇本次發布題目",
        description: "可單選、多選或全選。學生收到後按自己的速度作答。已發布題目不能在同一堂課重複發布。",
        large: true,
        body: selectableQuestions.length ? `
          <div class="question-picker-toolbar">
            <label class="question-select-all"><input type="checkbox" data-question-select-all ${allSelected ? "checked" : ""} /><span>全選未發布題目</span></label>
            <span class="caption">本課共 ${availableQuestions.length} 道，尚可發布 ${selectableQuestions.length} 道</span>
          </div>
          <div class="question-list question-picker-list" style="padding:0">${availableQuestions.map((question, index) => {
            const used = usedIds.has(question.id);
            const selected = ui.selectedQuestionIds.includes(question.id);
            return `
              <article class="question-item question-select-item ${selected ? "is-selected" : ""} ${used ? "is-used" : ""}">
                <label class="question-check" aria-label="選擇第 ${index + 1} 題"><input type="checkbox" data-question-pick="${question.id}" ${selected ? "checked" : ""} ${used ? "disabled" : ""} /></label>
                <span class="question-number">Q${index + 1}</span>
                <div><h3>${escapeHTML(question.text)}</h3><p>${question.type} · ${used ? "本堂已發布" : "學生可自主切換作答"}</p></div>
                <div class="question-actions">${used ? '<span class="badge badge-neutral">已發布</span>' : button("預覽", "preview-question", "ghost", `class="btn btn-ghost btn-sm" data-question-id="${question.id}"`)}</div>
              </article>`;
          }).join("")}</div>` : `<div class="empty-state" style="min-height:260px"><div><h3>本堂題目已全部發布</h3><p>同一道題不能在同一堂課重複發布。你仍可使用投票或信號燈繼續互動。</p></div></div>`,
        footer: `<div class="modal-foot-summary"><strong>已選 ${selectedCount} 道</strong><span>最多可發布 ${MAX_QUESTION_COUNT} 道</span></div>${button("取消", "close-layer", "ghost")}${button(`發佈 ${selectedCount} 道題`, "publish-selected-questions", "primary", `${selectedCount ? "" : "disabled"}`)}`
      });
    }

    if (ui.modal?.type === "question-preview") {
      const availableQuestions = classroomQuestions();
      const question = availableQuestions.find(item => item.id === ui.modal.questionId) || availableQuestions[0];
      const used = publishedQuestionIds().has(question.id);
      return modalShell({
        title: "題目預覽",
        description: question.type,
        body: `<h2 style="color:#082f36;font-size:22px;line-height:1.45">${escapeHTML(question.text)}</h2><div class="answer-options">${question.options.map((option, index) => `<div class="answer-option"><span class="option-letter">${String.fromCharCode(65 + index)}</span><span>${escapeHTML(option)}</span></div>`).join("")}</div><div class="notice">正確答案：${question.answer.map(index => String.fromCharCode(65 + index)).join("、")}。發布前不需要另行確認。</div>`,
        footer: `${button("返回題目列表", "open-question-picker", "ghost")}${used ? "" : button(ui.selectedQuestionIds.includes(question.id) ? "已選取" : "選取這道題", "select-preview-question", "primary", `data-question-id="${question.id}" ${ui.selectedQuestionIds.includes(question.id) ? "disabled" : ""}`)}`
      });
    }

    if (ui.modal?.type === "poll") {
      return modalShell({
        title: "建立即時投票",
        description: "輸入 2 至 4 個選項。投票固定為單選，結束前可修改。",
        body: `
          <div class="field"><label class="field-label" for="poll-title">投票問題</label><input id="poll-title" class="input" value="下一步你想先看老師示範，還是先和同學討論？" /></div>
          <div class="field"><span class="field-label">選項</span><div style="display:grid;gap:9px">${ui.pollOptions.map((option, index) => `<div style="display:flex;gap:8px"><input class="input" data-poll-option="${index}" value="${escapeHTML(option)}" placeholder="選項 ${index + 1}" />${ui.pollOptions.length > 2 ? button("移除", "remove-poll-option", "ghost", `class="btn btn-ghost btn-sm" data-index="${index}"`) : ""}</div>`).join("")}</div>${ui.pollOptions.length < 4 ? `<div style="margin-top:9px">${button("新增選項", "add-poll-option", "outline", 'class="btn btn-outline btn-sm"')}</div>` : ""}</div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("發佈投票", "publish-poll", "primary")}`
      });
    }

    if (ui.modal?.type === "signal") {
      return modalShell({
        title: "發起信號燈",
        description: "學生選擇一個理解狀態，結果不會計算正確率。",
        body: `<h3 style="color:#082f36">對目前的「${escapeHTML(classroomWork().title)}」內容，你掌握得怎樣？</h3><div class="signal-options"><div class="signal-btn signal-green"><span class="signal-light"></span><span>明白</span></div><div class="signal-btn signal-yellow"><span class="signal-light"></span><span>不確定</span></div><div class="signal-btn signal-red"><span class="signal-light"></span><span>需要協助</span></div></div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("開始收集", "publish-signal", "primary")}`
      });
    }

    if (ui.modal?.type === "end-class") {
      const collecting = state.classroom.active?.stage === "collecting";
      return modalShell({
        title: "結束這堂課？",
        description: "結束後無法恢復本次 Session，學生端會立即進入課堂結束狀態。",
        body: collecting ? `<div class="notice">目前仍有${activeInteractionLabel(state.classroom.active)}正在收集。你可以結束收集並保留截止前資料，或返回課堂。</div>` : `<div class="info-list"><div class="info-row"><span>匿名參與</span><strong>${state.classroom.participants} 人</strong></div><div class="info-row"><span>互動輪次</span><strong>${state.classroom.rounds.length} 輪</strong></div><div class="info-row"><span>結束後</span><strong>自動生成整體報告</strong></div></div>`,
        footer: `${button("返回課堂", "close-layer", "ghost")}${button(collecting ? "結束收集並結束課堂" : "確認結束課堂", "end-class", "danger")}`
      });
    }

    if (ui.drawer?.type === "report-feedback") {
      const report = state.report;
      const questionRounds = (report.rounds || []).filter(round => round.type === "question");
      const lowestQuestion = [...questionRounds].sort((a, b) => a.accuracy - b.accuracy)[0];
      const signalRound = (report.rounds || []).find(round => round.type === "signal");
      const items = [
        ...(lowestQuestion ? [{ id: "question", title: "鞏固正式題相關概念", detail: `「${lowestQuestion.title}」整體正確率 ${lowestQuestion.accuracy}%` }] : []),
        ...(signalRound ? [{ id: "signal", title: "回應理解差異", detail: `信號燈收到 ${signalRound.responses || 0} 份匿名回應` }] : []),
        ...((report.rounds || []).length ? [{ id: "pace", title: "延續目前互動節奏", detail: Number.isFinite(report.responseRate) ? `各輪互動平均回應率 ${report.responseRate}%` : "沿用本堂互動安排" }] : []),
        { id: "source", title: "延續本堂教學內容", detail: `以「${report.title}」作為下一次備課背景` }
      ];
      return drawerShell({
        title: "選擇要帶入的課堂回饋",
        description: "只會帶入整體匯總，不會建立班級或識別下一堂是否為同一批學生。",
        body: `
          <div class="notice" style="margin-bottom:17px">作品標題、學科、教學語言和內容摘要會作為來源背景。以下回饋由你主動選擇。</div>
          <div class="answer-options">
            ${items.map(item => `<label class="answer-option ${ui.reportFeedback.includes(item.id) ? "is-selected" : ""}" style="cursor:pointer"><input type="checkbox" data-feedback-id="${item.id}" ${ui.reportFeedback.includes(item.id) ? "checked" : ""} /><span><strong style="display:block;margin-bottom:4px">${item.title}</strong><span class="caption">${item.detail}</span></span></label>`).join("")}
          </div>
          <div class="prototype-note">下一次備課會建立新的獨立個人作品，不會覆蓋本次作品或報告。</div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("進入下一次備課", "continue-from-report", "primary")}`
      });
    }

    if (ui.modal?.type === "simple-report") {
      return modalShell({
        title: ui.modal.title,
        description: ui.modal.description,
        body: `<div class="report-summary" style="grid-template-columns:repeat(2,1fr)"><div class="summary-card" style="background:#f2f7f5"><strong>${ui.modal.empty ? "0" : "27"}</strong><span>匿名參與</span></div><div class="summary-card" style="background:#f2f7f5"><strong>${ui.modal.empty ? "無" : "81%"}</strong><span>${ui.modal.empty ? "互動資料" : "正式題正確率"}</span></div></div><div class="notice">${ui.modal.empty ? "本堂沒有匿名參與或互動資料，因此只保留日期、來源作品和課堂時長，不生成掌握情況。" : "這是歷史課堂的模擬整體摘要，不包含臨時編號或個人軌跡。"}</div>`,
        footer: button("關閉", "close-layer", "primary")
      });
    }

    if (ui.modal?.type === "reset-demo") {
      return modalShell({
        title: "重設所有示範資料？",
        description: "這會把作品、收藏、課堂與報告狀態恢復到首次開啟原型時。",
        body: `<div class="notice" style="border-color:#eccfc8;background:#fff7f5;color:#9b4237">只會刪除瀏覽器中的 Teeko 原型模擬資料，不會影響其他網站或本機檔案。</div>`,
        footer: `${button("取消", "close-layer", "ghost")}${button("確認重設", "reset-demo", "danger")}`
      });
    }

    return "";
  }

  function resetStudentResponse() {
    state.student.selection = [];
    state.student.submitted = false;
    state.student.answers = {};
    state.student.questionIndex = 0;
    state.student.completed = false;
    state.student.reviewing = false;
    state.student.resultDismissed = false;
    ui.studentLocalSelection = null;
  }

  function openStudentTab() {
    const url = `${location.href.split("#")[0]}#/join/${state.classroom.code}`;
    const opened = window.open(url, "_blank");
    if (!opened) {
      ui.modal = { type: "student-link", blocked: true };
      render();
      showToast("瀏覽器阻擋了新分頁，請允許彈出視窗後再試。 ");
      return;
    }
    opened.opener = null;
    ui.modal = null;
    render();
    showToast("學生端已在新分頁開啟。 ");
  }

  async function copyClassLink() {
    const url = `${location.href.split("#")[0]}#/join/${state.classroom.code}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      const textarea = document.createElement("textarea");
      textarea.value = url;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.append(textarea);
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    showToast("課堂連結已複製。 ");
  }

  function collectPollOptions() {
    const fields = [...document.querySelectorAll("[data-poll-option]")];
    if (fields.length) ui.pollOptions = fields.map(field => field.value.trim()).filter(Boolean);
  }

  function initializeClassroom(workId) {
    const work = workById(workId);
    if (!isSavedWork(work)) {
      showToast("請先儲存課件，再建立課堂。 ");
      return;
    }
    if (work.pendingSave) {
      showToast("請先儲存作品修改，再建立課堂。 ");
      return;
    }
    if (ui.questionGeneration?.workId === work.id) {
      showToast("請等待配套題生成完成並儲存修改，再建立課堂。 ");
      return;
    }
    state.classroom = {
      ...state.classroom,
      id: `c-${Date.now()}`,
      code: String(Math.floor(100000 + Math.random() * 900000)),
      status: "waiting",
      workId,
      participants: 23,
      online: 21,
      page: 1,
      total: work.pages,
      snapshot: snapshotForWork(work),
      playing: false,
      focus: 46,
      active: null,
      rounds: [],
      createdAt: new Date().toISOString(),
      startedAt: null,
      endedAt: null
    };
    state.student = { ...state.student, joined: false, anonymousId: "", selection: [], submitted: false, answers: {}, questionIndex: 0, completed: false, reviewing: false, connected: true, resultDismissed: false };
    ui.studentLocalSelection = null;
    ui.selectedQuestionIds = [];
    persist();
    navigate("/lobby");
  }

  async function handleAction(element) {
    const action = element.dataset.action;
    if (!action) return;

    if (action === "navigate") {
      ui.modal = null;
      ui.drawer = null;
      navigate(element.dataset.route);
      return;
    }

    if (action === "fill-demo-account") {
      ui.loginEmail = element.dataset.email || "teacher@teeko.hk";
      ui.loginError = "";
      render();
      document.querySelector("#login-email")?.focus();
      return;
    }

    if (action === "login") {
      const email = document.querySelector("#login-email")?.value.trim() || ui.loginEmail.trim();
      if (!email || !email.includes("@")) {
        ui.loginError = "請輸入有效的電郵地址。";
        render();
        return;
      }
      ui.loginEmail = email;
      state.teacher.email = email;
      state.authenticated = true;
      state.activated = email.toLowerCase() === "teacher@teeko.hk";
      persist();
      navigate(state.activated ? "/home" : "/activate");
      showToast(state.activated ? "歡迎回來，陳老師。" : "這個帳號尚未啟用。 ");
      return;
    }

    if (action === "login-unactivated") {
      ui.loginEmail = "new@teeko.hk";
      state.teacher.email = "new@teeko.hk";
      state.authenticated = true;
      state.activated = false;
      persist();
      navigate("/activate");
      showToast("已登入未啟用示範帳號。 ");
      return;
    }

    if (action === "go-activate") {
      if (!state.authenticated) {
        ui.loginError = "請先登入教師帳號，再輸入學校啟用碼。";
        navigate("/signin");
        return;
      }
      ui.activationStatus = "idle";
      ui.activationError = "";
      navigate("/activate");
      return;
    }

    if (action === "activate") {
      const code = document.querySelector("#activation-code")?.value.trim().toUpperCase() || ui.activationCode.trim().toUpperCase();
      ui.activationCode = code;
      ui.activationStatus = "checking";
      ui.activationError = "";
      render();
      window.setTimeout(() => {
        if (code === "TEEKO-HK-2026") {
          ui.activationStatus = "success";
          state.activated = true;
          persist();
        } else {
          ui.activationStatus = "idle";
          ui.activationError = code === "EXPIRED" ? "這個啟用碼已過期，請向發碼學校查詢。" : "找不到這個啟用碼，請檢查字母及數字。";
        }
        render();
      }, 520);
      return;
    }

    if (action === "activation-finish") {
      navigate("/home");
      showToast("使用權益已啟用。 ");
      return;
    }

    if (action === "logout") {
      state.authenticated = false;
      persist();
      ui.loginEmail = state.teacher.email;
      navigate("/signin");
      showToast("已安全登出 Teeko。 ");
      return;
    }

    if (action === "set-language") {
      state.prep.language = element.dataset.language;
      delete ui.prepErrors.language;
      persist({ broadcast: false });
      render();
      return;
    }

    if (action === "simulate-upload") {
      state.prep.file = { name: "凸透鏡教學設計.pdf", size: "1.8 MB" };
      delete ui.prepErrors.input;
      persist({ broadcast: false });
      render();
      showToast("示範教案已解析完成。 ");
      return;
    }

    if (action === "remove-file") {
      state.prep.file = null;
      persist({ broadcast: false });
      render();
      return;
    }

    if (action === "remove-report-context") {
      state.prep.reportContext = null;
      persist({ broadcast: false });
      render();
      showToast("已移除上一堂課的回饋。 ");
      return;
    }

    if (action === "clear-prep") {
      state.prep.subject = "";
      state.prep.language = "";
      state.prep.requirements = "";
      state.prep.file = null;
      state.prep.reportContext = null;
      ui.prepErrors = {};
      persist({ broadcast: false });
      render();
      return;
    }

    if (action === "submit-prep") {
      const errors = {};
      if (!state.prep.requirements.trim() && !state.prep.file && !state.prep.reportContext) errors.input = "請輸入教學要求或上傳教案。";
      ui.prepErrors = errors;
      if (Object.keys(errors).length) {
        render();
        showToast("請輸入教學想法或上傳教案。 ");
        return;
      }
      const generationTask = {
        mode: state.prep.reportContext ? "report" : "new",
        workId: `w-${Date.now()}`,
        resourceId: null
      };
      if (state.generation.draft) {
        ui.modal = { type: "replace-unsaved-draft", generationTask };
        render();
        return;
      }
      beginGeneration(generationTask);
      return;
    }

    if (action === "discard-draft-and-generate") {
      const generationTask = ui.modal?.generationTask;
      if (!generationTask) return;
      ui.modal = null;
      beginGeneration(generationTask);
      return;
    }

    if (action === "retry-generation") {
      state.generation.status = "running";
      state.generation.progress = state.generation.mode === "resource" ? 6 : 5;
      state.generation.stage = 0;
      persist();
      render();
      return;
    }

    if (action === "view-generated-work") {
      ui.workTab = "content";
      ui.workPage = 1;
      navigate(`/work/${state.generation.workId}`);
      return;
    }

    if (action === "filter-works") {
      ui.workFilter = element.dataset.filter || "all";
      render();
      return;
    }

    if (action === "work-tab") {
      ui.workTab = element.dataset.tab;
      render();
      return;
    }

    if (action === "work-page") {
      const currentWork = workById(routeInfo().path.split("/")[2]);
      if (!currentWork) return;
      ui.workPage = Math.max(1, Math.min(currentWork.pages, ui.workPage + (element.dataset.direction === "next" ? 1 : -1)));
      render();
      return;
    }

    if (action === "open-work-preview") {
      const work = workById(element.dataset.workId);
      ui.modal = { type: "preview", title: work.title, page: 1, workId: work.id, total: work.pages };
      render();
      return;
    }

    if (action === "open-resource-preview") {
      const resource = resourceById(element.dataset.resourceId);
      ui.modal = { type: "preview", title: resource.title, page: 1, resourceId: resource.id, total: 5 };
      render();
      return;
    }

    if (action === "preview-page") {
      ui.modal.page = Math.max(1, Math.min(ui.modal.total || 6, (ui.modal.page || 1) + (element.dataset.direction === "next" ? 1 : -1)));
      render();
      return;
    }

    if (action === "open-content-editor") {
      const workId = element.dataset.workId;
      if (ui.contentRevision?.workId !== workId && (ui.contentRevision?.status === "running" || ui.contentRevision?.candidate)) {
        showToast("請先處理另一份作品尚未完成的修改。 ");
        return;
      }
      if (!ui.contentRevision || ui.contentRevision.workId !== workId) ui.contentRevision = { workId, status: "editing" };
      ui.drawer = { type: "content-editor", workId };
      render();
      return;
    }

    if (action === "open-original-work") {
      const work = workById(element.dataset.workId);
      ui.modal = { type: "original-link", url: work.hostedUrl || "https://a.zhique.cn/home" };
      render();
      return;
    }

    if (action === "copy-original-link") {
      const url = ui.modal?.url || "https://a.zhique.cn/home";
      try {
        await navigator.clipboard.writeText(url);
        showToast("原作品連結已複製。 ");
      } catch (error) {
        showToast("瀏覽器未允許複製，請長按連結。 ");
      }
      return;
    }

    if (action === "save-generated-work") {
      const workId = element.dataset.workId;
      if (ui.questionGeneration?.workId === workId) {
        showToast("請等待配套題生成完成後再儲存。 ");
        return;
      }
      if (!saveGeneratedDraft(workId)) {
        showToast("未能找到要儲存的課件草稿。 ");
        return;
      }
      persist();
      render();
      showToast("課件與配套題已儲存到我的作品。 ");
      return;
    }

    if (action === "save-work-changes") {
      const work = workById(element.dataset.workId);
      if (!isSavedWork(work) || !work.pendingSave) return;
      if (ui.questionGeneration?.workId === work.id) {
        showToast("請等待配套題生成完成後再儲存。 ");
        return;
      }
      delete work.pendingSave;
      work.updatedAt = "剛剛";
      persist();
      render();
      showToast("課件修改已儲存。 ");
      return;
    }

    if (action === "submit-work-revision") {
      const workId = element.dataset.workId;
      const work = workById(workId);
      const request = document.querySelector("#edit-work-note")?.value.trim();
      if (!work || !request) {
        showToast("請先輸入修改要求。 ");
        return;
      }
      const baseCandidate = ui.contentRevision?.workId === workId ? ui.contentRevision.candidate : null;
      ui.contentRevision = { workId, status: "running", request, ...(baseCandidate ? { candidate: baseCandidate } : {}) };
      render();
      showToast(baseCandidate ? "繼續修改要求已提交至知雀。 " : "修改要求已提交至知雀。 ");
      window.clearTimeout(ui.contentRevisionTimer);
      ui.contentRevisionTimer = window.setTimeout(() => {
        const currentWork = workById(workId);
        const activeRevision = ui.contentRevision;
        if (!currentWork || activeRevision?.workId !== workId || activeRevision.status !== "running") return;
        const baseWork = activeRevision.candidate || currentWork;
        const versionId = `ver-${workId}-${String(Date.now()).slice(-6)}`;
        const separator = baseWork.hostedUrl.includes("?") ? "&" : "?";
        ui.contentRevision = {
          workId,
          status: "ready",
          request: activeRevision.request,
          candidate: {
            versionId,
            hostedUrl: `${baseWork.hostedUrl}${separator}version=${encodeURIComponent(versionId)}`,
            summary: `${baseWork.summary} 本版本已按教師要求調整：${activeRevision.request}`
          }
        };
        ui.contentRevisionTimer = null;
        render();
        showToast("知雀已返回修改版本，可繼續修改或套用新版本。 ");
      }, 900);
      return;
    }

    if (action === "continue-work-revision") {
      const revision = ui.contentRevision;
      if (!revision?.candidate || revision.status !== "ready") return;
      ui.contentRevision = { ...revision, status: "editing" };
      render();
      return;
    }

    if (action === "return-work-revision") {
      const revision = ui.contentRevision;
      if (!revision?.candidate) return;
      ui.contentRevision = { ...revision, status: "ready" };
      render();
      return;
    }

    if (action === "revision-page") {
      const work = workById(ui.drawer?.workId);
      if (!work || ui.contentRevision?.status !== "ready") return;
      ui.drawer.page = Math.max(1, Math.min(work.pages, (ui.drawer.page || 1) + (element.dataset.direction === "next" ? 1 : -1)));
      render();
      return;
    }

    if (action === "discard-work-revision") {
      ui.contentRevision = null;
      ui.drawer = null;
      render();
      showToast("已放棄修改，原版本沒有改變。 ");
      return;
    }

    if (action === "confirm-work-revision") {
      const work = workById(element.dataset.workId);
      const revision = ui.contentRevision;
      if (!work || !revision || revision.workId !== work.id || revision.status !== "ready") return;
      work.versionId = revision.candidate.versionId;
      work.hostedUrl = revision.candidate.hostedUrl;
      work.summary = revision.candidate.summary;
      const saved = isSavedWork(work);
      markWorkChanged(work);
      ui.contentRevision = null;
      ui.modal = null;
      ui.drawer = null;
      persist();
      render();
      showToast(saved ? "新版本已套用，請儲存修改。 " : "已套用修改版本，作品仍是未儲存草稿。 ");
      return;
    }

    if (action === "open-question-editor") {
      const work = workById(element.dataset.workId);
      const questionId = element.dataset.questionId || null;
      if (ui.questionGeneration?.workId === work.id) {
        showToast("題目生成期間暫不可編輯。 ");
        return;
      }
      if (!questionId && work.questions.length >= MAX_QUESTION_COUNT) {
        showToast("每份作品最多可保存 25 道題。 ");
        return;
      }
      ui.drawer = { type: "question-editor", workId: element.dataset.workId, questionId };
      render();
      return;
    }

    if (action === "save-question") {
      const work = workById(element.dataset.workId);
      const questionId = element.dataset.questionId;
      const type = document.querySelector("#question-type")?.value || "單選題";
      const text = document.querySelector("#question-text")?.value.trim();
      let options = [...document.querySelectorAll("[data-question-option]")].map(input => input.value.trim()).filter(Boolean);
      if (type === "判斷題") options = options.slice(0, 2);
      const answer = [...document.querySelectorAll("[data-correct-answer]:checked")].map(input => Number(input.value)).filter(index => index < options.length);
      const explanation = document.querySelector("#question-explanation")?.value.trim();
      if (!text || options.length < 2) {
        showToast("請填寫題目及至少兩個選項。 ");
        return;
      }
      if (!answer.length) {
        showToast("請至少選擇一個正確答案。 ");
        return;
      }
      const normalizedAnswer = type === "多選題" ? answer : [answer[0]];
      if (questionId) {
        const question = work.questions.find(item => item.id === questionId);
        Object.assign(question, { type, text, options, answer: normalizedAnswer, explanation });
      } else {
        if (work.questions.length >= MAX_QUESTION_COUNT) {
          showToast("每份作品最多可保存 25 道題。 ");
          return;
        }
        work.questions.push({ id: `q-${Date.now()}`, type, text, options, answer: normalizedAnswer, explanation });
      }
      markWorkChanged(work);
      ui.drawer = null;
      persist();
      render();
      showToast(isSavedWork(work) ? "配套題修改已套用，請儲存修改。 " : "配套題修改已保留在草稿，尚未加入我的作品。 ");
      return;
    }

    if (action === "ask-delete-question") {
      if (ui.questionGeneration?.workId === element.dataset.workId) return;
      ui.modal = { type: "confirm-delete-question", workId: element.dataset.workId, questionId: element.dataset.questionId };
      render();
      return;
    }

    if (action === "delete-question") {
      const work = workById(element.dataset.workId);
      work.questions = work.questions.filter(question => question.id !== element.dataset.questionId);
      markWorkChanged(work);
      ui.modal = null;
      persist();
      render();
      showToast(isSavedWork(work) ? "題目已刪除，請儲存修改。 " : "題目已從草稿刪除。 ");
      return;
    }

    if (action === "ask-regenerate-questions") {
      if (ui.questionGeneration) return;
      ui.modal = { type: "confirm-regenerate-questions", workId: element.dataset.workId };
      render();
      return;
    }

    if (action === "regenerate-questions") {
      const work = workById(element.dataset.workId);
      if (ui.questionGeneration) return;
      ui.questionGeneration = { workId: work.id, mode: "replace" };
      ui.modal = null;
      render();
      showToast("正在重新生成 6 道配套題... ");
      window.setTimeout(() => {
        work.questions = questionBatchFor(work);
        markWorkChanged(work);
        ui.questionGeneration = null;
        persist();
        render();
        showToast(isSavedWork(work) ? "已套用新的 6 道題，請儲存修改。 " : "已用新的 6 道題取代草稿配套題。 ");
      }, 780);
      return;
    }

    if (action === "append-questions") {
      const work = workById(element.dataset.workId);
      if (ui.questionGeneration) return;
      if (work.questions.length + DEFAULT_QUESTION_COUNT > MAX_QUESTION_COUNT) {
        showToast("剩餘題目容量不足 6 道，請先刪除部分題目。 ");
        return;
      }
      ui.questionGeneration = { workId: work.id, mode: "append" };
      render();
      showToast("正在追加生成 6 道配套題... ");
      window.setTimeout(() => {
        if (work.questions.length + DEFAULT_QUESTION_COUNT > MAX_QUESTION_COUNT) {
          ui.questionGeneration = null;
          render();
          showToast("題目數量已變更，追加後會超過 25 道上限。 ");
          return;
        }
        work.questions.push(...questionBatchFor(work));
        markWorkChanged(work);
        ui.questionGeneration = null;
        persist();
        render();
        showToast(isSavedWork(work) ? `已追加 6 道題，目前共 ${work.questions.length} 道；請儲存修改。 ` : `已追加 6 道題，目前草稿共 ${work.questions.length} 道。 `);
      }, 780);
      return;
    }

    if (action === "resource-tab") {
      ui.resourceTab = element.dataset.tab;
      ui.resourceSearch = "";
      render();
      return;
    }

    if (action === "toggle-favorite") {
      const id = element.dataset.resourceId;
      if (state.favorites.includes(id)) {
        state.favorites = state.favorites.filter(item => item !== id);
        showToast("已取消收藏。 ");
      } else {
        state.favorites.push(id);
        showToast("已加入我的收藏。 ");
      }
      persist();
      render();
      return;
    }

    if (action === "search-resources") {
      ui.resourceSearch = document.querySelector("#resource-search")?.value.trim() || "";
      render();
      return;
    }

    if (action === "clear-resource-search") {
      ui.resourceSearch = "";
      render();
      return;
    }

    if (action === "show-all-resources") {
      ui.resourceTab = "all";
      ui.resourceSearch = "";
      render();
      return;
    }

    if (action === "use-resource") {
      const resourceId = element.dataset.resourceId;
      const generationTask = {
        mode: "resource",
        workId: `w-resource-${Date.now()}`,
        resourceId,
        message: "正在建立可修改的課件草稿。 "
      };
      if (state.generation.draft) {
        ui.modal = { type: "replace-unsaved-draft", generationTask };
        render();
        return;
      }
      beginGeneration(generationTask);
      return;
    }

    if (action === "create-class") {
      const workId = element.dataset.workId || "w1";
      const work = workById(workId);
      if (!isSavedWork(work)) {
        showToast("請先儲存課件，再建立課堂。 ");
        return;
      }
      if (work.pendingSave) {
        showToast("請先儲存作品修改，再建立課堂。 ");
        return;
      }
      if (state.classroom.status === "live") {
        ui.modal = { type: "class-in-progress" };
        render();
        return;
      }
      if (state.classroom.status === "waiting" && state.classroom.createdAt) {
        ui.modal = { type: "replace-waiting-class", workId };
        render();
        return;
      }
      initializeClassroom(workId);
      return;
    }

    if (action === "confirm-replace-class") {
      const workId = element.dataset.workId || ui.modal?.workId || "w1";
      ui.modal = null;
      initializeClassroom(workId);
      return;
    }

    if (action === "copy-class-link") {
      await copyClassLink();
      return;
    }

    if (action === "show-qr") {
      ui.modal = { type: "qr" };
      render();
      return;
    }

    if (action === "open-student-tab") {
      ui.modal = { type: "student-link", blocked: false };
      render();
      return;
    }

    if (action === "launch-student-tab") {
      openStudentTab();
      return;
    }

    if (action === "ask-cancel-class") {
      ui.modal = { type: "cancel-class" };
      render();
      return;
    }

    if (action === "cancel-class") {
      const workId = state.classroom.workId;
      state.classroom.status = "cancelled";
      ui.modal = null;
      persist();
      navigate(`/work/${workId}`);
      showToast("候課課堂已取消。 ");
      return;
    }

    if (action === "start-class") {
      state.classroom.status = "live";
      state.classroom.startedAt = new Date().toISOString();
      state.classroom.page = 1;
      persist();
      navigate("/classroom");
      showToast("課堂已開始，學生端正在同步。 ");
      return;
    }

    if (action === "lesson-prev" || action === "lesson-next") {
      const delta = action === "lesson-next" ? 1 : -1;
      state.classroom.page = Math.max(1, Math.min(state.classroom.total, state.classroom.page + delta));
      persist();
      render();
      return;
    }

    if (action === "toggle-play") {
      state.classroom.playing = !state.classroom.playing;
      persist();
      render();
      showToast(state.classroom.playing ? "學生端已同步播放狀態。" : "內容已暫停。 ");
      return;
    }

    if (action === "change-focus") {
      state.classroom.focus = Math.max(20, Math.min(80, state.classroom.focus + Number(element.dataset.change || 0)));
      persist();
      render();
      return;
    }

    if (action === "demo-work-effect") {
      state.classroom.focus = state.classroom.focus >= 78 ? 30 : state.classroom.focus + 12;
      persist();
      render();
      showToast("作品操作效果已同步到學生端。 ");
      return;
    }

    if (action === "reset-work-effect") {
      state.classroom.focus = 46;
      persist();
      render();
      showToast("互動作品已重設，學生端同步更新。 ");
      return;
    }

    if (action === "toggle-fullscreen") {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch (error) {
        showToast("瀏覽器未允許全螢幕，課堂仍可正常操作。 ");
      }
      return;
    }

    if (action === "open-question-picker") {
      if (ui.modal?.type !== "question-preview") ui.selectedQuestionIds = [];
      ui.modal = { type: "question-picker" };
      render();
      return;
    }

    if (action === "preview-question") {
      ui.modal = { type: "question-preview", questionId: element.dataset.questionId };
      render();
      return;
    }

    if (action === "select-preview-question") {
      const questionId = element.dataset.questionId;
      if (!publishedQuestionIds().has(questionId) && !ui.selectedQuestionIds.includes(questionId)) {
        ui.selectedQuestionIds.push(questionId);
      }
      ui.modal = { type: "question-picker" };
      render();
      return;
    }

    if (action === "publish-selected-questions" || action === "publish-question") {
      const availableQuestions = classroomQuestions();
      const usedIds = publishedQuestionIds();
      const requestedIds = action === "publish-question" ? [element.dataset.questionId] : ui.selectedQuestionIds;
      const questionIds = requestedIds
        .filter((id, index, ids) => id && ids.indexOf(id) === index)
        .filter(id => availableQuestions.some(question => question.id === id) && !usedIds.has(id))
        .slice(0, MAX_QUESTION_COUNT);
      if (!questionIds.length) {
        showToast("請至少選擇一道本堂未發布的題目。 ");
        return;
      }
      const accuracySamples = [85, 58, 83, 74, 89, 67];
      const questionStats = Object.fromEntries(questionIds.map((id, index) => [id, {
        responses: Math.max(0, state.classroom.participants - (4 + index % 5)),
        accuracy: accuracySamples[index % accuracySamples.length]
      }]));
      const completed = Math.max(0, state.classroom.participants - 7);
      state.classroom.playing = false;
      state.classroom.active = { id: `round-${Date.now()}`, type: "question", questionIds, title: `${questionIds.length} 道正式題`, stage: "collecting", completed, responses: completed, questionStats };
      resetStudentResponse();
      ui.selectedQuestionIds = [];
      ui.modal = null;
      persist();
      render();
      showToast(`已一次發布 ${questionIds.length} 道題，學生可按自己的速度作答。 `);
      return;
    }

    if (action === "open-poll") {
      ui.pollOptions = ["先看老師示範", "先與同學討論"];
      ui.modal = { type: "poll" };
      render();
      return;
    }

    if (action === "add-poll-option") {
      collectPollOptions();
      if (ui.pollOptions.length < 4) ui.pollOptions.push(`選項 ${String.fromCharCode(65 + ui.pollOptions.length)}`);
      render();
      return;
    }

    if (action === "remove-poll-option") {
      collectPollOptions();
      ui.pollOptions.splice(Number(element.dataset.index), 1);
      render();
      return;
    }

    if (action === "publish-poll") {
      const title = document.querySelector("#poll-title")?.value.trim();
      collectPollOptions();
      if (!title || ui.pollOptions.length < 2) {
        showToast("請填寫投票問題及至少兩個選項。 ");
        return;
      }
      state.classroom.playing = false;
      state.classroom.active = { id: `round-${Date.now()}`, type: "poll", title, options: clone(ui.pollOptions), stage: "collecting", responses: Math.max(0, state.classroom.participants - 8) };
      resetStudentResponse();
      ui.modal = null;
      persist();
      render();
      showToast("投票已發布到學生端。 ");
      return;
    }

    if (action === "open-signal") {
      ui.modal = { type: "signal" };
      render();
      return;
    }

    if (action === "publish-signal") {
      state.classroom.playing = false;
      state.classroom.active = { id: `round-${Date.now()}`, type: "signal", title: `對目前的「${classroomWork().title}」內容，你掌握得怎樣？`, stage: "collecting", responses: Math.max(0, state.classroom.participants - 6) };
      resetStudentResponse();
      ui.modal = null;
      persist();
      render();
      showToast("信號燈已發送到學生端。 ");
      return;
    }

    if (action === "close-interaction") {
      if (!state.classroom.active) return;
      state.classroom.active.stage = "closed";
      recordActiveInteraction();
      persist();
      render();
      return;
    }

    if (action === "publish-results") {
      if (!state.classroom.active) return;
      state.classroom.active.stage = "published";
      state.student.resultDismissed = false;
      recordActiveInteraction();
      persist();
      render();
      showToast("整體結果已向學生公布。 ");
      return;
    }

    if (action === "continue-teaching") {
      state.classroom.active = null;
      resetStudentResponse();
      persist();
      render();
      return;
    }

    if (action === "ask-end-class") {
      ui.modal = { type: "end-class" };
      render();
      return;
    }

    if (action === "end-class") {
      if (state.classroom.active?.stage === "collecting") {
        state.classroom.active.stage = "closed";
        recordActiveInteraction();
      }
      state.classroom.status = "ended";
      state.classroom.endedAt = new Date().toISOString();
      buildReportFromClassroom();
      state.reportTask = { status: "running", progress: 4 };
      ui.modal = null;
      persist();
      navigate("/report-generating");
      return;
    }

    if (action === "join-class") {
      const code = document.querySelector("#join-code")?.value.replace(/\s/g, "") || "";
      if (code !== state.classroom.code || !["waiting", "live"].includes(state.classroom.status)) {
        navigate(`/join/${code || "invalid"}`);
        return;
      }
      if (!state.student.joined) {
        state.student.joined = true;
        state.student.anonymousId = String(Math.floor(1 + Math.random() * 999)).padStart(3, "0");
        state.classroom.participants += 1;
        state.classroom.online += 1;
        resetStudentResponse();
      }
      persist();
      navigate("/student");
      return;
    }

    if (action === "reset-join-code") {
      navigate("/join/new");
      return;
    }

    if (action === "student-select-answer") {
      const index = Number(element.dataset.index);
      const multiple = element.dataset.multiple === "true";
      const active = state.classroom.active;
      if (active?.type === "question") {
        if (active.stage !== "collecting") return;
        const questionId = element.dataset.questionId;
        const previous = [...(state.student.answers?.[questionId] || [])];
        const selected = multiple
          ? previous.includes(index) ? previous.filter(item => item !== index) : [...previous, index]
          : [index];
        state.student.answers[questionId] = selected;
        state.student.reviewing = true;
        const stats = active.questionStats?.[questionId];
        if (stats && !previous.length && selected.length) stats.responses = Math.min(state.classroom.participants, (stats.responses || 0) + 1);
        persist();
        render();
        return;
      }
      let selected = Array.isArray(ui.studentLocalSelection) ? [...ui.studentLocalSelection] : [...state.student.selection];
      if (multiple) {
        selected = selected.includes(index) ? selected.filter(item => item !== index) : [...selected, index];
      } else {
        selected = [index];
      }
      ui.studentLocalSelection = selected;
      render();
      return;
    }

    if (action === "student-go-question") {
      const total = activeQuestionIds().length;
      state.student.questionIndex = Math.max(0, Math.min(total - 1, Number(element.dataset.index) || 0));
      state.student.reviewing = true;
      persist();
      render();
      return;
    }

    if (action === "student-complete-questions") {
      const active = state.classroom.active;
      const questionIds = activeQuestionIds(active);
      const unanswered = questionIds.filter(id => !(state.student.answers?.[id] || []).length);
      if (!active || active.type !== "question" || active.stage !== "collecting") return;
      if (unanswered.length) {
        showToast(`仍有 ${unanswered.length} 道題未作答。 `);
        return;
      }
      if (!state.student.completed) {
        active.completed = Math.min(state.classroom.participants, (active.completed || 0) + 1);
        active.responses = active.completed;
      }
      state.student.completed = true;
      state.student.reviewing = false;
      persist();
      render();
      showToast("已完成全部題目，答案會保留至老師截止收集。 ");
      return;
    }

    if (action === "student-review-answers") {
      state.student.reviewing = true;
      state.student.questionIndex = 0;
      persist();
      render();
      return;
    }

    if (action === "student-submit-answer") {
      const selected = Array.isArray(ui.studentLocalSelection) ? ui.studentLocalSelection : state.student.selection;
      if (!selected.length) {
        showToast("請先選擇一個答案。 ");
        return;
      }
      const firstSubmission = !state.student.submitted;
      state.student.selection = [...selected];
      state.student.submitted = true;
      if (firstSubmission && state.classroom.active) state.classroom.active.responses = Math.min(state.classroom.participants, (state.classroom.active.responses || 0) + 1);
      ui.studentLocalSelection = null;
      persist();
      render();
      showToast(firstSubmission ? "已提交，你可在截止前修改。" : "答案已更新。 ");
      return;
    }

    if (action === "student-view-content") {
      state.student.resultDismissed = true;
      persist();
      render();
      return;
    }

    if (action === "student-reconnect") {
      state.student.connected = true;
      persist();
      render();
      showToast("已恢復老師目前的課堂狀態。 ");
      return;
    }

    if (action === "student-finish") {
      state.student.joined = false;
      state.student.anonymousId = "";
      persist();
      navigate("/join/new");
      return;
    }

    if (action === "retry-report") {
      state.reportTask = { status: "running", progress: 4 };
      persist();
      render();
      return;
    }

    if (action === "open-report-feedback") {
      ui.drawer = { type: "report-feedback" };
      ui.modal = null;
      render();
      return;
    }

    if (action === "continue-from-report") {
      if (!ui.reportFeedback.length) {
        showToast("請至少選擇一項要帶入的回饋。 ");
        return;
      }
      state.prep = {
        subject: state.report.subject,
        language: state.report.language,
        requirements: `根據「${state.report.title}」的整體課堂回饋，設計下一節延伸課。先安排短回顧，再針對教師選取的回饋加入鞏固活動。`,
        file: null,
        reportContext: { reportId: state.report.id, feedback: clone(ui.reportFeedback) }
      };
      ui.drawer = null;
      persist();
      navigate("/prepare?from=report");
      showToast("已把選定回饋帶入新備課。 ");
      return;
    }

    if (action === "show-historical-report") {
      ui.modal = { type: "simple-report", title: "City Voices 課堂報告", description: "2026 年 8 月 21 日 · 英文", empty: false };
      render();
      return;
    }

    if (action === "show-empty-report") {
      ui.modal = { type: "simple-report", title: "香港開埠與城市變遷", description: "2026 年 8 月 14 日 · 基礎課堂記錄", empty: true };
      render();
      return;
    }

    if (action === "show-guide") {
      ui.modal = { type: "guide" };
      render();
      return;
    }

    if (action === "ask-reset-demo") {
      ui.modal = { type: "reset-demo" };
      render();
      return;
    }

    if (action === "reset-demo") {
      [ui.generationTimer, ui.reportTimer].filter(Boolean).forEach(timer => window.clearInterval(timer));
      if (ui.contentRevisionTimer) window.clearTimeout(ui.contentRevisionTimer);
      state = clone(defaultState);
      localStorage.removeItem(STORAGE_KEY);
      persist();
      ui.modal = null;
      ui.drawer = null;
      ui.workTab = "content";
      ui.workPage = 2;
      ui.generationTimer = null;
      ui.reportTimer = null;
      ui.contentRevision = null;
      ui.contentRevisionTimer = null;
      navigate("/signin");
      showToast("所有示範資料已重設。 ");
      return;
    }

    if (action === "close-layer") {
      ui.modal = null;
      ui.drawer = null;
      render();
      return;
    }
  }

  app.addEventListener("input", event => {
    const target = event.target;
    if (target.dataset.uiField) {
      ui[target.dataset.uiField] = target.value;
      if (target.dataset.uiField === "loginEmail") ui.loginError = "";
      if (target.dataset.uiField === "activationCode") ui.activationError = "";
    }
    if (target.dataset.prepField) {
      state.prep[target.dataset.prepField] = target.value;
      delete ui.prepErrors[target.dataset.prepField];
      if (target.dataset.prepField === "requirements") delete ui.prepErrors.input;
      persist({ broadcast: false });
    }
    if (target.dataset.feedbackId) {
      const id = target.dataset.feedbackId;
      if (target.checked && !ui.reportFeedback.includes(id)) ui.reportFeedback.push(id);
      if (!target.checked) ui.reportFeedback = ui.reportFeedback.filter(item => item !== id);
      render();
    }
  });

  app.addEventListener("change", event => {
    const target = event.target;
    if (target.dataset.questionPick) {
      const questionId = target.dataset.questionPick;
      if (target.checked && !ui.selectedQuestionIds.includes(questionId)) ui.selectedQuestionIds.push(questionId);
      if (!target.checked) ui.selectedQuestionIds = ui.selectedQuestionIds.filter(id => id !== questionId);
      render();
      return;
    }
    if (target.hasAttribute("data-question-select-all")) {
      const usedIds = publishedQuestionIds();
      ui.selectedQuestionIds = target.checked
        ? classroomQuestions().filter(question => !usedIds.has(question.id)).map(question => question.id)
        : [];
      render();
      return;
    }
    if (target.id === "question-type") {
      const multiple = target.value === "多選題";
      const judging = target.value === "判斷題";
      const answerInputs = [...document.querySelectorAll("[data-correct-answer]")];
      answerInputs.forEach((input, index) => {
        input.type = multiple ? "checkbox" : "radio";
        if (!multiple && index > 0) input.checked = false;
      });
      if (!answerInputs.some(input => input.checked)) answerInputs[0].checked = true;
      [...document.querySelectorAll("[data-question-option]")].forEach((input, index) => {
        input.style.display = judging && index > 1 ? "none" : "";
        if (judging && index === 0 && !input.value.trim()) input.value = "正確";
        if (judging && index === 1 && !input.value.trim()) input.value = "錯誤";
      });
      const hint = document.querySelector("#question-answer-hint");
      if (hint) hint.textContent = multiple ? "可選擇多於一個正確答案，判分採完全匹配。" : "請選擇一個正確答案。";
    }
    if (target.dataset.prepField) {
      state.prep[target.dataset.prepField] = target.value;
      delete ui.prepErrors[target.dataset.prepField];
      persist({ broadcast: false });
    }
  });

  app.addEventListener("click", async event => {
    const actionElement = event.target.closest("[data-action]");
    if (actionElement) {
      event.preventDefault();
      await handleAction(actionElement);
      return;
    }
    if (event.target.matches("[data-layer]")) {
      ui.modal = null;
      ui.drawer = null;
      render();
    }
  });

  app.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    const target = event.target;
    if (target.id === "login-email") {
      event.preventDefault();
      document.querySelector('[data-action="login"]')?.click();
    }
    if (target.id === "activation-code") {
      event.preventDefault();
      document.querySelector('[data-action="activate"]')?.click();
    }
    if (target.id === "join-code") {
      event.preventDefault();
      document.querySelector('[data-action="join-class"]')?.click();
    }
  });

  window.addEventListener("keydown", event => {
    if (event.key !== "Escape" || (!ui.modal && !ui.drawer)) return;
    ui.modal = null;
    ui.drawer = null;
    render();
  });

  window.addEventListener("hashchange", () => {
    window.scrollTo(0, 0);
    render();
  });

  function render() {
    let { path } = routeInfo();
    const publicStudentRoute = path.startsWith("/join/") || path === "/student";
    const activationRoute = path === "/activate";
    const signinRoute = path === "/signin";
    const teacherRoute = !publicStudentRoute && !activationRoute && !signinRoute;

    if (activationRoute && !state.authenticated) {
      path = "/signin";
      history.replaceState(null, "", "#/signin");
    } else if (teacherRoute && !state.authenticated) {
      path = "/signin";
      history.replaceState(null, "", "#/signin");
    } else if (teacherRoute && !state.activated) {
      path = "/activate";
      history.replaceState(null, "", "#/activate");
    }

    if (path === "/lobby" && state.classroom.status !== "waiting") {
      path = state.classroom.status === "live" ? "/classroom" : `/work/${state.classroom.workId}`;
      history.replaceState(null, "", `#${path}`);
    }
    if (path === "/classroom" && state.classroom.status !== "live") {
      path = state.classroom.status === "waiting" ? "/lobby" : state.classroom.status === "ended" ? (state.reportTask.status === "ready" ? `/report/${state.report.id}` : "/report-generating") : `/work/${state.classroom.workId}`;
      history.replaceState(null, "", `#${path}`);
    }
    if (path === "/student" && !state.student.joined) {
      path = `/join/${state.classroom.code}`;
      history.replaceState(null, "", `#${path}`);
    }
    let markup = "";
    let title = "Teeko";

    if (path === "/signin") {
      markup = renderSignin();
      title = "登入 · Teeko";
    } else if (path === "/activate") {
      markup = renderActivate();
      title = "啟用權益 · Teeko";
    } else if (path === "/home") {
      markup = renderHome();
      title = "教師首頁 · Teeko";
    } else if (path === "/prepare") {
      markup = renderPrepare();
      title = "新增備課 · Teeko";
    } else if (path === "/generate") {
      markup = renderGenerate();
      title = "生成進度 · Teeko";
    } else if (path === "/works") {
      markup = renderWorks();
      title = "我的作品 · Teeko";
    } else if (path.startsWith("/work/")) {
      markup = renderWorkDetail(path.split("/")[2]);
      title = "作品詳情 · Teeko";
    } else if (path === "/resources") {
      markup = renderResources();
      title = "資源廣場 · Teeko";
    } else if (path.startsWith("/resource/")) {
      markup = renderResourceDetail(path.split("/")[2]);
      title = "資源詳情 · Teeko";
    } else if (path === "/lobby") {
      markup = renderLobby();
      title = "候課室 · Teeko";
    } else if (path === "/classroom") {
      markup = renderTeacherLive();
      title = "教師課堂 · Teeko";
    } else if (path.startsWith("/join/")) {
      markup = renderJoin(path.split("/")[2] || "");
      title = "加入課堂 · Teeko";
    } else if (path === "/student") {
      markup = renderStudentLive();
      title = "學生課堂 · Teeko";
    } else if (path === "/report-generating") {
      markup = renderReportGenerating();
      title = "報告生成 · Teeko";
    } else if (path.startsWith("/report/")) {
      markup = renderReport();
      title = "課堂報告 · Teeko";
    } else if (path === "/history") {
      markup = renderHistory();
      title = "課堂記錄 · Teeko";
    } else if (path === "/account") {
      markup = renderAccount();
      title = "帳號與權益 · Teeko";
    } else {
      markup = renderHome();
      title = "教師首頁 · Teeko";
    }

    document.title = title;
    app.innerHTML = markup + renderOverlay();
  }

  if (!location.hash) history.replaceState(null, "", "#/signin");
  render();
})();
