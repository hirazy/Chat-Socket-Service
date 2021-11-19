const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const contentSchema = new Schema({
    ismy: Boolean,
    message: String,
    image: String,
    isImage: Boolean
}, { timestamps: true });


const receiverSchema = new Schema({
    _id: String,
    messages: [contentSchema]
});


const messageSchema = new Schema({
    _id: String,
    users: [receiverSchema]
});

const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model

// module.exports = mongoose.model('Message', messageSchema);