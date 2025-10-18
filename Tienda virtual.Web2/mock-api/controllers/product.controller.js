const Product = require('../models/product.model');

exports.listProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error('Error listing products', err);
    res.status(500).json({ message: 'Internal error' });
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, price } = req.body;
    const p = new Product({ name, price });
    await p.save();
    res.status(201).json(p);
  } catch (err) {
    console.error('Error creating product', err);
    res.status(400).json({ message: 'Bad request' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    await Product.findByIdAndDelete(id);
    res.status(204).end();
  } catch (err) {
    console.error('Error deleting product', err);
    res.status(400).json({ message: 'Bad request' });
  }
};
