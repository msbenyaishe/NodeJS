import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Members() {
  const [members, setMembers] = useState([])
  const [name, setName] = useState("")
  const [editId, setEditId] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const navigate = useNavigate()

  const fetchMembers = async () => {
    try {
      const res = await API.get("/members")
      setMembers(res.data.result || [])
    } catch {
      navigate("/")
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg("Name is required")
      return
    }

    try {
      if (editId) {
        await API.put(`/members/${editId}`, { name })
      } else {
        await API.post("/members", {
          name,
          email: "test@mail.com"
        })
      }

      setName("")
      setEditId(null)
      setErrorMsg("")
      fetchMembers()
    } catch {
      setErrorMsg("Server error")
    }
  }

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return
    await API.delete(`/members/${id}`)
    fetchMembers()
  }

  const logout = () => {
    localStorage.removeItem("token")
    navigate("/")
  }

  return (
    <div className="container">
      <div className="card">

        <header className="header">
          <h1>Team Members</h1>
          <p>Directory of all registered users</p>
        </header>

        {errorMsg && <div className="error">{errorMsg}</div>}

        <div className="input-group">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name..."
            onKeyDown={e => e.key === "Enter" && handleSubmit()}
          />

          <button
            onClick={handleSubmit}
            className={`btn ${editId ? "btn-success" : "btn-primary"}`}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <ul className="member-list">
          {members.map(m => (
            <li key={m.id} className="member-item">
              <div className="member-info">
                <div className="avatar">
                  {m.name.charAt(0).toUpperCase()}
                </div>
                <span className="member-name">{m.name}</span>
              </div>

              <div className="actions">
                <button
                  className="action-link edit"
                  onClick={() => {
                    setEditId(m.id)
                    setName(m.name)
                  }}
                >
                  Edit
                </button>

                <button
                  className="action-link delete"
                  onClick={() => deleteMember(m.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>

        <br />
        <button
          onClick={logout}
          className="btn btn-primary"
          style={{ width: "100%" }}
        >
          Logout
        </button>

      </div>
    </div>
  )
}

export default Members