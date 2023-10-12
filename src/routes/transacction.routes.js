import { Router } from "express";
import { getTransactions , getTransaction, postTransaction, deleteTransaction} from "../controllers/index.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";


const router = Router();


router.get('/',getTransactions);
router.get('/:id',getTransaction);

router.post('/',[
    validarJWT,
    validarCampos
],postTransaction);

router.put('/:id',);

router.delete('/:id',[
    validarJWT,
    validarCampos
],deleteTransaction);

export default router;