const socket = io()
let ttl = document.getElementById('client-total');
let messagecontainer = document.getElementById('message-container');
let form = document.getElementById('message-form')
let nameInput = document.getElementById('name-input')
let messageInput = document.getElementById('message-input')
let audio=new Audio('ting.mp3');





let username = prompt('Enter your Name')
nameInput.value=username
socket.on('update', (users) => {
    ttl.innerText = `Total clients: ${users}`
})


form.addEventListener('submit', (e) => {
    e.preventDefault();
    sendMessage();
})


function sendMessage() {
    if(messageInput.value==='') return;
    // console.log(messageInput.value)

    const data = {
        name: nameInput.value,
        message: messageInput.value,
        time: new Date()
    }


    socket.emit('message', data)
    addMessagetoUI(true,data)
    messageInput.value=''
}


socket.on('chat-message', data => {
    audio.play()
    addMessagetoUI(false,data)
})


function addMessagetoUI(isOwnMessage, data) {
    clearFeedback();

    const element = `
    <li class="${isOwnMessage ? "message-right" :"message-left"}">
    <p class="message">
      ${data.message}
      <span> ${data.name} ● ${moment(data.time).fromNow()}</span>
    </p>
  </li>
  `
  messagecontainer.innerHTML+=element
  scrollToBottom();
}




function scrollToBottom(){
    messagecontainer.scrollTo(0,messagecontainer.scrollHeight)
}



messageInput.addEventListener('focus',()=>{
    socket.emit('feedback',{
        feedback:` ✔ ${nameInput.value} is typing ...`
    })
})



socket.on('feedall',data=>{
    clearFeedback();
    const element= `
    <li class="message-feedback">
    <p class="feedback" id="feedback">${data.feedback}</p>
  </li>
    `
    messagecontainer.innerHTML+=element
})


function clearFeedback(){
    document.querySelectorAll('.message-feedback').forEach(element=>{
        element.parentElement.removeChild(element)
    })
}