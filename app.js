// 引入所需的項目
const express = require('express')
const flash = require('connect-flash');
const session = require('express-session');
const app = express();

// 開發環境增加環境變量（如果需要的话）
if (process.env.NODE_ENV === 'development') {
  require('dotenv').config();
}

//  引入Express Handlebars
const { engine } = require('express-handlebars')
const port = 3000;

const methodOverride = require('method-override'); //  允許使用HTTP動詞来替代POST請求
const connectDB = require("./config/mongoose"); // 引入Mongoose數據庫連接配置

const router = require('./routes');
const passport = require('./config/passport')

const Handlebars = require('handlebars')
const messageHandler = require('./middlewares/message-handler');
const errorHandler = require('./middlewares/error-handler');

// Handlebars equal 
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