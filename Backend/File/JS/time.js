function getTime(timeString){
    var now = new Date();
    var nY = now.getFullYear();
    var nM = now.getMonth();
    var nD = now.getDate();
    var nH = now.getHours();
    var nP = now.getMinutes();
    var time = new Date(timeString);
    var tY = time.getFullYear();
    var tM = time.getMonth();
    var tD = time.getDate();
    var tDay = time.getDay();
    var tH = time.getHours();
    var tP = time.getMinutes();
    var tS = time.getSeconds();
    var weekday = ["Chủ nhật","Thứ 2","Thứ 3","Thứ 4","Thứ 5","Thứ 6","Thứ 7"];
    var At = [];
    if(nY > tY){
        At[0] =  `${tD < 10 ? "0" + tD: tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1): (tM + 1)} năm ${tY}`;
    }
    else{
        if(nM > tM){
            At[0] =  `${tD < 10 ? "0" + tD: tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1): (tM + 1)}`;
        }
        else{
            if(nD > tD + 6){
                At[0] =  `${tD < 10 ? "0" + tD: tD} tháng ${(tM + 1) < 10 ? "0" + (tM + 1): (tM + 1)} lúc ${tH < 10 ? "0" + tH : tH}:${tP < 10 ? "0" + tP : tP}`; 
            }
            else{
                if(nD > tD + 1){
                    At[0] = `${weekday[tDay]}`;
                }
                else{
                    if(nD> tD){
                        At[0] = `Hôm qua`;
                    }
                    else{
                        if(nH > tH){
                            At[0] = `${nH-tH} giờ`;
                        }
                        else{
                            if(nP > tP){
                                At[0] = `${nP - tP} phút`;
                            }
                            else{
                                At[0] = `vừa xong`;
                            }
                        }
                    }
                }
            }
        }
    }
    var thickness = (Date.parse(now)-Date.parse(time))/1000;
    if(thickness < 60){
        At[1] = 'vừa xong';
    }
    else{
        thickness = thickness/60;
        if(thickness < 60){
            At[1] = Math.floor(thickness) + ' phút';
        }
        else{
            thickness = thickness/60;
            if(thickness < 24){
                At[1] = Math.floor(thickness) + ' giờ';
            }
            else{
                thickness = thickness/24;
                if(thickness < 30){
                    At[1] = Math.floor(thickness) + ' ngày';
                }
                else{
                    thickness = thickness/30;
                    if(thickness < 12){
                        At[1] = Math.floor(thickness) + ' tháng';
                    }
                    else{
                        thickness = thickness*30/365;
                        At[1] = Math.floor(thickness) + ' năm';
                    }
                }
            }
        }
    }
    At[2] = `${weekday[tDay]}, ${tD < 10 ? "0" + tD: tD} tháng ${(tM + 1) < 10 ? "0" + (tM +1) : tM +1} năm ${tY} lúc ${tH < 10 ? "0" + tH: tH}:${tP < 10 ? "0" + tP: tP}:${tS < 10 ? "0" + tS: tS}`
    At[3] = `${tH < 10 ? "0" + tH: tH}:${tP < 10 ? "0" + tP: tP}${((tD-nD)||(tM-nM)||(tY-nY)) ? ", " + (tD < 10 ? "0" + tD: tD) + "/" + ((tM + 1) < 10 ? "0" + (tM + 1): (tM + 1)) : ""}${(tY-nY) ? "/" + tY : ""}`
    return(At);
}
const time = {
    get: getTime
}
export default time;
