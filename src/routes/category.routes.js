import { Router } from "express";
import {check,body,param} from 'express-validator';
import { getCategories,getCategory,postCategory,putCategory,deleteCategory } from "../controllers/category.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";

const router = Router();


router.get('/',getCategories);
router.get('/:id',getCategory);

router.post('/',[
    validarJWT,
    validarCampos
],postCategory);

router.put('/:id',putCategory);

router.delete('/:id',deleteCategory);

export default router;