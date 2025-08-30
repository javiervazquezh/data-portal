import { NavLink, Route, Routes } from 'react-router-dom'
import Products from './pages/Products.jsx'
import StreamProcessors from './pages/StreamProcessors.jsx'
import Lineage from './pages/Lineage.jsx'
import AddProduct from './pages/AddProduct.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">TD</div>
          <strong>Capital Markets Data Portal</strong>
          <nav className="nav">
            <NavLink to="/" end>Products</NavLink>
            <NavLink to="/processors">Processors</NavLink>
            <NavLink to="/lineage">Lineage</NavLink>
            <NavLink to="/add">Add Product</NavLink>
          </nav>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/processors" element={<StreamProcessors />} />
          <Route path="/lineage" element={<Lineage />} />
          <Route path="/add" element={<AddProduct />} />
        </Routes>
      </main>
    </div>
  )
}
