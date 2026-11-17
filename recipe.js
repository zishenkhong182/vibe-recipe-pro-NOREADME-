// recipe.js – client side logic for Smart Recipe Finder

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const resultsDiv = document.getElementById("results");
  const loadingEl = document.getElementById("loading");
  const errorEl = document.getElementById("error");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const query = input.value.trim();
    if (!query) return;

    // Reset UI
    resultsDiv.innerHTML = "";
    errorEl.classList.add("hidden");
    loadingEl.classList.remove("hidden");

    try {
      const resp = await fetch(`/api/recipes?query=${encodeURIComponent(query)}`);
      const data = await resp.json();
      loadingEl.classList.add("hidden");

      if (!resp.ok) {
        throw new Error(data.error || "Failed to fetch recipes");
      }

      if (!data.results || data.results.length === 0) {
        errorEl.textContent = "No recipes found.";
        errorEl.classList.remove("hidden");
        return;
      }

      // Render cards
      data.results.forEach((recipe) => {
        const card = document.createElement("div");
        card.className = "card";
        const img = document.createElement("img");
        img.src = recipe.image || "";
        img.alt = recipe.title;
        const info = document.createElement("div");
        info.className = "info";
        const title = document.createElement("h3");
        title.textContent = recipe.title;
        const link = document.createElement("a");
        link.href = `https://spoonacular.com/recipes/${recipe.title.replace(/\s+/g, "-")}-${recipe.id}`;
        link.target = "_blank";
        link.rel = "noopener";
        link.textContent = "View on Spoonacular";
        info.appendChild(title);
        info.appendChild(link);
        card.appendChild(img);
        card.appendChild(info);
        resultsDiv.appendChild(card);
      });
    } catch (err) {
      loadingEl.classList.add("hidden");
      errorEl.textContent = err.message;
      errorEl.classList.remove("hidden");
    }
  });
});
