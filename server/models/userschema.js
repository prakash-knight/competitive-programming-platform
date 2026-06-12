const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  userid: {
    type: String,
    required: true,
    unique: true,
  },

  progress: [
    {
      sheetId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Sheet",
        required: true,
      },

      questionsDone: {
        type: Number,
        default: 0,
      }
      ,
       totalQuestions:{
        type: Number,
        default: 0,
       }, 
    }
  ]
});

const userinfo = mongoose.model("userinfo", userSchema);

module.exports = userinfo;