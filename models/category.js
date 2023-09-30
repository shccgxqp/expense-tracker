const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlModelsSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});


module.exports = mongoose.model("Category", urlModelsSchema);
