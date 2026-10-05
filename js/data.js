/* =========================================================================
   AAYAHCE — site content
   Every page renders from this file. To publish new work, add an entry
   here; counts on the Impact page are derived from these records, so a
   number only appears once something documented backs it.
   ========================================================================= */

const SITE = {
  name: "AAYAHCE",
  full: "American–Azerbaijani Youth Association for Human-Centered Engineering",
  // TODO: replace with the association's real inbox before going live.
  email: "hello@aayahce.org",
};

/* ---------- Method ---------- */
const METHOD = [
  {
    id: "observe",
    name: "Observe",
    verb: "Watch the system in use",
    body:
      "Teams go to where the system is actually used — a counter, a loom, a clinic waiting room — and watch before they ask. The goal is to see what people do, not what the manual says they do.",
    output: "Field notes, photos, a timeline of one real interaction",
  },
  {
    id: "map",
    name: "Map the Failure",
    verb: "Find the exact moment it breaks",
    body:
      "Every interaction is broken into steps. The team marks the single step where the system stops working for someone, and names the signal that gets lost there — speech, pressure, instructions, movement, cultural expectation.",
    output: "Failure-point map, one entry in the Failure Map",
  },
  {
    id: "codesign",
    name: "Co-Design",
    verb: "Design with, not for",
    body:
      "The people affected sit in the design session. Specialists join where the stakes need them. Requirements are written in the user's words first and translated into engineering terms second.",
    output: "Requirements list traced to real quotes and observations",
  },
  {
    id: "prototype",
    name: "Prototype",
    verb: "Build the smallest useful change",
    body:
      "Not the biggest possible product — the smallest intervention that could plausibly reduce the failure. Cheap, fast and honest about what it does not do yet.",
    output: "Working prototype, bill of materials, build notes",
  },
  {
    id: "test",
    name: "Test",
    verb: "Put it back in the real environment",
    body:
      "Prototypes are tested where the failure happened, with the people who experienced it. Bench tests come first so that nobody is asked to test something unsafe or unfinished.",
    output: "Test protocol, consent forms, session records",
  },
  {
    id: "measure",
    name: "Measure",
    verb: "Compare before and after",
    body:
      "A baseline is recorded before the intervention. The same measure is taken after. If nothing changed, that result is published too.",
    output: "Before/after table with the method stated",
  },
  {
    id: "iterate",
    name: "Iterate",
    verb: "Change what failed, then document it",
    body:
      "Each version records what did not work and what was changed because of it. Failed prototypes are part of the record, not something to hide.",
    output: "Iteration log, updated project page",
  },
];

/* ---------- 10-field framework ---------- */
const FRAMEWORK = [
  ["system", "System", "What existing environment, service, product or process are we studying?"],
  ["intendedUser", "Intended user", "Who was the system originally designed for?"],
  ["overlookedUser", "Overlooked user", "Who experiences difficulty, exclusion, confusion, discomfort or extra effort?"],
  ["failurePoint", "Failure point", "At what exact moment does the system stop working well for that person?"],
  ["lostSignal", "Lost signal", "What information is not being communicated correctly?"],
  ["intervention", "Intervention", "What is the smallest realistic change that could reduce that failure?"],
  ["testing", "Testing", "How is the intervention tested with real users?"],
  ["measurement", "Before / after", "What changed after the intervention?"],
  ["iteration", "Iteration", "What failed in the prototype and what was changed?"],
  ["transferability", "Transferability", "Could it work somewhere else, or would it need to be redesigned?"],
];

