import { success, notFound } from '../../services/response/'
import Room, { schema } from './model'
const ObjectId = require('mongodb').ObjectID

export const create = ({ body }, res, next) =>
    Room.create(body)
    .then((room) => room.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
    Room.find(query, select, cursor)
    .then((someEntities) => someEntities.map((room) => room.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
    Room.findById(params.id)
    .then(notFound(res))
    .then((room) => room ? room.view() : null)
    .then(success(res))
    .catch(next)

export const add_message = ({ body, params }, res, next) =>
    Room.updateOne({ _id: ObjectId(params.id) }, {
        $push: {
            messages: body
        }
    })
    .then(notFound(res))
    .then(success(res))
    .catch(next)

export const update = ({ body, params }, res, next) =>
    Room.findById(params.id)
    .then(notFound(res))
    .then((room) => room ? Object.assign(room, body).save() : null)
    .then((room) => room ? room.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
    Room.findById(params.id)
    .then(notFound(res))
    .then((room) => room ? room.remove() : null)
    .then(success(res, 204))
    .catch(next)