import { NavLink, Route, Routes } from 'react-router-dom'
import { FiGrid, FiPlusSquare, FiPackage, FiUser, FiSettings } from 'react-icons/fi'
import Products from './pages/Products.jsx'
import StreamProcessors from './pages/StreamProcessors.jsx'
import AddProduct from './pages/AddProduct.jsx'
import RegisterApplication from './pages/RegisterApplication.jsx'

export default function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="header-inner">
          <div className="logo">TD</div>
          <strong className="header-title">TDS Data Portal</strong>
          <nav className="nav">
            <NavLink to="/" end><FiGrid style={{ verticalAlign: '-2px' }} /> Products</NavLink>
            <NavLink to="/add"><FiPlusSquare style={{ verticalAlign: '-2px' }} /> Register Data Product</NavLink>
            <NavLink to="/register-app"><FiPackage style={{ verticalAlign: '-2px' }} /> Register Application</NavLink>
          </nav>
          <div className="spacer" />
          <div className="header-actions">
            <button className="icon-btn" aria-label="Settings">
              <FiSettings />
            </button>
            <button className="icon-btn" aria-label="Profile">
              <FiUser />
            </button>
          </div>
        </div>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<Products />} />
          <Route path="/processors" element={<StreamProcessors />} />
          <Route path="/add" element={<AddProduct />} />
          <Route path="/register-app" element={<RegisterApplication />} />
        </Routes>
      </main>
    </div>
  )
}
