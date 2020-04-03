import origin from './origin';
function play(){
    let audio = new Audio(origin + '/Audio/light.mp3');
    audio.play();
}
export default {
    play: play
};