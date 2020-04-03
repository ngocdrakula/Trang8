import message from '/JS/messages.js';
var userinfo;
var member;
var stringStatus = {};
var scroll = 0;
function taskbar(user, memberId){
    userinfo = user;
    member = memberId;
    setStringStatus(userinfo, member);
    var taskbarDiv = document.createElement('div');
    taskbarDiv.classList = "taskbar";
    document.body.appendChild(taskbarDiv);
    var navbarDiv = document.createElement('div');
    navbarDiv.classList = "navbar";
    taskbarDiv.appendChild(navbarDiv);
    
    if(userinfo){
        navbarDiv.innerHTML = taskbarMember();
         loadMember();
    }
    else{
        navbarDiv.innerHTML = taskbarUser();
       loadUser();
    }
}
function setStringStatus(user, memberId){
    if(user){
        if(memberId){
            if(user._id == memberId){
                stringStatus.inputHolder = "Hôm nay bạn thấy thế nào";
                stringStatus.inputTitle = "Chia sẻ trạng thái ngày hôm nay của bạn";
                stringStatus.textareaHolder = "Hôm nay bạn thấy thế nào?";
            }
            else{
                stringStatus.inputHolder = "Viết gì đó để nói rằng bạn đã ghé thăm!";
                stringStatus.inputTitle = "Viết gì đó để nói rằng bạn đã ghé thăm!";
                stringStatus.textareaHolder = "Đăng lên tường";
            }
        }
        else{
            stringStatus.inputHolder = "Bạn đang nghĩ gì?";
            stringStatus.inputTitle = "Chia sẻ trạng thái của bạn";
            stringStatus.textareaHolder = "Bạn đang nghĩ gì?"
        }
    }
    else{
        if(memberId){
            stringStatus.inputHolder = "Viết gì đó để nói rằng bạn đã ghé thăm!";
            stringStatus.inputTitle = "Viết gì đó để nói rằng bạn đã ghé thăm!";
            stringStatus.textareaHolder = "Đăng lên tường";
        }
        else{
            stringStatus.inputHolder = "Bạn đang nghĩ gì?";
            stringStatus.inputTitle = "Chia sẻ trạng thái của bạn";
            stringStatus.textareaHolder = "Bạn đang nghĩ gì?"
        }
    }
}
function taskbarMember(){
    return(`
    <div class="home">
        <div class="logo">
            <a href="/">
                <img src="/IMG/logo.PNG" alt="Trang chủ">
            </a>
        </div>
        <div class="postStatus">
            <textarea id="input-status" placeholder="${stringStatus.inputHolder}" title="${stringStatus.inputTitle}"></textarea>
        </div>
    </div>
    <div class="user" id="user">
        <div class="buttonLink">
            <a href="/profile/${userinfo._id}">${userinfo.username.length <= 14 ? userinfo.username : userinfo.username.slice(0, 10) + "..."}</a>
        </div>
        <div class="buttonLink notiBox" id="inboxLink">
            <a href="#">Tin nhắn</a>
        </div>
        <div class="buttonLink notiBox" id="friendsLink">
            <a href="#">Bạn bè</a>
        </div>
        <div class="setting buttonLink" id="setting">
            <div class="showButton" id="showButton">Tùy chọn</div>
        </div>
    </div>
`);
}
function taskbarUser(){
return(`
    <div class="home">
        <div class="logo">
            <a href="/">
            <img src="/IMG/logo.PNG" alt="Trang chủ">
            </a>
        </div>
        <div class="postStatus">
            <textarea id="input-status" placeholder="${stringStatus.inputHolder}" title="${stringStatus.inputTitle}"></textarea>
        </div>
    </div>
    <div class="user">
        <div class="buttonLink">
            <a href="#" id="loginButton">Đăng nhập</a>
        </div>
        <div class="buttonLink">
            <a href="#" id="registerButton">Đăng kí</a>
        </div>
        <div class="buttonLink">
            <a href="/celebrityButton">Trang</a>
        </div>
        <div class="buttonLink">
        <a href="/help">Trợ giúp</a>
        </div>
    </div>
    `);
}

