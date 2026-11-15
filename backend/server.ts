import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import cors from 'cors';
import path from 'path';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';

dotenv.config();
// connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
 res.status(200).json({
    success : true,
    message: "Mern Stack Api is running"
 })
})

app.use('/api/auth', authRoutes);
app.use('/api/products',  productRoutes);

// file upload route
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

const PORT = process.env.PORT || 5000;

const startServer = async ()=>{
try{
    await connectDB();
    // app.listen((port)=>{
    //     console.log(`server run ${PORT}`);
    // })
      app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });

}catch(err){
    console.log("server error", err);
    process.exit(1);
}
}

startServer();