'use client';
import { useState } from 'react';

// ─── All canteen meals in one flat list (fictional) ───
const ALL_MEALS = [
  { name: 'Roast Chicken with Mash & Gravy',  price: 6.50, kcal: 620, allergens: ['gluten','dairy'],        vegetarian: false, day: 'Monday' },
  { name: 'Vegetable Thai Curry with Rice',    price: 5.80, kcal: 480, allergens: ['gluten','soy'],          vegetarian: true,  day: 'Monday' },
  { name: 'Beef Lasagne with Side Salad',      price: 6.20, kcal: 710, allergens: ['gluten','dairy','eggs'], vegetarian: false, day: 'Monday' },
  { name: 'Pork Stir-Fry with Noodles',        price: 6.00, kcal: 540, allergens: ['gluten','soy'],          vegetarian: false, day: 'Tuesday' },
  { name: 'Cheese & Onion Quiche with Salad',  price: 5.50, kcal: 420, allergens: ['gluten','dairy','eggs'], vegetarian: true,  day: 'Tuesday' },
  { name: 'Chicken Caesar Wrap',               price: 5.80, kcal: 490, allergens: ['gluten','dairy','eggs'], vegetarian: false, day: 'Tuesday' },
  { name: 'Beef Burger with Chips',            price: 7.00, kcal: 780, allergens: ['gluten','dairy','eggs'], vegetarian: false, day: 'Wednesday' },
  { name: 'Vegan Buddha Bowl',                 price: 6.00, kcal: 390, allergens: ['soy','nuts'],            vegetarian: true,  day: 'Wednesday' },
  { name: 'Salmon Fillet & New Potatoes',      price: 7.50, kcal: 520, allergens: ['fish'],                  vegetarian: false, day: 'Wednesday' },
  { name: 'Lamb Stew with Brown Bread',        price: 6.80, kcal: 650, allergens: ['gluten','dairy'],        vegetarian: false, day: 'Thursday' },
  { name: 'Pasta Arrabiata (V)',               price: 5.50, kcal: 430, allergens: ['gluten'],                vegetarian: true,  day: 'Thursday' },
  { name: 'Chicken Tikka Masala & Basmati Rice', price: 6.50, kcal: 590, allergens: ['dairy'],              vegetarian: false, day: 'Thursday' },
  { name: 'Fish & Chips with Mushy Peas',      price: 7.00, kcal: 820, allergens: ['gluten','fish'],         vegetarian: false, day: 'Friday' },
  { name: 'Cheese Pizza (2 slices)',            price: 5.00, kcal: 560, allergens: ['gluten','dairy'],        vegetarian: true,  day: 'Friday' },
  { name: 'Chicken Fillet Roll',               price: 5.50, kcal: 490, allergens: ['gluten','dairy','eggs'], vegetarian: false, day: 'Friday' },
];

// Every unique allergen in the dataset
const ALLERGEN_LIST = ['gluten', 'dairy', 'eggs', 'soy', 'nuts', 'fish'];

// ─── ML: Content-based filtering with cosine similarity ───
//
// How it works:
// 1. We turn each meal into a numeric feature vector:
//    [price_normalised, kcal_normalised, is_vegetarian, ...allergen_flags]
// 2. We build an "ideal meal" vector from the user's preferences.
// 3. We compute cosine similarity between the ideal vector and every meal.
// 4. Meals with allergens the user wants to avoid are filtered out.
// 5. Results are ranked by similarity score (highest = best match).

function normalise(value, min, max) {
  if (max === min) return 0;
  return (value - min) / (max - min);
}

function cosineSimilarity(a, b) {
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot  += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  magA = Math.sqrt(magA);
  magB = Math.sqrt(magB);
  if (magA === 0 || magB === 0) return 0;
  return dot / (magA * magB);
}

