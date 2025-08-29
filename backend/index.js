import express from 'express';
const app = express();
import auth from './router/auth.js';
import connectDB from './connectmongodb.js';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
dotenv.config();
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }));
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use('/api/user',auth)
app.use('/api/user/auth',auth)

app.listen(process.env.PORT||3000, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
connectDB(process.env.MONGOURI).then(()=>{
    console.log("Connected to MongoDB");
}).catch((err)=>{
    console.log("Error connecting to MongoDB",err);
});
