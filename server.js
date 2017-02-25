const express = require('express');
const router = express.Router();
const morgan = require('morgan');
const bodyParser = require('body-parser');

const {Recipes} = require('./models');

const jsonParser = bodyParser.json();
const app = express();

// log the http layer
app.use(morgan('common'));

Recipes.create(
  'boiled white rice', ['1 cup white rice', '2 cups water', 'pinch of salt']);
Recipes.create(
  'milkshake', ['2 tbsp cocoa', '2 cups vanilla ice cream', '1 cup milk']);
// when the root of this router is called with GET, return
// all current ShoppingList items
app.get('/recipes', (req, res) => {
  res.json(Recipes.get());
});

//with post request, you must change the values in body in postman, after selecting post. this will create a new recipe
app.post('/recipes', jsonParser, (req, res) => {
  // ensure `name` and `budget` are in request body
  const requiredFields = ['name', 'ingredients'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`;
      console.error(message);
      return res.status(400).send(message);
    }
  }
//make sure it is req.body.ingredients and name
  const item = Recipes.create(req.body.name, req.body.ingredients);
  res.status(201).json(item);
});


//works correctly, but still giving list of errors
app.delete('/recipes/:id', (req, res) => {
  Recipes.delete(req.params.id); 
  console.log(`Deleted recipe item \`${req.put.id}\``);
  res.status(204).end();
});

app.put('/recipes/:id', jsonParser, (req, res) => {
  const requiredFields = ['name', 'ingredients', 'id'];
  for (let i=0; i<requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const message = `Missing \`${field}\` in request body`
      console.error(message);
      return res.status(400).send(message);
    }
  }
  if (req.params.id !== req.body.id) {
    const message = (
      `Request path id (${req.params.id}) and request body id `
      `(${req.body.id}) must match`);
    console.error(message);
    return res.status(400).send(message);
  }
  console.log(`Updating recipe \`${req.params.id}\``);
  const updatedItem = Recipes.update({
    id: req.params.id,
    name: req.body.name,
    ingredients: req.body.ingredients
  });
//when putting, must put id number in address

  res.status(200).json(updatedItem);
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Your app is listening on port ${process.env.PORT || 8080}`);
});
