const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content:{
        type: String,
        required: true
    },
    sender:{
        type: String,
        required: true
    },
    receiver:{
        type: String,
        required: true
    },
    isImage: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });


const model = mongoose.model('Message', messageSchema)

export const schema = model.schema
export default model

// module.exports = mongoose.model('Message', messageSchema);