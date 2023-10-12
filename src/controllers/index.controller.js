import { authPost } from "./auth.controller.js";
import { getUser,getUsers,postUser,putUser,deleteUser } from "./user.controller.js";
import { getCategories,getCategory,postCategory,putCategory,deleteCategory } from "./category.controller.js";
import { getProduct,getProducts,postProduct,putProduct,deleteProduct } from "./producto.controller.js";
import { getTransaction,getTransactions,postTransaction,putTransaction,deleteTransaction } from "./transacction.controller.js";

export {
    authPost,
    getUser, getUsers,postUser,putUser,deleteUser,
    getCategories,getCategory,postCategory,putCategory,deleteCategory,
    getProduct,getProducts,postProduct,putProduct,deleteProduct,
    getTransaction,getTransactions,postTransaction,putTransaction,deleteTransaction
}