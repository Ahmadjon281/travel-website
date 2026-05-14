// ============================================
// AI FEATURES: Tarjimon + Aqlli Qidiruv + Travel Guide
// Claude AI (Anthropic) tomonidan quvvatlanadi
// ============================================

const AI_API_URL = "https://api.anthropic.com/v1/messages";
const AI_MODEL = "claude-sonnet-4-20250514";

// ---- UI INJECT ----
function injectAIPanel() {
  const style = document.createElement("style");
  style.textContent = `
    #ai-fab {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 58px;
      height: 58px;
      border-radius: 50%;
      background: linear-gradient(135deg, #3246D3, #6c63ff);
      color: white;
      font-size: 26px;
      border: none;
      cursor: pointer;
      box-shadow: 0 4px 20px rgba(50,70,211,0.45);
      z-index: 9999;
      transition: transform 0.2s;
      display: flex; align-items: center; justify-content: center;
    }
    #ai-fab:hover { transform: scale(1.1); }

    #ai-panel {
      position: fixed;
      bottom: 100px;
      right: 28px;
      width: 340px;
      max-height: 520px;
      background: #fff;
      border-radius: 20px;
      box-shadow: 0 8px 40px rgba(50,70,211,0.18);
      z-index: 9998;
      display: none;
      flex-direction: column;
      overflow: hidden;
      font-family: 'GoogleSans-Regular', sans-serif;
    }
    #ai-panel.open { display: flex; }

    .ai-header {
      background: linear-gradient(135deg, #3246D3, #6c63ff);
      color: white;
      padding: 14px 18px;
      font-weight: bold;
      font-size: 15px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .ai-tabs {
      display: flex;
      border-bottom: 1px solid #eee;
    }
    .ai-tab {
      flex: 1;
      padding: 10px 4px;
      font-size: 12px;
      text-align: center;
      cursor: pointer;
      border: none;
      background: #f9f9f9;
      color: #666;
      transition: all 0.2s;
      font-family: inherit;
    }
    .ai-tab.active {
      background: white;
      color: #3246D3;
      font-weight: bold;
      border-bottom: 2px solid #3246D3;
    }
    .ai-body {
      padding: 16px;
      flex: 1;
      overflow-y: auto;
    }
    .ai-section { display: none; }
    .ai-section.active { display: block; }

    .ai-label {
      font-size: 12px;
      color: #888;
      margin-bottom: 6px;
      display: block;
    }
    .ai-input, .ai-select, .ai-textarea {
      width: 100%;
      border: 1.5px solid #e0e0e0;
      border-radius: 10px;
      padding: 9px 12px;
      font-size: 13px;
      font-family: inherit;
      outline: none;
      margin-bottom: 10px;
      transition: border 0.2s;
      box-sizing: border-box;
    }
    .ai-input:focus, .ai-select:focus, .ai-textarea:focus {
      border-color: #3246D3;
    }
    .ai-textarea { resize: none; height: 70px; }

    .ai-btn {
      width: 100%;
      padding: 10px;
      background: linear-gradient(135deg, #3246D3, #6c63ff);
      color: white;
      border: none;
      border-radius: 10px;
      font-size: 13px;
      font-weight: bold;
      cursor: pointer;
      font-family: inherit;
      transition: opacity 0.2s;
    }
    .ai-btn:hover { opacity: 0.88; }
    .ai-btn:disabled { opacity: 0.5; cursor: not-allowed; }

    .ai-result {
      margin-top: 12px;
      padding: 12px;
      background: #f4f6ff;
      border-radius: 10px;
      font-size: 13px;
      color: #333;
      line-height: 1.6;
      min-height: 40px;
      white-space: pre-wrap;
    }
    .ai-result.loading {
      color: #aaa;
      font-style: italic;
    }
    .ai-result.error { color: #e53935; background: #fff0f0; }

    .lang-row {
      display: flex;
      gap: 8px;
      align-items: center;
      margin-bottom: 10px;
    }
    .lang-row .ai-select { margin-bottom: 0; flex: 1; }
    .lang-arrow {
      font-size: 18px;
      color: #3246D3;
      font-weight: bold;
    }

    /* Search highlight */
    .search-highlight {
      background: #ffe082;
      border-radius: 3px;
      padding: 0 2px;
    }
  `;
  document.head.appendChild(style);

  const fab = document.createElement("button");
  fab.id = "ai-fab";
  fab.title = "AI Yordamchi";
  fab.innerHTML = "🤖";
  document.body.appendChild(fab);

  const panel = document.createElement("div");
  panel.id = "ai-panel";
  panel.innerHTML = `
    <div class="ai-header">🤖 AI Yordamchi <span style="font-size:11px;opacity:0.8;margin-left:auto">Powered by Claude</span></div>
    <div class="ai-tabs">
      <button class="ai-tab active" data-tab="translate">🌐 Tarjimon</button>
      <button class="ai-tab" data-tab="search">🔍 Qidiruv</button>
      <button class="ai-tab" data-tab="guide">✈️ Travel Guide</button>
    </div>
    <div class="ai-body">

      <!-- TARJIMON -->
      <div class="ai-section active" id="tab-translate">
        <span class="ai-label">Tarjima qilmoqchi bo'lgan matnni kiriting:</span>
        <textarea class="ai-textarea" id="translate-input" placeholder="Matn kiriting..."></textarea>
        <div class="lang-row">
          <select class="ai-select" id="from-lang">
            <option value="auto">Avtomatik</option>
            <option value="uzbek">O'zbek</option>
            <option value="russian">Rus</option>
            <option value="english">Ingliz</option>
          </select>
          <span class="lang-arrow">→</span>
          <select class="ai-select" id="to-lang">
            <option value="english">Ingliz</option>
            <option value="uzbek">O'zbek</option>
            <option value="russian">Rus</option>
          </select>
        </div>
        <button class="ai-btn" id="translate-btn">Tarjima qilish</button>
        <div class="ai-result" id="translate-result" style="display:none"></div>
      </div>

      <!-- AQLLI QIDIRUV -->
      <div class="ai-section" id="tab-search">
        <span class="ai-label">Sayohat yo'nalishi yoki joy haqida so'rang:</span>
        <input class="ai-input" id="search-input" placeholder="Masalan: Tailand, Maldiv, Yevropa..." />
        <button class="ai-btn" id="search-btn">🔍 AI Qidiruv</button>
        <div class="ai-result" id="search-result" style="display:none"></div>
      </div>

      <!-- TRAVEL GUIDE -->
      <div class="ai-section" id="tab-guide">
        <span class="ai-label">Qayerga bormoqchisiz?</span>
        <input class="ai-input" id="guide-dest" placeholder="Masalan: Tailand, Paris, Dubay..." />
        <span class="ai-label">Necha kunlik safar?</span>
        <select class="ai-select" id="guide-days">
          <option value="3">3 kun</option>
          <option value="5" selected>5 kun</option>
          <option value="7">7 kun</option>
          <option value="10">10 kun</option>
          <option value="14">14 kun</option>
        </select>
        <span class="ai-label">Javob tili:</span>
        <select class="ai-select" id="guide-lang">
          <option value="uzbek">O'zbekcha</option>
          <option value="russian">Ruscha</option>
          <option value="english">English</option>
        </select>
        <button class="ai-btn" id="guide-btn">✈️ Marshrut tuzish</button>
        <div class="ai-result" id="guide-result" style="display:none"></div>
      </div>

    </div>
  `;
  document.body.appendChild(panel);

  // FAB toggle
  fab.addEventListener("click", () => {
    panel.classList.toggle("open");
  });

  // Tab switching
  panel.querySelectorAll(".ai-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      panel.querySelectorAll(".ai-tab").forEach(t => t.classList.remove("active"));
      panel.querySelectorAll(".ai-section").forEach(s => s.classList.remove("active"));
      tab.classList.add("active");
      document.getElementById("tab-" + tab.dataset.tab).classList.add("active");
    });
  });

  // Buttons
  document.getElementById("translate-btn").addEventListener("click", doTranslate);
  document.getElementById("search-btn").addEventListener("click", doSearch);
  document.getElementById("guide-btn").addEventListener("click", doGuide);

  // Enter key for search
  document.getElementById("search-input").addEventListener("keydown", e => {
    if (e.key === "Enter") doSearch();
  });
}