function loadUser(){
    document.getElementById("input-status").addEventListener('click', function(){
        document.getElementById("loginButton").click();
    });
    document.getElementById("loginButton").addEventListener('click', function(){
        if(document.documentElement.querySelectorAll('div.showForm')[0])
            document.documentElement.querySelectorAll('div.showForm')[0].remove();
        var formbody = document.createElement('div');
        document.body.appendChild(formbody);
        formbody.classList = "showForm";
        formbody.innerHTML = userForm('login');
        document.getElementById("username").focus();
        scroll = parseFloat (-document.documentElement.getBoundingClientRect().top);
        document.getElementById("closeButton").addEventListener('click', function(){
            formbody.remove();
            setTimeout(() => {
                document.documentElement.scrollTop = scroll;
            }, 1);
        });
        document.getElementById("login").addEventListener('submit',function(e){
            e.preventDefault();
            var form = document.getElementById('login');
            var data = {
                username: document.getElementById("username").value,
                email: document.getElementById("username").value,
                password: document.getElementById("password").value
            };
            if(data.username.split("@")[1] == undefined){
                data.email = null;
            }
            fetch("/user/login", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            }).then(res => {
                res.json().then(result => {
                    if(result.success){
                        location.reload();
                    }
                    else{
                        if(form.querySelectorAll('div.caution')[0])
                            form.querySelectorAll('div.caution')[0].remove();
                        form.querySelectorAll('div.form-group')[result.key].insertAdjacentHTML("beforebegin",`
                            <div class="caution">${result.err}</div>
                        `);
                        form.querySelectorAll('input')[result.key].focus();
                    }
                }).catch(err => {
                })
            }).catch(err => {
            });
        })
        formbody.addEventListener('click', function(e){
            if(e.target.querySelectorAll('div.userForm')[0]){
                formbody.remove();
            }
        })
    });
    document.getElementById("registerButton").addEventListener('click', function(){
        if(document.documentElement.querySelectorAll('div.showForm')[0])
            document.documentElement.querySelectorAll('div.showForm')[0].remove();
        var formbody = document.createElement('div');
        document.body.appendChild(formbody);
        formbody.classList = "showForm";
        formbody.innerHTML = userForm('register');
        document.getElementById("email").focus();
        scroll = parseFloat (-document.documentElement.getBoundingClientRect().top);
        document.getElementById("closeButton").addEventListener('click', function(){
            formbody.remove();
            setTimeout(() => {
                document.documentElement.scrollTop = scroll;
            }, 1);
        })
        document.getElementById("register").addEventListener('submit',function(e){
            e.preventDefault();
            var form = document.getElementById('register');
            var data = {
                username: document.getElementById("username").value,
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
                repassword: document.getElementById("repassword").value,
                name: document.getElementById("name").value
            };
            if(data.password != data.repassword){
                if(form.querySelectorAll('div.caution')[0])
                    form.querySelectorAll('div.caution')[0].remove();
                form.querySelectorAll('div.form-group')[4].insertAdjacentHTML("beforebegin",`
                    <div class="caution">Xác nhận mật khẩu không chính xác</div>
                `);
                document.getElementById("repassword").focus();
            }
            else{
                fetch("/user/register", {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                }).then(res => {
                    res.json().then(result => {
                        if(result.success){
                            location.reload(); 
                        }
                        else{
                            if(result.err){
                                if(form.querySelectorAll('div.caution')[0])
                                    form.querySelectorAll('div.caution')[0].remove();
                                form.querySelectorAll('div.form-group')[result.key].insertAdjacentHTML("beforebegin",`
                                    <div class="caution">${result.err}</div>
                                `);
                                form.querySelectorAll('input')[result.key].focus();
                            }
                            else {
                            }
                        }
                    }).catch(err => {
                    })
                }).catch(err => {
                });
            }
        });
        formbody.addEventListener('click', function(e){
            if(e.target.querySelectorAll('div.userForm')[0]){
                document.getElementById('closeButton').click();
            }
        })
    });
}

