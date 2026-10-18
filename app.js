const ROUTES = {
  welcome: "images/welcome.png",
  menu: "images/menu.png",
  freshstart: "images/freshstart.png",
  missions: "images/missions.png",
  apps: "images/apps.png",
  time: "images/time.png",
  learning: "images/learning.png",
  communications: "images/communications.png",
  fifo: "images/fifo.png",
  foodsafety: "images/foodsafety.png",
  tempcomp: "images/tempcomp.png",
  culture: "images/culture.png",
  values: "images/values.png",
  cleaning: "images/cleaning.png",
  fives: "images/fives.png",
  safety: "images/safety.png",
  teamwork: "images/teamwork.png",
  policies: "images/policies.png"
};

const TITLES = {
  welcome: "Welcome",
  menu: "Home",
  freshstart: "Fresh Start",
  missions: "My Missions",
  apps: "My Apps",
  time: "My Time",
  learning: "My Learning",
  communications: "My Communications",
  fifo: "FIFO: Product Rotation",
  foodsafety: "Food Safety",
  tempcomp: "Temperature Compliance",
  culture: "Our Culture",
  values: "Our Values",
  cleaning: "Cleaning and Sanitation",
  fives: "5S Department Standards",
  safety: "Safety",
  teamwork: "Teamwork",
  policies: "Policy"
};

let current = "welcome";
const DEBUG = new URLSearchParams(location.search).has("debug");
const app = document.querySelector("#app");
const toast = document.querySelector("#toast");
const assistantDialog = document.querySelector("#assistant");
const assistantClose = document.querySelector("#assistant-close");
const assistantForm = document.querySelector("#assistant-form");
const assistantInput = document.querySelector("#assistant-input");
const chat = document.querySelector("#chat");

function say(t) {
  toast.textContent = t;
  toast.classList.add("show");
  clearTimeout(say.timer);
  say.timer = setTimeout(() => toast.classList.remove("show"), 2200);
}

function hs(label, x, y, w, h, action) {
  return { label, x, y, w, h, action };
}

function bottomHotspots() {
  return [
    hs("Home", 0.10, 0.900, 0.16, 0.042, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.900, 0.16, 0.042, () => openAssistant()),
    hs("Microphone", 0.46, 0.900, 0.16, 0.042, () => startVoice()),
    hs("Alert", 0.68, 0.900, 0.16, 0.042, () => say("No new alerts"))
  ];
}

function backHotspot(target = "menu") {
  return hs("Back", 0.08, 0.790, 0.84, 0.040, () => go(target));
}

