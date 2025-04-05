const searchInput = document.getElementById("search");
const recipesContainer = document.getElementById("recipes");

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  fetchRecipes(query);
});

function fetchRecipes(query = "") {
  const url = query ? `http://localhost:5000/search?q=${query}` : "http://localhost:5000/recipes";

  fetch(url)
    .then(res => res.json())
    .then(data => {
      recipesContainer.innerHTML = "";
      data.forEach(recipe => {
        const div = document.createElement("div");
        div.className = "recipe-card";
        div.innerHTML = `
          <h3>${recipe.title}</h3>
          <p><strong>Ingredients:</strong> ${recipe.ingredients.join(", ")}</p>
          <p>${recipe.instructions}</p>
        `;
        recipesContainer.appendChild(div);
      });
    });
}

// Initial load
fetchRecipes();

