'use strict';
const $ = (s, r = document) => r.querySelector(s);
const eur = n => n.toLocaleString('fr-FR') + ' €';
const store = {
  get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} }
};

/* ---------- Données ---------- */
const PRODUCTS = [
  { id: 'iphone13', brand: 'Apple', name: 'iPhone 13', cap: '128 Go', color: 'Bleu', price: 379, neuf: 709, grade: 1, bat: 88 },
  { id: 's23', brand: 'Samsung', name: 'Samsung Galaxy S23', cap: '128 Go', color: 'Noir', price: 359, neuf: 659, grade: 0, bat: 91 },
  { id: 'pixel8', brand: 'Google', name: 'Google Pixel 8', cap: '128 Go', color: 'Gris', price: 329, neuf: 599, grade: 1, bat: 87 },
  { id: 'iphone12', brand: 'Apple', name: 'iPhone 12', cap: '64 Go', color: 'Blanc', price: 259, neuf: 549, grade: 2, bat: 86 }
];
const GRADES = ['Parfait état', 'Très bon état', 'État correct'];
const GRADE_ADJ = [40, 0, -40];            // écart de prix vs « Très bon état »
const CAPS = [['128 Go', 0], ['256 Go', 60]];
const TRADE = { 'iPhone 11': 150, 'iPhone 12': 240, 'iPhone 13': 330, 'Galaxy S21': 180, 'Galaxy S22': 230, 'Pixel 7': 200 };
const FUNC = [['Fonctionne parfaitement', 1, 'Tout marche : écran tactile, boutons, appareils photo'], ['Petit défaut', .85, 'Batterie fatiguée ou bouton capricieux'], ['Ne s’allume pas', .5, 'Appareil en panne']];
const VISU = [['Comme neuf', 1, 'Aucune rayure'], ['Rayures légères', .92, 'Micro-rayures, aucun choc'], ['Écran ou coque abîmé', .75, 'Fissures, chocs visibles']];

/* ---------- État ---------- */
let cart = store.get('rm_cart', []);
let pdp = { p: PRODUCTS[0], grade: 1, cap: 0, bat: false };
let rep = { step: 0, model: '', func: 0, visu: 0, mode: 'voucher' };

