import { useState, useEffect } from "react";

// ---------- design tokens ----------
const C = {
  ink: "#0A1322",
  panel: "#101C31",
  panel2: "#16243D",
  line: "#22344F",
  amber: "#FFB02E",
  up: "#3DD68C",
  down: "#F2555A",
  neutral: "#8DA2C0",
  text: "#E9EFF8",
  muted: "#8DA2C0",
};

const mono = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const sans = "'Space Grotesk', 'Inter', system-ui, sans-serif";

// ---------- i18n ----------
const T = {
  en: {
    desk: "Market Outlook Desk",
    title: "Up or down",
    tagline:
      "Live web research on any stock — news, social buzz, technicals, analyst chatter — condensed into a directional read with a buy/sell signal. The tool tracks its own accuracy over time.",
    tabStock: "Analyze",
    tabWatch: "Watchlist",
    tabScan: "Market scan",
    placeholder: "Ticker or company name — e.g. NVDA, Tesla",
    analyze: "Analyze",
    searching: "Searching…",
    loadingStock: "Searching news, social media & technicals…",
    errStock: "Couldn't complete the analysis. Try again, or use a ticker symbol (e.g. NVDA).",
    signal: { BUY: "BUY", SELL: "SELL", HOLD: "HOLD" },
    verdict: { UP: "LIKELY UP", DOWN: "LIKELY DOWN", NEUTRAL: "SIDEWAYS / UNCLEAR" },
    risk: { LOW: "LOW RISK", MEDIUM: "MED RISK", HIGH: "HIGH RISK" },
    bullish: "Bullish",
    bearish: "Bearish",
    social: "Social media buzz",
    technicals: "Technical picture",
    catalyst: "Next catalyst",
    advice: "When to buy / sell",
    events: "Recent events",
    addedWatch: "Saved to watchlist",
    watchEmpty:
      "No stocks yet. Analyze any stock and it's saved here automatically — come back each day and recheck.",
    recheckAll: "Recheck all",
    recheck: "Recheck",
    remove: "Remove",
    lastCheck: "checked",
    changed: "signal changed",
    sinceLast: "since last check",
    accuracy: "Tool track record",
    callsTracked: "predictions verified",
    correct: "correct",
    noTrack:
      "No track record yet. Recheck stocks on later days — the tool compares each old prediction with the real price move and scores itself.",
    runScan: "Run scan",
    scanning: "Scanning…",
    scanHint: "Up to 50 potential risers · 10 likely decliners",
    scanUpStage: "Scanning for stocks with upside momentum…",
    scanDownStage: "Scanning for stocks under pressure…",
    scanTopStage: "Picking top short-term & long-term candidates…",
    shortTitle: "Top 10 · Short-term",
    longTitle: "Top 10 · Long-term growth",
    horizonShort: "days–weeks",
    horizonLong: "1–5 years",
    errScan: "The scan ran into a problem. Hit Run scan again — results vary per attempt.",
    risers: "Potential risers",
    fallers: "Likely decliners",
    found: "found",
    disclaimer:
      "AI-generated outlooks based on web search, technicals and social sentiment. Not financial advice — short-term price prediction is unreliable, and no model can do it consistently. The track record above shows you exactly how often this tool is right. Use as a research starting point, not a trading signal.",
    view: "Open",
  },
  ru: {
    desk: "Биржевой аналитический стол",
    title: "Вверх или вниз",
    tagline:
      "Живой веб-анализ любой акции — новости, соцсети, теханализ, мнения аналитиков — сжатые в прогноз и сигнал покупать/продавать. Инструмент сам отслеживает точность своих прогнозов.",
    tabStock: "Анализ",
    tabWatch: "Мои акции",
    tabScan: "Сканер рынка",
    placeholder: "Тикер или название — напр. NVDA, Tesla",
    analyze: "Анализ",
    searching: "Поиск…",
    loadingStock: "Ищу новости, соцсети и техиндикаторы…",
    errStock: "Не удалось завершить анализ. Попробуйте ещё раз или введите тикер (напр. NVDA).",
    signal: { BUY: "ПОКУПАТЬ", SELL: "ПРОДАВАТЬ", HOLD: "ДЕРЖАТЬ" },
    verdict: { UP: "ВЕРОЯТЕН РОСТ", DOWN: "ВЕРОЯТНО ПАДЕНИЕ", NEUTRAL: "БОКОВИК / НЕЯСНО" },
    risk: { LOW: "НИЗКИЙ РИСК", MEDIUM: "СРЕДНИЙ РИСК", HIGH: "ВЫСОКИЙ РИСК" },
    bullish: "За рост",
    bearish: "За падение",
    social: "Обсуждения в соцсетях",
    technicals: "Техническая картина",
    catalyst: "Ближайший катализатор",
    advice: "Когда покупать / продавать",
    events: "Последние события",
    addedWatch: "Сохранено в список",
    watchEmpty:
      "Пока пусто. Проанализируйте любую акцию — она сохранится здесь автоматически. Возвращайтесь каждый день и обновляйте.",
    recheckAll: "Обновить все",
    recheck: "Обновить",
    remove: "Удалить",
    lastCheck: "проверено",
    changed: "сигнал изменился",
    sinceLast: "с прошлой проверки",
    accuracy: "Точность инструмента",
    callsTracked: "прогнозов проверено",
    correct: "верных",
    noTrack:
      "Статистики пока нет. Обновляйте акции в следующие дни — инструмент сравнит старый прогноз с реальным движением цены и сам выставит себе оценку.",
    runScan: "Запустить сканер",
    scanning: "Сканирую…",
    scanHint: "До 50 кандидатов на рост · 10 вероятных падений",
    scanUpStage: "Ищу акции с потенциалом роста…",
    scanDownStage: "Ищу акции под давлением…",
    scanTopStage: "Выбираю топ-кандидатов на короткий и длинный срок…",
    shortTitle: "Топ-10 · Краткосрок",
    longTitle: "Топ-10 · Долгосрочный рост",
    horizonShort: "дни–недели",
    horizonLong: "1–5 лет",
    errScan: "Сканер столкнулся с проблемой. Запустите ещё раз — результаты меняются от попытки к попытке.",
    risers: "Кандидаты на рост",
    fallers: "Вероятные падения",
    found: "найдено",
    disclaimer:
      "Прогнозы сгенерированы ИИ на основе веб-поиска, теханализа и настроений в соцсетях. Это не финансовый совет — краткосрочные движения цен непредсказуемы. Статистика точности выше честно показывает, как часто инструмент оказывается прав. Используйте как отправную точку для исследования, а не как торговый сигнал.",
    view: "Открыть",
  },
};

