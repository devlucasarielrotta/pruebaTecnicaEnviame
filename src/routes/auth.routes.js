import { Router } from "express";
import { authPost } from "../controllers/index.controller.js";
import { validarCampos } from '../middlewares/validar-campos.js';


const router = Router();

router.post('/',[
    validarCampos
],authPost);



export default router