import { Router } from "express";
import {check,body,param} from 'express-validator';
import { getProduct,getProducts,postProduct,putProduct,deleteProduct } from "../controllers/producto.controller.js";
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

router.delete('/:id',deleteProduct);

export default router;