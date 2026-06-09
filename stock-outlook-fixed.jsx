import { useEffect, useMemo, useState } from "react";

// Stock Outlook Desk
// Same idea as the original: stock analysis + watchlist + market scan + EN/RU UI.
// Important: real web/AI research must be done through your backend, not directly from the browser.
// Create these endpoints in your app/server:
//   POST /api/stock/analyze  body: { query, lang }
//   POST /api/stock/scan     body: { lang }
// Both should return JSON in the shapes used below. Demo fallback is included for development.

const C = {
  ink: "#08111f",
  bg: "#0b1424",
  panel: "#101c31",
  panel2: "#15243c",
  line: "#263852",
  amber: "#ffb02e",
  up: "#3dd68c",
  down: "#f2555a",
  text: "#e9eff8",
  muted: "#8da2c0",
  soft: "rgba(255,255,255,.06)",
};

const mono = "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace";
const sans = "'Space Grotesk', Inter, system-ui, sans-serif";

const T = {
  en: {
    desk: "Market Outlook Desk",
    title: "Up or down",
    tagline:
      "AI-assisted stock research with news, sentiment, technical context, catalysts, a directional read, and self-tracked accuracy.",
    analyzeTab: "Analyze",
    watchTab: "Watchlist",
    scanTab: "Market scan",
    placeholder: "Ticker or company name — e.g. NVDA, Tesla",
    analyze: "Analyze",
    searching: "Searching…",
    demo: "Demo mode",
    demoText:
      "Connect /api/stock/analyze and /api/stock/scan to real web research before production.",
    saved: "Saved to watchlist",
    open: "Open",
    remove: "Remove",
    recheck: "Recheck",
    recheckAll: "Recheck all",
    emptyWatch:
      "No stocks yet. Analyze any ticker and it will be saved here automatically.",
    accuracy: "Tool track record",
    noAccuracy:
      "No verified predictions yet. Recheck saved stocks later to compare the old call with the new price.",
    correct: "correct",
    verified: "verified calls",
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
    runScan: "Run scan",
    scanHint: "Short-term candidates · long-term growth · downside risks",
    shortTitle: "Top 10 · Short-term",
    longTitle: "Top 10 · Long-term growth",
    risers: "Potential risers",
    fallers: "Likely decliners",
    found: "found",
    errAnalyze: "Analysis failed. Try a ticker symbol or check your backend endpoint.",
    errScan: "Market scan failed. Check your backend endpoint.",
    disclaimer:
      "Not financial advice. AI outputs can be wrong, delayed, or incomplete. Use this only as a research starting point.",
  },
  ru: {
    desk: "Биржевой аналитический стол",
    title: "Вверх или вниз",
    tagline:
      "AI-анализ акций: новости, настроения, техническая картина, катализаторы, прогноз направления и отслеживание точности.",
    analyzeTab: "Анализ",
    watchTab: "Мои акции",
    scanTab: "Сканер рынка",
    placeholder: "Тикер или название — напр. NVDA, Tesla",
    analyze: "Анализ",
    searching: "Поиск…",
    demo: "Демо-режим",
    demoText:
      "Перед запуском подключите /api/stock/analyze и /api/stock/scan к реальному веб-анализу.",
    saved: "Сохранено в список",
    open: "Открыть",
    remove: "Удалить",
    recheck: "Обновить",
    recheckAll: "Обновить все",
    emptyWatch: "Пока пусто. Проанализируйте тикер — он сохранится автоматически.",
    accuracy: "Точность инструмента",
    noAccuracy:
      "Пока нет проверенных прогнозов. Обновите сохранённые акции позже, чтобы сравнить старый прогноз с новой ценой.",
    correct: "верных",
    verified: "проверенных прогнозов",
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
    runScan: "Запустить сканер",
    scanHint: "Краткосрок · долгосрочный рост · риски падения",
    shortTitle: "Топ-10 · Краткосрок",
    longTitle: "Топ-10 · Долгосрочный рост",
    risers: "Кандидаты на рост",
    fallers: "Вероятное падение",
    found: "найдено",
    errAnalyze: "Анализ не удался. Попробуйте тикер или проверьте backend endpoint.",
    errScan: "Сканер не удался. Проверьте backend endpoint.",
    disclaimer:
      "Не является финансовым советом. AI может ошибаться, запаздывать или давать неполную информацию. Используйте только как старт для исследования.",
  },
};

const WKEY = "stock-outlook-watchlist-v2";
const HKEY = "stock-outlook-history-v2";

