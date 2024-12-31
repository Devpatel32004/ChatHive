import mongoose from "mongoose"

const userSchema = new mongoose.Schema( {
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        ref: "User"
    },
    text: {
        type: String
    },
    image: {
        type: String
    }
}, {timestamps: true} )

const MessageModel = mongoose.model("Message", userSchema );

export default MessageModel