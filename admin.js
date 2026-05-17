// ═══════════════════════════════════════════════════════════════
// ADMIN.JS — Mode édition + gestion des entrées
// Mot de passe par défaut : "edit"
// ═══════════════════════════════════════════════════════════════

const ADMIN_PASSWORD = 'edit';
const STORAGE_KEY = 'site_data_v2';

window.editMode = false;

// ── Données par défaut (chargées si localStorage vide)
const DEFAULT_DATA = {
  // index.html
  'nav-name': 'VOTRE NOM',
  'hero-eyebrow': 'Compositeur · Paris',
  'hero-title': 'Votre<br>Nom',
  'hero-sub': 'Musiques orchestrales',
  'hero-desc': 'Des œuvres construites dans le silence, entre tension et souffle — pour orchestre, ensemble, et parfois rien d\'autre que la nuit.',
  'about-bio': 'Remplacez ce texte par votre biographie. Parlez de votre parcours, de vos influences, de ce qui vous pousse à composer.',
  'about-location': 'Basé à Paris.',
  'footer-name': '© 2025 Votre Nom',
  'footer-contact': 'contact@votresite.com',

  // Entrées journal films
  films: [
    { date: 'Mai 2025', title: 'All of Us Strangers', meta: 'Andrew Haigh · 2023 · Film', note: 'Une grâce douloureuse. Le film opère comme un rêve éveillé où le deuil prend la forme de retrouvailles impossibles.', tag: 'Film' },
    { date: 'Avr. 2025', title: 'Shogun', meta: 'Rachel Kondo · 2024 · Série', note: 'La patience comme dramaturgie. Chaque silence compte autant que chaque ligne de dialogue.', tag: 'Série' },
    { date: 'Mar. 2025', title: 'La Zone d\'intérêt', meta: 'Jonathan Glazer · 2023 · Film', note: 'L\'horreur hors-champ. Ce qu\'on n\'entend pas — ou plutôt ce qu\'on entend sans voir — devient insupportable.', tag: 'Film' },
  ],

  // Entrées journal livres
  livres: [
    { title: 'La Modification', author: 'Michel Butor', note: 'En cours. La deuxième personne du pluriel comme piège — on devient malgré soi le personnage.', status: 'En cours', date: 'Mai 2025' },
    { title: 'Les Désarçonnés', author: 'Pascal Quignard', note: 'Fragments sur la perte, l\'enfance, le silence. Quignard écrit comme on compose.', status: 'Lu', date: 'Fév. 2025' },
    { title: 'La Honte', author: 'Annie Ernaux', note: 'Court et dévastateur. La mémoire comme archéologie.', status: 'Lu', date: 'Jan. 2025' },
  ],

  // Écrits
  ecrits: [
    { title: 'Le silence avant l\'attaque', excerpt: 'Sur ce moment suspendu entre le lever de baguette et la première note.', date: 'Avr. 2025', tag: 'Essai', body: '<p>Il y a un moment, juste avant que l\'orchestre joue, où le silence n\'est plus tout à fait du silence. Le chef a levé sa baguette. Les musiciens retiennent leur souffle.</p><p class="sep">· · ·</p><p>Ce moment n\'est pas un vide. C\'est une tension — la même que dans un arc trop bandé. La musique n\'a pas encore eu lieu, et pourtant elle est déjà là.</p><p>Remplacez ce texte par votre propre contenu.</p>' },
    { title: 'Notes sur la répétition', excerpt: 'Pourquoi revenir aux mêmes mesures des centaines de fois n\'est pas de l\'obstination.', date: 'Fév. 2025', tag: 'Essai', body: '<p>On répète parce qu\'on ne sait pas encore. Puis parce qu\'on commence à savoir. Puis parce qu\'on veut oublier ce qu\'on sait.</p><p class="sep">· · ·</p><p>La répétition est à la fois l\'ennemi de la spontanéité et sa seule condition possible.</p><p>Remplacez ce texte par votre propre contenu.</p>' },
    { title: 'Partition', excerpt: 'Sur ce que c\'est de lire une partition avant de l\'entendre.', date: 'Jan. 2025', tag: 'Fragment', body: '<p>Avant d\'entendre un morceau, je le lis. Pas pour le déchiffrer — pour l\'imaginer. Une partition est un plan d\'un bâtiment qu\'on n\'a pas encore construit.</p><p>Remplacez ce texte par votre propre contenu.</p>' },
  ]
};

// ── Lecture / écriture localStorage
window.getData = function() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || JSON.parse(JSON.stringify(DEFAULT_DATA)); }
  catch(e) { return JSON.parse(JSON.stringify(DEFAULT_DATA)); }
};

window.saveData = function(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
};

// ── Charger les champs data-edit simples
window.loadFields = function() {
  const data = getData();
  document.querySelectorAll('[data-edit]').forEach(el => {
    const key = el.dataset.edit;
    if (data[key] !== undefined) el.innerHTML = data[key];
  });
};

// ── Sauvegarder les champs data-edit simples
window.saveFields = function() {
  const data = getData();
  document.querySelectorAll('[data-edit]').forEach(el => {
    data[el.dataset.edit] = el.innerHTML;
  });
  saveData(data);
};

// ── Activer / désactiver le mode édition
window.enableEditMode = function() {
  editMode = true;
  document.body.classList.add('edit-active');
  document.querySelectorAll('[data-edit]').forEach(el => {
    el.contentEditable = 'true';
    el.addEventListener('input', saveFields);
  });
  document.getElementById('adminBar').style.display = 'flex';
  document.getElementById('editToggle').textContent = '✓ Édition active';
  // Notifier la page si elle a un callback
  if (typeof window.onEditModeEnabled === 'function') window.onEditModeEnabled();
};

