import { useState, useEffect, useRef } from "react";

// Google Fonts — loaded via useEffect to avoid SSR issues
const FONT_URL = "https://fonts.googleapis.com/css2?family=Alegreya:ital,wght@0,400;0,700;1,400&family=Newsreader:ital,wght@0,400;0,600;1,400&display=swap";

// ─────────────────────────────────────────────────────────────────────────────
// CITY DATABASE — 156 cities scored across 4 CZI dimensions
// Systems Familiarity | Language Approachability | Privilege Visibility | Cultural Framework
// ─────────────────────────────────────────────────────────────────────────────

const CITY_DATABASE = {
  "London, UK":              { s:25, l:22, p:22, c:25 },
  "Paris, France":           { s:23, l:22, p:22, c:20 },
  "Rome, Italy":             { s:20, l:20, p:20, c:15 },
  "Barcelona, Spain":        { s:22, l:22, p:20, c:18 },
  "Madrid, Spain":           { s:22, l:22, p:20, c:18 },
  "Amsterdam, Netherlands":  { s:24, l:22, p:23, c:24 },
  "Berlin, Germany":         { s:24, l:12, p:22, c:22 },
  "Munich, Germany":         { s:24, l:12, p:23, c:22 },
  "Vienna, Austria":         { s:24, l:12, p:23, c:22 },
  "Zurich, Switzerland":     { s:25, l:14, p:25, c:24 },
  "Lisbon, Portugal":        { s:21, l:20, p:18, c:18 },
  "Porto, Portugal":         { s:20, l:20, p:17, c:17 },
  "Athens, Greece":          { s:18, l:10, p:18, c:14 },
  "Santorini, Greece":       { s:18, l:12, p:20, c:15 },
  "Dublin, Ireland":         { s:25, l:25, p:22, c:25 },
  "Edinburgh, Scotland":     { s:25, l:25, p:22, c:25 },
  "Brussels, Belgium":       { s:24, l:20, p:23, c:23 },
  "Copenhagen, Denmark":     { s:25, l:22, p:24, c:24 },
  "Stockholm, Sweden":       { s:25, l:22, p:24, c:24 },
  "Oslo, Norway":            { s:25, l:22, p:25, c:24 },
  "Helsinki, Finland":       { s:24, l:8,  p:24, c:22 },
  "Reykjavik, Iceland":      { s:24, l:20, p:24, c:22 },
  "Mallorca, Spain":         { s:22, l:22, p:21, c:20 },
  "Amalfi Coast, Italy":     { s:20, l:20, p:21, c:15 },
  "Tuscany, Italy":          { s:20, l:20, p:21, c:16 },
  "French Riviera":          { s:23, l:20, p:24, c:20 },
  "Malta":                   { s:23, l:23, p:20, c:20 },
  "Prague, Czech Rep.":      { s:22, l:10, p:16, c:18 },
  "Budapest, Hungary":       { s:20, l:8,  p:15, c:17 },
  "Krakow, Poland":          { s:20, l:8,  p:14, c:17 },
  "Dubrovnik, Croatia":      { s:19, l:8,  p:17, c:15 },
  "Split, Croatia":          { s:18, l:8,  p:16, c:14 },
  "Tallinn, Estonia":        { s:22, l:8,  p:18, c:18 },
  "New York, USA":           { s:25, l:25, p:20, c:25 },
  "Los Angeles, USA":        { s:25, l:25, p:20, c:25 },
  "Miami, USA":              { s:25, l:25, p:20, c:24 },
  "Hawaii, USA":             { s:25, l:25, p:20, c:23 },
  "Toronto, Canada":         { s:25, l:25, p:22, c:25 },
  "Vancouver, Canada":       { s:25, l:25, p:22, c:25 },
  "Montreal, Canada":        { s:25, l:22, p:22, c:24 },
  "Mexico City":             { s:16, l:18, p:10, c:12 },
  "Cancún, Mexico":          { s:20, l:20, p:14, c:16 },
  "Tulum, Mexico":           { s:18, l:18, p:12, c:14 },
  "Oaxaca, Mexico":          { s:14, l:16, p:8,  c:10 },
  "Cabo San Lucas":          { s:22, l:20, p:18, c:18 },
  "Turks & Caicos":          { s:22, l:25, p:22, c:22 },
  "Bahamas":                 { s:22, l:25, p:20, c:21 },
  "St. Barts":               { s:22, l:20, p:24, c:22 },
  "Barbados":                { s:22, l:25, p:18, c:20 },
  "Jamaica":                 { s:18, l:24, p:14, c:16 },
  "Dominican Republic":      { s:16, l:18, p:12, c:14 },
  "Cuba, Havana":            { s:10, l:16, p:6,  c:8  },
  "Cartagena, Colombia":     { s:14, l:16, p:10, c:10 },
  "Medellín, Colombia":      { s:15, l:16, p:10, c:11 },
  "Buenos Aires, Argentina": { s:18, l:18, p:14, c:16 },
  "Patagonia, Argentina":    { s:12, l:16, p:8,  c:8  },
  "Santiago, Chile":         { s:18, l:18, p:12, c:14 },
  "Lima, Peru":              { s:15, l:16, p:8,  c:8  },
  "Cusco, Peru":             { s:10, l:14, p:4,  c:6  },
  "Machu Picchu, Peru":      { s:10, l:14, p:5,  c:6  },
  "Amazon, Brazil/Peru":     { s:4,  l:12, p:2,  c:3  },
  "Rio de Janeiro":          { s:15, l:14, p:8,  c:12 },
  "Galápagos, Ecuador":      { s:10, l:14, p:8,  c:6  },
  "La Paz, Bolivia":         { s:8,  l:14, p:3,  c:5  },
  "Costa Rica":              { s:16, l:18, p:10, c:12 },
  "Tokyo, Japan":            { s:22, l:0,  p:22, c:2  },
  "Kyoto, Japan":            { s:20, l:0,  p:21, c:2  },
  "Osaka, Japan":            { s:21, l:0,  p:21, c:2  },
  "Seoul, South Korea":      { s:22, l:0,  p:20, c:4  },
  "Shanghai, China":         { s:18, l:0,  p:18, c:4  },
  "Beijing, China":          { s:15, l:0,  p:16, c:3  },
  "Hong Kong":               { s:23, l:18, p:22, c:8  },
  "Taipei, Taiwan":          { s:20, l:5,  p:20, c:5  },
  "Singapore":               { s:25, l:22, p:22, c:10 },
  "Bali, Indonesia":         { s:14, l:12, p:10, c:4  },
  "Bangkok, Thailand":       { s:16, l:0,  p:12, c:4  },
  "Chiang Mai, Thailand":    { s:14, l:0,  p:10, c:3  },
  "Phuket, Thailand":        { s:16, l:5,  p:14, c:6  },
  "Hanoi, Vietnam":          { s:10, l:0,  p:5,  c:3  },
  "Ho Chi Minh City":        { s:12, l:0,  p:6,  c:3  },
  "Hoi An, Vietnam":         { s:10, l:5,  p:6,  c:3  },
  "Siem Reap, Cambodia":     { s:8,  l:5,  p:3,  c:2  },
  "Yangon, Myanmar":         { s:6,  l:5,  p:3,  c:2  },
  "Kuala Lumpur":            { s:20, l:18, p:16, c:8  },
  "Manila, Philippines":     { s:14, l:20, p:6,  c:8  },
  "Luang Prabang, Laos":     { s:8,  l:5,  p:3,  c:2  },
  "Mumbai, India":           { s:12, l:18, p:4,  c:5  },
  "Delhi, India":            { s:8,  l:16, p:3,  c:4  },
  "Rajasthan, India":        { s:6,  l:12, p:2,  c:3  },
  "Kerala, India":           { s:8,  l:14, p:3,  c:4  },
  "Goa, India":              { s:14, l:18, p:8,  c:8  },
  "Colombo, Sri Lanka":      { s:10, l:16, p:5,  c:5  },
  "Kathmandu, Nepal":        { s:6,  l:10, p:2,  c:3  },
  "Himalayan Trek, Nepal":   { s:2,  l:8,  p:1,  c:2  },
  "Bhutan":                  { s:4,  l:6,  p:2,  c:2  },
  "Maldives":                { s:20, l:18, p:20, c:6  },
  "Dubai, UAE":              { s:23, l:18, p:22, c:6  },
  "Doha, Qatar":             { s:22, l:16, p:22, c:5  },
  "Jerusalem, Israel":       { s:18, l:12, p:16, c:6  },
  "Tel Aviv, Israel":        { s:22, l:16, p:20, c:10 },
  "Amman, Jordan":           { s:14, l:0,  p:10, c:4  },
  "Petra, Jordan":           { s:10, l:0,  p:8,  c:4  },
  "Marrakech, Morocco":      { s:10, l:5,  p:5,  c:3  },
  "Fes, Morocco":            { s:8,  l:5,  p:4,  c:3  },
  "Cairo, Egypt":            { s:8,  l:0,  p:6,  c:3  },
  "Luxor, Egypt":            { s:6,  l:0,  p:4,  c:2  },
  "Muscat, Oman":            { s:18, l:8,  p:18, c:5  },
  "Istanbul, Turkey":        { s:18, l:5,  p:14, c:6  },
  "Cappadocia, Turkey":      { s:14, l:5,  p:10, c:5  },
  "Cape Town, S. Africa":    { s:18, l:22, p:6,  c:12 },
  "Safari, Kenya":           { s:6,  l:15, p:0,  c:4  },
  "Nairobi, Kenya":          { s:10, l:18, p:2,  c:5  },
  "Safari, Tanzania":        { s:4,  l:12, p:0,  c:3  },
  "Zanzibar":                { s:8,  l:12, p:4,  c:3  },
  "Rwanda (gorilla trek)":   { s:8,  l:15, p:1,  c:3  },
  "Kigali, Rwanda":          { s:12, l:18, p:2,  c:5  },
  "Botswana (safari)":       { s:5,  l:15, p:1,  c:3  },
  "Dakar, Senegal":          { s:8,  l:12, p:2,  c:3  },
  "Accra, Ghana":            { s:8,  l:20, p:2,  c:4  },
  "Ethiopia":                { s:3,  l:0,  p:0,  c:2  },
  "Addis Ababa, Ethiopia":   { s:6,  l:5,  p:1,  c:2  },
  "Namibia":                 { s:8,  l:16, p:2,  c:4  },
  "Victoria Falls, Zambia":  { s:6,  l:18, p:1,  c:3  },
  "Madagascar":              { s:3,  l:5,  p:0,  c:1  },
  "Sydney, Australia":       { s:25, l:25, p:22, c:24 },
  "Melbourne, Australia":    { s:25, l:25, p:22, c:24 },
  "Auckland, New Zealand":   { s:25, l:25, p:22, c:24 },
  "Queenstown, NZ":          { s:24, l:25, p:22, c:23 },
  "Bora Bora":               { s:18, l:16, p:20, c:10 },
  "Fiji":                    { s:16, l:20, p:14, c:8  },
  "Papua New Guinea":        { s:2,  l:10, p:0,  c:1  },
  "Ulaanbaatar, Mongolia":   { s:4,  l:0,  p:2,  c:1  },
  "Mongolian Steppe":        { s:1,  l:0,  p:1,  c:1  },
  "Uzbekistan (Silk Road)":  { s:6,  l:0,  p:3,  c:2  },
  "Tbilisi, Georgia":        { s:14, l:0,  p:10, c:6  },
};

