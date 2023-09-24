import express from             'express';
import cors from                'cors';
import { dbConnection } from    '../db/config.js';
import userRoutes from          '../routes/user.routes.js';
import transactionRoutes from   '../routes/transacction.routes.js';
import categoryRoutes from      '../routes/category.routes.js';
import productoCategory from    '../routes/producto.routes.js';
import { router as loginRoutes } from '../routes/auth.routes.js';


class Server {
     
    constructor(){
        
        this.app  = express();
        this.port = process.env.ECOMMERCE_APP_PORT || 3000;

        this.paths = {
            usuarios:           process.env.ECOMMERCE_SERVICE_PATH + '/usuarios',
            transacciones:      process.env.ECOMMERCE_SERVICE_PATH + '/transacciones',
            categorias:         process.env.ECOMMERCE_SERVICE_PATH + '/categorias',
            productos:          process.env.ECOMMERCE_SERVICE_PATH + '/productos',
            auth:               process.env.ECOMMERCE_SERVICE_PATH + '/login',
        }

        
        this.conectarDB();
        this.middlewares();

        this.routes();
        
    }

    async conectarDB(){

        await dbConnection();
 

    }


    middlewares(){

        this.app.use(cors());

        this.app.use(express.json());

        this.app.use('/ecommerce-service',express.static('public'));
    }

    routes(){
        this.app.use(this.paths.usuarios, userRoutes);
        this.app.use(this.paths.transacciones, transactionRoutes);
        this.app.use(this.paths.categorias, categoryRoutes);
        this.app.use(this.paths.productos, productoCategory);
        this.app.use(this.paths.auth, loginRoutes);
    }

    listen(){
        this.app.listen(this.port,()=>{
            console.log('Servidor activado en http://localhost:'+this.port+process.env.ECOMMERCE_SERVICE_PATH);
        })
       
    }
    
}

export {
    Server
}