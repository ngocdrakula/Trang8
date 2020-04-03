import userinfo from '/user/data-userinfo.js';
import taskbar from '/JS/taskbar.js';
import rightFollow from '/JS/right-follow.js';
import news from '/JS/news.js';
import wall from '/JS/wall.js'

var member = window.location.pathname.split("/")[2];
taskbar.load(userinfo, member);
var body = document.createElement('div');
body.classList = "container";
body.innerHTML = `
    <div class="news">
        <div class="wall" id="wall"></div>
        <div id="news"></div>
    </div>
    <div class="rightContainer">
        <div class="rightFollow">
            <div class="online" id="online"></div>
            <div class="notification" id="notification"></div>
        </div>
    </div>
`;
document.body.appendChild(body);
wall.load(userinfo, member);
news.load(userinfo, member);
rightFollow.load(userinfo);
