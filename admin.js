// ─── MODE ÉDITION ───────────────────────────────────────────────
// Bouton discret en bas à droite → cliquer → entrer le mot de passe
// Mot de passe par défaut : "edit" — changez-le ci-dessous.

const ADMIN_PASSWORD = 'edit';
const STORAGE_KEY = 'site_content_v1';

let editMode = false;

function loadSavedContent() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    document.querySelectorAll('[data-edit]').forEach(el => {
      const key = el.dataset.edit;
      if (saved[key] !== undefined) el.innerHTML = saved[key];
    });
  } catch(e) {}
}

function saveContent() {
  const data = {};
  document.querySelectorAll('[data-edit]').forEach(el => {
    data[el.dataset.edit] = el.innerHTML;
  });
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function enableEditMode() {
  editMode = true;
  document.querySelectorAll('[data-edit]').forEach(el => {
    el.contentEditable = 'true';
    el.classList.add('editable');
    el.addEventListener('input', saveContent);
  });
  document.getElementById('adminBar').style.display = 'flex';
}

function disableEditMode() {
  editMode = false;
  document.querySelectorAll('[data-edit]').forEach(el => {
    el.contentEditable = 'false';
    el.classList.remove('editable');
  });
  document.getElementById('adminBar').style.display = 'none';
  saveContent();
}

function injectAdminUI() {
  const bar = document.createElement('div');
  bar.id = 'adminBar';
  bar.innerHTML = `
    <span style="font-size:11px;letter-spacing:0.1em;opacity:0.5;">MODE ÉDITION — cliquez sur n'importe quel texte pour le modifier</span>
    <div style="display:flex;gap:0.75rem;">
      <button onclick="saveContent();showToast('Sauvegardé ✓')" class="admin-btn">Sauvegarder</button>
      <button onclick="if(confirm('Effacer toutes les modifications ?')){localStorage.removeItem('site_content_v1');location.reload();}" class="admin-btn admin-btn-danger">Réinitialiser</button>
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

  const style = document.createElement('style');
  style.textContent = `
    #adminBar {
      display:none; position:fixed; bottom:0; left:0; right:0; z-index:9999;
      background:rgba(20,19,18,0.97); border-top:0.5px solid rgba(232,226,216,0.15);
      padding:0.875rem 2rem; align-items:center; justify-content:space-between;
      font-family:'Inter',sans-serif; color:#e8e2d8; backdrop-filter:blur(8px);
    }
    .admin-btn {
      font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.12em;
      text-transform:uppercase; background:transparent;
      border:0.5px solid rgba(232,226,216,0.25); color:#e8e2d8;
      padding:6px 14px; border-radius:3px; cursor:pointer; transition:background 0.2s;
    }
    .admin-btn:hover { background:rgba(232,226,216,0.08); }
    .admin-btn-danger { border-color:rgba(200,80,80,0.4); color:rgba(220,120,120,0.9); }
    #editToggle {
      position:fixed; bottom:1.5rem; right:1.5rem; z-index:9998;
      font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.12em;
      text-transform:uppercase; background:rgba(14,13,12,0.9);
      border:0.5px solid rgba(232,226,216,0.15); color:rgba(232,226,216,0.3);
      padding:7px 14px; border-radius:3px; cursor:pointer; transition:color 0.2s;
    }
    #editToggle:hover { color:rgba(232,226,216,0.8); }
    [data-edit][contenteditable="true"] {
      outline:0.5px dashed rgba(232,226,216,0.3); outline-offset:4px;
      border-radius:2px; cursor:text; min-width:20px; min-height:1em;
    }
    [data-edit][contenteditable="true"]:hover { outline-color:rgba(232,226,216,0.6); background:rgba(232,226,216,0.03); }
    [data-edit][contenteditable="true"]:focus { outline-color:rgba(232,226,216,0.8); }
    #adminToast {
      position:fixed; bottom:5rem; right:1.5rem; z-index:9999;
      font-family:'Inter',sans-serif; font-size:10px; letter-spacing:0.1em;
      background:rgba(232,226,216,0.08); border:0.5px solid rgba(232,226,216,0.2);
      color:#e8e2d8; padding:8px 16px; border-radius:3px;
      opacity:0; transition:opacity 0.3s; pointer-events:none;
    }
  `;
  document.head.appendChild(style);

  const toast = document.createElement('div');
  toast.id = 'adminToast';
  document.body.appendChild(toast);
}

function showToast(msg) {
  const t = document.getElementById('adminToast');
  t.textContent = msg;
  t.style.opacity = '1';
  setTimeout(() => t.style.opacity = '0', 2000);
}

document.addEventListener('DOMContentLoaded', () => {
  injectAdminUI();
  loadSavedContent();
});
