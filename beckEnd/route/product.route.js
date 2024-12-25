import express from "express";
const router=express();
import { creatProducts, deleteProduct, getProducts, updateProduct } from "../controller/product.controller.js";



    router.post('/',creatProducts)
    router.put('/:id',updateProduct)
    router.get('/',getProducts)
    router.delete('/:id',deleteProduct)

export default router