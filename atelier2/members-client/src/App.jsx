import { useEffect, useState } from "react"
import axios from "axios"
import "./App.css" // Import your new styles

const API_URL = "https://node-js-members.vercel.app/api/v1/members"

function App() {
  const [members, setMembers] = useState([])
  const [name, setName] = useState("")
  const [editId, setEditId] = useState(null)

  const fetchMembers = () => {
    axios.get(API_URL).then(res => setMembers(res.data.result || []))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  const handleSubmit = () => {
    if (!name.trim()) return
    const request = editId 
      ? axios.put(`${API_URL}/${editId}`, { name })
      : axios.post(API_URL, { name })

    request.then(() => {
      setName("")
      setEditId(null)
      fetchMembers()
    })
  }

  const deleteMember = (id) => {
    if(window.confirm("Delete this member?")) {
      axios.delete(`${API_URL}/${id}`).then(fetchMembers)
    }
  }

  return (
    <div className="container">
      <div className="card">
        <header className="header">
          <h1>Team Members</h1>
          <p>Directory of all registered users</p>
        </header>

        <div className="input-group">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Name..."
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          <button 
            onClick={handleSubmit} 
            className={`btn ${editId ? 'btn-success' : 'btn-primary'}`}
          >
            {editId ? "Update" : "Add"}
          </button>
        </div>

        <ul className="member-list">
          {members.map(m => (
            <li key={m.id} className="member-item">
              <div className="member-info">
                <div className="avatar">{m.name.charAt(0).toUpperCase()}</div>
                <span className="member-name">{m.name}</span>
              </div>
              <div className="actions">
                <button 
                  className="action-link edit" 
                  onClick={() => { setEditId(m.id); setName(m.name); }}
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