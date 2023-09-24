import { DataTypes} from 'sequelize';
import { db } from '../db/config.js';
import Transaction from './Transaction.models.js';
import Product from './Product.model.js';

const TransactionProduct = db.define('TransactionProduct', {

    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },

    transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: Transaction, 
          key: 'id',
        },
      },

      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model:Product, 
          key: 'id',
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
  });
  

  export default TransactionProduct;