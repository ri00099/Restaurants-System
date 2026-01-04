// Temporary fallback menu data for when MongoDB is not connected
// This will be used by the controller if database is unavailable

const fallbackMenuData = [
  // Appetizers
  {
    _id: "temp1",
    name: "Spring Roll",
    category: "Appetizers",
    price: 149,
    description: "Crispy vegetable spring rolls served with sweet chili sauce",
image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400",
    isAvailable: true,
    rating: 4.5,
    prepTime: "15 mins",
    calories: "280",
    ingredients: ["Cabbage", "Carrots", "Spring Onions", "Soy Sauce", "Wrapper"],
    popularity: 85
  },
  {
    _id: "temp2",
    name: "Garlic Bread",
    category: "Appetizers",
    price: 99,
    description: "Toasted bread with garlic butter and herbs",
    image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400",
    isAvailable: true
  },
  {
    _id: "temp3",
    name: "Chicken Wings",
    category: "Appetizers",
    price: 249,
    description: "Spicy chicken wings with ranch dip",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
    isAvailable: true
  },

  // Main Courses
  {
    _id: "temp4",
    name: "Margherita Pizza",
    category: "Main Courses",
    price: 299,
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    isAvailable: true
  },
  {
    _id: "temp5",
    name: "Chicken Biryani",
    category: "Main Courses",
    price: 349,
    description: "Aromatic basmati rice with tender chicken and spices",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    isAvailable: true
  },
  {
    _id: "temp6",
    name: "Paneer Butter Masala",
    category: "Main Courses",
    price: 279,
    description: "Cottage cheese in rich tomato gravy with butter",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    isAvailable: true
  },

  // Desserts
  {
    _id: "temp7",
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 149,
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
    isAvailable: true
  },
  {
    _id: "temp8",
    name: "Tiramisu",
    category: "Desserts",
    price: 179,
    description: "Classic Italian dessert with coffee and mascarpone",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
    isAvailable: true
  },

  // Beverages
  {
    _id: "temp9",
    name: "Mango Lassi",
    category: "Beverages",
    price: 99,
    description: "Creamy yogurt drink with mango pulp",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
    isAvailable: true
  },
  {
    _id: "temp10",
    name: "Cold Coffee",
    category: "Beverages",
    price: 119,
    description: "Chilled coffee with ice cream and chocolate",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400",
    isAvailable: true
  }
];

module.exports = fallbackMenuData;
