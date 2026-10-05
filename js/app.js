/* =========================================================================
   AAYAHCE — hash router + page renderers. Content lives in data.js.
   ========================================================================= */

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) =>
  String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const projectBySlug = (slug) => PROJECTS.find((p) => p.slug === slug);
const personById = (id) => PEOPLE.find((p) => p.id === id);
const projectLink = (slug) => {
  const p = projectBySlug(slug);
  return p ? `<a href="#/projects/${p.slug}">${esc(p.name)}</a>` : "—";
};
const statusPill = (s) => `<span class="pill pill-${s.toLowerCase().replace(/\s+/g, "-")}">${esc(s)}</span>`;
const arrow = `<svg class="arw" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8h10M9 4l4 4-4 4"/></svg>`;

const pageHead = (eyebrow, title, lede) => `
  <header class="page-head wrap">
    <p class="eyebrow">${eyebrow}</p>
    <h1>${title}</h1>
    ${lede ? `<p class="lede">${lede}</p>` : ""}
  </header>`;

/* ---------- Shared components ---------- */

// Framework fields colored by meaning: failure (madder), intervention/result (teal), method (indigo).
const FIELD_TONE = {
  overlookedUser: "is-fail", failurePoint: "is-fail", lostSignal: "is-fail",
  intervention: "is-fix", measurement: "is-fix",
  testing: "is-method", iteration: "is-method", transferability: "is-method",
};

function projectCard(p) {
  const media = p.cover
    ? `<img src="${p.cover}" alt="${esc(p.coverAlt)}" loading="lazy" />`
    : `<div class="card-ph" aria-hidden="true"><span>${esc(p.framework.lostSignal)}</span></div>`;
  return `
    <a class="pcard" href="#/projects/${p.slug}">
      <div class="pcard-media">${media}</div>
      <div class="pcard-body">
        <div class="pcard-meta"><span class="mono">${esc(p.area)}</span>${statusPill(p.status)}</div>
        <h3>${esc(p.name)}</h3>
        <p>${esc(p.tagline)}</p>
        <dl class="mini">
          <div><dt>Failure point</dt><dd>${esc(p.framework.failurePoint)}</dd></div>
        </dl>
        <span class="more">Open project ${arrow}</span>
      </div>
    </a>`;
}

function failureRecord(f, { compact = false } = {}) {
  // is-fail = where the system fails (madder), is-fix = what changed (teal)
  const row = (k, v, tone = "") => `<div class="${tone}"><dt>${k}</dt><dd>${v}</dd></div>`;
  return `
    <article class="record" data-id="${f.id}">
      <header class="record-head">
        <span class="mono">${f.id}</span>
        <span class="mono muted">${esc(f.category)}</span>
        ${statusPill(f.status)}
      </header>
      <dl>
        ${row("System", esc(f.system))}
        ${row("User", esc(f.user))}
        ${row("Failure point", esc(f.failure), "is-fail")}
        ${row("Signal lost", esc(f.signal), "is-fail")}
        ${compact ? "" : row("Intervention", f.intervention ? esc(f.intervention) : `<span class="muted">Waiting for a team</span>`, "is-fix")}
        ${row("Project", f.project ? projectLink(f.project) : `<a href="#/join">Take this on ${arrow}</a>`)}
        ${compact ? "" : row("Result", f.result ? esc(f.result) : `<span class="muted">—</span>`, "is-fix")}
      </dl>
    </article>`;
}

/* ---------- Impact: metrics derived from records ---------- */

const METRIC_DEFS = [
  ["interviewed", "People interviewed"],
  ["testers", "Users involved in testing"],
  ["prototypes", "Prototypes produced"],
  ["iterations", "Design iterations"],
  ["deployed", "Projects deployed"],
  ["communities", "Communities / regions reached"],
  ["students", "Students involved"],
  ["specialists", "Specialists and mentors"],
  ["independent", "Independent implementations"],
  ["collaborations", "U.S.–Azerbaijan collaborations"],
];

function computeMetrics() {
  const out = {};
  for (const [key] of METRIC_DEFS) out[key] = { total: 0, sources: [] };
  for (const p of PROJECTS) {
    for (const [k, v] of Object.entries(p.metrics || {})) {
      out[k].total += v;
      out[k].sources.push({ slug: p.slug, v });
    }
    if (p.status === "Deployed") {
      out.deployed.total += 1;
      out.deployed.sources.push({ slug: p.slug, v: 1 });
    }
  }
  out.students.total = PEOPLE.filter((x) => x.kind === "Student").length;
  out.students.note = "Listed on the People page";
  const collab = CONTEXTS.filter((c) => /^(Active|Complete)/.test(c.stage));
  out.collaborations.total = collab.length;
  out.collaborations.note = `${CONTEXTS.length} cases proposed or open`;
  return out;
}

/* ---------- Pages ---------- */

