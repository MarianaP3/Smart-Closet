const mongoose = require('mongoose');

const outfitSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  style: {
    type: String,
    required: true,
  },
  occasion: {
    type: String,
    required: true,
  },
  garmentIds: {
    type: [String],
    required: true,
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

module.exports = mongoose.model('Outfit', outfitSchema);