function recommend(prefs) {
  const { maxPrice, targetKcal, vegOnly, avoidAllergens } = prefs;

  // Price & kcal ranges in the dataset (for normalisation)
  const prices = ALL_MEALS.map((m) => m.price);
  const kcals  = ALL_MEALS.map((m) => m.kcal);
  const minP = Math.min(...prices), maxP = Math.max(...prices);
  const minK = Math.min(...kcals),  maxK = Math.max(...kcals);

  // Build the ideal vector the user wants
  const idealPrice = normalise(maxPrice, minP, maxP);
  const idealKcal  = normalise(targetKcal, minK, maxK);
  const idealVeg   = vegOnly ? 1 : 0;
  // For allergens in the ideal vector, 0 = "I don't want this allergen present"
  const idealAllergens = ALLERGEN_LIST.map((a) => (avoidAllergens.includes(a) ? 0 : 1));
  const idealVector = [idealPrice, idealKcal, idealVeg, ...idealAllergens];

  // Score each meal
  const scored = ALL_MEALS
    // Hard filter: remove meals with avoided allergens
    .filter((m) => !m.allergens.some((a) => avoidAllergens.includes(a)))
    // Hard filter: remove non-veg if vegOnly
    .filter((m) => (!vegOnly || m.vegetarian))
    // Hard filter: remove meals over budget
    .filter((m) => m.price <= maxPrice)
    .map((meal) => {
      const mealPrice = normalise(meal.price, minP, maxP);
      const mealKcal  = normalise(meal.kcal, minK, maxK);
      const mealVeg   = meal.vegetarian ? 1 : 0;
      const mealAllergens = ALLERGEN_LIST.map((a) => (meal.allergens.includes(a) ? 0 : 1));
      const mealVector = [mealPrice, mealKcal, mealVeg, ...mealAllergens];

      const score = cosineSimilarity(idealVector, mealVector);
      return { ...meal, score };
    })
    .sort((a, b) => b.score - a.score);

  return scored;
}

