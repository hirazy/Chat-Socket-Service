import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { SomeEntity } from '.'

const app = () => express(apiRoot, routes)

let someEntity

beforeEach(async () => {
  someEntity = await SomeEntity.create({})
})

test('POST /some-entities 201', async () => {
  const { status, body } = await request(app())
    .post(`${apiRoot}`)
  expect(status).toBe(201)
  expect(typeof body).toEqual('object')
})

test('GET /some-entities 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}`)
  expect(status).toBe(200)
  expect(Array.isArray(body)).toBe(true)
})

test('GET /some-entities/:id 200', async () => {
  const { status, body } = await request(app())
    .get(`${apiRoot}/${someEntity.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(someEntity.id)
})

test('GET /some-entities/:id 404', async () => {
  const { status } = await request(app())
    .get(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('PUT /some-entities/:id 200', async () => {
  const { status, body } = await request(app())
    .put(`${apiRoot}/${someEntity.id}`)
  expect(status).toBe(200)
  expect(typeof body).toEqual('object')
  expect(body.id).toEqual(someEntity.id)
})

test('PUT /some-entities/:id 404', async () => {
  const { status } = await request(app())
    .put(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})

test('DELETE /some-entities/:id 204', async () => {
  const { status } = await request(app())
    .delete(`${apiRoot}/${someEntity.id}`)
  expect(status).toBe(204)
})

test('DELETE /some-entities/:id 404', async () => {
  const { status } = await request(app())
    .delete(apiRoot + '/123456789098765432123456')
  expect(status).toBe(404)
})
