import express from "express"
import cors from 'cors'
import 'dotenv/config'
import connectDB from "./configs/mongodb.js"
import {clerkWebHooks, stripeWebhooks} from './controllers/webhooks.js'
import educatorRouter from './routes/educatorRoutes.js'
import { clerkMiddleware } from "@clerk/express"
import connectCloudinary from "./configs/cloudinary.js"
import courseRoutes from './routes/courseRoutes.js';
import userRouter from './routes/userRoutes.js';
//initialize express
const app = express()


//connect to database
await connectDB()
await connectCloudinary()

//Middlewares
app.use(cors({
  origin: "*"
}));
app.use(express.json()); 
app.use(clerkMiddleware())


//Routes
app.get('/' , (req, res) => res.send("Api Working"))
app.post('/clerk' , express.json() , clerkWebHooks)
app.use('/api/educator',express.json() , educatorRouter)
app.use('/api/course' , express.json() , courseRoutes)
app.use('/api/user', express.json(), userRouter)
app.post('/stripe' , express.raw({type: 'application/json'}) , stripeWebhooks)
   
//Port
const PORT = process.env.PORT || 5000

app.listen(PORT , () => {
    console.log(`server is running on Port ${PORT}`)
})
