const Category = require("../models/category");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, result) => {
    if (err || !result) {
      return res.status(400).json({
        error: `Category with id ${id} is not found`,
      });
    }
    req.category = result;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) { 
      return res.status(400).json({
        error: "Category is not able to saved in DB",
      });
    }
    res.json(category)
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err || !categories) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    res.json(categories);
  });
};

exports.updateCategory = (req, res) => {
  const category = req.category;
  category.name = req.body.name;

  category.save((err, updatedCategory) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to update category",
      });
    }

    res.json(updatedCategory);
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to remove category",
      });
    }
    res.json({
      message: `${category.name} has been deleted successfully`,
    });
  });
};
