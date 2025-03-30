const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Import routes
const recipeRoutes = require('./backend/routes/recipes');
const userRoutes = require('./backend/routes/users');
const shoppingListRoutes = require('./backend/routes/shoppingList');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'frontend')));

// API Routes
app.use('/api/recipes', recipeRoutes);
app.use('/api/user', userRoutes);
app.use('/api/shopping-list', shoppingListRoutes);

// Serve frontend
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;