function pageHome() {
  const featured = FAILURES[1];
  const m = computeMetrics();
  const story = [
    ["Person", "A rural carpet weaver, years at the loom.", "images/rehand/weaver-loom.jpg", "A weaver working at a vertical loom"],
    ["Problem", "Numbness and fatigue get dismissed as \"just tired hands\". Specialists are in the city.", "images/rehand/gallery-visitors.jpg", "Visitors reading the research poster that sets out the problem", "is-fail"],
    ["Observation", "Fitting a sensor glove on a working weaver — at the loom, not at a desk.", "images/rehand/gallery-fitting.jpg", "Team fitting the glove on a weaver"],
    ["Co-design", "Talking requirements and thresholds through with specialists and craft experts.", "images/rehand/gallery-museum-poster.jpg", "The team discussing the design with a specialist at the museum"],
    ["Prototype", "Flex, pressure and motion sensors, an ESP32 and an offline-first app.", "images/rehand/hero-prototype.jpg", "Team reading live glove data on a laptop"],
    ["Testing", "Bench calibration, then wearability with weavers at the loom.", "images/rehand/carpet-weaver.jpeg", "A weaver wearing the glove while the team watches live sensor data on a laptop"],
    ["Measure", "Specialists review structured session reports — trends and flags, never raw signals.", "images/rehand/gallery-elders.jpg", "The team walking museum staff and specialists through the session reports"],
    ["Change", "124 of 200 participants received individualised guidance.", "images/rehand/gallery-team.jpg", "The ReHand Loom team with their research poster at the Azerbaijan Carpet Museum", "is-fix"],
  ];
  return `
  <section class="hero wrap">
    <div class="hero-text">
      <p class="eyebrow">Student-led · Azerbaijan × United States</p>
      <h1>Engineering starts where systems stop understanding people.</h1>
      <p class="lede">AAYAHCE is a student-led American–Azerbaijani initiative that identifies overlooked failures in everyday systems, builds human-centered interventions, and tests them with the communities they are designed for.</p>
      <div class="btns">
        <a class="btn btn-primary" href="#/projects">Explore Projects ${arrow}</a>
        <a class="btn" href="#/join">Join a Team</a>
      </div>
    </div>
    <div class="hero-record">
      <p class="label">From the Failure Map</p>
      ${failureRecord(featured)}
      <a class="small" href="#/failure-map">Browse all ${FAILURES.length} entries ${arrow}</a>
    </div>
  </section>

  <section class="band">
    <div class="wrap question">
      <p class="label">The central question</p>
      <p class="big-q">Where do everyday systems fail the people they were supposed to serve?</p>
      <div class="works-grid">
        <p><strong>It works —</strong> unless ordering begins with speaking and you can't.</p>
        <p><strong>It works —</strong> the rehab device records accurate data, while getting in the way of the hand it measures.</p>
        <p><strong>It works —</strong> the instructions are obvious to the designer and confusing to a first-time user.</p>
        <p><strong>It works —</strong> in one country, then fails when copied into another.</p>
      </div>
    </div>
  </section>

  <section class="wrap section">
    <div class="section-head">
      <p class="eyebrow">One project, start to finish</p>
      <h2>Person → problem → observation → co-design → prototype → testing → measure → change</h2>
      <p class="muted">We start with people, not technology. Here is how that looked for <a href="#/projects/rehand-loom">ReHand Loom</a>.</p>
    </div>
    <ol class="story">
      ${story
        .map(
          ([k, t, img, alt, tone = ""], i) => `
        <li class="story-step ${img ? "has-img" : ""} ${tone}">
          ${img ? `<img src="${img}" alt="${esc(alt)}" loading="lazy" />` : ""}
          <div class="story-text">
            <span class="mono">${String(i + 1).padStart(2, "0")} · ${k}</span>
            <p>${esc(t)}</p>
          </div>
        </li>`
        )
        .join("")}
    </ol>
  </section>

  <section class="wrap section">
    <div class="section-head split">
      <div>
        <p class="eyebrow">How we work</p>
        <h2>One method for every project.</h2>
      </div>
      <a class="btn" href="#/method">See the full method ${arrow}</a>
    </div>
    <ol class="rail">
      ${METHOD.map((s, i) => `<li><a href="#/method?step=${s.id}"><span class="mono">${String(i + 1).padStart(2, "0")}</span><strong>${s.name}</strong><span class="muted small">${s.verb}</span></a></li>`).join("")}
    </ol>
  </section>

  <section class="wrap section">
    <div class="section-head split">
      <div>
        <p class="eyebrow">Projects database</p>
        <h2>Documented work, including what didn't work.</h2>
      </div>
      <a class="btn" href="#/projects">All projects ${arrow}</a>
    </div>
    <div class="pgrid">${PROJECTS.map(projectCard).join("")}</div>
  </section>

  <section class="band band-ink">
    <div class="wrap section">
      <div class="section-head split">
        <div>
          <p class="eyebrow">Impact</p>
          <h2>Numbers, each traceable to a project.</h2>
        </div>
        <a class="btn btn-light" href="#/impact">Impact ledger ${arrow}</a>
      </div>
      <div class="stats">
        ${[["testers"], ["iterations"], ["specialists"], ["communities"]]
          .map(([k]) => {
            const d = METRIC_DEFS.find((x) => x[0] === k);
            return `<div class="stat"><span class="stat-n">${m[k].total}</span><span class="stat-l">${d[1]}</span><span class="stat-s">${m[k].sources.map((s) => projectBySlug(s.slug).name).join(", ")}</span></div>`;
          })
          .join("")}
      </div>
    </div>
  </section>

  <section class="wrap section two-ctx-teaser">
    <div>
      <p class="eyebrow">U.S. × Azerbaijan</p>
      <h2>One problem, two contexts.</h2>
      <p>The same human need produces different system failures in Baku and in an American community. We compare them to learn which solutions transfer and which have to be rebuilt around local behavior, infrastructure and culture.</p>
      <a class="btn" href="#/contexts">See the cases ${arrow}</a>
    </div>
    <div class="ctx-diagram" aria-hidden="true">
      <div class="ctx-col ctx-az"><span class="mono">AZ</span><p>How it fails here</p></div>
      <div class="ctx-mid"><span class="mono">Shared need</span></div>
      <div class="ctx-col ctx-us"><span class="mono">US</span><p>How it fails there</p></div>
    </div>
  </section>

  <section class="wrap section join-teaser">
    <p class="label">The one question on our application</p>
    <p class="big-q">What is one everyday system you have seen people struggle with that most others seem to ignore?</p>
    <a class="btn btn-primary" href="#/join">Answer it — join a team ${arrow}</a>
  </section>`;
}

