const socket = io();
let user;
let chatBox = document.getElementById('chatbox');

const sendData = async (messageData) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = {
        "user": messageData.user,
        "message": messageData.message,
    };

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(raw),
        redirect: 'follow',
    };

    fetch("http://localhost:8080/chat", requestOptions)
        .then(response => response.json())
        .then(result => {
            const data = {
                status: result.status,
            }
            if(data.status === 'done'){
                // socket.emit('data_list_update', data);
                console.log('Enviando data a socket...');
                socket.emit('message', {user: messageData.user, message: messageData.message});
            }
        })
        .catch(error => console.log('error', error));
};

Swal.fire({
    title: 'Identificate',
    input: 'text',
    text: 'Debes ingresar un nombre de usuario antes de entrar al chat',
    inputValidator: (value) => {
        return !value && 'Necesitas escribir un nombre de usuario para continuar.'
    },
    allowOutsideClick: false,
})
.then(result => {
    user = result.value;
});

chatBox.addEventListener('keyup', evt => {
    if(evt.key==="Enter"){
        if(chatBox.value.trim().length > 0){
            sendData({user: user, message: chatBox.value});
            // socket.emit('message', {user: user, message: chatBox.value});
            chatBox.value = "";
        }
    }
});

socket.on('messageLogs', data => {
    const log = document.getElementById('messageLogs');

    let messages = "";
    data.forEach(message => {
        messages += `${message.user} dice: ${message.message}<br/>`
    })
    log.innerHTML = messages;
});