const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const emotion = new Schema(
    {
        emotion: {
            type: Number,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        }
    },
    {
        timestamps: true
    }
);
const comment = new Schema(
    {
        comment: {
            type: String
        },
        image: {
            type: String
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        emotion: [emotion],
    },
    {
        timestamps: true,
    }
);
const active = new Schema(
    {
        comment: [comment],
        emotion: [emotion]
    },
    {
        timestamps: false
    }
);

comment.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.author.password;
    return(obj);
}
emotion.methods.toJSON = function(){
    var obj = this.toObject();
    delete obj.author.password;
    return(obj);
}
const activeData = mongoose.model("active", active);
module.exports = activeData;