function pageMethod(params) {
  const open = params.get("step") || METHOD[0].id;
  return `
  ${pageHead("Our method", "Observe → Map the Failure → Co-Design → Prototype → Test → Measure → Iterate", "Every AAYAHCE project follows the same sequence and is documented with the same ten fields. That shared structure is what lets work from different teams, cities and countries be compared.")}
  <section class="wrap section">
    <div class="method" role="tablist" aria-label="Method steps">
      ${METHOD.map(
        (s, i) => `
        <button class="mstep" role="tab" id="tab-${s.id}" aria-selected="${s.id === open}" aria-controls="panel-${s.id}" data-step="${s.id}">
          <span class="mono">${String(i + 1).padStart(2, "0")}</span>
          <strong>${s.name}</strong>
        </button>`
      ).join("")}
    </div>
    ${METHOD.map(
      (s, i) => `
      <div class="mpanel" role="tabpanel" id="panel-${s.id}" aria-labelledby="tab-${s.id}" ${s.id === open ? "" : "hidden"}>
        <p class="mono muted">Step ${i + 1} of ${METHOD.length}</p>
        <h2>${s.name}: ${s.verb.toLowerCase()}.</h2>
        <p>${s.body}</p>
        <p class="output"><span class="label">Output</span> ${s.output}</p>
      </div>`
    ).join("")}
  </section>

  <section class="wrap section">
    <div class="section-head">
      <p class="eyebrow">Human-Centered Engineering Framework</p>
      <h2>Ten fields, every project.</h2>
      <p class="muted">Each project page answers these in order. Compare them side by side on any <a href="#/projects">project</a>.</p>
    </div>
    <ol class="framework">
      ${FRAMEWORK.map(([, name, q], i) => `<li><span class="mono">${String(i + 1).padStart(2, "0")}</span><div><strong>${name}</strong><p>${q}</p></div></li>`).join("")}
    </ol>
  </section>`;
}

function pageProjects(params) {
  const areas = [...new Set(PROJECTS.map((p) => p.area))];
  const area = params.get("area") || "All";
  const list = area === "All" ? PROJECTS : PROJECTS.filter((p) => p.area === area || p.tags.includes(area));
  return `
  ${pageHead("Projects database", "Projects", "Each project is documented with the same structure: problem, users, fieldwork, failure point, prototype, iterations, testing, impact, team and documentation.")}
  <section class="wrap section">
    <div class="chips" role="group" aria-label="Filter by area">
      ${["All", ...areas].map((a) => `<a class="chip" href="#/projects${a === "All" ? "" : "?area=" + encodeURIComponent(a)}" aria-pressed="${a === area}">${a}</a>`).join("")}
    </div>
    <div class="pgrid">${list.map(projectCard).join("") || `<p class="muted">No projects in this area yet.</p>`}</div>
  </section>
  <section class="wrap section">
    <div class="section-head"><p class="eyebrow">Compare</p><h2>Framework view</h2></div>
    <div class="table-scroll">
      <table class="cmp">
        <thead><tr><th scope="col">Field</th>${PROJECTS.map((p) => `<th scope="col"><a href="#/projects/${p.slug}">${esc(p.name)}</a></th>`).join("")}</tr></thead>
        <tbody>
          ${FRAMEWORK.map(([k, name]) => `<tr><th scope="row">${name}</th>${PROJECTS.map((p) => `<td>${esc(p.framework[k])}</td>`).join("")}</tr>`).join("")}
        </tbody>
      </table>
    </div>
  </section>`;
}

