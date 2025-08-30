import '@testing-library/jest-dom'
import { expect } from 'vitest'
import * as matchers from '@testing-library/jest-dom/matchers'

expect.extend(matchers)

// Polyfill ResizeObserver for jsdom (used by recharts' ResponsiveContainer)
if (typeof global.ResizeObserver === 'undefined') {
	class ResizeObserver {
		constructor(cb) { this.cb = cb }
		observe() {}
		unobserve() {}
		disconnect() {}
	}
	// eslint-disable-next-line no-undef
	global.ResizeObserver = ResizeObserver
}