// ---- AI API CALL ----
async function callAI(prompt) {
  const res = await fetch(AI_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: AI_MODEL,
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }]
    })
  });
  const data = await res.json();
  if (data.error) throw new Error(data.error.message);
  return data.content.map(c => c.text || "").join("");
}

function showResult(el, text, isError = false) {
  el.style.display = "block";
  el.className = "ai-result" + (isError ? " error" : "");
  el.textContent = text;
}

function showLoading(el, msg = "AI javob tayyorlamoqda...") {
  el.style.display = "block";
  el.className = "ai-result loading";
  el.textContent = msg;
}

// ---- TARJIMON ----
async function doTranslate() {
  const text = document.getElementById("translate-input").value.trim();
  const from = document.getElementById("from-lang").value;
  const to = document.getElementById("to-lang").value;
  const result = document.getElementById("translate-result");
  const btn = document.getElementById("translate-btn");

  if (!text) { showResult(result, "⚠️ Iltimos, matn kiriting.", true); return; }

  btn.disabled = true;
  showLoading(result, "⏳ Tarjima qilinmoqda...");

  const fromStr = from === "auto" ? "aniqlangan tildan" : `${from} tilidan`;
  const prompt = `Quyidagi matnni ${fromStr} ${to} tiliga tarjima qil. Faqat tarjimani ber, boshqa hech narsa yozma:\n\n"${text}"`;

  try {
    const answer = await callAI(prompt);
    showResult(result, answer);
  } catch (e) {
    showResult(result, "❌ Xatolik: " + e.message, true);
  } finally {
    btn.disabled = false;
  }
}