// ---------- API helpers ----------
async function askClaude(prompt) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1000,
      messages: [{ role: "user", content: prompt }],
      tools: [{ type: "web_search_20250305", name: "web_search" }],
    }),
  });
  const data = await response.json();
  if (data.error) throw new Error(data.error.message || "API error");
  return (data.content || [])
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("\n");
}

function parseJSON(text) {
  const clean = text.replace(/```json|```/g, "").trim();
  const start = clean.indexOf("{");
  const end = clean.lastIndexOf("}");
  if (start === -1 || end === -1) throw new Error("No JSON found");
  return JSON.parse(clean.slice(start, end + 1));
}

// Salvages {"t":"...","r":"..."} items even from truncated/broken JSON.
function salvageItems(text) {
  const items = [];
  const re = /"t"\s*:\s*"([^"]+)"\s*,\s*"r"\s*:\s*"([^"]*)"/g;
  let m;
  while ((m = re.exec(text))) items.push({ t: m[1], r: m[2] });
  return items;
}

function parseList(text) {
  try {
    const j = parseJSON(text);
    if (Array.isArray(j.list) && j.list.length) return j.list;
  } catch {}
  const items = salvageItems(text);
  if (!items.length) throw new Error("No items found");
  return items;
}

function buildStockPrompt(query, lang) {
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const langNote =
    lang === "ru"
      ? "Write ALL human-readable text values in Russian."
      : "Write all text values in English.";
  return `You are a professional equity research assistant. Today is ${today}.
Use web search to research the stock "${query}" across FOUR angles:
1) NEWS & FUNDAMENTALS: latest news, earnings, analyst ratings, price targets, insider/institutional buying or selling.
2) SOCIAL SENTIMENT: what retail investors say right now on Reddit (r/wallstreetbets, r/stocks), X/Twitter, StockTwits.
3) TECHNICALS: current RSI, trend vs 50/200-day moving averages, key support and resistance levels.
4) CATALYSTS: next earnings date, upcoming product launches, Fed meetings or other dated events that could move it.
Form a short-term outlook (days to weeks) and a trading signal. If the angles disagree, lower confidence and say so.
${langNote}
Respond ONLY with compact JSON, no markdown, no preamble. Keep every string SHORT:
{"ticker":"...","name":"...","price":"current price as text or null","priceNum":numeric current price or null,"verdict":"UP"|"DOWN"|"NEUTRAL","signal":"BUY"|"HOLD"|"SELL","confidence":0-100,"risk":"LOW"|"MEDIUM"|"HIGH","summary":"2 sentences","social":"1-2 sentences on social buzz","socialMood":"POSITIVE"|"MIXED"|"NEGATIVE","technicals":"1-2 sentences: RSI, MA trend, support/resistance","catalyst":"nearest dated event, e.g. earnings date","advice":"1-2 sentences: levels/conditions to buy or sell, incl. analyst price targets","bullish":["max 3 short"],"bearish":["max 3 short"],"events":["max 3 with dates"]}`;
}

async function analyzeStock(query, lang) {
  const text = await askClaude(buildStockPrompt(query, lang));
  const r = parseJSON(text);
  r.checkedAt = new Date().toISOString();
  return r;
}

// ---------- persistent storage ----------
const WKEY = "watchlist-v1";
const HKEY = "prediction-history-v1";

async function loadKey(key) {
  try {
    const res = await window.storage.get(key);
    return res ? JSON.parse(res.value) : [];
  } catch {
    return [];
  }
}
async function saveKey(key, val) {
  try {
    await window.storage.set(key, JSON.stringify(val));
  } catch (e) {
    console.error("storage error", e);
  }
}

// score an old prediction against a fresh price
function scorePrediction(oldEntry, fresh) {
  if (
    !oldEntry ||
    typeof oldEntry.priceNum !== "number" ||
    typeof fresh.priceNum !== "number" ||
    !oldEntry.verdict ||
    oldEntry.priceNum <= 0
  )
    return null;
  const deltaPct = ((fresh.priceNum - oldEntry.priceNum) / oldEntry.priceNum) * 100;
  if (Math.abs(deltaPct) < 0.05) return null; // no real move yet
  const correct =
    oldEntry.verdict === "UP"
      ? deltaPct > 0
      : oldEntry.verdict === "DOWN"
      ? deltaPct < 0
      : Math.abs(deltaPct) < 1.5;
  return {
    ticker: oldEntry.ticker,
    from: oldEntry.checkedAt,
    to: fresh.checkedAt,
    verdict: oldEntry.verdict,
    deltaPct: Math.round(deltaPct * 100) / 100,
    correct,
  };
}

// ---------- UI atoms ----------
const Hairline = () => <div style={{ height: 1, background: C.line }} />;

const Eyebrow = ({ children }) => (
  <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.18em", color: C.amber, textTransform: "uppercase" }}>
    {children}
  </div>
);

function ConfidenceMeter({ value, color }) {
  const blocks = 20;
  const filled = Math.round((Math.min(100, Math.max(0, value)) / 100) * blocks);
  return (
    <div style={{ fontFamily: mono, fontSize: 14, color }}>
      {"█".repeat(filled)}
      <span style={{ color: C.line }}>{"░".repeat(blocks - filled)}</span>
      <span style={{ marginLeft: 10, color: C.text }}>{value}%</span>
    </div>
  );
}

function SignalBadge({ signal, t, size = "lg" }) {
  const color = signal === "BUY" ? C.up : signal === "SELL" ? C.down : C.amber;
  const big = size === "lg";
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: big ? 16 : 11,
        fontWeight: 600,
        letterSpacing: "0.1em",
        color: C.ink,
        background: color,
        borderRadius: 4,
        padding: big ? "6px 14px" : "3px 8px",
        whiteSpace: "nowrap",
      }}
    >
      {t.signal[signal] || signal}
    </span>
  );
}

