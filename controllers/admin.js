const Product = require("../models/product");

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
    // For load of every page we need the user to be logged in
    // So, we check for the login status on all render() calls
    //isAuthenticated: req.isLoggedIn ? req.isLoggedIn : null,
    isAuthenticated: req.session.isLoggedIn,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    // key in schema:value from the UI
    title: title,
    imageUrl: imageUrl,
    description: description,
    price: price,
    // every product is associated with a user
    //-> Mongoose allows to store the entire user object or just the user._id
    // If we store the whole object, it will automatically extract the id and store it in the database
    userId: req.user,
  });
  product
    .save()
    .then((result) => {
      //console.log(result);
      console.log("Created a product!");
      res.redirect("/admin/products");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  const editMode = req.query.edit;
  if (!editMode) {
    return res.redirect("/");
  }
  const prodId = req.params.productId;
  Product.findById(prodId)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      res.render("admin/edit-product", {
        pageTitle: "Edit Product",
        path: "/admin/edit-product",
        editing: editMode,
        product: product,
        // For load of every page we need the user to be logged in
        // So, we check for the login status on all render() calls
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId)
    .then((product) => {
      product.title = updatedTitle;
      product.price = updatedPrice;
      product.description = updatedDesc;
      product.imageUrl = updatedImageUrl;
      return product.save();
    })
    .then((result) => {
      console.log("Updated Product!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};

exports.getProducts = (req, res, next) => {
  Product.find()
    //? The below methods are mongoose specific & only FYI. They're not needed ihere.
    //* select allows us to choose specific fields to fetch from the documents
    // Here we are fetching only title and price, excluding _id, so (-_id )
    // .select("title price -_id")
    //* populate is a utility method provided by mongoose
    // .populate("userId", "name") // populating all the user details at once, instead of manually iterating and fetching
    .then((products) => {
      res.render("admin/products", {
        prods: products,
        pageTitle: "Admin Products",
        path: "/admin/products",
        // For load of every page we need the user to be logged in
        // So, we check for the login status on all render() calls
        isAuthenticated: req.session.isLoggedIn,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  // Mongoose does not have deleteById, but has findByIdAndDelete
  Product.findByIdAndDelete(prodId)
    .then(() => {
      console.log("Destroyed!");
      res.redirect("/admin/products");
    })
    .catch((err) => console.log(err));
};
