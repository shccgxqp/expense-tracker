const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const urlModelsSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  categoryId: {
    type: Schema.Types.ObjectId,
    ref: 'category',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

module.exports = mongoose.model("Record", urlModelsSchema);
