// app.js — Medinovatech Academy VN engine.
// Core loop: conflict/case -> question -> forced answer ->
//   CORRECT -> short flashcard -> next case
//   WRONG   -> Library -> full flashcard -> retry the same case
import { UI, CAST, EPISODES } from "./data.js";
import { startAnatomy, setAnatomyLang, setAllergic, isAllergic } from "./anatomy.js";

const BG = { library: "./assets/library.png", hospital: "./assets/hospital.png" };

const state = {
  lang: "id",
  ep: 0, sc: 0,
  score: 0, streak: 0, best: 0,
  affinity: { iggy: 0, masto: 0, eos: 0, reggie: 0 },
  answered: false
};

const $ = (id) => document.getElementById(id);
const T = (o) => (o ? (o[state.lang] ?? o.id ?? "") : "");

// ---------- screen helpers ----------
function show(el) { el.classList.add("show"); }
function hide(el) { el.classList.remove("show"); }

function setBg(key) {
  const url = BG[key] || BG.library;
  $("bg").style.backgroundImage = `url('${url}')`;
}

function setPortrait(whoKey) {
  const p = $("portrait");
  const c = CAST[whoKey];
  if (c && c.portrait) {
    p.src = "./assets/" + c.portrait;
    p.classList.add("show");
    p.classList.remove("pulse"); void p.offsetWidth; p.classList.add("pulse");
  } else {
    p.classList.remove("show");
  }
}

function flashVerdict(ok) {
  const v = $("verdict");
  v.textContent = ok ? T(UI.correct) : T(UI.wrong);
  v.className = ok ? "ok" : "no";
  void v.offsetWidth; v.classList.add("go");
}

// ---------- core render ----------
function current() { return EPISODES[state.ep]?.scenes[state.sc]; }

function render() {
  const ep = EPISODES[state.ep];
  const scene = current();
  if (!scene) { return finishEpisode(); }

  state.answered = false;
  setBg(scene.bg);
  setPortrait(scene.who);

  // top bar
  $("loc").textContent = scene.bg === "hospital" ? T(UI.hospital) : T(UI.academy);
  $("epInfo").innerHTML = `<small>${T(UI.epLabel)} ${ep.id}</small> · ${T(ep.title)}`;
  $("scoreInfo").innerHTML = `<small>${T(UI.score)}</small> ${state.score} &nbsp; <small>${T(UI.streak)}</small> ${state.streak}`;
  $("langBtn").textContent = "🌐 " + (state.lang === "id" ? "EN" : "ID");

  // name plate
  const who = CAST[scene.who];
  $("namep").textContent = who ? T(who.name) : "";

  const opts = $("options"), nextWrap = $("nextWrap"), prompt = $("prompt");
  opts.innerHTML = ""; nextWrap.innerHTML = ""; prompt.textContent = "";

  if (scene.type === "say") {
    $("text").textContent = T(scene.text);
    const b = document.createElement("button");
    b.className = "btn"; b.textContent = T(UI.next);
    b.onclick = advance;
    nextWrap.appendChild(b);
  } else if (scene.type === "ask") {
    $("text").textContent = T(scene.stem);
    prompt.textContent = T(UI.forceAnswer);
    shuffled(scene.options).forEach((o) => {
      const b = document.createElement("button");
      b.className = "opt";
      b.textContent = T(o.text);
      b._opt = o;
      b.onclick = () => answer(scene, o, b);
      opts.appendChild(b);
    });
  }
}

