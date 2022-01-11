import { Router } from 'express'
import { middleware as query } from 'querymen'
import { middleware as body } from 'bodymen'
import { create, index, show, add_message, update, destroy } from './controller'
import { password, master } from '../../services/passport'
import Room, { schema } from './model'

const { name, users, messages, picture } = schema.tree
const { content, senderID, isImage } = schema.tree
const router = new Router()

/**
 * @api {post} /some-entities Create some entity
 * @apiName CreateSomeEntity
 * @apiGroup SomeEntity
 * @apiSuccess {Object} someEntity Some entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Some entity not found.
 */
router.post('/',
    master(),
    body({ name, users, messages, picture }),
    create)

/**
 * @api {get} /some-entities Retrieve some entities
 * @apiName RetrieveSomeEntities
 * @apiGroup SomeEntity
 * @apiUse listParams
 * @apiSuccess {Object[]} someEntities List of some entities.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 */
router.get('/',
    master(),
    query(),
    index)

/**
 * @api {get} /some-entities/:id Retrieve some entity
 * @apiName RetrieveSomeEntity
 * @apiGroup SomeEntity
 * @apiSuccess {Object} someEntity Some entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Some entity not found.
 */
router.get('/:id',
    master(),
    show)

/**
 * @api {put} /some-entities/:id Update some entity
 * @apiName UpdateSomeEntity
 * @apiGroup SomeEntity
 * @apiSuccess {Object} someEntity Some entity's data.
 * @apiError {Object} 400 Some parameters may contain invalid values.
 * @apiError 404 Some entity not found.
 */
router.put('/:id',
    master(),
    body({ content, senderID, isImage }),
    add_message)

/**
 * @api {delete} /some-entities/:id Delete some entity
 * @apiName DeleteSomeEntity
 * @apiGroup SomeEntity
 * @apiSuccess (Success 204) 204 No Content.
 * @apiError 404 Some entity not found.
 */
router.delete('/:id',
    destroy)

export default router