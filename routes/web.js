const route = require("express").Router()
const homeController = require("../app/http/controllers/homeController");
const authController = require("../app/http/controllers/authController");
const cartController = require("../app/http/controllers/cartController");

const orderController = require("../app/http/controllers/orderController");
const AdminOrderController = require("../app/http/controllers/admin/orderController");
const statusController = require("../app/http/controllers/admin/statusController");

const guest = require("../app/middlewares/guest");
const auth = require("../app/middlewares/auth");
const admin = require("../app/middlewares/admin");

route.get("/",homeController().index);

route.get("/register",guest,authController().register);

route.post("/register",authController().postRegister)

route.get("/login",guest,authController().login);

route.post("/login",authController().postlogin);

route.get("/cart",cartController().index);

route.post("/logout",authController().logout)

route.post("/update-cart",cartController().update)

route.post("/orders",auth,orderController().store);

route.get("/orders",auth,orderController().index);

route.get('/orders/:id',auth,orderController().show)

route.get("/admin/orders",admin,AdminOrderController().index)

route.post("/admin/orders/status",admin,statusController().update)




module.exports = route


