const express = require('express')
const app = express();

const { engine } = require('express-handlebars')
const port = 3000;

const methodOverride = require('method-override');
const connectDB = require("./config/mongoose");
const router = require('./routes');

app.engine('.hbs', engine({ extname: '.hbs' }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(router);

//connect mongoose
connectDB();
app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})