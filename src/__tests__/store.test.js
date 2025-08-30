import useStore from '../store/useStore.js'

describe('store', () => {
  it('adds a product', () => {
    const add = useStore.getState().addProduct
    const len = useStore.getState().products.length
    add({ id: 'x', name: 'X', topic: 'x', owner: 'o', description: 'd', tags: [], schema: {}, messagesPerSec: 1 })
    expect(useStore.getState().products.length).toBe(len + 1)
  })
})
