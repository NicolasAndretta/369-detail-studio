// Sistema visual de andmar.studio para las piezas.
// Negro / blanco / violeta de acento. Tecnológico, sobrio, sin adornos.
const V = {
  bg: '#07070A',
  bg2: '#0C0C12',
  ink: '#FFFFFF',
  mute: 'rgba(255,255,255,.56)',
  faint: 'rgba(255,255,255,.34)',
  line: 'rgba(255,255,255,.10)',
  acc: '#8B5CF6',
  acc2: '#A78BFA',
  accDim: 'rgba(139,92,246,.16)',
  display: "var(--font-display), 'Outfit', system-ui, sans-serif",
  body: "var(--font-primary), 'Inter', system-ui, sans-serif",
};

/** Fondo común: negro + halo violeta suave + grano. Nada estridente. */
const fondo = (o = {}) => `
  position:absolute;inset:0;
  background:
    radial-gradient(120% 70% at 82% -8%, rgba(139,92,246,${o.a1 ?? .22}) 0%, transparent 58%),
    radial-gradient(90% 55% at 6% 104%, rgba(124,58,237,${o.a2 ?? .14}) 0%, transparent 60%),
    ${V.bg};`;

const grano = `
  position:absolute;inset:0;opacity:.30;mix-blend-mode:overlay;pointer-events:none;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.5'/></svg>");`;

/** Eyebrow con punto: la firma del sistema. */
const eyebrow = (txt, color = V.acc2) => `
  <div style="display:flex;align-items:center;gap:14px;">
    <span style="width:7px;height:7px;border-radius:99px;background:${color};box-shadow:0 0 16px ${color};"></span>
    <span style="font-family:${V.body};font-size:20px;letter-spacing:.30em;text-transform:uppercase;color:${color};font-weight:600;">${txt}</span>
  </div>`;

/** Firma de marca, siempre abajo. Nunca tapa la UI. */
const firma = (extra = '') => `
  <div style="display:flex;align-items:center;justify-content:space-between;gap:20px;">
    <div style="display:flex;align-items:center;gap:13px;">
      <span style="width:9px;height:9px;border-radius:99px;background:${V.acc};box-shadow:0 0 18px ${V.acc};"></span>
      <span style="font-family:${V.display};font-size:29px;font-weight:600;color:${V.ink};letter-spacing:-.01em;">andmar<span style="color:${V.acc2}">.studio</span></span>
    </div>
    ${extra ? `<span style="font-family:${V.body};font-size:19px;letter-spacing:.18em;text-transform:uppercase;color:${V.faint};">${extra}</span>` : ''}
  </div>`;

/** Marco de teléfono: la UI móvil se ve como app, no como captura suelta. */
const marco = (innerW, innerH, radio = 46) => ({
  wrap: `position:relative;width:${innerW}px;height:${innerH}px;border-radius:${radio}px;
         background:#000;padding:0;overflow:hidden;
         box-shadow:0 40px 120px rgba(0,0,0,.75), 0 0 0 2px rgba(255,255,255,.10), 0 0 90px rgba(139,92,246,.20);`,
});

module.exports = { V, fondo, grano, eyebrow, firma, marco };
