
import './App.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AdminPanel from './component/AdminPanel';
import NotificationBell from './component/NotificationBell';
import UseReducer from './component/UseReducer';
function App() {

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={<NotificationBell /> } />
          <Route path='/use-reducer' element={<UseReducer/>} />
          <Route path='/admin' element={<AdminPanel />} />
        </Routes>

      </Router>
    </div>
  )
}

export default App