const CITY_LIST = Object.keys(CITY_DATABASE).sort();

function getCitySimilarity(name) {
  const c = CITY_DATABASE[name];
  if (!c) return 70;
  return c.s + c.l + c.p + c.c;
}

function calculateCZI(cities) {
  if (!cities.length) return 5;
  const avg = cities.reduce((a, city) => a + getCitySimilarity(city), 0) / cities.length;
  return Math.max(0.1, Math.min(9.9, +(10 - avg / 10).toFixed(1)));
}

function getCZIPattern(czi) {
  if (czi < 2)   return { name: "Western Echo Chamber",   color: "#C97B5A", label: "Echo Chamber" };
  if (czi < 3.5) return { name: "Safe + One Adventure",   color: "#D4A96A", label: "Limited Diversity" };
  if (czi < 5.5) return { name: "Intentional Variety",    color: "#C8A96E", label: "Moderate Diversity" };
  if (czi < 7.5) return { name: "Deliberate Discomfort",  color: "#7CB9A8", label: "Strong Diversity" };
  return           { name: "Full Immersion",               color: "#4A9B8A", label: "Exceptional Diversity" };
}

// ─── AGE MAP (from webinar slides 50-54) ────────────────────────────────────

const AGE_MAP = {
  "4-7": {
    stage: "Early Foundation",
    principle: "Build comfort with 'different' before pushing challenge",
    capabilities: {
      physical:   "Short hikes (1–2 hrs), basic swimming, playground confidence",
      cultural:   "Notices things are different but needs familiar anchor points",
      navigation: "Always with parents, can follow simple directions",
      language:   "Repeats phrases, learns through play",
      environment:"Points out differences but doesn't understand systems yet",
      communication: "Observes differences, asks 'why' questions",
    },
    exampleTrip: "Portugal — familiar infrastructure, slight cultural difference, manageable beaches",
    windowMsg: "This is the imprinting window. What feels 'normal' is being defined right now.",
  },
  "8-11": {
    stage: "Skill Building",
    principle: "Push boundaries while maintaining safety net",
    capabilities: {
      physical:   "Multi-day hikes, snorkeling, handles heat/cold for half-day periods",
      cultural:   "Eats unfamiliar food, adapts to different bathrooms, handles being stared at",
      navigation: "Navigates hotel independently, asks strangers for directions (with you nearby)",
      language:   "Attempts basic phrases, uses non-verbal communication",
      environment:"Connects cause/effect ('it's hot because we're near the equator')",
      communication: "Picks up social cues, can play with kids who don't speak English",
    },
    exampleTrip: "Costa Rica — wildlife, rainforest hikes, manageable Spanish, genuine nature immersion",
    windowMsg: "This is the highest-leverage period for building cultural comfort with a safety net still in place.",
  },
  "12-14": {
    stage: "Capability Acceleration",
    principle: "Prove capability through real challenge",
    capabilities: {
      physical:   "Week-long treks, altitude to 12–14K feet, full days in challenging conditions",
      cultural:   "Eats whatever is served, handles genuine discomfort (squat toilets, no wifi) for days",
      navigation: "City public transit alone with check-ins, handles money, problem-solves when lost",
      language:   "Functional communication in 1–2 languages, figures out needs without perfect grammar",
      environment:"Understands ecosystems as systems, connects human impact to environment",
      communication: "Reads room dynamics, adjusts to cultural context, builds rapport across language barriers",
    },
    exampleTrip: "Peru — Machu Picchu trek, Cusco markets, Amazon jungle, visible poverty, Spanish practice",
    windowMsg: "The most commonly wasted window. They're ready for real challenge — most families don't push hard enough.",
  },
  "15-16": {
    stage: "Mastery Phase",
    principle: "Final tests before they leave the house",
    capabilities: {
      physical:   "Plans and executes own adventure trips, manages risk appropriately",
      cultural:   "Thrives in unfamiliar contexts, comfortable being the minority",
      navigation: "Confident navigating foreign cities alone, handles emergencies calmly",
      language:   "Functional in 2–3 languages, comfortable not understanding everything",
      environment:"Thinks in systems, understands conservation complexity",
      communication: "Builds genuine relationships across difference, adapts style fluently",
    },
    exampleTrip: "Morocco — medina navigation alone, homestay, Sahara trek, visible as foreigner but manageable",
    windowMsg: "These are the final trips that shape who they become. The window closes at 18.",
  },
};

