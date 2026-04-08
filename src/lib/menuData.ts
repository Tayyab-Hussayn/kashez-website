export interface MenuItem {
  id: number;
  category: string;
  name: string;
  description: string;
  price: number;
  badge: string;
  image: string;
  hasOptions: boolean;
  available?: boolean;
  featured?: boolean;
}

export const menuItems: MenuItem[] = [
  // STARTERS
  { id: 1, category: "Starters", name: "Truffle Arancini", description: "Crispy risotto balls with black truffle and parmesan", price: 1950, badge: "Chef's Pick", image: "https://images.unsplash.com/photo-1519984388953-d2406bc725e1?w=400", hasOptions: false, available: true, featured: false },
  { id: 2, category: "Starters", name: "Burrata & Heritage Tomatoes", description: "Creamy burrata, heirloom tomatoes, basil oil, sea salt", price: 2200, badge: "Vegetarian", image: "https://images.unsplash.com/photo-1608897013039-887f21d8c804?w=400", hasOptions: false, available: true, featured: false },
  { id: 3, category: "Starters", name: "Crispy Calamari", description: "Lightly battered squid, lemon aioli, chili flakes", price: 1800, badge: "", image: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400", hasOptions: false, available: true, featured: false },
  // MAINS
  { id: 4, category: "Mains", name: "Slow-Braised Short Rib", description: "48-hour braised beef, truffle mash, red wine jus", price: 5500, badge: "Chef's Pick", image: "https://images.unsplash.com/photo-1544025162-d76538f6fb7e?w=400", hasOptions: true, available: true, featured: false },
  { id: 5, category: "Mains", name: "Pan-Seared Sea Bass", description: "Crispy skin sea bass, fennel puree, saffron beurre blanc", price: 4800, badge: "Gluten-Free", image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400", hasOptions: false, available: true, featured: false },
  { id: 6, category: "Mains", name: "Wild Mushroom Risotto", description: "Arborio rice, porcini, parmesan, fresh herbs, truffle oil", price: 3600, badge: "Vegetarian", image: "https://images.unsplash.com/photo-1476124369491-e7addf5db371?w=400", hasOptions: true, available: true, featured: false },
  // PASTA
  { id: 7, category: "Pasta", name: "Tagliatelle al Ragu", description: "Hand-rolled pasta, slow-cooked beef ragu, aged parmesan", price: 3300, badge: "", image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400", hasOptions: true, available: true, featured: false },
  { id: 8, category: "Pasta", name: "Cacio e Pepe", description: "Tonnarelli pasta, pecorino romano, black pepper", price: 2800, badge: "Vegetarian", image: "https://images.unsplash.com/photo-1612874742237-6526221588e3?w=400", hasOptions: false, available: true, featured: false },
  // GRILLS
  { id: 9, category: "Grills", name: "Wagyu Striploin 250g", description: "Grade A5 wagyu, truffle butter, roasted garlic", price: 9500, badge: "Premium", image: "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400", hasOptions: true, available: true, featured: false },
  { id: 10, category: "Grills", name: "Grilled Lamb Chops", description: "French-trimmed lamb, mint gremolata, charred broccolini", price: 6200, badge: "", image: "https://images.unsplash.com/photo-1598514983318-2f64f8f4796c?w=400", hasOptions: true, available: true, featured: false },
  // DESSERTS
  { id: 11, category: "Desserts", name: "Valrhona Chocolate Fondant", description: "Warm dark chocolate, vanilla bean ice cream, gold leaf", price: 1950, badge: "Chef's Pick", image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=400", hasOptions: false, available: true, featured: false },
  { id: 12, category: "Desserts", name: "Lemon Posset", description: "Silky lemon cream, shortbread, fresh raspberry coulis", price: 1650, badge: "", image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400", hasOptions: false, available: true, featured: false },
  // DRINKS
  { id: 13, category: "Drinks", name: "Sparkling Lemonade", description: "House-made, fresh lemon, elderflower, soda", price: 850, badge: "", image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400", hasOptions: false, available: true, featured: false },
  { id: 14, category: "Drinks", name: "Mocktail of the Day", description: "Ask your server for today's seasonal creation", price: 1100, badge: "", image: "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400", hasOptions: false, available: true, featured: false },
];

export const defaultCategories = ["All", "Starters", "Mains", "Pasta", "Grills", "Desserts", "Drinks"];

// Keep backward compat export
export const categories = defaultCategories;
