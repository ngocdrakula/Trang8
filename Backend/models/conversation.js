const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const message = new Schema(
    {
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        message: String,
        image: String
    },
    {
        timestamps: true
    }
);
// typeof status{
//     0: other unread;
//     1: other seen;
//     2: deleted by user;
//     3: deleted by other;
// }
const conversation = new Schema(
    {
        leader: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'user'
            },
            seen: Date,
        },
        member: {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                required: true,
                ref: 'user'
            },
            seen: Date,
        },
        message: [message]
    },
    {
        timestamps: true
    }
);
message.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.author.password;
    return(obj);
}
conversation.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.leader.password;
    delete obj.member.password;
    return(obj);
}

const conversationData = mongoose.model("conversation", conversation);
module.exports = conversationData;