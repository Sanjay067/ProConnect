import mongoose from "mongoose";


const postSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true, 
    },
    body:{
        type: String,
        required: true
    },
    likes:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    createdAt:{
        type: Date,
        default: Date.now   
    },
    updatedAt:{
        type: Date,
        default: Date.now   
    },
    media:{
        type: String,
        default: ''
    },
    fileType:{
        type: String,
        default: ''
    },
    active:{
        type: Boolean,
        default: true,
    }
})

const Post = mongoose.model('Post', postSchema);

export default Post;