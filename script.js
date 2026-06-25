const statusEl = document.getElementById("status"); 

const btnRandomParents = document.getElementById("btnRandomParents");
const btnMakeChild = document.getElementById("btnMakeChild");

const aHairEl = document.getElementById("aHair");
const aEyesEl = document.getElementById("aEyes");
const aSkinEl = document.getElementById("aSkin");
const aHeightEl = document.getElementById("aHeight");

const bHairEl = document.getElementById("bHair");
const bEyesEl = document.getElementById("bEyes");
const bSkinEl = document.getElementById("bSkin");
const bHeightEl = document.getElementById("bHeight");

const cHairEl = document.getElementById("cHair");
const cEyesEl = document.getElementById("cEyes");
const cSkinEl = document.getElementById("cSkin");
const cHeightEl = document.getElementById("cHeight");

const aWeightEl = document.getElementById("aWeight");
const bWeightEl = document.getElementById("bWeight");
const cWeightEl = document.getElementById("cWeight");

const S = window.S; 
const canvasEl = document.getElementById("S");

function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }
function rndInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function setHidden(obj, h) { if (obj) obj.hidden = !!h; }
function setHiddenMany(list, h) { for (const o of list) setHidden(o, h); }

const WORLD = {
  xMin: -70, xMax: 70,
  zMin: -45, zMax: 45,
  zoneCenter: { x: 0, z: 0 },
  zoneR: 14,
  parentAStart: { x: -35, z: 0 },
  parentBStart: { x:  35, z: 0 },
  childSpot:   { x:   0, z: 28 }
};

function randomGenotype(dom, rec) {
  const a = (Math.random() < 0.6) ? dom : rec;
  const b = (Math.random() < 0.6) ? dom : rec;
  return a + b;
}
function phenotype(gt, domName, recName) {
  const a = gt[0], b = gt[1];
  const hasDom = (a === a.toUpperCase()) || (b === b.toUpperCase());
  return hasDom ? domName : recName;
}
function inheritGenotype(gtA, gtB) {
  const a = gtA[rndInt(0, 1)];
  const b = gtB[rndInt(0, 1)];
  return a + b;
}

function makeRandomTraits() {
  const t = {
    hairGt:   randomGenotype("D", "d"),
    eyesGt:   randomGenotype("B", "b"),
    skinGt:   randomGenotype("T", "t"),
    heightGt: randomGenotype("H", "h"),
    weightGt: randomGenotype("F", "f")
  };

  t.hairPh   = phenotype(t.hairGt,   "Тъмна",  "Светла");
  t.eyesPh   = phenotype(t.eyesGt,   "Кафяви", "Сини");
  t.skinPh   = phenotype(t.skinGt,   "Тъмна",  "Светла");
  t.heightPh = phenotype(t.heightGt, "Висок",  "Нисък");
  t.weightPh = phenotype(t.weightGt, "По-пълен", "По-слаб");

  return t;
}

function makeChildTraits(A, B) {
  const t = {
    hairGt:   inheritGenotype(A.traits.hairGt,   B.traits.hairGt),
    eyesGt:   inheritGenotype(A.traits.eyesGt,   B.traits.eyesGt),
    skinGt:   inheritGenotype(A.traits.skinGt,   B.traits.skinGt),
    heightGt: inheritGenotype(A.traits.heightGt, B.traits.heightGt),
    weightGt: inheritGenotype(A.traits.weightGt, B.traits.weightGt)
  };

  t.hairPh   = phenotype(t.hairGt,   "Тъмна",  "Светла");
  t.eyesPh   = phenotype(t.eyesGt,   "Кафяви", "Сини");
  t.skinPh   = phenotype(t.skinGt,   "Тъмна",  "Светла");
  t.heightPh = phenotype(t.heightGt, "Висок",  "Нисък");
  t.weightPh = phenotype(t.weightGt, "По-пълен", "По-слаб");

  return t;
}

