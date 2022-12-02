const aled = document.querySelector("#cule");
aled.addEventListener("mouseover", (e) => {
  window.location.href = "https://www.youtube.com/watch?v=dQw4w9WgXcQ";
});

function helpme() {
  var audio = new Audio("gnome.mp3");
  audio.play();
}
var msg = alert("Atteignez et répondez à notre formulaire !!!");
const cursor = document.querySelector(".cursor"); /*Curseur chat debut*/

const positionElement = (e) => {
  const mouseY = e.clientY;
  const mouseX = e.clientX;

  cursor.style.transform = `translate3d(${mouseX - 50}px, ${
    mouseY - 1150
  }px, 0)`;
};
window.addEventListener("mousemove", positionElement); /*Curseur chat fin*/

window.addEventListener(
  "keydown",
  function (e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
      e.preventDefault();
    }
  },
  false
);

function ch_zoom() {
  document.body.style.zoom = "100%";
  setTimeout(ch_zoom, 100);
}
