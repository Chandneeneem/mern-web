import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from 'jsonwebtoken';
import User from '../models/User';

export const register = async(req:Request, res:Response)=>{


    try{
        const {name, email, password} = req.body;

        if(!name ||!email||!password){
            return res.status(400).json({
                message: "all filed required."
            })
        }
        const existing = await User.findOne({email});
        if(existing){
            return res.status(409).json({
                message : "Email already exist."
            })
        }

        const hashPass = await bcrypt.hash(password,10);

        const user = await User.create({
            name,email,
            password: hashPass
        })

        return res.status(201).json({
            success: true,
            message:"User register",
            user:{
                id:user._id,
                name:user.name,
                email:user.email
            }
        })
    }catch(err){
        return res.status(500).json({
            message:"register fail"
        })
    }
}


export const login = async(req:Request, res:Response)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message:"all filed are required."
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message:"Invalid email or password"
            })
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }
        const secret = process.env.JWT_SECRET;

if (!secret) {
    throw new Error('JWT_SECRET is missing in .env');
}

const token = jwt.sign(
    { userId: user._id.toString() },
    secret,
    { expiresIn: '1d' }
);

        // const token = jwt.sign(
        //     {userID : user.id.toString()},
        //     process.env.JWT_SECRET as string,
        //     {expiresIN: '1h'}
        // )

        return res.status(200).json({
            success: true,
            message: "Login successful",
            token  ,
            user:{
                id: user._id,
                name: user.name,
                email:user.email
            }
        })

    } catch (error) {
        return res.status(500).json({
            message:"Login failed"
        })
    }
}