function userForm(formType){
    if(formType == 'login'){
        return(
            `
            <div class="userForm login">
                <form id="login">
                    <div class="form-title">
                        Đăng nhập vào Trang8
                    </div>
                    <div class="form-group">
                        <div class="input-title" id="username-title">
                            Tài khoản:
                        </div>
                        <div class="input">
                            <input required id="username" type="text" placeholder="Nickname hoặc email">
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-title" id="password-title">
                            Mật khẩu:
                        </div>
                        <div class="input">
                            <input required minlength="8" id="password" type="password" placeholder="Mật khẩu của bạn"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="checkbox-group">
                            <div class="checkbox-input">
                                <input id="remember" type="checkbox" title="Ghi nhớ đăng nhập">
                            </div>
                            <label class="checkbox-title" for="remember">
                                Ghi nhớ
                            </label>
                        </div>
                        <div class="input">
                            <input type="submit" value="Đăng nhập">
                        </div>
                    </div>
                    <div class="closeButton" id="closeButton" title="Đóng">
                        X
                    </div>
                </form>
            </div>
            `
        )
    }
    else if(formType == 'register'){
        return(
            `
            <div class="userForm register">
                <form id="register">
                    <div class="form-title">
                        Đăng kí Tài khoản
                    </div>
                    <div class="form-group">
                        <div class="input-title" id="email-title">
                            Email:
                        </div>
                        <div class="input">
                            <input required id="email" type="text" placeholder="Nhập Email của bạn"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-title">
                            Tên bạn:
                        </div>
                        <div class="input" id="name-title">
                            <input required id="name" type="text" placeholder="Nhập tên đầy đủ"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-title" id="username-title">
                            Nickname:
                        </div>
                        <div class="input">
                            <input required id="username" type="text" placeholder="Tên tài khoản"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-title" id="password-title">
                            Mật khẩu:
                        </div>
                        <div class="input">
                            <input required minlength="8" id="password" type="password" placeholder="Mật khẩu của bạn"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="input-title" id="repassword-title">
                            Xác nhận mật khẩu:
                        </div>
                        <div class="input">
                            <input required minlength="8" id="repassword" type="password" placeholder="Xác nhận mật khẩu"/>
                        </div>
                    </div>
                    <div class="form-group">
                        <div class="checkbox-group">
                            <div class="checkbox-input">
                                <input required id="rules" type="checkbox" title="Đồng ý với điều khoản của Trang 8">
                            </div>
                            <label class="checkbox-title" for="rules">
                                Đồng ý với <a href="/rules" title="Điều khoản của Trang8">điều khoản</a>.
                            </label>
                        </div>
                        <div class="input">
                            <input type="submit" value="Đăng kí">
                        </div>
                    </div>
                    <div class="closeButton" id="closeButton" title="Đóng">
                        X
                    </div>
                </form>
            </div>
            `
        );
    }
    else return("");
};

