import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = "https://node-js-members-9iz5ktzhc-mohamed-saids-projects-5a702ee0.vercel.app/api/v1/members"

function App() {
  const [members, setMembers] = useState([])
  const [name, setName] = useState("")
  const [editId, setEditId] = useState(null)

  // READ
  const fetchMembers = () => {
    axios.get(API_URL)
      .then(res => setMembers(res.data.result))
  }

  useEffect(() => {
    fetchMembers()
  }, [])

  // CREATE
  const addMember = () => {
    if (!name) return

    axios.post(API_URL, { name })
      .then(() => {
        setName("")
        fetchMembers()
      })
  }

  // UPDATE
  const updateMember = () => {
    axios.put(`${API_URL}/${editId}`, { name })
      .then(() => {
        setEditId(null)
        setName("")
        fetchMembers()
      })
  }

  // DELETE
  const deleteMember = (id) => {
    axios.delete(`${API_URL}/${id}`)
      .then(() => fetchMembers())
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Members CRUD</h1>

      <input
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Member name"
      />

      {editId ? (
        <button onClick={updateMember}>Update</button>
      ) : (
        <button onClick={addMember}>Add</button>
      )}

      <ul>
        {members.map(m => (
          <li key={m.id}>
            {m.name}
            {" "}
            <button onClick={() => {
              setEditId(m.id)
              setName(m.name)
            }}>
              Edit
            </button>
            {" "}
            <button onClick={() => deleteMember(m.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default App