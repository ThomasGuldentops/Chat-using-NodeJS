function appendMessage(name, img, side, text) {
    let d = new Date();
    let mins = ('0' + d.getMinutes()).slice(-2);
    let time = d.getHours() + " : " + mins;

    let msgHTML =
        `
                <div class="msg messages-${side}-side">
                    <div class="message-image" 
                         style="background-image: url('${img}')">
                    </div>

                    <div class="message-bubble" id="messageBubble">
                        <div class="message-info">
                            <div class="message-info-name">${name}</div>
                            <div class="message-info-time">${time}</div>
                        </div>

                        <div class="message-text">${text}</div>
                    </div>
                </div>
                `;

    document.querySelector(".messages-chat").insertAdjacentHTML("beforeend", msgHTML);
    document.querySelector(".messages-chat").scrollTop += 500;
}

function appendEventMessage(name, text, date) {
    let timer = window.setTimeout(function () {
        let d = new Date();
        let mins = ('0' + d.getMinutes()).slice(-2);
        let time = d.getHours() + " : " + mins;

        let msgHTML =
            `
                <div class="messages-events">${time} - ${text}</div>
                `;

        document.querySelector(".messages-chat").insertAdjacentHTML("beforeend", msgHTML);
        $("#messagesChat").scrollTop += 500;
    }, 500);
}