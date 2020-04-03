import time from '/JS/time.js';
import socket from '/JS/socket.js';
import userinfo from '/user/data-userinfo.js';

var messageList, inboxBox, inboxIcon;
var unreadList = {};

if(userinfo){
    fetch(`/conversation`,{
        method: 'GET',
    }).then(result => {
        result.json()
        .then(newMessage => {
            if(newMessage.success){
                messageList = newMessage.data.message;
                inboxContainer();
            }
        }).catch(err => {
            console.log(err)
        })
    });
    socket.on(userinfo._id, data => {
        if(data.type == 'message'){
            if(document.getElementById(`inbox_${data.to._id}`)){
                fetch(`/conversation/${data.to._id}?order=0`,{
                    method: 'GET',
                }).then(result => {
                    result.json()
                    .then(newMessage => {
                        if(newMessage.success){
                            renderMessage(data.to, newMessage.data.message[newMessage.data.message.length - 1]);
                            if(messageList){
                                var index = messageList.findIndex(item => {
                                    return item.to._id == data.to._id;
                                })
                                if(index == -1){
                                    messageList.push({
                                        to: data.to,
                                        message: newMessage.data.slice(-1)
                                    });
                                }
                                else{
                                    messageList[index].message = newMessage.data.message[newMessage.data.length - 1];
                                }
                                inboxContainer();
                            }
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                });
            }
            else{
                messagebox(data.to);
            }
        }
    })
}
function inboxContainer(box, icon){
    if(box && icon){
        inboxBox = box;
        inboxIcon = icon;
    }
    else{
        var inboxLength = 0;
        var inboxList = "";
        if(messageList){
            var inboxLength = 0;
            var inboxList = "";
            for(let i = messageList.length - 1 ; i>= 0; i--){
                if(i > messageList.length - 11){
                    inboxList += `
                        <div class="inboxLine" id="inboxcontainer_${messageList[i].to._id}">
                            <div class="inboxUsername">${messageList[i].to.username}</div>
                            <div class="inboxLastMessage">
                               ${userinfo._id == messageList[i].conversation.message[0].author ? "Bạn" : ""} ${messageList[i].conversation.message[0].message}
                            </div>
                        </div>
                    `;
                }
                if(messageList[i].conversation.message[0].status == 1){
                    inboxLength += 1;
                }
            }
        }
        else{
            inboxList += `
                <div class="inboxLine">
                    Đang tải...
                </div>
            `;
        }
        
        inboxBox.innerHTML = inboxList;
        inboxIcon.innerText = (inboxLength ? inboxLength : "");
    }
    // var inboxNumber = document.getElementById('inboxNumber');
    // if(inboxNumber){
    //     inboxNumber.innerText = parseInt(inboxNumber.innerText || 0) + 1;
    //     messageList.push(data.to._id);
    // }
    // return(messageList);
}
function messagebox(to){
    var mesContainer = document.getElementById('mesContainer');
    if(!mesContainer){
        mesContainer = document.createElement('div');
        mesContainer.id = 'mesContainer';
        mesContainer.classList = 'mesContainer';
        document.body.appendChild(mesContainer);
    }
    var mesBox = document.getElementById(`inbox_${to._id}`);
    if(!mesBox){
        mesBox = document.createElement('div');
        mesBox.id = `inbox_${to._id}`;
        mesBox.classList = 'mesBox';
        mesContainer.appendChild(mesBox);
        mesBox.innerHTML = `
            <div class="mesTitle">
                <a href="/profile/${to._id}">
                    ${to.username}
                </a>
            </div>
            <div class="mesConversation" id="content_inbox_${to._id}">
                <div class="mesLoader" id="loader_inbox_${to._id}">
                    Đang tải...
                </div>
            </div>
            <div class="mesInput">
                <form action="/messages" id="form_inbox_${to._id}">
                    <div class="form-group">
                        <div class="mesBoxTextarea">
                            <textarea id="write_inbox_${to._id}" placeholder="Viết tin nhắn"></textarea>
                        </div>
                        <div class="mesBoxSubmit">
                            <input type="submit" value="Gửi" id="inbox_submit_${to._id}">
                        </div>
                    </div>
                </form>
            </div>
            <div class="closeButton" id="close_inbox_${to._id}" title="Đóng">X</div>
        `;
        fetch(`/conversation/${to._id}?order=0`,{
            method: 'GET',
        }).then(result => {
            result.json()
            .then(data => {
                console.log(data)
                if(data.success){
                    if(!data.data){
                        document.getElementById(`loader_inbox_${to._id}`).innerHTML = "Bạn hãy là người bắt đầu cuộc trò chuyện!";
                    }
                    else{
                        document.getElementById(`loader_inbox_${to._id}`).innerHTML = "";
                        data.data.message.map(message => {
                            renderMessage(to, message);
                        });
                    }
                }
            }).catch(err => {
                console.log(err)
            })
        });
        var textarea = document.getElementById(`write_inbox_${to._id}`);
        var shift = 0;
        textarea.addEventListener('keydown', function(e){
            if(e.keyCode == 16) shift = 1;
            if(e.keyCode == 13 && !shift){
                e.preventDefault();
                document.getElementById(`inbox_submit_${to._id}`).click();
            }
        });
        textarea.addEventListener('keyup', function(e){
            if(e.keyCode == 16) shift = 0;
        });
        textarea.oninput = function() {
            textarea.style.height = "14px";
            textarea.style.height = (textarea.scrollHeight - 22)+"px";
        };
        document.getElementById(`form_inbox_${to._id}`).addEventListener('submit', function(e){
            e.preventDefault();
            if(textarea.value.length){
                var data = {
                    to: to._id,
                    message: textarea.value
                };
                textarea.value = "";
                textarea.style.height = "14px";
                textarea.style.height = (textarea.scrollHeight - 22)+"px";
                textarea.focus();
                fetch('/conversation',{
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(result => {
                    result.json()
                    .then(mesResult => {
                        console.log(mesResult)
                        document.getElementById(`loader_inbox_${to._id}`).innerHTML = "";
                        renderMessage(to, mesResult.data.message[0]);
                    }).catch(err => {
                        console.log(err)
                    })
                });
            }
        });
        mesBox.addEventListener('click', function(){
            if(unreadList[`${to._id}`]){
                fetch(`/conversation/read/${to._id}`,{
                    method: 'GET'
                }).then(result => {
                    result.json()
                    .then(mesResult => {
                        mesResult.data.map(mes => {
                            document.getElementById(`mes_${mes._id}`).innerHTML = mes.message.replace(/\n/g, "<br>");
                        });
                        document.getElementById(`content_inbox_${to._id}`).innerHTML = document.getElementById(`content_inbox_${to._id}`).innerHTML.replace("<b>", "").replace('</b>', "")
                        delete unreadList[`${to._id}`];
                    }).catch(err => {
                        console.log(err)
                    });
                });
            }
        })
        document.getElementById(`close_inbox_${to._id}`).addEventListener('click', function(e){
            document.getElementById(`inbox_${to._id}`).remove();
        });
    }
}
function renderMessage(to, mes){
    let mesTime = time.get(mes.createdAt);
    if(to._id == mes.author){
        document.getElementById(`content_inbox_${to._id}`).insertAdjacentHTML('beforeend', `
            <div class="mesLine">
                <div class="mesAvatar">
                    <a href="/profile/${mes.author}">
                        <img src="/image/avatar/${mes.author}" title="${mes.username}">
                    </a>
                </div>
                <div class="mesOther">
                    <div class="mesContentContainer">
                        <div class="mesContent" id="mes_${mes._id}">
                            ${mes.status == 0 ? `<b>` + mes.message.replace(/\n/g, "<br>") + `</b>` : mes.message.replace(/\n/g, "<br>")}
                        </div>
                    </div>
                    <div class="mesTimeContainer left">
                        <div class="mesTime" title="${mesTime[2]}">
                            ${mesTime[3]}
                        </div>
                    </div>
                </div>
            </div>
            `);
        if(mes.status == 0){
            unreadList[`${to._id}`] = 1;
        }
        }
    else{
        document.getElementById(`content_inbox_${to._id}`).insertAdjacentHTML("beforeend", `
            <div class="mesLine">
                <div class="mesAuthor">
                    <div class="mesContentContainer">
                        <div class="mesContent" id="mes_${mes._id}">
                            ${mes.message.replace(/\n/g, "<br>")}
                        </div>
                    </div>
                    <div class="mesTimeContainer right">
                        <div class="mesTime" title="${mesTime[2]}">
                            ${mesTime[3]}
                        </div>
                    </div>
                </div>
            </div>
        `);
    }
    document.getElementById(`mes_${mes._id}`).scrollIntoView(true);;
}
const message = {
    box: messagebox,
    inboxContainer: inboxContainer,
    list: messageList
}
export default message;