/* ---------- Projects ---------- */
// status: "Concept" | "Prototype" | "Pilot" | "Deployed"
const PROJECTS = [
  {
    slug: "rehand-loom",
    name: "ReHand Loom",
    tagline: "Measuring a weaver's hand strain without getting in the way of the weave.",
    area: "Rehabilitation",
    tags: ["Cultural Heritage", "Human Factors", "Healthcare"],
    status: "Pilot",
    location: "Azerbaijan · rural weaving regions",
    year: "2026",
    cover: "images/rehand/hero-prototype.jpg",
    coverAlt: "A carpet weaver wearing the ReHand Loom sensor glove at the loom while team members read live data on a laptop",
    framework: {
      system: "Occupational health support for traditional carpet weavers.",
      intendedUser: "Patients who can travel to a city clinic for periodic in-person assessment.",
      overlookedUser: "Rural weavers — mostly women — whose early hand symptoms go unassessed.",
      failurePoint: "Early numbness and fatigue are normalised as \"just tired hands\" because specialist follow-up requires costly travel.",
      lostSignal: "Movement and grip pressure during real work never reach a specialist.",
      intervention: "A sensor glove that records flexion, grip and wrist motion during weaving and turns it into a session report for remote review.",
      testing: "Bench calibration, controlled movements, wearability trials with weavers, specialist co-design.",
      measurement: "124 of 200 participants received individualised guidance from structured session reports.",
      iteration: "6 co-design cycles from field observation, weaver feedback and specialist consultation.",
      transferability: "The sensing transfers to other repetitive hand crafts; the follow-up model depends on local coordinators and must be rebuilt per region.",
    },
    problem:
      "Azerbaijani carpet weaving is UNESCO-listed intangible heritage and a family livelihood across rural regions. It demands years of repetitive knotting, cutting and sustained wrist positioning. Early symptoms — numbness, tingling, fatigue — are easy to dismiss. Left alone they can progress toward carpal-tunnel-type dysfunction and lasting loss of grip and fine motor control, while specialist care stays concentrated in cities.",
    users:
      "Carpet weavers and traditional-craft masters in rural regions, regional coordinators who run sessions locally, and rehabilitation specialists who review reports remotely.",
    fieldwork: [
      "Observation of weavers' hand positions and work rhythm at the loom.",
      "Occupational-therapy consultation and WHO assistive-technology guidance used to set requirements.",
      "Live demonstration on a working weaver at the Azerbaijan Carpet Museum.",
    ],
    failure:
      "The data that matters — how the hand actually moves and loads during hours of weaving — is never captured. A clinic visit sees a resting hand, once, far from the loom. A glove that captures the motion is useless if it interferes with the craft, so the second failure to design around was the device itself.",
    prototype:
      "A glove with two flex sensors (10 kΩ dividers, scalable to five), an MPU6050 IMU for wrist angle and motion, and a thin-film pressure sensor as a grip proxy. An ESP32 buffers each session offline and streams it over Bluetooth LE to an offline-first, Azerbaijani-first Flutter app with guided exercises, progress tracking and a symptom diary.",
    iterations: [
      { v: "Loop", what: "Closed loop defined: calibrate → capture → process → review → guide." },
      { v: "Fit", what: "Wearability and calibration time evaluated with real weavers at the loom." },
      { v: "Review", what: "Specialists review trends and flagged patterns — never raw signals — after co-design sessions refined outputs and thresholds." },
      { v: "6×", what: "Six co-design iterations completed from field observation, weaver feedback and specialist consultation." },
    ],
    testing:
      "Bench calibration of sensor range, drift and repeatability before any human trial; known movements compared against recorded signals; comfort and fit with weavers; specialist co-design of thresholds. Pilot protocol: 15–25 weavers, 6–8 weeks, 2–3 villages, measured against each weaver's own baseline at week 0, 4 and 8.",
    impact: [
      { n: "200", label: "Weavers and craft masters engaged in the expanded pilot" },
      { n: "124", label: "Participants given individualised guidance from session reports" },
      { n: "7", label: "Rehabilitation, biomechanics and ergonomics professionals reviewing reports" },
      { n: "50", label: "Regional staff trained in setup, calibration and secure data transfer" },
      { n: "8", label: "Sessions run independently by trained partners in 3 regions" },
      { n: "5", label: "Regions of Azerbaijan reached" },
    ],
    impactSource: "Ministry of Culture of the Republic of Azerbaijan, Letter of Appreciation, 2026.",
    // Feeds the Impact page. Leave a key out rather than estimate it.
    metrics: { testers: 200, prototypes: 1, iterations: 6, communities: 5, specialists: 7, independent: 8 },
    team: ["youssef-el-haroun", "ilyas-taghiyev", "mikayil-ahmadbayli"],
    docs: [
      { type: "Schematic", label: "Circuit schematic (KiCad) — flex dividers, IMU, ESP32" },
      { type: "Poster", label: "Research poster — Azerbaijan Carpet Museum, 2026" },
      { type: "Letter", label: "Ministry of Culture letter of appreciation (on request)" },
    ],
    gallery: [
      ["images/rehand/gallery-fitting.jpg", "Fitting the glove on a working weaver at the loom"],
      ["images/rehand/carpet-weaver.jpeg", "Live sensor data on the laptop while the weaver wears the glove"],
      ["images/rehand/weaver-loom.jpg", "Weaving with the prototype — the device must not change the craft"],
      ["images/rehand/gallery-team.jpg", "The team with the research poster, Azerbaijan Carpet Museum"],
      ["images/rehand/gallery-visitors.jpg", "Presenting the project to museum visitors"],
      ["images/rehand/gallery-elders.jpg", "Conversations with visitors and craft specialists"],
      ["images/rehand/gallery-museum-poster.jpg", "Research poster"],
    ],
    disclaimer: "Monitoring and rehabilitation support — not a medical diagnosis device.",
  },
  {
    slug: "soleshift",
    name: "SoleShift",
    tagline: "Low-cost plantar-pressure screening that keeps the specialist in the loop.",
    area: "Healthcare",
    tags: ["Accessibility", "Human Factors"],
    status: "Prototype",
    location: "Azerbaijan · schools (planned)",
    year: "2026",
    cover: "images/soleshift/proto-sensor-array.jpg",
    coverAlt: "Eight square force-sensitive pressure pads fanned out from a breadboard wired to a laptop",
    framework: {
      system: "Foot assessment for children — mostly done by eye, by hand, or only after symptoms appear.",
      intendedUser: "Families who already suspect a problem and can reach an orthopaedic specialist.",
      overlookedUser: "Children with no symptoms yet, in schools and regions without specialist screening.",
      failurePoint: "Nobody looks until something hurts; by then correction is slower and more expensive.",
      lostSignal: "How load is distributed across the foot — invisible without instrumentation.",
      intervention: "A portable pressure-pad platform that measures relative loading across foot regions and produces a plain-language report.",
      testing: "Bench calibration channel by channel; a single consented school screening day is planned as the first pilot.",
      measurement: "Not yet measured. Pilot results will be published only once they exist.",
      iteration: "8 logged prototype steps, from the first breadboard FSR array to per-channel threshold calibration.",
      transferability: "Hardware is cheap and portable; consent, referral and school access rules differ by country and must be rebuilt locally.",
    },
    problem:
      "Foot problems in children are cheap to catch early and expensive to catch late. Specialist foot-pressure assessment uses costly equipment concentrated in clinics, so most children are never measured unless something already hurts.",
    users:
      "Children and parents, schools hosting screening days, and partner orthopaedic specialists who interpret any flagged report.",
    fieldwork: [
      "Bench testing of pad placement and response with hands-on loading.",
      "Planned: one full screening day at one school, with written parental consent.",
    ],
    failure:
      "Screening and diagnosis are collapsed into one expensive clinical step. Separating them — cheap measurement first, specialist interpretation only where it is needed — removes the barrier without pretending the device is a doctor.",
    prototype:
      "Eight force-sensitive resistor pads read by an ESP32 dev module and streamed over serial at 115200 baud. A rule-based pipeline reduces readings to relative regional loading. Described honestly as a measurement pipeline, not \"diagnostic AI\".",
    iterations: [
      { v: "P01", what: "Eight-pad FSR array wired to the first breadboard prototype." },
      { v: "P02", what: "Live pad output streamed over serial during a debug session." },
      { v: "P03", what: "Firmware flashed to the ESP32 dev module." },
      { v: "P04", what: "Channel wiring finalised before fixing the array to a footplate." },
      { v: "P05", what: "Early hands-on testing of pad placement and response." },
      { v: "P06", what: "Signal routing on the breadboard reworked." },
      { v: "P07", what: "Individual pads prepared for calibration." },
      { v: "P08", what: "Pad thresholds read and calibrated channel by channel." },
    ],
    testing:
      "Current: bench calibration per channel. Next: a single school screening day — no scan without written parental consent, a separate consent to share any report, anonymised IDs by default, and data deleted on request.",
    impact: [],
    impactSource: "Pilot not yet run. Metrics will be published here only after a real screening day.",
    metrics: { prototypes: 1, iterations: 8 },
    team: [],
    docs: [
      { type: "Log", label: "Prototype iteration log P01–P08" },
      { type: "Form", label: "Parental consent form" },
    ],
    gallery: [
      ["images/soleshift/proto-testing-hands.jpg", "Hands-on pad testing with firmware open on the laptop"],
      ["images/soleshift/proto-serial-monitor.jpg", "Breadboard signal routing"],
      ["images/soleshift/proto-calibration.jpg", "Per-channel calibration"],
      ["images/soleshift/proto-pads-closeup.jpg", "Pads prepared for calibration"],
      ["images/soleshift/proto-array-wiring.jpg", "Array wiring"],
      ["images/soleshift/proto-wiring-detail.jpg", "Wiring detail"],
    ],
    disclaimer: "Screening, not diagnosis. A qualified specialist interprets every flagged result.",
  },
  {
    slug: "sessiz-sifaris",
    name: "Səssiz Sifariş",
    tagline: "Fast-food ordering that doesn't assume the customer can speak.",
    area: "Accessibility",
    tags: ["Public Space", "Human Factors"],
    status: "Concept",
    location: "Baku, Azerbaijan",
    year: "—",
    cover: null,
    coverAlt: "",
    framework: {
      system: "Counter ordering in fast-food restaurants.",
      intendedUser: "Customers who can place an order by speaking to a cashier.",
      overlookedUser: "Customers with speech or hearing barriers, or who don't share the cashier's language.",
      failurePoint: "The first step of the interaction — ordering begins with a spoken exchange.",
      lostSignal: "The customer's order, modifications and questions.",
      intervention: "A visual ordering interface the customer can complete independently.",
      testing: "To be defined with users before the first prototype.",
      measurement: "Planned: time to complete an order and number of clarifications needed, before and after.",
      iteration: "Not started.",
      transferability: "Strong candidate for One Problem, Two Contexts — menus, payment and staff norms differ between Baku and U.S. chains.",
    },
    problem:
      "Ordering at a counter assumes a fast spoken exchange. For a customer who cannot rely on speech, the system technically works for everyone else and quietly fails at the very first step.",
    users:
      "Customers with communication barriers, and the counter staff who currently improvise workarounds.",
    fieldwork: ["Not yet logged. First step: observation at partner restaurants."],
    failure:
      "Ordering begins with spoken communication. Everything after that step — payment, pickup — already works visually.",
    prototype: "Not yet built.",
    iterations: [],
    testing: "To be defined.",
    impact: [],
    impactSource: "No measurements yet.",
    metrics: {},
    team: [],
    docs: [],
    gallery: [],
    disclaimer: null,
  },
];

