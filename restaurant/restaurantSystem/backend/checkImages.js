const mongoose = require('mongoose');
require('dotenv').config();
const Menu = require('./src/models/menu.model');

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log('Connected to MongoDB');
  const items = await Menu.find({ 
    name: { $in: ['Spring Roll', 'Gulab Jamun', 'Masala Chai'] } 
  }, 'name image');
  console.log(JSON.stringify(items, null, 2));
  process.exit(0);
});
