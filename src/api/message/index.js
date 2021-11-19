import { Router } from 'express'
import { middleware as query } from 'querymen'
import { create, index, show, update, destroy } from './controller'
import SomeEntity, { schema } from './model'

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
    update)

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