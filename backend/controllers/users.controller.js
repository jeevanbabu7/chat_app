import Conversation from "../models/conversation.model.js";
import User from "../models/user.model.js";

export const getUsersForSidebar = async (req, res) => {
    try {
        const conversations = await Conversation.find({
            participants: { $in: [req.user._id] }
        })
            .populate('participants')
            .select('participants')
            .exec();

        // Filter out the current user from the participants list
        const users = conversations.map(conversation => {
            return conversation.participants.filter(user => user._id.toString() !== req.user._id.toString());
        }).flat();
        
        // removing password field
        const filteredUsers = users.map(user => {
            const {password, ...rest} = user.toObject();
            return rest;
        });
        
        res.json(filteredUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
}
