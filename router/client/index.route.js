const productRouter = require("./product.route");
const homeRouter = require("./home.route");
const searchRouter = require("./search.route");
const cartRouter = require("./cart.route");
const checkoutRouter = require("./checkout.route");
const userRouter = require("./user.route");
const chatRouter = require("./chat.route");
const RoomsChatRouter = require("./rooms_chat.router");
const usersRouter = require("./users.route");

const categoryMiddleware = require("../../middlewares/client/category.middleware");
const cartMiddleware = require("../../middlewares/client/cart.middleware");
const userMiddleware = require("../../middlewares/client/user.middleware")
const settingMiddleware = require("../../middlewares/client/setting.middleware");
const authMiddleware = require("../../middlewares/client/auth.middleware");

module.exports = (app) => {
  app.use(categoryMiddleware.category);
  app.use(cartMiddleware.cartId);
  app.use(userMiddleware.user);
  app.use(settingMiddleware.general);

  app.use('/', homeRouter);

  app.use('/products', productRouter);

  app.use('/search', searchRouter);

  app.use('/cart', cartRouter);

  app.use('/checkout', checkoutRouter);

  app.use('/user', userRouter);

  app.use("/chat", authMiddleware.requireAuth, chatRouter);

  app.use('/rooms-chat', authMiddleware.requireAuth, RoomsChatRouter)

  app.use("/users", authMiddleware.requireAuth, usersRouter);
}