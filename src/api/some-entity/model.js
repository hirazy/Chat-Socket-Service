import mongoose, { Schema } from 'mongoose'

const someEntitySchema = new Schema({}, { timestamps: true })

someEntitySchema.methods = {
  view (full) {
    const view = {
      // simple view
      id: this.id,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt
    }

    return full ? {
      ...view
      // add properties for a full view
    } : view
  }
}

const model = mongoose.model('SomeEntity', someEntitySchema)

export const schema = model.schema
export default model
