import { create } from 'zustand'
import { initialProducts } from '../utils/mocks.js'

const useStore = create((set, get) => ({
  products: initialProducts(),
  applications: [],
  // Subscription graph edges: from (app|product) -> to (product)
  subscriptions: [],
  subscribeToProduct: (product) => {
    // Simulated subscription: bump its throughput randomly
    set({
      products: get().products.map((p) => (p.id === product.id ? { ...p, messagesPerSec: p.messagesPerSec + 10 } : p)),
    })
  },
  // General subscription: from entity (app|product) subscribes to a product
  subscribe: ({ fromType, fromId, toProductId }) => {
  // Enforce: data products can only subscribe to other data products
  if (fromType === 'product' && !get().products.find((p) => p.id === fromId)) return
  if (!get().products.find((p) => p.id === toProductId)) return
    const edge = { from: { type: fromType, id: fromId }, to: { type: 'product', id: toProductId } }
    const exists = (get().subscriptions || []).some((e) => e.from.type === edge.from.type && e.from.id === edge.from.id && e.to.id === edge.to.id)
    if (!exists) set({ subscriptions: [...(get().subscriptions || []), edge] })
  },
  removeSubscription: ({ fromType, fromId, toProductId }) => {
    set({ subscriptions: (get().subscriptions || []).filter((e) => !(e.from.type === fromType && e.from.id === fromId && e.to.id === toProductId)) })
  },
  addProduct: (payload) => set({ products: [payload, ...get().products] }),
  deleteProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
  addApplication: (payload) => set({ applications: [payload, ...(get().applications || [])] }),
  updateApplication: (payload) => set({ applications: (get().applications || []).map((a) => a.id === payload.id ? { ...a, ...payload } : a) }),
}))

export default useStore
