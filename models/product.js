const mongoose = require("mongoose");
const user = require("./user");
// Schema constructor allows us to create a new schema
const Schema = mongoose.Schema;

//-> Mongoose requires a schema even though it is NoSQL
//? But that's only as a guideline and structure for our documents
//# We need not follow the schema strictly like in SQL databases
const productSchema = new Schema({
  title: { type: String, required: true },
  price: { type: Number, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  userId: {
    type: Schema.Types.ObjectId,
    //* ref is used to establish a relationship between two models
    // Here we are setting the realtionship between Product and User models
    ref: "User",
    required: true,
  },
});

//# A model connects a schema with a name
module.exports = mongoose.model("Product", productSchema);
// // getDb method to get access to the database
// const getDb = require("../util/database").getDb;
// const mongodb = require("mongodb");
// class Product {
//   constructor(title, imageUrl, description, price, id, userId) {
//     this.title = title;
//     this.imageUrl = imageUrl;
//     this.description = description;
//     this.price = price;
//     // MongoDB will auto-generate its own unique '_id', but it is better to write our code
//     // to handle both cases - when we create a new product and when we update an existing one
//     //* Validate id before creating ObjectId to avoid BSON Error
//     this._id =
//       id && mongodb.ObjectId.isValid(id) ? new mongodb.ObjectId(id) : null;
//     this.userId = userId;
//   }

//   save() {
//     const db = getDb();
//     let dbOperation;
//     if (this._id) {
//       dbOperation = db
//         .collection("products")
//         //? UpdateOne does not replace an existing item
//         //-> $set operator updates the fields specified in the document
//         // here it is 'this' (id, title, imageUrl, description, price)
//         .updateOne({ _id: this._id }, { $set: this });
//     } else {
//       // Collection in which we want to insert data
//       // If it doesn't exist, it will be created automatically
//       // Check MongoDB docs for all CRUD operations
//       dbOperation = db.collection("products").insertOne(this);
//     }

//     return dbOperation
//       .then((result) => {
//         console.log(result);
//       })
//       .catch((err) => console.log(err));
//   }

//   static fetchAll() {
//     const db = getDb();
//     return (
//       db
//         .collection("products")
//         //! find() without any parameters fetches all the documents; could be millions of them
//         // Ideally, we should pass params or use pagination in the app to limit data fetching
//         //? find() also allows a cursor to be returned for more complex queries
//         //-> A cursor is an object that goes through our documents step-by-step
//         .find()
//         // MongoDB does not immediately return all matching documents. Instead, it returns a cursor object.
//         //# We are using toArray() to interact with the cursor to get all the documents
//         .toArray()
//         .then((products) => {
//           console.log(products);
//           return products;
//         })
//         .catch((err) => console.log(err))
//     );
//   }

//   static findById(prodId) {
//     const db = getDb();
//     return (
//       db
//         .collection("products")
//         // prodId is a string, but _id in MongoDB is an ObjectId
//         // So we need to convert it using mongodb package
//         .find({ _id: new mongodb.ObjectId(prodId) })
//         .next() // next() fetches the next document from the cursor
//         .then((product) => {
//           console.log(product);
//           return product;
//         })
//         .catch((err) => console.log(err))
//     );
//   }

//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection("products")
//       .deleteOne({ _id: new mongodb.ObjectId(prodId) })
//       .then((result) => {
//         console.log("Deleted product");
//       })
//       .catch((err) => console.log(err));
//   }
// }

// module.exports = Product;
