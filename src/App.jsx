import { useState } from "react";

const ZODIAC_SIGNS = [
  { name: "迚｡鄒雁ｺｧ", emoji: "笙・, dates: "3/21縲・/19", en: "Aries" },
  { name: "迚｡迚帛ｺｧ", emoji: "笙・, dates: "4/20縲・/20", en: "Taurus" },
  { name: "蜿悟ｭ仙ｺｧ", emoji: "笙・, dates: "5/21縲・/21", en: "Gemini" },
  { name: "陝ｹ蠎ｧ",   emoji: "笙・, dates: "6/22縲・/22", en: "Cancer" },
  { name: "迯・ｭ仙ｺｧ", emoji: "笙・, dates: "7/23縲・/22", en: "Leo" },
  { name: "荵吝･ｳ蠎ｧ", emoji: "笙・, dates: "8/23縲・/22", en: "Virgo" },
  { name: "螟ｩ遘､蠎ｧ", emoji: "笙・, dates: "9/23縲・0/23", en: "Libra" },
  { name: "陟榊ｺｧ",   emoji: "笙・, dates: "10/24縲・1/22", en: "Scorpio" },
  { name: "蟆・焔蠎ｧ", emoji: "笙・, dates: "11/23縲・2/21", en: "Sagittarius" },
  { name: "螻ｱ鄒雁ｺｧ", emoji: "笙・, dates: "12/22縲・/19", en: "Capricorn" },
  { name: "豌ｴ逑ｶ蠎ｧ", emoji: "笙・, dates: "1/20縲・/18", en: "Aquarius" },
  { name: "鬲壼ｺｧ",   emoji: "笙・, dates: "2/19縲・/20", en: "Pisces" },
];

// Atelier ToYou shop category links
const SHOP_CATEGORIES = {
  dogs: "https://ateliertoyou.base.shop/",
  cats: "https://ateliertoyou.base.shop/",
  goods: "https://ateliertoyou.base.shop/",
  season: "https://ateliertoyou.base.shop/",
  sale: "https://ateliertoyou.base.shop/",
  top: "https://ateliertoyou.base.shop/",
  // size categories
  chihuahua: "https://ateliertoyou.base.shop/",
  toy_poodle: "https://ateliertoyou.base.shop/",
  shiba: "https://ateliertoyou.base.shop/",
  dachshund: "https://ateliertoyou.base.shop/",
  large: "https://ateliertoyou.base.shop/",
  poodle: "https://ateliertoyou.base.shop/",
};

const LUCKY_COLORS = ["繝ｩ繝吶Φ繝繝ｼ", "繝ｭ繝ｼ繧ｺ繧ｴ繝ｼ繝ｫ繝・, "繧ｨ繝｡繝ｩ繝ｫ繝峨げ繝ｪ繝ｼ繝ｳ", "繧ｵ繝ｳ繧ｻ繝・ヨ繧ｪ繝ｬ繝ｳ繧ｸ", "繝溘ャ繝峨リ繧､繝医ヶ繝ｫ繝ｼ", "繧ｷ繝ｫ繝舌・繧ｰ繝ｬ繝ｼ", "繧ｳ繝ｼ繝ｩ繝ｫ繝斐Φ繧ｯ", "繧ｿ繝ｼ繧ｳ繧､繧ｺ", "繝舌・繧ｬ繝ｳ繝・ぅ", "繧ｯ繝ｪ繝ｼ繝", "繝√Ε繧ｳ繝ｼ繝ｫ", "繝ｩ繧､繝医う繧ｨ繝ｭ繝ｼ"];
const LUCKY_NUMBERS = [3, 5, 7, 8, 11, 12, 15, 17, 21, 22, 24, 28];

function StarRating({ score }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= score ? "#f4c430" : "#444", fontSize: "16px" }}>笘・/span>
      ))}
    </div>
  );
}

function ShopButton({ href, label, emoji = "寫・・, accent = false }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 20px",
        borderRadius: "50px",
        background: accent
          ? "linear-gradient(135deg, #7c3aed, #4f46e5)"
          : "rgba(124,58,237,0.15)",
        border: accent ? "none" : "1px solid rgba(192,132,252,0.35)",
        color: "white",
        fontSize: "13px",
        fontWeight: "700",
        textDecoration: "none",
        transition: "all 0.2s",
        boxShadow: accent ? "0 4px 16px rgba(124,58,237,0.4)" : "none",
        letterSpacing: "0.03em",
      }}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </a>
  );
}

export default function App() {
  const now = new Date();
  const currentMonth = now.getMonth() + 1;
  const currentYear = now.getFullYear();

  const [selected, setSelected] = useState(null);
  const [horoscopes, setHoroscopes] = useState({});
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const getLucky = (i, m) => ({
    color: LUCKY_COLORS[(i + m) % LUCKY_COLORS.length],
    number: LUCKY_NUMBERS[(i + m * 3) % LUCKY_NUMBERS.length],
    loveScore:   ((i + m * 7) % 5) + 1,
    workScore:   ((i * 3 + m) % 5) + 1,
    moneyScore:  ((i * 2 + m * 4) % 5) + 1,
    healthScore: ((i * 5 + m * 2) % 5) + 1,
  });

  const buildPrompt = (sign, m, y) => `
縺ゅ↑縺溘・繝壹ャ繝亥頃縺・ｸｫ縺ｧ縺吶・{y}蟷ｴ${m}譛医・${sign.name}・・{sign.en}・峨・鬟ｼ縺・ｸｻ繝ｻ諢帷堪蜷代￠譛磯俣蜊縺・ｒ譖ｸ縺・※縺上□縺輔＞縲・
繝ｫ繝ｼ繝ｫ・・- 迥ｬ縺ｮ遞ｮ鬘槭↓萓九∴縺ｦ莉頑怦縺ｮ驕句兇繧定｡ｨ迴ｾ縺吶ｋ
- 繧ｷ繝ｧ繝・・隱伜ｰ取枚繧定・辟ｶ縺ｫ1縲・邂・園邨・∩霎ｼ繧・域款縺励▽縺代′縺ｾ縺励￥縺ｪ縺擾ｼ・- 繧ｷ繝ｧ繝・・蜷阪・縲窟telier ToYou縲・
莉･荳九・JSON蠖｢蠑上・縺ｿ縺ｧ霑斐＠縺ｦ縺上□縺輔＞・井ｽ吝・縺ｪ繝・く繧ｹ繝医・Markdown縺ｪ縺暦ｼ会ｼ・{
  "dogBreed": "迥ｬ縺ｮ遞ｮ鬘槫錐・井ｾ具ｼ壽浙迥ｬ縲√ざ繝ｼ繝ｫ繝・Φ繝ｬ繝医Μ繝ｼ繝舌・縺ｪ縺ｩ・・,
  "dogEmoji": "迥ｬ縺ｮ邨ｵ譁・ｭ暦ｼ芋汾呆汾ｩｦｮ枢窶昨洶ｺ縺ｪ縺ｩ・・,
  "tagline": "莉頑怦縺ｮ繧ｭ繝｣繝・メ繧ｳ繝斐・・・5譁・ｭ嶺ｻ･蜀・∫堪縺ｮ萓九∴繧貞性繧・・,
  "overall": "邱丞粋驕具ｼ・80蟄礼ｨ句ｺｦ縲ら堪縺ｮ迚ｹ蠕ｴ繧呈ｴｻ縺九＠縺滄°蜍｢縲よ忰蟆ｾ縺ｫ縺輔ｊ縺偵↑縺就telier ToYou縺ｸ縺ｮ隱伜ｰ弱ｒ1譁・・繧後ｋ・・,
  "love": "諱区・驕具ｼ・0蟄礼ｨ句ｺｦ・・,
  "work": "莉穂ｺ矩°・・0蟄礼ｨ句ｺｦ・・,
  "money": "驥鷹°・・0蟄礼ｨ句ｺｦ・・,
  "health": "蛛･蠎ｷ驕具ｼ・0蟄礼ｨ句ｺｦ縲よ・迥ｬ縺ｮ蛛･蠎ｷ繧・恪陬・・菴捺ｸｩ隱ｿ遽縺ｫ繧りｧｦ繧後※繧ゅｈ縺・ｼ・,
  "shopMessage": "繧ｷ繝ｧ繝・・隱伜ｰ弱Γ繝・そ繝ｼ繧ｸ・・0蟄礼ｨ句ｺｦ縲ゆｻ頑怦縺ｮ迥ｬ繧ｿ繧､繝励↓蜷医≧繧ｦ繧ｧ繧｢繧・√Λ繝・く繝ｼ繧ｫ繝ｩ繝ｼ縺ｮ繧｢繧､繝・Β繧但telier ToYou縺ｧ謗｢縺励※縺ｿ縺ｦ縲√→縺・≧閾ｪ辟ｶ縺ｪ荳險・・,
  "shopCategoryHint": "縺翫☆縺吶ａ繧ｫ繝・ざ繝ｪ繝ｼ繧ｭ繝ｼ繝ｯ繝ｼ繝会ｼ・ogs/cats/goods/season/sale 縺ｮ縺・★繧後°1縺､・・,
  "advice": "莉頑怦縺ｮ繝ｯ繝ｳ繝昴う繝ｳ繝医い繝峨ヰ繧､繧ｹ・育堪縺ｮ萓九∴縺ｧ50蟄礼ｨ句ｺｦ・・
}`;

  const fetchHoroscope = async (i) => {
    const sign = ZODIAC_SIGNS[i];
    const lucky = getLucky(i, currentMonth);
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/proxy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-5",
          max_tokens: 1000,
          messages: [{ role: "user", content: buildPrompt(sign, currentMonth, currentYear) }],
        }),
      });
      const data = await res.json();
      const text = data.content.map(b => b.text || "").join("");
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      const shopUrl = SHOP_CATEGORIES[parsed.shopCategoryHint] || SHOP_CATEGORIES.dogs;
      setHoroscopes(prev => ({ ...prev, [i]: { ...parsed, lucky, shopUrl } }));
    } catch {
      setError("蜊縺・・逕滓・縺ｫ螟ｱ謨励＠縺ｾ縺励◆縲ゅｂ縺・ｸ蠎ｦ縺願ｩｦ縺励￥縺縺輔＞縲・);
    } finally {
      setLoading(false);
    }
  };

  const generateAll = async () => {
    setGenerating(true);
    setError(null);
    for (let i = 0; i < ZODIAC_SIGNS.length; i++) {
      const sign = ZODIAC_SIGNS[i];
      const lucky = getLucky(i, currentMonth);
      try {
        const res = await fetch("/api/proxy", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-5",
            max_tokens: 1000,
            messages: [{ role: "user", content: buildPrompt(sign, currentMonth, currentYear) }],
          }),
        });
        const data = await res.json();
        const text = data.content.map(b => b.text || "").join("");
        const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
        const shopUrl = SHOP_CATEGORIES[parsed.shopCategoryHint] || SHOP_CATEGORIES.dogs;
        setHoroscopes(prev => ({ ...prev, [i]: { ...parsed, lucky, shopUrl } }));
      } catch { /* skip */ }
      await new Promise(r => setTimeout(r, 500));
    }
    setGenerating(false);
  };

  const d = selected !== null ? horoscopes[selected] : null;
  const s = selected !== null ? ZODIAC_SIGNS[selected] : null;

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(160deg, #0f0020 0%, #0a0118 45%, #03001a 100%)",
      fontFamily: "'Hiragino Sans', 'Noto Sans JP', sans-serif",
      color: "white",
    }}>
      {/* Header */}
      <div style={{
        textAlign: "center",
        padding: "40px 20px 28px",
        background: "linear-gradient(180deg, rgba(120,40,200,0.25) 0%, transparent 100%)",
        borderBottom: "1px solid rgba(192,132,252,0.12)",
      }}>
        <div style={{ fontSize: "11px", color: "#c084fc", letterSpacing: "0.3em", marginBottom: "10px" }}>
          ATELIER TOYOU ﾃ・MONTHLY HOROSCOPE
        </div>
        <h1 style={{
          fontSize: "clamp(26px, 6vw, 46px)",
          fontWeight: "900",
          background: "linear-gradient(135deg, #e9d5ff 0%, #c084fc 50%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 6px",
        }}>
          誓 繝ｯ繝ｳ蜊縺・        </h1>
        <p style={{ color: "#a78bfa", fontSize: "13px", margin: "0 0 20px" }}>
          {currentYear}蟷ｴ{currentMonth}譛・笨ｦ 縺ゅ↑縺溘→諢帷堪縺ｮ莉頑怦縺ｮ驕句兇
        </p>
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button
            onClick={generateAll}
            disabled={generating}
            style={{
              background: generating ? "rgba(120,40,200,0.3)" : "linear-gradient(135deg, #7c3aed, #4f46e5)",
              border: "none", borderRadius: "50px", padding: "12px 28px",
              color: "white", fontSize: "14px", fontWeight: "700",
              cursor: generating ? "not-allowed" : "pointer",
              boxShadow: generating ? "none" : "0 4px 18px rgba(124,58,237,0.45)",
            }}
          >
            {generating ? "笨ｨ 蜊縺・ｸｭ..." : "笨ｨ 蜈ｨ譏溷ｺｧ繧偵∪縺ｨ繧√※蜊縺・}
          </button>
          <a
            href={SHOP_CATEGORIES.top}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(192,132,252,0.25)",
              borderRadius: "50px", padding: "12px 24px",
              color: "#e9d5ff", fontSize: "13px", fontWeight: "600",
              textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "6px",
            }}
          >
            寫・・Atelier ToYou 繧ｷ繝ｧ繝・・縺ｸ
          </a>
        </div>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 16px 60px" }}>
        {/* Zodiac Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))",
          gap: "10px",
          marginBottom: "32px",
        }}>
          {ZODIAC_SIGNS.map((sign, i) => {
            const data = horoscopes[i];
            const isSel = selected === i;
            return (
              <button
                key={i}
                onClick={() => { setSelected(i); if (!horoscopes[i]) fetchHoroscope(i); }}
                style={{
                  background: isSel
                    ? "linear-gradient(135deg, #1a0533, #2d0a5a)"
                    : "rgba(255,255,255,0.06)",
                  border: isSel ? "2px solid #c084fc" : "2px solid rgba(255,255,255,0.09)",
                  borderRadius: "16px", padding: "14px 10px",
                  cursor: "pointer", display: "flex", flexDirection: "column",
                  alignItems: "center", gap: "5px", color: "white", textAlign: "center",
                  transition: "all 0.2s",
                }}
              >
                <span style={{ fontSize: "26px" }}>{sign.emoji}</span>
                <span style={{ fontSize: "13px", fontWeight: "700" }}>{sign.name}</span>
                <span style={{ fontSize: "9px", color: "#a78bfa", opacity: 0.8 }}>{sign.dates}</span>
                {data && <span style={{ fontSize: "20px", marginTop: "2px" }}>{data.dogEmoji}</span>}
              </button>
            );
          })}
        </div>

        {error && (
          <div style={{
            background: "rgba(239,68,68,0.12)", border: "1px solid rgba(239,68,68,0.35)",
            borderRadius: "12px", padding: "14px", color: "#fca5a5",
            textAlign: "center", marginBottom: "20px", fontSize: "14px",
          }}>{error}</div>
        )}

        {/* Detail Panel */}
        {selected !== null && (
          <div style={{
            background: "linear-gradient(135deg, rgba(26,5,51,0.92) 0%, rgba(12,0,28,0.96) 100%)",
            border: "1px solid rgba(192,132,252,0.2)",
            borderRadius: "24px", padding: "clamp(20px, 5vw, 36px)",
            backdropFilter: "blur(20px)",
          }}>
            {loading ? (
              <div style={{ textAlign: "center", padding: "60px 0" }}>
                <div style={{ fontSize: "44px", marginBottom: "14px", display: "inline-block", animation: "spin 1.5s linear infinite" }}>誓</div>
                <p style={{ color: "#a78bfa", fontSize: "15px" }}>蜊縺・ｸｭ縺ｧ縺吮ｦ</p>
                <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : d ? (
              <>
                {/* Title block */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                  <div style={{ fontSize: "52px", marginBottom: "6px" }}>{d.dogEmoji}</div>
                  <div style={{ fontSize: "12px", color: "#c084fc", letterSpacing: "0.2em", marginBottom: "5px" }}>
                    {s.emoji} {s.name} ﾃ・{s.dates}
                  </div>
                  <h2 style={{
                    fontSize: "clamp(20px, 5vw, 32px)", fontWeight: "900", margin: "0 0 10px",
                    background: "linear-gradient(135deg, #e9d5ff, #c084fc)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    莉頑怦縺ｯ縲鶏d.dogBreed}縲阪ち繧､繝・                  </h2>
                  <div style={{
                    display: "inline-block", padding: "7px 18px", borderRadius: "50px",
                    background: "rgba(124,58,237,0.18)", border: "1px solid rgba(192,132,252,0.3)",
                    color: "#ddd6fe", fontSize: "14px", fontStyle: "italic",
                  }}>
                    {d.tagline}
                  </div>
                </div>

                {/* Score grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "24px" }}>
                  {[
                    { label: "酎 諱区・驕・, score: d.lucky.loveScore },
                    { label: "直 莉穂ｺ矩°", score: d.lucky.workScore },
                    { label: "腸 驥鷹°",   score: d.lucky.moneyScore },
                    { label: "純 蛛･蠎ｷ驕・, score: d.lucky.healthScore },
                  ].map(({ label, score }) => (
                    <div key={label} style={{
                      background: "rgba(255,255,255,0.05)", borderRadius: "12px",
                      padding: "12px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
                    }}>
                      <span style={{ fontSize: "13px", color: "#ddd6fe" }}>{label}</span>
                      <StarRating score={score} />
                    </div>
                  ))}
                </div>

                {/* Overall */}
                <div style={{
                  background: "rgba(124,58,237,0.1)", border: "1px solid rgba(192,132,252,0.18)",
                  borderRadius: "16px", padding: "20px 22px", marginBottom: "18px",
                }}>
                  <div style={{ fontSize: "11px", color: "#c084fc", letterSpacing: "0.15em", marginBottom: "10px" }}>醗 邱丞粋驕・/div>
                  <p style={{ color: "#e9d5ff", lineHeight: "1.9", fontSize: "14px", margin: 0 }}>{d.overall}</p>
                </div>

                {/* Detail cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "10px", marginBottom: "18px" }}>
                  {[
                    { icon: "酎", label: "諱区・驕・, text: d.love },
                    { icon: "直", label: "莉穂ｺ矩°", text: d.work },
                    { icon: "腸", label: "驥鷹°",   text: d.money },
                    { icon: "純", label: "蛛･蠎ｷ驕・, text: d.health },
                  ].map(({ icon, label, text }) => (
                    <div key={label} style={{
                      background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "14px", padding: "16px",
                    }}>
                      <div style={{ fontSize: "11px", color: "#a78bfa", marginBottom: "7px" }}>{icon} {label}</div>
                      <p style={{ color: "#ddd6fe", fontSize: "13px", lineHeight: "1.8", margin: 0 }}>{text}</p>
                    </div>
                  ))}
                </div>

                {/* Lucky info */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "10px", marginBottom: "20px" }}>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)",
                    borderRadius: "12px", padding: "14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "5px" }}>耳</div>
                    <div style={{ fontSize: "10px", color: "#a78bfa", marginBottom: "4px" }}>繝ｩ繝・く繝ｼ繧ｫ繝ｩ繝ｼ</div>
                    <div style={{ fontSize: "14px", color: "#e9d5ff", fontWeight: "700" }}>{d.lucky.color}</div>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)",
                    borderRadius: "12px", padding: "14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "5px" }}>箸</div>
                    <div style={{ fontSize: "10px", color: "#a78bfa", marginBottom: "4px" }}>繝ｩ繝・く繝ｼ繝翫Φ繝舌・</div>
                    <div style={{ fontSize: "14px", color: "#e9d5ff", fontWeight: "700" }}>{d.lucky.number}</div>
                  </div>
                </div>

                {/* Advice */}
                <div style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)",
                  borderRadius: "14px", padding: "16px 20px",
                  display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px",
                }}>
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>誓</span>
                  <div>
                    <div style={{ fontSize: "10px", color: "#c084fc", letterSpacing: "0.12em", marginBottom: "6px" }}>莉頑怦縺ｮ繧｢繝峨ヰ繧､繧ｹ</div>
                    <p style={{ color: "#ddd6fe", fontSize: "13px", margin: 0, lineHeight: "1.8" }}>{d.advice}</p>
                  </div>
                </div>

                {/* 笘・Shop CTA Block */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(124,58,237,0.25))",
                  border: "1px solid rgba(192,132,252,0.35)",
                  borderRadius: "18px", padding: "22px 24px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>枢笨ｨ</div>
                  <p style={{ color: "#e9d5ff", fontSize: "14px", lineHeight: "1.85", margin: "0 0 16px" }}>
                    {d.shopMessage}
                  </p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                    <ShopButton href={d.shopUrl} label="縺翫☆縺吶ａ繧｢繧､繝・Β繧定ｦ九ｋ" emoji="送" accent={true} />
                    <ShopButton href={SHOP_CATEGORIES.sale} label="繧ｻ繝ｼ繝ｫ繧偵メ繧ｧ繝・け" emoji="捷・・ />
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "11px", color: "#a78bfa", opacity: 0.7 }}>
                    Atelier ToYou 窶・繝壹ャ繝域恪繝ｻ迥ｬ譛榊ｰる摩蠎・                  </div>
                </div>

                {/* LINE CTA */}
                <div style={{
                  marginTop: '16px',
                  background: 'linear-gradient(135deg, rgba(6,199,85,0.15), rgba(6,199,85,0.08))',
                  border: '1px solid rgba(6,199,85,0.35)',
                  borderRadius: '18px',
                  padding: '22px 24px',
                  textAlign: 'center',
                }}>
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>誓陶</div>
                  <p style={{ color: '#e9d5ff', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>
                    豈取怦縺ｮ繧上ｓ縺灘頃縺・ｒ蜿励￠蜿悶ｋ
                  </p>
                  <p style={{ color: '#a78bfa', fontSize: '13px', margin: '0 0 16px', lineHeight: '1.7' }}>
                    LINE縺ｫ逋ｻ骭ｲ縺吶ｋ縺ｨ豈取怦1譌･縺ｫ<br />譛譁ｰ縺ｮ繧上ｓ縺灘頃縺・ｒ縺雁ｱ翫￠縺励∪縺咀沍・                  </p>
                  <a
                    href="https://lin.ee/9gocHWN"
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '14px 32px',
                      borderRadius: '50px',
                      background: 'linear-gradient(135deg, #06c755, #00b348)',
                      border: 'none',
                      color: 'white',
                      fontSize: '15px',
                      fontWeight: '800',
                      textDecoration: 'none',
                      boxShadow: '0 4px 18px rgba(6,199,85,0.45)',
                      letterSpacing: '0.05em',
                    }}
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                      <path d="M12 2C6.48 2 2 6.02 2 11c0 3.07 1.6 5.8 4.1 7.55V22l3.6-2c.74.2 1.5.31 2.3.31 5.52 0 10-4.02 10-9S17.52 2 12 2z"/>
                    </svg>
                    LINE蜿九□縺｡霑ｽ蜉・育┌譁呻ｼ・                  </a>
                </div>
              </>
            ) : null}
          </div>
        )}

        {selected === null && !generating && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#7c3aed", opacity: 0.55 }}>
            <div style={{ fontSize: "44px", marginBottom: "10px" }}>検</div>
            <p style={{ fontSize: "14px" }}>譏溷ｺｧ繧帝∈繧薙〒莉頑怦縺ｮ驕句兇繧定ｦ九※縺ｿ縺ｾ縺励ｇ縺・/p>
          </div>
        )}
      </div>
    </div>
  );
}
