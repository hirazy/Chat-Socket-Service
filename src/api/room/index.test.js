import request from 'supertest'
import { apiRoot } from '../../config'
import express from '../../services/express'
import routes, { Room } from '.'

const app = () => express(apiRoot, routes)

let room

beforeEach(async() => {
    room = await Room.create({})
})

test('POST /rooms 201', async() => {
    const { status, body } = await request(app())
        .post(`${apiRoot}`)
    expect(status).toBe(201)
    expect(typeof body).toEqual('object')
})

test('GET /rooms 200', async() => {
    const { status, body } = await request(app())
        .get(`${apiRoot}`)
    expect(status).toBe(200)
    expect(Array.isArray(body)).toBe(true)
})

test('GET /rooms/:id 200', async() => {
    const { status, body } = await request(app())
        .get(`${apiRoot}/${room.id}`)
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
    expect(body.id).toEqual(room.id)
})

test('GET /rooms/:id 404', async() => {
    const { status } = await request(app())
        .get(apiRoot + '/123456789098765432123456')
    expect(status).toBe(404)
})

test('PUT /rooms/:id 200', async() => {
    const { status, body } = await request(app())
        .put(`${apiRoot}/${room.id}`)
    expect(status).toBe(200)
    expect(typeof body).toEqual('object')
    expect(body.id).toEqual(room.id)
})

test('PUT /rooms/:id 404', async() => {
    const { status } = await request(app())
        .put(apiRoot + '/123456789098765432123456')
    expect(status).toBe(404)
})

test('DELETE /rooms/:id 204', async() => {
    const { status } = await request(app())
        .delete(`${apiRoot}/${room.id}`)
    expect(status).toBe(204)
})

test('DELETE /rooms/:id 404', async() => {
    const { status } = await request(app())
        .delete(apiRoot + '/123456789098765432123456')
    expect(status).toBe(404)
})