const axios = require('axios');

// API configuration
const API_KEY = process.env.RECIPE_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

// Search recipes
exports.searchRecipes = async (req, res) => {
  try {
    const { query, cuisine, diet, intolerances, maxReadyTime } = req.query;
    
    const response = await axios.get(`${BASE_URL}/complexSearch`, {
      params: {
        apiKey: API_KEY,
        query,
        cuisine,
        diet,
        intolerances,
        maxReadyTime,
        instructionsRequired: true,
        addRecipeInformation: true,
        number: 12
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Recipe search error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch recipes',
      error: error.response?.data || error.message
    });
  }
};

// Get recipe details
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
        includeNutrition: true
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Recipe details error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch recipe details',
      error: error.response?.data || error.message
    });
  }
};

// Get recipe by ingredients
exports.getRecipesByIngredients = async (req, res) => {
  try {
    const { ingredients } = req.query;
    
    const response = await axios.get(`${BASE_URL}/findByIngredients`, {
      params: {
        apiKey: API_KEY,
        ingredients,
        number: 12,
        ranking: 1,
        ignorePantry: true
      }
    });
    
    res.json(response.data);
  } catch (error) {
    console.error('Recipe by ingredients error:', error.response?.data || error.message);
    res.status(500).json({ 
      message: 'Failed to fetch recipes by ingredients',
      error: error.response?.data || error.message
    });
  }
};
