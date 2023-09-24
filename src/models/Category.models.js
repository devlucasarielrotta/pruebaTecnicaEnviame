import { DataTypes } from 'sequelize';
import { db } from '../db/config.js';

const Category = db.define('categorias', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique:true,
    validate:{
        isAlpha:{
            args:true,
            msg:"El nombre de la categoria debe contener solo caracteres"
        },
        len: {
            args: [2,100],
            msg: "La longitud de la categoria debe ser entre 2 y 100 caracteres"
       }         
    }
  },

  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate:{    
        len: {
            args: [2,200],
            msg: "La longitud de la descripcion de la categoria debe ser entre 2 y 200 caracteres"
            }    
        },
    },


});


export default Category