import time from '/JS/time.js';
var last = Date.now();
var order = 0;
var userinfo, member;
function newsLoad(user, memberId){
    userinfo = user;
    member = memberId;
    loadBottom();
    newsFeed(userinfo);
    setTimeout(() => {
        document.addEventListener('scroll', checking);
    }, 1000);
}
function checking(){
    if(document.body.scrollHeight - window.pageYOffset < window.innerHeight){
        newsFeed(member);
        document.removeEventListener('scroll', checking);
    }
}
function newsFeed(){
    var url = `/post/news?order=${order}&time=${last}${member ? "&id=" + member : ""}`;
    fetch(url,
    {
        method: 'GET'
    }).then(result => {
        result.json().then(data => {
            var check = 0;
            data.map(news => {
                if(!document.getElementById(`info_${news.active._id}`)){
                    render(news);
                    order ++;
                    check ++;
                }
            });
            if(check){
                last = Date.now();
                document.addEventListener('scroll', checking);
            }
        }).catch(err => {
            console.log({ers: err});
        });
    }).catch(err => {
        console.log({err: err});
    });
}
function render(data){
    renderStatus(data);
    renderActive(data.active);
}
function renderStatus(data){
    var privacyString = ["Chỉ mình tôi", "Bạn bè", "Công khai"];
    var privacy = privacyString[data.privacy - 1];
    var privacyTitle = "Chia sẻ với tất cả mọi người";
    if(data.privacy == 1) privacyTitle = "Chỉ bạn mới thấy bài đăng này";
    else if(data.privacy == 2) privacyTitle = "Chia sẻ với bạn bè."
    var feelingString = ['hạnh phúc','tuyệt vời','vui vẻ','thú vị','hi vọng','đáng yêu','buồn','giận giữ'];
    var feeling = ""; var to = ""; var statusType = "";
    if(data.to)
        to = ` cùng với <a href="/profile/${data.to._id}">${data.to.username}</a>`;

    if(data.feeling)
        feeling = ` đang cảm thấy ${feelingString[data.feeling]}`;
    if(data.imageType == 1){
        statusType = ` đã thay đổi ảnh đại diện`;
    }
    else if(data.imageType == 2) statusType = " đã thay đổi ảnh bìa";
    var status = data.status;
    status = status.replace(/\n/g, "<br>");
    if(status.length<200 && status.split("<br>").length<6 && data.image==""){
        status = `<div class="large">${status}</div>`;
    }
    else if(status.length>500){
        status = `
            <div id="status_${data._id}">
                ${status.slice(0, 500)}
                <a href="#" id="seemore_${data._id}">... Xem thêm</a>
            </div>
        `;

    }
    else if(status.split("<br>").length>10){
        status = `
            <div id="status_${data._id}">
                ${status.split("<br>").slice(0,10).join("<br>")}
                <a href="#" id="seemore_${data._id}">... Xem thêm</a>
            </div>
            `;
    }
    var image = "";
    if(data.image!="")
        image = `
            <div class="newsPhotoContainer">
                <div class="newsPhoto">
                    <image src="/photo/${data.image}">
                </div>
            </div>`;
    var createdAt = time.get(data.createdAt);
    document.getElementById('loadNews').insertAdjacentHTML('beforebegin', 
    `<div class="newsContainer">
        <div class="newsInfo">
            <div class="newsUserContainer">
                <div class="newsAvatar">
                    <div class="photo">
                        <a href="/profile/${data.author._id}">
                            <img class="newsUserLink" src="/image/avatar/${data.author._id}"/>
                        </a>
                    </div>
                </div>
                <div class="newsUser">
                    <div class="userInfo">
                        <a class="newsUsername" href="/profile/${data.author._id}">${data.author.username}</a>${feeling}${to}${statusType}
                    </div>
                    <div class="postInfo">
                        <div class="newsPrivacy" title="${privacyTitle}">
                            ${privacy}
                        </div>
                        <div class="newsTime" title="${createdAt[2]}">
                            ${createdAt[0]}
                    </div>
                </div>
                </div>
                
            </div>
            <div class="activeInfo">
                <div class="infoContainer" id="info_${data.active._id}">
                </div>
            </div>
        </div>
        <div class="newsBody">
            <div class="newsStatus">
                <div class="newsContent">
                    ${status}
                </div>
                ${image}
            </div>
            <div class="active" id="active_${data.active._id}">
            </div>
        </div>
    </div>
    `);
    var seemore = document.getElementById(`seemore_${data._id}`);
    if(seemore){
        seemore.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById(`status_${data._id}`).innerHTML = data.status.replace(/\n/g, "<br>");
        })
    }
}
function renderActive(active){
    document.getElementById(`active_${active._id}`).innerHTML = 
    `
        <div class="activeContainer">
            <div class="emotionContainer" id="emotion_${active._id}">
            </div>
            <div class="show" id="show_${active._id}">Xem bình luận</div>
        </div>
        <div class="writeComment">
            <form id="form_${active._id}">
                <div class="form-group">
                    <div class="comment-textarea">
                        <textarea id="write_${active._id}" placeholder="Viết bình luận"></textarea>
                    </div>
                    <div class="input">
                        <input type="submit" value ="Gửi"></input>
                    </div>
                </div>
            </form>
        </div>
        <div class="commentContainer" id="comment_${active._id}">
        </div>
    `;
    renderInfo(active);
    renderEmotion(active.emotion, active._id);
    renderComment(active);
    document.getElementById(`form_${active._id}`).addEventListener('submit', function(e){
        e.preventDefault();
        if(userinfo){
            var data = {
                _id: active._id,
                comment: document.getElementById(`write_${active._id}`).value
            }
            if(data.comment == "")
                document.getElementById(`write_${active._id}`).placeholder = "Hãy vết gì đó để bình luận bài viết này";
            else
                postComment(data);
            document.getElementById(`write_${active._id}`).value = "";
        }
        else{
            document.getElementById('loginButton').click();
        }
    });
}
function renderInfo(active){
    var emLength = active.emotion.length;
    if(emLength) emLength = 
    `
        <div class="lineInfo">
            <div class="info">
                ${emLength}00 lượt thích
            </div>
        </div>
    `;
    else emLength = "";
    var cmtLength = active.comment.length;
    if(cmtLength) cmtLength = 
    `
        <div class="lineInfo">
            <div class="info">
                ${cmtLength}0 bình luận
            </div>
        </div>
    `;
    else cmtLength = "";
    document.getElementById(`info_${active._id}`).innerHTML = emLength + cmtLength;
}
function renderEmotion(emotionList, activeId, commentId){
    var id = `emotion_${activeId}`;
    if(commentId)
        id = `${id}_${commentId}`;
    var emotion;
    if(emotionList.length){
        if(userinfo)
            emotion = emotionList.find(em => {
                return em.author._id == userinfo._id;
            });
    }
    if(!emotion) emotion = 0;
    else emotion = emotion.emotion;
    var emotionContainer = "";
    for(let i=1; i<6; i++){
        emotionContainer += `
            <div class="emotion${i == emotion ? " used" : ""}">
                <span class="emotion_${i}" id="${id}_${i}">
                    E${i}
                </span>
            </div>
        `;
    }
    if(commentId){
        document.getElementById(`info_${id}`).classList = (emotionList.length ? "commentInfo" : "");
        document.getElementById(`info_${id}`).innerText = (emotionList.length ? emotionList.length + " người thích" : "");
    }
    document.getElementById(id).innerHTML = emotionContainer;
    for(let i=1; i<6; i++){
        document.getElementById(`${id}_${i}`).addEventListener('click', function(){
            if(userinfo){
                let data = {
                    active_id: activeId,
                    comment_id: commentId,
                    emotion: i
                };
                if(i == emotion){
                    emotion = 0;
                    data.emotion = 0;
                }
                postEmotion(data);
            }
            else{
                document.getElementById('loginButton').click();
            }
        })
    };

}
function renderComment(active){
    var show = document.getElementById(`show_${active._id}`);
    var new_show = show.cloneNode(true);
    show.parentNode.replaceChild(new_show, show);
    show = document.getElementById(`show_${active._id}`);
    show.addEventListener('click', function(){
        if(show.innerText == `Xem bình luận`){
            show.innerText = 'Ẩn bình luận';
            document.getElementById(`comment_${active._id}`).classList = 'viewComment';
            document.getElementById(`comment_${active._id}`).innerHTML = "";
            active.comment.map((comment, index) => {
                var em = comment.emotion.length;
                let timeComment = time.get(comment.createdAt);
                document.getElementById(`comment_${active._id}`).insertAdjacentHTML('beforeend',
                `<div class="commentLine">
                    <div class="commentContainer">
                        <div class="commentAvatar">
                            <a href="/profile/${comment.author._id}">
                                <img src="/image/avatar/${comment.author._id}">
                            </a>
                        </div>
                        <div class="comment">
                            <span class="commentUsername">
                                <a href="/profile/${comment.author._id}">
                                    ${comment.author.username}
                                </a>
                            </span>
                            <span class="commentText">
                                ${comment.comment.replace(/\n/g, "<br>")}
                            </span>
                        </div>
                    </div>
                    <div class="commentEmotion">
                        <div class="emotionContainer" id="emotion_${active._id}_${comment._id}">
                        </div>
                        <div ${em > 0 ? 'class="commentInfo"' : ""} id="info_emotion_${active._id}_${comment._id}">
                        ${em > 0 ? em + 'người thích' : ""}
                        </div>
                        <div class="commentTime" title="${timeComment[2]}">
                            ${timeComment[1]}
                        </div>
                    </div>
                </div>`
                );
                renderEmotion(comment.emotion, active._id, comment._id);
            });
            if(active.comment.length == 0)
                document.getElementById(`comment_${active._id}`).innerHTML = 
                `<div class="medium">Hãy là người đầu tiên bình luận về bài viết này!</div> `;
        }
        else{
            show.innerText = 'Xem bình luận';
            document.getElementById(`comment_${active._id}`).classList = 'hidden';
        }
    });
}
function postEmotion(dataEmotion){
    fetch("/post/emotion",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataEmotion)
    }).then(result => {
        result.json().then(data => {
            if(data.success){
                renderInfo(data.data);
                if(dataEmotion.comment_id){
                    data.data.comment.map(comment => {
                        if(comment._id == dataEmotion.comment_id){
                            renderEmotion(comment.emotion, data.data._id, comment._id);
                        }
                    });
                }
                else
                    renderEmotion(data.data.emotion, dataEmotion.active_id);
            }
            else{
                // alert('Phiên làm việc của bạn đã hết! \n Vui lòng đăng nhập lại');
                // location.reload();
            }
        }).catch(err => {
            console.log(err);
        });
    }).catch(err => {
        console.log(err);
    })
}
function postComment(dataComment){
    fetch("/post/comment",
    {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(dataComment)
    }).then(result => {
        result.json().then(data => {
            if(data.success){
                renderInfo(data.data);
                renderComment(data.data);
                if(document.getElementById(`show_${dataComment._id}`).innerText == `Ẩn bình luận`)
                    document.getElementById(`show_${dataComment._id}`).click();
                document.getElementById(`show_${dataComment._id}`).click();
            }
            else{
                alert('Phiên làm việc của bạn đã hết! \n Vui lòng đăng nhập lại');
                location.reload();
            }
        }).catch(err => {
            console.log(err);
        })
    }).catch(err => {
        console.log(err);
    })
}
function loadBottom(){
    document.getElementById('news').insertAdjacentHTML('beforeend', `
        <div class="bottomNews" id="loadNews">
            <div class="loadNews">
                ${member ? `Hiển thị thêm` : `Xem thêm tin`}
            </div>
        </div>
    `);
    document.getElementById('loadNews').addEventListener('click', function(){
        newsFeed(userinfo);
    });
}
const load = {
    load: newsLoad
}
export default load;
