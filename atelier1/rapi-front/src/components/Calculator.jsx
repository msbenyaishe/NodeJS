import { useState } from "react";
import axios from "axios";

const API_BASE = "https://node-js-one-plum.vercel.app";

export default function Calculator() {
  const [n1, setN1] = useState("");
  const [n2, setN2] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const calculate = async (type) => {
    setError("");
    setResult("");
    setLoading(true);

    try {
      const res = await axios.post(
        `${API_BASE}/api/v1/calculs/${type}`,
        { n1, n2 }
      );
      setResult(res.data.result);
    } catch {
      setError("Unable to process request.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-container">
      <div className="calculator-card">
        <div className="card-header">
          <h2>Calculator API</h2>
          <span>Connected to Node.js Backend</span>
        </div>

        <div className="input-group">
          <label>First Number</label>
          <input
            type="number"
            value={n1}
            onChange={(e) => setN1(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Second Number</label>
          <input
            type="number"
            value={n2}
            onChange={(e) => setN2(e.target.value)}
          />
        </div>

        <div className="button-group">
          <button onClick={() => calculate("somme")} disabled={loading}>
            {loading ? "Processing..." : "Sum"}
          </button>

          <button
            className="secondary"
            onClick={() => calculate("produit")}
            disabled={loading}
          >
            {loading ? "Processing..." : "Multiply"}
          </button>
        </div>

        {result && <div className="result-box success">{result}</div>}
        {error && <div className="result-box error">{error}</div>}
      </div>
    </div>
  );
}
