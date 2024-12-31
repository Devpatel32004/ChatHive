import MessageModel from "../models/messageModel.js";
import UserModel from "../models/userModel.js";
import cloudinary from "../lib/cloudinary.js"
import { getReciverSocketId, io } from "../lib/socket.js";


export const getUsersForSidebar = async (req, res, next) => {
    try {
        const loggedInUserId = req.user._id;
        const filtereduser = await UserModel.find({ _id: { $ne: loggedInUserId } }).select("-password");

        res.status(200).json(filtereduser);
    } catch (error) {
        console.log("getUsersForSidebar error is ", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export const getMessage = async (req, res, next) => {
    try {
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await MessageModel.find({
            $or: [{ senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId }
            ]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.log("getMessage error is ", error);
        res.status(500).json({ message: "internal server error" });
    }
}

export const sendMessage = async (req, res, next) => {
    try {
        const { text, image } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user._id;

        let imageUrl
        if (image) {
            // Validate base64 format
            if (!/^data:image\/[a-z]+;base64,/.test(image)) {
                return res.status(400).json({ message: "Invalid image format" });
            }

            // Validate image size
            const maxSizeInMB = 10;
            const base64SizeInBytes = Buffer.from(image.split(',')[1], 'base64').length;
            const base64SizeInMB = base64SizeInBytes / (1024 * 1024);

            if (base64SizeInMB > maxSizeInMB) {
                return res.status(400).json({ message: "Image size exceeds the limit" });
            }

            // Upload image to Cloudinary
            try {
                const uploadResponse = await cloudinary.uploader.upload(image);
                imageUrl = uploadResponse.secure_url;
            } catch (uploadError) {
                console.error("Cloudinary upload error:", uploadError);
                return res.status(500).json({ message: "Error uploading image to Cloudinary" });
            }
        }

        const newMessage = new MessageModel({
            senderId,
            receiverId,
            text,
            image: imageUrl,
        });

        await newMessage.save();
        res.status(201).json(newMessage);

        const receiverSocketId = getReciverSocketId(receiverId);
        if(receiverSocketId) {
            io.to(receiverSocketId).emit("newMessage",newMessage)
        }

    } catch (error) {
        console.error("sendMessage error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// export const sendMessage = async (req, res, next) => {
//     try {
//         const { text, image } = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;

//         let imageUrl
//         if (image) {
//             // Validate base64 format
//             if (!/^data:image\/[a-z]+;base64,/.test(image)) {
//                 return res.status(400).json({ message: "Invalid image format" });
//             }

//             // Validate image size
//             const maxSizeInMB = 10;
//             const base64SizeInBytes = Buffer.from(image.split(',')[1], 'base64').length;
//             const base64SizeInMB = base64SizeInBytes / (1024 * 1024);

//             if (base64SizeInMB > maxSizeInMB) {
//                 return res.status(400).json({ message: "Image size exceeds the limit" });
//             }

//             // Upload image to Cloudinary
//             try {
//                 const uploadResponse = await cloudinary.uploader.upload(image);
//                 imageUrl = uploadResponse.secure_url;
//             } catch (uploadError) {
//                 console.error("Cloudinary upload error:", uploadError);
//                 return res.status(500).json({ message: "Error uploading image to Cloudinary" });
//             }
//         }

//         const newMessage = new MessageModel({
//             senderId,
//             receiverId,
//             text,
//             image: imageUrl,
//         });

//         await newMessage.save();
//         res.status(201).json(newMessage);

//     } catch (error) {
//         console.error("sendMessage error:", error);
//         res.status(500).json({ message: "Internal server error" });
//     }
// }

// export const sendMessage = async (req, res, next) => {
//     try {
//         const {text, image} = req.body;
//         const { id: receiverId } = req.params;
//         const senderId = req.user._id;
  
//         let imageUrl;
//         if(image) {
//            const uploadResponce = await cloudinary.uploader.upload(image);
//            imageUrl = uploadResponce.secure_url;
//         }

//         const newMessage = new MessageModel({
//             senderId,
//             receiverId,
//             text,
//             image: imageUrl,
//         })

//         await newMessage.save();
//         res.status(201).json(newMessage);
//     } catch (error) {
//         console.log("sendMessage error is ", error);
//         res.status(500).json({ message: "internal server error" });
//     }
// }

