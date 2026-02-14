let ws;
let recognition;
const outputEl = document.getElementById("output");
const statusEl = document.getElementById("status");

// --------------------
// WebSocket Setup
// --------------------
function initWebSocket() {
  ws = new WebSocket("ws://localhost:8080");

  ws.onopen = () => {
    console.log("✅ WebSocket connected");
    statusEl.innerText = "🟢 Connected. Click Speak to talk.";
  };

  ws.onmessage = (event) => {
    const response = event.data;
    outputEl.innerText = response;
    statusEl.innerText = "🤖 Speaking response...";
    speak(response);
  };

  ws.onclose = () => {
    console.log("❌ WebSocket closed. Reconnecting...");
    statusEl.innerText = "🔄 Reconnecting to server...";
    setTimeout(initWebSocket, 1000);
  };

  ws.onerror = (err) => {
    console.error("WebSocket error:", err);
    statusEl.innerText = "❌ WebSocket error";
  };
}

initWebSocket();

// --------------------
// 🎤 Speech to Text
// --------------------
function startListening() {
  if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) {
    alert("Speech Recognition not supported in this browser");
    return;
  }

  recognition = new (window.SpeechRecognition ||
    window.webkitSpeechRecognition)();

  recognition.lang = "en-US";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  statusEl.innerText = "🎧 Listening...";
  outputEl.innerText = "";

  recognition.start();

  recognition.onresult = (event) => {
    const transcript = event.results[0][0].transcript;
    console.log("🎤 Heard:", transcript);

    statusEl.innerText = "📤 Sending to AI...";
    outputEl.innerText = transcript;

    if (ws.readyState === WebSocket.OPEN) {
      ws.send(transcript);
    } else {
      statusEl.innerText = "⚠️ Server not connected";
      console.warn("WebSocket not ready");
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
    statusEl.innerText = "Voice recognition error";
  };

  recognition.onend = () => {
    console.log("🎤 Listening stopped");
  };
}

// --------------------
// 🔊 Text to Speech
// --------------------
function speak(text) {
  if (!window.speechSynthesis) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  utterance.onend = () => {
    statusEl.innerText = "🟢 Ready for next question";
  };

  speechSynthesis.speak(utterance);
}