/* ---------- Failure Map ---------- */
// status: "Addressed" (a project has an intervention) | "In progress" | "Open" (waiting for a team)
const FAILURE_CATEGORIES = [
  "Accessibility", "Rehabilitation", "Healthcare", "Public Space",
  "Education", "Cultural Heritage", "Human Factors", "Environmental Systems",
];

const FAILURES = [
  {
    id: "F-001", category: "Accessibility", status: "In progress",
    system: "Restaurant ordering", user: "Customer with a communication barrier",
    failure: "Spoken interaction required to start an order",
    signal: "The customer's order and modifications",
    intervention: "Visual ordering interface", project: "sessiz-sifaris",
    result: "Before/after measurement planned",
  },
  {
    id: "F-002", category: "Rehabilitation", status: "Addressed",
    system: "Occupational hand-health follow-up", user: "Rural carpet weaver",
    failure: "Early strain normalised; specialist only reachable by travel",
    signal: "Hand movement and grip pressure during real work",
    intervention: "Sensor glove + remote specialist review", project: "rehand-loom",
    result: "124 / 200 participants received individualised guidance",
  },
  {
    id: "F-003", category: "Human Factors", status: "Addressed",
    system: "Wearable hand monitoring", user: "Weaver doing fine knotting work",
    failure: "Measurement hardware interferes with natural hand movement",
    signal: "Natural movement — altered by the device itself",
    intervention: "Iterative glove fitting with weavers at the loom", project: "rehand-loom",
    result: "6 co-design iterations",
  },
  {
    id: "F-004", category: "Healthcare", status: "In progress",
    system: "Paediatric foot assessment", user: "Child with no symptoms yet",
    failure: "Nobody measures until something hurts",
    signal: "Load distribution across the foot",
    intervention: "Low-cost plantar-pressure screening", project: "soleshift",
    result: "Pilot not yet run",
  },
  {
    id: "F-005", category: "Public Space", status: "Open",
    system: "Self-service public kiosk", user: "First-time user",
    failure: "Instructions make sense to the designer, not to a first-time user",
    signal: "What to do next",
    intervention: null, project: null, result: null,
  },
  {
    id: "F-006", category: "Healthcare", status: "Open",
    system: "Health or accessibility service transferred between countries", user: "Users in the receiving context",
    failure: "A system that works in one social or cultural context fails when copied directly into another",
    signal: "Cultural expectations about the interaction",
    intervention: null, project: null, result: null,
  },
];

