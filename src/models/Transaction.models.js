import { DataTypes } from 'sequelize';
import { db } from '../db/config.js';
import User from './User.models.js';

const Transaction = db.define('transacciones', {
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement: true,
    allowNull: false,
  },
  buyer_user: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id',
    },
  },
});






export default Transaction