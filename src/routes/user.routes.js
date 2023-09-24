import { Router } from "express";
import {check,body,param} from 'express-validator';
import { getUsers,getUser,deleteUser,postUser,putUser} from "../controllers/user.controller.js";
const router = Router();


router.get('/',getUsers);

router.get('/:id',getUser);

router.post('/',postUser);

router.put('/:id',putUser);

router.delete('/:id',deleteUser);

export default router;