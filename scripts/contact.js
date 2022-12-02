const bouton = document.querySelector('a');
const popup = document.querySelector('#conteneur');
const hehe = document.querySelector('#bienessaye')
const form = document.querySelector('form');
const restart = document.querySelectorAll('.bouton')

console.log(restart)

html = document.documentElement;
bouton.addEventListener('mouseover', teleport);

const nameInput = document.querySelector("#nom");
let nameValid = false;

const surnameInput = document.querySelector("#prenom")
let surnameValid = false;

const mailInput = document.querySelector("#mail");
let mailValid = false;

function elEventListener(el, f) {
  el.addEventListener("keyup", (e) => {
    const regexp = new RegExp(el.pattern)
    f(regexp.test(el.value))
  });
}

elEventListener(nameInput, (v) => nameValid = v)
elEventListener(surnameInput, (v) => surnameValid = v)
elEventListener(mailInput, (v) => mailValid = v)

function elementPosition(a) {
  var b = a.getBoundingClientRect();
  return {
    clientX: a.offsetLeft,
    clientY: a.offsetTop,
    viewportX: (b.x || b.left),
    viewportY: (b.y || b.top)
  }
}

var pos = elementPosition(bouton);
var x = pos.clientX;
var y = pos.clientY;
console.log(x);
console.log(y);
var maxX = html.clientWidth - x
var maxY = html.clientHeight - y


function teleport() {
  if (nameValid && surnameValid && mailValid){
    bouton.style.transform = `translate(${0}px, ${0}px)`;
    bouton.textContent = "Envoyer";
    bouton.addEventListener("click", (e) => {
      popup.style.display = "flex";
      form.style.display = "none";
      bouton.href = "#";
      bouton.target = '';
    })
    

  }
  else{
  let coordX = Math.floor((Math.random() - 0.5) * (maxX) * 0.95);
  let coordY = Math.floor((Math.random() - 0.5) * (maxY) * 0.95);
  bouton.style.transform = `translate(${coordX}px, ${coordY}px)`;
  bouton.textContent = "NON !!!";

  }
}

window.addEventListener("keydown", (e) => {
  if (e.code == "Enter"){
    if (!nameValid || !surnameValid || !mailValid){
      hehe.style.display = "flex";
      form.style.display = "none";
      bouton.href = "#";
      bouton.target = '';
    }
    else{
      popup.style.display = "flex";
      form.style.display = "none";
      bouton.href = "#";
      bouton.target = '';
    }
  }

})

for (const r of restart) {
  r.addEventListener('click', (e) =>{
    location.reload();
  })
}