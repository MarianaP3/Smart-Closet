const {response, request} = require('express');
const { UserRepository } = require('../repositories/user.js');
const { Validations } = require('../helpers/validations.js');
const bcrypt = require("bcrypt");
const { generateJWT } = require('../helpers/jdwt.js');


const login = async (req = request, res = response) => {
    const { username, password } = req.body;

    // Validar que los datos del cuerpo sean correctos
    if (!username || !password) {
        return res.status(400).json({
            msg: "Datos inválidos"
        });
    }

    // Buscar el usuario por el nombre de usuario
    const user = await UserRepository.getOne({ username: username });
    if (!user) {
        return res.status(401).json({
            msg: "Usuario y/o contraseña inválidos"
        });
    }

    // Comparar la contraseña proporcionada con la almacenada
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
        return res.status(401).json({
            msg: "Usuario y/o contraseña inválidos"
        });
    }

    // Generación del JWT
    try {
        // Excluimos la contraseña antes de enviarla
        const { password: _, ...simpleUser } = user.toObject();
        const token = await generateJWT(username, simpleUser.role);

        // Responder con el token y los datos del usuario (sin la contraseña)
        return res.status(200).json({
            msg: "Login OK",
            token: token,
            user: simpleUser
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            msg: "Internal Error"
        });
    }
};


const register = async (req = request, res = response) =>{
    const {username, password} = req.body;
    const saltRounds = process.env.SALTROUNDS || 10

    try{
        Validations.username(username);
        Validations.password(password);
    }catch(error){
        return res.status(400).json({
            msg: error.message
        })
    }
    
    try{
        const user = await UserRepository.getOne({username : username});
        if(user){
            return res.status(400).json({
                msg: "Username ya existente"
            });
        }
        const hashedPassword = await bcrypt.hash(password, Number(saltRounds));

        const newUser = await UserRepository.create({
            username: username,
            password: hashedPassword,
            role: 'Usuario',
        })

        /* const simpleUser = {
            username: newUser.user,
            role: newUser.role,
            id: newUser.id
        } */

        const { password: _, ...simpleUser} = newUser.toObject();

        res.status(200).json({
            msg:"Usuario creado",
            user: simpleUser
        })
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg: "Internal Error"
        })
    }
}

module.exports = {
    login,
    register
}