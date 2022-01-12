import mongoose, { Schema } from 'mongoose'

const roomSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    users: [{
        user: {
            type: Schema.ObjectId,
            ref: "User"
        }
    }],
    /**
     * senderID: Id of user
     * content: String of message or link to Image
     * isImage: Boolean
     * createdAt: String of time    
     */
    messages: [{
        "content": {
            "description": "Content of messsage",
            type: String
        },
        "senderID": {
            "description": "ID of user who send message",
            type: String
        },
        "isImage": {
            "description": "check is image or text message",
            type: Boolean
        }
    }],
    picture: {
        type: String,
        trim: true
    },
    recentMessage: {
        type: String,
        default: "",
        trim: true
    }
}, { timestamps: true })

roomSchema.methods = {
    view(full) {
        const view = {
                // // simple view
                // id: this.id,
                // createdAt: this.createdAt,
                // updatedAt: this.updatedAt
            }
            // ...view
            // add properties for a full view
        let fields = ['name', 'users', 'messages', 'picture']

        if (full) {
            fields = [...fields, 'name', 'picture', 'recentMessage']
        }

        fields.forEach((field) => { view[field] = this[field] })
        return view
    }
}

const model = mongoose.model('Room', roomSchema)

export const schema = model.schema
export default model