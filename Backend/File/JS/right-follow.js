import socket from '/JS/socket.js';
var onList = [];
var userinfo;
function rightLoad(user){
    userinfo = user;;
    document.getElementById('online').innerHTML = `
        <div class="title">
            Đang Online
        </div>
        <div class="onContainer" id="onList"></div>
    `;
    onCheck();
    document.getElementById('notification').innerHTML = `
        <div class="title">
            Thông báo
        </div>
        <div class="notiContainer" id="notiList"></div>
    `;
    notiCheck();
}
function onCheck(){
    socket.on('online', data => {
        renderOnline(data);
    });
    if(userinfo){
        socket.emit('online', userinfo);
        setInterval(function(){
            socket.emit('online', userinfo);
        }, 60000);
    }
}
function renderOnline(data){
    var index = onList.findIndex(user => user._id == data._id);
    if(index>-1){
        onList[index].time = Date.now();
    }
    else{
        data.time = Date.now();
        onList.push(data);
        document.getElementById('onList').insertAdjacentHTML("beforeEnd",`
            <div class="onUser" id="onUser_${data._id}">  
                <div class="onUsername">
                    <a href="/profile/${data._id}">${data.username}</a>
                </div>
                <div class="onStick">O</div>
            </div>
        `);
    }
    var onListTemp = [];
    onList.map(user => {
        if(user.time < Date.now() - 300000){
            document.getElementById(`onUser_${user._id}`).remove();
        }
        else 
            onListTemp.push(user);
    });
    onList = onListTemp;
}
function notiCheck(){
    socket.on('noti', data => {
        renderNoti(data);
    });
}
function renderNoti(data){
    if(data){
        var notiList = document.getElementById('notiList');
        notiList.insertAdjacentHTML("beforeEnd",`
            <div class="notiLine">
                <a href="/profile/${data._id}">
                    <span class="notiUsername">
                        ${data.username}
                    </span>
                </a>
                <span class="notiStick">
                    ${data.string}
                </span>
            </div>
        `);
        // notinew.scrollIntoView(false);
        if(notiList.querySelectorAll('.notiLine').length>20){
            notiList.querySelectorAll('.notiLine')[0].remove();
        }
    }
}
const load = {
    load: rightLoad
}
export default load;
