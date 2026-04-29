'use client';
import { useState } from 'react';

// ─── Fictional canteen data ───
const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MENU = {
  Monday: {
    soup: { name: 'Tomato & Basil Soup', price: 2.50, allergens: ['gluten'], vegetarian: true },
    special: '⭐ Freshers Week Special: Any hot meal + drink €7.50',
    meals: [
      { name: 'Roast Chicken with Mash & Gravy',  price: 6.50, kcal: 620, allergens: ['gluten','dairy'],        vegetarian: false },
      { name: 'Vegetable Thai Curry with Rice',    price: 5.80, kcal: 480, allergens: ['gluten','soy'],          vegetarian: true },
      { name: 'Beef Lasagne with Side Salad',      price: 6.20, kcal: 710, allergens: ['gluten','dairy','eggs'], vegetarian: false },
    ],
  },
  Tuesday: {
    soup: { name: 'Leek & Potato Soup', price: 2.50, allergens: ['dairy'], vegetarian: true },
    special: null,
    meals: [
      { name: 'Pork Stir-Fry with Noodles',       price: 6.00, kcal: 540, allergens: ['gluten','soy'],          vegetarian: false },
      { name: 'Cheese & Onion Quiche with Salad',  price: 5.50, kcal: 420, allergens: ['gluten','dairy','eggs'], vegetarian: true },
      { name: 'Chicken Caesar Wrap',               price: 5.80, kcal: 490, allergens: ['gluten','dairy','eggs'], vegetarian: false },
    ],
  },
  Wednesday: {
    soup: { name: 'Broccoli & Cheddar Soup', price: 2.50, allergens: ['dairy'], vegetarian: true },
    special: '🍔 Burger Wednesday: Upgrade to large chips for €1',
    meals: [
      { name: 'Beef Burger with Chips',         price: 7.00, kcal: 780, allergens: ['gluten','dairy','eggs'], vegetarian: false },
      { name: 'Vegan Buddha Bowl',              price: 6.00, kcal: 390, allergens: ['soy','nuts'],            vegetarian: true },
      { name: 'Salmon Fillet & New Potatoes',   price: 7.50, kcal: 520, allergens: ['fish'],                  vegetarian: false },
    ],
  },
  Thursday: {
    soup: { name: 'Carrot & Ginger Soup', price: 2.50, allergens: [], vegetarian: true },
    special: null,
    meals: [
      { name: 'Lamb Stew with Brown Bread',          price: 6.80, kcal: 650, allergens: ['gluten','dairy'], vegetarian: false },
      { name: 'Pasta Arrabiata (V)',                  price: 5.50, kcal: 430, allergens: ['gluten'],         vegetarian: true },
      { name: 'Chicken Tikka Masala & Basmati Rice',  price: 6.50, kcal: 590, allergens: ['dairy'],         vegetarian: false },
    ],
  },
  Friday: {
    soup: { name: 'French Onion Soup', price: 2.50, allergens: ['gluten','dairy'], vegetarian: true },
    special: '🐟 Friday Fish Special: Fish & Chips + tea/coffee €8.50',
    meals: [
      { name: 'Fish & Chips with Mushy Peas', price: 7.00, kcal: 820, allergens: ['gluten','fish'],         vegetarian: false },
      { name: 'Cheese Pizza (2 slices)',       price: 5.00, kcal: 560, allergens: ['gluten','dairy'],        vegetarian: true },
      { name: 'Chicken Fillet Roll',           price: 5.50, kcal: 490, allergens: ['gluten','dairy','eggs'], vegetarian: false },
    ],
  },
};

export default function Canteen() {
  const [day, setDay] = useState('Monday');
  const [vegOnly, setVegOnly] = useState(false);
  const data = MENU[day];
  const meals = vegOnly ? data.meals.filter((m) => m.vegetarian) : data.meals;

  return (
    <section aria-labelledby="canteen-heading">
      <h2 id="canteen-heading" className="text-2xl font-bold text-navy mb-4" style={{ fontFamily: 'Outfit' }}>Canteen Menu</h2>

      {/* Day buttons */}
      <div className="flex gap-2 mb-4 flex-wrap" role="group" aria-label="Select day">
        {DAYS.map((d) => (
          <button key={d} onClick={() => setDay(d)} aria-pressed={day === d}
            className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${day === d ? 'bg-navy text-white shadow-md' : 'bg-white text-navy border border-gray-200 hover:border-navy/30'}`}>
            {d.slice(0, 3)}
          </button>
        ))}
      </div>

      {/* Veg toggle */}
      <div className="flex items-center gap-2 mb-5">
        <button onClick={() => setVegOnly(!vegOnly)} role="switch" aria-checked={vegOnly} aria-label="Show vegetarian only"
          className={`relative w-11 h-6 rounded-full transition-colors ${vegOnly ? 'bg-emerald-500' : 'bg-gray-300'}`}>
          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${vegOnly ? 'translate-x-5' : ''}`} />
        </button>
        <span className="text-sm font-medium text-gray-700">Vegetarian only</span>
      </div>

      {/* Special */}
      {data.special && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-4 text-sm font-medium text-navy">{data.special}</div>
      )}

      {/* Soup */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Soup of the Day</h3>
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-5">
        <div className="flex justify-between">
          <span className="font-semibold">{data.soup.name}</span>
          <span className="font-bold">€{data.soup.price.toFixed(2)}</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-1">
          {data.soup.vegetarian && <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5">🥦 Vegetarian</span>}
          {data.soup.allergens.map((a) => <span key={a} className="inline-block rounded-full bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5">{a}</span>)}
        </div>
      </div>

      {/* Hot meals */}
      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-2">Hot Meals</h3>
      {meals.length === 0 ? (
        <div className="bg-white rounded-xl p-4 text-sm text-gray-400">No vegetarian hot meals today.</div>
      ) : (
        <div className="space-y-3">
          {meals.map((m, i) => (
            <div key={i} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex justify-between gap-3">
                <span className="font-semibold">{m.name}</span>
                <span className="font-bold whitespace-nowrap">€{m.price.toFixed(2)}</span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{m.kcal} kcal</p>
              <div className="mt-2 flex flex-wrap gap-1">
                {m.vegetarian && <span className="inline-block rounded-full bg-emerald-50 text-emerald-700 text-xs font-medium px-2 py-0.5">🥦 Vegetarian</span>}
                {m.allergens.map((a) => <span key={a} className="inline-block rounded-full bg-red-50 text-red-700 text-xs font-medium px-2 py-0.5">{a}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
