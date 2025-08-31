import { create } from 'zustand'
import { initialProducts } from '../utils/mocks.js'

const useStore = create((set, get) => ({
  products: initialProducts(),
  applications: [],
  subscribeToProduct: (product) => {
    // Simulated subscription: bump its throughput randomly
    set({
      products: get().products.map((p) => (p.id === product.id ? { ...p, messagesPerSec: p.messagesPerSec + 10 } : p)),
    })
  },
  addProduct: (payload) => set({ products: [payload, ...get().products] }),
  deleteProduct: (id) => set({ products: get().products.filter((p) => p.id !== id) }),
  addApplication: (payload) => set({ applications: [payload, ...(get().applications || [])] }),
}))

export default useStore
