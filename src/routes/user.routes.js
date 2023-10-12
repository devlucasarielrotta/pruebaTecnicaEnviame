import { Router } from "express";
import { getUsers,getUser,deleteUser,postUser,putUser} from "../controllers/index.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarCampos } from "../middlewares/validar-campos.js";


const router = Router();


router.get('/',getUsers);

router.get('/:id',getUser);

router.post('/',[
    validarJWT,
    validarCampos
],postUser);

router.put('/:id',putUser);

router.delete('/:id',[
    validarJWT,
    validarCampos
],deleteUser);

export default router;