import { DataTypes } from 'sequelize';
import { db } from '../db/config.js';

const User = db.define('usuarios', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate:{
        isAlpha:{
            args:true,
            msg:"El nombre del usuario debe contener solo caracteres"
        },
        len: {
            args: [2,100],
            msg: "La longitud del nombre debe ser entre 2 y 100 caracteres"
       }         
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate:{
        isEmail:{
            args:true,
            msg:"Debes ingresar un email valido"
        }
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  is_admin: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
    allowNull: false,
  },
});




export default User