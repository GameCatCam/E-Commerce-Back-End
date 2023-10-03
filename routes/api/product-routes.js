const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async (req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'applicable_tags' }
      ]
    })
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err);
  }
});

// get one product
router.get('/:id', async (req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag, through: ProductTag, as: 'applicable_tags' }
      ]
    })

    if (!productData) {
      res.status(404).json({ message: 'No product with this id!'})
    }
    
    res.status(200).json(productData)
  } catch (err) {
    res.status(500).json(err)
  }
});

// create new product
router.post('/', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    // Find the product to delete by its `id` value
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      return res.status(404).json({ message: 'No product with this id!' });
    }
    
    // Delete the product itself
    await Product.destroy({
      where: {
        id: req.params.id,
      },
    });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
