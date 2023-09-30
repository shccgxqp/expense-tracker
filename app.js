const express = require('express')
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

const { engine } = require('express-handlebars')
const port = 3000;

const methodOverride = require('method-override');
const connectDB = require("./config/mongoose");

const router = require('./routes');
const passport = require('./config/passport')
const Handlebars = require('handlebars')
const messageHandler = require('./middlewares/message-handler');
const errorHandler = require('./middlewares/error-handler');

const hbs = Handlebars.registerHelper('eq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
  return options.inverse(this);
});

app.engine('.hbs', engine({ extname: '.hbs', hbs }))
app.set('view engine', '.hbs')
app.set('views', './views')

app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(methodOverride('_method'))

app.use(session({ secret: 'ThisIsSecret', resave: false, saveUninitialized: false, }));

app.use(flash());
app.use(passport.initialize())
app.use(passport.session())
app.use(messageHandler);
app.use(router);
app.use(errorHandler);
//connect mongoose
connectDB();

app.listen(port, () => {
  console.log(`express server is running on http://localhost:${port}`)
})