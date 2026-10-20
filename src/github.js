const GH_USER = "RamdonnaKamaliah";
const levelClass = ["bg-ink/10", "bg-accent/40", "bg-accent/70", "bg-primary/70", "bg-primary"];
const monthFmt = new Intl.DateTimeFormat("id-ID", { month: "short", timeZone: "UTC" });

function el(tag, className = "") {
  const node = document.createElement(tag);
  node.className = className;
  return node;
}

async function loadGithub() {
  const graph = document.getElementById("gh-graph");
  const total = document.getElementById("gh-total");
  if (!graph) return;

  try {
    const res = await fetch(`https://github-contributions-api.jogruber.de/v4/${GH_USER}?y=last`);
    if (!res.ok) throw new Error(res.status);
    const { contributions: days } = await res.json();

    const offset = new Date(days[0].date + "T00:00:00Z").getUTCDay();
    const weeks = Math.ceil((offset + days.length) / 7);

    const root = el("div", "min-w-[480px] lg:min-w-0");

    // Baris nama bulan
    const months = el("div", "grid gap-[2px] mb-1");
    months.style.gridTemplateColumns = `repeat(${weeks}, minmax(0, 1fr))`;

    const labels = [];
    let prev = -1;
    for (let w = 0; w < weeks; w++) {
      const day = days[Math.max(w * 7 - offset, 0)];
      const m = new Date(day.date + "T00:00:00Z").getUTCMonth();
      if (m !== prev) {
        labels.push({ w, date: day.date });
        prev = m;
      }
    }
    // Buang label pertama kalau terlalu dekat dengan label kedua (biar tidak bertumpuk)
    if (labels.length > 1 && labels[1].w - labels[0].w < 3) labels.shift();

    labels.forEach(({ w, date }) => {
      const label = el("span", "font-mono text-[10px] text-ink/60 whitespace-nowrap");
      label.textContent = monthFmt.format(new Date(date + "T00:00:00Z"));
      label.style.gridColumnStart = w + 1;
      label.style.gridRowStart = 1;
      months.appendChild(label);
    });

    // Kotak-kotak kontribusi
    const grid = el("div", "grid grid-flow-col gap-[2px]");
    grid.style.gridTemplateRows = "repeat(7, auto)";
    grid.style.gridTemplateColumns = `repeat(${weeks}, minmax(0, 1fr))`;

    for (let i = 0; i < offset; i++) grid.appendChild(el("div", "aspect-square"));

    days.forEach((d) => {
      const cell = el("div", `aspect-square rounded-[2px] ${levelClass[d.level]}`);
      cell.title = `${d.count} kontribusi pada ${d.date}`;
      grid.appendChild(cell);
    });

    // Legenda
    const legend = el("div", "flex items-center justify-end gap-1 mt-2 font-mono text-[10px] text-ink/60");
    legend.append("Sedikit");
    levelClass.forEach((c) => legend.appendChild(el("span", `w-2.5 h-2.5 rounded-[2px] ${c}`)));
    legend.append("Banyak");

    root.append(months, grid, legend);
    graph.replaceChildren(root);

    const sum = days.reduce((s, d) => s + d.count, 0);
    total.textContent = `${sum.toLocaleString("id-ID")} kontribusi dalam setahun terakhir`;
  } catch {
    graph.textContent = "Gagal memuat data GitHub.";
  }
}

loadGithub();