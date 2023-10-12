import { Router } from "express";
import { getProduct,getProducts,postProduct,putProduct,deleteProduct } from "../controllers/index.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";


const router = Router();


router.get('/',getProducts);

router.get('/:id',getProduct);

router.post('/',[
    validarJWT,
    validarCampos
],postProduct);

router.put('/:id',putProduct);

router.delete('/:id',[    
    validarJWT,
    validarCampos
],deleteProduct);

export default router;