// Fisher–Yates on a copy so the correct answer isn't always first.
function shuffled(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function answer(scene, opt, btn) {
  if (state.answered) return;
  state.answered = true;
  const buttons = [...$("options").children];
  buttons.forEach((b) => b.classList.add("dim"));

  if (opt.correct) {
    btn.classList.remove("dim"); btn.classList.add("correct");
    flashVerdict(true);
    state.score += 10; state.streak += 1; state.best = Math.max(state.best, state.streak);
    if (opt.affinity && state.affinity[opt.affinity] != null) state.affinity[opt.affinity] += 1;
    $("scoreInfo").innerHTML = `<small>${T(UI.score)}</small> ${state.score} &nbsp; <small>${T(UI.streak)}</small> ${state.streak}`;
    setTimeout(() => openCard(scene.shortCard, false, advance), 700);
  } else {
    btn.classList.remove("dim"); btn.classList.add("wrong");
    // reveal the correct one softly
    buttons.forEach((b) => { if (b._opt && b._opt.correct) b.classList.add("correct"); });
    flashVerdict(false);
    state.streak = 0;
    $("scoreInfo").innerHTML = `<small>${T(UI.score)}</small> ${state.score} &nbsp; <small>${T(UI.streak)}</small> ${state.streak}`;
    // forced detour into the Library, then retry the same case
    setTimeout(() => openCard(scene.fullCard, true, () => { state.answered = false; render(); }), 700);
  }
}

// ---------- flashcard / library modal ----------
function openCard(card, isLibrary, onClose) {
  const m = $("modal"), c = $("card");
  m.classList.toggle("library", isLibrary);
  c.classList.toggle("lib", isLibrary);
  $("cardTag").textContent = isLibrary ? T(UI.libraryTag) : T(UI.flashcard);
  $("cardTitle").textContent = T(card.title);
  $("cardBody").textContent = T(card.body);
  const btns = $("cardBtns"); btns.innerHTML = "";
  const b = document.createElement("button");
  b.className = "btn" + (isLibrary ? " calm" : "");
  b.textContent = isLibrary ? T(UI.retry) : T(UI.nextCase);
  b.onclick = () => { hide(m); onClose && onClose(); };
  btns.appendChild(b);
  show(m);
}

// ---------- flow ----------
function advance() {
  state.sc += 1;
  if (state.sc >= EPISODES[state.ep].scenes.length) finishEpisode();
  else render();
}

function finishEpisode() {
  if (state.ep + 1 < EPISODES.length) {
    state.ep += 1; state.sc = 0; render();
  } else {
    showEnd();
  }
}

function showEnd() {
  $("endTitle").textContent = T(UI.endTitle);
  $("endBody").textContent = T(UI.endBody);
  $("endStats").innerHTML =
    `<small>${T(UI.score)}</small> ${state.score} &nbsp;·&nbsp; <small>${T(UI.streak)} (best)</small> ${state.best}`;
  const aff = $("affWrap"); aff.innerHTML = "";
  Object.entries(state.affinity).forEach(([k, v]) => {
    const c = document.createElement("div");
    c.className = "affchip";
    c.innerHTML = `${T(CAST[k].name)} <b>+${v}</b>`;
    aff.appendChild(c);
  });
  $("endRestart").textContent = T(UI.restart);
  show($("end"));
}

// ---------- title / boot ----------
function paintTitle() {
  $("titleLogo").textContent = T(UI.title);
  $("titleTag").textContent = T(UI.subtitle);
  $("startBtn").textContent = T(UI.start);
  $("anaBtn").textContent = T(UI.anatomyBtn);
  $("titleLang").textContent = "🌐 " + T(UI.langName);
}

// ---------- 3D anatomy room ----------
function paintAnaBar() {
  $("anaTitle").textContent = T(UI.anaTitle);
  $("anaExit").textContent = T(UI.anaExit);
  $("anaHint").textContent = T(UI.anaHint);
  $("anaToggle").textContent = isAllergic() ? T(UI.anaNormal) : T(UI.anaAllergic);
  $("anaInfoClose").textContent = T(UI.anaClose);
}

function showAnaInfo(point, l) {
  $("anaInfoTag").textContent = T(UI.flashcard);
  $("anaInfoTitle").textContent = point.label[l];
  $("anaInfoBody").textContent = point.info[l];
  show($("anaInfo"));
}

function openAnatomy() {
  hide($("title"));
  show($("anatomy"));
  paintAnaBar();
  startAnatomy($("anaCanvas"), { lang: state.lang, onInfo: showAnaInfo });
}

function closeAnatomy() {
  hide($("anaInfo"));
  hide($("anatomy"));
  show($("title"));
}

function startGame() {
  hide($("title"));
  state.ep = 0; state.sc = 0; state.score = 0; state.streak = 0; state.best = 0;
  state.affinity = { iggy: 0, masto: 0, eos: 0, reggie: 0 };
  render();
}

function toggleLang() {
  state.lang = state.lang === "id" ? "en" : "id";
  paintTitle();
  // anatomy room open: just retext, don't touch the VN
  if ($("anatomy").classList.contains("show")) {
    setAnatomyLang(state.lang);
    paintAnaBar();
    if ($("anaInfo").classList.contains("show")) hide($("anaInfo"));
    return;
  }
  // live re-render whatever is on screen
  if ($("title").classList.contains("show")) return;
  if ($("end").classList.contains("show")) { showEnd(); return; }
  if ($("modal").classList.contains("show")) {
    // re-render current scene underneath; keep it simple: close modal and redraw case
    hide($("modal"));
  }
  const keepAnswered = state.answered;
  render();
  state.answered = keepAnswered;
}

window.addEventListener("DOMContentLoaded", () => {
  $("title").style.backgroundImage = `url('${BG.library}')`;
  $("end").style.backgroundImage = `url('${BG.hospital}')`;
  paintTitle(); show($("title"));
  $("startBtn").onclick = startGame;
  $("endRestart").onclick = () => { hide($("end")); startGame(); };
  $("langBtn").onclick = toggleLang;
  $("titleLang").onclick = toggleLang;

  // 3D anatomy room
  $("anaBtn").onclick = openAnatomy;
  $("anaExit").onclick = closeAnatomy;
  $("anaLang").onclick = toggleLang;
  $("anaInfoClose").onclick = () => hide($("anaInfo"));
  $("anaToggle").onclick = () => { setAllergic(!isAllergic()); paintAnaBar(); };
});
