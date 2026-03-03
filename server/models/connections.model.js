import mongoose from "mongoose";

const connectionSchema =  mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    status: {
        type: Boolean,
        default: null
    }
})

const Connection = mongoose.model('Connection', connectionSchema);

export default Connection;