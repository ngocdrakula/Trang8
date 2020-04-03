import time from '/JS/time.js';
import message from '/JS/messages.js';
var userinfo, member, user, myWall;
function wallLoad(userdata, memberId){
    userinfo = userdata;
    member = memberId;
    if(userinfo) if(userinfo._id == member) myWall = 1;
    fetch(`/profile/getdata/${member}`,
    {
        method: 'GET'
    }).then(result => {
        result.json().then(data => {
            if(data.success){
                user = data.data;
                render();
            }
        }).catch(err =>{
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    });
}
function render(){
    document.title = user.username;
    document.getElementById('wall').innerHTML = `
        <div class="cover" id="image">
        </div>
        <div class="infomation">
            <div class="basicInfo" id="basicInfo">
            </div>
            <div class="advancedInfo" id="advancedInfo">
            </div>
        </div>
    `;
    renderImage();
    renderBasicInfo();
    renderAdvancedInfo()
}
function renderImage(){
    var changeCover, changeFeatured, changeAvatar;
    changeCover = changeFeatured = changeAvatar = "";
    if(myWall){
        changeCover = `
            <div class="changeCover" id="changeCover">
                Đổi ảnh bìa
            </div>
        `;
        changeFeatured = `    
            <div class="changeFeatured" id="changeFeatured">
                Chọn ảnh nổi bật
            </div>
        `;
        changeFeatured = "";
        changeAvatar = `
            <div class="changeAvatar" id="changeAvatar">
                Cập nhật
            </div>
        `;
    }
    var featuredImage = "";
    user.featured.map(featuredItem => {
        featuredImage += `
            <div class="featuredImage">
                <img src="/image/${featuredItem}" title="Ảnh nổi bật">
            </div>
        `;
    })
    document.getElementById('image').innerHTML = `
        <div class="imageContainer">
            ${changeCover}
            ${changeFeatured}
            <div class="featured">
                <div class="featuredContainer" id="featured">
                    ${featuredImage}
                </div>
            </div>
            <div class="avatar" id="avatar">
                ${changeAvatar}
            </div>
            <div class="usernameBox">
                <div class="username">
                    ${user.username}
                </div>
            </div>
        </div>
    `;
    document.getElementById("avatar").style = `background-image: url('/image/avatar/${user._id}')`;
    if(user.cover.origin){
        document.getElementById('image').style = `
            background-image: url('/photo/${user.cover.origin.image}');
            background-position: ${user.cover.position.x}px ${user.cover.position.y}px;
            `;
    }

    if(myWall){
        document.getElementById('changeAvatar').addEventListener('click', function(){
            editAvatar();
        });
        document.getElementById('changeCover').addEventListener('click', function(){
            editCover();
        });
        // document.getElementById('changeFeatured').addEventListener('click', function(){
        //     editFeatured();
        // });
    }
}
function editAvatar(){
    var formUpload = document.createElement('div');
    formUpload.classList = "showForm";
    document.body.appendChild(formUpload);
    formUpload.innerHTML = `
        <div class="userForm upload">
            <div class="form-title">Chọn ảnh đại diện</div>
            <form action="/" id="uploadAvatar">
                <div class="status" id="statusAvatar">
                </div>
                <div class="adjustAvatar" id="change">
                </div>
                <div class="form-group">
                    <div class="uploadPhoto">
                        <input type="file" name="photo" id="selectAvatar" accept="image/x-png,image/jpeg">
                        <label class="input" for="selectAvatar">
                            Chọn ảnh khác
                        </label>
                    </div>
                    <div class="input">
                        <input type="submit" value="Thay đổi">
                    </div>
                </div>
            </form>
            <div class="closeButton" id="closeButton">
                X
            </div>
        </div>
    `;
    var url = null;
    var avatar = 'no-avatar.jpg';
    if(user.avatar.origin){
        avatar = user.avatar.origin.image;
        if(user.avatar.origin.status != "")
            document.getElementById('statusAvatar').innerHTML = `
                <div class="status noteAvatar">
                    <div class="extractStatus">
                        ${user.avatar.origin.status}
                    </div>
                </div>`;
    }
    adjustAvatar(`/photo/${avatar}`);
    document.getElementById('selectAvatar').addEventListener('change', function(e){
        var files = document.getElementById('selectAvatar').files;
        if(!files[0]) adjustAvatar(`/photo/${avatar}`);
        var reader = new FileReader();
        reader.onload = function(e){
            url = reader.result;
            adjustAvatar(url);
        };
        if(files[0])
            reader.readAsDataURL(files[0]);
    });
    document.getElementById('uploadAvatar').addEventListener('submit', function(e){
        e.preventDefault();
        var dataImage = new FormData();
        var infoImage = {
            avatar: {
                position:{
                    x: document.getElementById('selected').offsetLeft,
                    y: document.getElementById('selected').offsetTop, 
                },
                size: {
                    width: document.getElementById('selected').offsetWidth,
                    height: document.getElementById('selected').offsetHeight
                },
            }
        }
        var status;
        if(document.getElementById('newStatus')) status = document.getElementById('newStatus').value;
        if(!status) status = "";
        dataImage.append('privacy', 3);
        dataImage.append('status', status);
        dataImage.append('infoData', JSON.stringify(infoImage));
        dataImage.append('file', document.getElementById('selectAvatar').files[0]);
        fetch('/post', {
            method: 'POST',
            body: dataImage
        }).then(result => {
            result.json().then(dataUpload => {
                if(dataUpload.success){
                    document.getElementById('closeButton').click();
                    user.avatar = dataUpload.infoImage.result;
                    renderImage();
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    });
    document.getElementById('closeButton').addEventListener('click', function(e) {
        formUpload.remove();
    });
}
function adjustAvatar(url){
    var originImage = "";
    if(user.avatar.origin) originImage = `/photo/${user.avatar.origin.image}`;
    if(url == originImage){
        if(user.avatar.origin.status)
        document.getElementById('statusAvatar').innerHTML = `
            <div class="status noteAvatar">
                <div class="extractStatus">
                    ${user.avatar.origin.status.slice(0, 40) + (user.avatar.origin.status.length > 40 ? "..." : "")}
                </div>
            </div>`;
    }
    else if(url == `/photo/no-avatar.jpg`){
        document.getElementById('statusAvatar').innerHTML = `
            <div class="status noteAvatar">
                <div class="extractStatus">
                    Chọn một bức ảnh thay thế ảnh đại diện mặc định
                </div>
            </div>`;
    }
    else{
        document.getElementById('statusAvatar').innerHTML = `
            <div class="status-textarea noteAvatar">
                <textarea id="newStatus" placeholder="Hãy nói gì đó về ảnh này" value=""></textarea>
            </div>`;
        
    }
    var change = document.getElementById('change');
    change.innerHTML = `
        <div class="moveAvatar" id="move">
            <div class="background">
                <div class="backgroundImage">
                    <img src="${url}" draggable="false" id="backgound">
                </div>
            </div>
            <div class="move">
                <div class="moveImage">
                    <img src="${url}" draggable="false" id="selected">
                </div>
            </div>
        </div>
        <div class="resize">
            <input type="range" min="0" max="1000" value="0" id="resize">
        </div>
    `;
    var image = new Image();
    image.src = url;
    var mousedown = false;
    var marginTop = 0;
    var marginLeft = 0;
    var size = 'width';
    var xMouse, yMouse;
    xMouse = yMouse = 0;
    var resize = document.getElementById('resize');
    var background = document.getElementById('backgound');
    var selected = document.getElementById('selected');
    var move = document.getElementById('move');
    image.onload = function() {
        if(this.height<this.width) size = 'height';
        if(url == originImage){
            resize.value = user.avatar.size[size]-200;
            selected.style[size] = `${user.avatar.size[size]}px`;
            background.style[size] = `${user.avatar.size[size]}px`;
            marginTop = user.avatar.size.height + user.avatar.position.y * 2 - 200 + 4;
            marginLeft = user.avatar.size.width + user.avatar.position.x * 2 -200;
            selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
            background.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
        }
        else{
            selected.style[size] = `200px`;
            background.style[size] = `200px`;
        }
    }
    resize.addEventListener('mousemove', function() {
        if(mousedown) resize.style.cursor = 'grabbing';
        else resize.style.cursor = 'grab';
        selected.style[size] = `${parseInt(resize.value) + 200}px`;
        background.style[size] = `${parseInt(resize.value) + 200}px`;
        if(Math.abs(marginLeft) > selected.width - 200){
            marginLeft = Math.sign(marginLeft)*(selected.width - 200);
        }
        if(Math.abs(marginTop) > selected.height - 200){
            marginTop = Math.sign(marginTop)*(selected.height - 200);
        }
        selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
        background.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
    });
    change.addEventListener('mousedown', function() {
        mousedown = true;
    });
    document.documentElement.addEventListener('mouseup', function() {
        mousedown = false
    });
    move.addEventListener('mousemove', function listenMouseMove(e) {
        if(mousedown){
            var diffX = (e.clientX - xMouse) * 2;
            var diffY = (e.clientY - yMouse) * 2;
            if(Math.abs(marginLeft + diffX) < selected.width - 200){
                marginLeft += diffX;
                selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
                background.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
            }
            if(Math.abs(marginTop + diffY) < selected.height - 200){
                marginTop += diffY;
                selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
                background.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
            }
            console.log({
                x: selected.offsetLeft,
                y: selected.offsetTop, 
            })
        }
        xMouse = e.clientX;
        yMouse = e.clientY;
    });
}
function editCover(){
    var backgoundBody = document.createElement('div');
    backgoundBody.classList = "showForm";
    document.body.appendChild(backgoundBody);
    var formEdit = document.createElement('div');
    formEdit.classList = "editCover";
    document.getElementById('image').innerHTML = `
        <div class="editCover" id="editCover">
            <div class="adjustCover" id="change">
            </div>
            <form action="/" id="uploadCover" class="formUploadCover">
                <div class="accept">
                    <div class="form-group">
                        <div class="uploadPhoto">
                        <input type="file" name="photo" id="selectCover" accept="image/x-png,image/jpeg">
                        <label class="input" for="selectCover">
                            Chọn ảnh khác
                        </label>
                    </div>
                    </div>
                    <div class="form-group">
                        <div class="cancel" id="closeButton">
                            Hủy
                        </div>
                        <div class="input">
                            <input type="submit" value="Thay đổi">
                        </div>
                    </div>
                </div>
            </form>
        </div>
    `;
    var url = null;
    if(user.cover.origin)
        adjustCover(`/photo/${user.cover.origin.image}`);
    else document.getElementById('selectCover').click();
    document.getElementById('selectCover').addEventListener('change', function(e){
        var files = document.getElementById('selectCover').files;
        if(!files[0]){
            if(user.cover.origin){
                adjustCover(`/photo/${user.cover.origin.image}`);
            }
            else{
                document.getElementById('closeButton').click();
            }
        }
        else{
            var reader = new FileReader();
            reader.onload = function(e){
                url = reader.result;
                adjustCover(url);
            };
            reader.readAsDataURL(files[0]);
        }
    });
    document.getElementById('uploadCover').addEventListener('submit', function(e){
        e.preventDefault();
        var dataImage = new FormData();
        var infoImage = {
            cover: {
                position:{
                    x: document.getElementById('selected').offsetLeft,
                    y: document.getElementById('selected').offsetTop, 
                },
                size: {
                    width: document.getElementById('selected').offsetWidth,
                    height: document.getElementById('selected').offsetHeight
                },
            }
        }
        dataImage.append('privacy', 3);
        dataImage.append('status', "");
        dataImage.append('infoData', JSON.stringify(infoImage));
        dataImage.append('file', document.getElementById('selectCover').files[0]);
        fetch('/post', {
            method: 'POST',
            body: dataImage
        }).then(result => {
            result.json().then(dataUpload => {
                if(dataUpload.success){
                    document.getElementById('closeButton').click();
                    user.cover = dataUpload.infoImage.result;
                    renderImage();
                }
            }).catch(err => {
                console.log(err);
            })
        }).catch(err => {
            console.log(err);
        })
    });
    document.getElementById('closeButton').addEventListener('click', function() {
        renderImage();
        backgoundBody.remove();
    });
}
function adjustCover(url){
    document.getElementById('image').style = ``;
    var change = document.getElementById('change');
    change.innerHTML = `
        <img src="${url}" draggable="false" id="selected">
    `;
    var image = new Image();
    image.src = url;
    var mousedown = false;
    var size = 'width';
    var xMouse, yMouse, marginTop, marginLeft;
    xMouse = yMouse = marginTop = marginLeft = 0;
    var selected = document.getElementById('selected');
    image.onload = function() {
        if(this.width/625 > this.height/250) size = 'height';
        if(user.cover.origin)
            if(url == `/photo/${user.cover.origin.image}`){
                marginTop = user.cover.position.y;
                marginLeft = user.cover.position.x;
                selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
            }
        selected.style[size] = `${size == 'height'? 250 : 625}px`;
    }
    change.addEventListener('mousedown', function() {
        mousedown = true;
    });
    document.documentElement.addEventListener('mouseup', function() {
        mousedown = false
    });
    change.addEventListener('mousemove', function listenMouseMove(e) {
        if(mousedown){
            var diffX = (e.clientX - xMouse);
            var diffY = (e.clientY - yMouse);
            if(size == 'height' && marginLeft + diffX > 625 - selected.width && marginLeft + diffX < 0){
                marginLeft += diffX;
                selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
            }
            if(size == 'width' && marginTop + diffY > 250 - selected.height && marginTop + diffY < 0){
                marginTop += diffY;
                selected.style.margin = `${marginTop}px 0px 0px ${marginLeft}px`;
            }
        }
        xMouse = e.clientX;
        yMouse = e.clientY;
    });
}
function renderBasicInfo() {
    var friendly = -1; var follower = 0; var timeFriend = "";
    var {name, email, sex, birthday, country, live} = user;
    switch(sex){
        case 1: sex = "Nam";
            break;
        case 2: sex = "Nữ";
            break;
        case 3: sex = "Khác";
            break;
    }
    if(birthday){
        var bdTime = new Date(birthday);
        var bdDate = bdTime.getDate() < 10 ? "0" + bdTime.getDate() : bdTime.getDate();
        var bdMonth = (bdTime.getMonth() + 1) < 10 ? "0" + (bdTime.getMonth() + 1) : bdTime.getMonth() + 1;
        var bdString = `${bdDate}/${bdMonth}/${bdTime.getFullYear()}`;
        birthday = `${bdTime.getFullYear()}-${bdMonth}-${bdDate}`;
    }
    var infoList = {name, email, sex, birthday, country, live};
    var infoKey = Object.keys(infoList);
    var infoTitle = ["Tên thật", "Email", "Giới tính", "Sinh nhật", "Quê hương", "Nơi sống"];
    var infoHTML = ""; var relationBar = "";
    infoKey.map((field, index) => {
        if(infoList[field]) infoHTML += `
            <div class="infoLine">
                <div class="infoBox">
                    ${infoTitle[index]}: ${field == 'birthday' ? bdString : infoList[field]}
                </div>
            </div>
        `;
    });
    if(myWall){
        infoHTML += `
            <div class="infoLine" id="changeInfo">
                <div class="infoBox changeInfo">
                    Chỉnh sửa thông tin cá nhân
                </div>
            </div>
        `
    }
    else{
        if(userinfo) var friendindex = user.relation.friends.find(friend => {
            return friend.friend._id == userinfo._id;
        });
        if(friendindex){
            timeFriend = time.get(friendindex.updatedAt)[1];
            friendly = friendindex.friendship;
        }
        else friendly = -1;
        if(userinfo) follower = user.relation.fans.find(fans => {
            return fans._id == userinfo._id;
        });
        relationBar = `
            <div class="selectRelation${friendly == 1? " hiddenSelect" : ""}" id="changefriend">
                <div id="friendText">
                    ${friendly == 2 ? "Chấp nhận" : friendly == 1 ? "Bạn bè" : friendly == -1 ? "Kết bạn" : "Xóa yêu cầu"}
                </div>
                <div class="hidden" id="advanceFriendship">
                    <div class="timeRelation" id="timeRelation">
                        Đã trở thành bạn bè từ ${timeFriend}${timeFriend != 'vừa xong' ? " trước" : ""}
                    </div>
                    <div class="unRelation" id="unFriend">
                        Hủy kết bạn
                    </div>
                </div>
            </div>
            <div class="selectRelation${follower ? " hiddenSelect" : ""}" id="changefollow">
                <div id="followText">
                    ${follower ? "Đang theo dõi" : "Theo dõi"}
                </div>
                <div class="hidden" id="advanceFollow">
                    <div class="unRelation" id="unFollow">
                        Bỏ theo dõi
                    </div>
                </div>
            </div>
            <div class="selectRelation" id="addinbox">
                Nhắn tin
            </div>
            `;
    }
    document.getElementById('basicInfo').innerHTML = `
        <div class="relationship" id="relationship">
            ${relationBar}
        </div>
        <div class="title">
            Thông tin
        </div>
        <div class="infoList" id="infoList">
            ${infoHTML}
        </div>
    `;
    if(!myWall){
        var changeFriend = document.getElementById('changefriend');
        var changeFollow = document.getElementById('changefollow');
        var friendText = document.getElementById('friendText');
        var followText = document.getElementById('followText');
        function followChangeFriend(){
            var type = 'addfriend';
            if(friendly == 2){
                type = 'acceptfriend';
            }
            else if(friendly > -1){
                type = 'unfriend';
            }
            console.log({type: type, to: member})
            fetch('/profile/relation',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({type: type, to: member})
            }).then(result => {
                result.json().then(data => {
                    console.log(data)
                    if(data.success){
                        if(friendly == 2){
                            friendText.innerHTML = 'Bạn bè';
                            changeFriend.classList = 'selectRelation hiddenSelect';
                            document.getElementById('advanceFriendship').classList = 'hidden';
                            friendly = 1;
                        }
                        else if(friendly == -1){
                            friendText.innerHTML = 'Xóa yêu cầu';
                            changeFriend.classList = 'selectRelation';
                            friendly = 0;
                        }
                        else{
                            friendText.innerHTML = "Kết bạn";
                            changeFriend.classList = 'selectRelation';
                            document.getElementById('advanceFriendship').classList = 'hidden';
                            friendly = -1;
                        }
                    }
                    else
                        console.log(data)
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err);
            })
        }
        function followChangeFollow(){
            var type = 'addfollow';
            if(follower) type = 'unfollow';
            fetch('/profile/relation',
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({type: type, to: member})
            }).then(result => {
                result.json().then(data => {
                    if(data.success){
                        if(follower){
                            followText.innerText = 'Theo dõi';
                            changeFollow.classList = 'selectRelation';
                            document.getElementById('advanceFollow').classList = 'hidden';
                            follower = 0;
                        }
                        else{
                            followText.innerText = 'Đang theo dõi';
                            changeFollow.classList = 'selectRelation hiddenSelect';
                            follower = 1;
                        }
                    }
                    else
                        console.log(data)
                }).catch(err => {
                    console.log(err)
                })
            }).catch(err => {
                console.log(err);
            })
        };
        {//friend
            changeFriend.addEventListener('click', function(){
                if(userinfo && friendly != 1){
                    followChangeFriend();
                }
                else if(!userinfo){
                    document.getElementById('loginButton').click();
                }
            });
            changeFriend.addEventListener('mouseover', function(){
                if(userinfo && friendly == 1)
                    document.getElementById('advanceFriendship').classList = `advanceRelation`;
            });
            changeFriend.addEventListener('mouseout', function(){
                if(userinfo && friendly == 1)
                    document.getElementById('advanceFriendship').classList = `hidden`;
            });
            document.getElementById('unFriend').addEventListener('click', followChangeFriend);
        }
        {//follow
            changeFollow.addEventListener('click', function(){
                if(userinfo && !follower){
                    followChangeFollow();
                }
                else if(!userinfo){
                    document.getElementById('loginButton').click();
                }
            });
            changeFollow.addEventListener('mouseover', function(){
                if(userinfo && follower)
                    document.getElementById('advanceFollow').classList = `advanceRelation`;
            });
            changeFollow.addEventListener('mouseout', function(){
                if(userinfo && follower)
                    document.getElementById('advanceFollow').classList = `hidden`;
            });
            document.getElementById('unFollow').addEventListener('click', followChangeFollow);
        }
        document.getElementById('addinbox').addEventListener('click', function(){
            if(userinfo){
                message.box(user);
                document.getElementById(`write_inbox_${user._id}`).focus();
            }
            else document.getElementById('loginButton').click()
        });
    }
    else{
        document.getElementById('changeInfo').addEventListener('click', function(){
            var changeUserInfoHolder = ["Tên thật của bạn", 0, "sex", "", "Bạn sinh ra ở dâu?", "Bạn đang sống ở đâu?"];
            var changeUserInfo = document.getElementById('infoList');
            infoHTML = `
                <form action="/" method="POST" id="form_changeInfo">
            `;
            infoKey.map((field, index) => {
                if(field != "email" && field != "sex")
                    infoHTML += `
                        <div class="infoLine">
                            <div class="infoBox">
                                ${infoTitle[index]}:
                            </div>
                            <div class="input">
                                <input id="changeinfo_${field}" type="${field == 'birthday' ? "date" :"text"}" placeHolder="${changeUserInfoHolder[index]}"value="${infoList[field] || ""}">
                            </div>
                        </div>
                    `;
                else if(field == "sex")
                    infoHTML += `
                        <div class="infoLine">
                            <div class="infoBox">
                                ${infoTitle[index]}:
                            </div>
                            <div class="input">
                                <select id="changeinfo_${field}">
                                    <option value="0">Chọn</option">
                                    <option value="1"${sex == "Nam" ? " selected" : ""}>Nam</option">
                                    <option value="2"${sex == "Nữ" ? " selected" : ""}>Nữ</option">
                                    <option value="3"${sex == "Khác" ? " selected" : ""}>Khác</option">
                                </select>
                            </div>
                        </div>
                    `;
            });
                infoHTML += `
                    <div class="infoLine">
                        <div class="infoBox cancel" id="cancelChangeInfo">
                            Hủy
                        </div>
                        <div class="input submit">
                            <input type="submit" value="Chấp nhận">
                        </div>
                    </div>
                </form>
            `;
            changeUserInfo.innerHTML = infoHTML;
            document.getElementById('cancelChangeInfo').addEventListener('click', renderBasicInfo);
            document.getElementById('form_changeInfo').addEventListener('submit', function(e){
                e.preventDefault();
                var dataChange = {
                    name: document.getElementById('changeinfo_name').value,
                    sex: document.getElementById('changeinfo_sex').value,
                    birthday: document.getElementById('changeinfo_birthday').value,
                    country: document.getElementById('changeinfo_country').value,
                    live: document.getElementById('changeinfo_live').value
                };
                fetch('/profile/userinfo', {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataChange)
                }).then(result => {
                    result.json().then(changedData => {
                        if(changedData.success){
                            user = changedData.data;
                            renderBasicInfo();
                        }
                    }).catch(err => {
                        console.log(err)
                    })
                }).catch(err => {
                    console.log(err)
                })
            })
        })
    }
}
function renderAdvancedInfo(data) {
    var placeHolder = setStringStatus();
    document.getElementById('advancedInfo').innerHTML = `
        <div class="relationInfo">
            <div class="relationButton" id="images">
                <div class="relationText">
                    Ảnh
                </div>
            </div>
            <div class="relationButton" id="friends">
                <div class="relationText">
                    Bạn bè
                </div>
            </div>
            <div class="relationButton" id="fans">
                <div class="relationText">
                    Fans
                </div>
            </div>
            <div class="relationButton" id="idols">
                <div class="relationText">
                    Idol
                </div>
            </div>
        </div>
        <div class="relationContainer" id="relation">
        </div>
        <div class="postWall">
            <textarea id="postWall" placeHolder="${placeHolder}"></textarea>
        </div>
    `;
    document.getElementById("postWall").addEventListener('click', function(){
        document.getElementById("input-status").click();
    });
    document.getElementById("images").addEventListener('click', function(){
        document.getElementById("images").classList = "relationButton relationActive";
        document.getElementById("friends").classList = "relationButton";
        document.getElementById("fans").classList = "relationButton";
        document.getElementById("idols").classList = "relationButton";
        document.getElementById("relation").innerHTML = `
            <div class="photoContainer" id="imageContainer">
                Đang tải...
            </div>
        `;
        fetch(`/post/image/${member}`, {method: 'GET'})
        .then(result => {
            result.json()
            .then(postList => {
                if(postList.success){
                    console.log(postList);
                    var imageContainer = document.getElementById("imageContainer");
                    imageContainer.innerHTML = "";
                    postList.data.map((post, index) => {
                        let imgTime = time.get(post.createdAt);
                        imageContainer.insertAdjacentHTML('beforeend', `
                            <div class="imageBox">
                                <div class="imageItem" id="photo_${post._id}" style="background-image: url('/photo/${post.image}')">
                                    <div class="photoTime">${imgTime[3]}</div>
                                </div>
                            </div>
                        `);
                        document.getElementById(`photo_${post._id}`).addEventListener('click', function(){
                            let indexImage = index;
                            var photoView = document.documentElement.querySelectorAll('div.showForm')[0];
                            if(!photoView){
                                photoView = document.createElement('div');
                                document.documentElement.appendChild(photoView);
                                photoView.classList = 'showForm';
                            }
                            photoView.innerHTML = `
                                <div class="photoViewContainer">
                                    <div class="photoViewBox" id="photoViewBox">
                                        <div class="photoViewItem" id="photo_view_${post._id}" title="Xem tin đầy đủ" style="background-image: url('/photo/${post.image}')">
                                        </div>
                                    </div>
                                    <div class="${index == 0 ? "hidden" : "photoPagePrevious"}" id="photoPagePrevious">
                                        <div class="photoPageText">
                                            < Trước
                                        </div>
                                    </div>
                                    <div class="${index == postList.data.length - 1 ? "hidden" : "photoPageNext"}" id="photoPageNext">
                                        <div class="photoPageText">
                                            Tiếp >
                                        </div>
                                    </div>
                                    <div class="closeButton" id="close-view" title="Đóng">
                                        X
                                    </div>
                                </div>
                            `;
                            document.getElementById(`photo_view_${post._id}`).addEventListener('click', function(e){
                                window.open(`/post/view/${post._id}`);
                            });
                            document.getElementById('photoPagePrevious').addEventListener('click', function(e){
                                if(indexImage - 1 >= 0){
                                    if(indexImage - 1 == 0) document.getElementById('photoPagePrevious').classList = "hidden";
                                    else document.getElementById('photoPageNext').classList = "photoPageNext";
                                    indexImage --;
                                    document.getElementById('photoViewBox').innerHTML = `
                                        <div class="photoViewItem" id="photo_view_${postList.data[indexImage]._id}" title="Xem tin đầy đủ" style="background-image: url('/photo/${postList.data[indexImage].image}')">
                                        </div>
                                    `;
                                    document.getElementById(`photo_view_${postList.data[indexImage]._id}`).addEventListener('click', function(e){
                                        window.open(`/post/view/${postList.data[indexImage]._id}`);
                                    });
                                }
                            });
                            document.getElementById('photoPageNext').addEventListener('click', function(e){
                                if(indexImage + 1 < postList.data.length){
                                    if(indexImage + 1 == postList.data.length - 1) document.getElementById('photoPageNext').classList = "hidden";
                                    else document.getElementById('photoPagePrevious').classList = "photoPagePrevious";
                                    indexImage ++;
                                    document.getElementById('photoViewBox').innerHTML = `
                                        <div class="photoViewItem" id="photo_view_${postList.data[indexImage]._id}" title="Xem tin đầy đủ" style="background-image: url('/photo/${postList.data[indexImage].image}')">
                                        </div>
                                    `;
                                    document.getElementById(`photo_view_${postList.data[indexImage]._id}`).addEventListener('click', function(e){
                                        window.open(`/post/view/${postList.data[indexImage]._id}`);
                                    });
                                }
                            });
                            photoView.addEventListener('click', function(e){
                                if(e.target.querySelectorAll('div.photoViewContainer').length)
                                document.getElementById('close-view').click();
                            });
                            document.getElementById('close-view').addEventListener('click', function(){
                                photoView.remove();
                            });
                        })
                    })
                    if(!postList.data.length){
                        imageContainer.innerHTML = `<div class="nullContainer">Không có ảnh nào để hiển thị</div>`;
                    }
                }
            })
        }).catch(err => {
            console.log(err);
        })
    });
    document.getElementById("friends").addEventListener('click', function(){
        document.getElementById("images").classList = "relationButton";
        document.getElementById("friends").classList = "relationButton relationActive";
        document.getElementById("fans").classList = "relationButton";
        document.getElementById("idols").classList = "relationButton";
        document.getElementById("relation").innerHTML = `
            <div class="friendsContainer" id="friendsContainer">
            </div>
        `;
        var friendsContainer = document.getElementById("friendsContainer");
        let friendsLength = 0;
        user.relation.friends.map(friend => {
            if(friend.friendship == 1){
                friendsContainer.insertAdjacentHTML('beforeend', `
                    <div class="userInfoContainer">
                        <div class="userInfoAvatar">
                            <div class="photo">
                                <a href="/profile/${friend.friend._id}">
                                    <img class="newsUserLink" src="/image/avatar/${friend.friend._id}">
                                </a>
                            </div>
                        </div>
                        <div class="userInfoUsername">
                            <a class="newsUsername" href="/profile/${friend.friend._id}" title="Trang cá nhân">${friend.friend.username}</a>
                        </div>
                    </div>
                `);
                friendsLength ++;
            }
        })
        if(!friendsLength){
            friendsContainer.innerHTML = `<div class="nullContainer">Không có bạn bè để hiển thị</div>`;
        }
    });
    document.getElementById("fans").addEventListener('click', function(){
        document.getElementById("images").classList = "relationButton";
        document.getElementById("friends").classList = "relationButton";
        document.getElementById("fans").classList = "relationButton relationActive";
        document.getElementById("idols").classList = "relationButton";
        document.getElementById("relation").innerHTML = `
            <div class="fansContainer" id="fansContainer">
            </div>
        `;
        var fansContainer = document.getElementById("fansContainer");
        user.relation.fans.map(fan => {
            fansContainer.insertAdjacentHTML('beforeend', `
                <div class="userInfoContainer">
                    <div class="userInfoAvatar">
                        <div class="photo">
                            <a href="/profile/${fan._id}">
                                <img class="newsUserLink" src="/image/avatar/${fan._id}">
                            </a>
                        </div>
                    </div>
                    <div class="userInfoUsername">
                        <a class="newsUsername" href="/profile/${fan._id}" title="Trang cá nhân">${fan.username}</a>
                    </div>
                </div>
            `);
        })
        if(!user.relation.fans.length){
            fansContainer.innerHTML = `<div class="nullContainer">Không có người theo dõi</div>`;
        }
    });
    document.getElementById("idols").addEventListener('click', function(){
        document.getElementById("images").classList = "relationButton";
        document.getElementById("friends").classList = "relationButton";
        document.getElementById("fans").classList = "relationButton";
        document.getElementById("idols").classList = "relationButton relationActive";
        document.getElementById("relation").innerHTML = `
            <div class="idolsContainer" id="idolsContainer">
            </div>
        `;
        var idolsContainer = document.getElementById("idolsContainer");
        user.relation.follows.map(follower => {
            idolsContainer.insertAdjacentHTML('beforeend', `
                <div class="userInfoContainer">
                    <div class="userInfoAvatar">
                        <div class="photo">
                            <a href="/profile/${follower._id}">
                                <img class="newsUserLink" src="/image/avatar/${follower._id}">
                            </a>
                        </div>
                    </div>
                    <div class="userInfoUsername">
                        <a class="newsUsername" href="/profile/${follower._id}" title="Trang cá nhân">${follower.username}</a>
                    </div>
                </div>
            `);
        })
        if(!user.relation.follows.length){
            idolsContainer.innerHTML = `<div class="nullContainer">Chưa có người để theo dõi</div>`;
        }
    });
}
function featuredLoad(){
    var wall = document.getElementById("wall");
    var featured = document.getElementById("featured");
    var animation = 0;
    var origin = wall.getBoundingClientRect();
    document.addEventListener("scroll", function(){
        var rect = wall.getBoundingClientRect();
        if(rect.top < origin.top-42 && !animation){
            featured.style.animationPlayState = "paused";
            featured.style.animationName = "sortBottom";
            featured.style.animationPlayState = "running";
            animation = 1;
        }
        else if(rect.top > origin.top-42 && animation){
            featured.style.animationPlayState = "paused";
            featured.style.animationName = "sortTop";
            featured.style.animationPlayState = "running";
            animation = 0;
        }
    })
}
function setStringStatus(){
    if(myWall){
        return "Hôm nay bạn thấy thế nào?";
    }
    else{
        return "Đăng lên tường";
    }
}
const load = {
    load: wallLoad
}
export default load;