/* ---------- Thème & menu ---------- */
document.documentElement.dataset.theme = store.get('rm_theme', matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light');
$('#theme').onclick = () => {
  const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = t; store.set('rm_theme', t);
};
$('#burger').onclick = e => {
  const o = $('#nav').classList.toggle('open');
  e.currentTarget.setAttribute('aria-expanded', o);
};

function toast(msg) {
  const t = $('#toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove('show'), 2400);
}
function updateCart() { $('#cartCount').textContent = cart.length; store.set('rm_cart', cart); }

/* ---------- Accueil ---------- */
function productCard(p) {
  return `<a class="card prod" href="#/produit/${p.id}">
    <div class="ph">Photo réelle — ${p.name}</div>
    <span class="tag">${GRADES[p.grade].toUpperCase()}</span>
    <h3>${p.name}</h3><div class="sv">${p.cap} · ${p.color}</div>
    <div class="pr">${eur(p.price)}</div>
    <div class="sv">Neuf : ${eur(p.neuf)} · <mark>Vous économisez ${eur(p.neuf - p.price)}</mark></div>
    <div class="g">Garantie 24 mois incluse</div></a>`;
}
function renderProducts(list, info = '') {
  $('#products').innerHTML = list.length ? list.map(productCard).join('') : '<p>Aucun appareil ne correspond. Élargissez votre budget ou changez de marque.</p>';
  $('#resultInfo').textContent = info;
}
const brands = [...new Set(PRODUCTS.map(p => p.brand))];
$('#pBrand').innerHTML += brands.map(b => `<option>${b}</option>`).join('');
$('#pBrand').onchange = e => {
  const m = $('#pModel'); const list = PRODUCTS.filter(p => p.brand === e.target.value);
  m.innerHTML = '<option value="">Modèle</option>' + list.map(p => `<option value="${p.id}">${p.name}</option>`).join('');
  m.disabled = !list.length;
};
$('#picker').onsubmit = e => {
  e.preventDefault();
  const b = $('#pBrand').value, m = $('#pModel').value, max = +$('#pBudget').value || Infinity;
  const res = PRODUCTS.filter(p => (!b || p.brand === b) && (!m || p.id === m) && p.price <= max);
  renderProducts(res, `${res.length} offre(s) trouvée(s)`);
  $('#best').scrollIntoView();
};
$('#search').oninput = e => {
  const q = e.target.value.trim().toLowerCase();
  if (location.hash && location.hash !== '#/') location.hash = '#/';
  const res = PRODUCTS.filter(p => (p.name + p.brand).toLowerCase().includes(q));
  renderProducts(res, q ? `${res.length} résultat(s) pour « ${e.target.value} »` : '');
};

/* ---------- Fiche produit ---------- */
function chips(el, items, cur, fn) {
  el.innerHTML = items.map((t, i) => `<button type="button" class="chip" aria-pressed="${i === cur}" data-i="${i}">${t}</button>`).join('');
  el.onclick = e => { const b = e.target.closest('button'); if (b) { fn(+b.dataset.i); } };
}
function pdpPrice() {
  const { p, grade, cap, bat } = pdp;
  const base = p.price - GRADE_ADJ[p.grade];
  const price = base + GRADE_ADJ[grade] + CAPS[cap][1] + (bat ? 39 : 0);
  const neuf = p.neuf + CAPS[cap][1];
  $('#pdpTitle').textContent = `${p.name} ${CAPS[cap][0]}`;
  $('#price').textContent = eur(price);
  $('#saving').textContent = `Neuf : ${eur(neuf)} · économisez ${eur(neuf - price)}`;
  $('#split').textContent = `Payez en 4x sans frais : 4 × ${(price / 4).toFixed(2).replace('.', ',')} €`;
  const lvl = bat ? 100 : p.bat;
  $('#batFill').style.width = lvl + '%';
  $('#batTxt').textContent = bat ? '100 % : batterie neuve certifiée.' : `${p.bat} % mesurés à l’atelier (seuil minimum : 85 %). Exemple illustratif.`;
  pdp.total = price;
}
function renderPdp(id) {
  const p = PRODUCTS.find(x => x.id === id) || PRODUCTS[0];
  pdp = { p, grade: p.grade, cap: 0, bat: false };
  $('#crumb').textContent = p.name; $('#newBat').checked = false;
  $('#pdpImg').textContent = `Photo réelle de l’exact état — ${p.name}`;
  const draw = () => {
    chips($('#gradeChips'), GRADES, pdp.grade, i => { pdp.grade = i; draw(); });
    chips($('#capChips'), CAPS.map(c => c[0]), pdp.cap, i => { pdp.cap = i; draw(); });
    pdpPrice();
  };
  draw();
}
$('#newBat').onchange = e => { pdp.bat = e.target.checked; pdpPrice(); };
$('#add').onclick = () => {
  cart.push({ name: $('#pdpTitle').textContent, grade: GRADES[pdp.grade], bat: pdp.bat, price: pdp.total });
  updateCart(); toast('Ajouté au panier');
};
$('#tradeSel').innerHTML += Object.keys(TRADE).map(m => `<option>${m}</option>`).join('');
$('#tradeSel').onchange = e => { if (e.target.value) { rep = { step: 0, model: e.target.value, func: 0, visu: 0, mode: 'voucher' }; location.hash = '#/reprise'; } };

/* ---------- Reprise ---------- */
const STEPS = ['Quel est votre modèle ?', 'État fonctionnel', 'État visuel', 'Votre offre'];
const offerValue = () => Math.round(TRADE[rep.model] * FUNC[rep.func][1] * VISU[rep.visu][1]);
const radios = (name, list, cur) => list.map((o, i) => `<label class="opt"><input type="radio" name="${name}" value="${i}" ${i === cur ? 'checked' : ''}><b>${o[0]}</b><small>${o[2]}</small></label>`).join('');

function renderRep() {
  const s = rep.step, body = $('#stepBody');
  $('#stepLbl').textContent = `Étape ${s + 1} sur 4${s === 3 ? ' · Offre ferme' : ''}`;
  $('#stepBar').style.width = (s + 1) * 25 + '%';
  $('#stepTitle').textContent = s === 3 ? `Votre offre pour l’${rep.model}` : STEPS[s];
  $('#prev').hidden = s === 0;
  $('#next').textContent = s === 3 ? 'Accepter l’offre' : 'Continuer';
  if (s === 0) {
    body.innerHTML = `<select id="rModel" aria-label="Modèle"><option value="">Choisir un modèle</option>${Object.keys(TRADE).map(m => `<option ${m === rep.model ? 'selected' : ''}>${m}</option>`).join('')}</select><p class="err" id="rErr" role="alert"></p>`;
    $('#rModel').onchange = e => { rep.model = e.target.value; $('#rErr').textContent = ''; };
  } else if (s === 1 || s === 2) {
    const k = s === 1 ? 'func' : 'visu';
    body.innerHTML = radios(k, s === 1 ? FUNC : VISU, rep[k]);
    body.onchange = e => { rep[k] = +e.target.value; };
  } else {
    const v = offerValue(), b = Math.round(v * 1.15);
    body.innerHTML = `<div class="card offer"><b>${eur(v)}</b><span class="muted">Offre ferme, sans mauvaise surprise</span></div>
      <label class="opt"><input type="radio" name="mode" value="bank" ${rep.mode === 'bank' ? 'checked' : ''}><b>Virement bancaire</b><small>${eur(v)} sous 5 jours après réception</small></label>
      <label class="opt"><input type="radio" name="mode" value="voucher" ${rep.mode === 'voucher' ? 'checked' : ''}><b>Bon d’achat bonifié <span class="badge">+15 %</span></b><small>${eur(b)} à utiliser sur ReMobile</small></label>
      <p class="muted">Étiquette d’envoi gratuite incluse.</p>`;
    body.onchange = e => { rep.mode = e.target.value; };
  }
}
$('#prev').onclick = () => { rep.step--; renderRep(); };
$('#next').onclick = () => {
  if (rep.step === 0 && !rep.model) { $('#rErr').textContent = 'Choisissez votre modèle pour continuer.'; return; }
  if (rep.step < 3) { rep.step++; renderRep(); return; }
  const v = offerValue(), amt = rep.mode === 'voucher' ? Math.round(v * 1.15) : v;
  $('#stepTitle').textContent = 'Offre acceptée';
  $('#stepBody').innerHTML = `<p>Votre ${rep.model} est repris pour <b>${eur(amt)}</b> (${rep.mode === 'voucher' ? 'bon d’achat' : 'virement'}). Votre étiquette d’envoi arrive par e-mail.</p>`;
  $('#prev').hidden = $('#next').hidden = true;
};

/* ---------- Panier & pages simples ---------- */
function renderCart() {
  const el = $('#cartList');
  if (!cart.length) { el.innerHTML = '<p>Votre panier est vide. <a href="#/">Découvrir les appareils</a></p>'; return; }
  const total = cart.reduce((s, i) => s + i.price, 0);
  el.innerHTML = cart.map((i, n) => `<div class="item"><span><b>${i.name}</b><br><small class="muted">${i.grade}${i.bat ? ' · batterie neuve' : ''}</small></span><span>${eur(i.price)} <button data-n="${n}">Retirer</button></span></div>`).join('')
    + `<p class="price">Total ${eur(total)}</p><button class="btn block" id="pay">Passer à la livraison</button>`;
  el.onclick = e => {
    if (e.target.dataset.n) { cart.splice(+e.target.dataset.n, 1); updateCart(); renderCart(); }
    if (e.target.id === 'pay') toast('Démo : le paiement n’est pas branché');
  };
}
const INFO = {
  comparer: ['Comparer', '<p>Sélectionnez jusqu’à 3 modèles depuis le catalogue pour comparer autonomie, processeur et format. (Module à brancher.)</p>'],
  impact: ['Impact', '<p>Un smartphone reconditionné évite en moyenne 55 kg de CO₂ par rapport à un neuf. Chiffre indicatif à remplacer par vos données.</p>'],
  aide: ['Aide', '<p><b>Garantie ?</b> 24 mois incluse.<br><b>Retours ?</b> 30 jours.<br><b>Livraison ?</b> Expédition sous 24h depuis Lyon.</p>'],
  guide: ['Guide des états', '<p><b>Parfait état :</b> aucune trace visible à 20 cm.<br><b>Très bon état :</b> micro-rayures visibles de près.<br><b>État correct :</b> rayures légères, 100 % fonctionnel.</p>']
};

/* ---------- Routeur ---------- */
function route() {
  const [, view = '', arg] = location.hash.split('/');
  const name = ['produit', 'reprise', 'panier'].includes(view) ? view : INFO[view] ? 'info' : 'home';
  document.querySelectorAll('[data-view]').forEach(s => s.hidden = s.dataset.view !== name);
  if (name === 'produit') renderPdp(arg);
  if (name === 'reprise') { if (!location.hash.includes('keep')) { if (!rep.model) rep.step = 0; } renderRep(); $('#prev').hidden = rep.step === 0; $('#next').hidden = false; }
  if (name === 'panier') renderCart();
  if (name === 'info') { $('#infoT').textContent = INFO[view][0]; $('#infoB').innerHTML = INFO[view][1]; }
  document.querySelectorAll('.nav a').forEach(a => a.classList.toggle('on', a.getAttribute('href') === '#/' + view && view));
  $('#nav').classList.remove('open'); $('#burger').setAttribute('aria-expanded', false);
  scrollTo(0, 0); document.title = 'ReMobile – ' + (name === 'home' ? 'Smartphones garantis 24 mois' : name);
}
addEventListener('hashchange', route);
renderProducts(PRODUCTS); updateCart(); route();