/* ---------- One Problem, Two Contexts ---------- */
// Cases are labelled by stage. Nothing here is presented as a finding until fieldwork exists.
const CONTEXTS = [
  {
    id: "C-01",
    title: "Ordering without speaking",
    stage: "Proposed — fieldwork not started",
    project: "sessiz-sifaris",
    az: "Counter ordering is the default in many Baku restaurants. Questions for fieldwork: how often is the order spoken, what do staff do when it can't be, and which written or visual cues already exist?",
    us: "Many U.S. chains have added kiosks and app ordering. Questions: do those channels actually serve customers with communication barriers, or do they introduce new failures (reach, literacy, card-only payment)?",
    shared: "Getting an order across independently, without slowing the queue or needing someone to translate.",
    assumptions: "Infrastructure (kiosk availability), payment norms, staff training expectations, and how comfortable customers are asking for an alternative.",
    response: "Hypothesis: the visual ordering logic transfers; the hardware, menu structure and handoff to staff must be redesigned locally.",
  },
  {
    id: "C-02",
    title: "Repetitive strain in hand-intensive work",
    stage: "Open — seeking a U.S. team",
    project: "rehand-loom",
    az: "Documented through ReHand Loom: weavers in rural regions, specialist care in cities, early symptoms normalised.",
    us: "Open question for a U.S. team: which hand-intensive trades face the same gap, and how does access to occupational therapy change the failure?",
    shared: "Catching strain before it becomes permanent loss of function.",
    assumptions: "Insurance and access to occupational therapy, how the work is organised (home craft vs. employer), and who is trusted to give advice.",
    response: "To be decided after paired fieldwork.",
  },
];