function traitToVisual(t) {
  const hairColor = (t.hairPh === "Тъмна") ? "SaddleBrown" : "Khaki";
  const irisColor  = (t.eyesPh === "Кафяви") ? "Sienna" : "DeepSkyBlue";
  const skinColor = (t.skinPh === "Тъмна") ? "Peru" : "Wheat";
  const heightScale = (t.heightPh === "Висок") ? 1.25 : 0.90;
  const weightScale = (t.weightPh === "По-пълен") ? 1.25 : 0.92;
  return { hairColor, irisColor, skinColor, heightScale, weightScale };
}

function showTraits(prefix, t) {
  const hair = `${t.hairPh} (${t.hairGt})`;
  const eyes = `${t.eyesPh} (${t.eyesGt})`;
  const skin = `${t.skinPh} (${t.skinGt})`;
  const height = `${t.heightPh} (${t.heightGt})`;
  const weight = `${t.weightPh} (${t.weightGt})`;

  if (prefix === "A") {
    aHairEl.textContent = hair; aEyesEl.textContent = eyes; aSkinEl.textContent = skin; aHeightEl.textContent = height;
    if (aWeightEl) aWeightEl.textContent = weight;
  }
  if (prefix === "B") {
    bHairEl.textContent = hair; bEyesEl.textContent = eyes; bSkinEl.textContent = skin; bHeightEl.textContent = height;
    if (bWeightEl) bWeightEl.textContent = weight;
  }
  if (prefix === "C") {
    cHairEl.textContent = hair; cEyesEl.textContent = eyes; cSkinEl.textContent = skin; cHeightEl.textContent = height;
    if (cWeightEl) cWeightEl.textContent = weight;
  }
}

const MODEL = {
  baseR: 6.5,
  baseH: 0.12,

  headR: 3.9,
  neckH: 1.20,

  bodyW: 6.8,
  bodyD: 4.6,
  bodyH: 11.2,

  armW: 1.5,
  armD: 1.5,
  armH: 8.4,

  legW: 1.9,
  legD: 1.9,
  legH: 9.6,

  hipGap: 2.2
};

// ---------- Person ----------
function createPerson(label, startX, startZ) {
  const P = {
    label,
    x: startX,
    z: startZ,
    traits: makeRandomTraits(),

    heightScale: 1.0,
    weightScale: 1.0,

    parts: [],
    pickParts: [],

    base: null,
    body: null,

    armL: null, armR: null,
    handL: null, handR: null,
    legL: null, legR: null,

    neck: null,
    head: null,

    eyeWhiteL: null, eyeWhiteR: null,
    irisL: null, irisR: null,
    pupilL: null, pupilR: null,

    nose: null,
    mouth: null,

    hairCap: null
  };

  P.base = S.cylinder([0, 0, 0], [MODEL.baseR, MODEL.baseH, MODEL.baseR], "DimGray");
  P.base.style({ alpha: 0.40 });

  P.legL = S.cube([0, 0, 0], [MODEL.legW, MODEL.legH, MODEL.legD], "Wheat");
  P.legR = S.cube([0, 0, 0], [MODEL.legW, MODEL.legH, MODEL.legD], "Wheat");

  P.body = S.cube([0, 0, 0], [MODEL.bodyW, MODEL.bodyH, MODEL.bodyD], "SteelBlue");

  P.armL = S.cube([0, 0, 0], [MODEL.armW, MODEL.armH, MODEL.armD], "Wheat");
  P.armR = S.cube([0, 0, 0], [MODEL.armW, MODEL.armH, MODEL.armD], "Wheat");

  P.handL = S.sphere([0, 0, 0], 0.9, "Wheat");
  P.handR = S.sphere([0, 0, 0], 0.9, "Wheat");

  P.neck = S.cylinder([0, 0, 0], [1.25, MODEL.neckH, 1.25], "Wheat");
  P.head = S.sphere([0, 0, 0], MODEL.headR, "Wheat");

  P.eyeWhiteL = S.sphere([0, 0, 0], 0.70, "White");
  P.eyeWhiteR = S.sphere([0, 0, 0], 0.70, "White");

  P.irisL = S.sphere([0, 0, 0], 0.40, "DeepSkyBlue");
  P.irisR = S.sphere([0, 0, 0], 0.40, "DeepSkyBlue");

  P.pupilL = S.sphere([0, 0, 0], 0.18, "Black");
  P.pupilR = S.sphere([0, 0, 0], 0.18, "Black");

  P.nose = S.cylinder([0, 0, 0], [0.28, 0.9, 0.28], "Peru");
  P.nose.spinS = 90;

  P.mouth = S.cube([0, 0, 0], [1.45, 0.22, 0.18], "Black");
  P.mouth.style({ alpha: 0.90 });

  P.hairCap = S.sphere([0, 0, 0], MODEL.headR * 1.03, "SaddleBrown");
  P.hairCap.style({ alpha: 0.98 });

  P.parts.push(
    P.base,
    P.legL, P.legR,
    P.body,
    P.armL, P.armR,
    P.handL, P.handR,
    P.neck, P.head,
    P.eyeWhiteL, P.eyeWhiteR,
    P.irisL, P.irisR,
    P.pupilL, P.pupilR,
    P.nose, P.mouth,
    P.hairCap
  );

  P.pickParts.push(P.body, P.head, P.base);

  applyTraitsToPerson(P);
  updatePersonGeometryAndPosition(P);

  for (const part of P.pickParts) {
    part.addEventListener("pointerDown", (e) => startDrag(P, e));
  }

  return P;
}

