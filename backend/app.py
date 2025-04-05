from flask import Flask, jsonify, request
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)

with open('recipes.json', 'r') as f:
    recipes = json.load(f)

@app.route('/recipes', methods=['GET'])
def get_recipes():
    return jsonify(recipes)

@app.route('/recipes/<int:recipe_id>', methods=['GET'])
def get_recipe(recipe_id):
    recipe = next((r for r in recipes if r['id'] == recipe_id), None)
    if recipe:
        return jsonify(recipe)
    return jsonify({"error": "Recipe not found"}), 404

@app.route('/search', methods=['GET'])
def search_recipes():
    query = request.args.get('q', '').lower()
    result = [r for r in recipes if query in r['title'].lower()]
    return jsonify(result)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0')

