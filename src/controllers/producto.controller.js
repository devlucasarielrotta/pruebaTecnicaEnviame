import { request, response } from "express";
import {Product, User,Category} from '../models/index.models.js'

const getProducts = async ( req=request, res=response ) => {

    try {

        const {offset = 0,limit = 100} = req.query;

        
        const {count:total,rows:productos} = await Product.findAndCountAll({
            offset:Number(offset),limit:Number(limit),
                include: [
                    {
                        model: User,
                        as: "seller", 
                        attributes: ["id", "name", "email"], 
                    },
                    {
                        model: Category,
                        as:"categoria",
                    }
                ],
            },
        );

        res.status(200).json({
            total,
            productos
        })

    }catch(error){
        console.log(error);
        res.status(400).json({
            msg:error
        })
    }
    
}

const getProduct = async ( req=request, res=response ) => {
    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const usuarioDB = await Product.findByPk(Number(id));

        if(!usuarioDB){
            return res.status(400).json({
                msg:`Usuario con id ${id} no existe`
            })
        }

        res.status(200).json({
            usuarioDB
            
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error.message
        })
    }
    
}


const postProduct = async ( req=request, res=response ) => {
    
    const {name,description="sin descripcion",quantity=1,status=1,seller_user,categories} = req.body;
   
    if(!name || !seller_user || !categories || isNaN(categories) || isNaN(seller_user)){
        return res.status(400).json({
            error: `Recuerda que el nombre, el id del usuario vendedor y la categoria son obligatorios`
         })
            
    }
    const nameDB = await Product.findOne({where: {name}})
    if(nameDB){

        return res.status(400).json({
            error: `El nombre del product ${name}, ya se encuentra registrado`
         })
                
    }

    const userDB = await User.findByPk(seller_user);
    if(!userDB){

        return res.status(400).json({
            error: `El usuario con id ${seller_user}, no existe`
         })
                
    }
    const categoryDB = await Category.findByPk(categories);
    if(!categoryDB ){

        return res.status(400).json({
            error: `La categoria con id ${categories}, no existe`
         })
                
    }
    const data = {
        name,
        description,
        quantity,
        seller_user,
        categories
    }
    try {

        const product = await Product.create(data)
        res.status(200).json({
            msg:'Producto creado exitosamente', product
        })

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg:error.message
        })

    }
    
}

const putProduct = async ( req=request, res=response ) => {

    const {id:idx,password,...data} = req.body;
 

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const usuarioDB = await Product.findByPk(id);

        if(!usuarioDB){
            return res.status(400).json({
                msg:`El operador con id ${id} no existe`
            })
        }

        if( password ){
            const salt      = bcrypt.genSaltSync();
            data.password   = bcrypt.hashSync(password,salt);
        
        };

        await usuarioDB.update(data);

        res.json({
           msg: usuarioDB
        })
    }catch(error){
         res.status(500).json({
            msg:error.message
        })
    }
 
}

const deleteProduct = async ( req=request, res=response ) => {

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }
        const productoDB = await Product.findByPk(id);

        if(!productoDB){
            return res.status(400).json({
                msg:`El producto con id ${id} no existe`
            })
        }
        await productoDB.destroy();

        res.json({
            msg:`${productoDB} Eliminado`
        })

    }catch(error){
         res.status(500).json({
            msg:error.message
        })
    }
 
}


export {
   deleteProduct,
   postProduct,
   putProduct,
   getProduct,
   getProducts
}


