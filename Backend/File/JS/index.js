import userinfo from '/user/data-userinfo.js';
import taskbar from '/JS/taskbar.js';
import rightFollow from '/JS/right-follow.js';
import news from '/JS/news.js';
import message from '/JS/messages.js';

taskbar.load(userinfo);
var body = document.createElement('div');
body.classList = "container";
body.innerHTML = `
    <div class="news" id="news"></div>
    <div class="rightContainer">
        <div class="rightFollow">
            <div class="online" id="online"></div>
            <div class="notification" id="notification"></div>
        </div>
    </div>
`;
document.body.appendChild(body);
rightFollow.load(userinfo);
news.load(userinfo);