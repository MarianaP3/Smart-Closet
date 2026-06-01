const Outfit = require('../models/outfit.js');
const ObjectId = require('mongoose').Types.ObjectId;

class OutfitRepository {
  static async getAllByUser(userId) {
    return await Outfit.find({ user: userId });
  }

  static async getByIdAndUser(id, userId) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Outfit.findOne({ _id: id, user: userId });
  }

  static async create(outfitData) {
    const outfit = new Outfit(outfitData);
    return await outfit.save();
  }

  static async updateByIdAndUser(id, userId, updateData) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Outfit.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true },
    );
  }

  static async deleteByIdAndUser(id, userId) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Outfit.deleteOne({ _id: id, user: userId });
  }
}

module.exports = { OutfitRepository };