function applyTraitsToPerson(P) {
  const v = traitToVisual(P.traits);
  P.heightScale = v.heightScale;
  P.weightScale = v.weightScale;

  P.head.color = v.skinColor;
  P.neck.color = v.skinColor;

  P.armL.color = v.skinColor;
  P.armR.color = v.skinColor;
  P.handL.color = v.skinColor;
  P.handR.color = v.skinColor;

  P.legL.color = v.skinColor;
  P.legR.color = v.skinColor;

  P.nose.color = v.skinColor;

  P.body.color = v.skinColor;

  P.hairCap.color = v.hairColor;

  P.irisL.color = v.irisColor;
  P.irisR.color = v.irisColor;

  P.mouth.color = "Black";
}

function updatePersonGeometryAndPosition(P) {
  const hs = P.heightScale;
  const ws = P.weightScale;

  const legH  = MODEL.legH  * hs;
  const bodyH = MODEL.bodyH * hs;

  const bodyW = MODEL.bodyW * ws;
  const bodyD = MODEL.bodyD * (0.95 + 0.15 * ws);

  const headR = MODEL.headR * (0.97 + 0.06 * hs);

  P.base.size   = [MODEL.baseR, MODEL.baseH, MODEL.baseR];
  P.base.center = [P.x, MODEL.baseH / 2, P.z];

  P.legL.size   = [MODEL.legW, legH, MODEL.legD];
  P.legR.size   = [MODEL.legW, legH, MODEL.legD];
  P.legL.center = [P.x - MODEL.hipGap, MODEL.baseH + legH / 2, P.z];
  P.legR.center = [P.x + MODEL.hipGap, MODEL.baseH + legH / 2, P.z];

  const bodyY = MODEL.baseH + legH + bodyH / 2;
  P.body.size   = [bodyW, bodyH, bodyD];
  P.body.center = [P.x, bodyY, P.z];

  const armY = bodyY + bodyH * 0.10;
  const armX = bodyW / 2 + MODEL.armW / 2 + 0.35;

  P.armL.size   = [MODEL.armW, MODEL.armH * hs, MODEL.armD];
  P.armR.size   = [MODEL.armW, MODEL.armH * hs, MODEL.armD];
  P.armL.center = [P.x - armX, armY, P.z];
  P.armR.center = [P.x + armX, armY, P.z];

  const handY = armY - (MODEL.armH * hs) / 2 - 0.45;
  P.handL.radius = 0.95;
  P.handR.radius = 0.95;
  P.handL.center = [P.x - armX, handY, P.z + 0.1];
  P.handR.center = [P.x + armX, handY, P.z + 0.1];

  const neckY = MODEL.baseH + legH + bodyH + MODEL.neckH / 2;
  P.neck.size   = [1.25, MODEL.neckH, 1.25];
  P.neck.center = [P.x, neckY, P.z];

  const headY = MODEL.baseH + legH + bodyH + MODEL.neckH + headR;
  P.head.radius = headR;
  P.head.center = [P.x, headY, P.z];

  P.hairCap.radius = headR * 1.03;
  P.hairCap.center = [P.x, headY + headR * 0.10, P.z - headR * 0.08];

  const EPS = 0.005;
  const faceZ = P.z + headR * 0.52;

  const eyeY = headY + headR * 0.15;
  const eyeXoff = headR * 0.38;

  P.eyeWhiteL.center = [P.x - eyeXoff, eyeY, faceZ];
  P.eyeWhiteR.center = [P.x + eyeXoff, eyeY, faceZ];
  P.eyeWhiteL.radius = 0.72;
  P.eyeWhiteR.radius = 0.72;

  P.irisL.center = [P.x - eyeXoff, eyeY, faceZ + EPS];
  P.irisR.center = [P.x + eyeXoff, eyeY, faceZ + EPS];
  P.irisL.radius = 0.42;
  P.irisR.radius = 0.42;

  P.pupilL.center = [P.x - eyeXoff, eyeY, faceZ + EPS * 2];
  P.pupilR.center = [P.x + eyeXoff, eyeY, faceZ + EPS * 2];
  P.pupilL.radius = 0.19;
  P.pupilR.radius = 0.19;

  P.nose.center = [P.x, headY - headR * 0.05, faceZ + EPS * 2];
  P.nose.size = [0.30, 0.95, 0.30];

  P.mouth.size   = [headR * 0.45, 0.22, 0.18];
  P.mouth.center = [P.x, headY - headR * 0.45, faceZ + EPS];
}

