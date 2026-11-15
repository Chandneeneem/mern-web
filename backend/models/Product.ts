import mongoose, { Schema, Document } from 'mongoose';

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: string;
    image: string;
}

const productSchema = new Schema<IProduct>({
    name:{
        type:String,
        required:true,
        trim:true
    },
    description:{
        type:String,
        required:true,
        trim:true
    },
    price:{
        type:Number,
        required:true,
        min:0
    },
    category:{
        type:String,
        required:true,
        trim:true
    },
    // image:{
    //     type:String,
    //     required:false,
    //     trim:true
    // }
    image: {
            type: String,
            default: ''
        },
        

},
 { timestamps: true }
)

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;