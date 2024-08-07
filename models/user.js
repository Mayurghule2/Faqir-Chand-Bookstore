const mongoose = require("mongoose");

const user = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT7gTERsv3nO-4I-R9C00Uor_m_nmxT0sE9Cg&s",
  },
  role: {
    type: String,
    default: "user",
    enum: ["admin", "user"],
  },
  favourites:[
    {
      type: mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
  cart:[
    {
      type: mongoose.Types.ObjectId,
      ref: "book",
    },
  ],
  orders:[
    {
      type: mongoose.Types.ObjectId,
      ref: "order",
    },
  ],
},
{
  timestamps: true
})

module.exports = mongoose.model("user", user);