function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function safeSave(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors in private/incognito modes
  }
}

function normalizeStock(raw, query = "") {
  const ticker = String(raw?.ticker || query || "DEMO").toUpperCase().slice(0, 12);
  return {
    ticker,
    name: raw?.name || ticker,
    price: raw?.price || (typeof raw?.priceNum === "number" ? `$${raw.priceNum.toFixed(2)}` : null),
    priceNum: typeof raw?.priceNum === "number" ? raw.priceNum : null,
    verdict: ["UP", "DOWN", "NEUTRAL"].includes(raw?.verdict) ? raw.verdict : "NEUTRAL",
    signal: ["BUY", "SELL", "HOLD"].includes(raw?.signal) ? raw.signal : "HOLD",
    confidence: Math.max(0, Math.min(100, Number(raw?.confidence) || 50)),
    risk: ["LOW", "MEDIUM", "HIGH"].includes(raw?.risk) ? raw.risk : "MEDIUM",
    summary: raw?.summary || "Research summary is unavailable.",
    social: raw?.social || "Social sentiment is mixed or unavailable.",
    socialMood: ["POSITIVE", "MIXED", "NEGATIVE"].includes(raw?.socialMood) ? raw.socialMood : "MIXED",
    technicals: raw?.technicals || "Technical context is unavailable.",
    catalyst: raw?.catalyst || null,
    advice: raw?.advice || "Wait for confirmation and manage risk.",
    bullish: Array.isArray(raw?.bullish) ? raw.bullish.slice(0, 3) : [],
    bearish: Array.isArray(raw?.bearish) ? raw.bearish.slice(0, 3) : [],
    events: Array.isArray(raw?.events) ? raw.events.slice(0, 3) : [],
    checkedAt: raw?.checkedAt || new Date().toISOString(),
    isDemo: Boolean(raw?.isDemo),
  };
}

function demoStock(query, lang) {
  const q = String(query || "NVDA").trim().toUpperCase();
  const priceNum = Math.round((80 + Math.random() * 220) * 100) / 100;
  const verdict = Math.random() > 0.58 ? "UP" : Math.random() > 0.5 ? "DOWN" : "NEUTRAL";
  return normalizeStock(
    {
      ticker: q.replace(/[^A-Z.]/g, "").slice(0, 5) || "NVDA",
      name: lang === "ru" ? "Демо-компания" : "Demo Company",
      price: `$${priceNum}`,
      priceNum,
      verdict,
      signal: verdict === "UP" ? "BUY" : verdict === "DOWN" ? "SELL" : "HOLD",
      confidence: 54 + Math.floor(Math.random() * 28),
      risk: verdict === "NEUTRAL" ? "MEDIUM" : "HIGH",
      summary:
        lang === "ru"
          ? "Это демонстрационный анализ. Подключите backend endpoint для реальных данных, новостей и веб-поиска."
          : "This is a demo analysis. Connect your backend endpoint for live data, news, and web research.",
      social: lang === "ru" ? "Настроения смешанные, данные демо." : "Sentiment is mixed in demo data.",
      socialMood: "MIXED",
      technicals: lang === "ru" ? "RSI/MA уровни требуют реального источника данных." : "RSI/MA levels require a real data source.",
      catalyst: lang === "ru" ? "Следующий отчёт / новости компании" : "Next earnings / company news",
      advice:
        lang === "ru"
          ? "Не используйте демо как сигнал. Дождитесь реальных котировок и подтверждения тренда."
          : "Do not trade demo data. Wait for real quotes and trend confirmation.",
      bullish: lang === "ru" ? ["Сильный бренд", "Возможный импульс", "Интерес рынка"] : ["Strong brand", "Possible momentum", "Market interest"],
      bearish: lang === "ru" ? ["Высокая волатильность", "Риск новостей", "Демо-данные"] : ["High volatility", "News risk", "Demo data"],
      events: [new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US")],
      isDemo: true,
    },
    q
  );
}

async function postJSON(url, body) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`${url} failed: ${res.status}`);
  return res.json();
}

async function analyzeStock(query, lang) {
  try {
    const data = await postJSON("/api/stock/analyze", { query, lang });
    return normalizeStock(data, query);
  } catch {
    return demoStock(query, lang);
  }
}

