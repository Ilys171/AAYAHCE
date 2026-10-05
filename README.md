# AAYAHCE website

American–Azerbaijani Youth Association for Human-Centered Engineering — public database of human-centered engineering work.

Static site, no build step. Open `index.html` directly or serve the folder (`python -m http.server 8000`).

```
index.html      shell: header, footer, nav
css/style.css   design tokens (light + dark), layout
js/data.js      ALL content: projects, failure map, contexts, fieldwork, people, partners, field guide
js/app.js       hash router (#/projects/rehand-loom, #/failure-map, …) and page renderers
images/         project photography (ReHand Loom, SoleShift)
```

## Adding content
Edit `js/data.js` only. Impact totals are computed from each project's `metrics` — leave a key out rather than estimate it, and the Impact page shows "Not yet reported".

## Before launch
- Set `SITE.email` in `js/data.js` (currently a placeholder). Join/Contact forms open the visitor's email app addressed to it; swap for Formspree/Netlify Forms if you want submissions stored.
- Add SoleShift and Səssiz Sifariş team members to `PEOPLE` and the project `team` arrays.
- List partners only once the relationship is confirmed.
