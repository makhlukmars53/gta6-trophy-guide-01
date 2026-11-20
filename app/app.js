// Leonida Trophy Guide: checklist saved in localStorage, export/import, kind and grade
// filters, a spoiler setting that hides un-earned story trophies, and a roadmap view.
// Everything runs from local files; the only fetch is data/trophies.json under app/.
const KEY = 'gta6-trophy-checklist-v1';
const SPOILER_KEY = 'gta6-trophy-spoilers-v1';

const cardsEl = document.getElementById('cards');
const gradeEl = document.getElementById('grade');
const searchEl = document.getElementById('search');
const spoilerEl = document.getElementById('spoiler');
const earnedOnlyEl = document.getElementById('earned-only');
const summaryEl = document.getElementById('list-summary');
const emptyEl = document.getElementById('empty');
const noteEl = document.getElementById('filter-note');

let earned = new Set();
try { earned = new Set(JSON.parse(localStorage.getItem(KEY) ?? '[]')); } catch { earned = new Set(); }
let kind = 'all';
let spoilersHidden = localStorage.getItem(SPOILER_KEY) === '1';
spoilerEl.checked = spoilersHidden;

const doc = await (await fetch('data/trophies.json')).json();
const trophies = doc.trophies;

// Filter counts on the kind buttons.
const counts = { all: trophies.length, story: 0, missable: 0, collectibles: 0, activities: 0, online: 0 };
for (const t of trophies) {
  counts[t.kind] = (counts[t.kind] ?? 0) + 1;
  if (t.missable) counts.missable += 1;
}
for (const el of document.querySelectorAll('[data-count]')) {
  el.textContent = `(${counts[el.dataset.count] ?? 0})`;
}

function save() {
  localStorage.setItem(KEY, JSON.stringify([...earned].sort()));
}

function updateProgress() {
  const byGrade = { platinum: 0, gold: 0, silver: 0, bronze: 0 };
  for (const t of trophies) if (earned.has(t.name)) byGrade[t.grade] += 1;
  document.getElementById('earned-count').textContent = earned.size;
  document.getElementById('progress-fill').style.width = `${(earned.size / trophies.length) * 100}%`;
  const cap = (s) => s[0].toUpperCase() + s.slice(1);
  document.getElementById('progress-detail').textContent =
    ['platinum', 'gold', 'silver', 'bronze'].map((g) => `${byGrade[g]} ${cap(g)}`).join(' \u00b7 ') + ' earned';
}

function matches(t) {
  if (kind === 'missable' && !t.missable) return false;
  if (kind !== 'all' && kind !== 'missable' && t.kind !== kind) return false;
  if (gradeEl.value !== 'all' && t.grade !== gradeEl.value) return false;
  const q = searchEl.value.trim().toLowerCase();
  if (q && !(t.name.toLowerCase().includes(q) || t.description.toLowerCase().includes(q))) return false;
  if (earnedOnlyEl.checked && !earned.has(t.name)) return false;
  return true;
}

