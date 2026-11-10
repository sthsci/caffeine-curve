# Caffeine Curve

An interactive caffeine calculator: drag your cups along the day and see how much caffeine is still in you at bedtime, with your own half-life.

**Live: [sthsci.github.io/caffeine-curve](https://sthsci.github.io/caffeine-curve/)**

A single, dependency-free HTML page. Open `index.html` in a browser, or serve the folder with any static server.

## What it does

- **Cups.** Drag the markers along the 06:00 → 06:00 axis (or edit time, drink and mg in the list). Arrow keys nudge a focused cup by 5 minutes, Shift + arrow by an hour. Eight drink presets, from decaf (3 mg) to a double espresso (126 mg).
- **You.** Caffeine half-life from 2 to 16 h with presets (typical adult 5 h, smoker 3 h, oral contraceptive 8 h, late pregnancy 15 h), bedtime, and the threshold you want to be under at bedtime (default 50 mg).
- **Readouts.** Peak and when; mg at bedtime; the time you drop under the threshold; and *last cup by* — the latest time your final cup could move to and keep you under the line all night.
- **Hover** anywhere for the total and the per-cup breakdown. The selected cup's own contribution is drawn as a darker band.

Your layout is remembered in the browser's `localStorage` only.

## The model

Each cup follows the Bateman function (one-compartment model with first-order absorption and elimination), and the cups add up:

```
A(t) = Σ D · ka/(ka − ke) · (e^(−ke·τ) − e^(−ka·τ)),   τ = t − t_cup > 0
```

- `D` is the cup's caffeine in mg
- `ka = 2.8 h⁻¹` (absorption; about 15 min to absorb half a cup)
- `ke = ln 2 / half-life`

*Last cup by* moves the latest cup, with the others fixed, to the latest 5-minute slot for which the level stays at or under the threshold from bedtime until 06:00. Requiring the whole night, rather than only the bedtime instant, is what stops a cup drunk just before bed from "passing" because it has not been absorbed yet.

`scripts/check_model.js` reproduces the figures shown in the demo that inspired this page (3 × 95 mg, 5 h half-life, bed 23:00) and can be run with `node scripts/check_model.js`.

## Caveats

- Caffeine half-life varies more between people than anything else here. 5 h is a population average; healthy adults range from roughly 2 to 10 h. It is shorter in smokers and longer with oral contraceptives, in late pregnancy, and with some antidepressants and antibiotics.
- The threshold is a rule of thumb, not a tested cutoff. A 2023 meta-analysis ([Gardiner et al., *Sleep Medicine Reviews*](https://doi.org/10.1016/j.smrv.2023.101764)) found that a ~107 mg coffee within 8.8 h of bedtime, or ~217 mg within 13.2 h, measurably shortens sleep.
- Amounts are mg in the body, not blood concentration, so body mass is not accounted for.
- Not medical advice.

## Credits

Layout inspired by [Charles Postiaux's demo](https://x.com/PostiauxCharles/status/2119801461278146758) (9 Nov 2026); this is an independent implementation. For alertness-optimised dosing, see the US Army's [2B-Alert Web](https://2b-alert-web.bhsai.org/).

Fonts: [Bricolage Grotesque](https://fonts.google.com/specimen/Bricolage+Grotesque) and [JetBrains Mono](https://fonts.google.com/specimen/JetBrains+Mono) via Google Fonts, with system fallbacks.

## Licence

MIT — see `LICENSE`.
