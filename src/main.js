const terminal = document.getElementById("terminal");
const output = document.getElementById("output");
const form = document.getElementById("term-form");
const input = document.getElementById("term-input");

const history = [];
let historyIndex = 0;

function scrollToSection(id) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
}

const commands = {
  help: () => ["Perintah: about, projects, skills, contact, theme, clear"],
  about: () => ["Donna, backend developer.", "Suka Laravel, Tailwind, dan merangkai buket."],
  skills: () => ["laravel · tailwindcss · figma"],
  projects: () => { scrollToSection("projects"); return ["Membuka ~/projects ..."]; },
  contact: () => { scrollToSection("contact"); return ["Membuka ~/contact ..."]; },
  theme: () => { toggleTheme(); return ["Tema diganti."]; },
  clear: () => { output.innerHTML = ""; return []; },
};

function print(text, className = "") {
  const line = document.createElement("div");
  line.textContent = text; 
  if (className) line.className = className;
  output.appendChild(line);
  output.scrollTop = output.scrollHeight;
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const raw = input.value.trim();
  input.value = "";
  if (!raw) return;

  history.push(raw);
  historyIndex = history.length;
  print("$ " + raw, "text-code-str");

  const cmd = raw.toLowerCase();
  if (Object.hasOwn(commands, cmd)) {
    commands[cmd]().forEach((line) => print(line));
  } else {
    print(`command not found: ${raw}. Ketik "help".`, "text-code-key");
  }
});

input.addEventListener("keydown", (e) => {
  if (e.key === "ArrowUp" && historyIndex > 0) {
    e.preventDefault();
    input.value = history[--historyIndex];
  } else if (e.key === "ArrowDown") {
    e.preventDefault();
    historyIndex = Math.min(historyIndex + 1, history.length);
    input.value = history[historyIndex] ?? "";
  }
});

terminal.addEventListener("click", () => input.focus());

print('Selamat datang! Ketik "help" untuk mulai.', "text-code-text/60");