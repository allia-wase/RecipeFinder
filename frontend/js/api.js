// API Service for Recipe Finder

const API_BASE_URL = '/api';

const RecipeAPI = {
  // Search recipes by query and filters
  searchRecipes: async (params) => {
    try {
      const queryParams = new URLSearchParams();
      
      // Add all search parameters
      Object.keys(params).forEach(key => {
        if (params[key]) {
          queryParams.append(key, params[key]);
        }
      });
      
      const response = await fetch(`${API_BASE_URL}/recipes/search?${queryParams}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search recipes error:', error);
      throw error;
    }
  },
  
  // Search recipes by ingredients
  searchByIngredients: async (ingredients) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/byIngredients?ingredients=${encodeURIComponent(ingredients)}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Search by ingredients error:', error);
      throw error;
    }
  },
  
  // Get recipe details by ID
  getRecipeDetails: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recipes/${id}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get recipe details error:', error);
      throw error;
    }
  },
  
  // Get user favorites
  getFavorites: async () => {
    try {
      const userId = localStorage.getItem('userId') || 'default';
      const response = await fetch(`${API_BASE_URL}/user/favorites?userId=${userId}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Get favorites error:', error);
      throw error;
    }
  },
  
  // Add recipe to favorites
  addToFavorites: async (recipe) => {
    try {
      const userId = localStorage.getItem('userId') || 'default';
      
      const response = await fetch(`${API_BASE_URL}/user/favorites`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          recipe
        })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Add to favorites error:', error);
      throw error;
    }
  },
  
  // Remove recipe from favorites
  removeFromFavorites: async (id) => {
    try {
      const userId = localStorage.getItem('userId') || 'default';
      
      const response = await fetch(`${API_BASE_URL}/user/favorites/${id}?userId=${userId}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Remove from favorites error:', error);
      throw error;
    }
  },
  
  // Generate shopping list
  generateShoppingList: async (recipeIds) => {
    try {
      const response = await fetch(`${API_BASE_URL}/shopping-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ recipeIds })
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Generate shopping list error:', error);
      throw error;
    }
  }
};
