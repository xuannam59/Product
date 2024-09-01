const systemConfig = require("../../config/system");
const dashboardRouter = require("./dashboard.route");
const productRouter = require("./product.route");
const productCategoryRouter = require("./product-category.route");
const rolesRouter = require("./role.route");
const accountRouter = require("./accounts.route");
const authRouter = require("./auth.route");
const myAccountRouter = require("./my-account.route");
const settingsRouter = require("./settings.route");

const authMiddleware = require("../../middlewares/admin/auth.middleware");


module.exports = (app) => {
  const PATH_ADMIN = systemConfig.prefixAdmin;

  // Dashboard
  app.use(`${PATH_ADMIN}/dashboard`,
    authMiddleware.requireAuth,
    dashboardRouter
  );
  // Products Category
  app.use(`${PATH_ADMIN}/products-category`,
    authMiddleware.requireAuth,
    productCategoryRouter
  );

  // Products
  app.use(`${PATH_ADMIN}/products`,
    authMiddleware.requireAuth,
    productRouter
  );

  // Roles
  app.use(`${PATH_ADMIN}/roles`,
    authMiddleware.requireAuth,
    rolesRouter
  );

  // Accounts
  app.use(`${PATH_ADMIN}/accounts`,
    authMiddleware.requireAuth,
    accountRouter
  );

  // My accounts
  app.use(`${PATH_ADMIN}/my-account`,
    authMiddleware.requireAuth,
    myAccountRouter
  )

  //Setting
  app.use(`${PATH_ADMIN}/settings`,
    authMiddleware.requireAuth,
    settingsRouter
  );

  app.use(`${PATH_ADMIN}/auth`, authRouter);
}