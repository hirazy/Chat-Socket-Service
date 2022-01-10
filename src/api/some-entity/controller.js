import { success, notFound } from '../../services/response/'
import { SomeEntity } from '.'

export const create = ({ body }, res, next) =>
    SomeEntity.create(body)
    .then((someEntity) => someEntity.view(true))
    .then(success(res, 201))
    .catch(next)

export const index = ({ querymen: { query, select, cursor } }, res, next) =>
    SomeEntity.find(query, select, cursor)
    .then((someEntities) => someEntities.map((someEntity) => someEntity.view()))
    .then(success(res))
    .catch(next)

export const show = ({ params }, res, next) =>
    SomeEntity.findById(params.id)
    .then(notFound(res))
    .then((someEntity) => someEntity ? someEntity.view() : null)
    .then(success(res))
    .catch(next)

export const update = ({ body, params }, res, next) =>
    SomeEntity.findById(params.id)
    .then(notFound(res))
    .then((someEntity) => someEntity ? Object.assign(someEntity, body).save() : null)
    .then((someEntity) => someEntity ? someEntity.view(true) : null)
    .then(success(res))
    .catch(next)

export const destroy = ({ params }, res, next) =>
    SomeEntity.findById(params.id)
    .then(notFound(res))
    .then((someEntity) => someEntity ? someEntity.remove() : null)
    .then(success(res, 204))
    .catch(next)