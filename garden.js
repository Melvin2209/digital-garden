// Mini moteur de digital garden : notes Markdown + [[liens wiki]] + backlinks.
const STAGES = { seedling: "🌱 Pousse", budding: "🌿 En croissance", evergreen: "🌳 Persistante" };
const app = document.getElementById("app");
let notes = [], cache = {}, activeTag = null;

const slugify = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
// Markdown minimal : titres, listes, citations, gras, code, liens.
const inline = s => s.replace(/`([^`]+)`/g, "<code>$1</code>").replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
  .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
function markdown(md) {
  return md.trim().split(/\n\s*\n/).map(block => {
    const lines = block.split("\n");
    const h = block.match(/^(#{1,3}) (.*)/);
    if (h) return `<h${h[1].length + 1}>${inline(h[2])}</h${h[1].length + 1}>`;
    if (lines.every(l => /^[-*] /.test(l))) return `<ul>${lines.map(l => `<li>${inline(l.slice(2))}</li>`).join("")}</ul>`;
    if (lines.every(l => /^\d+\. /.test(l))) return `<ol>${lines.map(l => `<li>${inline(l.replace(/^\d+\. /, ""))}</li>`).join("")}</ol>`;
    if (lines.every(l => l.startsWith(">"))) return `<blockquote>${inline(lines.map(l => l.replace(/^> ?/, "")).join(" "))}</blockquote>`;
    if (block.startsWith("```")) return `<pre><code>${block.replace(/```\w*/g, "").trim()}</code></pre>`;
    return `<p>${inline(block)}</p>`;
  }).join("\n");
}
const bySlug = slug => notes.find(n => n.slug === slug);

async function load(slug) {
  if (!cache[slug]) cache[slug] = await fetch(`notes/${slug}.md`).then(r => r.text());
  return cache[slug];
}

function linkify(md) {
  return md.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, target, label) => {
    const slug = slugify(target);
    const cls = bySlug(slug) ? "wikilink" : "wikilink missing";
    return `<a class="${cls}" href="#/${slug}">${label || bySlug(slug)?.title || target}</a>`;
  });
}

function card(n) {
  return `<a class="card" href="#/${n.slug}"><b>${n.title}</b><span>${STAGES[n.stage]} · ${n.updated}</span></a>`;
}

function home(query = "") {
  const tags = [...new Set(notes.flatMap(n => n.tags))].sort();
  const q = slugify(query);
  const list = notes
    .filter(n => !activeTag || n.tags.includes(activeTag))
    .filter(n => !q || slugify(n.title + " " + n.tags.join(" ")).includes(q))
    .sort((a, b) => b.updated.localeCompare(a.updated));
  app.innerHTML = `
    <h1>Bienvenue dans mon jardin</h1>
    <p>Je suis Melvin, apprenti ingénieur logiciel et étudiant à IMT Nord Europe. Ici je plante des idées pas finies et je les fais pousser avec le temps. Commence par <a href="#/a-propos">qui je suis</a> ou flâne entre les notes.</p>
    <p class="meta">${Object.values(STAGES).join(" → ")}</p>
    <div class="tags">${tags.map(t => `<button class="tag ${t === activeTag ? "on" : ""}" data-tag="${t}">#${t}</button>`).join("")}</div>
    <div class="grid">${list.map(card).join("") || "<p>Rien ne pousse ici… pour l'instant.</p>"}</div>`;
  app.querySelectorAll(".tag").forEach(b => b.onclick = () => { activeTag = activeTag === b.dataset.tag ? null : b.dataset.tag; home(query); });
}

async function page(slug) {
  const n = bySlug(slug);
  if (!n) { app.innerHTML = `<h1>Graine introuvable</h1><p>Cette note n'a pas encore été plantée. <a href="#/">Retour au jardin</a></p>`; return; }
  const md = await load(slug);
  const backs = [];
  await Promise.all(notes.filter(o => o.slug !== slug).map(async o => {
    const txt = await load(o.slug);
    const targets = [...txt.matchAll(/\[\[([^\]|]+)/g)].map(m => slugify(m[1]));
    if (targets.includes(slug)) backs.push(o);
  }));
  app.innerHTML = `
    <h1>${n.title}</h1>
    <p class="meta">${STAGES[n.stage]} · mis à jour le ${n.updated} · ${n.tags.map(t => "#" + t).join(" ")}</p>
    <article>${markdown(linkify(md))}</article>
    <section class="backlinks"><h3>Notes qui pointent ici</h3>
      ${backs.length ? `<div class="grid">${backs.map(card).join("")}</div>` : `<p class="meta">Aucune pour l'instant.</p>`}
    </section>`;
  scrollTo(0, 0);
}

function route() {
  const slug = location.hash.replace(/^#\/?/, "");
  slug ? page(slug) : home(document.getElementById("search").value);
}

document.getElementById("search").addEventListener("input", e => { if (location.hash.length > 2) location.hash = "/"; home(e.target.value); });
window.addEventListener("hashchange", route);
fetch("notes/index.json").then(r => r.json()).then(list => { notes = list; route(); });