function setPersonHidden(P, hidden) {
  setHiddenMany(P.parts, hidden);
}


function canvasToWorldXZ(ev) {
  const rect = canvasEl.getBoundingClientRect();
  let u = (ev.clientX - rect.left) / rect.width;
  let v = (ev.clientY - rect.top) / rect.height;
  u = clamp(u, 0, 1);
  v = clamp(v, 0, 1);

  const x = WORLD.xMin + u * (WORLD.xMax - WORLD.xMin);
  const z = WORLD.zMax - v * (WORLD.zMax - WORLD.zMin);
  return { x, z };
}

function dist2(x1, z1, x2, z2) {
  const dx = x1 - x2, dz = z1 - z2;
  return dx * dx + dz * dz;
}

let dragging = null;
let dragPointerId = null;

function startDrag(P, ev) {
  dragging = P;
  dragPointerId = (ev.pointerId !== undefined) ? ev.pointerId : null;

  statusEl.textContent = `Влачиш ${P.label}...`;

  window.addEventListener("pointermove", onDragMove, { passive: false });
  window.addEventListener("pointerup", onDragUp, { passive: false, once: true });
  window.addEventListener("pointercancel", onDragUp, { passive: false, once: true });

  ev.preventDefault?.();
  ev.stopPropagation?.();
}

function onDragMove(ev) {
  if (!dragging) return;
  if (dragPointerId !== null && ev.pointerId !== dragPointerId) return;

  ev.preventDefault?.();

  const p = canvasToWorldXZ(ev);
  dragging.x = p.x;
  dragging.z = p.z;

  updatePersonGeometryAndPosition(dragging);
  updateZoneState();
}

