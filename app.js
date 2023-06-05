var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./models');
require('dotenv').config();


var indexRouter = require('./routes/index');
var setupRouter = require('./routes/setup');
var authRouter = require('./routes/auth');
var itemsRouter = require('./routes/items');
var itemRouter = require('./routes/item');
var categoriesRouter = require('./routes/categories');
var categoryRouter = require('./routes/category');
var cartRouter = require('./routes/cart');
var cartItemRouter = require('./routes/cart_item');
var orderRouter = require('./routes/order');
var ordersRouter = require('./routes/orders');
var allOrdersRouter = require('./routes/allorders');
var allCartsRouter = require('./routes/allcart')

var app = express();

var db = require('./models')
db.sequelize.sync({ force: false})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/setup', setupRouter);
app.use('/', itemsRouter);
app.use('/item', itemRouter);
app.use('/', categoriesRouter)
app.use('/category', categoryRouter);
app.use('/cart', cartRouter);
app.use('/cart_item', cartItemRouter);
app.use('/order', orderRouter);
app.use('/orders', ordersRouter);
app.use('/allorders', allOrdersRouter);
app.use('/allcarts', allCartsRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