function RiskBadge({ risk, t }) {
  if (!risk) return null;
  const color = risk === "LOW" ? C.up : risk === "HIGH" ? C.down : C.amber;
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 11,
        letterSpacing: "0.08em",
        color,
        border: `1px solid ${color}`,
        borderRadius: 4,
        padding: "4px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {t.risk[risk] || risk}
    </span>
  );
}

function VerdictBadge({ verdict, t }) {
  const map = {
    UP: { color: C.up, glyph: "▲▲" },
    DOWN: { color: C.down, glyph: "▼▼" },
    NEUTRAL: { color: C.neutral, glyph: "◆" },
  };
  const v = map[verdict] || map.NEUTRAL;
  return (
    <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
      <span style={{ fontFamily: mono, fontSize: 38, color: v.color, lineHeight: 1 }}>{v.glyph}</span>
      <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 26, color: v.color }}>
        {t.verdict[verdict] || t.verdict.NEUTRAL}
      </span>
    </div>
  );
}

function FactorList({ title, items, color }) {
  if (!items || !items.length) return null;
  return (
    <div style={{ flex: 1, minWidth: 220 }}>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", color, marginBottom: 8, textTransform: "uppercase" }}>
        {title}
      </div>
      {items.map((it, i) => (
        <div key={i} style={{ fontFamily: sans, fontSize: 14, color: C.text, padding: "7px 0", borderTop: `1px solid ${C.line}`, display: "flex", gap: 10 }}>
          <span style={{ color, fontFamily: mono }}>·</span>
          <span>{it}</span>
        </div>
      ))}
    </div>
  );
}

