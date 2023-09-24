import { Router } from "express";
import {check,body,param} from 'express-validator';
import { getTransactions , getTransaction, postTransaction, deleteTransaction} from "../controllers/transacction.controller.js";

const router = Router();


router.get('/',getTransactions);
router.get('/:id',getTransaction);

router.post('/',postTransaction);

router.put('/:id',);

router.delete('/:id',deleteTransaction);

export default router;