import { request, response } from "express";
import Transaction from "../models/Transaction.models.js";
import User from "../models/User.models.js";
import Product from "../models/Product.model.js";
import TransactionProduct from "../models/TransactionProduct.model.js";
import { Sequelize } from "sequelize";

const getTransactions = async ( req=request, res=response ) => {
    try {

        const {offset = 0,limit = 20, info="0" } = req.query;

        switch(info){

            case "0" :
                const { count, rows: transacciones } = await Transaction.findAndCountAll({
                    offset: Number(offset),
                    limit:  Number(limit),
                    include: [
                        {
                            model: User,
                            as: "buyerUser", 
                            attributes: ["id", "name", "email"], 
                        },
                        {
                            model: Product, 
                            attributes:["id","name","description"]     
                        },
                    
                    ],
                });

                res.status(200).json({
                    count,
                    transacciones
                })
                break;
                
            case "1":

            const buyerUsers = await Transaction.findAll({
                attributes: [
                    [Sequelize.fn('DISTINCT', Sequelize.col('buyer_user')), 'buyer_user'],
                ],
            });

            const arrayIdsBuyersUsers = buyerUsers.map((user) => user.dataValues.buyer_user);

            const {count:totalBuyers,rows:buyers} = await User.findAndCountAll( {
                where: {
                    id: {
                        [Sequelize.Op.in]: arrayIdsBuyersUsers,
                    },
                }
            })

            const buyerTransactions = await Promise.all(
                buyers.map(async (buyer) => {
                    const userTransactions = await Transaction.findAll({
                        where: { buyer_user: buyer.id },
                        include: [
                            {
                                model: Product,
                            },
                        ],
                    });
                    return {
                        user: buyer,
                        transactions: userTransactions,
                    };
                })
            );
            
                const productIds = await TransactionProduct.findAll({
                    attributes: [
                        [Sequelize.fn('DISTINCT', Sequelize.col('productId')), 'productId'],
                    ],
                })

                const arrayIdsSellerUsers = productIds.map(user => user.dataValues.productId);

                const {count:totalSellers,rows:sellers} = await User.findAndCountAll({
                    where:{ 
                        id: {
                            [Sequelize.Op.in]: arrayIdsSellerUsers,
                        },
                    }
                })


       

          
                const sellerTransactions = await Promise.all(
                    sellers.map(async (seller) => {
                      const userTransactions = await TransactionProduct.findAll({
                        where: { productId: seller.id },
                        include: [
                          {
                            model: Transaction,                         
                          },
                        ],
                      });
                      return {
                        user: seller,
                        transactions: userTransactions,
                      };
                    })
                  );
                  
                res.status(200).json({
                    totalBuyers,
                    buyerTransactions,
                    totalSellers,
                    sellerTransactions
                })
                break;
        }
        
    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error
        })
    }
    
};

const getTransaction = async ( req=request, res=response ) => {
  
    try {

        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const transactionDB = await Transaction.findByPk(Number(id),{ 
            include: [
                {
                    model: User,
                    as: "buyerUser", 
                    attributes: ["id", "name", "email"], 
                },
                {
                    model: Product, 
                    attributes:["id","name","description"]     
                },           
            ],
        });

        if(!transactionDB){
            return res.status(400).json({
                msg:`La transaccion con id ${id} no existe`
            })
        }

        res.status(200).json({
            transactionDB
            
        })

    }catch(error){
        console.log(error);
        res.status(500).json({
            msg:error
        })
    }
    
};

const postTransaction = async (req, res) => {
    try {

      const { buyer_user, products } = req.body;

      const usuarioDB = await User.findByPk(buyer_user);
      if (!usuarioDB) {
        return res.status(400).json({ msg: `El usuario con ID ${buyer_user} no existe` });
      }

      if(!products || products.length === 0 ){
        return   res.status(400).json({
            msg:`Debes ingresar al menos un producto`
        })
      }

      for (const producto of products) {

        const {productId,quantity} = producto;

        if(!quantity || quantity <= 0){
            return   res.status(400).json({
                msg:`Debe ingresar al menos una cantidad positiva para el producto ${productId}`
            })
        }

        const productoDB  = await Product.findByPk(productId);

        if(!productoDB){
            return   res.status(400).json({
                msg:`El producto con id ${productId} no existe`
            })
        }
          

        const {quantity:quantityProduct} = productoDB;
            
        if(quantityProduct-quantity < 0){
            return   res.status(400).json({
                msg:`La cantidad de productos ingresados (${quantity}) para el producto ${productId} supera al stock existente de ${quantityProduct} productos`
            })
        }
 
      }
      
      const transaction = await Transaction.create({ buyer_user });
  
      const transactionProducts = [];
  
      for (const productData of products) {
        const { productId, quantity } = productData;
        const product = await Product.findByPk(productId);

        transactionProducts.push({
          transactionId: transaction.id,
          productId,
          quantity
        });
  
        await product.decrement('quantity', { by: quantity });
  
        if (product.quantity - quantity === 0) {
          await product.update({ status: false });
        }
      }
  
      await TransactionProduct.bulkCreate(transactionProducts);
  
      res.status(201).json(
            { msg: 'Transacción creada correctamente', transaction }
      );
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear la transacción' });
    }
  };
 
const putTransaction = async ( req=request, res=response ) => {

    const {id:idx,buyer_user,...data} = req.body;
 

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }

        const transactionDB = await Transaction.findByPk(id);

        if(!transactionDB){
            return res.status(400).json({
                msg:`La transaccion con id ${id} no existe`
            })
        }

        await transactionDB.update(data);

        res.json({
            transactionDB
        })

    }catch(error){
         res.status(400).json({
            error
        })
    }
 
};

const deleteTransaction= async ( req=request, res=response ) => {

    try {
        const {id} = req.params;

        if(isNaN(id)){
            return res.status(400).json({
                msg:`El id ${id} no es un número`
            }) 
        }
        const transactionDB = await Transaction.findByPk(id);

        if(!transactionDB){
            return res.status(400).json({
                msg:`La transaccion con id ${id} no existe`
            })
        }
        const transactionProduct  = await TransactionProduct.findAll({
            where:{
                transactionId: id
            }
        })
     
        for (const producto of transactionProduct) {
            const {  productId,quantity } = producto.dataValues;
            const productoDB = await Product.findByPk(productId);
            await productoDB.increment('quantity', { by: quantity });
            
            if (productoDB.quantity >= 0) {
              await productoDB.update({ status: true });
            }
        }
      

       await transactionDB.destroy();

        res.json({
            msg:`${JSON.stringify(transactionDB)} Eliminado`
        })

    }catch(error){
         res.status(500).json({
            error
        })
    }
 
};


export {
    getTransactions,
    getTransaction,
    postTransaction,
    putTransaction,
    deleteTransaction
}

