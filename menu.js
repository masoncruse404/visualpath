window.onload = addListeners();

function addListeners(){
    document.getElementById('myMenu').addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup', mouseUp, false);

}

function mouseUp()
{
    
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e){
  e.preventDefault();
  window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
  e.preventDefault();
    var div = document.getElementById('myMenu');
  div.style.position = 'absolute';
  div.style.top = e.clientY + 'px';
  div.style.left = e.clientX + 'px';
}

function closeMenu(){
    document.getElementById('myMenu').style.display = 'none';
    document.getElementById('settings').style.display = 'block';
}

function closedMenu(){
    document.getElementById('myMenu').style.display = 'block';
    document.getElementById('settings').style.display = 'none';
   
}