/* ---------- Fieldwork log ---------- */
const FIELDWORK = [
  {
    date: "2026",
    location: "Azerbaijan Carpet Museum, Baku",
    activity: "Prototype testing & public demonstration",
    kind: "Testing",
    project: "rehand-loom",
    participants: "Working carpet weaver, museum staff, specialists, visitors; ReHand Loom team",
    learned: "The glove has to be fitted and calibrated around the weaver's actual posture at the loom, not a resting hand at a table.",
    changed: "Wearability and calibration time became explicit evaluation criteria with weavers.",
    image: "images/rehand/gallery-fitting.jpg",
  },
  {
    date: "2026",
    location: "Five regions of Azerbaijan",
    activity: "Regional partner training",
    kind: "Workshop",
    project: "rehand-loom",
    participants: "50 culture-institution staff, museum staff and local coordinators",
    learned: "The model only scales if sessions can run without the project team present.",
    changed: "8 standardised sessions were then run independently by trained partners in 3 regions.",
    image: null,
  },
  {
    date: "2026",
    location: "Workshop bench",
    activity: "Pressure-pad calibration",
    kind: "Prototype",
    project: "soleshift",
    participants: "SoleShift team",
    learned: "Pads respond differently channel to channel; a single global threshold is not reliable.",
    changed: "Calibration moved to per-channel thresholds (iteration P08).",
    image: "images/soleshift/proto-calibration.jpg",
  },
];

/* ---------- People ---------- */
const PEOPLE = [
  {
    id: "youssef-el-haroun",
    name: "Youssef El Haroun",
    role: "Co-founder · Hardware & Embedded Systems",
    kind: "Student",
    interest: "Human-centered engineering, wearables",
    project: "rehand-loom",
    bio: "Translates observations of how people work into measurable engineering requirements. Owns the wearable's architecture, sensor integration, calibration and redesign.",
  },
  {
    id: "ilyas-taghiyev",
    name: "Ilyas Taghiyev",
    role: "Co-founder · Digital Systems & Data",
    kind: "Student",
    interest: "Data systems, remote review tools",
    project: "rehand-loom",
    bio: "Builds the structure that turns raw sensor readings into readable session reports for trend comparison and remote specialist review.",
  },
  {
    id: "mikayil-ahmadbayli",
    name: "Mikayil Ahmadbayli",
    role: "Co-founder · Biomechanics & Rehabilitation",
    kind: "Student",
    interest: "Applied biomechanics, ergonomics",
    project: "rehand-loom",
    bio: "Chooses the physiologically meaningful parameters, shapes testing protocols, and connects technical output to strain prevention and specialist usefulness.",
  },
];