function onDragUp(ev) {
  if (dragPointerId !== null && ev.pointerId !== dragPointerId) return;

  dragging = null;
  dragPointerId = null;

  window.removeEventListener("pointermove", onDragMove);
  statusEl.textContent = "Готово.";
}

let floorObj = null;
let zoneFill = null;
let zoneRing = null;

let parentA = null;
let parentB = null;
let child = null;

function inZone(P) {
  return dist2(P.x, P.z, WORLD.zoneCenter.x, WORLD.zoneCenter.z) <= WORLD.zoneR * WORLD.zoneR;
}

function updateZoneState() {
  const aIn = inZone(parentA);
  const bIn = inZone(parentB);

  if (aIn && bIn) {
    zoneFill.color = "SeaGreen";
    zoneFill.style({ alpha: 0.25 });
    btnMakeChild.disabled = false;
    statusEl.textContent = "Готово за кръстосване ✅";
  } else {
    zoneFill.color = "Goldenrod";
    zoneFill.style({ alpha: 0.18 });
    btnMakeChild.disabled = true;
  }
}

function randomizeParents() {
  parentA.traits = makeRandomTraits();
  parentB.traits = makeRandomTraits();

  applyTraitsToPerson(parentA);
  applyTraitsToPerson(parentB);

  updatePersonGeometryAndPosition(parentA);
  updatePersonGeometryAndPosition(parentB);

  showTraits("A", parentA.traits);
  showTraits("B", parentB.traits);

  cHairEl.textContent = "—";
  cEyesEl.textContent = "—";
  cSkinEl.textContent = "—";
  cHeightEl.textContent = "—";
  if (cWeightEl) cWeightEl.textContent = "—";

  if (child) setPersonHidden(child, true);

  statusEl.textContent = "Случайни родители ✅";
  updateZoneState();
}

function makeChild() {
  if (btnMakeChild.disabled) return;

  const t = makeChildTraits(parentA, parentB);

  if (!child) {
    child = createPerson("Дете", WORLD.childSpot.x, WORLD.childSpot.z);
  }

  child.traits = t;
  applyTraitsToPerson(child);
  child.x = WORLD.childSpot.x;
  child.z = WORLD.childSpot.z;

  updatePersonGeometryAndPosition(child);
  setPersonHidden(child, false);

  showTraits("C", t);
  statusEl.textContent = "Детето е създадено 👶";
}

function initScene() {
  if (!S || !canvasEl) {
    console.error("Missing SUICA canvas or suica.js");
    statusEl.textContent = "Грешка: SUICA не е зареден.";
    return;
  }

  S.background("MidnightBlue");
  S.perspective(35);
  S.lookAt([0, 90, 90], [0, 16, 0], [0, 1, 0]);

  floorObj = S.square([0, 0, 0], [170, 110], "SlateGray");
  floorObj.style({ spinH: 90, alpha: 0.25 });

  zoneFill = S.circle([0, 0.15, 0], WORLD.zoneR, "Goldenrod");
  zoneFill.style({ spinV: 90, alpha: 0.18 });

  zoneRing = S.circle([0, 0.20, 0], WORLD.zoneR, "White");
  zoneRing.style({ spinV: 90, wireframe: true });

  parentA = createPerson("Родител A", WORLD.parentAStart.x, WORLD.parentAStart.z);
  parentB = createPerson("Родител B", WORLD.parentBStart.x, WORLD.parentBStart.z);

  showTraits("A", parentA.traits);
  showTraits("B", parentB.traits);

  btnMakeChild.disabled = true;
  statusEl.textContent = "Готово. Влачете родителите.";

  updateZoneState();
}

btnRandomParents.addEventListener("click", randomizeParents);
btnMakeChild.addEventListener("click", makeChild);

window.addEventListener("load", initScene);