const { response, request } = require('express');
const { UserRepository } = require('../repositories/user.js');
const { ObjectId } = require('mongoose').Types;

// Obtener todos los usuarios
const getAllUsers = async (req = request, res = response) => {
  try {
    const result = await UserRepository.getAll({});
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al obtener los datos",
    });
  }
};

// Obtener un usuario por su ID
const getUserById = async (req = request, res = response) => {
  const { id } = req.params;

  // Validar ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: "ID no válido",
    });
  }

  try {
    const result = await UserRepository.getById(id);
    if (result == null) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }
    res.status(200).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al obtener los datos",
    });
  }
};

// Crear un nuevo usuario
const createNewUser = async (req = request, res = response) => {
  const { username, password, role } = req.body;
  const userRole = role === 'Administrador' ? 'Administrador' : 'Usuario';
  const userData = { username, password, role: userRole };

  if (!username || !password) {
    return res.status(400).json({
      msg: "Información incompleta",
    });
  }

  try {
    const savedUser = await UserRepository.create(userData);
    res.status(201).json(savedUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: "Error al agregar nuevo usuario",
    });
  }
};

// Actualizar un usuario por su ID
const updateUserById = async (req = request, res = response) => {
  const { id } = req.params;
  const updateData = req.body;

  // Validar ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: "ID no válido",
    });
  }

  // Validar que haya datos para actualizar
  if (!updateData || Object.keys(updateData).length === 0) {
    return res.status(400).json({
      msg: "No se proporcionaron datos para actualizar",
    });
  }

  try {
    const updatedUser = await UserRepository.updateById(id, updateData);

    // Validar si se encontró y actualizó
    if (!updatedUser || updatedUser.matchedCount === 0) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    res.status(200).json({
      msg: "Usuario actualizado exitosamente",
      updatedUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al actualizar el usuario",
    });
  }
};

// Eliminar un usuario por su ID
const deleteUserById = async (req = request, res = response) => {
  const { id } = req.params;

  // Validar ID
  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: "ID no válido",
    });
  }
  try {
    const deletedUser = await UserRepository.deleteById(id);

    if (!deletedUser || deletedUser.deletedCount === 0) {
      return res.status(404).json({
        msg: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      msg: "Usuario eliminado exitosamente",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: "Error al eliminar el usuario",
    });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  createNewUser,
  updateUserById,
  deleteUserById,
};