function  loadMember(){
    followStatus();
    followSetting();
    followInbox();
    followRequestFriend();
}
function followStatus(){
    var statusForm =
    `
    <div class="statusForm">
        <form id="postStatus" enctype="multipart/form-data">
            <div class="form-group">
                <div class="select-title">
                    Bạn đang cảm thấy:
                </div>
                <div class="feeling-select">
                    <select id="feeling">
                        <option value="0">Chọn</option>
                        <option value="1">Hạnh phúc</option>
                        <option value="2">Tuyệt vời</option>
                        <option value="3">Vui vẻ</option>
                        <option value="4">Thú vị</option>
                        <option value="5">Hi vọng</option>
                        <option value="6">Cô đơn</option>
                        <option value="7">Buồn</option>
                        <option value="8">Giận giữ</option>
                    </select>
                </div>
                <div class="uploadPhoto">
                    <input type="file" name="photo" id="photo" accept="image/x-png,image/jpeg" />
                    <label class="input" for="photo">
                        Thêm ảnh
                    </label>
                </div>
            </div>
            <div class="status">
                <div class="status-textarea">
                    <textarea id="status" placeholder="${stringStatus.textareaHolder}"></textarea>
                </div>
            </div>
            <div class="previewContainer" id="previewPhoto">
            </div>
            <div class="form-group">
                <div class="select-title">
                    Chia sẻ với:
                </div>
                <div class="select-status">
                    <select id="privacy">
                        <option value="3">Công khai</option>
                        <option value="2">Bạn bè</option>
                        <option value="1">Chỉ mình tôi</option>
                    </select>
                </div>
                <div class="input">
                    <input type="submit" value="Chia sẻ">
                </div>
            </div>
            <div class="closeButton" id="closeButton" title="Đóng">
            X
            </div>
        </form>
    </div>
    `;
    document.getElementById("input-status").addEventListener('click', function(){
        var formbody = document.documentElement.querySelectorAll('div.showForm')[0];
        if(!formbody){
            formbody = document.createElement('div');
            document.body.appendChild(formbody);
        }
        formbody.innerHTML = statusForm;
        formbody.classList = "showForm member";
        document.getElementById("status").value = document.getElementById("input-status").value;
        document.getElementById("status").focus();
        document.getElementById("status").addEventListener("keyup", function(){
            document.getElementById("input-status").value = document.getElementById("status").value;
        });
        document.getElementById('photo').addEventListener('change', function(event){
            var files = document.getElementById('photo').files;
            if(!files[0])document.getElementById('previewPhoto').innerHTML = "";
            var reader = new FileReader();
            reader.onload = function (e) {
                var image = new Image();
                image.src = reader.result;
                image.onload = function() {
                    var size;
                    if(this.width>this.height){
                        size = `height: 60px;`;
                    }
                    else{
                        size = `width: 60px`
                    }
                    document.getElementById('previewPhoto').innerHTML = `
                        <div class="previewItem">
                            <div class="previewPhoto">
                                <img style="${size}" src="${reader.result}" title="Ảnh tải lên">
                            </div>
                            <div class="closeButton" id="deleteFiles" title="Xóa">
                                X
                            </div>
                        </div>
                            `;
                    document.getElementById('deleteFiles').addEventListener('click', function() {
                        document.getElementById('photo').value = "";
                        document.getElementById('previewPhoto').innerHTML = "";
                    })
                }
            };
            if(files[0])
                reader.readAsDataURL(files[0]);
        });
        document.getElementById("closeButton").addEventListener('click', function(){
            status = document.getElementById("status").value,
            formbody.remove();
        })
        document.getElementById("postStatus").addEventListener('submit',function(e){
            e.preventDefault();
            var data = new FormData();
            var file = document.getElementById('photo').files[0];
            data.append('file', file);
            if(document.getElementById("feeling").value) data.append('feeling', document.getElementById("feeling").value);
            data.append('status', document.getElementById("status").value);
            data.append('privacy', document.getElementById("privacy").value);
            if(member) data.append('to', member);
            fetch("/post",
            {
                method: "POST",
                body: data
            }).then(result => {
                result.json().then(datapost => {
                    if(datapost.success){
                        formbody.classList = "hidden";
                        document.innerHTML = "";
                        document.getElementById("input-status").value="";
                    document.getElementById('loadNews').click();
                    }
                    else{
                        if(document.getElementById('caution')) document.getElementById('caution').innerText = datapost.err;
                        else
                        document.getElementById("postStatus").insertAdjacentHTML('beforebegin', `
                            <div class="caution" id="caution">
                                ${datapost.err}
                            </div>
                        `)
                    }
                }).catch(err => {

                });
            }).catch(err => {
            })
        });
        formbody.addEventListener('click', function(e){
            if(e.target.querySelectorAll('div.statusForm')[0])
            formbody.remove();
        })
    });
}