function Spinner({ label }) {
  return (
    <div style={{ fontFamily: mono, fontSize: 13, color: C.amber, padding: "28px 0", textAlign: "center" }}>
      <span className="pulse">▮▮▮</span> {label}
      <style>{`.pulse{animation:pulse 1s infinite}@keyframes pulse{0%,100%{opacity:.25}50%{opacity:1}}`}</style>
    </div>
  );
}

function SectionBox({ label, color, children }) {
  return (
    <div style={{ marginTop: 16, background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "14px 16px" }}>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", color, textTransform: "uppercase", marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ fontFamily: sans, fontSize: 14, lineHeight: 1.6, color: C.text }}>{children}</div>
    </div>
  );
}

// ---------- result card ----------
function ResultCard({ result, t }) {
  const moodColor =
    result.socialMood === "POSITIVE" ? C.up : result.socialMood === "NEGATIVE" ? C.down : C.amber;
  return (
    <div style={{ marginTop: 22, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6, padding: 24 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
        <div>
          <span style={{ fontFamily: mono, fontSize: 26, color: C.amber }}>{result.ticker}</span>
          <span style={{ fontFamily: sans, fontSize: 15, color: C.muted, marginLeft: 12 }}>{result.name}</span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          {result.price && <span style={{ fontFamily: mono, fontSize: 18, color: C.text }}>{result.price}</span>}
          <RiskBadge risk={result.risk} t={t} />
          <SignalBadge signal={result.signal} t={t} />
        </div>
      </div>

      <div style={{ margin: "20px 0 10px" }}>
        <VerdictBadge verdict={result.verdict} t={t} />
      </div>
      <ConfidenceMeter
        value={Number(result.confidence) || 0}
        color={result.verdict === "UP" ? C.up : result.verdict === "DOWN" ? C.down : C.neutral}
      />

      <p style={{ fontFamily: sans, fontSize: 15, lineHeight: 1.6, color: C.text, marginTop: 18 }}>{result.summary}</p>

      {result.catalyst && (
        <div style={{ fontFamily: mono, fontSize: 13, color: C.amber, marginTop: 4 }}>
          ◷ {t.catalyst}: <span style={{ color: C.text }}>{result.catalyst}</span>
        </div>
      )}

      {result.technicals && (
        <SectionBox label={t.technicals} color={C.neutral}>
          {result.technicals}
        </SectionBox>
      )}

      {result.social && (
        <SectionBox label={t.social} color={moodColor}>
          {result.social}
        </SectionBox>
      )}

      {result.advice && (
        <SectionBox label={t.advice} color={C.amber}>
          {result.advice}
        </SectionBox>
      )}

      <div style={{ display: "flex", gap: 28, flexWrap: "wrap", marginTop: 22 }}>
        <FactorList title={t.bullish} items={result.bullish} color={C.up} />
        <FactorList title={t.bearish} items={result.bearish} color={C.down} />
      </div>

      {result.events && result.events.length > 0 && (
        <div style={{ marginTop: 22 }}>
          <Eyebrow>{t.events}</Eyebrow>
          {result.events.map((ev, i) => (
            <div key={i} style={{ fontFamily: mono, fontSize: 13, color: C.muted, padding: "8px 0", borderTop: `1px solid ${C.line}` }}>
              {ev}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------- single stock panel ----------
function StockAnalyzer({ t, lang, onSaved, externalResult }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (externalResult) {
      setResult(externalResult);
      setSaved(false);
      setError(null);
    }
  }, [externalResult]);

  const analyze = async () => {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setSaved(false);
    try {
      const r = await analyzeStock(query.trim(), lang);
      setResult(r);
      await onSaved(r);
      setSaved(true);
    } catch {
      setError(t.errStock);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && analyze()}
          placeholder={t.placeholder}
          style={{ flex: 1, background: C.panel, border: `1px solid ${C.line}`, color: C.text, fontFamily: mono, fontSize: 15, padding: "13px 16px", outline: "none", borderRadius: 4 }}
        />
        <button
          onClick={analyze}
          disabled={loading}
          style={{ background: C.amber, color: C.ink, border: "none", fontFamily: sans, fontWeight: 700, fontSize: 14, padding: "0 26px", cursor: loading ? "wait" : "pointer", borderRadius: 4 }}
        >
          {loading ? t.searching : t.analyze}
        </button>
      </div>

      {loading && <Spinner label={t.loadingStock} />}
      {error && <div style={{ fontFamily: sans, color: C.down, fontSize: 14, padding: "18px 0" }}>{error}</div>}
      {saved && <div style={{ fontFamily: mono, fontSize: 12, color: C.up, marginTop: 14 }}>✓ {t.addedWatch}</div>}
      {result && <ResultCard result={result} t={t} />}
    </div>
  );
}

// ---------- track record scoreboard ----------
function Scoreboard({ history, t }) {
  if (!history.length) {
    return (
      <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "14px 16px", marginBottom: 16 }}>
        <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase", marginBottom: 6 }}>
          {t.accuracy}
        </div>
        <div style={{ fontFamily: sans, fontSize: 13, color: C.muted, lineHeight: 1.6 }}>{t.noTrack}</div>
      </div>
    );
  }
  const hits = history.filter((h) => h.correct).length;
  const pct = Math.round((hits / history.length) * 100);
  const pctColor = pct >= 60 ? C.up : pct >= 45 ? C.amber : C.down;
  const recent = history.slice(-10);
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 6, padding: "14px 16px", marginBottom: 16 }}>
      <div style={{ fontFamily: mono, fontSize: 11, letterSpacing: "0.14em", color: C.amber, textTransform: "uppercase", marginBottom: 8 }}>
        {t.accuracy}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 14, flexWrap: "wrap" }}>
        <span style={{ fontFamily: mono, fontSize: 30, color: pctColor, fontWeight: 600 }}>{pct}%</span>
        <span style={{ fontFamily: sans, fontSize: 13, color: C.muted }}>
          {hits} {t.correct} / {history.length} {t.callsTracked}
        </span>
        <span style={{ fontFamily: mono, fontSize: 16, letterSpacing: 3 }}>
          {recent.map((h, i) => (
            <span key={i} style={{ color: h.correct ? C.up : C.down }}>
              {h.correct ? "●" : "○"}
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}

// ---------- watchlist panel ----------
function Watchlist({ t, lang, list, setList, history, setHistory, onOpen }) {
  const [busy, setBusy] = useState({});
  const [allBusy, setAllBusy] = useState(false);

  const recheckOne = async (ticker) => {
    setBusy((b) => ({ ...b, [ticker]: true }));
    try {
      const old = list.find((it) => it.ticker === ticker);
      const fresh = await analyzeStock(ticker, lang);
      const score = scorePrediction(old, fresh);
      if (score) {
        fresh.lastDelta = score.deltaPct;
        setHistory((h) => {
          const nh = [...h, score];
          saveKey(HKEY, nh);
          return nh;
        });
      }
      setList((prev) => {
        const next = prev.map((it) =>
          it.ticker === ticker ? { ...fresh, prevSignal: it.signal } : it
        );
        saveKey(WKEY, next);
        return next;
      });
    } catch (e) {
      console.error(e);
    } finally {
      setBusy((b) => ({ ...b, [ticker]: false }));
    }
  };

  const recheckAll = async () => {
    if (allBusy) return;
    setAllBusy(true);
    for (const it of list) {
      await recheckOne(it.ticker);
    }
    setAllBusy(false);
  };

  const remove = (ticker) => {
    setList((prev) => {
      const next = prev.filter((it) => it.ticker !== ticker);
      saveKey(WKEY, next);
      return next;
    });
  };

  return (
    <div style={{ marginTop: 18 }}>
      <Scoreboard history={history} t={t} />

      {!list.length ? (
        <div style={{ fontFamily: sans, fontSize: 14, color: C.muted, padding: "16px 0", lineHeight: 1.6, maxWidth: 480 }}>
          {t.watchEmpty}
        </div>
      ) : (
        <>
          <button
            onClick={recheckAll}
            disabled={allBusy}
            style={{ background: allBusy ? C.panel2 : C.amber, color: allBusy ? C.muted : C.ink, border: "none", fontFamily: sans, fontWeight: 700, fontSize: 13, padding: "10px 20px", cursor: allBusy ? "wait" : "pointer", borderRadius: 4, marginBottom: 16 }}
          >
            {allBusy ? t.scanning : `↻ ${t.recheckAll}`}
          </button>

          <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6 }}>
            {list.map((s, i) => {
              const vColor = s.verdict === "UP" ? C.up : s.verdict === "DOWN" ? C.down : C.neutral;
              const date = s.checkedAt
                ? new Date(s.checkedAt).toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { month: "short", day: "numeric" })
                : "";
              const changed = s.prevSignal && s.prevSignal !== s.signal;
              const delta = typeof s.lastDelta === "number" ? s.lastDelta : null;
              return (
                <div key={s.ticker} style={{ padding: "12px 14px", borderTop: i === 0 ? "none" : `1px solid ${C.line}` }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                    <span style={{ fontFamily: mono, fontSize: 16, color: C.amber, minWidth: 64 }}>{s.ticker}</span>
                    <span style={{ fontFamily: mono, fontSize: 16, color: vColor }}>
                      {s.verdict === "UP" ? "▲" : s.verdict === "DOWN" ? "▼" : "◆"}
                    </span>
                    <SignalBadge signal={s.signal} t={t} size="sm" />
                    <span style={{ fontFamily: mono, fontSize: 12, color: C.muted }}>
                      {s.confidence}% · {t.lastCheck} {date}
                    </span>
                    {delta !== null && (
                      <span style={{ fontFamily: mono, fontSize: 12, color: delta >= 0 ? C.up : C.down }}>
                        {delta >= 0 ? "+" : ""}{delta}% {t.sinceLast}
                      </span>
                    )}
                    {changed && (
                      <span style={{ fontFamily: mono, fontSize: 11, color: C.amber }}>
                        ⚡ {t.changed}: {t.signal[s.prevSignal]} → {t.signal[s.signal]}
                      </span>
                    )}
                    <span style={{ flex: 1 }} />
                    <button onClick={() => onOpen(s)} style={btnGhost}>{t.view}</button>
                    <button onClick={() => recheckOne(s.ticker)} disabled={busy[s.ticker]} style={btnGhost}>
                      {busy[s.ticker] ? "…" : `↻ ${t.recheck}`}
                    </button>
                    <button onClick={() => remove(s.ticker)} style={{ ...btnGhost, color: C.down }}>✕</button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

const btnGhost = {
  background: "transparent",
  border: `1px solid ${C.line}`,
  color: C.muted,
  fontFamily: mono,
  fontSize: 11,
  padding: "6px 10px",
  borderRadius: 4,
  cursor: "pointer",
};

// ---------- market scan panel ----------
function MarketScan({ t, lang }) {
  const [loading, setLoading] = useState(false);
  const [shortList, setShortList] = useState(null);
  const [longList, setLongList] = useState(null);
  const [risers, setRisers] = useState(null);
  const [fallers, setFallers] = useState(null);
  const [error, setError] = useState(null);
  const [stage, setStage] = useState("");

  const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });

  const scan = async () => {
    if (loading) return;
    setLoading(true);
    setError(null);
    setShortList(null);
    setLongList(null);
    setRisers(null);
    setFallers(null);
    const langNote = lang === "ru" ? "Write all reasons in Russian." : "Write all reasons in English.";
    let okCount = 0;

    setStage(t.scanTopStage);
    try {
      const topText = await askClaude(
        `Today is ${today}. Use web search across two angles: (a) current momentum, catalysts, upgrades and sentiment for the NEXT DAYS-WEEKS; (b) secular trends, durable competitive advantages, revenue growth and analyst long-term theses for the NEXT 1-5 YEARS. Pick the 10 strongest short-term candidates and the 10 strongest long-term growth candidates (the two lists usually differ). ${langNote} Respond ONLY with ultra-compact JSON, no markdown: {"short":[{"t":"TICKER","r":"reason max 7 words"}],"long":[{"t":"TICKER","r":"reason max 7 words"}]}`
      );
      let s = [], l = [];
      try {
        const top = parseJSON(topText);
        s = top.short || [];
        l = top.long || [];
      } catch {
        // truncated JSON: split at the "long" key and salvage each half
        const idx = topText.indexOf('"long"');
        if (idx !== -1) {
          s = salvageItems(topText.slice(0, idx));
          l = salvageItems(topText.slice(idx));
        } else {
          s = salvageItems(topText);
        }
      }
      if (s.length) { setShortList(s); okCount++; }
      if (l.length) { setLongList(l); okCount++; }
    } catch (e) {
      console.error("top scan failed", e);
    }

    setStage(t.scanUpStage);
    try {
      const upText = await askClaude(
        `Today is ${today}. Use web search for the latest market news, sector momentum, earnings beats, upgrades and catalysts. List up to 50 publicly traded stocks most likely to RISE near-term. ${langNote} Respond ONLY with ultra-compact JSON, no markdown: {"list":[{"t":"TICKER","r":"reason max 5 words"}]} Keep reasons extremely short so all entries fit.`
      );
      setRisers(parseList(upText));
      okCount++;
    } catch (e) {
      console.error("risers scan failed", e);
    }

    setStage(t.scanDownStage);
    try {
      const downText = await askClaude(
        `Today is ${today}. Use web search for the latest downgrades, missed earnings, lawsuits and negative catalysts. List the 10 publicly traded stocks most likely to FALL near-term. ${langNote} Respond ONLY with ultra-compact JSON, no markdown: {"list":[{"t":"TICKER","r":"reason max 8 words"}]}`
      );
      setFallers(parseList(downText));
      okCount++;
    } catch (e) {
      console.error("fallers scan failed", e);
    }

    if (okCount === 0) setError(t.errScan);
    setLoading(false);
    setStage("");
  };

  const Table = ({ title, sub, items, color, glyph }) =>
    items && (
      <div style={{ flex: 1, minWidth: 300 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: 10, flexWrap: "wrap" }}>
          <span style={{ fontFamily: mono, color, fontSize: 18 }}>{glyph}</span>
          <span style={{ fontFamily: sans, fontWeight: 700, fontSize: 16, color: C.text }}>{title}</span>
          {sub && <span style={{ fontFamily: mono, fontSize: 11, color, border: `1px solid ${C.line}`, borderRadius: 4, padding: "2px 7px" }}>{sub}</span>}
          <span style={{ fontFamily: mono, fontSize: 12, color: C.muted }}>{items.length} {t.found}</span>
        </div>
        <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 6 }}>
          {items.map((s, i) => (
            <div key={i} style={{ display: "flex", gap: 12, padding: "9px 14px", borderTop: i === 0 ? "none" : `1px solid ${C.line}`, alignItems: "baseline" }}>
              <span style={{ fontFamily: mono, fontSize: 11, color: C.line, width: 24 }}>{String(i + 1).padStart(2, "0")}</span>
              <span style={{ fontFamily: mono, fontSize: 14, color, width: 64 }}>{s.t}</span>
              <span style={{ fontFamily: sans, fontSize: 13, color: C.muted, flex: 1 }}>{s.r}</span>
            </div>
          ))}
        </div>
      </div>
    );

  return (
    <div>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 18, flexWrap: "wrap" }}>
        <button
          onClick={scan}
          disabled={loading}
          style={{ background: loading ? C.panel2 : C.amber, color: loading ? C.muted : C.ink, border: "none", fontFamily: sans, fontWeight: 700, fontSize: 14, padding: "13px 26px", cursor: loading ? "wait" : "pointer", borderRadius: 4 }}
        >
          {loading ? t.scanning : t.runScan}
        </button>
        <span style={{ fontFamily: mono, fontSize: 12, color: C.muted }}>{t.scanHint}</span>
      </div>

      {loading && <Spinner label={stage} />}
      {error && <div style={{ fontFamily: sans, color: C.down, fontSize: 14, padding: "18px 0" }}>{error}</div>}

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 22 }}>
        <Table title={t.shortTitle} sub={t.horizonShort} items={shortList} color={C.amber} glyph="⚡" />
        <Table title={t.longTitle} sub={t.horizonLong} items={longList} color={C.up} glyph="◈" />
      </div>

      <div style={{ display: "flex", gap: 24, flexWrap: "wrap", marginTop: 22 }}>
        <Table title={t.risers} items={risers} color={C.up} glyph="▲" />
        <Table title={t.fallers} items={fallers} color={C.down} glyph="▼" />
      </div>
    </div>
  );
}

// ---------- app ----------
export default function App() {
  const [tab, setTab] = useState("stock");
  const [lang, setLang] = useState("en");
  const [watchlist, setWatchlist] = useState([]);
  const [history, setHistory] = useState([]);
  const [openedResult, setOpenedResult] = useState(null);
  const t = T[lang];

  useEffect(() => {
    loadKey(WKEY).then(setWatchlist);
    loadKey(HKEY).then(setHistory);
  }, []);

  const handleSaved = async (r) => {
    setWatchlist((prev) => {
      const existing = prev.find((it) => it.ticker === r.ticker);
      const entry = existing ? { ...r, prevSignal: existing.signal } : r;
      const next = [entry, ...prev.filter((it) => it.ticker !== r.ticker)];
      saveKey(WKEY, next);
      return next;
    });
  };

  const openFromWatchlist = (s) => {
    setOpenedResult({ ...s, _ts: Date.now() });
    setTab("stock");
  };

  const today = new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div style={{ minHeight: "100vh", background: C.ink, padding: "0 0 60px" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700&display=swap"
        rel="stylesheet"
      />
      <div style={{ maxWidth: 880, margin: "0 auto", padding: "36px 20px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Eyebrow>{t.desk} · {today}</Eyebrow>
          <div style={{ display: "flex", border: `1px solid ${C.line}`, borderRadius: 4, overflow: "hidden" }}>
            {["en", "ru"].map((l) => (
              <button
                key={l}
                onClick={() => setLang(l)}
                style={{
                  background: lang === l ? C.amber : "transparent",
                  color: lang === l ? C.ink : C.muted,
                  border: "none",
                  fontFamily: mono,
                  fontSize: 12,
                  fontWeight: 600,
                  padding: "6px 12px",
                  cursor: "pointer",
                }}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <h1 style={{ fontFamily: sans, fontWeight: 700, fontSize: 34, color: C.text, margin: "10px 0 6px", letterSpacing: "-0.01em" }}>
          {t.title}<span style={{ color: C.amber }}>?</span>
        </h1>
        <p style={{ fontFamily: sans, fontSize: 14, color: C.muted, maxWidth: 640, lineHeight: 1.6 }}>{t.tagline}</p>

        <div style={{ display: "flex", margin: "26px 0 0" }}>
          {[
            { id: "stock", label: t.tabStock },
            { id: "watch", label: `${t.tabWatch}${watchlist.length ? ` (${watchlist.length})` : ""}` },
            { id: "scan", label: t.tabScan },
          ].map((tb) => (
            <button
              key={tb.id}
              onClick={() => setTab(tb.id)}
              style={{
                background: "transparent",
                border: "none",
                borderBottom: `2px solid ${tab === tb.id ? C.amber : "transparent"}`,
                color: tab === tb.id ? C.text : C.muted,
                fontFamily: mono,
                fontSize: 13,
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                padding: "10px 16px 12px",
                cursor: "pointer",
              }}
            >
              {tb.label}
            </button>
          ))}
        </div>
        <Hairline />

        {tab === "stock" && (
          <StockAnalyzer t={t} lang={lang} onSaved={handleSaved} externalResult={openedResult} />
        )}
        {tab === "watch" && (
          <Watchlist
            t={t}
            lang={lang}
            list={watchlist}
            setList={setWatchlist}
            history={history}
            setHistory={setHistory}
            onOpen={openFromWatchlist}
          />
        )}
        {tab === "scan" && <MarketScan t={t} lang={lang} />}

        <div style={{ marginTop: 40, paddingTop: 16, borderTop: `1px solid ${C.line}`, fontFamily: mono, fontSize: 11, lineHeight: 1.7, color: C.muted }}>
          {t.disclaimer}
        </div>
      </div>
    </div>
  );
}
