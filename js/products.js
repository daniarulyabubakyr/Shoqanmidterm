/* Product data. Each object describes one item in the catalog. */
'use strict';

const ALL_SIZES = ['S', 'M', 'L', 'XL', 'XXL'];
const MAIN_COLORS = ['Black', 'Navy', 'Grey'];

// These describe the actual representative photos, not the demo product names.
const imageAlt = {
  'suit.jpg': 'Close view of a blue checked three-piece suit with a white shirt and dark tie.',
  'shirt.jpg': 'Blue patterned button-up shirt on a hanger against a pale background.',
  'coat.jpg': 'Model wearing a long brown overcoat over a white shirt.',
  'trousers.jpg': 'Model wearing black tailored trousers and a white short-sleeved shirt.',
  'blazer.jpg': 'Navy windowpane blazer styled with a white shirt and black tie.',
  'polo.jpg': 'Close view of a black polo shirt with buttoned collar.',
  'overcoat.jpg': 'Model in a camel overcoat and brown roll-neck sweater.',
  'white-shirt.jpg': 'White long-sleeved dress shirt with a patterned tie and a jacket held at the side.',
  'pleated-trousers.jpg': 'Model wearing black tailored trousers; a representative trouser photograph.',
  'accessories.jpg': 'Row of assorted patterned neckties hanging side by side.'
};

