const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const post = new Schema(
    {
        status: {
            type: String
        },
        image: {
            type: String
        },
        feeling: {
            type: Number
        },
        privacy: {
            type: Number,
            required: true,
            default: 1
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        active: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'active'
        },
        to: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user'
        },
        imageType: {
            type: Number,
            required: true,
            default: 0
        },
    },
    {
        timestamps: true
    }
);

post.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.author.password;
    return(obj);
}

const postData = mongoose.model("post", post);
module.exports = postData;