function pageProject(slug) {
  const p = projectBySlug(slug);
  if (!p) return pageNotFound();
  const sections = [
    ["problem", "Problem"], ["users", "Users"], ["fieldwork", "Fieldwork"], ["failure", "Failure point"],
    ["prototype", "Prototype"], ["iterations", "Iterations"], ["testing", "Testing"], ["impact", "Impact"],
    ["team", "Team"], ["docs", "Documentation"],
  ];
  const team = p.team.map(personById).filter(Boolean);
  const fw = FAILURES.filter((f) => f.project === p.slug);
  const sec = (id, title, body) => `<section class="psec" id="s-${id}"><h2><span class="mono">${String(sections.findIndex((s) => s[0] === id) + 1).padStart(2, "0")}</span>${title}</h2>${body}</section>`;
  const pending = (t) => `<p class="pending">${t}</p>`;

  return `
  <article class="project">
    <header class="phero ${p.cover ? "" : "no-img"}">
      ${p.cover ? `<img src="${p.cover}" alt="${esc(p.coverAlt)}" />` : ""}
      <div class="wrap phero-text">
        <a class="back small" href="#/projects">← All projects</a>
        <div class="pcard-meta"><span class="mono">${esc(p.area)}</span>${statusPill(p.status)}</div>
        <h1>${esc(p.name)}</h1>
        <p class="lede">${esc(p.tagline)}</p>
        <p class="mono small">${esc(p.location)} · ${esc(p.year)}</p>
      </div>
    </header>

    <div class="wrap pgrid-layout">
      <nav class="toc" aria-label="Sections">
        <p class="label">On this page</p>
        <a href="#s-sheet" data-scroll>Framework sheet</a>
        ${sections.map(([id, t]) => `<a href="#s-${id}" data-scroll>${t}</a>`).join("")}
      </nav>

      <div class="pcontent">
        ${p.disclaimer ? `<p class="disclaimer">${esc(p.disclaimer)}</p>` : ""}
        <section class="psec" id="s-sheet">
          <h2><span class="mono">00</span>Framework sheet</h2>
          <dl class="sheet">
            ${FRAMEWORK.map(([k, name]) => `<div class="${FIELD_TONE[k] || ""}"><dt>${name}</dt><dd>${esc(p.framework[k])}</dd></div>`).join("")}
          </dl>
        </section>

        ${sec("problem", "Problem", `<p>${esc(p.problem)}</p>`)}
        ${sec("users", "Users", `<p>${esc(p.users)}</p>`)}
        ${sec("fieldwork", "Fieldwork", `<ul class="ticks">${p.fieldwork.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>
          ${FIELDWORK.some((f) => f.project === p.slug) ? `<a class="small" href="#/fieldwork?project=${p.slug}">Fieldwork log entries ${arrow}</a>` : ""}`)}
        ${sec("failure", "Failure point", `<p>${esc(p.failure)}</p>${fw.map((f) => failureRecord(f, { compact: true })).join("")}`)}
        ${sec("prototype", "Prototype", `<p>${esc(p.prototype)}</p>`)}
        ${sec("iterations", "Iterations", p.iterations.length
          ? `<ol class="iters">${p.iterations.map((it) => `<li><span class="mono">${esc(it.v)}</span><p>${esc(it.what)}</p></li>`).join("")}</ol>`
          : pending("No iterations logged yet."))}
        ${sec("testing", "Testing", `<p>${esc(p.testing)}</p>`)}
        ${sec("impact", "Impact", (p.impact.length
          ? `<div class="kpis">${p.impact.map((k) => `<div class="kpi"><span class="kpi-n">${esc(k.n)}</span><span>${esc(k.label)}</span></div>`).join("")}</div>`
          : pending("No results published yet.")) + `<p class="source small"><span class="label">Source</span> ${esc(p.impactSource)}</p>`)}
        ${sec("team", "Team", team.length
          ? `<div class="people">${team.map(personCard).join("")}</div>`
          : pending("Team profiles will be added as members are confirmed."))}
        ${sec("docs", "Documentation", (p.docs.length
          ? `<ul class="docs">${p.docs.map((d) => `<li><span class="mono">${esc(d.type)}</span>${esc(d.label)}</li>`).join("")}</ul>`
          : pending("Nothing published yet.")) +
          (p.gallery.length ? `<div class="gallery">${p.gallery.map(([src, cap]) => `<figure><img src="${src}" alt="${esc(cap)}" loading="lazy" /><figcaption>${esc(cap)}</figcaption></figure>`).join("")}</div>` : ""))}
      </div>
    </div>
  </article>`;
}

function pageFailureMap(params) {
  return `
  ${pageHead("Human-Centered Failure Map", "Where systems fail people", "A searchable database of failure points identified by AAYAHCE teams — including problems still waiting for someone to take them on.")}
  <section class="wrap section">
    <div class="fm-controls">
      <label class="search">
        <span class="sr">Search the failure map</span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="9" cy="9" r="6"/><path d="m14 14 4 4"/></svg>
        <input id="fmQ" type="search" placeholder="Search systems, users, signals…" value="${esc(params.get("q") || "")}" />
      </label>
      <select id="fmStatus" aria-label="Filter by status">
        ${["All statuses", "Open", "In progress", "Addressed"].map((s) => `<option>${s}</option>`).join("")}
      </select>
    </div>
    <div class="chips" id="fmCats" role="group" aria-label="Filter by category">
      ${["All", ...FAILURE_CATEGORIES].map((c) => `<button class="chip" data-cat="${c}" aria-pressed="${c === "All"}">${c}<span class="chip-n">${c === "All" ? FAILURES.length : FAILURES.filter((f) => f.category === c).length}</span></button>`).join("")}
    </div>
    <p class="mono small muted" id="fmCount" aria-live="polite"></p>
    <div class="records" id="fmList"></div>
    <div class="callout">
      <div>
        <strong>Seen a system fail someone?</strong>
        <p class="muted">Open entries become projects. Send us the system, the person, and the moment it breaks.</p>
      </div>
      <a class="btn btn-primary" href="#/contact?topic=failure">Submit a failure point ${arrow}</a>
    </div>
  </section>`;
}

function mountFailureMap() {
  let cat = "All";
  const q = $("#fmQ"), st = $("#fmStatus");
  const draw = () => {
    const term = q.value.trim().toLowerCase();
    const list = FAILURES.filter(
      (f) =>
        (cat === "All" || f.category === cat) &&
        (st.value === "All statuses" || f.status === st.value) &&
        (!term || Object.values(f).join(" ").toLowerCase().includes(term) || (f.project && projectBySlug(f.project).name.toLowerCase().includes(term)))
    );
    $("#fmList").innerHTML = list.map((f) => failureRecord(f)).join("") || `<p class="muted">No entries match. Maybe this one is yours to add.</p>`;
    $("#fmCount").textContent = `${list.length} of ${FAILURES.length} entries`;
  };
  q.addEventListener("input", draw);
  st.addEventListener("change", draw);
  $("#fmCats").addEventListener("click", (e) => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;
    cat = b.dataset.cat;
    $$("#fmCats .chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    draw();
  });
  draw();
}

function pageContexts() {
  return `
  ${pageHead("U.S. × Azerbaijan", "One Problem, Two Contexts", "Not cultural exchange for its own sake. Two settings let us examine how the same human need produces different system failures — and which solutions can travel.")}
  <section class="wrap section">
    <div class="ctx-why">
      <div><span class="mono">01</span><p>What does each system assume about its users?</p></div>
      <div><span class="mono">02</span><p>Who do those assumptions unintentionally exclude?</p></div>
      <div><span class="mono">03</span><p>Which solutions transfer between contexts?</p></div>
      <div><span class="mono">04</span><p>Which must be redesigned around local behavior, culture, infrastructure or resources?</p></div>
    </div>
    <p class="muted small">The aim is never to decide which system is “better”.</p>
  </section>
  ${CONTEXTS.map(
    (c) => `
  <section class="wrap section ctx-case">
    <header class="ctx-head">
      <span class="mono">${c.id}</span>
      <h2>${esc(c.title)}</h2>
      <span class="pill pill-open">${esc(c.stage)}</span>
      ${c.project ? `<span class="small">Linked project: ${projectLink(c.project)}</span>` : ""}
    </header>
    <div class="ctx-pair">
      <div class="ctx-side ctx-az"><p class="label">Azerbaijan</p><p class="small muted">How does the problem appear here?</p><p>${esc(c.az)}</p></div>
      <div class="ctx-side ctx-us"><p class="label">United States</p><p class="small muted">How does the same problem appear there?</p><p>${esc(c.us)}</p></div>
    </div>
    <dl class="ctx-rows">
      <div><dt>Shared need</dt><dd>${esc(c.shared)}</dd></div>
      <div><dt>Different assumptions</dt><dd>${esc(c.assumptions)}</dd></div>
      <div><dt>Design response</dt><dd>${esc(c.response)}</dd></div>
    </dl>
  </section>`
  ).join("")}
  <section class="wrap section">
    <div class="callout">
      <div><strong>Based in the U.S.?</strong><p class="muted">Each open case needs a paired team to run the same observation in an American community.</p></div>
      <a class="btn btn-primary" href="#/join?area=One%20Problem%2C%20Two%20Contexts">Pair with a Baku team ${arrow}</a>
    </div>
  </section>`;
}

function pageFieldwork(params) {
  const proj = params.get("project");
  const list = proj ? FIELDWORK.filter((f) => f.project === proj) : FIELDWORK;
  return `
  ${pageHead("Fieldwork", "Work outside the meeting room", "Interviews, observations, prototype tests, workshops and specialist consultations. Each entry records what we learned and what changed because of it.")}
  <section class="wrap section">
    ${proj ? `<p class="small">Showing entries for ${projectLink(proj)} · <a href="#/fieldwork">show all</a></p>` : ""}
    <ol class="log">
      ${list
        .map(
          (f) => `
        <li class="log-entry">
          <div class="log-when"><span class="mono">${esc(f.date)}</span><span class="pill">${esc(f.kind)}</span></div>
          <div class="log-body">
            <h3>${esc(f.activity)}</h3>
            <p class="mono small muted">${esc(f.location)} · ${projectLink(f.project)}</p>
            <dl class="log-dl">
              <div><dt>Participants</dt><dd>${esc(f.participants)}</dd></div>
              <div><dt>What we learned</dt><dd>${esc(f.learned)}</dd></div>
              <div class="changed"><dt>What changed afterward</dt><dd>${esc(f.changed)}</dd></div>
            </dl>
          </div>
          ${f.image ? `<img class="log-img" src="${f.image}" alt="${esc(f.activity)}" loading="lazy" />` : ""}
        </li>`
        )
        .join("")}
    </ol>
    <div class="callout">
      <div><strong>Entry format</strong><p class="muted">Date + location + activity + participants + what was learned + what changed afterward. An entry without the last field isn't finished.</p></div>
    </div>
  </section>`;
}

function pageImpact() {
  const m = computeMetrics();
  return `
  ${pageHead("Impact", "The impact ledger", "Every number below is the sum of documented project records. A metric with nothing behind it says so instead of guessing.")}
  <section class="wrap section">
    <div class="ledger">
      ${METRIC_DEFS.map(([k, label]) => {
        const d = m[k];
        const has = d.total > 0;
        const src = d.sources.length
          ? d.sources.map((s) => `${projectLink(s.slug)} <span class="mono">${s.v}</span>`).join(" · ")
          : d.note || "";
        return `
        <div class="ledger-row ${has ? "" : "is-empty"}">
          <span class="ledger-n">${has ? d.total : "—"}</span>
          <div>
            <p class="ledger-l">${label}</p>
            <p class="small muted">${has ? src : (d.note ? esc(d.note) + " · " : "") + "Not yet reported by a documented project"}</p>
          </div>
        </div>`;
      }).join("")}
    </div>
    <p class="small muted">Project-level figures are reported on each project page with their source. ReHand Loom figures are from the Ministry of Culture of the Republic of Azerbaijan Letter of Appreciation, 2026.</p>
  </section>
  <section class="wrap section">
    <div class="section-head"><p class="eyebrow">By project</p><h2>Results and sources</h2></div>
    <div class="table-scroll">
      <table class="cmp">
        <thead><tr><th scope="col">Project</th><th scope="col">Status</th><th scope="col">Before / after</th><th scope="col">Source</th></tr></thead>
        <tbody>
          ${PROJECTS.map((p) => `<tr><th scope="row">${projectLink(p.slug)}</th><td>${statusPill(p.status)}</td><td>${esc(p.framework.measurement)}</td><td class="small">${esc(p.impactSource)}</td></tr>`).join("")}
        </tbody>
      </table>
    </div>
  </section>`;
}

function personCard(x) {
  const initials = x.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
  return `
  <div class="person">
    <div class="avatar" aria-hidden="true">${initials}</div>
    <div>
      <p class="person-name">${esc(x.name)}</p>
      <p class="mono small">${esc(x.role)}</p>
      <p class="small muted">Interest: ${esc(x.interest)}${x.project ? ` · Project: ${projectLink(x.project)}` : ""}</p>
      <p class="small">${esc(x.bio)}</p>
    </div>
  </div>`;
}

function pagePeople() {
  return `
  ${pageHead("People", "Teams, chapters, mentors and partners", "AAYAHCE is organized so that anyone, in either country, can start from a failure they've noticed and end up on a project team.")}
  <section class="wrap section">
    <div class="org" aria-label="Organization structure">
      <div class="org-node org-root">AAYAHCE</div>
      <div class="org-line"></div>
      <div class="org-row"><div class="org-node">Chapter · Baku</div><div class="org-node org-open">Chapter · United States <span class="mono">forming</span></div></div>
      <div class="org-line"></div>
      <div class="org-row">${PROJECTS.map((p) => `<a class="org-node" href="#/projects/${p.slug}">${esc(p.name)}</a>`).join("")}</div>
      <div class="org-line"></div>
      <div class="org-node org-leaf">Project teams — students, mentors, specialists, community partners</div>
    </div>
  </section>
  <section class="wrap section">
    <div class="section-head"><p class="eyebrow">Members</p><h2>Students</h2></div>
    <div class="people">${PEOPLE.filter((x) => x.kind === "Student").map(personCard).join("")}</div>
  </section>
  <section class="wrap section">
    <div class="section-head"><p class="eyebrow">Mentors &amp; specialists</p><h2>Mentors</h2></div>
    <p class="pending">Mentor and specialist profiles are published once each person confirms. <a href="#/contact?topic=mentor">Mentor a team ${arrow}</a></p>
  </section>
  <section class="wrap section" id="partners">
    <div class="section-head"><p class="eyebrow">Partners</p><h2>Partners and mentors</h2><p class="muted">Only confirmed relationships are listed as partnerships.</p></div>
    <div class="ptypes">
      ${PARTNER_TYPES.map(([t, d]) => {
        const items = PARTNERS.filter((x) => x.type === t);
        return `<div class="ptype"><p class="label">${t}</p><p class="small muted">${d}</p>${
          items.map((x) => `<div class="partner"><strong>${esc(x.name)}</strong><p class="small">${esc(x.note)}</p><p class="small">${projectLink(x.project)}</p></div>`).join("") ||
          `<p class="small pending-inline">None listed yet</p>`
        }</div>`;
      }).join("")}
    </div>
    <div class="section-head" style="margin-top:2.5rem"><p class="eyebrow">Recognition</p></div>
    ${RECOGNITION.map((r) => `<div class="recog"><strong>${esc(r.name)}</strong><span class="small muted">${esc(r.note)}</span></div>`).join("")}
  </section>`;
}

function pageResources() {
  return `
  ${pageHead("Resources", "Human-Centered Engineering Field Guide", "An open guide for young engineers who want to find and fix where systems fail people. Draft v0.1 — written from what our teams have done so far.")}
  <section class="wrap section guide">
    ${GUIDE.map(
      (g) => `
      <details class="gitem">
        <summary><span class="mono">${g.n}</span><span class="gtitle">${g.title}</span><span class="muted small">${g.summary}</span></summary>
        <ul>${g.points.map((pt) => `<li>${esc(pt)}</li>`).join("")}</ul>
      </details>`
    ).join("")}
  </section>`;
}

function pageJoin(params) {
  const areas = ["Accessibility", "Rehabilitation", "Healthcare", "Public Space", "Education", "Cultural Heritage", "Human Factors", "Environmental Systems", "One Problem, Two Contexts"];
  const pre = params.get("area");
  return `
  ${pageHead("Join AAYAHCE", "Join a team", "Open to students in Azerbaijan and the United States — engineers and non-engineers. The most important field is the first one.")}
  <section class="wrap section">
    <form class="form" id="joinForm" novalidate>
      <div class="field field-key">
        <label for="j-system">What is one everyday system you have seen people struggle with that most others seem to ignore? <span class="req">*</span></label>
        <textarea id="j-system" name="Everyday system people struggle with" rows="4" required></textarea>
        <p class="hint">Describe the system, who struggles, and the moment it goes wrong.</p>
      </div>
      <div class="grid2">
        <div class="field"><label for="j-name">Name <span class="req">*</span></label><input id="j-name" name="Name" required autocomplete="name" /></div>
        <div class="field"><label for="j-email">Email <span class="req">*</span></label><input id="j-email" name="Email" type="email" required autocomplete="email" /></div>
        <div class="field"><label for="j-age">Age</label><input id="j-age" name="Age" inputmode="numeric" /></div>
        <div class="field"><label for="j-school">School / university</label><input id="j-school" name="School / university" /></div>
        <div class="field"><label for="j-city">City <span class="req">*</span></label><input id="j-city" name="City" required /></div>
        <div class="field"><label for="j-country">Country <span class="req">*</span></label>
          <select id="j-country" name="Country" required><option value="">Select…</option><option>Azerbaijan</option><option>United States</option><option>Other</option></select></div>
      </div>
      <div class="field"><label for="j-interests">Interests (engineering or not)</label><input id="j-interests" name="Interests" placeholder="e.g. embedded systems, psychology, design, public health" /></div>
      <div class="field"><label for="j-skills">Skills</label><input id="j-skills" name="Skills" placeholder="e.g. Arduino, CAD, interviewing, Figma, statistics" /></div>
      <div class="field"><label for="j-area">Preferred project area</label>
        <select id="j-area" name="Preferred area"><option value="">No preference</option>${areas.map((a) => `<option ${a === pre ? "selected" : ""}>${a}</option>`).join("")}</select></div>
      <div class="field"><label for="j-why">Why do you want to join?</label><textarea id="j-why" name="Why join" rows="3"></textarea></div>
      <div class="field"><label for="j-links">Portfolio / GitHub / LinkedIn</label><input id="j-links" name="Links" placeholder="Optional" /></div>
      <div class="form-foot">
        <button class="btn btn-primary" type="submit">Prepare application ${arrow}</button>
        <p class="small muted">Opens your email app with the application filled in, addressed to ${esc(SITE.email)}.</p>
      </div>
      <div class="form-msg" id="joinMsg" role="status" aria-live="polite"></div>
    </form>
  </section>`;
}

function pageContact(params) {
  const topics = { general: "General question", failure: "Submit a failure point", mentor: "Become a mentor or specialist", partner: "Partner with a project", press: "Press" };
  const t = params.get("topic") || "general";
  return `
  ${pageHead("Contact", "Contact", "For partnerships, mentoring, press, or to report a system that fails people.")}
  <section class="wrap section contact-grid">
    <form class="form" id="contactForm" novalidate>
      <div class="field"><label for="c-topic">Topic</label>
        <select id="c-topic" name="Topic">${Object.entries(topics).map(([k, v]) => `<option value="${v}" ${k === t ? "selected" : ""}>${v}</option>`).join("")}</select></div>
      <div class="grid2">
        <div class="field"><label for="c-name">Name <span class="req">*</span></label><input id="c-name" name="Name" required autocomplete="name" /></div>
        <div class="field"><label for="c-email">Email <span class="req">*</span></label><input id="c-email" name="Email" type="email" required autocomplete="email" /></div>
      </div>
      <div class="field"><label for="c-msg">Message <span class="req">*</span></label>
        <textarea id="c-msg" name="Message" rows="6" required placeholder="${t === "failure" ? "System · who struggles · the exact moment it breaks · what signal is lost" : ""}"></textarea></div>
      <div class="form-foot"><button class="btn btn-primary" type="submit">Prepare email ${arrow}</button></div>
      <div class="form-msg" id="contactMsg" role="status" aria-live="polite"></div>
    </form>
    <aside class="contact-side">
      <p class="label">Email</p>
      <p><a href="mailto:${SITE.email}">${SITE.email}</a></p>
      <p class="label">Partners</p>
      <p class="small muted">We distinguish Project Partners, Technical Mentors, Community Partners, Research Advisors and Supporting Organizations — see <a href="#/people">People</a>.</p>
    </aside>
  </section>`;
}

function mountMailForm(formSel, msgSel, subject) {
  const form = $(formSel);
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const bad = $$("[required]", form).filter((el) => !el.value.trim() || (el.type === "email" && !/^\S+@\S+\.\S+$/.test(el.value)));
    $$(".field", form).forEach((f) => f.classList.remove("invalid"));
    bad.forEach((el) => el.closest(".field").classList.add("invalid"));
    if (bad.length) {
      $(msgSel).textContent = `Please complete ${bad.length} required field${bad.length > 1 ? "s" : ""}.`;
      bad[0].focus();
      return;
    }
    const body = $$("input, textarea, select", form)
      .filter((el) => el.value.trim())
      .map((el) => `${el.name}:\n${el.value.trim()}\n`)
      .join("\n");
    const subj = typeof subject === "function" ? subject(form) : subject;
    $(msgSel).innerHTML = `Your email app should open now. If it doesn't, send the text to <a href="mailto:${SITE.email}">${SITE.email}</a>. <button type="button" class="linkbtn" id="copyBtn">Copy text</button>`;
    $("#copyBtn").onclick = () => navigator.clipboard?.writeText(body).then(() => ($("#copyBtn").textContent = "Copied"));
    location.href = `mailto:${SITE.email}?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  });
}

function pageNotFound() {
  return `${pageHead("404", "This page failed its user.", `We'll document it. Meanwhile, <a href="#/">go home</a>.`)}`;
}

/* ---------- Router ---------- */

const ROUTES = [
  [/^\/?$/, () => pageHome()],
  [/^\/method$/, (m, q) => pageMethod(q), mountMethod],
  [/^\/projects$/, (m, q) => pageProjects(q)],
  [/^\/projects\/([\w-]+)$/, (m) => pageProject(m[1]), mountProject],
  [/^\/failure-map$/, (m, q) => pageFailureMap(q), mountFailureMap],
  [/^\/contexts$/, () => pageContexts()],
  [/^\/fieldwork$/, (m, q) => pageFieldwork(q)],
  [/^\/impact$/, () => pageImpact()],
  [/^\/people$/, () => pagePeople()],
  [/^\/partners$/, () => pagePeople(), () => $("#partners")?.scrollIntoView()],
  [/^\/resources$/, () => pageResources()],
  [/^\/join$/, (m, q) => pageJoin(q), () => mountMailForm("#joinForm", "#joinMsg", (f) => `AAYAHCE application — ${$("#j-name", f).value.trim()}`)],
  [/^\/contact$/, (m, q) => pageContact(q), () => mountMailForm("#contactForm", "#contactMsg", (f) => `AAYAHCE — ${$("#c-topic", f).value}`)],
];

function mountMethod() {
  const tabs = $$(".mstep");
  const select = (id, focus) => {
    tabs.forEach((t) => t.setAttribute("aria-selected", t.dataset.step === id));
    $$(".mpanel").forEach((p) => (p.hidden = p.id !== `panel-${id}`));
    if (focus) $(`#tab-${id}`).focus();
  };
  tabs.forEach((t, i) => {
    t.addEventListener("click", () => select(t.dataset.step));
    t.addEventListener("keydown", (e) => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (d) select(tabs[(i + d + tabs.length) % tabs.length].dataset.step, true);
    });
  });
}