function welcomeHotspots() {
  return [
    hs("Begin My Day", 0.10, 0.780, 0.80, 0.050, () => go("menu")),
    hs("Home", 0.10, 0.850, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.850, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.850, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.850, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function menuHotspots() {
  return [
    hs("Fresh Start", 0.08, 0.335, 0.84, 0.050, () => go("freshstart")),
    hs("My Missions", 0.08, 0.420, 0.84, 0.050, () => go("missions")),
    hs("My Apps", 0.08, 0.505, 0.84, 0.050, () => go("apps")),
    hs("My Time", 0.08, 0.590, 0.84, 0.050, () => go("time")),
    hs("My Learning", 0.08, 0.675, 0.84, 0.050, () => go("learning")),
    hs("My Communications", 0.08, 0.760, 0.84, 0.050, () => go("communications")),
    ...bottomHotspots()
  ];
}

function learningHotspots() {
  const items = [
    ["FIFO: Product Rotation", "fifo", 0.290],
    ["Food Safety", "foodsafety", 0.336],
    ["Temperature Compliance", "tempcomp", 0.384],
    ["Safety", "safety", 0.432],
    ["Teamwork Makes The Dream Work", "teamwork", 0.484],
    ["Our Culture", "culture", 0.539],
    ["Our Policies", "policies", 0.588],
    ["Our Values", "values", 0.638],
    ["Cleaning and Sanitation", "cleaning", 0.688],
    ["5S: Department Organizational Standards", "fives", 0.744]
  ];
  const hsList = items.map(([label, target, y]) =>
    hs(label, 0.10, y - 0.018, 0.80, 0.036, () => go(target))
  );
  hsList.push(backHotspot("menu"));
  hsList.push(...bottomHotspots());
  return hsList;
}

function genericHotspots(backTarget = "learning") {
  return [
    backHotspot(backTarget),
    ...bottomHotspots()
  ];
}

function missionsHotspots() {
  const missions = [
    ["Downstack the New Load", 0.346],
    ["Work Backstock", 0.404],
    ["Work New Product", 0.463],
    ["My Daily Counts", 0.521],
    ["Product Dating & Rotation", 0.580],
    ["Organize Cooler Backstock", 0.639]
  ];
  const hsList = missions.map(([label, y]) =>
    hs(label, 0.08, y - 0.025, 0.84, 0.050, () => say(`Mission: ${label}`))
  );
  hsList.push(hs("Back", 0.08, 0.810, 0.84, 0.040, () => go("menu")));
  hsList.push(
    hs("Home", 0.10, 0.870, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.870, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.870, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.870, 0.16, 0.040, () => say("No new alerts"))
  );
  return hsList;
}

function appsHotspots() {
  const tiles = [
    ["Instock", 0.12, 0.280],
    ["UKG", 0.52, 0.280],
    ["Compliance", 0.12, 0.415],
    ["FEED", 0.52, 0.415],
    ["PerkSpot", 0.12, 0.550],
    ["Fresh Production", 0.52, 0.550],
    ["Baler", 0.12, 0.685],
    ["MyInfo", 0.52, 0.685]
  ];
  const hsList = tiles.map(([label, x, y]) =>
    hs(label, x, y, 0.34, 0.120, () => say(`Opening ${label}`))
  );
  hsList.push(hs("Back", 0.08, 0.790, 0.84, 0.040, () => go("menu")));
  hsList.push(
    hs("Home", 0.10, 0.850, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.850, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.850, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.850, 0.16, 0.040, () => say("No new alerts"))
  );
  return hsList;
}

function timeHotspots() {
  const actions = [
    ["Clock In", 0.381],
    ["Start Lunch", 0.486],
    ["End Lunch", 0.591],
    ["Clock Out", 0.697]
  ];
  const hsList = actions.map(([label, y]) =>
    hs(label, 0.10, y - 0.035, 0.80, 0.070, () => say(`${label} recorded in UKG`))
  );
  hsList.push(hs("Back", 0.08, 0.780, 0.84, 0.040, () => go("menu")));
  hsList.push(
    hs("Home", 0.10, 0.850, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.850, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.850, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.850, 0.16, 0.040, () => say("No new alerts"))
  );
  return hsList;
}

function freshstartHotspots() {
  return [
    hs("Start Daily Questions", 0.12, 0.670, 0.76, 0.065, () => say("Daily Questions started — 75 points available")),
    hs("Back", 0.08, 0.770, 0.84, 0.040, () => go("menu")),
    hs("Home", 0.10, 0.840, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.840, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.840, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.840, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function communicationsHotspots() {
  return [
    hs("Back", 0.08, 0.790, 0.84, 0.040, () => go("menu")),
    hs("Home", 0.10, 0.850, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.850, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.850, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.850, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function teamworkHotspots() {
  return [
    hs("Apply for Helping Hands", 0.18, 0.845, 0.64, 0.055, () => say("Opening Helping Hands application")),
    hs("Back", 0.08, 0.850, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.910, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.910, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.910, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.910, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function safetyHotspots() {
  return [
    hs("Back", 0.08, 0.850, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.910, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.910, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.910, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.910, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function fifoHotspots() {
  return [
    hs("Back", 0.08, 0.850, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.910, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.910, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.910, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.910, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function foodsafetyHotspots() {
  return [
    hs("Back", 0.08, 0.842, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.902, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.902, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.902, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.902, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function tempcompHotspots() {
  return [
    hs("Back", 0.08, 0.848, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.902, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.902, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.902, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.902, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function cleaningHotspots() {
  return [
    hs("Back", 0.08, 0.848, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.902, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.902, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.902, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.902, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function fivesHotspots() {
  return [
    hs("Back", 0.08, 0.848, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.902, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.902, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.902, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.902, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function cultureHotspots() {
  return [
    hs("Back", 0.08, 0.848, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.902, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.902, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.902, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.902, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function valuesHotspots() {
  return [
    hs("Back", 0.08, 0.848, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.902, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.902, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.902, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.902, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function policiesHotspots() {
  return [
    hs("Back", 0.08, 0.860, 0.84, 0.040, () => go("learning")),
    hs("Home", 0.10, 0.914, 0.16, 0.040, () => go("welcome")),
    hs("AI Assistant", 0.28, 0.914, 0.16, 0.040, () => openAssistant()),
    hs("Microphone", 0.46, 0.914, 0.16, 0.040, () => startVoice()),
    hs("Alert", 0.68, 0.914, 0.16, 0.040, () => say("No new alerts"))
  ];
}

function getHotspots(id) {
  switch (id) {
    case "welcome": return welcomeHotspots();
    case "menu": return menuHotspots();
    case "learning": return learningHotspots();
    case "missions": return missionsHotspots();
    case "apps": return appsHotspots();
    case "time": return timeHotspots();
    case "freshstart": return freshstartHotspots();
    case "communications": return communicationsHotspots();
    case "teamwork": return teamworkHotspots();
    case "safety": return safetyHotspots();
    case "fifo": return fifoHotspots();
    case "foodsafety": return foodsafetyHotspots();
    case "tempcomp": return tempcompHotspots();
    case "culture": return cultureHotspots();
    case "values": return valuesHotspots();
    case "cleaning": return cleaningHotspots();
    case "fives": return fivesHotspots();
    case "policies": return policiesHotspots();
    default:
      return bottomHotspots();
  }
}

function go(id, push = true) {
  if (!ROUTES[id]) {
    say("Screen not found");
    return;
  }
  current = id;
  if (push) {
    history.pushState({ id }, TITLES[id] || id, "#" + id);
  }
  render();
  document.title = (TITLES[id] || id) + " · F.R.I.E.N.D.";
}

function render() {
  const screen = document.createElement("div");
  screen.className = "screen";
  const img = document.createElement("img");
  img.src = ROUTES[current];
  img.alt = TITLES[current] || current;
  img.draggable = false;
  const layer = document.createElement("div");
  layer.className = "hotspot-layer";
  screen.appendChild(img);
  screen.appendChild(layer);
  app.innerHTML = "";
  app.appendChild(screen);

  img.onload = () => {
    const spots = getHotspots(current);
    spots.forEach(s => {
      const btn = document.createElement("button");
      btn.className = "hotspot" + (DEBUG ? " debug" : "");
      btn.style.cssText = `left:${s.x * 100}%;top:${s.y * 100}%;width:${s.w * 100}%;height:${s.h * 100}%`;
      btn.setAttribute("aria-label", s.label);
      if (DEBUG) btn.textContent = s.label;
      btn.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        s.action();
      };
      layer.appendChild(btn);
    });
  };
}

function openAssistant() {
  assistantDialog.showModal();
}

function startVoice() {
  const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SR) {
    say("Voice recognition unavailable on this browser. Try Chrome or Edge.");
    return;
  }
  const recognition = new SR();
  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.onstart = () => say("Listening…");
  recognition.onresult = (e) => {
    const text = e.results[0][0].transcript;
    say("Heard: " + text);
    // Simple command routing
    const t = text.toLowerCase();
    if (t.includes("home") || t.includes("menu")) go("menu");
    else if (t.includes("learning")) go("learning");
    else if (t.includes("mission")) go("missions");
    else if (t.includes("time")) go("time");
    else if (t.includes("fresh")) go("freshstart");
    else if (t.includes("app")) go("apps");
    else if (t.includes("communication")) go("communications");
    else say("Try saying “go home” or “open learning”");
  };
  recognition.onerror = () => say("Could not hear clearly. Try again.");
  recognition.start();
}

function addChat(role, text) {
  const p = document.createElement("p");
  p.innerHTML = `<b>${role === "user" ? "You" : "FRIEND"}:</b> ${text}`;
  chat.appendChild(p);
  chat.scrollTop = chat.scrollHeight;
}

assistantClose.onclick = () => assistantDialog.close();
assistantForm.onsubmit = (e) => {
  e.preventDefault();
  const q = assistantInput.value.trim();
  if (!q) return;
  addChat("user", q);
  assistantInput.value = "";
  setTimeout(() => {
    addChat("ai", "I can help with meat department SOPs, rotation, temperature checks, and 5S. Try asking about a specific process.");
  }, 400);
};

window.addEventListener("popstate", (e) => {
  const id = (e.state && e.state.id) || (location.hash.slice(1)) || "welcome";
  if (ROUTES[id]) {
    current = id;
    render();
  }
});

// Initial load
const startId = location.hash.slice(1);
if (ROUTES[startId]) current = startId;
go(current, false);
