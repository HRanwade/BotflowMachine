import { handleRequest } from "./handleRequest";


const input = document.getElementById("input")! as HTMLInputElement;
const sendButton = document.getElementById("send")!;


sendButton.addEventListener("click", () => {
  if (!input.value.trim()) {
    return;
  }
  // send to api
  handleRequest(input.value.trim())
})

