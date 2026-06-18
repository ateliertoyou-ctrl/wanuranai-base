import { useState } from "react";

const ZODIAC_SIGNS = [
  { name: "牡羊座", emoji: "♁E, dates: "3/21、E/19", en: "Aries" },
  { name: "牡牛座", emoji: "♁E, dates: "4/20、E/20", en: "Taurus" },
  { name: "双子座", emoji: "♁E, dates: "5/21、E/21", en: "Gemini" },
  { name: "蟹座",   emoji: "♁E, dates: "6/22、E/22", en: "Cancer" },
  { name: "獁E��座", emoji: "♁E, dates: "7/23、E/22", en: "Leo" },
  { name: "乙女座", emoji: "♁E, dates: "8/23、E/22", en: "Virgo" },
  { name: "天秤座", emoji: "♁E, dates: "9/23、E0/23", en: "Libra" },
  { name: "蠍座",   emoji: "♁E, dates: "10/24、E1/22", en: "Scorpio" },
  { name: "封E��座", emoji: "♁E, dates: "11/23、E2/21", en: "Sagittarius" },
  { name: "山羊座", emoji: "♁E, dates: "12/22、E/19", en: "Capricorn" },
  { name: "水瓶座", emoji: "♁E, dates: "1/20、E/18", en: "Aquarius" },
  { name: "魚座",   emoji: "♁E, dates: "2/19、E/20", en: "Pisces" },
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

const LUCKY_COLORS = ["ラベンダー", "ローズゴールチE, "エメラルドグリーン", "サンセチE��オレンジ", "ミッドナイトブルー", "シルバ�Eグレー", "コーラルピンク", "ターコイズ", "バ�EガンチE��", "クリーム", "チャコール", "ライトイエロー"];
const LUCKY_NUMBERS = [3, 5, 7, 8, 11, 12, 15, 17, 21, 22, 24, 28];

function StarRating({ score }) {
  return (
    <div style={{ display: "flex", gap: "3px" }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= score ? "#f4c430" : "#444", fontSize: "16px" }}>☁E/span>
      ))}
    </div>
  );
}

function ShopButton({ href, label, emoji = "🛍�E�E, accent = false }) {
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
あなた�Eペット占ぁE��です、E{y}年${m}月�E${sign.name}�E�E{sign.en}�E��E飼ぁE��・愛犬向け月間占ぁE��書ぁE��ください、E
ルール�E�E- 犬の種類に例えて今月の運勢を表現する
- ショチE�E誘導文を�E然に1、E箁E��絁E��込む�E�押しつけがましくなく！E- ショチE�E名�E「Atelier ToYou、E
以下�EJSON形式�Eみで返してください�E�余�EなチE��スト�EMarkdownなし）！E{
  "dogBreed": "犬の種類名�E�例：柴犬、ゴールチE��レトリーバ�Eなど�E�E,
  "dogEmoji": "犬の絵斁E��（🐕🐩🦮🐕‍🦺など�E�E,
  "tagline": "今月のキャチE��コピ�E�E�E5斁E��以冁E��犬の例えを含む�E�E,
  "overall": "総合運！E80字程度。犬の特徴を活かした運勢。末尾にさりげなくAtelier ToYouへの誘導を1斁E�Eれる�E�E,
  "love": "恋�E運！E0字程度�E�E,
  "work": "仕事運�E�E0字程度�E�E,
  "money": "金運�E�E0字程度�E�E,
  "health": "健康運！E0字程度。�E犬の健康めE��裁E�E体温調節にも触れてもよぁE��E,
  "shopMessage": "ショチE�E誘導メチE��ージ�E�E0字程度。今月の犬タイプに合うウェアめE��ラチE��ーカラーのアイチE��をAtelier ToYouで探してみて、とぁE��自然な一言�E�E,
  "shopCategoryHint": "おすすめカチE��リーキーワード！Eogs/cats/goods/season/sale のぁE��れか1つ�E�E,
  "advice": "今月のワンポイントアドバイス�E�犬の例えで50字程度�E�E
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
      setError("占ぁE�E生�Eに失敗しました。もぁE��度お試しください、E);
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
          ATELIER TOYOU ÁEMONTHLY HOROSCOPE
        </div>
        <h1 style={{
          fontSize: "clamp(26px, 6vw, 46px)",
          fontWeight: "900",
          background: "linear-gradient(135deg, #e9d5ff 0%, #c084fc 50%, #818cf8 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          margin: "0 0 6px",
        }}>
          🐾 ワン占ぁE        </h1>
        <p style={{ color: "#a78bfa", fontSize: "13px", margin: "0 0 20px" }}>
          {currentYear}年{currentMonth}朁E✦ あなたと愛犬の今月の運勢
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
            {generating ? "✨ 占ぁE��..." : "✨ 全星座をまとめて占ぁE}
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
            🛍�E�EAtelier ToYou ショチE�Eへ
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
                <div style={{ fontSize: "44px", marginBottom: "14px", display: "inline-block", animation: "spin 1.5s linear infinite" }}>🐾</div>
                <p style={{ color: "#a78bfa", fontSize: "15px" }}>占ぁE��です…</p>
                <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
              </div>
            ) : d ? (
              <>
                {/* Title block */}
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                  <div style={{ fontSize: "52px", marginBottom: "6px" }}>{d.dogEmoji}</div>
                  <div style={{ fontSize: "12px", color: "#c084fc", letterSpacing: "0.2em", marginBottom: "5px" }}>
                    {s.emoji} {s.name} ÁE{s.dates}
                  </div>
                  <h2 style={{
                    fontSize: "clamp(20px, 5vw, 32px)", fontWeight: "900", margin: "0 0 10px",
                    background: "linear-gradient(135deg, #e9d5ff, #c084fc)",
                    WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                  }}>
                    今月は「{d.dogBreed}」タイチE                  </h2>
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
                    { label: "💑 恋�E遁E, score: d.lucky.loveScore },
                    { label: "💼 仕事運", score: d.lucky.workScore },
                    { label: "💰 金運",   score: d.lucky.moneyScore },
                    { label: "🏃 健康遁E, score: d.lucky.healthScore },
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
                  <div style={{ fontSize: "11px", color: "#c084fc", letterSpacing: "0.15em", marginBottom: "10px" }}>🔮 総合遁E/div>
                  <p style={{ color: "#e9d5ff", lineHeight: "1.9", fontSize: "14px", margin: 0 }}>{d.overall}</p>
                </div>

                {/* Detail cards */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px,1fr))", gap: "10px", marginBottom: "18px" }}>
                  {[
                    { icon: "💑", label: "恋�E遁E, text: d.love },
                    { icon: "💼", label: "仕事運", text: d.work },
                    { icon: "💰", label: "金運",   text: d.money },
                    { icon: "🏃", label: "健康遁E, text: d.health },
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
                    <div style={{ fontSize: "18px", marginBottom: "5px" }}>🎨</div>
                    <div style={{ fontSize: "10px", color: "#a78bfa", marginBottom: "4px" }}>ラチE��ーカラー</div>
                    <div style={{ fontSize: "14px", color: "#e9d5ff", fontWeight: "700" }}>{d.lucky.color}</div>
                  </div>
                  <div style={{
                    background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)",
                    borderRadius: "12px", padding: "14px", textAlign: "center",
                  }}>
                    <div style={{ fontSize: "18px", marginBottom: "5px" }}>🔢</div>
                    <div style={{ fontSize: "10px", color: "#a78bfa", marginBottom: "4px" }}>ラチE��ーナンバ�E</div>
                    <div style={{ fontSize: "14px", color: "#e9d5ff", fontWeight: "700" }}>{d.lucky.number}</div>
                  </div>
                </div>

                {/* Advice */}
                <div style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(192,132,252,0.15)",
                  borderRadius: "14px", padding: "16px 20px",
                  display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "20px",
                }}>
                  <span style={{ fontSize: "22px", flexShrink: 0 }}>🐾</span>
                  <div>
                    <div style={{ fontSize: "10px", color: "#c084fc", letterSpacing: "0.12em", marginBottom: "6px" }}>今月のアドバイス</div>
                    <p style={{ color: "#ddd6fe", fontSize: "13px", margin: 0, lineHeight: "1.8" }}>{d.advice}</p>
                  </div>
                </div>

                {/* ☁EShop CTA Block */}
                <div style={{
                  background: "linear-gradient(135deg, rgba(79,70,229,0.25), rgba(124,58,237,0.25))",
                  border: "1px solid rgba(192,132,252,0.35)",
                  borderRadius: "18px", padding: "22px 24px",
                  textAlign: "center",
                }}>
                  <div style={{ fontSize: "22px", marginBottom: "8px" }}>🐕✨</div>
                  <p style={{ color: "#e9d5ff", fontSize: "14px", lineHeight: "1.85", margin: "0 0 16px" }}>
                    {d.shopMessage}
                  </p>
                  <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
                    <ShopButton href={d.shopUrl} label="おすすめアイチE��を見る" emoji="👗" accent={true} />
                    <ShopButton href={SHOP_CATEGORIES.sale} label="セールをチェチE��" emoji="🏷�E�E />
                  </div>
                  <div style={{ marginTop: "14px", fontSize: "11px", color: "#a78bfa", opacity: 0.7 }}>
                    Atelier ToYou  Eペット服・犬服専門庁E                  </div>
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
                  <div style={{ fontSize: '22px', marginBottom: '8px' }}>🐾📩</div>
                  <p style={{ color: '#e9d5ff', fontSize: '15px', fontWeight: '700', margin: '0 0 4px' }}>
                    毎月のわんこ占ぁE��受け取る
                  </p>
                  <p style={{ color: '#a78bfa', fontSize: '13px', margin: '0 0 16px', lineHeight: '1.7' }}>
                    LINEに登録すると毎月1日に<br />最新のわんこ占ぁE��お届けします🌁E                  </p>
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
                    LINE友だち追加�E�無料！E                  </a>
                </div>
              </>
            ) : null}
          </div>
        )}

        {selected === null && !generating && (
          <div style={{ textAlign: "center", padding: "48px 0", color: "#7c3aed", opacity: 0.55 }}>
            <div style={{ fontSize: "44px", marginBottom: "10px" }}>🌟</div>
            <p style={{ fontSize: "14px" }}>星座を選んで今月の運勢を見てみましょぁE/p>
          </div>
        )}
      </div>
    </div>
  );
}
