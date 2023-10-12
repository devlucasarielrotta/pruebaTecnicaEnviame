import { request,response } from "express";
import bcrypt from 'bcryptjs';
import {User} from "../models/index.models.js";
import { generarJWT } from "../helpers/generar-jwt.js";

const authPost = async(req,res = response) => {

    try {
        const {email,password} = req.body;
        
        if(!email || !password) {
            return res.status(400).json({
                msg:"El email y la password son obligatorios"
             }) 
        }
        const usuario = await User.findOne({where:{email}});
        if( !usuario ){
            return res.status(400).json({
               msg:"el correo no existe"
            }) 
        }
        
        if(!bcrypt.compareSync(password,usuario.password)){
            return res.status(400).json({
                msg:"Contraseña incorrectas"
            })
        }

        const token = await generarJWT(usuario.id);
        
        res.json({
            msg:"Login ok",
            email,
           // password,
            usuario,
            token
            
        })

    }catch(error){
        res.status(500).json({msg:error.message})
    }
    
}

export {
    authPost,

}