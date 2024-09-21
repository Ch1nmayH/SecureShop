import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    userRef: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Assuming you have a User model
        required: true
    },
    products: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product', // Assuming you have a Product model
                required: true
            },
            productName: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true
            },
            price: {
                type: Number,
                required: true
            }
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    transactionHash: {
        type: String,
        required: false // This will be optional for failed transactions
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'success', 'failed'], // Define order statuses
        default: 'pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const PaymentHashModel = mongoose.model('Transaction', transactionSchema);

export default PaymentHashModel;
