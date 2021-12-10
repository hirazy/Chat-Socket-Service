import { Room } from '.'

let room

beforeEach(async () => {
  room = await Room.create({})
})

describe('view', () => {
  it('returns simple view', () => {
    const view = room.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(room.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = room.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(room.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
