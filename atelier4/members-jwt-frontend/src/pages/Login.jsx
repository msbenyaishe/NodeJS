import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Login() {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleLogin = async () => {
    if (!username || !password) {
      setError("All fields are required")
      return
    }

    try {
      const res = await API.post("/login", { username, password })
      localStorage.setItem("token", res.data.token)
      navigate("/members")
    } catch {
      setError("Invalid credentials")
    }
  }

  return (
    <div className="container">
      <div className="card">

        <header className="header">
          <h1>Login</h1>
          <p>Access your secure dashboard</p>
        </header>

        {error && <div className="error">{error}</div>}

        <div className="input-group" style={{ flexDirection: "column" }}>
          <input
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            className="btn btn-primary"
          >
            Login
          </button>
        </div>

      </div>
    </div>
  )
}

export default Login