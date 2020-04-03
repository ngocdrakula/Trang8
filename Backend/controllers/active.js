const activeData = require('../models/active');

function create(active){
    return(activeData.create(active));
}
function update(activeId, active){
    return(activeData.findByIdAndUpdate(activeId, active, {new: true}));
}
function updateOne(query, active, option){
    option.new = true;
    return(activeData.findOneAndUpdate(query, active, {new: true}));
}
function get(activeId){
    return(activeData.findById(activeId));
}
function find(query){
    return(activeData.findOne(query));
}
function remove(activeId){
    return(activeData.findByIdAndRemove(activeId));
}
function populate(active, path, load){
    return(activeData.populate(active, path, load));
}
module.exports = {
    create,
    get,
    update,
    updateOne,
    remove,
    find
}