async function runMarketScan(lang) {
  try {
    return await postJSON("/api/stock/scan", { lang });
  } catch {
    const reason = lang === "ru" ? "демо-причина" : "demo reason";
    return {
      isDemo: true,
      short: ["NVDA", "AMD", "TSLA", "PLTR", "META", "MSFT", "AVGO", "CRWD", "COIN", "ARM"].map((t) => ({ t, r: reason })),
      long: ["MSFT", "GOOGL", "AMZN", "NVDA", "ASML", "COST", "V", "MA", "LLY", "TSM"].map((t) => ({ t, r: reason })),
      risers: ["NVDA", "AVGO", "AMD", "CRWD", "PLTR", "SHOP", "UBER", "NET", "TSM", "ARM"].map((t) => ({ t, r: reason })),
      fallers: ["INTC", "BA", "SNAP", "PARA", "WBA", "F", "NIO", "RIVN", "LCID", "SAVE"].map((t) => ({ t, r: reason })),
    };
  }
}

function scorePrediction(oldEntry, fresh) {
  if (!oldEntry?.priceNum || !fresh?.priceNum || oldEntry.priceNum <= 0) return null;
  const deltaPct = ((fresh.priceNum - oldEntry.priceNum) / oldEntry.priceNum) * 100;
  if (Math.abs(deltaPct) < 0.05) return null;
  const correct = oldEntry.verdict === "UP" ? deltaPct > 0 : oldEntry.verdict === "DOWN" ? deltaPct < 0 : Math.abs(deltaPct) < 1.5;
  return {
    ticker: oldEntry.ticker,
    from: oldEntry.checkedAt,
    to: fresh.checkedAt,
    verdict: oldEntry.verdict,
    deltaPct: Math.round(deltaPct * 100) / 100,
    correct,
  };
}

const buttonBase = {
  border: "none",
  borderRadius: 10,
  fontFamily: sans,
  fontWeight: 700,
  cursor: "pointer",
};

function Spinner({ label }) {
  return <div style={{ fontFamily: mono, color: C.amber, padding: "24px 0" }}>▮▮▮ {label}</div>;
}

function Badge({ children, color = C.amber, filled = false }) {
  return (
    <span
      style={{
        fontFamily: mono,
        fontSize: 11,
        letterSpacing: ".08em",
        border: `1px solid ${color}`,
        background: filled ? color : "transparent",
        color: filled ? C.ink : color,
        borderRadius: 999,
        padding: "5px 9px",
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

function SignalBadge({ signal, t }) {
  const color = signal === "BUY" ? C.up : signal === "SELL" ? C.down : C.amber;
  return <Badge color={color} filled>{t.signal[signal] || signal}</Badge>;
}

function ResultCard({ result, t }) {
  const verdictColor = result.verdict === "UP" ? C.up : result.verdict === "DOWN" ? C.down : C.muted;
  const moodColor = result.socialMood === "POSITIVE" ? C.up : result.socialMood === "NEGATIVE" ? C.down : C.amber;

  return (
    <div style={{ marginTop: 22, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 18, padding: 22 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
        <div>
          <div style={{ fontFamily: mono, color: C.amber, fontSize: 28 }}>{result.ticker}</div>
          <div style={{ fontFamily: sans, color: C.muted }}>{result.name}</div>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          {result.isDemo && <Badge>{t.demo}</Badge>}
          {result.price && <Badge color={C.text}>{result.price}</Badge>}
          <Badge color={result.risk === "HIGH" ? C.down : result.risk === "LOW" ? C.up : C.amber}>{t.risk[result.risk]}</Badge>
          <SignalBadge signal={result.signal} t={t} />
        </div>
      </div>

      <div style={{ marginTop: 18, display: "flex", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
        <span style={{ fontFamily: mono, fontSize: 38, color: verdictColor }}>{result.verdict === "UP" ? "▲" : result.verdict === "DOWN" ? "▼" : "◆"}</span>
        <span style={{ fontFamily: sans, fontSize: 25, color: verdictColor, fontWeight: 800 }}>{t.verdict[result.verdict]}</span>
        <span style={{ fontFamily: mono, color: C.text }}>{result.confidence}%</span>
      </div>

      <p style={{ fontFamily: sans, color: C.text, lineHeight: 1.65 }}>{result.summary}</p>

      <Info label={t.technicals} color={C.muted}>{result.technicals}</Info>
      <Info label={t.social} color={moodColor}>{result.social}</Info>
      {result.catalyst && <Info label={t.catalyst} color={C.amber}>{result.catalyst}</Info>}
      <Info label={t.advice} color={C.amber}>{result.advice}</Info>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 16, marginTop: 16 }}>
        <List title={t.bullish} items={result.bullish} color={C.up} />
        <List title={t.bearish} items={result.bearish} color={C.down} />
      </div>

      {!!result.events.length && <List title={t.events} items={result.events} color={C.amber} />}
    </div>
  );
}

function Info({ label, color, children }) {
  if (!children) return null;
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 14, padding: 14, marginTop: 12 }}>
      <div style={{ fontFamily: mono, color, fontSize: 11, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 6 }}>{label}</div>
      <div style={{ fontFamily: sans, color: C.text, lineHeight: 1.55 }}>{children}</div>
    </div>
  );
}

function List({ title, items, color }) {
  if (!items?.length) return null;
  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ fontFamily: mono, color, fontSize: 11, letterSpacing: ".13em", textTransform: "uppercase", marginBottom: 7 }}>{title}</div>
      {items.map((item, idx) => (
        <div key={`${item}-${idx}`} style={{ fontFamily: sans, color: C.text, borderTop: `1px solid ${C.line}`, padding: "8px 0" }}>
          <span style={{ color, marginRight: 8 }}>•</span>{item}
        </div>
      ))}
    </div>
  );
}

