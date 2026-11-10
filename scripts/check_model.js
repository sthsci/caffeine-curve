// Reproduces the figures in the demo that inspired the page:
// three 95 mg cups at 08:00, 11:00 and a third cup; 5 h half-life; bed at 23:00; 50 mg threshold.
// Same model as index.html. Run: node scripts/check_model.js
const LN2 = Math.log(2), KA = 2.8, STEP = 1 / 12, HL = 5, BED = 23, THR = 50;

const amountAt = (t, cups) => {
  const ke = LN2 / HL;
  let s = 0;
  for (const c of cups) {
    const tau = t - c.time;
    if (tau <= 0) continue;
    s += c.mg * KA / (KA - ke) * (Math.exp(-ke * tau) - Math.exp(-KA * tau));
  }
  return s;
};
const hm = h => { const m = Math.round(h * 60); return `${String(Math.floor(m / 60) % 24).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`; };
const maxAfter = (from, cups) => { let m = 0; for (let t = from; t <= 30; t += STEP) m = Math.max(m, amountAt(t, cups)); return m; };

// [third cup, mg at bedtime shown in the demo, peak mg shown, peak time shown]
const observed = [
  [13 + 50 / 60, 60, 179, "14:44"],
  [15 + 30 / 60, 67, null, null],
  [20 + 29 / 60, 102, 138, "11:57"],
];

for (const [c3, bed, pk, pkt] of observed) {
  const cups = [{ time: 8, mg: 95 }, { time: 11, mg: 95 }, { time: c3, mg: 95 }];
  let best = 0, bt = 0;
  for (let t = 6; t <= 30; t += 1 / 600) { const v = amountAt(t, cups); if (v > best) { best = v; bt = t; } }
  console.log(`third cup ${hm(c3)}: at bed ${amountAt(BED, cups).toFixed(1)} mg (demo ${bed}) · peak ${best.toFixed(1)} mg at ${hm(bt)} (demo ${pk ?? "–"} at ${pkt ?? "–"})`);
}

let lastBy = null;
for (let T = BED; T >= 6; T -= STEP) {
  if (maxAfter(BED, [{ time: 8, mg: 95 }, { time: 11, mg: 95 }, { time: T, mg: 95 }]) <= THR) { lastBy = T; break; }
}
console.log(`last cup by: ${hm(lastBy)} (demo 10:45; this page requires staying under ${THR} mg all night)`);
