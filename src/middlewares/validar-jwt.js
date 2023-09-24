import { request, response } from "express";
import jwt from 'jsonwebtoken'
import User from "../models/User.models.js";

const validarJWT = async (req = request, res= response, next) => {

    if(!req.header('Authorization')){
        return res.status(401).json({
            msg:'Bearer Header en Authorization no encontrado',
          
        })
    }
    const token = req.header('Authorization').split(' ')[1];
  
    if(!token){
        return res.status(401).json({
            msg:'Token no insertado',
            token
        })
    }
    
    try {
        const {id} = jwt.verify(token,process.env.SECRETORPRIVATEKEY)
        const usuario = await User.findByPk(id);
        req.id = id;
        req.usuario = usuario;
        next();
    }catch(err){
        console.log(err)
        return res.status(401).json({
            msg:'Token incorrecto'
        })
    }
}

export {
    validarJWT
}