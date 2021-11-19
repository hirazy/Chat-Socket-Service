import { SomeEntity } from '.'

let someEntity

beforeEach(async () => {
  someEntity = await SomeEntity.create({})
})

describe('view', () => {
  it('returns simple view', () => {
    const view = someEntity.view()
    expect(typeof view).toBe('object')
    expect(view.id).toBe(someEntity.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })

  it('returns full view', () => {
    const view = someEntity.view(true)
    expect(typeof view).toBe('object')
    expect(view.id).toBe(someEntity.id)
    expect(view.createdAt).toBeTruthy()
    expect(view.updatedAt).toBeTruthy()
  })
})
