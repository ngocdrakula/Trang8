const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const friend = new Schema(
    {
        friend: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'user'
        },
        friendship: Number
    },
    {
        timestamps: true,
        _id: false
    }
);
const user = new Schema(
    {
        email: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            required: true
        },
        username: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true,
        },
        active: Number,
        sex: Number,
        birthday: Date,
        country: String,
        live: String,
        avatar: {
            origin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'post'
            },
            position: {
                x: {
                    type: Number,
                    default: 0
                },
                y: {
                    type: Number,
                    default: 0
                }
            },
            size:{
                width: {
                    type: Number,
                    default: 200
                },
                height: {
                    type: Number,
                    default: 200
                }
            }
        },
        cover: {
            origin: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'post'
            },
            position: {
                x: {
                    type: Number,
                    default: 0
                },
                y: {
                    type: Number,
                    default: 0
                }
            },
            size:{
                width: {
                    type: Number,
                    default: 625
                },
                height: {
                    type: Number,
                    default: 250
                }
            }
        },
        featured: [{
            url: {
                type: String
            },
            position: {
                x: {
                    type: Number,
                    default: 0
                },
                y: {
                    type: Number,
                    default: 0
                }
            },
            size:{
                width: {
                    type: Number,
                    default: 200
                },
                height: {
                    type: Number,
                    default: 200
                }
            }
        }],
        relation: {
            friends: [friend],
            follows: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }],
            fans: [{
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user'
            }],
        },
        conversation: [
            {
                to: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'user'
                },
                conversation: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'conversation'
                }
            }]
    },
    {
        timestamps: true
    }
);
const userData = mongoose.model("user", user);
module.exports = userData;