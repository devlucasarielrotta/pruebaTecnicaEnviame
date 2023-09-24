import { Router } from "express";
import { check } from 'express-validator';

import { authPost, } from "../controllers/auth.controller.js";
import { validarCampos } from '../middlewares/validar-campos.js';


const router = Router();

router.post('/',[
    validarCampos
],authPost);



export {
    router
}