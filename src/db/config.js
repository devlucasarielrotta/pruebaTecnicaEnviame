import Sequelize from "sequelize";
import dotenv from 'dotenv'; 

dotenv.config({path: '.env'});

const databaseConfig = {
    name:       process.env.MYSQL_DATABASE,
    user:       process.env.MYSQL_USERNAME,
    password:   process.env.MYSQL_PASSWORD,
    host:       process.env.MYSQL_HOST,   
    port:       process.env.ECOMMERCE_MYSQL_PORT,
    dialect:    process.env.SEQUELIZE_DIALECT,
}

const {name,user, password,host,port,dialect} = databaseConfig;

const db = new Sequelize(name,user,password, {
    host,
    port,
    dialect,
    define: {
        timestamps: true
    },
    pool:{
        max:5,
        min:0,
        acquire:300000, 
        idle: 100000 
    },
    operatorAliases: false
});


const dbConnection = async( ) => {

    try{ 
        
        await db.authenticate();
        await db.sync({force:true});      
        

        console.log('Base de datos online')
        
    }catch(error){
        console.error('Se ha detectado un error');
        throw new Error(`Error al inicializar la base de datos:, ${error.message}`);
    }
}
const dbClose = async () => {
    try{ 
        await db.close()
        console.log('Base de datos Cerrada')
        console.log('\x1b[36m%s\x1b[0m', 'Ahora ejecute el comando npm run start para desplegar la aplicación')
        
    }catch(error){
        console.error('Se ha detectado un error');
        throw new Error('Error al cerrar la base de datos:', error.msg);
    }
}
export {
    dbConnection,
    dbClose,
    db
}