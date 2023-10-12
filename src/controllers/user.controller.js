import { request, response } from "express";
import bcrypt from 'bcryptjs';
import { Sequelize } from 'sequelize';
import {User, Transaction,Product} from "../models/index.models.js";


const getUsers = async ( req=request, res=response ) => {

    try {

        const {offset = 0,limit = 20, type="0" } = req.query;
        let total, usuarios;

        switch(type){

            case "0" :
                const allUsers = await User.findAndCountAll({offset:Number(offset),limit:Number(limit)});
                total = allUsers.count;
                usuarios = allUsers.rows;
                res.status(200).json({
                    total,
                    usuarios
                })
                break;
                
            case "1":

                const buyerUsers = await Transaction.findAll({
                    attributes: [
                      [Sequelize.fn('DISTINCT', Sequelize.col('buyer_user')), 'buyer_user'],
                    ],
                  });
                const sellerUsers = await Product.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('seller_user')), 'seller_user'],
                    ],
                })
                const arrayIdsBuyersUsers = buyerUsers.map(user => user.dataValues.buyer_user)
                const arrayIdsSellerUsers = sellerUsers.map(user => user.dataValues.seller_user);
                
                const {count:totalBuyers,rows:buyers} = await User.findAndCountAll( {
                    where: {
                        id: {
                            [Sequelize.Op.in]: arrayIdsBuyersUsers,
                        },
                    }
                })
                const {count:totalSellers,rows:sellers} = await User.findAndCountAll({
                    where: {
                        id: {
                            [Sequelize.Op.in]: arrayIdsSellerUsers,
                        },
                    }
                })
                res.status(200).json({
                    totalBuyers,
                    buyers,
                    totalSellers,
                    sellers
                })
                break;
        }
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error.message
        })
    }
    
}

const getUser = async ( req=request, res=response ) => {

    try {

        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const usuarioDB = await User.findByPk(Number(id));

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

const postUser = async ( req=request, res=response ) => {

    const {name,email,password,is_admin} = req.body;

    const emailDB = await User.findOne({where: {email}})

    if(emailDB){

        return res.status(400).json({
            error: `El email ${email}, ya se encuentra registrado`
         })
        
        
    }

    const data = {
        name,
        email,
        is_admin
    }

    const salt    = bcrypt.genSaltSync();
    data.password = bcrypt.hashSync(password,salt);

    try {

        const usuario = await User.create(data)

        res.status(200).json({
            msg:'Usuario creado correctamente: ', usuario
        })

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg:error.message
        })

    }
    
}

const putUser = async ( req=request, res=response ) => {

    const {id:idx,password,email,...data} = req.body;
 

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const usuarioDB = await User.findByPk(id);

        if(!usuarioDB){
            return res.status(400).json({
                msg:`El operador con id ${id} no existe`
            })
        }

        if( password ){
            const salt      = bcrypt.genSaltSync();
            data.password   = bcrypt.hashSync(password,salt);
        
        };

        if( email ){
            const emailDB  = await User.findByPk({
                where:{
                    email
                }
            });
            if(emailDB){
                res.status(400).json({
                    msg:`El mail ${email} ya se encuentra registrado`
                })
            }
            data.email = email;
        }

        await usuarioDB.update(data);

        res.json({
           msg: usuarioDB
        })
    }catch(error){
         res.status(500).json({
            msg:error
        })
    }
 
}

const deleteUser = async ( req=request, res=response ) => {

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }
        const usuarioDB = await User.findByPk(id);

        if(!usuarioDB){
            return res.status(400).json({
                msg:`El operador con id ${id} no existe`
            })
        }
        await usuarioDB.destroy();

        res.json({
            msg:`${usuarioDB} Eliminado`
        })

    }catch(error){
         res.status(500).json({
            msg:error.message
        })
    }
 
}


export {
    deleteUser,
    getUser,
    getUsers,
    postUser,
    putUser,
}


