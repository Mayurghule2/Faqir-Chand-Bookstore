const router = require("express").Router();
const User = require("../models/user");
const {authenticateToken} = require("./userAuth");

// add book to cart
router.put('/add-to-cart', authenticateToken, async (req, res)=>{
  try {
    const {bookid, id}  = req.headers;
  const userData = await User.findById(id);
  const isBookinCart = userData.cart.includes(bookid);

  if(isBookinCart){
    return res.status(200).json({
      status: "Success",
      message: "Book is already in Cart"});
  }
  await User.findByIdAndUpdate(id, {
    $push:{cart: bookid},
  })
  return res.status(200).json({
    status:"Success",
    message: "Book added to Cart"
  })
  } catch (error) {
    return res.status(200).json({message: "An Error Occurs"
    })
  }
  
})


// remove book from cart
router.put('/remove-from-cart/:bookid', authenticateToken, async (req, res)=>{
  try {
    const {bookid} = req.params;
    const { id}  = req.headers;
 
    await User.findByIdAndUpdate(id, {
      $pull:{cart: bookid},
    })
  
  
  return res.status(200).json({
    status:"Success",
    message: "Book removed from Cart"
  })
  } catch (error) {
    return res.status(200).json({message: "An Error Occurs"
    })
  }
  
})

// get cart of a particular user
router.get('/get-user-cart', authenticateToken, async (req, res)=>{
  try {
    const { id}  = req.headers;
    const userData = await User.findById(id).populate("cart")
    const cart = userData.cart.reverse();  
  
  return res.status(200).json({
    status:"Success",
    data: cart
  })
  } catch (error) {
    return res.status(200).json({message: "An Error Occurs"
    })
  }
  
})

module.exports = router;