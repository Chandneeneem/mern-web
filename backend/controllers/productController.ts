import {Request, Response} from 'express';
import Product from '../models/Product';
import mongoose from 'mongoose';

export const createProduct  = async(req:Request, res:Response)=>{
    try{
        const{name, description,price,category}= req.body;
        if(!name || !description || !price || !category){
            return res.status(400).json({
                message:"All fields are required."
            })
        }

        const product = await Product.create({
            name, description, price, category,
            image: req.file ? `/uploads/${req.file.filename}` : ''
        })
        res.status(201).json({
            success:true,
            message:"Product created successfully",
            data: product
        })

    }catch(err){
        res.status(500).json({
            success:false,
            message:"Error creating product"
        })
    }
}

//get 

export const getProducts = async(req:Request, res:Response)=>{
    try{
     const page = parseInt(req.query.page as string) || 1;
     const limit = parseInt(req.query.limit as string) || 10;
     const skip = (page - 1) * limit;

     const search = String(req.query.search || '').trim();
    const category = String(req.query.category || '').trim();

   const filter: Record<string, any> = {};
   if (search) {
    filter.name = { $regex: search, $options: 'i' };
  }
  if (category) {
    filter.category = category;
  }

  const[products,total] = await Promise.all([
    Product.find(filter).skip(skip).limit(limit),
    Product.countDocuments(filter)
  ]);

  return res.status(200).json({
    success: true,
    data: products,
    total,
    page,
    totalPages: Math.ceil(total / limit)
  })


    }
    catch(err){
        res.status(500).json({
            success:false,
            message:"Error fetching products"
        })
    }

}


// UPDATE PRODUCT USING BODY ID
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id, name, description, price, category, stock } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid product ID is required'
            });
        }

        const updates: Record<string, unknown> = {};

        if (name !== undefined) updates.name = name;
        if (description !== undefined) updates.description = description;
        if (price !== undefined) updates.price = price;
        if (category !== undefined) updates.category = category;
        if (stock !== undefined) updates.stock = stock;

        if (req.file) {
            updates.image = `/uploads/${req.file.filename}`;
        }

        const product = await Product.findByIdAndUpdate(
            id,
            updates,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product updated successfully',
            data: product
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Product update failed'
        });
    }
};


// DELETE PRODUCT USING BODY ID
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.body;

        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: 'Valid product ID is required'
            });
        }

        const product = await Product.findByIdAndDelete(id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Product deleted successfully'
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: 'Product deletion failed'
        });
    }
};