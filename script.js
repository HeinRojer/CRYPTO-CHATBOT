
const form = document.getElementById("question-form");
const input = document.getElementById("question-input");
const chatBox = document.getElementById("chat-box");

let loadingMessageDiv = document.createElement("div");

function displayMessage(message, sender, isLoading = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", sender);

  const p = document.createElement("p");
  p.textContent = message;

  if (isLoading) {
    const spinner = document.createElement("span");
    spinner.classList.add("loading-spinner");
    p.textContent = "Thinking...";
    messageDiv.appendChild(spinner);
  }

  messageDiv.appendChild(p);
  chatBox.appendChild(messageDiv);

  chatBox.scrollTop = chatBox.scrollHeight;

  if (isLoading) {
    return messageDiv;
  }
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const question = input.value.trim();

  if (!question) {
    return;
  }

  displayMessage(question, "user");
  input.value = "";

  loadingMessageDiv = displayMessage("Thinking...", "assistant", true);

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch response");
    }

    const data = await response.json();

    if (loadingMessageDiv) {
      loadingMessageDiv.remove();
    }

    displayMessage(data.answer, "assistent");
  } catch (err) {
    console.error("Error:", err);
    loadingMessageDiv.remove();
    displayMessage("Something went wrong");
    return;
  }
});
