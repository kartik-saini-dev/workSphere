import mongoose from "mongoose";


const ordersSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service', // Assuming 'service' is the name of the referenced model
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the name of the referenced model
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming 'User' is the name of the referenced model
    },
    price: {
        type: Number, // You can adjust the data type as needed
    },
    checkoutSessionId:{
        type: String,
        unique:true,
    },
 

    isCompleted: {
        type: Boolean,
        default: false,
    },


}, { timestamps: true });

const Orders = mongoose.models.Orders || mongoose.model('Orders', ordersSchema);

export default Orders;
