const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");

const productHelpers = require("../../helpers/product");

// [GET] /cart
module.exports.index = async (req, res) => {
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId,
  })


  cart.totalPrice = 0;

  for (const item of cart.products) {
    const product = await Product.findOne({
      _id: item.product_id
    }).select("title price discountPercentage thumbnail slug");

    product.newPrice = productHelpers.newPriceProduct(product);

    item.totalPrice = item.quantity * product.newPrice;

    item.productInfor = product;
  }

  cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0);

  res.render("client/pages/cart/index", {
    pageTitle: "Giỏ hàng",
    cartDetail: cart,
  });
}

// [GET] /cart/add/:productId
module.exports.addPost = async (req, res) => {
  const productId = req.params.productId;
  const quantity = parseInt(req.body.quantity);
  const cartId = req.cookies.cartId;

  const cart = await Cart.findOne({
    _id: cartId
  })

  const existProductInCart = cart.products.find(item => item.product_id == productId);

  if (existProductInCart) {
    const newQuantity = quantity + existProductInCart.quantity;

    await Cart.updateOne({
      _id: cartId,
      "products.product_id": productId
    }, {
      $set: {
        "products.$.quantity": newQuantity
      }
    }
    )
  } else {
    const objectCart = {
      product_id: productId,
      quantity: quantity,
    }

    await Cart.updateOne(
      {
        _id: cartId
      },
      {
        $push: { products: objectCart }
      }
    );
  };

  req.flash("success", "Thêm sản phẩm vào giỏ hành thành công!");
  res.redirect("back");
}

// [GET] /cart/add/:product_id
module.exports.delete = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;

  try {
    await Cart.updateOne({
      _id: cartId,
    }, {
      $pull: { products: { product_id: productId } },
    });

    req.flash("success", "Xoá sản phẩm thành công!");
    res.redirect("back");
  } catch (error) {

    req.flash("error", "Xoá sản phẩm thất bại!");
    res.redirect("back");
  }

}

// [GET] /cart/change/:productId/:quantity
module.exports.changeQuantity = async (req, res) => {
  const cartId = req.cookies.cartId;
  const productId = req.params.productId;
  const quantity = req.params.quantity;

  await Cart.updateOne({
    _id: cartId,
    "products.product_id": productId
  }, {
    $set: {
      "products.$.quantity": quantity
    }
  })

  res.redirect("back");
}