// ---- AQLLI QIDIRUV ----
async function doSearch() {
  const query = document.getElementById("search-input").value.trim();
  const result = document.getElementById("search-result");
  const btn = document.getElementById("search-btn");

  if (!query) { showResult(result, "⚠️ Iltimos, joy nomini kiriting.", true); return; }

  btn.disabled = true;
  showLoading(result, "🔍 Qidirilmoqda...");

  const prompt = `Sen sayohat bo'yicha mutaxassissan. "${query}" haqida qisqa (4-5 gap) ma'lumot ber: nima uchun mashhur, qachon borish yaxshi, nimani ko'rish kerak. O'zbek tilida javob ber.`;

  try {
    const answer = await callAI(prompt);
    showResult(result, answer);
  } catch (e) {
    showResult(result, "❌ Xatolik: " + e.message, true);
  } finally {
    btn.disabled = false;
  }
}

// ---- TRAVEL GUIDE ----
async function doGuide() {
  const dest = document.getElementById("guide-dest").value.trim();
  const days = document.getElementById("guide-days").value;
  const lang = document.getElementById("guide-lang").value;
  const result = document.getElementById("guide-result");
  const btn = document.getElementById("guide-btn");

  if (!dest) { showResult(result, "⚠️ Iltimos, joy nomini kiriting.", true); return; }

  btn.disabled = true;
  showLoading(result, "✈️ Marshrut tuzilmoqda...");

  const langMap = { uzbek: "o'zbek", russian: "rus", english: "ingliz" };
  const prompt = `Sen professional travel guide/yo'riqchisan. ${dest} uchun ${days} kunlik sayohat marshruti tuz. ${langMap[lang]} tilida yoz. Har kun uchun 2-3 ta tavsiya qil. Ixcham va foydali bo'lsin.`;

  try {
    const answer = await callAI(prompt);
    showResult(result, answer);
  } catch (e) {
    showResult(result, "❌ Xatolik: " + e.message, true);
  } finally {
    btn.disabled = false;
  }
}

// ---- START ----
document.addEventListener("DOMContentLoaded", injectAIPanel);