function getAgeWindow(age) {
  if (age <= 7)  return "4-7";
  if (age <= 11) return "8-11";
  if (age <= 14) return "12-14";
  return "15-16";
}

// ─── WORLD READINESS SELF-REPORT QUESTIONS ──────────────────────────────────

function getCapabilityQuestions(age) {
  const window = getAgeWindow(age);
  const map = AGE_MAP[window];
  
  if (window === "4-7") return [
    { id: "physical",       label: "Physical",        q: `Can ${"{name}"} handle a 1–2 hour hike or a full beach day without major meltdowns?` },
    { id: "cultural",       label: "Cultural",        q: `Does ${"{name}"} notice when things are different and stay curious rather than upset?` },
    { id: "language",       label: "Language",        q: `Does ${"{name}"} try to repeat phrases or communicate in playful ways with people who don't speak English?` },
    { id: "communication",  label: "Social",          q: `Can ${"{name}"} play and interact with kids who don't speak the same language?` },
  ];
  
  if (window === "8-11") return [
    { id: "physical",       label: "Physical",        q: `Can ${"{name}"} handle a multi-day trip with long physical days — hiking, snorkeling, being outdoors for hours?` },
    { id: "cultural",       label: "Cultural",        q: `Will ${"{name}"} try unfamiliar food and adapt to genuinely different environments (different bathrooms, no wifi, being stared at)?` },
    { id: "navigation",     label: "Navigation",      q: `Can ${"{name}"} navigate a hotel or a familiar area independently, and ask a stranger for help?` },
    { id: "language",       label: "Language",        q: `Does ${"{name}"} attempt basic phrases in other languages, even imperfectly?` },
    { id: "communication",  label: "Social",          q: `Can ${"{name}"} pick up social cues and connect with local kids across a language barrier?` },
  ];
  
  if (window === "12-14") return [
    { id: "physical",       label: "Physical",        q: `Can ${"{name}"} handle a week-long trek or multiple days in demanding physical conditions (altitude, heat, long days)?` },
    { id: "cultural",       label: "Cultural",        q: `Will ${"{name}"} handle genuine discomfort — eating whatever is served, no wifi for days, squat toilets — without it derailing the trip?` },
    { id: "navigation",     label: "Navigation",      q: `Can ${"{name}"} navigate public transit in an unfamiliar city alone (with check-ins), handle cash, and problem-solve when things go wrong?` },
    { id: "language",       label: "Language",        q: `Can ${"{name}"} communicate basic needs in 1–2 languages without relying on you to translate?` },
    { id: "environment",    label: "Environment",     q: `Does ${"{name}"} understand how ecosystems work and connect what they see to bigger systems (climate, poverty, conservation)?` },
    { id: "communication",  label: "Cross-Cultural",  q: `Can ${"{name}"} adjust their behavior to fit a cultural context and build genuine rapport across language and cultural differences?` },
  ];
  
  // 15-16
  return [
    { id: "physical",       label: "Physical",        q: `Can ${"{name}"} plan and lead their own physical adventure — managing logistics, risk, and the unexpected?` },
    { id: "cultural",       label: "Cultural",        q: `Does ${"{name}"} actively thrive in genuinely unfamiliar contexts — comfortable being the outsider, the minority, the one who doesn't understand?` },
    { id: "navigation",     label: "Navigation",      q: `Can ${"{name}"} navigate a foreign city completely alone, handle emergencies, and stay calm when plans fall apart?` },
    { id: "language",       label: "Language",        q: `Is ${"{name}"} functional in 2–3 languages and comfortable in situations where they don't understand everything?` },
    { id: "environment",    label: "Environment",     q: `Does ${"{name}"} think in systems — understanding how geography, climate, history and economics connect?` },
    { id: "communication",  label: "Cross-Cultural",  q: `Can ${"{name}"} build genuine relationships across cultural and linguistic difference — not just tolerate it, but connect?` },
  ];
}

function calculateWorldReadiness(scores) {
  const vals = Object.values(scores);
  if (!vals.length) return 5;
  return +(vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1);
}

function getReadinessLabel(wr, window) {
  const map = AGE_MAP[window];
  if (wr >= 7.5) return { label: "Above Age Expectation", color: "#7CB9A8", msg: `Strong developmental position for the ${map.stage} window. Focus on raising the ceiling, not closing gaps.` };
  if (wr >= 5)   return { label: "On Track", color: "#C8A96E", msg: `Tracking well for the ${map.stage} window. There's still room to accelerate before this window closes.` };
  if (wr >= 3)   return { label: "Gaps Emerging", color: "#D4A96A", msg: `Some meaningful gaps for the ${map.stage} window. These don't close themselves — they require intentional experiences.` };
  return           { label: "Significant Gaps", color: "#C97B5A", msg: `Meaningful gaps vs. ${map.stage} benchmarks. The window doesn't wait — strategic travel in the next 1–2 years is critical.` };
}