function Analyzer({ t, lang, onSave, opened }) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (opened) {
      setResult(opened);
      setSaved(false);
      setError(null);
    }
  }, [opened]);

  async function submit() {
    if (!query.trim() || loading) return;
    setLoading(true);
    setError(null);
    setSaved(false);
    try {
      const r = await analyzeStock(query.trim(), lang);
      setResult(r);
      onSave(r);
      setSaved(true);
    } catch {
      setError(t.errAnalyze);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", gap: 10, marginTop: 20, flexWrap: "wrap" }}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder={t.placeholder}
          style={{
            flex: "1 1 280px",
            background: C.panel,
            border: `1px solid ${C.line}`,
            borderRadius: 12,
            color: C.text,
            padding: "14px 16px",
            fontFamily: mono,
            outline: "none",
          }}
        />
        <button onClick={submit} disabled={loading} style={{ ...buttonBase, background: C.amber, color: C.ink, padding: "0 24px", minHeight: 48 }}>
          {loading ? t.searching : t.analyze}
        </button>
      </div>
      {loading && <Spinner label={t.searching} />}
      {error && <div style={{ color: C.down, fontFamily: sans, marginTop: 14 }}>{error}</div>}
      {saved && <div style={{ color: C.up, fontFamily: mono, fontSize: 12, marginTop: 12 }}>✓ {t.saved}</div>}
      {result?.isDemo && <Info label={t.demo} color={C.amber}>{t.demoText}</Info>}
      {result && <ResultCard result={result} t={t} />}
    </>
  );
}

function Scoreboard({ history, t }) {
  const hits = history.filter((x) => x.correct).length;
  const pct = history.length ? Math.round((hits / history.length) * 100) : 0;
  return (
    <div style={{ background: C.panel2, border: `1px solid ${C.line}`, borderRadius: 16, padding: 16, marginTop: 20 }}>
      <div style={{ fontFamily: mono, color: C.amber, letterSpacing: ".13em", textTransform: "uppercase", fontSize: 11 }}>{t.accuracy}</div>
      {!history.length ? (
        <p style={{ fontFamily: sans, color: C.muted, marginBottom: 0 }}>{t.noAccuracy}</p>
      ) : (
        <div style={{ display: "flex", gap: 12, alignItems: "baseline", flexWrap: "wrap", marginTop: 8 }}>
          <strong style={{ fontFamily: mono, color: pct >= 60 ? C.up : pct >= 45 ? C.amber : C.down, fontSize: 30 }}>{pct}%</strong>
          <span style={{ fontFamily: sans, color: C.muted }}>{hits} {t.correct} / {history.length} {t.verified}</span>
        </div>
      )}
    </div>
  );
}

