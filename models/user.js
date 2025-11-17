const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          //* ref is used to establish a relationship between two models
          // Here we are setting the realtionship between Product and User models
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

//# Mongoose specific methods to work on our schema
//? Really convenient!
userSchema.methods.addToCart = function (product) {
  //checking if product already exists in cart
  const cartProductIndex = this.cart.items.findIndex((cp) => {
    // == can be used but using both sides toString() for safety & is also a good practice
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCartItems = [...this.cart.items];

  if (cartProductIndex >= 0) {
    // product exists in cart, incrementing quantity
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCartItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCartItems.push({
      // Mongoose will automatically convert the id to ObjectId type
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    // instead of {...product, quantity}, we are only storing the productId because if the product details change in the shop, the cart won't reflect that
    // so we will only refer to the id of product and manually fetch other details from products collection when needed
    items: updatedCartItems,
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeFromCart = function (productId) {
  const updatedCartItems = this.cart.items.filter((item) => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart = { items: [] };
  return this.save();
};

//* Mongoose will automatically look for the plural, lowercased version of your model name
// Thus, it will look for 'users' collection in the database
// If it doesn't find one, it will create it for you
module.exports = mongoose.model("User", userSchema);

// const { getOrders } = require("../controllers/shop");
// const { get } = require("../routes/admin");

// const getDb = require("../util/database").getDb;
// const ObjectId = require("mongodb").ObjectId;
// class User {
//   constructor(username, email, cart, id) {
//     this.name = username;
//     this.email = email;
//     this.cart = cart;
//     this._id = id ? new ObjectId(id) : null;
//   }

//   save() {
//     const db = getDb();
//     return db.collection("users").insertOne(this);
//   }

//   getCart() {
//     const db = getDb();
//     const productIds = this.cart.items.map((i) => {
//       return i.productId;
//     });
//     return (
//       db
//         .collection("products")
//         // find returns a cursor
//         // $in operator to find all products whose _id is in the productIds array
//         .find({ _id: { $in: productIds } })
//         .toArray()
//         .then((products) => {
//           return products.map((p) => {
//             return {
//               ...p,
//               quantity: this.cart.items.find((i) => {
//                 return i.productId.toString() === p._id.toString();
//               }).quantity,
//             };
//           });
//         })
//     );
//   }

//   deleteItemFromCart(productId) {
//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== productId.toString();
//     });

//     const db = getDb();
//     return db
//       .collection("users")
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       );
//   }

//   addOrder() {
//     const db = getDb();
//     // Including product information as part of the order
//     return (
//       this.getCart()
//         .then((products) => {
//           const order = {
//             items: products,
//             user: {
//               _id: new ObjectId(this._id),
//               name: this.name,
//             },
//           };
//           return db.collection("orders").insertOne(order);
//         })
//         // clean up cart after order is placed
//         .then((result) => {
//           this.cart = { items: [] };
//           return db
//             .collection("users")
//             .updateOne(
//               { _id: new ObjectId(this._id) },
//               { $set: { cart: { items: [] } } }
//             );
//         })
//     );
//   }

//   getOrders() {
//     const db = getDb();
//     return (
//       db
//         .collection("orders")
//         // In MongoDB, we can check nested properties by defining the path to them as a string.
//         .find({ "user._id": new ObjectId(this._id) })
//         .toArray()
//     );
//   }

//   static findById(userId) {
//     const db = getDb();
//     // findOne doesnt' return  cursor
//     // find() does
//     return db
//       .collection("users")
//       .findOne({ _id: new ObjectId(userId) })
//       .then((user) => {
//         console.log(user);
//         return user;
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = User;
