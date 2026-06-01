const { response, request } = require('express');
const bcrypt = require('bcrypt');
const { UserRepository } = require('../repositories/user.js');
const { Validations } = require('../helpers/validations.js');
const { ObjectId } = require('mongoose').Types;

const mapUser = (user) => ({
  id: user._id.toString(),
  username: user.username,
  role: user.role === 'Administrador' ? 'Administrador' : 'Usuario',
});

const getAllUsers = async (req = request, res = response) => {
  try {
    const result = await UserRepository.getAll({});
    res.status(200).json(result.map(mapUser));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al obtener los datos',
    });
  }
};

const getUserById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const result = await UserRepository.getById(id);
    if (result == null) {
      return res.status(404).json({
        msg: 'Usuario no encontrado',
      });
    }
    res.status(200).json(mapUser(result));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al obtener los datos',
    });
  }
};

const createNewUser = async (req = request, res = response) => {
  const { username, password, role } = req.body;
  const userRole = role === 'Administrador' ? 'Administrador' : 'Usuario';
  const saltRounds = process.env.SALTROUNDS || 10;

  if (!username || !password) {
    return res.status(400).json({
      msg: 'Información incompleta',
    });
  }

  try {
    Validations.username(username);
    Validations.password(password);
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }

  try {
    const existingUser = await UserRepository.getOne({ username });
    if (existingUser) {
      return res.status(400).json({
        msg: 'Username ya existente',
      });
    }

    const hashedPassword = await bcrypt.hash(password, Number(saltRounds));
    const savedUser = await UserRepository.create({
      username,
      password: hashedPassword,
      role: userRole,
    });
    res.status(201).json(mapUser(savedUser));
  } catch (error) {
    console.log(error);
    res.status(500).json({
      msg: 'Error al agregar nuevo usuario',
    });
  }
};

const updateUserById = async (req = request, res = response) => {
  const { id } = req.params;
  const { username, password, role } = req.body;
  const saltRounds = process.env.SALTROUNDS || 10;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  if (!username?.trim()) {
    return res.status(400).json({
      msg: 'Escribe un nombre de usuario.',
    });
  }

  try {
    Validations.username(username.trim());
  } catch (error) {
    return res.status(400).json({
      msg: error.message,
    });
  }

  if (password?.trim()) {
    try {
      Validations.password(password.trim());
    } catch (error) {
      return res.status(400).json({
        msg: error.message,
      });
    }
  }

  try {
    const currentUser = await UserRepository.getById(id);

    if (!currentUser) {
      return res.status(404).json({
        msg: 'Usuario no encontrado',
      });
    }

    const duplicate = await UserRepository.getOne({ username: username.trim() });

    if (duplicate && duplicate._id.toString() !== id) {
      return res.status(400).json({
        msg: 'Username ya existente',
      });
    }

    const updateData = {
      username: username.trim(),
      role: role === 'Administrador' ? 'Administrador' : 'Usuario',
    };

    if (password?.trim()) {
      updateData.password = await bcrypt.hash(password.trim(), Number(saltRounds));
    }

    const updatedUser = await UserRepository.updateById(id, updateData);

    if (!updatedUser) {
      return res.status(404).json({
        msg: 'Usuario no encontrado',
      });
    }

    res.status(200).json(mapUser(updatedUser));
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al actualizar el usuario',
    });
  }
};

const deleteUserById = async (req = request, res = response) => {
  const { id } = req.params;

  if (!ObjectId.isValid(id)) {
    return res.status(400).json({
      msg: 'ID no válido',
    });
  }

  try {
    const totalUsers = await UserRepository.count({});
    if (totalUsers <= 1) {
      return res.status(400).json({
        msg: 'No puedes eliminar el último usuario del sistema.',
      });
    }

    const deletedUser = await UserRepository.deleteById(id);

    if (!deletedUser || deletedUser.deletedCount === 0) {
      return res.status(404).json({
        msg: 'Usuario no encontrado',
      });
    }

    return res.status(200).json({
      msg: 'Usuario eliminado exitosamente',
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      msg: 'Error al eliminar el usuario',
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
