const conversationData = require('../models/conversation');

function create(conversation){
    return(conversationData.create(conversation));
}
function update(conversationId, conversation){
    return(conversationData.findByIdAndUpdate(conversationId, conversation, {new: true}));
}
function updateOne(query, conversation){
    return(conversationData.findOneAndUpdate(query, conversation, {new: true}));
}
function get(conversationId){
    return(conversationData.findById(conversationId));
}
function remove(conversationId){
    return(conversationData.findByIdAndRemove(conversationId));
}
function getlist(query){
    return(conversationData.find(query));
}
module.exports = {
    create,
    get,
    getlist,
    update,
    updateOne,
    remove
}