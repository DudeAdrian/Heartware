import { useState } from "react";

export default function SofieCheckIn() {
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [history, setHistory] = useState([]);

  async function sendCheckIn() {
    const res = await fetch("http://localhost:8000/check-in", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        consent: true,
        chat_history: history
      })
    });
    const data = await res.json();
    setResponse(data.response);
    setHistory([...history, { role: "user", content: message }, { role: "sofie", content: data.response }]);
    setMessage("");
  }

  return (
    <div className="p-6 max-w-xl mx-auto">
      <textarea
        className="w-full p-4 rounded-xl"
        placeholder="How are you arriving right now?"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button
        onClick={sendCheckIn}
        className="mt-4 px-6 py-2 rounded-full bg-green-200"
      >
        Share
      </button>
      <p className="mt-6 italic whitespace-pre-line">{response}</p>
    </div>
  );
}
