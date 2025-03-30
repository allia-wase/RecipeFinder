const axios = require('axios');

const API_KEY = process.env.RECIPE_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Generate shopping list from multiple recipes
exports.generateShoppingList = async (req, res) => {
  try {
    const { recipeIds } = req.body;
    
    if (!recipeIds || !Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ message: 'Invalid recipe IDs' });
    }
    
    // Join recipe IDs for API call
    const ids = recipeIds.join(',');
    
    const response = await axios.get(`${BASE_URL}/informationBulk`, {
      params: {
        apiKey: API_KEY,
        ids
      }
    });
    
    // Extract ingredients from all recipes
    const allIngredients = [];
    response.data.forEach(recipe => {
      recipe.extendedIngredients.forEach(ingredient => {
        allIngredients.push({
          name: ingredient.name,
          amount: ingredient.amount,
          unit: ingredient.unit,
          original: ingredient.original
        });
      });
    });
    
    // Consolidate ingredients (combine duplicates)
    const consolidatedIngredients = {};
    allIngredients.forEach(ingredient => {
      const key = ingredient.name.toLowerCase();
      
      if (!consolidatedIngredients[key]) {
        consolidatedIngredients[key] = { ...ingredient };
      } else if (ingredient.unit === consolidatedIngredients[key].unit) {
        // Only combine if units match
        consolidatedIngredients[key].amount += ingredient.amount;
      } else {
        // If units don't match, keep separate entries
        consolidatedIngredients[`${key}_${ingredient.unit}`] = { ...ingredient };
      }
    });
    
    // Convert back to array
    const shoppingList = Object.values(consolidatedIngredients);
    
    res.json({
      recipeCount: recipeIds.length,
      ingredients: shoppingList
    });
  } catch (error) {
    console.error('Shopping list error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to generate shopping list',
      error: error.response?.data || error.message
    });
  }
};
