
const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {Recipes} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

// we're going to add some items to ShoppingList
// so there's some data to look at
Recipes.create('Baked Burritos', 'beans');
Recipes.create('Tomato Soup', 'tomatoes');
Recipes.create('Stuffed Peppers', 'bell peppers');

// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