window.disableEditMode = function() {
  editMode = false;
  document.body.classList.remove('edit-active');
  document.querySelectorAll('[data-edit]').forEach(el => {
    el.contentEditable = 'false';
  });
  document.getElementById('adminBar').style.display = 'none';
  document.getElementById('editToggle').textContent = '✎ Éditer';
  saveFields();
  if (typeof window.onEditModeDisabled === 'function') window.onEditModeDisabled();
};

window.saveContent = saveFields; // alias for compatibility

// ── Toast
window.showToast = function(msg) {
  const t = document.getElementById('adminToast');
  if (!t) return;
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2200);
};

// ── Injecter l'UI admin
function injectAdminUI() {
  const bar = document.createElement('div');
  bar.id = 'adminBar';
  bar.innerHTML = `
    <span class="admin-hint">MODE ÉDITION — cliquez sur un texte pour le modifier, utilisez les boutons + et × pour ajouter ou supprimer des entrées</span>
    <div style="display:flex;gap:0.75rem;flex-shrink:0;">
      <button onclick="saveFields();showToast('Sauvegardé ✓')" class="admin-btn">Sauvegarder</button>
      <button onclick="if(confirm('Réinitialiser tout le contenu ?')){localStorage.removeItem('${STORAGE_KEY}');location.reload();}" class="admin-btn admin-btn-danger">Réinitialiser</button>
      <button onclick="disableEditMode()" class="admin-btn">Quitter</button>
    </div>
  `;
  document.body.appendChild(bar);

  const toggle = document.createElement('button');
  toggle.id = 'editToggle';
  toggle.textContent = '✎ Éditer';
  toggle.onclick = () => {
    if (editMode) { disableEditMode(); return; }
    const pwd = prompt('Mot de passe :');
    if (pwd === ADMIN_PASSWORD) enableEditMode();
    else if (pwd !== null) alert('Mot de passe incorrect.');
  };
  document.body.appendChild(toggle);

  const toast = document.createElement('div');
  toast.id = 'adminToast';
  document.body.appendChild(toast);

  const style = document.createElement('style');
  style.textContent = `
    #adminBar {
      display:none; position:fixed; bottom:0; left:0; right:0; z-index:9999;
      background:rgba(16,15,14,0.97); border-top:0.5px solid rgba(232,226,216,0.15);
      padding:0.875rem 2rem; align-items:center; justify-content:space-between; gap:1rem;
      font-family:'Inter',sans-serif; color:#e8e2d8; backdrop-filter:blur(8px);
    }
    .admin-hint { font-size:10px; letter-spacing:0.08em; opacity:0.4; }
    .admin-btn {
      font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.12em; text-transform:uppercase;
      background:transparent; border:0.5px solid rgba(232,226,216,0.25); color:#e8e2d8;
      padding:6px 14px; border-radius:3px; cursor:pointer; transition:background 0.2s; white-space:nowrap;
    }
    .admin-btn:hover { background:rgba(232,226,216,0.08); }
    .admin-btn-danger { border-color:rgba(200,80,80,0.4); color:rgba(220,120,120,0.9); }
    #editToggle {
      position:fixed; bottom:1.5rem; right:1.5rem; z-index:9998;
      font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.12em; text-transform:uppercase;
      background:rgba(14,13,12,0.92); border:0.5px solid rgba(232,226,216,0.15);
      color:rgba(232,226,216,0.35); padding:7px 14px; border-radius:3px; cursor:pointer; transition:color 0.2s;
    }
    #editToggle:hover { color:rgba(232,226,216,0.8); }
    #adminToast {
      position:fixed; bottom:5rem; right:1.5rem; z-index:9999;
      font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.1em;
      background:rgba(232,226,216,0.08); border:0.5px solid rgba(232,226,216,0.2);
      color:#e8e2d8; padding:8px 16px; border-radius:3px;
      opacity:0; transition:opacity 0.3s; pointer-events:none;
    }
    [data-edit][contenteditable="true"] {
      outline:0.5px dashed rgba(232,226,216,0.25); outline-offset:3px;
      border-radius:2px; cursor:text;
    }
    [data-edit][contenteditable="true"]:hover { outline-color:rgba(232,226,216,0.5); background:rgba(232,226,216,0.025); }
    [data-edit][contenteditable="true"]:focus { outline-color:rgba(232,226,216,0.7); }

    /* Boutons add/delete sur les entrées */
    .entry-delete, .add-entry-btn {
      font-family:'Inter',sans-serif; font-size:9px; letter-spacing:0.1em; text-transform:uppercase;
      background:transparent; border:0.5px dashed rgba(232,226,216,0.2);
      color:rgba(232,226,216,0.25); cursor:pointer; border-radius:2px; transition:all 0.2s;
    }
    .entry-delete {
      display:none; padding:3px 8px;
      position:absolute; top:1rem; right:0;
    }
    .entry-delete:hover { border-color:rgba(200,80,80,0.5); color:rgba(220,100,100,0.8); background:rgba(200,80,80,0.06); }
    .add-entry-btn {
      display:none; width:100%; padding:0.9rem; margin-top:1.5rem;
      font-size:10px;
    }
    .add-entry-btn:hover { border-color:rgba(232,226,216,0.4); color:rgba(232,226,216,0.6); }
    body.edit-active .entry-delete { display:block; }
    body.edit-active .add-entry-btn { display:block; }
    .entry, .book-entry, .writing-row { position:relative; }
  `;
  document.head.appendChild(style);
}

document.addEventListener('DOMContentLoaded', () => {
  injectAdminUI();
  loadFields();
});
