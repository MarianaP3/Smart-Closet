const { response, request } = require('express');
const { ObjectId } = require('mongoose').Types;
const { OutfitRepository } = require('../repositories/outfit.js');
const { GarmentRepository } = require('../repositories/garment.js');

const mapOutfit = (outfit) => ({
  id: outfit._id.toString(),
  name: outfit.name,
  style: outfit.style,
  occasion: outfit.occasion,
  garmentIds: outfit.garmentIds,
});

const validateGarmentIds = async (garmentIds, userId) => {
  if (!Array.isArray(garmentIds) || garmentIds.length === 0) {
    return 'Selecciona al menos una prenda';
  }

  const invalidId = garmentIds.find((id) => !ObjectId.isValid(id));

  if (invalidId) {
    return 'ID de prenda no válido';
  }

  const count = await GarmentRepository.countByIdsAndUser(garmentIds, userId);

  if (count !== garmentIds.length) {
    return 'Una o más prendas no pertenecen a tu inventario';
  }

  return null;
};

const getAllOutfits = async (req = request, res = response) => {
  try {
    const outfits = await OutfitRepository.getAllByUser(req.userActive._id);
    res.status(200).json(outfits.map(mapOutfit));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener los outfits',
    });
  }
};

const getOutfitById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const outfit = await OutfitRepository.getByIdAndUser(
      id,
      req.userActive._id,
    );

    if (!outfit) {
      return res.status(404).json({
        msg: 'Outfit no encontrado',
      });
    }

    res.status(200).json(mapOutfit(outfit));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener el outfit',
    });
  }
};

const createOutfit = async (req = request, res = response) => {
  const { name, style, occasion, garmentIds } = req.body;

  if (!name || !style || !occasion) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    const garmentError = await validateGarmentIds(garmentIds, req.userActive._id);

    if (garmentError) {
      return res.status(400).json({
        msg: garmentError,
      });
    }

    const savedOutfit = await OutfitRepository.create({
      name: name.trim(),
      style,
      occasion,
      garmentIds,
      user: req.userActive._id,
    });

    res.status(201).json(mapOutfit(savedOutfit));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al crear el outfit',
    });
  }
};

const updateOutfitById = async (req = request, res = response) => {
  const { id } = req.params;
  const { name, style, occasion, garmentIds } = req.body;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  if (!name || !style || !occasion) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    const garmentError = await validateGarmentIds(garmentIds, req.userActive._id);

    if (garmentError) {
      return res.status(400).json({
        msg: garmentError,
      });
    }

    const updatedOutfit = await OutfitRepository.updateByIdAndUser(
      id,
      req.userActive._id,
      {
        name: name.trim(),
        style,
        occasion,
        garmentIds,
      },
    );

    if (!updatedOutfit) {
      return res.status(404).json({
        msg: 'Outfit no encontrado',
      });
    }

    res.status(200).json(mapOutfit(updatedOutfit));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar el outfit',
    });
  }
};

const deleteOutfitById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const result = await OutfitRepository.deleteByIdAndUser(
      id,
      req.userActive._id,
    );

    if (!result || result.deletedCount === 0) {
      return res.status(404).json({
        msg: 'Outfit no encontrado',
      });
    }

    res.status(200).json({
      msg: 'Outfit eliminado exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar el outfit',
    });
  }
};

module.exports = {
  getAllOutfits,
  getOutfitById,
  createOutfit,
  updateOutfitById,
  deleteOutfitById,
};