function Watchlist({ t, lang, list, setList, history, setHistory, onOpen }) {
  const [busy, setBusy] = useState({});
  const [allBusy, setAllBusy] = useState(false);

  async function recheckOne(ticker) {
    setBusy((b) => ({ ...b, [ticker]: true }));
    try {
      const old = list.find((x) => x.ticker === ticker);
      const fresh = await analyzeStock(ticker, lang);
      const score = scorePrediction(old, fresh);
      const withMeta = { ...fresh, prevSignal: old?.signal, lastDelta: score?.deltaPct };
      if (score) setHistory((h) => [...h, score]);
      setList((prev) => prev.map((x) => (x.ticker === ticker ? withMeta : x)));
    } finally {
      setBusy((b) => ({ ...b, [ticker]: false }));
    }
  }

  async function recheckAll() {
    setAllBusy(true);
    for (const item of list) await recheckOne(item.ticker);
    setAllBusy(false);
  }

  function remove(ticker) {
    setList((prev) => prev.filter((x) => x.ticker !== ticker));
  }

  return (
    <>
      <Scoreboard history={history} t={t} />
      {!list.length ? (
        <p style={{ fontFamily: sans, color: C.muted }}>{t.emptyWatch}</p>
      ) : (
        <>
          <button onClick={recheckAll} disabled={allBusy} style={{ ...buttonBase, marginTop: 16, background: C.amber, color: C.ink, padding: "11px 18px" }}>
            ↻ {allBusy ? t.searching : t.recheckAll}
          </button>
          <div style={{ marginTop: 16, background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
            {list.map((s, idx) => {
              const color = s.verdict === "UP" ? C.up : s.verdict === "DOWN" ? C.down : C.muted;
              return (
                <div key={s.ticker} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", padding: 14, borderTop: idx ? `1px solid ${C.line}` : "none" }}>
                  <strong style={{ fontFamily: mono, color: C.amber, minWidth: 60 }}>{s.ticker}</strong>
                  <span style={{ color, fontFamily: mono }}>{s.verdict === "UP" ? "▲" : s.verdict === "DOWN" ? "▼" : "◆"}</span>
                  <SignalBadge signal={s.signal} t={t} />
                  <span style={{ fontFamily: mono, color: C.muted, fontSize: 12 }}>{s.confidence}%</span>
                  {typeof s.lastDelta === "number" && <span style={{ fontFamily: mono, color: s.lastDelta >= 0 ? C.up : C.down, fontSize: 12 }}>{s.lastDelta >= 0 ? "+" : ""}{s.lastDelta}%</span>}
                  <span style={{ flex: 1 }} />
                  <Ghost onClick={() => onOpen(s)}>{t.open}</Ghost>
                  <Ghost onClick={() => recheckOne(s.ticker)} disabled={busy[s.ticker]}>{busy[s.ticker] ? "…" : t.recheck}</Ghost>
                  <Ghost onClick={() => remove(s.ticker)} danger>{t.remove}</Ghost>
                </div>
              );
            })}
          </div>
        </>
      )}
    </>
  );
}

function Ghost({ children, danger, ...props }) {
  return (
    <button {...props} style={{ background: "transparent", border: `1px solid ${C.line}`, color: danger ? C.down : C.muted, borderRadius: 9, padding: "7px 10px", fontFamily: mono, cursor: "pointer" }}>
      {children}
    </button>
  );
}

function MarketScan({ t, lang }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  async function scan() {
    setLoading(true);
    setError(null);
    try {
      setData(await runMarketScan(lang));
    } catch {
      setError(t.errScan);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 20, flexWrap: "wrap" }}>
        <button onClick={scan} disabled={loading} style={{ ...buttonBase, background: C.amber, color: C.ink, padding: "13px 24px" }}>
          {loading ? t.searching : t.runScan}
        </button>
        <span style={{ fontFamily: mono, color: C.muted, fontSize: 12 }}>{t.scanHint}</span>
      </div>
      {loading && <Spinner label={t.searching} />}
      {error && <div style={{ color: C.down, marginTop: 14 }}>{error}</div>}
      {data?.isDemo && <Info label={t.demo} color={C.amber}>{t.demoText}</Info>}
      {data && (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 18, marginTop: 20 }}>
          <ScanTable title={t.shortTitle} items={data.short} color={C.amber} t={t} />
          <ScanTable title={t.longTitle} items={data.long} color={C.up} t={t} />
          <ScanTable title={t.risers} items={data.risers} color={C.up} t={t} />
          <ScanTable title={t.fallers} items={data.fallers} color={C.down} t={t} />
        </div>
      )}
    </>
  );
}

