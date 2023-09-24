import { dbConnection,dbClose } from "./src/db/config.js";
import bcrypt from 'bcryptjs';
import User from "./src/models/User.models.js"
import Product from "./src/models/Product.model.js";
import Category from "./src/models/Category.models.js";
import Transaction from "./src/models/Transaction.models.js";
import TransactionProduct from "./src/models/TransactionProduct.model.js";

const bulkUsuarios = async () => {
    console.log("\n***Iniciando users bulk***\n")
    setTimeout(()=> {},1000);

    const pass  = "prueba"
    

    const usuariosBulk = [];
    for(let i = 0; i<30;i++){

        const salt        = bcrypt.genSaltSync();
        const password    = bcrypt.hashSync(pass,salt);
        usuariosBulk.push({
            "id":i+1,
            "name":`lucas${i}`.toLowerCase(),
            "email":`lucas${100+i}@lucas.com`.toLowerCase(),
            password,
            "is_admin": i%2 == 0? true:false
        })
    }

    await User.bulkCreate(usuariosBulk)
    
    console.log("\n***Users bulk finalizado***\n")
    setTimeout(()=> {},500);

}

const bulkCategories = async () => {
    console.clear();
    console.log("\n***Iniciando Categories bulk***\n")
    setTimeout(()=> {},1000);
    const categorias = ['Vehiculos','Electrodomesticos']
    const descripcion = ['Autos de alta gama','Productos para el hogar'];
    const bulkCategories = [];

    for(let i = 0; i<categorias.length;i++){

        bulkCategories.push({
            
            "name":         `${categorias[i]}`,
            "description":  `${descripcion[i]}`,

        })
    }

    await Category.bulkCreate(bulkCategories)
    
    console.log("\n***Categories bulk finalizado***\n")
    setTimeout(()=> {},500);
}

const bulkProductos = async () => {
    console.clear();
    console.log("\n***Iniciando productos bulk***\n")
    const productosBulk = [];

    for(let i = 0; i<30;i++){

        productosBulk.push({
            
            "name":         `Lavandina${i}`.toLowerCase(),
            "description":  `Art limpieza${100+i}`.toLowerCase(),
            "quantity":     i+1,
            "status":       true,
            "seller_user":  `${i+1}`,
            "categories":   i%2 == 0? 1:2
        })
    }

    await Product.bulkCreate(productosBulk)
    
    console.log("\n***Products bulk finalizado***\n")
    setTimeout(()=> {},500);
}

const bulkTransactions = async () => {
    await Transaction.create({id:1,buyer_user:1})
    await Transaction.create({id:2,buyer_user:3})
}

const bulkTransactionsProducts = async() => {
    await TransactionProduct.create({id:1,transactionId:1,productId:1,quantity:1})
    await TransactionProduct.create({id:2,transactionId:2,productId:2,quantity:2})

    const producto1 = await Product.findByPk(1)
    await producto1.decrement('quantity', { by: 1 });
            
            if (producto1.quantity <= 1) {
              await producto1.update({ status: false });
            }

    const producto2 = await Product.findByPk(2)
    await producto2.decrement('quantity', { by: 2 });
     
            if (producto1.quantity <= 1) {
                await producto2.update({ status: false });
            }

}
const main = async () => {

    await dbConnection();
    await bulkUsuarios();
    await bulkCategories();
    await bulkProductos();
    await bulkTransactions();
    await bulkTransactionsProducts();
    await dbClose();

}

main();