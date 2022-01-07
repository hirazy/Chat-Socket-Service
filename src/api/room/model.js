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
    messages: [],
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
        let fields = ['users', 'messages']

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