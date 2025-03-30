// UI Management for Recipe Finder

const UI = {
  // DOM Elements
  elements: {
    searchForm: document.getElementById('search-form'),
    searchQuery: document.getElementById('search-query'),
    cuisineSelect: document.getElementById('cuisine-select'),
    dietSelect: document.getElementById('diet-select'),
    quickMeals: document.getElementById('quick-meals'),
    ingredientSearchBtn: document.getElementById('ingredient-search-btn'),
    ingredientModal: new bootstrap.Modal(document.getElementById('ingredient-modal')),
    ingredientsInput: document.getElementById('ingredients-input'),
    searchByIngredientsBtn: document.getElementById('search-by-ingredients-btn'),
    resultsContainer: document.getElementById('results-container'),
    loader: document.getElementById('loader'),
    noResults: document.getElementById('no-results'),
    favoritesBtn: document.getElementById('favorites-btn'),
    favoritesSection: document.getElementById('favorites-section'),
    favoritesContainer: document.getElementById('favorites-container'),
    noFavorites: document.getElementById('no-favorites'),
    searchSection: document.getElementById('search-section'),
    resultsSection: document.getElementById('results-section'),
    shoppingListBtn: document.getElementById('shopping-list-btn'),
    shoppingListSection: document.getElementById('shopping-list-section'),
    generateListBtn: document.getElementById('generate-list-btn'),
    recipeSelection: document.getElementById('recipe-selection'),
    ingredientsList: document.getElementById('ingredients-list'),
    shoppingListResults: document.getElementById('shopping-list-results'),
    printShoppingList: document.getElementById('print-shopping-list'),
    recipeDetailModal: new bootstrap.Modal(document.getElementById('recipe-detail-modal')),
    recipeTitle: document.getElementById('recipe-title'),
    recipeDetails: document.getElementById('recipe-details'),
    addToFavorites: document.getElementById('add-to-favorites'),
    addToShopping: document.getElementById('add-to-shopping')
  },
  
  // Currently selected recipe ID
  currentRecipeId: null,
  
  // Selected recipes for shopping list
  selectedRecipesForShopping: [],
  
  // Initialize UI
  init: function() {
    // Create a unique user ID if not already present
    if (!localStorage.getItem('userId')) {
      localStorage.setItem('userId', 'user_' + Date.now());
    }
    
    // Generate a random user ID for demo purposes
    if (!localStorage.getItem('shoppingListRecipes')) {
      localStorage.setItem('shoppingListRecipes', JSON.stringify([]));
    }
  },
  
  // Show loader
  showLoader: function() {
    this.elements.loader.classList.remove('d-none');
    this.elements.resultsContainer.innerHTML = '';
    this.elements.noResults.classList.add('d-none');
  },
  
  // Hide loader
  hideLoader: function() {
    this.elements.loader.classList.add('d-none');
  },
  
  // Display recipe cards
  displayRecipes: function(recipes) {
    this.hideLoader();
    
    const container = this.elements.resultsContainer;
    container.innerHTML = '';
    
    if (!recipes || recipes.length === 0) {
      this.elements.noResults.classList.remove('d-none');
      return;
    }
    
    this.elements.noResults.classList.add('d-none');
    
    recipes.forEach(recipe => {
      const card = document.createElement('div');
      card.className = 'col';
      
      // Determine which property to use based on the API response format
      const imageUrl = recipe.image || recipe.imageUrl || 'https://via.placeholder.com/300x200?text=No+Image';
      const title = recipe.title || recipe.name;
      const id = recipe.id;
      
      card.innerHTML = `
        <div class="card h-100">
          <img src="${imageUrl}" class="card-img-top" alt="${title}">
          <div class="card-body">
            <h5 class="card-title">${title}</h5>
            ${recipe.readyInMinutes ? `<p class="card-text"><small class="text-muted">Ready in ${recipe.readyInMinutes} minutes</small></p>` : ''}
            ${recipe.missedIngredientCount ? `<p class="card-text"><small class="text-muted">Missing: ${recipe.missedIngredientCount} ingredients</small></p>` : ''}
          </div>
          <div class="card-footer">
            <button class="btn btn-sm btn-outline-primary view-recipe" data-id="${id}">View Recipe</button>
          </div>
        </div>
      `;
      
      container.appendChild(card);
      
      // Add event listener to the newly created button
      card.querySelector('.view-recipe').addEventListener('click', () => {
        this.showRecipeDetails(id);
      });
    });
  },
  
  // Show recipe details
  showRecipeDetails: async function(id) {
    try {
      // Show loading in modal
      this.elements.recipeDetails.innerHTML = '<div class="text-center"><div class="spinner-border"></div><p>Loading recipe details...</p></div>';
      this.elements.recipeTitle.textContent = 'Loading Recipe...';
      this.elements.recipeDetailModal.show();
      
      // Set current recipe ID
      this.currentRecipeId = id;
      
      // Fetch recipe details
      const recipe = await RecipeAPI.getRecipeDetails(id);
      
      // Update modal title
      this.elements.recipeTitle.textContent = recipe.title;
      
      // Check if recipe is in favorites to update button state
      const favorites = await RecipeAPI.getFavorites();
      const isInFavorites = favorites.some(fav => fav.id === recipe.id);
      
      // Update favorite button state
      const favoriteBtn = this.elements.addToFavorites;
      if (isInFavorites) {
        favoriteBtn.textContent = 'Remove from Favorites';
        favoriteBtn.classList.replace('btn-outline-danger', 'btn-danger');
      } else {
        favoriteBtn.textContent = 'Add to Favorites';
        favoriteBtn.classList.replace('btn-danger', 'btn-outline-danger');
      }
      
      // Check if recipe is in shopping list
      const shoppingListRecipes = JSON.parse(localStorage.getItem('shoppingListRecipes') || '[]');
      const isInShoppingList = shoppingListRecipes.some(r => r.id === recipe.id);
      
      // Update shopping list button state
      const shoppingBtn = this.elements.addToShopping;
      if (isInShoppingList) {
        shoppingBtn.textContent = 'Remove from Shopping List';
        shoppingBtn.classList.replace('btn-outline-primary', 'btn-primary');
      } else {
        shoppingBtn.textContent = 'Add to Shopping List';
        shoppingBtn.classList.replace('btn-primary', 'btn-outline-primary');
      }
      
      // Format recipe details HTML
      let detailsHtml = `
        <div class="row">
          <div class="col-md-5">
            <img src="${recipe.image}" class="img-fluid rounded" alt="${recipe.title}">
            <div class="mt-3">
              <h5>Quick Info:</h5>
              <ul class="list-group list-group-flush">
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Ready in: <span class="badge bg-success">${recipe.readyInMinutes} minutes</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Servings: <span class="badge bg-primary">${recipe.servings}</span>
                </li>
                <li class="list-group-item d-flex justify-content-between align-items-center">
                  Health Score: <span class="badge bg-info">${recipe.healthScore}/100</span>
                </li>
              </ul>
            </div>
          </div>
          <div class="col-md-7">
            <h5>Ingredients:</h5>
            <ul class="list-group mb-4">`;
      
      recipe.extendedIngredients.forEach(ingredient => {
        detailsHtml += `
          <li class="list-group-item">
            ${ingredient.original}
          </li>`;
      });
      
      detailsHtml += `</ul>
            <h5>Instructions:</h5>`;
      
      if (recipe.analyzedInstructions && recipe.analyzedInstructions.length > 0) {
        detailsHtml += `<ol class="mb-4">`;
        recipe.analyzedInstructions[0].steps.forEach(step => {
          detailsHtml += `<li class="mb-2">${
