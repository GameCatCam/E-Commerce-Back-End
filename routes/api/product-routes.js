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
  try {
    // Create the product data
    const newProductData = await Product.create({
      product_name: req.body.product_name,
      price: req.body.price,
      stock: req.body.stock,
    });

    if (req.body.tagIds && req.body.tagIds.length > 0) {
      const productTags = await ProductTag.findAll({
        where: { product_id: newProductData.id },
      });

      const productTagIds = productTags.map(({ tag_id }) => tag_id);

      // Create an array of new product tag associations
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => ({
          product_id: newProductData.id,
          tag_id,
        }));

      // Use Promise.all to handle multiple database operations
      await Promise.all([
        ProductTag.bulkCreate(newProductTags),
      ]);
    }

    // Fetch the newly created product data with associated tags
    const productWithTags = await Product.findByPk(newProductData.id, {
      include: [{ model: Tag, through: ProductTag, as: 'applicable_tags' }],
    });

    res.status(200).json(productWithTags);
  } catch (err) {
    console.error(err);
    res.status(400).json(err);
  }
})

// edit product
router.put('/:id', async (req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */
    try {
      // Update the product data
      await Product.update(req.body, {
        where: {
          id: req.params.id,
        },
      });
  
      if (req.body.tagIds && req.body.tagIds.length) {
        const productTags = await ProductTag.findAll({
          where: { product_id: req.params.id },
        });
  
        const productTagIds = productTags.map(({ tag_id }) => tag_id);
  
        // Create an array of new product tag associations
        const newProductTags = req.body.tagIds
          .filter((tag_id) => !productTagIds.includes(tag_id))
          .map((tag_id) => ({
            product_id: req.params.id,
            tag_id,
          }));
  
        // Create an array of product tag IDs to remove
        const productTagsToRemove = productTags
          .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
          .map(({ id }) => id);
  
        // Use Promise.all to handle multiple database operations
        await Promise.all([
          ProductTag.destroy({ where: { id: productTagsToRemove } }),
          ProductTag.bulkCreate(newProductTags),
        ]);
      }
  
      const updatedProductData = await Product.findByPk(req.params.id, {
        include: [{ model: Tag, through: ProductTag, as: 'applicable_tags' }],
      });
  
      res.status(200).json(updatedProductData);
    } catch (err) {
      console.error(err);
      res.status(500).json(err);
    }
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const productData = await Product.findByPk(req.params.id);

    if (!productData) {
      return res.status(404).json({ message: 'No product with this id!' });
    }
    
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
