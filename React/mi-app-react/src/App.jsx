import { AuthProvider } from './context/AuthContext'
import Login from './pages/Login/Login'
import './App.css'

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <Login />
      </div>
    </AuthProvider>
  )
}

export default App
