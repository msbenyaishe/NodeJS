import { useEffect, useState } from "react"
import axios from "axios"
import "./App.css"

const API_URL = "https://node-js-members.vercel.app/api/v1/members"

function App() {
  const [members, setMembers] = useState([])
  const [name, setName] = useState("")
  const [editId, setEditId] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")

  /* ================= FETCH ================= */

  const fetchMembers = async () => {
    try {
      const res = await axios.get(API_URL)
      setMembers(res.data.result || [])
    } catch (err) {
      setErrorMsg("Failed to load members")
    }
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  /* ================= CREATE / UPDATE ================= */

  const handleSubmit = async () => {
    if (!name.trim()) {
      setErrorMsg("Name is required")
      return
    }

    try {
      const res = editId
        ? await axios.put(`${API_URL}/${editId}`, { name })
        : await axios.post(API_URL, { name })

      if (res.data.status === "error") {
        setErrorMsg(res.data.message)
        return
      }

      setName("")
      setEditId(null)
      setErrorMsg("")
      fetchMembers()

    } catch (err) {
      setErrorMsg("Server error")
    }
  }

  /* ================= DELETE ================= */

  const deleteMember = async (id) => {
    if (!window.confirm("Delete this member?")) return

    try {
      const res = await axios.delete(`${API_URL}/${id}`)

      if (res.data.status === "error") {
        setErrorMsg(res.data.message)
        return
      }

      fetchMembers()
    } catch (err) {
      setErrorMsg("Delete failed")
    }
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
                    setErrorMsg("")
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

      </div>
    </div>
  )
}

export default App