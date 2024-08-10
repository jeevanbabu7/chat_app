import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";

export const sendMessage = async (req, res) => {
    try {
        const {message} = req.body;
        const {id: receiverId} = req.params;
        const senderId = req.user.id;
        
        let conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        });

        if(!conversation) {
            let newConversation = await Conversation.create({
                participants: [senderId, receiverId],
                messages: []
            });
            await newConversation.save();
        } 

        const newMessage = new Message({
            senderId,
            receiverId,
            message
        });

        await newMessage.save();
        await conversation.messages.push(newMessage);
        await conversation.save();
      
        
        res.status(200).json({ message: "Message sent successfully", newMessage });

    } catch (error) {
        res.status(500).json({ message: "Error sending message" });
    }
}
export const getMessage = async (req, res) => {
    try {
        const { id: receiverId } = req.params;
        const senderId = req.user.id;

        // Find the conversation and populate messages
        const conversation = await Conversation.findOne({
            participants: {
                $all: [senderId, receiverId]
            }
        }).populate("messages");

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Send the messages in the response
        res.status(200).json({ messages: conversation.messages });

    } catch (err) {
        res.status(500).json({ message: "Error fetching messages" });
    }
}