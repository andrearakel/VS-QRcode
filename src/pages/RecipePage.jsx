import { useParams, Link } from 'react-router-dom';
import recipes from '../data/recipes.json';

export default function RecipePage() {
  const { id, index } = useParams();
  const recipeIndex = parseInt(index, 10);
  const productRecipes = recipes[id];

  if (!productRecipes || !productRecipes[recipeIndex]) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="text-center">
          <p className="text-4xl mb-4">🍽️</p>
          <h1 className="text-xl font-bold text-gray-900 mb-2">Recipe not found</h1>
          <Link to={`/product/${id}`} className="text-blue-600 underline text-sm">
            ← Back to product
          </Link>
        </div>
      </div>
    );
  }

  const recipe = productRecipes[recipeIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white px-6 pt-12 pb-8">
        <Link
          to={`/product/${id}`}
          className="inline-flex items-center gap-1 text-orange-100 hover:text-white text-sm mb-4 transition-colors"
        >
          ← Back to product
        </Link>
        <h1 className="text-2xl font-bold leading-tight">{recipe.name}</h1>
        <div className="flex items-center gap-4 mt-3 text-orange-100 text-sm">
          <span className="flex items-center gap-1">
            <span>👥</span> {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            <span>⏱️</span> {recipe.cook_time_min} min
          </span>
        </div>
      </div>

      <div className="px-6 py-6 space-y-6 max-w-lg mx-auto">
        {/* Ingredients */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
            <span>🥘</span> Ingredients
          </h2>
          <ul className="space-y-2">
            {recipe.ingredients.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="mt-1.5 w-2 h-2 bg-orange-400 rounded-full flex-shrink-0"></span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Steps */}
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
            <span>📝</span> Method
          </h2>
          <ol className="space-y-4">
            {recipe.steps.map((step, i) => (
              <li key={i} className="flex gap-3 text-sm text-gray-700">
                <span className="flex-shrink-0 w-7 h-7 bg-orange-100 text-orange-700 rounded-full flex items-center justify-center font-bold text-xs">
                  {i + 1}
                </span>
                <p className="pt-1 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </div>

        {/* Browse other recipes */}
        {productRecipes.length > 1 && (
          <div className="bg-white rounded-2xl p-5 shadow-sm">
            <h2 className="font-bold text-gray-900 text-lg mb-3">More recipes</h2>
            <div className="space-y-2">
              {productRecipes.map((other, i) => {
                if (i === recipeIndex) return null;
                return (
                  <Link
                    key={i}
                    to={`/product/${id}/recipe/${i}`}
                    className="flex items-center gap-3 p-3 bg-orange-50 rounded-xl hover:bg-orange-100 transition-colors"
                  >
                    <span className="text-2xl">👨‍🍳</span>
                    <span className="text-sm font-medium text-orange-900 flex-1">
                      {other.name}
                    </span>
                    <span className="text-orange-400 text-lg">›</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}