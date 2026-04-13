const root = document.documentElement;
const themeToggle = document.getElementById("theme-toggle");
const storedTheme = localStorage.getItem("theme");

if (storedTheme) {
  root.setAttribute("data-theme", storedTheme);
  updateToggleIcon(storedTheme);
} else {
  root.setAttribute("data-theme", "dark");
}

themeToggle.addEventListener("click", () => {
  const current = root.getAttribute("data-theme");
  const next = current === "dark" ? "light" : "dark";
  root.setAttribute("data-theme", next);
  localStorage.setItem("theme", next);
  updateToggleIcon(next);
});

function updateToggleIcon(theme) {
  const icon = themeToggle.querySelector(".toggle-icon");
  icon.textContent = theme === "dark" ? "🌙" : "☀️";
}

// ===== Footer year =====
document.getElementById("year").textContent = new Date().getFullYear();

// ===== Scroll reveal for sections =====
const revealElements = document.querySelectorAll(
  ".section, .project-card, .skills-column, .architecture-card, .contact-form, .contact-info"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  {
    threshold: 0.15,
  }
);

revealElements.forEach((el) => {
  el.classList.add("reveal");
  observer.observe(el);
});

// ===== Animate skill bars when visible =====
const skillFills = document.querySelectorAll(".skill-fill");

const skillsObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const level = el.getAttribute("data-level") || "60";
        el.style.width = level + "%";
        skillsObserver.unobserve(el);
      }
    });
  },
  { threshold: 0.4 }
);

skillFills.forEach((fill) => skillsObserver.observe(fill));

// ===== GitHub repositories integration =====
// Replace with your GitHub username
const GITHUB_USERNAME = "your-github-username";

async function loadGitHubRepos() {
  const container = document.getElementById("github-repos");
  if (!container) return;

  try {
    const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated`);
    if (!response.ok) {
      throw new Error("GitHub API error");
    }
    const repos = await response.json();

    const filtered = repos
      .filter((repo) => !repo.fork)
      .slice(0, 6);

    if (!filtered.length) {
      container.innerHTML = `<p class="github-loading">No public repositories found yet. Once you push projects, they will appear here.</p>`;
      return;
    }

    container.innerHTML = "";
    filtered.forEach((repo) => {
      const card = document.createElement("article");
      card.className = "github-repo-card";
      card.innerHTML = `
        <h4>${repo.name}</h4>
        <p>${repo.description ? repo.description : "No description provided."}</p>
        <div class="github-repo-meta">
          <span>${repo.language || "Unknown"}</span>
          <a href="${repo.html_url}" target="_blank" rel="noreferrer">View Repo →</a>
        </div>
      `;
      container.appendChild(card);
    });
  } catch (error) {
    container.innerHTML = `<p class="github-loading">Could not load repositories. Check your username or try again later.</p>`;
  }
}

loadGitHubRepos();