function mountProject() {
  const links = $$(".toc a");
  const obs = new IntersectionObserver(
    (entries) => entries.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${en.target.id}`));
    }),
    { rootMargin: "-30% 0px -60% 0px" }
  );
  $$(".psec").forEach((s) => obs.observe(s));
}

function render() {
  const raw = location.hash.slice(1) || "/";
  const [path, qs] = raw.split("?");
  const params = new URLSearchParams(qs || "");
  let hit = null;
  for (const [re, view, mount] of ROUTES) {
    const m = path.match(re);
    if (m) { hit = [view(m, params), mount]; break; }
  }
  const app = $("#app");
  app.innerHTML = hit ? hit[0] : pageNotFound();
  hit?.[1]?.();
  window.scrollTo(0, 0);

  const section = "/" + (path.split("/")[1] || "");
  $$("#nav a").forEach((a) => a.classList.toggle("active", section !== "/" && a.getAttribute("href") === "#" + section));
  document.title = (app.querySelector("h1")?.textContent.trim().slice(0, 60) || "AAYAHCE") + (path === "/" ? "" : " · AAYAHCE");
  if (path === "/") document.title = "AAYAHCE — Human-Centered Engineering";
  closeMenu();
}

/* In-page anchors (project TOC) shouldn't trigger the router. */
document.addEventListener("click", (e) => {
  const a = e.target.closest("a[data-scroll]");
  if (!a) return;
  e.preventDefault();
  $(a.getAttribute("href"))?.scrollIntoView({ behavior: "smooth", block: "start" });
});

const menuBtn = $("#menuBtn");
function closeMenu() {
  document.body.classList.remove("menu-open");
  menuBtn.setAttribute("aria-expanded", "false");
}
menuBtn.addEventListener("click", () => {
  const open = document.body.classList.toggle("menu-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

window.addEventListener("hashchange", render);
render();