/* ---------- Partners ---------- */
// Only confirmed relationships go in `PARTNERS`. Recognition is listed separately.
const PARTNER_TYPES = [
  ["Project Partner", "Co-runs a specific project with a team."],
  ["Technical Mentor", "Reviews engineering decisions and prototypes."],
  ["Community Partner", "Gives access to the people and places where a system fails."],
  ["Research Advisor", "Advises on methods, ethics and measurement."],
  ["Supporting Organization", "Provides space, materials or funding."],
];
const PARTNERS = [
  { name: "Azerbaijan Carpet Museum", type: "Community Partner", project: "rehand-loom", note: "Hosted the ReHand Loom presentation and live prototype demonstration, 2026." },
];
const RECOGNITION = [
  { name: "Ministry of Culture, Republic of Azerbaijan", note: "Letter of Appreciation for ReHand Loom, 2026." },
];

/* ---------- Field Guide ---------- */
const GUIDE = [
  {
    id: "interview", n: "01", title: "Conducting a user interview",
    summary: "Ask about the last time, not the usual time.",
    points: [
      "Ask people to walk you through the most recent time they used the system. Specific memories are more accurate than generalisations.",
      "Prefer \"what happened next?\" over \"would you like…?\" — people are poor at predicting what they would use.",
      "Record exact words. A quote is evidence; your summary of it is an interpretation.",
      "End with: \"What should I have asked that I didn't?\"",
    ],
  },
  {
    id: "observe", n: "02", title: "Observing without leading",
    summary: "Watch first, ask second, never demonstrate.",
    points: [
      "Don't show the participant how to use something before you watch them try.",
      "Note workarounds — tape, written notes, a friend who helps. Each one marks a failure point.",
      "Time each step. The slow step is usually the interesting one.",
    ],
  },
  {
    id: "failure", n: "03", title: "Identifying failure points",
    summary: "Name the moment, the person and the lost signal.",
    points: [
      "Break the interaction into steps and mark the first one where someone needs help, waits, or gives up.",
      "Write it as: at [step], [person] cannot [action] because [signal] is lost.",
      "If you can't name the person, you haven't found the failure yet.",
    ],
  },
  {
    id: "prototype", n: "04", title: "Building a first prototype",
    summary: "Smallest useful change, cheapest honest version.",
    points: [
      "Paper, cardboard and a breadboard are valid prototypes.",
      "Decide in advance what question this prototype answers.",
      "Write down what it does not do, so testers aren't misled.",
    ],
  },
  {
    id: "usability", n: "05", title: "Usability testing",
    summary: "Give a task, then stay quiet.",
    points: [
      "Give a realistic task (\"order a meal without a drink\") and do not help unless the participant is stuck or at risk.",
      "Record task completion, time, and every point of hesitation.",
      "Five participants find most of the obvious problems; test again after each fix.",
    ],
  },
  {
    id: "measure", n: "06", title: "Measuring before / after",
    summary: "Baseline first, same method after.",
    points: [
      "Choose one measure tied to the failure point — time, errors, help requests, discomfort scores.",
      "Record the baseline before any intervention, using the same method you'll use after.",
      "Publish the result even when nothing changed.",
    ],
  },
  {
    id: "communities", n: "07", title: "Working with vulnerable or overlooked communities",
    summary: "Consent, dignity, and the right to stop.",
    points: [
      "Get informed consent in the participant's language. For minors, get parental consent and the child's own agreement.",
      "Anonymise by default. Never publish a face or a name without explicit permission.",
      "Bring the results back to the people who gave you their time.",
    ],
  },
  {
    id: "ethics", n: "08", title: "Engineering ethics",
    summary: "Say what the device is not.",
    points: [
      "A screening tool is not a diagnosis. A monitoring device is not treatment. Say so on every page.",
      "Keep qualified specialists in the loop wherever health or safety is involved.",
      "Only report numbers that actually happened.",
    ],
  },
  {
    id: "failed", n: "09", title: "Documenting failed prototypes",
    summary: "A failed version is data.",
    points: [
      "For each version record: what we expected, what happened, what we changed.",
      "Keep photos of the broken versions — they explain the final design better than the final design does.",
    ],
  },
];
