const fs = require('fs').promises;
const path = require('path');

const dataFile = path.join(__dirname, '..', 'data', 'favorites.json');

// Helper to ensure data file exists
const ensureDataFile = async () => {
  try {
    await fs.access(dataFile);
  } catch (error) {
    // Create file if it doesn't exist
    await fs.mkdir(path.dirname(dataFile), { recursive: true });
    await fs.writeFile(dataFile, JSON.stringify({}));
  }
};

// Read favorites data
const readFavorites = async () => {
  await ensureDataFile();
  const data = await fs.readFile(dataFile, 'utf8');
  return JSON.parse(data);
};

// Write favorites data
const writeFavorites = async (data) => {
  await ensureDataFile();
  await fs.writeFile(dataFile, JSON.stringify(data, null, 2));
};

// Get user favorites
exports.getFavorites = async (req, res) => {
  try {
    const userId = req.query.userId || 'default';
    const favorites = await readFavorites();
    
    res.json(favorites[userId] || []);
  } catch (error) {
    console.error('Error getting favorites:', error);
    res.status(500).json({ message: 'Failed to get favorites' });
  }
};

// Add to favorites
exports.addFavorite = async (req, res) => {
  try {
    const userId = req.body.userId || 'default';
    const recipe = req.body.recipe;
    
    if (!recipe || !recipe.id) {
      return res.status(400).json({ message: 'Invalid recipe data' });
    }
    
    const favorites = await readFavorites();
    
    // Initialize user favorites if they don't exist
    if (!favorites[userId]) {
      favorites[userId] = [];
    }
    
    // Check if recipe already exists
    const existingIndex = favorites[userId].findIndex(item => item.id === recipe.id);
    
    if (existingIndex >= 0) {
      return res.json({ message: 'Recipe already in favorites' });
    }
    
    // Add to favorites
    favorites[userId].push(recipe);
    await writeFavorites(favorites);
    
    res.status(201).json({ message: 'Recipe added to favorites' });
  } catch (error) {
    console.error('Error adding favorite:', error);
    res.status(500).json({ message: 'Failed to add favorite' });
  }
};

// Remove from favorites
exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.query.userId || 'default';
    const { id } = req.params;
    
    const favorites = await readFavorites();
    
    if (!favorites[userId]) {
      return res.status(404).json({ message: 'No favorites found' });
    }
    
    // Filter out the recipe
    favorites[userId] = favorites[userId].filter(recipe => recipe.id.toString() !== id.toString());
    await writeFavorites(favorites);
    
    res.json({ message: 'Recipe removed from favorites' });
  } catch (error) {
    console.error('Error removing favorite:', error);
    res.status(500).json({ message: 'Failed to remove favorite' });
  }
};