function followSetting(){
    var setting = document.getElementById('setting');
    var showButton = document.getElementById('showButton');
    var settingForm = document.createElement('div');
    settingForm.innerHTML = `
        <div class="flange">
            <div class="junction"> </div>
        </div>
        <div class="settingList">
            <div class="settingLine">
                <a href="/help">Hỗ trợ / Báo cáo</a>
            </div>
            <div class="settingLine">
                <a href="/setting">Cài đặt riêng tư</a>
            </div>
            <div class="settingLine" id="logout">
                <a href="#">Đăng xuất</a>
            </div>
        </div>
    `;
    settingForm.classList = "hidden";
    setting.appendChild(settingForm);
    showButton.addEventListener('click', function(event){
        if(settingForm.classList == "hidden"){
            showButton.classList = "shownButton";
            settingForm.classList = "settingContainer";
        }
        else{
            showButton.classList = "showButton";
            settingForm.classList = "hidden"
        }
        event.stopPropagation();
        document.body.addEventListener('click', function(e){
            if(showButton.classList == "shownButton" && !e.target.querySelectorAll('div.shownButton').length)
                showButton.click();
        }, {once: true});
    });
    document.getElementById('logout').addEventListener('click', function(){
        var logoutForm = document.documentElement.querySelectorAll('div.showForm')[0];
        if(!logoutForm){
            logoutForm = document.createElement('div');
            document.documentElement.appendChild(logoutForm);
        }
        logoutForm.innerHTML = `
            <div class="userForm logout">
                <div class="form-title">
                    Bạn có chắc muốn đăng xuất?
                </div>
                <div class="form-group" style="height:40px">
                    <div class="buttonLink" id="dont-logout">
                        <a href="#">Không, tôi muốn ở lại!</a>
                    </div>
                    <div class="buttonLink">
                        <a href="/user/logout"><b>Đăng xuất</b></a>
                    </div>
                </div>
            </div>
        `;
        logoutForm.classList = 'showForm member';
        showButton.click();
        logoutForm.addEventListener('click', function(e){
            if(e.target.querySelectorAll('div.userForm.logout').length)
            document.getElementById('dont-logout').click();
        });
        document.getElementById('dont-logout').addEventListener('click', function(){
            logoutForm.remove();
        });
    });
}

function followInbox(){
    var menuContainer = document.getElementById('menuContainer');
    if(!menuContainer){
        menuContainer = document.createElement('div');
        menuContainer.classList = "hidden";
        document.getElementById('user').appendChild(menuContainer);
    }
    var inbox = document.getElementById('inboxLink');
    var icon = document.createElement('div');
    icon.classList = "notiIcon";
    inbox.appendChild(icon);
    inbox.addEventListener('click', function(){
        if(menuContainer.classList != "hidden"){
            menuContainer.classList = "hidden";
        }
        else{
            menuContainer.classList = "inboxContainer";
        }
    });
    message.inboxContainer(menuContainer, icon);
}

function followRequestFriend(){
    var menuContainer = document.getElementById('menuContainer');
    if(!menuContainer){
        menuContainer = document.createElement('div');
        menuContainer.classList = "hidden";
        document.getElementById('user').appendChild(menuContainer);
    }
    var friendsRequest = document.getElementById('friendsLink');
    var icon = document.createElement('div');
    icon.classList = "notiIcon";
    friendsRequest.appendChild(icon);
    friendsRequest.addEventListener('click', function(){
        if(menuContainer.classList != "hidden"){
            menuContainer.classList = "hidden";
        }
        else{
            menuContainer.classList = "inboxContainer";
        }
    });
    // message.requestContainer(menuContainer, icon);
}

const load = {
    load: taskbar
}

export default load;
