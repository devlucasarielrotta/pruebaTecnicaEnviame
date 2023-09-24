import { Sequelize } from "sequelize";
import { request, response } from "express";
import Category from "../models/Category.models.js";
import Product from "../models/Product.model.js";
import Transaction from "../models/Transaction.models.js";
import TransactionProduct from "../models/TransactionProduct.model.js";
import User from "../models/User.models.js";
const getCategories = async ( req=request, res=response ) => {

    
    try {

        const {offset = 0,limit = 20, user=0 } = req.query;

        switch(Number(user)){

            case 0 :

                const {count:Total,rows:categorias} = await Category.findAndCountAll({
                    offset:Number(offset),
                    limit:Number(limit),
                    include: [
                        {
                            model: Product,
                            as: "products", 
                            attributes: ["id", "name"], 
                        }
                    ],
                });
        
                res.status(200).json({
                    Total,
                    categorias
                })
        
                break;
                
            default:
                const usuario = await User.findByPk(user);

                const buyerUser = await Transaction.findAll({

                    where: { buyer_user: user }

                  });
                // obtengo la fk para la tabla transctionProduct
                const arrayIdsBuyersUsers = buyerUser.map((user) => user.dataValues.id);

                // obtengo todos los product id relacionados al buyer user
                const productsTransactionObject = await TransactionProduct.findAll({  
                    where: {
                        transactionId: {
                           [Sequelize.Op.in]: arrayIdsBuyersUsers,
                        },
                    }
                })
                

                const productIds = productsTransactionObject.map((product) => product.dataValues.productId);

              
                const productsObject = await Product.findAll({
                    where: {
                            id: {
                                 [Sequelize.Op.in]: productIds,
                            },
                        },
                });
                
                const categoryIds = productsObject.map((product) => product.dataValues.categories);
                const categoriasByUser = await Category.findAll({
                    where: {
                      id: {
                        [Sequelize.Op.in]: categoryIds,
                      },
                    },
                  });
                res.status(200).json({
                    usuario,
                    categoriasByUser
                })
        
                break;
        }
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error
        })
    }
    
}

const getCategory = async ( req=request, res=response ) => {

    try {

        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const categoriaDB = await Category.findByPk(Number(id));

        if(!categoriaDB){
            return res.status(400).json({
                msg:`La categoria con id ${id} no existe`
            })
        }

        res.status(200).json({
            categoriaDB
            
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error
        })
    }
    
}

const postCategory = async ( req=request, res=response ) => {

    const {name,description,products=null} = req.body;

    if(!name){
        return res.status(400).json({
            error: `El nombre de la categoria es obligatorio`
         })
    }
    if(!description){
        return res.status(400).json({
            error: `La descripcion de la categoria es obligatoria`
         })
    }

    const upperName = name.toUpperCase();
    const nameDB = await Category.findOne({where: {name:upperName}})

    if(nameDB){

        return res.status(400).json({
            error: `La categoria ${upperName}, ya se encuentra registrada`
         })
               
    }

    if(products && products.length >0){

        for (const producto of products){
            const {productId} = producto;
            const existeProducto = await Product.findByPk(productId);
            if(!existeProducto){
                return res.status(400).json({
                    error: `El producto ${productId} no existe`
                 })
            }
        }
    }

    const data = {
        name: name.toUpperCase(),
        description,
        products
    }


    try {

        const category = await Category.create(data)

        res.status(200).json({
            msg:'Categoria creada correctamente: ', category
        })

    }catch(error){

        console.log(error);
        res.status(500).json({
            msg:error
        })

    }
    
}

const putCategory = async ( req=request, res=response ) => {

    const {id:idx,name,description} = req.body;
 

    try {
        const {id} = req.params;
        const data = {};

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const categoryDB = await Category.findByPk(id);

        if(!categoryDB){
            return res.status(400).json({
                msg:`La categoria con id ${id} no existe`
            })
        }

        if(name){
            const nameDB = await Category.findOne({where:{name:name}});
        
            if(nameDB !== null){
                return res.status(400).json({
                    msg:`La categoria con nombre ${name} ya existe`
                })
            }
        }
        if(description){
            data.description = description;    
        }
        data.name = name;
        await categoryDB.update(data);

        res.json({
           msg: categoryDB
        })
    }catch(error){
         res.status(500).json({
            msg:error
        })
    }
 
}

const deleteCategory = async ( req=request, res=response ) => {

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }
        const categoryDB = await Category.findByPk(id);

        if(!categoryDB){
            return res.status(400).json({
                msg:`La categoria con id ${id} no existe`
            })
        }
        // console.log(categoryDB);
        // const {id:categoryId} = categoryDB.dataValues;
        
        // const productsByCategory = await Product.findAll({
        //     where:{
        //         categories:categoryId
        //     }
            
        // })
       
        // for (const producto of productsByCategory) {
        //     const {id} = producto.dataValues
        //     const productoDB = await Product.findByPk(id);
        //     productoDB.update({categories:null})
        // }
        const resultado = await categoryDB.destroy();
        
        res.status(200).json({
            msg:`${resultado} Eliminado`
        })

    }catch(error){
         res.status(500).json({
            msg:error
        })
    }
 
}


export {
   deleteCategory,
   postCategory,
   putCategory,
   getCategory,
   getCategories,
}


