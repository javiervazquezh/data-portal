import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from '../App.jsx'

describe('App', () => {
  it('renders header', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
  expect(screen.getByText(/Data Portal/i)).toBeInTheDocument()
  })
})