// ─── Component ───
export default function MealRecommender() {
  const [maxPrice, setMaxPrice]     = useState(7.00);
  const [targetKcal, setTargetKcal] = useState(550);
  const [vegOnly, setVegOnly]       = useState(false);
  const [avoid, setAvoid]           = useState([]);
  const [results, setResults]       = useState(null);

  function toggleAllergen(a) {
    setAvoid((prev) => prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]);
  }

  function run() {
    const recs = recommend({ maxPrice, targetKcal, vegOnly, avoidAllergens: avoid });
    setResults(recs);
  }

  return (
    <section aria-labelledby="ml-heading">
      <h2 id="ml-heading" className="text-2xl font-bold text-navy mb-1" style={{ fontFamily: 'Outfit' }}>
        Meal Recommender
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Uses <strong>content-based filtering</strong> with <strong>cosine similarity</strong> to rank meals against your preferences.
      </p>

      {/* Preferences form */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6 space-y-4">
        <h3 className="font-semibold text-navy">Your Preferences</h3>

        {/* Budget slider */}
        <div>
          <label htmlFor="ml-price" className="block text-sm font-medium text-gray-700 mb-1">
            Max budget: <strong>€{maxPrice.toFixed(2)}</strong>
          </label>
          <input id="ml-price" type="range" min="4" max="8" step="0.50" value={maxPrice}
            onChange={(e) => setMaxPrice(parseFloat(e.target.value))}
            className="w-full accent-[#1a2744]" />
          <div className="flex justify-between text-xs text-gray-400"><span>€4.00</span><span>€8.00</span></div>
        </div>

        {/* Calorie slider */}
        <div>
          <label htmlFor="ml-kcal" className="block text-sm font-medium text-gray-700 mb-1">
            Target calories: <strong>{targetKcal} kcal</strong>
          </label>
          <input id="ml-kcal" type="range" min="300" max="900" step="50" value={targetKcal}
            onChange={(e) => setTargetKcal(parseInt(e.target.value))}
            className="w-full accent-[#1a2744]" />
          <div className="flex justify-between text-xs text-gray-400"><span>300 kcal</span><span>900 kcal</span></div>
        </div>

        {/* Veg toggle */}
        <div className="flex items-center gap-2">
          <button onClick={() => setVegOnly(!vegOnly)} role="switch" aria-checked={vegOnly} aria-label="Vegetarian only"
            className={`relative w-11 h-6 rounded-full transition-colors ${vegOnly ? 'bg-emerald-500' : 'bg-gray-300'}`}>
            <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${vegOnly ? 'translate-x-5' : ''}`} />
          </button>
          <span className="text-sm font-medium text-gray-700">Vegetarian only</span>
        </div>

        {/* Allergen avoidance */}
        <div>
          <p className="text-sm font-medium text-gray-700 mb-2">Avoid allergens:</p>
          <div className="flex flex-wrap gap-2">
            {ALLERGEN_LIST.map((a) => (
              <button key={a} onClick={() => toggleAllergen(a)} aria-pressed={avoid.includes(a)}
                className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-all ${
                  avoid.includes(a) ? 'bg-red-100 text-red-700 ring-2 ring-red-300' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {a}
              </button>
            ))}
          </div>
        </div>

        <button onClick={run} className="w-full bg-navy text-white font-semibold py-2.5 rounded-lg hover:bg-navy-light transition-colors">
          Get Recommendations
        </button>
      </div>

      {/* Results */}
      {results !== null && (
        <div>
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-3">
            {results.length > 0 ? `${results.length} meal${results.length !== 1 ? 's' : ''} matched` : 'No matches'}
          </h3>

          {results.length === 0 ? (
            <div className="bg-white rounded-xl p-6 text-center text-gray-400 shadow-sm">
              No meals match your preferences. Try adjusting your budget or removing some allergen filters.
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((m, i) => (
                <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        {i === 0 && <span className="bg-gold text-navy text-[0.65rem] font-bold px-2 py-0.5 rounded-full">⭐ Best Match</span>}
                        <span className="bg-navy/10 text-navy text-[0.65rem] font-bold px-2 py-0.5 rounded-full">
                          {Math.round(m.score * 100)}% match
                        </span>
                      </div>
                      <h4 className="font-semibold text-navy mt-1">{m.name}</h4>
                      <p className="text-sm text-gray-500 mt-0.5">{m.day} · {m.kcal} kcal</p>
                    </div>
                    <span className="font-bold text-navy whitespace-nowrap">€{m.price.toFixed(2)}</span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {m.vegetarian && <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5">🥦 Vegetarian</span>}
                    {m.allergens.map((a) => <span key={a} className="inline-block rounded-full bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5">{a}</span>)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* How it works explanation */}
          <details className="mt-6 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
            <summary className="font-semibold text-navy cursor-pointer text-sm">How does this work? (ML explanation)</summary>
            <div className="mt-3 text-sm text-gray-600 space-y-2">
              <p>This recommender uses <strong>content-based filtering</strong>, a classical machine learning technique. Here's the process:</p>
              <ol className="list-decimal list-inside space-y-1">
                <li><strong>Feature extraction</strong> — Each meal is converted into a numeric vector: [price, calories, vegetarian flag, allergen flags].</li>
                <li><strong>Normalisation</strong> — Price and calorie values are scaled to 0–1 using min-max normalisation so no single feature dominates.</li>
                <li><strong>Ideal vector</strong> — Your preferences are turned into the same vector format, representing your "perfect meal".</li>
                <li><strong>Cosine similarity</strong> — We calculate the angle between the meal vector and your ideal vector. A score of 1.0 means a perfect match; 0.0 means no similarity.</li>
                <li><strong>Hard filters</strong> — Meals over your budget, with avoided allergens, or non-vegetarian (if selected) are removed before scoring.</li>
                <li><strong>Ranking</strong> — Remaining meals are sorted by similarity score, highest first.</li>
              </ol>
              <p>The formula: <code>similarity = (A · B) / (|A| × |B|)</code></p>
            </div>
          </details>
        </div>
      )}
    </section>
  );
}
