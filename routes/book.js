const router = require("express").Router();
const User = require("../models/user")
const Book = require("../models/book")
const jwt = require("jsonwebtoken")
const {authenticateToken} = require("./userAuth")


//add book --admin
router.post("/add-book", authenticateToken, async (req, res)=>{
  try {
    const {id} = req.headers;
    const user = await User.findById(id);
    if(user.role !== "admin"){
      return res.status(400).json({message: "You do not have access"});
    }
    const book = new Book({
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    });
    await book.save();
    return res.status(200).json({message: "book added successfully"});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error"});
  }
})

// Update book 
router.put("/update-book", authenticateToken, async (req, res)=>{
  try {
    const {bookid} = req.headers;
      const updatedBook = await Book.findByIdAndUpdate(bookid,{
      url: req.body.url,
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      desc: req.body.desc,
      language: req.body.language,
    }, {new: true});
    
    if(!updatedBook){
      return res.status(400).json({message: "Book not found"});
    }
    return res.status(200).json({message: "book Updated successfully"});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error"});
  }
})

// Delete book 
router.delete("/delete-book", authenticateToken, async (req, res)=>{
  try {
    const {bookid} = req.headers;
    const deletedBook = await Book.findByIdAndDelete(bookid);
    
    if(!deletedBook){
      return res.status(400).json({message: "Book not found"});
    }
    return res.status(200).json({message: "Book Deleted successfully"});
  } catch (error) {
    return res.status(500).json({message: "Internal Server Error"});
  }
})

// Get all Books
router.get("/get-all-books", async (req, res)=>{
  try {
    const books = await Book.find().sort({createdAt: -1});
    return res.json({
      status: "Success",
      data: books
    })
    } catch (error) {
    return res.status(500).json({message: "Internal Server Error"});
  }
})


// Get recently added books limit 4
router.get("/get-recent-books", async (req, res)=>{
  try {
    const books = await Book.find().sort({createdAt: -1}).limit(4);
    return res.json({
      status: "Success",
      data: books
    });
    } catch (error) {
    return res.status(500).json({ message: "An Error Occured" });
  }
})

// get book by id
router.get("/get-book-by-id/:id", async (req, res)=>{
  try {
    const {id} = req.params;
    const book = await Book.findById(id);
    return res.json({
      status: "Success",
      data: book
    });
    } catch (error) {
    return res.status(500).json({ message: "An Error Occured" });
  }
})


module.exports = router;