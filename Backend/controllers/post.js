const postData = require('../models/post');

function create(post){
    return(postData.create(post));
}
function update(postId, post){
    return(postData.findByIdAndUpdate(postId, post, {new: true}));
}
function updateOne(query, post){
    return(postData.findOneAndUpdate(query, post, {new: true}));
}
function get(postId){
    return(postData.findById(postId));
}
function remove(postId){
    return(postData.findByIdAndRemove(postId));
}
function getlist(query){
    return(postData.find(query));
}
module.exports = {
    create,
    get,
    getlist,
    update,
    updateOne,
    remove
}