function getStrategyRecommendation(age, czi, wrScore, interests) {
  const window = getAgeWindow(age);
  const yearsTill18 = Math.max(0, 18 - age);
  
  const interest = interests?.trim() ? ` Given their interest in ${interests}, ` : " ";

  const strategies = {
    "4-7": {
      lowCZI: {
        urgency: "Foundation Window — Build the Baseline Now",
        text: `Ages 4–7 is when children build their definition of "normal."${interest}right now the highest-leverage move is experiencing environments that feel genuinely different — not just different countries, but different systems, languages you can't read, daily rhythms that don't match home. Not overwhelming — just foreign.`,
        destinations: ["Portugal (gentle entry)", "Japan (Tokyo — safe but radically different)", "Mexico (Oaxaca region — off resort track)"],
      },
      highCZI: {
        urgency: "Foundation Window — Maintain + Deepen",
        text: `Your family is already building strong diversity exposure at the right age.${interest}the priority now is ensuring the experiences aren't just witnessed but felt — staying longer, going deeper, finding the moments where 'different' becomes genuinely challenging and interesting, not just picturesque.`,
        destinations: ["East Africa (wildlife + visible contrast)", "India (sensory and cultural depth)", "Vietnam (genuine immersion, not resort)"],
      },
    },
    "8-11": {
      lowCZI: {
        urgency: "Skill-Building Window — Time to Push",
        text: `Ages 8–11 is when children can handle real challenge with a safety net.${interest}this is the moment to break out of the Western comfort zone — not to rough it, but to expose them to contexts where the systems don't work like home, the language is actually foreign, and poverty isn't hidden. This is when the real capability-building starts.`,
        destinations: ["Japan (cultural immersion, incredibly safe)", "Costa Rica (nature, Spanish, genuine wildness)", "Morocco (senses, medinas, different rhythm of life)"],
      },
      highCZI: {
        urgency: "Skill-Building Window — Accelerate Independence",
        text: `Diversity exposure is strong.${interest}the next layer is building genuine independence within these diverse contexts — navigating alone, ordering without help, solving problems without parents stepping in. The goal is capability, not just exposure.`,
        destinations: ["Tanzania (safari + Zanzibar — community connection)", "Peru (Cusco markets, Amazon)", "Bhutan or Nepal (genuine otherness)"],
      },
    },
    "12-14": {
      lowCZI: {
        urgency: "Critical Window — Act Now",
        text: `This is the most important developmental window and the most commonly wasted. Ages 12–14 are when challenge produces the deepest character formation — but it requires genuinely foreign contexts, not Western Europe for the fifth time.${interest}the time to act is now, before this window closes. Every year of delay in this age range costs developmental ground that's hard to recover.`,
        destinations: ["Peru (Inca Trail + Cusco + Amazon)", "India (Rajasthan or Kerala — genuine immersion)", "East Africa (community connection, visible contrast)"],
      },
      highCZI: {
        urgency: "Critical Window — Build Toward Mastery",
        text: `Strong diversity base. The next tier for this window is real solo capability — navigating foreign environments with progressively less parental scaffolding.${interest}the goal is experiences where they have to lead, decide, and figure things out. That's what produces the confidence that lasts.`,
        destinations: ["Mongolia (nomadic experience, genuine edge)", "Ethiopia or Senegal (West Africa immersion)", "Bolivia or Papua New Guinea (frontier experiences)"],
      },
    },
    "15-16": {
      lowCZI: {
        urgency: "Final Window — No Time to Waste",
        text: `This is it. The last meaningful developmental window before they leave. The gap between your current travel pattern and what this age requires is significant.${interest}the priority is concentrated, intense cultural immersion — experiences that prove capability, require real navigation, and put them in contexts where they are genuinely the outsider. These are the trips they carry into adulthood.`,
        destinations: ["India (independent city navigation)", "East Africa (leadership challenge)", "Morocco (homestay + Sahara — the Mahali Pazuri prototype for this window)"],
      },
      highCZI: {
        urgency: "Final Window — Prove It",
        text: `Strong foundation. The final window is about proof, not exposure. They've seen diverse contexts — now they need to operate in them independently.${interest}the right experiences are ones where they lead, decide under pressure, build relationships across cultural lines, and return with a story that's genuinely theirs. Not yours.`,
        destinations: ["Remote Bhutan or Mongolia (true edge)", "West Africa — Ghana or Senegal (deep community immersion)", "Amazon or high-altitude Bolivia (capability proof)"],
      },
    },
  };

  const windowStrategies = strategies[window];
  const isLowCZI = czi < 4;
  return isLowCZI ? windowStrategies.lowCZI : windowStrategies.highCZI;
}

// ─── COMPONENTS ──────────────────────────────────────────────────────────────

const green  = "#0d362b";   // deep forest green — primary accent
const cream  = "#faf9f5";   // off-white — page background
const black  = "#000000";   // text
const muted  = "#4a5e58";   // secondary text (dark green-grey)
const bord   = "#ddd8ce";   // subtle border
const light  = "#f0ece4";   // slightly darker cream for cards

// Legacy aliases so existing references still resolve
const gold = green;
const teal = muted;
const rust = green;
const dark = black;

function ScoreRing({ score, max = 10, size = 120, label, sublabel, color = green }) {
  const r = size / 2 - 10;
  const circ = 2 * Math.PI * r;
  const dash = (score / max) * circ;
  return (
    <div style={{ textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={bord} strokeWidth={7} />
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={7}
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
            style={{ transition: "stroke-dasharray 1.4s cubic-bezier(0.4,0,0.2,1)" }} />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ fontSize: size > 110 ? 28 : 22, fontFamily: "'Alegreya', serif", color, fontWeight: 700, lineHeight: 1 }}>{typeof score === 'number' ? score.toFixed(1) : score}</div>
          <div style={{ fontSize: 10, color: muted, marginTop: 2 }}>/ {max}</div>
        </div>
      </div>
      <div style={{ fontSize: 12, color: black, marginTop: 10, fontWeight: 600, letterSpacing: 0.5, fontFamily: "'Newsreader', serif" }}>{label}</div>
      {sublabel && <div style={{ fontSize: 11, color: muted, marginTop: 3, fontFamily: "'Newsreader', serif" }}>{sublabel}</div>}
    </div>
  );
}