function ScanTable({ title, items = [], color, t }) {
  return (
    <div style={{ background: C.panel, border: `1px solid ${C.line}`, borderRadius: 16, overflow: "hidden" }}>
      <div style={{ padding: 14, borderBottom: `1px solid ${C.line}` }}>
        <strong style={{ fontFamily: sans, color: C.text }}>{title}</strong>
        <span style={{ fontFamily: mono, color: C.muted, fontSize: 12, marginLeft: 8 }}>{items.length} {t.found}</span>
      </div>
      {items.map((x, idx) => (
        <div key={`${x.t}-${idx}`} style={{ display: "flex", gap: 12, padding: "9px 14px", borderTop: idx ? `1px solid ${C.line}` : "none" }}>
          <span style={{ fontFamily: mono, color: C.line, width: 24 }}>{String(idx + 1).padStart(2, "0")}</span>
          <strong style={{ fontFamily: mono, color, width: 60 }}>{x.t}</strong>
          <span style={{ fontFamily: sans, color: C.muted }}>{x.r}</span>
        </div>
      ))}
    </div>
  );
}

export default function App() {
  const [lang, setLang] = useState("en");
  const [tab, setTab] = useState("analyze");
  const [watchlist, setWatchlist] = useState(() => safeLoad(WKEY, []));
  const [history, setHistory] = useState(() => safeLoad(HKEY, []));
  const [opened, setOpened] = useState(null);
  const t = T[lang];

  useEffect(() => safeSave(WKEY, watchlist), [watchlist]);
  useEffect(() => safeSave(HKEY, history), [history]);

  const today = useMemo(
    () => new Date().toLocaleDateString(lang === "ru" ? "ru-RU" : "en-US", { year: "numeric", month: "long", day: "numeric" }),
    [lang]
  );

  function saveResult(r) {
    setWatchlist((prev) => {
      const old = prev.find((x) => x.ticker === r.ticker);
      return [{ ...r, prevSignal: old?.signal }, ...prev.filter((x) => x.ticker !== r.ticker)];
    });
  }

  const tabs = [
    ["analyze", t.analyzeTab],
    ["watch", `${t.watchTab}${watchlist.length ? ` (${watchlist.length})` : ""}`],
    ["scan", t.scanTab],
  ];

  return (
    <main style={{ minHeight: "100vh", background: `radial-gradient(circle at top left, ${C.soft}, transparent 35%), ${C.bg}`, color: C.text, paddingBottom: 60 }}>
      <link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=Space+Grotesk:wght@400;500;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: 980, margin: "0 auto", padding: "34px 18px" }}>
        <header style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div style={{ fontFamily: mono, color: C.amber, fontSize: 12, letterSpacing: ".14em", textTransform: "uppercase" }}>{t.desk} · {today}</div>
          <div style={{ display: "flex", border: `1px solid ${C.line}`, borderRadius: 999, overflow: "hidden" }}>
            {[
              ["en", "EN"],
              ["ru", "RU"],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setLang(id)} style={{ border: "none", background: lang === id ? C.amber : "transparent", color: lang === id ? C.ink : C.muted, fontFamily: mono, fontWeight: 700, padding: "7px 12px", cursor: "pointer" }}>
                {label}
              </button>
            ))}
          </div>
        </header>

        <h1 style={{ fontFamily: sans, fontSize: "clamp(34px,7vw,72px)", lineHeight: .95, letterSpacing: "-.04em", margin: "28px 0 12px" }}>{t.title}<span style={{ color: C.amber }}>?</span></h1>
        <p style={{ fontFamily: sans, color: C.muted, maxWidth: 720, lineHeight: 1.65 }}>{t.tagline}</p>

        <nav style={{ display: "flex", gap: 8, borderBottom: `1px solid ${C.line}`, marginTop: 28, overflowX: "auto" }}>
          {tabs.map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)} style={{ background: "transparent", color: tab === id ? C.text : C.muted, border: "none", borderBottom: `2px solid ${tab === id ? C.amber : "transparent"}`, fontFamily: mono, letterSpacing: ".08em", textTransform: "uppercase", padding: "12px 14px", cursor: "pointer" }}>
              {label}
            </button>
          ))}
        </nav>

        {tab === "analyze" && <Analyzer t={t} lang={lang} onSave={saveResult} opened={opened} />}
        {tab === "watch" && (
          <Watchlist
            t={t}
            lang={lang}
            list={watchlist}
            setList={setWatchlist}
            history={history}
            setHistory={setHistory}
            onOpen={(s) => {
              setOpened({ ...s, openedAt: Date.now() });
              setTab("analyze");
            }}
          />
        )}
        {tab === "scan" && <MarketScan t={t} lang={lang} />}

        <footer style={{ marginTop: 38, borderTop: `1px solid ${C.line}`, paddingTop: 16, fontFamily: mono, color: C.muted, fontSize: 11, lineHeight: 1.7 }}>{t.disclaimer}</footer>
      </div>
    </main>
  );
}
