var mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    rollNo: { type: String, required: true, unique: true },
    datasetName : { type: String, required: true},
    isAccessed: { type: Boolean, required: true, default: false },
  },
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
module.exports = { User };