function CityDropdown({ value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState(value || "");
  const ref = useRef();

  useEffect(() => {
    function handler(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const filtered = CITY_LIST.filter(c => c.toLowerCase().includes(search.toLowerCase()) && c !== value).slice(0, 9);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <input
        value={search}
        onChange={e => { setSearch(e.target.value); setOpen(true); if (!e.target.value) onChange(""); }}
        onFocus={() => setOpen(true)}
        placeholder={placeholder || "Search destination..."}
        style={{ width: "100%", background: "#fff", border: `1px solid ${value ? green : bord}`, borderRadius: 8, padding: "12px 16px", color: black, fontSize: 14, fontFamily: "'Newsreader', serif", boxSizing: "border-box", outline: "none" }}
      />
      {value && <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", width: 6, height: 6, background: gold, borderRadius: "50%" }} />}
      {open && filtered.length > 0 && (
        <div style={{ position: "absolute", top: "calc(100% + 4px)", left: 0, right: 0, background: "#fff", border: `1px solid ${bord}`, borderRadius: 8, zIndex: 200, overflow: "hidden", boxShadow: "0 8px 24px rgba(0,0,0,0.12)" }}>
          {filtered.map(c => (
            <div key={c} onClick={() => { onChange(c); setSearch(c); setOpen(false); }}
              style={{ padding: "10px 16px", cursor: "pointer", fontSize: 13, color: black, borderBottom: `1px solid ${bord}`, transition: "background 0.15s", fontFamily: "'Newsreader', serif" }}
              onMouseEnter={e => e.currentTarget.style.background = light}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
              {c}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RatingRow({ id, label, question, value, onChange }) {
  return (
    <div style={{ marginBottom: 20, padding: "18px 20px", background: "#fff", borderRadius: 10, border: `1px solid ${bord}` }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10, gap: 12 }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: green, marginBottom: 5, fontFamily: "'Newsreader', serif" }}>{label}</div>
          <div style={{ fontSize: 13, color: muted, lineHeight: 1.5, fontFamily: "'Newsreader', serif" }}>{question}</div>
        </div>
        {value > 0 && <div style={{ fontSize: 22, fontFamily: "'Alegreya', serif", color: green, minWidth: 32, textAlign: "right" }}>{value}</div>}
      </div>
      <div style={{ display: "flex", gap: 6 }}>
        {[1,2,3,4,5,6,7,8,9,10].map(n => (
          <button key={n} onClick={() => onChange(n)}
            style={{ flex: 1, height: 28, borderRadius: 4, border: `1px solid ${n <= (value||0) ? green : bord}`, cursor: "pointer", fontSize: 11, fontWeight: 600,
              background: n <= (value||0) ? green : "#fff",
              color: n <= (value||0) ? "#fff" : muted,
              transition: "all 0.15s" }}>
            {n}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 5 }}>
        <span style={{ fontSize: 10, color: muted, fontFamily: "'Newsreader', serif" }}>Not yet</span>
        <span style={{ fontSize: 10, color: muted, fontFamily: "'Newsreader', serif" }}>Absolutely</span>
      </div>
    </div>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────

const STEPS = ["intro", "trips", "child", "capabilities", "processing", "results"];

export default function App() {
  const [step, setStep] = useState("intro");
  const [animIn, setAnimIn] = useState(false);
  const [trips, setTrips] = useState(Array(5).fill(null).map(() => ({ city: "", what: "" })));
  const [children, setChildren] = useState([{ name: "", age: "", interests: "" }]);
  const [capScores, setCapScores] = useState({});
  const [results, setResults] = useState(null);

  // Primary child helpers (first child drives the analysis)
  const primaryChild = children[0];
  const childName = primaryChild.name;
  const childAge = primaryChild.age;
  const interests = primaryChild.interests;

  function updateChild(idx, field, val) {
    setChildren(prev => prev.map((c, i) => i === idx ? { ...c, [field]: val } : c));
  }
  function addChild() {
    if (children.length < 4) setChildren(prev => [...prev, { name: "", age: "", interests: "" }]);
  }
  function removeChild(idx) {
    if (children.length > 1) setChildren(prev => prev.filter((_, i) => i !== idx));
  }

  useEffect(() => {
    // Inject Google Fonts
    if (!document.querySelector(`link[href="${FONT_URL}"]`)) {
      const link = document.createElement("link");
      link.rel = "stylesheet"; link.href = FONT_URL;
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => { setTimeout(() => setAnimIn(true), 60); }, [step]);

  function go(next) {
    setAnimIn(false);
    setTimeout(() => { setStep(next); setTimeout(() => setAnimIn(true), 60); }, 280);
  }

  function runAnalysis() {
    go("processing");
    const validCities = trips.map(t => t.city).filter(c => CITY_DATABASE[c]);
    const czi = calculateCZI(validCities);
    const age = parseInt(childAge);
    const wr = calculateWorldReadiness(capScores);
    const window = getAgeWindow(age);
    const windowData = AGE_MAP[window];
    const pattern = getCZIPattern(czi);
    const readiness = getReadinessLabel(wr, window);
    const strategy = getStrategyRecommendation(age, czi, wr, interests);
    const avgSim = validCities.length ? validCities.reduce((a, c) => a + getCitySimilarity(c), 0) / validCities.length : 70;

    setTimeout(() => {
      setResults({ czi, wr, pattern, readiness, strategy, window, windowData, avgSim, validCities, age, children });
      go("results");
    }, 3500);
  }

  const age = parseInt(childAge) || 10;
  const capQuestions = getCapabilityQuestions(age).map(q => ({
    ...q,
    question: q.q.replace(/\{name\}/g, childName || "your child")
  }));

  const s = {
    page: { minHeight: "100vh", background: cream, color: black, fontFamily: "'Newsreader', serif", display: "flex", justifyContent: "center", padding: "48px 20px 120px" },
    wrap: { width: "100%", maxWidth: 680, opacity: animIn ? 1 : 0, transform: animIn ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.35s ease, transform 0.35s ease" },
    eyebrow: { fontFamily: "'Newsreader', serif", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", color: green, marginBottom: 14 },
    h1: { fontFamily: "'Alegreya', serif", fontSize: 40, lineHeight: 1.15, fontWeight: 700, color: black, marginBottom: 18 },
    body: { fontSize: 16, lineHeight: 1.8, color: "#3a3a3a", marginBottom: 28, fontFamily: "'Newsreader', serif" },
    card: { background: "#fff", border: `1px solid ${bord}`, borderRadius: 14, padding: "24px 28px", marginBottom: 16 },
    goldCard: { background: "#f0f5f2", border: `1px solid #c2d4cd`, borderRadius: 14, padding: "24px 28px", marginBottom: 16 },
    btn: { background: green, color: "#fff", border: "none", borderRadius: 8, padding: "15px 36px", fontSize: 13, fontWeight: 600, fontFamily: "'Newsreader', serif", cursor: "pointer", letterSpacing: 1.5, textTransform: "uppercase", transition: "all 0.2s" },
    ghost: { background: "transparent", color: muted, border: `1px solid ${bord}`, borderRadius: 8, padding: "13px 24px", fontSize: 13, fontFamily: "'Newsreader', serif", cursor: "pointer" },
    input: { width: "100%", background: "#fff", border: `1px solid ${bord}`, borderRadius: 8, padding: "13px 16px", color: black, fontSize: 15, fontFamily: "'Newsreader', serif", boxSizing: "border-box", outline: "none" },
    label: { fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: muted, display: "block", marginBottom: 8, fontFamily: "'Newsreader', serif" },
    row: { display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" },
  };

  function ProgressDots() {
    const active = STEPS.indexOf(step);
    const shown = [1, 2, 3];
    return (
      <div style={{ display: "flex", gap: 8, marginBottom: 36 }}>
        {shown.map((i, idx) => (
          <div key={idx} style={{ height: 3, flex: 1, borderRadius: 2, background: active >= i ? green : bord, transition: "background 0.4s" }} />
        ))}
      </div>
    );
  }

  // ── INTRO ──────────────────────────────────────────────────────────────────
  if (step === "intro") return (
    <div style={s.page}>
      <div style={s.wrap}>
        <div style={{ marginBottom: 16 }}>
          <img src='data:image/png;base64,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' alt='Mahali Pazuri' style={{ height: 64, width: 'auto', display: 'block' }} />
        </div>
        <div style={{ width: 36, height: 2, background: green, marginBottom: 32, opacity: 0.5 }} />
        <div style={s.h1}>Let's build your<br />family's report.</div>
        <div style={s.body}>
          Three short steps. About 5 minutes. At the end you'll have your Comfort Zone Index, your child's World Readiness score, and a specific brief for your next trip.
        </div>

        <div style={{ marginBottom: 32 }}>
          {[
            ["1", "Your last 5 trips", "We score each destination to map your family's true cultural range."],
            ["2", "Your child", "Age and current capabilities — calibrated to their developmental window."],
            ["3", "Your report", "CZI score, readiness score, and exactly what your next trip needs to deliver."],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 18 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#f0f5f2", border: "1px solid #c2d4cd", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Alegreya', serif", fontSize: 16, fontWeight: 700, color: green, flexShrink: 0, marginTop: 2 }}>{num}</div>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600, color: black, marginBottom: 3, fontFamily: "'Newsreader', serif" }}>{title}</div>
                <div style={{ fontSize: 14, color: muted, lineHeight: 1.6, fontFamily: "'Newsreader', serif" }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <button style={s.btn} onClick={() => go("trips")}>Begin →</button>
        <div style={{ marginTop: 14, fontSize: 12, color: muted, fontFamily: "'Newsreader', serif" }}>Your results are instant and personal to your family</div>
      </div>
    </div>
  );

  // ── TRIPS ──────────────────────────────────────────────────────────────────
  if (step === "trips") return (
    <div style={s.page}>
      <div style={s.wrap}>
        <ProgressDots />
        <div style={s.eyebrow}>Step 1 of 3 — Travel History</div>
        <div style={{ fontFamily: "'Alegreya', serif", fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Your last 5 family trips</div>
        <div style={{ ...s.body, fontSize: 14, marginBottom: 24 }}>We score each destination across four dimensions to understand your family's travel pattern — and what your next trip needs to deliver that your past trips haven't.</div>

        {trips.map((trip, i) => (
          <div key={i} style={{ ...s.card, padding: "18px 20px" }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, marginBottom: 12 }}>Trip {i + 1}</div>
            <CityDropdown value={trip.city} onChange={city => { const u = [...trips]; u[i] = { ...u[i], city }; setTrips(u); }} placeholder="Search city or destination..." />
            <input
              value={trip.what}
              onChange={e => { const u = [...trips]; u[i] = { ...u[i], what: e.target.value }; setTrips(u); }}
              placeholder="What did you actually do? (resort, local markets, hiking, cultural sites...)"
              style={{ ...s.input, marginTop: 10, fontSize: 13 }}
            />
          </div>
        ))}

        <div style={{ ...s.row, marginTop: 24 }}>
          <button style={s.ghost} onClick={() => go("intro")}>← Back</button>
          <button style={s.btn} onClick={() => go("child")}>Continue →</button>
        </div>
      </div>
    </div>
  );

  // ── CHILD ──────────────────────────────────────────────────────────────────
  if (step === "child") return (
    <div style={s.page}>
      <div style={s.wrap}>
        <ProgressDots />
        <div style={s.eyebrow}>Step 2 of 3 — Your Children</div>
        <div style={{ fontFamily: "'Alegreya', serif", fontSize: 28, fontWeight: 700, marginBottom: 10 }}>Who are you traveling with?</div>
        <div style={{ ...s.body, fontSize: 14, marginBottom: 24 }}>
          Add each child you're planning this trip around. The report will focus on the child whose developmental window is most urgent — usually the oldest.
        </div>

        {children.map((child, idx) => (
          <div key={idx} style={{ ...s.card, marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold }}>
                {idx === 0 ? "Child 1 — Primary" : `Child ${idx + 1}`}
              </div>
              {idx > 0 && (
                <button onClick={() => removeChild(idx)} style={{ background: "none", border: "none", color: bord, cursor: "pointer", fontSize: 18, lineHeight: 1, padding: "0 4px" }}>×</button>
              )}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
              <div>
                <label style={s.label}>First Name (optional)</label>
                <input style={s.input} placeholder="e.g. Sofia" value={child.name} onChange={e => updateChild(idx, "name", e.target.value)} />
              </div>
              <div>
                <label style={s.label}>Current Age *</label>
                <input style={s.input} type="number" min={4} max={17} placeholder="e.g. 11" value={child.age} onChange={e => updateChild(idx, "age", e.target.value)} />
              </div>
            </div>
            <label style={s.label}>Main Interests</label>
            <input style={s.input} placeholder="e.g. animals, cooking, football, history, science, art..." value={child.interests} onChange={e => updateChild(idx, "interests", e.target.value)} />

            {child.age && (
              <div style={{ marginTop: 14, padding: "12px 14px", background: "#f0f5f2", borderRadius: 8, border: "1px solid #c2d4cd" }}>
                <div style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: gold, marginBottom: 4 }}>
                  {AGE_MAP[getAgeWindow(parseInt(child.age))]?.stage}
                </div>
                <div style={{ fontSize: 12, color: muted, lineHeight: 1.5 }}>
                  {AGE_MAP[getAgeWindow(parseInt(child.age))]?.windowMsg}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, color: bord }}>
                  {Math.max(0, 18 - parseInt(child.age))} years left · ~{Math.max(0, Math.round((18 - parseInt(child.age)) * 1.5))} trips remaining in this window
                </div>
              </div>
            )}
          </div>
        ))}

        {children.length < 4 && (
          <button onClick={addChild} style={{ width: "100%", background: "transparent", border: `1px dashed ${bord}`, borderRadius: 10, padding: "14px", color: muted, fontSize: 13, cursor: "pointer", marginBottom: 20, fontFamily: "'Newsreader', serif" }}>
            + Add another child
          </button>
        )}

        {children.length > 1 && children[0].age && (
          <div style={{ ...s.goldCard, marginBottom: 20 }}>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, marginBottom: 8 }}>Report Focus</div>
            <div style={{ fontSize: 13, color: muted, lineHeight: 1.6 }}>
              The capability assessment and trip recommendations will focus on <strong style={{ color: black }}>{children[0].name || "your oldest child"}</strong> — typically the one with the most urgent developmental window. All children's windows are noted.
            </div>
          </div>
        )}

        <div style={{ ...s.row, marginTop: 8 }}>
          <button style={s.ghost} onClick={() => go("trips")}>← Back</button>
          <button style={{ ...s.btn, opacity: children[0].age ? 1 : 0.4 }} disabled={!children[0].age} onClick={() => go("capabilities")}>Continue →</button>
        </div>
      </div>
    </div>
  );

  // ── CAPABILITIES ───────────────────────────────────────────────────────────
  if (step === "capabilities") return (
    <div style={s.page}>
      <div style={s.wrap}>
        <ProgressDots />
        <div style={s.eyebrow}>Step 3 of 3 — Readiness Check</div>
        <div style={{ fontFamily: "'Alegreya', serif", fontSize: 28, fontWeight: 700, marginBottom: 10 }}>
          What can {childName || "your child"} actually handle?
        </div>
        <div style={{ ...s.body, fontSize: 14, marginBottom: 24 }}>
          This tells us what your next trip should challenge them with — and what would be too much or too little. Rate honestly based on what you've seen, not what you hope is true. These are calibrated to the <strong style={{ color: gold }}>{AGE_MAP[getAgeWindow(age)]?.stage}</strong> window.
        </div>

        {capQuestions.map(q => (
          <RatingRow key={q.id} id={q.id} label={q.label} question={q.question}
            value={capScores[q.id] || 0}
            onChange={v => setCapScores(prev => ({ ...prev, [q.id]: v }))} />
        ))}

        <div style={{ ...s.row, marginTop: 20 }}>
          <button style={s.ghost} onClick={() => go("child")}>← Back</button>
          <button
            style={{ ...s.btn, opacity: Object.keys(capScores).length >= capQuestions.length - 1 ? 1 : 0.4 }}
            disabled={Object.keys(capScores).length < capQuestions.length - 1}
            onClick={runAnalysis}>
            Generate My Report →
          </button>
        </div>
      </div>
    </div>
  );

  // ── PROCESSING ─────────────────────────────────────────────────────────────
  if (step === "processing") {
    const msgs = [
      "Scoring your past destinations...",
      "Identifying what your trips have — and haven't — delivered...",
      "Mapping what your child is ready for right now...",
      "Building your next trip recommendations...",
    ];
    const [msgIdx, setMsgIdx] = useState(0);
    const [dots, setDots] = useState(0);
    useEffect(() => {
      const d = setInterval(() => setDots(v => (v + 1) % 4), 350);
      const m = setInterval(() => setMsgIdx(v => Math.min(v + 1, msgs.length - 1)), 880);
      return () => { clearInterval(d); clearInterval(m); };
    }, []);
    return (
      <div style={{ ...s.page, alignItems: "center", paddingTop: 120 }}>
        <div style={{ textAlign: "center", maxWidth: 420 }}>
          <div style={{ width: 56, height: 56, border: `3px solid ${bord}`, borderTopColor: green, borderRadius: "50%", margin: "0 auto 36px", animation: "spin 1s linear infinite" }} />
          <div style={{ fontFamily: "'Alegreya', serif", fontSize: 24, marginBottom: 14, color: black }}>Working out what your next trip needs to deliver</div>
          <div style={{ fontSize: 14, color: muted, minHeight: 22, fontFamily: "'Newsreader', serif" }}>{msgs[msgIdx]}{".".repeat(dots + 1)}</div>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  // ── RESULTS ────────────────────────────────────────────────────────────────
  if (step === "results" && results) {
    const { czi, wr, pattern, readiness, strategy, window, windowData, avgSim, validCities, age, children } = results;
    const name = childName || "Your child";
    const sortedCaps = Object.entries(capScores).sort((a, b) => a[1] - b[1]);
    const worstCap = sortedCaps[0];
    const capLabels = { physical: "Physical Challenge", cultural: "Cultural Adaptation", navigation: "Solo Navigation", language: "Language Flexibility", environment: "Environmental Literacy", communication: "Cross-Cultural Communication" };

    return (
      <div style={s.page}>
        <div style={{ ...s.wrap, maxWidth: 740 }}>

          {/* ── Header ── */}
          <div style={{ textAlign: "center", marginBottom: 44 }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
            <img src='data:image/png;base64,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' alt='Mahali Pazuri' style={{ height: 64, width: 'auto', display: 'block' }} />
          </div>
            <div style={{ fontFamily: "'Alegreya', serif", fontSize: 28, lineHeight: 1.2, marginBottom: 10 }}>
              Here's what {name}'s<br />next trip needs to deliver.
            </div>
            <div style={{ fontSize: 14, color: muted, marginBottom: 36, lineHeight: 1.6, maxWidth: 480, margin: "0 auto 36px" }}>
              Based on your family's travel pattern and where {name} is developmentally right now.
            </div>
            <div style={{ display: "flex", justifyContent: "center", gap: 48, flexWrap: "wrap" }}>
              <ScoreRing score={czi} label="Comfort Zone Index" sublabel="Your travel pattern" color={pattern.color} size={130} />
              <ScoreRing score={wr} label="World Readiness" sublabel={`${name} · Age ${age}`} color={teal} size={130} />
            </div>
            {children.length > 1 && (
              <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 10, flexWrap: "wrap" }}>
                {children.slice(1).map((c, i) => c.age ? (
                  <div key={i} style={{ background: light, border: `1px solid ${bord}`, borderRadius: 8, padding: "8px 14px", fontSize: 12, color: muted }}>
                    {c.name || `Child ${i + 2}`} · Age {c.age} · <span style={{ color: gold }}>{AGE_MAP[getAgeWindow(parseInt(c.age))]?.stage}</span>
                  </div>
                ) : null)}
              </div>
            )}
          </div>

          {/* ── CZI Pattern ── */}
          <div style={s.card}>
            <div style={s.eyebrow}>Your Travel Pattern</div>
            <div style={{ fontFamily: "'Alegreya', serif", fontSize: 22, color: pattern.color, marginBottom: 6 }}>{pattern.name}</div>
            <div style={{ fontSize: 14, color: muted, lineHeight: 1.7, marginBottom: 20 }}>
              {czi < 3
                ? `Your family has been traveling inside a tight cultural comfort zone. The destinations have changed, but the experience of the world has stayed largely the same. Your next trip is an opportunity to break that pattern — if you choose the right destination.`
                : czi < 5
                ? `Your family has some diversity in your travel history, but there are significant gaps in what your kids have been exposed to. Your next trip should push deliberately into those gaps.`
                : `Your family has a genuinely diverse travel history. Your next trip should continue building on that foundation with age-appropriate challenge.`
              }
            </div>

            {validCities.length > 0 && (
              <>
                <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: bord, marginBottom: 14 }}>How Similar Your Past Trips Actually Were</div>

                <div style={{ display: "flex", gap: 16, marginBottom: 16, flexWrap: "wrap" }}>
                  {[["S", "Systems"], ["L", "Language"], ["P", "Privilege Visibility"], ["C", "Cultural Framework"]].map(([k, v]) => (
                    <div key={k} style={{ fontSize: 11, color: muted, display: "flex", gap: 5, alignItems: "center" }}>
                      <span style={{ fontWeight: 700, color: gold }}>{k}</span>{v}
                    </div>
                  ))}
                </div>

                {validCities.map((cityName, i) => {
                  const sim = getCitySimilarity(cityName);
                  const city = CITY_DATABASE[cityName];
                  const barColor = sim > 78 ? rust : sim > 52 ? gold : teal;
                  return (
                    <div key={i} style={{ marginBottom: 14 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                        <span style={{ fontSize: 13, color: black }}>{cityName}</span>
                        <span style={{ fontSize: 12, color: barColor, fontWeight: 600 }}>{sim}% similar to home</span>
                      </div>
                      <div style={{ background: light, borderRadius: 3, height: 5, marginBottom: 4 }}>
                        <div style={{ width: `${sim}%`, height: "100%", background: barColor, borderRadius: 3, transition: "width 1.2s ease" }} />
                      </div>
                      {city && (
                        <div style={{ display: "flex", gap: 12 }}>
                          {[["S", city.s], ["L", city.l], ["P", city.p], ["C", city.c]].map(([k, v]) => (
                            <div key={k} style={{ fontSize: 10, color: bord }}>
                              <span style={{ color: gold, fontWeight: 700 }}>{k}</span> {v}/25
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <div style={{ marginTop: 18, padding: "14px 16px", background: `rgba(${pattern.color === rust ? "201,123,90" : "200,169,110"},0.07)`, borderRadius: 8, border: `1px solid rgba(${pattern.color === rust ? "201,123,90" : "200,169,110"},0.2)` }}>
                  <div style={{ fontSize: 13, color: "#3a3a3a", lineHeight: 1.6 }}>
                    {avgSim > 75
                      ? <><strong style={{ color: pattern.color }}>{validCities.length} destinations. {Math.round(avgSim)}% culturally similar to home.</strong> The scenery has changed. The world your kids are experiencing hasn't.</>
                      : <><strong style={{ color: teal }}>Average similarity: {Math.round(avgSim)}%.</strong> Your family has genuine variety in your travel history — the question is whether you're being intentional about what each trip builds.</>
                    }
                  </div>
                </div>
              </>
            )}
          </div>

          {/* ── World Readiness ── */}
          <div style={{ ...s.card, borderColor: bord }}>
            <div style={s.eyebrow}>What {name} Is Ready For — {windowData.stage} Window</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16, marginBottom: 16 }}>
              <div>
                <div style={{ fontFamily: "'Alegreya', serif", fontSize: 20, color: teal, marginBottom: 6 }}>{readiness.label}</div>
                <div style={{ fontSize: 13, color: muted, lineHeight: 1.6, maxWidth: 420 }}>{readiness.msg}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 34, fontFamily: "'Alegreya', serif", color: teal, lineHeight: 1 }}>{Math.max(0, 18 - age)}</div>
                <div style={{ fontSize: 10, letterSpacing: 2, color: muted }}>YEARS LEFT</div>
              </div>
            </div>

            <div style={{ fontSize: 12, color: muted, marginBottom: 14, fontStyle: "italic" }}>"{windowData.principle}"</div>

            <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: bord, marginBottom: 12 }}>Capability Scores vs. Window Benchmarks</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10, marginBottom: 16 }}>
              {Object.entries(windowData.capabilities).map(([key, desc]) => {
                const score = capScores[key];
                const capLabel = { physical: "Physical", cultural: "Cultural", navigation: "Navigation", language: "Language", environment: "Environment", communication: "Communication" }[key];
                if (!capLabel) return null;
                return (
                  <div key={key} style={{ padding: "12px 14px", background: "#fafaf8", borderRadius: 8, border: `1px solid ${bord}` }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 5 }}>
                      <span style={{ fontSize: 11, letterSpacing: 1.5, textTransform: "uppercase", color: gold }}>{capLabel}</span>
                      {score && <span style={{ fontSize: 13, fontWeight: 700, color: score >= 7 ? teal : score >= 4 ? gold : rust }}>{score}/10</span>}
                    </div>
                    <div style={{ fontSize: 11, color: muted, lineHeight: 1.5 }}>{desc}</div>
                  </div>
                );
              })}
            </div>

            {worstCap && (
              <div style={{ padding: "14px 16px", background: "#fdf4f0", borderRadius: 8, border: "1px solid #e8c8bb" }}>
                <div style={{ fontSize: 12, letterSpacing: 1.5, textTransform: "uppercase", color: rust, marginBottom: 5 }}>Priority Gap for Your Next Trip</div>
                <div style={{ fontSize: 13, color: "#3a3a3a" }}>
                  <strong style={{ color: black }}>{capLabels[worstCap[0]]}</strong> — scored {worstCap[1]}/10. Your next trip should specifically create situations that build this. Don't let it wait — this is the highest-leverage thing you can do right now.
                </div>
              </div>
            )}
          </div>

          {/* ── What This Means For Your Next Trip ── */}
          <div style={{ ...s.card, borderColor: "#c2d4cd", background: "#f7faf9" }}>
            <div style={s.eyebrow}>What This Means For Your Next Trip</div>
            <div style={{ fontFamily: "'Alegreya', serif", fontSize: 20, color: black, marginBottom: 20 }}>
              Three things to decide before you book anything.
            </div>

            {/* Destination Type */}
            <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${bord}` }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: gold, marginBottom: 8 }}>1 — Choose the right kind of destination</div>
              <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.7 }}>
                {czi < 3
                  ? `With a CZI of ${czi.toFixed(1)}, your family needs a destination that scores low on cultural similarity — somewhere that genuinely looks and feels different. Western Europe, the Caribbean, and North American cities won't move the needle. Look at Latin America, Asia, or Africa.`
                  : czi < 5
                  ? `Your CZI is ${czi.toFixed(1)} — some variety, but room to push further. Your next trip should step up the challenge: choose somewhere with meaningful language difference, visible inequality, or genuinely different social norms. Mid-tier complexity: Japan, India, or East Africa.`
                  : `Your CZI is ${czi.toFixed(1)} — you're already in strong territory. Keep the diversity up and focus on matching the destination to ${name}'s specific developmental window rather than novelty for its own sake.`
                }
              </div>
            </div>

            {/* What to build in */}
            <div style={{ marginBottom: 18, paddingBottom: 18, borderBottom: `1px solid ${bord}` }}>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: teal, marginBottom: 8 }}>2 — Build in the right experiences</div>
              <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.7 }}>
                {worstCap
                  ? `${name}'s biggest gap is ${capLabels[worstCap[0]].toLowerCase()} (${worstCap[1]}/10). This trip should include at least one experience that directly builds this — not as a stretch goal, as the anchor of the plan. ${
                      worstCap[0] === 'navigation' ? "Give them a real navigation challenge with real stakes: getting somewhere alone, figuring out transit, handling a wrong turn." :
                      worstCap[0] === 'cultural' ? "Don't buffer the discomfort. Eat where locals eat, stay where locals stay, let them feel genuinely foreign." :
                      worstCap[0] === 'language' ? "Get them into situations where English won't save them. Markets, local restaurants, asking directions from someone who doesn't speak it." :
                      worstCap[0] === 'physical' ? "Build in something physically demanding — not optional, built into the itinerary. Multi-day hike, early mornings, genuine effort." :
                      worstCap[0] === 'communication' ? "Find opportunities for genuine cross-cultural connection — homestay, community visit, extended time with local kids." :
                      "Design experiences that push genuine environmental engagement — local ecosystems, conservation, hands-on connection with how the place works."
                    }`
                  : `${name} has solid capability scores across the board. Focus this trip on deepening existing strengths and introducing the next level of challenge in the ${windowData.stage} window.`
                }
              </div>
            </div>

            {/* Prototype */}
            <div>
              <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: muted, marginBottom: 8 }}>3 — Prototype trip for this window</div>
              <div style={{ fontSize: 14, color: muted, lineHeight: 1.7 }}>{windowData.exampleTrip}</div>
            </div>
          </div>

          {/* ── Strategic Direction ── */}
          <div style={{ ...s.goldCard }}>
            <div style={s.eyebrow}>Where to Go Next</div>
            <div style={{ fontFamily: "'Alegreya', serif", fontSize: 22, color: gold, marginBottom: 14 }}>{strategy.urgency}</div>
            <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.8, marginBottom: 22 }}>{strategy.text}</div>
            <div style={{ fontSize: 11, letterSpacing: 2, textTransform: "uppercase", color: bord, marginBottom: 12 }}>Best destinations for your next trip</div>
            {strategy.destinations.map((d, i) => (
              <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 14, marginBottom: 10 }}>
                <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#f0f5f2", border: `1px solid rgba(200,169,110,0.25)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, color: gold, flexShrink: 0, marginTop: 1 }}>{i+1}</div>
                <div style={{ fontSize: 14, color: "#3a3a3a", lineHeight: 1.5 }}>{d}</div>
              </div>
            ))}
          </div>

          {/* ── CTA ── */}
          <div style={{ textAlign: "center", padding: "44px 36px", background: "#f0f5f2", border: `1px solid ${bord}`, borderRadius: 16 }}>
            <div style={{ fontFamily: "'Alegreya', serif", fontSize: 26, marginBottom: 12, lineHeight: 1.3 }}>
              This trip is one of {Math.max(0, Math.round((18 - age) * 1.5))} remaining<br />before this window closes.
            </div>
            <div style={{ fontSize: 14, color: muted, lineHeight: 1.75, maxWidth: 480, margin: "0 auto 28px" }}>
              Families who get the most out of these years don't plan one trip at a time. They design a 2–3 year arc where each trip builds on the last. A Family Travel Diagnostic gives you that arc — your full CZI, every capability gap mapped against the right window, and a specific sequence of destinations and experiences for the next 3 years.
            </div>
            <button style={{ ...s.btn, padding: "17px 40px" }}>Book a Strategy Call →</button>
            <div style={{ marginTop: 14, fontSize: 11, color: bord }}>30-minute call · 6–8 families/month · Limited spots</div>
          </div>

          <div style={{ textAlign: "center", marginTop: 20 }}>
            <button style={s.ghost} onClick={() => { setStep("intro"); setResults(null); setCapScores({}); setTrips(Array(5).fill(null).map(() => ({ city: "", what: "" }))); setChildren([{ name: "", age: "", interests: "" }]); }}>Start Over</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
