const router = require("express").Router();
const { authenticateToken } = require("./userAuth");
const User = require("../models/user");
const Order = require("../models/order");

//place order
router.post("/place-order", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { order } = req.body;

    for (const orderData of order) {
      const newOrder = new Order({ user: id, book: orderData._id });
      const orderDataFromDb = await newOrder.save();

      // saving order in user model
      await User.findByIdAndUpdate(id, {
        $push: { orders: orderDataFromDb._id },
      });

      //clearing cart
      await User.findByIdAndUpdate(id, {
        $pull: { cart: orderData._id },
      });
    }
    return res.status(200).json({
      status: "Success",
      message: "Order Placed Successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "An Error Occurs" });
  }
});

// get order history of a particular user
router.get("/get-order-history", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    if (!id) {
      return res.status(400).json({
        status: "Fail",
        message: "User ID is required",
      });
    }

    // Find the user and populate orders and books
    const userData = await User.findById(id).populate({
      path: "orders",
      populate: { path: "book" },
    });

    if (!userData) {
      return res.status(404).json({
        status: "Fail",
        message: "User not found",
      });
    }

    // Reverse the order data
    const orderData = userData.orders.reverse();

    // Respond with the order data
    return res.status(200).json({
      status: "Success",
      data: orderData,
    });
  } catch (error) {
    console.error("Error fetching order history:", error);  // Log the error for debugging
    return res.status(500).json({  // Return a 500 Internal Server Error status
      status: "Error",
      message: "An error occurred while fetching order history",
      error: error.message,  // Include the error message in the response for more details
    });
  }
});


// get all orders --admin
router.get("/get-all-orders", authenticateToken, async (req, res) => {
  
  try {
    const userData = await Order.find()
      .populate({
        path: "book",
      })
      .populate({
        path: "user",
      })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      status: "Success",
      data: userData,
    });
  } catch (error) {
    return res.status(500).json({ message: "An Error Occurs" });
  }
});

// Update order  --admin
router.put("/update-status/:id", authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    await Order.findByIdAndUpdate(id, { status: req.body.status });

    return res.status(200).json({
      status: "Success",
      message: "Status Updated Successfully",
    });
  } catch (error) {
    return res.status(200).json({ message: "An Error Occurs" });
  }
});

module.exports = router;
