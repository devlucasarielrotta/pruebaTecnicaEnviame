import { DataTypes } from 'sequelize';
import { db } from '../db/config.js';
import Category from './Category.models.js';
import User from './User.models.js';

const Product = db.define('productos', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isAlpha: {
        args: true,
        msg: "El nombre del producto debe contener solo caracteres",
      },
      len: {
        args: [2, 100],
        msg: "La longitud del producto debe ser entre 2 y 100 caracteres",
      },
    },
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: {
        args: [2, 200],
        msg: "La longitud de la descripción del producto debe ser entre 2 y 200 caracteres",
      },
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, 
    validate: {
      isNumeric: {
        args: true,
        msg: "La cantidad del producto debe contener solo números",
      },
    },
  },
  status: {
    type: DataTypes.BOOLEAN,
    defaultValue: true,
    allowNull: false,
  },
  seller_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
  categories:{
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Category,
      key: 'id',
    },
  },
});


export default Product;