const express = require("express");
const router = express.Router();

const { Cart } = require("../schema/cart.schema");
const { Product } = require("../schema/product.schema");

// adding to cart
router.post("/add", async (req, res) => {
  const { userId, items } = req.body;

  if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: "Invalid cart data" });
  }

  try {
      let cart = await Cart.findOne({ userId });

      // Enrich items with product details if not provided
      for (const item of items) {
          if (!item.productName || !item.price || !item.productImage) {
              const product = await Product.findById(item.productId);
              if (!product) {
                  return res.status(404).json({ message: `Product not found: ${item.productId}` });
              }
              item.productName = item.productName || product.name;
              item.price = item.price || product.price;
              item.productImage = item.productImage || product.image; // Assuming `image` exists in the Product model
          }

          // Validate that price is a valid number
          if (isNaN(item.price) || item.price <= 0) {
              return res.status(400).json({ message: `Invalid price for product: ${item.productName}` });
          }
      }

      if (cart) {
          items.forEach((item) => {
              const existingItem = cart.items.find(
                  (cartItem) => cartItem.productId.toString() === item.productId
              );
              if (existingItem) {
                  existingItem.quantity += item.quantity;
              } else {
                  cart.items.push(item);
              }
          });
      } else {
          cart = new Cart({ userId, items });
      }

      // Calculate total price
      cart.totalPrice = cart.items.reduce(
          (total, item) => total + item.quantity * item.price,
          0
      );

      // Validate that totalPrice is a valid number
      if (isNaN(cart.totalPrice) || cart.totalPrice <= 0) {
          return res.status(400).json({ message: "Invalid total price" });
      }

      await cart.save();
      res.status(201).json({ message: "Cart updated successfully", cart });
  } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error", error: error.message });
  }
});




// decrease product count
router.post("/remove", async (req, res) => {
  const { userId, productId } = req.body;

  // Validate the incoming request
  if (!userId || !productId) {
    return res.status(400).json({ message: "Invalid data" });
  }

  try {
    // Find the cart for the user
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // Find the product in the cart
    const productIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found in cart" });
    }

    // Decrease the quantity or remove the product if the quantity is 1
    const product = cart.items[productIndex];
    if (product.quantity > 1) {
      product.quantity -= 1;
    } else {
      cart.items.splice(productIndex, 1); // Remove product from cart
    }

    // Recalculate total price
    cart.totalPrice = await calculateTotalPrice(cart.items);

    // Save the updated cart
    await cart.save();

    res.status(200).json({ message: "Product quantity updated", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// get by id 
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Find the cart associated with the userId
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json({ message: "Cart fetched successfully", cart });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Helper function to calculate total price
// const calculateTotalPrice = async (items) => {
//   const { Product } = require("../schema/product.schema"); // Import Product model
//   let total = 0;

//   for (const item of items) {
//     const product = await Product.findById(item.productId);
//     if (product) {
//       total += product.price * item.quantity;
//     }
//   }
//   return total;
// };

module.exports = router;
