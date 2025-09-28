import express from "express"
import { getItemcart,removeItemcart,addItemcart } from "../controllers/cartController.js";
import authMiddlewere from '../middleware/auth.js'
const cartRouter=express.Router();

cartRouter.post("/add",authMiddlewere,addItemcart);
cartRouter.post("/remove",authMiddlewere,removeItemcart);
cartRouter.post("/get",authMiddlewere,getItemcart);

export default cartRouter;

