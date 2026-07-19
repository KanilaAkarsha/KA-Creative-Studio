import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import Admin from './pages/Admin';
import Projects from './pages/Projects';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Loader from './components/common/Loader';
import CursorGlow from './components/common/CursorGlow';
import BackToTop from './components/common/BackToTop';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

const BARE_ROUTES = ['/login', '/register'];
const FOOTER_ROUTES = ['/', '/projects'];

function App() {
  const location = useLocation();
  const isBareRoute = BARE_ROUTES.includes(location.pathname);

  return (
    <>
      <Loader />
      <CursorGlow />
      {!isBareRoute && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/account"
          element={
            <ProtectedRoute role="customer">
              <Account />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <Admin />
            </ProtectedRoute>
          }
        />
      </Routes>
      {FOOTER_ROUTES.includes(location.pathname) && <Footer />}
      <BackToTop />
    </>
  );
}

export default App;
