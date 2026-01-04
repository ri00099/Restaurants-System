import springRollsImg from "../../../assets/spring-rolls.webp?url";
import gulabJamunImg from "../../../assets/gulabjamun.webp?url";
import masalaChaiImg from "../../../assets/masalachai.jpg?url";

export const menuItems = [
  {
    id: 1,
    name: "Vegetable Biryani",
    category: "Main Courses",
    price: 120,
    image:
      "https://t4.ftcdn.net/jpg/05/70/58/65/360_F_570586537_TnIgWdCnaTYpgg9gsTyloz5bnvfCtdLl.jpg",
    description:
      "Fragrant basmati rice layered with colorful vegetables, saffron, herbs, and whole spices. Served with cooling raita, it’s a satisfying one-pot feast.",
    ingredients: [
      "Basmati rice",
      "Mixed vegetables (carrot, peas, beans)",
      "Yogurt",
      "Whole spices (bay leaf, cloves, cinnamon)",
      "Saffron or biryani masala",
    ],
    rating: 4.5,
    reviews: 128,
    prepTime: "15-20 min",
    popularity: 95,
  },
  {
    id: 2,
    name: "Veg Seekh Kebab",
    category: "Appetizers",
    price: 195,
    image:
      "https://www.potsandpans.in/cdn/shop/articles/20250120105836-blog-20templates-20-2-20-1.webp?v=1737440809",
    description:
      "Flavorful minced vegetable mixture shaped onto skewers and grilled until smoky and crisp. A perfect starter with mint chutney.",
    ingredients: [
      "Grated carrots & boiled potatoes",
      "Green peas",
      "Besan (gram flour)",
      "Ginger–garlic paste",
      "Garam masala",
    ],
    rating: 4.7,
    reviews: 256,
    prepTime: "20-25 min",
    popularity: 88,
  },
  {
    id: 3,
    name: "Paneer Tikka Masala",
    category: "Main Courses",
    price: 175,
    image:
      "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?q=80&w=2034&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    description:
      "Chunks of smoky grilled paneer simmered in a rich, creamy tomato-onion masala with aromatic spices. A beloved vegetarian classic with bold, comforting flavors.",
    ingredients: [
      "Paneer cubes",
      "Tomatoes",
      "Onions",
      "Fresh cream",
      "Ginger–garlic paste",
    ],
    rating: 4.3,
    reviews: 89,
    prepTime: "25-30 min",
    popularity: 72,
  },
  {
    id: 4,
    name: " Gulab Jamun",
    category: "Desserts",
    price: 170,
    image: gulabJamunImg,
    description:
      "Soft, melt-in-the-mouth dumplings soaked in warm cardamom sugar syrup. A timeless Indian dessert loved across all ages.",
    ingredients: [
      "Khoya (mawa)",
      "All-purpose flour",
      "Sugar syrup",
      "Cardamom",
      "Ghee (for frying)",
    ],
    rating: 4.9,
    reviews: 342,
    prepTime: "10-12 min",
    popularity: 98,
  },
  {
    id: 5,
    name: "Fresh Lime Soda",
    category: "Beverages",
    price: 260,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQdeq_qps9RPo9qKXHRAXH5iQKSQtJO49c7qQ&s",
    description:
      "A refreshing blend of lime, soda, and mint — served sweet, salty, or both. Perfect to cool down instantly.",
    ingredients: [
      "Fresh lime juice",
      "Soda water",
      "Sugar or salt",
      "Mint leaves",
      "Ice cubes",
    ],
    rating: 4.6,
    reviews: 167,
    prepTime: "5 min",
    popularity: 85,
  },
  {
    id: 6,
    name: "Baingan Bharta",
    category: "Main Courses",
    price: 280,
    image:
      "https://ranveerbrar.com/wp-content/uploads/2023/10/Baingan-bharta.jpg",
    description:
      "Smoky roasted eggplant mashed and cooked with fresh tomatoes, onions, garlic, and Indian spices. Silky, flavorful, and perfect with roti or rice.",
    ingredients: [
      "Large eggplants (baingan)",
      "Tomatoes",
      "Onions",
      "Green chilies",
      "Garlic",	
    ],
    rating: 4.8,
    reviews: 203,
    prepTime: "18-22 min",
    popularity: 91,
  },
  {
    id: 7,
    name: "Paneer 65",
    category: "Appetizers",
    price: 375,
    image:
      "https://www.foodie-trail.com/wp-content/uploads/2022/05/PHOTO-2022-05-19-10-03-52.jpg",
    description:
      "Crispy fried paneer cubes tossed in a spicy, tangy South Indian–style masala. Crunchy outside, soft inside.",
    ingredients: [
      "Paneer cubes",
      "Cornflour",
      "Yogurt",
      "Curry leaves",
      "Red chilli powder",
    ],
    rating: 4.4,
    reviews: 145,
    prepTime: "8-10 min",
    popularity: 79,
  },
  {
    id: 8,
    name: "Rasmalai",
    category: "Desserts",
    price: 85,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTT9156aOcdnhPbwB9RK_CRrUS2wJjDxZmJvQ&s",
    description:
      "Soft chenna patties soaked in sweet, creamy saffron milk and garnished with nuts. Rich, delicate, and festive.",
    ingredients: [
      "Milk",
      "Chenna (paneer)",
      "Sugar",
      "Saffron",
      "Pistachios",
    ],
    rating: 4.7,
    reviews: 298,
    prepTime: "12-15 min",
    popularity: 94,
  },
  {
    id: 9,
    name: "Mango Lassi",
    category: "Beverages",
    price: 300,
    image:
      "https://www.midwestliving.com/thmb/2n9egOlUYE0dnPxJoHYY7disquI=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/KeyIngredient_MangoLassi_BP_1019_preview-0bdf9f28d35043748efaa9fd1c7b806c.jpg",
    description:
      "A thick, creamy yogurt-based drink blended with ripe mangoes. Smooth, fruity, and irresistibly delicious.",
    ingredients: [
       "Yogurt",
       "Ripe mango pulp",
       "Sugar",
       "Cardamom",
       "Ice",
      ],
    rating: 4.2,
    reviews: 87,
    prepTime: "2 min",
    popularity: 65,
  },
  {
    id: 10,
    name: "Truffle Fries",
    category: "Appetizers",
    price: 70,
    image:
      "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=400&h=300&fit=crop",
    description:
      "Golden crispy french fries tossed with truffle oil, parmesan cheese, and fresh herbs.",
    ingredients: [
      "Potatoes",
      "Truffle Oil",
      "Parmesan",
      "Fresh Herbs",
      "Sea Salt",
    ],
    rating: 4.6,
    reviews: 219,
    prepTime: "12-15 min",
    popularity: 87,
  },
  {
    id: 11,
    name: "Spring Rolls",
    category: "Appetizers",
    price: 149,
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR4-kNNdVpdK47KojDlzwilDr_NuS_LjoOOrQ&s',
    description:
      "Crispy vegetable spring rolls served with sweet chili sauce",
    ingredients: [
      "Spring roll sheets",
      "Cabbage",
      "Carrot",
      "Capsicum",
      "Soy sauce",
    ],
    rating: 4.7,
    reviews: 256,
    prepTime: "20-25 min",
    popularity: 88,
  },
  {
    id: 12,
    name: "Mushroom Stroganoff",
    category: "Main Courses",
    price: 120,
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRcBuqxsG72kTGvTsm6uaUvcWeITotW_eeb1Q&s",
    description:
      "Tender mushrooms sautéed in a creamy, paprika-spiced sauce with onions and garlic. Served over buttered noodles or rice — rich, silky, and comforting.",
    ingredients: [
      "Mushrooms",
      "Onions",
      "Sour cream or fresh cream",
      "Garlic",
      "Butter"
    ],
    rating: 4.5,
    reviews: 128,
    prepTime: "15-20 min",
    popularity: 95,
  },
  {
    id: 13,
    name: "Chocolate Brownie",
    category: "Desserts",
    price: 85,
    image:
      "https://api.photon.aremedia.net.au/wp-content/uploads/sites/12/media/59742/colin-chocolate-brownie-recipe.jpg?fit=1500%2C1001",
    description:
      "Dense, fudgy chocolate brownie baked to perfection with a glossy top and rich cocoa flavor. Best served warm.",
    ingredients: [
      "Cocoa powder",
      "Butter",
      "Sugar",
      "Flour",
      "Dark chocolate",
    ],
    rating: 4.7,
    reviews: 298,
    prepTime: "12-15 min",
    popularity: 94,
  },
  {
    id: 14,
    name: "Kesar Kulfi",
    category: "Desserts",
    price: 85,
    image:
      "https://i.ndtvimg.com/i/2017-03/kulfi_620x350_51490945811.jpg",
    description:
      "Classic rich and creamy cheesecake on a graham cracker crust, topped with strawberry compote.",
    ingredients: [
      "Cream Cheese",
      "Graham Crackers",
      "Sugar",
      "Eggs",
      "Vanilla",
      "Strawberries",
    ],
    rating: 4.7,
    reviews: 298,
    prepTime: "12-15 min",
    popularity: 94,
  },
  {
    id: 15,
    name: "Cold Coffee (Frappé Style)",
    category: "Beverages",
    price: 300,
    image:
      "https://cdn.shopify.com/s/files/1/0445/3321/9490/files/1200_600_480x480.jpg?v=1670338921",
    description:
      "Rich and frothy cold coffee blended with ice, milk, and sugar — café-style refreshment in a glass.",
    ingredients: [
      "Instant coffee",
      "Milk",
      "Sugar",
      "Ice",
      "Chocolate syrup (optional)",
       ],
    rating: 4.2,
    reviews: 87,
    prepTime: "2 min",
    popularity: 65,
  },
  {
    id: 16,
    name: "Masala Chai",
    category: "Beverages",
    price: 300,
    image: masalaChaiImg,
    description:
      "Classic Indian tea brewed with milk and a fragrant spice blend. Warm, comforting, and full of aroma.",
    ingredients: [
       "Tea leaves",
       "Milk",
       "Ginger",
       "Cardamom",
       "Cloves or cinnamon",
      ],
    rating: 4.2,
    reviews: 87,
    prepTime: "2 min",
    popularity: 65,
  },
];