function render() {
  cardsEl.replaceChildren();
  let shown = 0;
  for (const t of trophies) {
    if (!matches(t)) continue;
    shown += 1;
    const isEarned = earned.has(t.name);
    const hidden = spoilersHidden && t.kind === 'story' && !isEarned;
    const card = document.createElement('article');
    card.className = 'card' + (isEarned ? ' earned' : '');
    card.dataset.name = t.name;

    const box = document.createElement('input');
    box.type = 'checkbox';
    box.checked = isEarned;
    box.setAttribute('aria-label', `Mark ${hidden ? 'story trophy' : t.name} as earned`);
    box.addEventListener('change', () => {
      if (box.checked) earned.add(t.name);
      else earned.delete(t.name);
      save();
      updateProgress();
      render();
    });
    card.append(box);

    const body = document.createElement('div');
    const head = document.createElement('div');
    head.className = 'card-head';
    const h = document.createElement('h3');
    h.textContent = hidden ? 'Hidden story trophy' : t.name;
    head.append(h);
    const grade = document.createElement('span');
    grade.className = `grade grade-${t.grade}`;
    grade.textContent = t.grade;
    head.append(grade);
    const kindTag = document.createElement('span');
    kindTag.className = 'tag';
    kindTag.textContent = t.kind;
    head.append(kindTag);
    if (t.missable) {
      const m = document.createElement('span');
      m.className = 'tag tag-missable';
      m.textContent = 'Possibly missable';
      head.append(m);
    }
    body.append(head);

    if (hidden) {
      const p = document.createElement('p');
      p.className = 'spoiler-hidden';
      p.textContent = 'Story trophy — its name, description and guide stay hidden until you earn it. Turn off “Hide story spoilers” to reveal it.';
      body.append(p);
    } else {
      const off = document.createElement('p');
      off.className = 'official';
      off.innerHTML = '';
      const offLabel = document.createElement('span');
      offLabel.className = 'label';
      offLabel.textContent = 'Official description — ';
      off.append(offLabel, document.createTextNode(t.description));
      body.append(off);

      const g = document.createElement('p');
      g.className = 'guide-text';
      const gLabel = document.createElement('span');
      gLabel.className = 'label';
      gLabel.textContent = 'Guide — ';
      g.append(gLabel, document.createTextNode(t.guide));
      body.append(g);

      if (t.note) {
        const n = document.createElement('p');
        n.className = 'note';
        n.textContent = t.note;
        body.append(n);
      }

      const s = document.createElement('p');
      s.className = 'sources';
      const sLabel = document.createElement('span');
      sLabel.className = 'label';
      sLabel.textContent = 'Sources — ';
      s.append(sLabel);
      t.sources.forEach((src, i) => {
        if (i) s.append(document.createTextNode(' · '));
        const a = document.createElement('a');
        a.href = src.url;
        a.target = '_blank';
        a.rel = 'noopener';
        a.textContent = src.name;
        s.append(a);
      });
      body.append(s);
    }
    card.append(body);
    cardsEl.append(card);
  }
  summaryEl.textContent = `Showing ${shown} of ${trophies.length} trophies — ${earned.size} earned.`;
  emptyEl.hidden = shown !== 0;
  noteEl.hidden = kind !== 'online';
  if (kind === 'online') {
    noteEl.textContent = 'There are no online trophies: all 55 trophies are single-player and offline, so this filter is empty by design.';
  }
  updateProgress();
}

document.querySelectorAll('.kind').forEach((btn) => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.kind').forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');
    kind = btn.dataset.kind;
    render();
  });
});
gradeEl.addEventListener('change', render);
searchEl.addEventListener('input', render);
earnedOnlyEl.addEventListener('change', render);
spoilerEl.addEventListener('change', () => {
  spoilersHidden = spoilerEl.checked;
  localStorage.setItem(SPOILER_KEY, spoilersHidden ? '1' : '0');
  render();
});

document.getElementById('export').addEventListener('click', () => {
  const payload = { game: 'Grand Theft Auto VI', platform: 'PlayStation 5', exported_at: new Date().toISOString(), earned: [...earned].sort() };
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' }));
  a.download = 'gta6-trophy-progress.json';
  a.click();
  URL.revokeObjectURL(a.href);
});
document.getElementById('import').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    const data = JSON.parse(await file.text());
    const names = Array.isArray(data) ? data : data.earned;
    const known = new Set(trophies.map((t) => t.name));
    const good = (names ?? []).filter((n) => known.has(n));
    if (!good.length && (names ?? []).length) throw new Error('no known trophy names in file');
    earned = new Set(good);
    save();
    render();
  } catch (err) {
    alert(`Could not import that file: ${err.message}`);
  }
  e.target.value = '';
});
document.getElementById('reset').addEventListener('click', () => {
  if (!confirm('Clear all earned ticks?')) return;
  earned = new Set();
  save();
  render();
});

// Tabs: checklist and roadmap.
const tabChecklist = document.getElementById('tab-checklist');
const tabRoadmap = document.getElementById('tab-roadmap');
const viewChecklist = document.getElementById('view-checklist');
const viewRoadmap = document.getElementById('view-roadmap');
function showTab(which) {
  const roadmap = which === 'roadmap';
  tabChecklist.classList.toggle('active', !roadmap);
  tabRoadmap.classList.toggle('active', roadmap);
  tabChecklist.removeAttribute('aria-current');
  tabRoadmap.removeAttribute('aria-current');
  (roadmap ? tabRoadmap : tabChecklist).setAttribute('aria-current', 'page');
  viewChecklist.hidden = roadmap;
  viewRoadmap.hidden = !roadmap;
}
tabChecklist.addEventListener('click', () => showTab('checklist'));
tabRoadmap.addEventListener('click', () => showTab('roadmap'));

render();
