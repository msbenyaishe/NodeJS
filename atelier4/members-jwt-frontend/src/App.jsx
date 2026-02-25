import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from "./pages/Login"
import Members from "./pages/Members"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/members" element={<Members />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App