// ---------- Storage helpers ----------
const STORE_KEYS = { videos: "lp_videos", notes: "lp_notes", lessons: "lp_lessons" };

function loadData(key) {
  try {
    return JSON.parse(localStorage.getItem(key)) || [];
  } catch {
    return [];
  }
}

function saveData(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

function todayStr() {
  return new Date().toISOString().slice(0, 10);
}

function formatDate(d) {
  if (!d) return "";
  const [y, m, day] = d.split("-");
  return `${day}/${m}/${y}`;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str ?? "";
  return div.innerHTML;
}

function extractYouTubeId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
    /(?:youtu\.be\/)([\w-]{11})/,
    /(?:youtube\.com\/embed\/)([\w-]{11})/,
    /(?:youtube\.com\/shorts\/)([\w-]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  if (/^[\w-]{11}$/.test(url.trim())) return url.trim();
  return null;
}

// ---------- Tabs ----------
document.querySelectorAll(".tab-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tab-btn").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".tab-panel").forEach((p) => p.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

// ---------- Generic form toggle ----------
function wireToggle(addBtnId, cancelBtnId, formId) {
  const addBtn = document.getElementById(addBtnId);
  const cancelBtn = document.getElementById(cancelBtnId);
  const form = document.getElementById(formId);
  addBtn.addEventListener("click", () => form.classList.toggle("hidden"));
  cancelBtn.addEventListener("click", () => {
    form.reset();
    form.classList.add("hidden");
  });
}

// ================= VIDEOS =================
let videos = loadData(STORE_KEYS.videos);

function renderVideos() {
  const list = document.getElementById("videoList");
  const empty = document.getElementById("videoEmpty");
  list.innerHTML = "";
  const sorted = [...videos].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  empty.classList.toggle("hidden", sorted.length > 0);

  sorted.forEach((v) => {
    const card = document.createElement("div");
    card.className = "video-card";
    card.innerHTML = `
      <iframe src="https://www.youtube.com/embed/${v.youtubeId}" title="${escapeHtml(v.title)}" allowfullscreen loading="lazy"></iframe>
      <div class="video-meta">
        <h3>${escapeHtml(v.title)}</h3>
        <div class="row">
          <span class="date">${formatDate(v.date)}</span>
          <button class="btn-danger" data-id="${v.id}">Xóa</button>
        </div>
      </div>
    `;
    card.querySelector(".btn-danger").addEventListener("click", () => {
      videos = videos.filter((x) => x.id !== v.id);
      saveData(STORE_KEYS.videos, videos);
      renderVideos();
    });
    list.appendChild(card);
  });
}

document.getElementById("videoForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const url = document.getElementById("videoUrl").value.trim();
  const title = document.getElementById("videoTitle").value.trim();
  const date = document.getElementById("videoDate").value || todayStr();
  const youtubeId = extractYouTubeId(url);
  if (!youtubeId) {
    alert("Link YouTube không hợp lệ. Vui lòng kiểm tra lại.");
    return;
  }
  videos.push({ id: uid(), title, date, youtubeId });
  saveData(STORE_KEYS.videos, videos);
  renderVideos();
  e.target.reset();
  e.target.classList.add("hidden");
});

wireToggle("addVideoBtn", "cancelVideoBtn", "videoForm");

// ================= NOTES =================
let notes = loadData(STORE_KEYS.notes);

function renderNotes() {
  const list = document.getElementById("noteList");
  const empty = document.getElementById("noteEmpty");
  list.innerHTML = "";
  const sorted = [...notes].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  empty.classList.toggle("hidden", sorted.length > 0);

  sorted.forEach((n) => {
    const card = document.createElement("div");
    card.className = "note-card";
    card.innerHTML = `
      <h3>${escapeHtml(n.title)}</h3>
      <span class="date">${formatDate(n.date)}</span>
      <p>${escapeHtml(n.content)}</p>
      <div class="row"><button class="btn-danger" data-id="${n.id}">Xóa</button></div>
    `;
    card.querySelector(".btn-danger").addEventListener("click", () => {
      notes = notes.filter((x) => x.id !== n.id);
      saveData(STORE_KEYS.notes, notes);
      renderNotes();
    });
    list.appendChild(card);
  });
}

document.getElementById("noteForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const title = document.getElementById("noteTitle").value.trim();
  const date = document.getElementById("noteDate").value || todayStr();
  const content = document.getElementById("noteContent").value.trim();
  notes.push({ id: uid(), title, date, content });
  saveData(STORE_KEYS.notes, notes);
  renderNotes();
  e.target.reset();
  e.target.classList.add("hidden");
});

wireToggle("addNoteBtn", "cancelNoteBtn", "noteForm");

// ================= LESSONS =================
let lessons = loadData(STORE_KEYS.lessons);

function renderLessons() {
  const list = document.getElementById("lessonList");
  const empty = document.getElementById("lessonEmpty");
  list.innerHTML = "";
  const sorted = [...lessons].sort((a, b) => (b.date || "").localeCompare(a.date || ""));
  empty.classList.toggle("hidden", sorted.length > 0);

  sorted.forEach((l) => {
    const card = document.createElement("div");
    card.className = "lesson-card";
    const exercisesHtml = (l.exercises || [])
      .map(
        (ex) => `
        <li class="${ex.done ? "done" : ""}">
          <input type="checkbox" data-ex="${ex.id}" ${ex.done ? "checked" : ""}>
          <span>${escapeHtml(ex.text)}</span>
        </li>`
      )
      .join("");

    card.innerHTML = `
      <div class="row">
        <div>
          <span class="date">${formatDate(l.date)}</span>
          <h3>${escapeHtml(l.title)}</h3>
        </div>
        <button class="btn-danger" data-id="${l.id}">Xóa</button>
      </div>
      ${l.summary ? `<p class="summary">${escapeHtml(l.summary)}</p>` : ""}
      ${exercisesHtml ? `<ul class="exercise-list">${exercisesHtml}</ul>` : ""}
    `;

    card.querySelector(".btn-danger").addEventListener("click", () => {
      lessons = lessons.filter((x) => x.id !== l.id);
      saveData(STORE_KEYS.lessons, lessons);
      renderLessons();
    });

    card.querySelectorAll('input[type="checkbox"]').forEach((cb) => {
      cb.addEventListener("change", () => {
        const ex = l.exercises.find((x) => x.id === cb.dataset.ex);
        if (ex) {
          ex.done = cb.checked;
          saveData(STORE_KEYS.lessons, lessons);
          renderLessons();
        }
      });
    });

    list.appendChild(card);
  });
}

document.getElementById("lessonForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const date = document.getElementById("lessonDate").value || todayStr();
  const title = document.getElementById("lessonTitle").value.trim();
  const summary = document.getElementById("lessonSummary").value.trim();
  const exercisesRaw = document.getElementById("lessonExercises").value.trim();
  const exercises = exercisesRaw
    ? exercisesRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean)
        .map((text) => ({ id: uid(), text, done: false }))
    : [];

  lessons.push({ id: uid(), date, title, summary, exercises });
  saveData(STORE_KEYS.lessons, lessons);
  renderLessons();
  e.target.reset();
  e.target.classList.add("hidden");
});

wireToggle("addLessonBtn", "cancelLessonBtn", "lessonForm");

// ---------- Init ----------
document.getElementById("videoDate").value = todayStr();
document.getElementById("noteDate").value = todayStr();
document.getElementById("lessonDate").value = todayStr();

renderVideos();
renderNotes();
renderLessons();