/* Each product has a real, distinct name and price. Images are local. */
const products = [
  {
    id: 'classic-wool-suit',
    name: 'Classic Wool Suit',
    category: 'Suits',
    price: 129000,
    oldPrice: 149000,
    image: 'suit.jpg',
    badge: 'New',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES,
    description: 'A timeless two-piece suit, cut for a clean silhouette. Soft wool fabric, a two-button jacket and neatly tailored trousers make it an easy choice for work and special occasions.'
  },
  {
    id: 'oxford-cotton-shirt',
    name: 'Oxford Cotton Shirt',
    category: 'Shirts',
    price: 24900,
    image: 'shirt.jpg',
    badge: 'New',
    colors: ['White', 'Navy', 'Grey'],
    sizes: ALL_SIZES,
    description: 'A breathable cotton Oxford with a button-down collar and a comfortable regular fit. An everyday shirt that works just as well with tailoring as it does on its own.'
  },
  {
    id: 'double-breasted-coat',
    name: 'Double-Breasted Coat',
    category: 'Coats',
    price: 119000,
    oldPrice: 139000,
    image: 'coat.jpg',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES,
    description: 'A structured wool-blend coat with a double-breasted front, broad lapels and a smooth lining. Designed for warmth without losing a clean, classic shape.'
  },
  {
    id: 'tailored-trousers',
    name: 'Tailored Trousers',
    category: 'Trousers',
    price: 34900,
    image: 'trousers.jpg',
    badge: 'New',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES,
    description: 'Flat-front trousers with a neatly tapered leg and a comfortable waistband. A versatile foundation for a considered wardrobe, from office days to evening plans.'
  },
  {
    id: 'navy-blazer',
    name: 'Navy Blazer',
    category: 'Suits',
    price: 74900,
    image: 'blazer.jpg',
    colors: ['Navy', 'Black', 'Grey'],
    sizes: ALL_SIZES,
    description: 'An easy single-breasted blazer with a lightly structured shoulder. Pair with tailored trousers for a formal look or wear over a polo for a quieter approach.'
  },
  {
    id: 'merino-polo',
    name: 'Merino Polo',
    category: 'Shirts',
    price: 29900,
    image: 'polo.jpg',
    colors: MAIN_COLORS,
    sizes: ['S', 'M', 'L', 'XL'],
    description: 'A fine-knit merino polo with a soft collar and ribbed cuffs. Light enough to wear beneath a jacket, with a clean finish that also works on its own.'
  },
  {
    id: 'classic-overcoat',
    name: 'Classic Overcoat',
    category: 'Coats',
    price: 109000,
    image: 'overcoat.jpg',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES,
    description: 'A longline overcoat in a substantial wool blend. The simple single-breasted shape leaves room for a jacket underneath while keeping the silhouette neat.'
  },
  {
    id: 'formal-white-shirt',
    name: 'Formal White Shirt',
    category: 'Shirts',
    price: 27900,
    image: 'white-shirt.jpg',
    colors: ['White', 'Navy', 'Grey'],
    sizes: ALL_SIZES,
    description: 'A crisp cotton shirt with a classic spread collar and smooth finish. Designed to sit comfortably beneath tailoring for formal occasions and everyday work.'
  },
  {
    id: 'pleated-trousers',
    name: 'Pleated Trousers',
    category: 'Trousers',
    price: 39900,
    image: 'pleated-trousers.jpg',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES,
    description: 'Single-pleat trousers with a relaxed upper leg and a gentle taper. Thoughtful proportions bring comfort and a classic feel to everyday dressing.'
  },
  {
    id: 'charcoal-business-suit',
    name: 'Charcoal Business Suit',
    category: 'Suits',
    price: 139000,
    image: 'suit.jpg',
    colors: ['Grey', 'Black', 'Navy'],
    sizes: ALL_SIZES
  },
  {
    id: 'poplin-office-shirt',
    name: 'Poplin Office Shirt',
    category: 'Shirts',
    price: 22900,
    image: 'white-shirt.jpg',
    colors: ['White', 'Grey', 'Navy'],
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'wool-car-coat',
    name: 'Wool Car Coat',
    category: 'Coats',
    price: 99000,
    image: 'coat.jpg',
    colors: ['Black', 'Grey', 'Navy'],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'straight-leg-trousers',
    name: 'Straight-Leg Trousers',
    category: 'Trousers',
    price: 32900,
    image: 'trousers.jpg',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES
  },
  {
    id: 'textured-wool-blazer',
    name: 'Textured Wool Blazer',
    category: 'Suits',
    price: 84900,
    image: 'blazer.jpg',
    colors: ['Grey', 'Navy', 'Black'],
    sizes: ALL_SIZES
  },
  {
    id: 'cotton-knit-polo',
    name: 'Cotton Knit Polo',
    category: 'Shirts',
    price: 26900,
    image: 'polo.jpg',
    colors: MAIN_COLORS,
    sizes: ['S', 'M', 'L']
  },
  {
    id: 'winter-wool-overcoat',
    name: 'Winter Wool Overcoat',
    category: 'Coats',
    price: 149000,
    image: 'overcoat.jpg',
    colors: MAIN_COLORS,
    sizes: ['M', 'L', 'XL', 'XXL']
  },
  {
    id: 'slim-fit-oxford',
    name: 'Slim-Fit Oxford Shirt',
    category: 'Shirts',
    price: 25900,
    image: 'shirt.jpg',
    colors: ['White', 'Navy', 'Grey'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'wool-flannel-trousers',
    name: 'Wool Flannel Trousers',
    category: 'Trousers',
    price: 42900,
    image: 'pleated-trousers.jpg',
    colors: ['Grey', 'Black', 'Navy'],
    sizes: ALL_SIZES
  },
  {
    id: 'evening-two-piece-suit',
    name: 'Evening Two-Piece Suit',
    category: 'Suits',
    price: 159000,
    image: 'suit.jpg',
    colors: ['Black', 'Navy', 'Grey'],
    sizes: ALL_SIZES
  },
  {
    id: 'pinpoint-cotton-shirt',
    name: 'Pinpoint Cotton Shirt',
    category: 'Shirts',
    price: 28900,
    image: 'white-shirt.jpg',
    colors: ['White', 'Grey', 'Navy'],
    sizes: ALL_SIZES
  },
  {
    id: 'longline-tailored-coat',
    name: 'Longline Tailored Coat',
    category: 'Coats',
    price: 129000,
    image: 'coat.jpg',
    colors: MAIN_COLORS,
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'everyday-chino-trousers',
    name: 'Everyday Chino Trousers',
    category: 'Trousers',
    price: 29900,
    image: 'trousers.jpg',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES
  },
  {
    id: 'unstructured-blazer',
    name: 'Unstructured Blazer',
    category: 'Suits',
    price: 69900,
    image: 'blazer.jpg',
    colors: ['Navy', 'Grey', 'Black'],
    sizes: ['S', 'M', 'L', 'XL']
  },
  {
    id: 'fine-gauge-polo',
    name: 'Fine-Gauge Polo',
    category: 'Shirts',
    price: 31900,
    image: 'polo.jpg',
    colors: MAIN_COLORS,
    sizes: ALL_SIZES
  },
  {
    id: 'heritage-overcoat',
    name: 'Heritage Overcoat',
    category: 'Coats',
    price: 169000,
    image: 'overcoat.jpg',
    colors: ['Grey', 'Black', 'Navy'],
    sizes: ['M', 'L', 'XL']
  },
  {
    id: 'silk-tie-pocket-square',
    name: 'Silk Tie & Pocket Square',
    category: 'Accessories',
    price: 18900,
    image: 'accessories.jpg',
    colors: ['Navy', 'Black', 'Grey'],
    sizes: ['M']
  },
  {
    id: 'classic-accessory-set',
    name: 'Classic Accessory Set',
    category: 'Accessories',
    price: 21900,
    image: 'accessories.jpg',
    colors: ['Black', 'Navy', 'Grey'],
    sizes: ['M']
  }
];

