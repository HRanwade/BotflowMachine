import { handleRequest } from "./handleRequest";


const input = document.getElementById("input")! as HTMLInputElement;
const sendButton = document.getElementById("send")!;
const restartButton = document.getElementById("restart")!;



sendButton.addEventListener("click", () => {
  if (!input.value.trim()) {
    return;
  }
  // send to api
  handleRequest(input.value.trim())
})

restartButton.addEventListener("click", () => {
  input.value = ""
  sessionStorage.clear();
  window.location.reload();
})



