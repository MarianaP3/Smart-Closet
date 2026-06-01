const Garment = require('../models/garment.js');
const ObjectId = require('mongoose').Types.ObjectId;

class GarmentRepository {
  static async getAllByUser(userId) {
    return await Garment.find({ user: userId });
  }

  static async getByIdAndUser(id, userId) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Garment.findOne({ _id: id, user: userId });
  }

  static async create(garmentData) {
    const garment = new Garment(garmentData);
    return await garment.save();
  }

  static async updateByIdAndUser(id, userId, updateData) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Garment.findOneAndUpdate(
      { _id: id, user: userId },
      updateData,
      { new: true },
    );
  }

  static async deleteByIdAndUser(id, userId) {
    if (!ObjectId.isValid(id)) {
      return null;
    }

    return await Garment.deleteOne({ _id: id, user: userId });
  }

  static async countByIdsAndUser(ids, userId) {
    const validIds = ids.filter((id) => ObjectId.isValid(id));

    if (validIds.length === 0) {
      return 0;
    }

    return await Garment.countDocuments({
      _id: { $in: validIds },
      user: userId,
    });
  }
}

module.exports = { GarmentRepository };
