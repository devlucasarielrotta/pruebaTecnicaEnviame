import { Server } from './src/models/index.models.js'
import {Transaction , User,Product,Category} from './src/models/index.models.js';
import TransactionProduct from './src/models/TransactionProduct.model.js';

Transaction.belongsTo(User, { as: 'buyerUser', foreignKey: 'buyer_user' });

Transaction.belongsToMany(Product, { through: TransactionProduct, foreignKey: 'transactionId'});
Product.belongsToMany(Transaction, { through: TransactionProduct, foreignKey: 'productId'});
TransactionProduct.belongsTo(Transaction, { foreignKey: 'transactionId' });

Product.belongsTo(User, { foreignKey: 'seller_user', as: 'seller'});
User.hasMany(Product, { foreignKey: 'seller_user', as: 'products'});

Product.belongsTo(Category, { foreignKey: 'categories', as: 'categoria'});
Category.hasMany(Product, { foreignKey: 'categories', as: 'products'});


const server = new Server();

server.listen();
