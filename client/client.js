// socket connection
const socket = io.connect("http://localhost:8080");

// UI elements
const messages = document.getElementById("messages");
const usersList = document.querySelector(".users ul"); // select users list
const input = document.getElementById("messageInput");
const send = document.getElementById("send");

// ask username once
const username = prompt("Enter your temporary username");

// Send username to server
socket.emit("setUsername", username);

// SEND button
send.addEventListener("click", sendMessage);

function sendMessage() {
  const text = input.value.trim();
  if (!text) return;

  // emit message to server
  socket.emit("send-message", {
    username,
    text,
  });

  // show own message immediately
  addMessage(username, text);

  input.value = "";
}

// receive message from other users
socket.on("receive-message", (data) => {//other  client recives it
  addMessage(data.username, data.text);
});

// receive last 50 messages from DB
socket.on("db-r", (messages) => {
  messages.forEach((msg) => {
    addMessage(msg.sender, msg.message);
  });
});

// update online users list
socket.on("updateUsers", (users) => {
  usersList.innerHTML = ""; 
  users.forEach((user) => {
    const li = document.createElement("li");
    li.textContent = user.name;
    li.style.color = "lime"; 
    usersList.appendChild(li);
  });
});

// render message in UI
function addMessage(user, text) {
  const time = new Date().toLocaleTimeString("en-GB");
  const p = document.createElement("p");
  p.innerHTML = `[${time}] &lt;${user}&gt; ${text}`;
  messages.appendChild(p);
  messages.scrollTop = messages.scrollHeight;
}
