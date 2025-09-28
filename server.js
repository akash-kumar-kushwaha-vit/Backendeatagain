import express from "express";
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRouter from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRouter.js";
import "dotenv/config"


import path from 'path';
import { fileURLToPath } from 'url';
import orderRouter from "./routes/orderRoute.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);



// app config 
const app =express();
const port=4000;


// middlewere
app.use(express.json());
app.use(cors());

//db connection 
connectDB();


// app endpoint
app.use("/api/food",foodRouter);
app.use('/images',express.static(path.join(__dirname, 'uploads')));
app.use("/api/user",userRouter);
app.use("/api/cart",cartRouter);
app.use('/api/order',orderRouter);

app.get('/',(req,res)=>{
    res.send("api working");
})


app.listen(port,()=>{
    console.log(`srver runing on port ${port}`);
})