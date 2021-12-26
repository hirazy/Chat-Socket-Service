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
    messages: [],
    picture: {
        type: String,
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
            fields = [...fields, 'email', 'createdAt']
        }

        fields.forEach((field) => { view[field] = this[field] })
        return view
    }
}

const model = mongoose.model('Room', roomSchema)

export const schema = model.schema
export default model