// Seed Menu Data - Run this once to populate the database with sample menu items
const mongoose = require("mongoose");
require("dotenv").config();

const Menu = require("./src/models/menu.model");
import springRollsImg from "../DineFlow/src/assets/spring-roll.jpg";
import gulabJamunImg from "../../../assets/gulabjamun.webp?url";
import masalaChaiImg from "../../../assets/masalachai.jpg?url";
const sampleMenuItems = [
  // Appetizers
  {
    name: "Spring Roll",
    category: "Appetizers",
    price: 149,
    description: "Crispy vegetable spring rolls served with sweet chili sauce",
image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400",
    isAvailable: true
  },
  {
    name: "Garlic Bread",
    category: "Appetizers",
    price: 99,
    description: "Toasted bread with garlic butter and herbs",
    image: "https://images.unsplash.com/photo-1573140401552-3fab0b24306f?w=400",
    isAvailable: true
  },
  {
    name: "Chicken Wings",
    category: "Appetizers",
    price: 249,
    description: "Spicy chicken wings with ranch dip",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=400",
    isAvailable: true
  },
  {
    name: "Nachos Supreme",
    category: "Appetizers",
    price: 199,
    description: "Tortilla chips with cheese, jalapeños, and salsa",
    image: "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=400",
    isAvailable: true
  },

  // Main Courses
  {
    name: "Margherita Pizza",
    category: "Main Courses",
    price: 299,
    description: "Classic pizza with tomato sauce, mozzarella, and fresh basil",
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400",
    isAvailable: true
  },
  {
    name: "Chicken Biryani",
    category: "Main Courses",
    price: 349,
    description: "Aromatic basmati rice with tender chicken and spices",
    image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=400",
    isAvailable: true
  },
  {
    name: "Paneer Butter Masala",
    category: "Main Courses",
    price: 279,
    description: "Cottage cheese in rich tomato gravy with butter",
    image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=400",
    isAvailable: true
  },
  {
    name: "Grilled Salmon",
    category: "Main Courses",
    price: 499,
    description: "Fresh salmon fillet with lemon butter sauce",
    image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400",
    isAvailable: true
  },
  {
    name: "Pasta Alfredo",
    category: "Main Courses",
    price: 269,
    description: "Creamy fettuccine pasta with parmesan cheese",
    image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400",
    isAvailable: true
  },
  {
    name: "Vegetable Stir Fry",
    category: "Main Courses",
    price: 229,
    description: "Mixed vegetables in Asian sauce with rice",
    image: "https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400",
    isAvailable: true
  },

  // Desserts
  {
    name: "Chocolate Lava Cake",
    category: "Desserts",
    price: 149,
    description: "Warm chocolate cake with molten center, served with vanilla ice cream",
    image: "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400",
    isAvailable: true
  },
  {
    name: "Tiramisu",
    category: "Desserts",
    price: 179,
    description: "Classic Italian dessert with coffee and mascarpone",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400",
    isAvailable: true
  },
  {
    name: "Gulab Jamun",
    category: "Desserts",
    price: 99,
    description: "Soft milk dumplings in sweet syrup",
    image: "http://localhost:5174/images/gulabjamun.webp",
    isAvailable: true
  },
  {
    name: "Ice Cream Sundae",
    category: "Desserts",
    price: 129,
    description: "Three scoops with chocolate sauce and nuts",
    image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400",
    isAvailable: true
  },

  // Beverages
  {
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 79,
    description: "Refreshing lime soda with mint",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400",
    isAvailable: true
  },
  {
    name: "Mango Lassi",
    category: "Beverages",
    price: 99,
    description: "Creamy yogurt drink with mango pulp",
    image: "https://images.unsplash.com/photo-1623065422902-30a2d299bbe4?w=400",
    isAvailable: true
  },
  {
    name: "Cold Coffee",
    category: "Beverages",
    price: 119,
    description: "Chilled coffee with ice cream and chocolate",
    image: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=400",
    isAvailable: true
  },
  {
    name: "Green Tea",
    category: "Beverages",
    price: 69,
    description: "Healthy green tea with honey",
    image: "https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?w=400",
    isAvailable: true
  },
  {
    name: "Masala Chai",
    category: "Beverages",
    price: 49,
    description: "Traditional Indian spiced tea",
    image: "http://localhost:5174/images/masalachai.jpg",
    isAvailable: true
  },
  {
    name: "Fresh Orange Juice",
    category: "Beverages",
    price: 89,
    description: "Freshly squeezed orange juice",
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400",
    isAvailable: true
  }
];

async function seedMenu() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ Connected to MongoDB");

    // Clear existing menu items
    await Menu.deleteMany({});
    console.log("🗑️  Cleared existing menu items");

    // Insert sample items
    await Menu.insertMany(sampleMenuItems);
    console.log(`✅ Added ${sampleMenuItems.length} menu items`);

    console.log("\n📊 Sample Menu Items:");
    sampleMenuItems.forEach((item, index) => {
      console.log(`${index + 1}. ${item.name} - ₹${item.price} (${item.category})`);
    });

    console.log("\n✨ Menu seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding menu:", error);
    process.exit(1);
  }
}

seedMenu();
