// Fieldwork Design System — shared across all pages

export const THEMES = {
  dark: {
    bg: "#0A0C0F",
    paper: "#14171C",
    paperAlt: "#171B21",
    ink: "#F1F3F6",
    inkSoft: "#8D96A6",
    steel: "#7BA3CC",
    stamp: "#FF6E42",
    stampSoft: "rgba(255,110,66,0.14)",
    line: "#242A32",
    ok: "#3FDD97",
    gridLine: "rgba(255,255,255,0.035)",
  },
  light: {
    bg: "#EDF0F5",
    paper: "#FFFFFF",
    paperAlt: "#FBFCFE",
    ink: "#1C2430",
    inkSoft: "#566178",
    steel: "#3E5C76",
    stamp: "#D8481F",
    stampSoft: "#F3E2DB",
    line: "#D8DEE8",
    ok: "#2E7D5B",
    gridLine: "rgba(28,36,48,0.06)",
  },
};

export type Mode = "dark" | "light";

export const FW_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
  .fw-display{ font-family:'Fraunces', serif; }
  .fw-mono{ font-family:'IBM Plex Mono', monospace; }
  .fw-bgtexture{
    position:absolute; inset:0; pointer-events:none; z-index:0;
    background-image: linear-gradient(var(--gridLine) 1px, transparent 1px), linear-gradient(90deg, var(--gridLine) 1px, transparent 1px);
    background-size: 42px 42px;
  }
  .fw-glow{
    position:absolute; z-index:0; pointer-events:none;
    width: 520px; height: 520px; border-radius: 50%;
    background: radial-gradient(circle, var(--stampSoft) 0%, transparent 70%);
    filter: blur(10px);
    animation: fwFloat 10s ease-in-out infinite;
  }
  @keyframes fwFloat{ 0%,100%{ transform: translate(0,0); } 50%{ transform: translate(24px,-18px); } }
  @keyframes fwDropIn{ from{ opacity:0; transform: translateY(14px) rotate(var(--r,0deg)); } to{ opacity:1; transform: translateY(0) rotate(0deg); } }
  @keyframes fwPulse{ 0%,100%{ box-shadow: 0 0 0 0 rgba(63,221,151,0); } 50%{ box-shadow: 0 0 0 9px var(--stampSoft); } }
  @keyframes fwPop{ from{ opacity:0; transform: scale(0.5); } to{ opacity:1; transform: scale(1); } }
  @keyframes fwSpin{ to{ transform: rotate(360deg); } }
  .fw-field-row{ opacity:0; animation: fwDropIn 0.6s cubic-bezier(.2,.8,.2,1) forwards; margin-bottom: 16px; }
  .fw-submit{ opacity:0; animation: fwDropIn 0.6s cubic-bezier(.2,.8,.2,1) forwards, fwPulse 1.6s ease-in-out 4.4s 1; animation-delay: 3.8s, 4.4s; }
  .fw-check{ opacity:0; animation: fwPop 0.4s ease forwards; animation-delay: 4.6s; }
  .fw-card{ transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease; }
  .fw-card:hover{ transform: rotate(0deg) translateY(-4px); border-color: var(--stamp) !important; }
  .fw-btn-primary{ transition: background 0.2s ease, transform 0.15s ease, box-shadow 0.2s ease; }
  .fw-btn-primary:hover{ transform: translateY(-2px); box-shadow: 0 10px 24px -10px var(--stampSoft); }
  .fw-btn-ghost{ transition: border-color 0.2s ease, color 0.2s ease, transform 0.15s ease; }
  .fw-btn-ghost:hover{ transform: translateY(-2px); border-color: var(--stamp) !important; color: var(--stamp) !important; }
  .fw-toggle{ transition: background 0.2s ease, transform 0.2s ease; }
  .fw-toggle:hover{ transform: scale(1.06); }
  .fw-orbit{ animation: fwSpin 18s linear infinite; }
  @media (prefers-reduced-motion: reduce){
    .fw-field-row,.fw-submit,.fw-check,.fw-glow,.fw-orbit{ animation: none !important; opacity:1 !important; transform:none !important; }
  }
`;
