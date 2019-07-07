// получаем размер экрана
function setSizeMap() {
    var screenHeight = window.innerHeight;
    var container = document.querySelector('.container');

    container.style.height = screenHeight + 'px';
}

setSizeMap();

// на клик по карте показываем popup
document.getElementById('map').addEventListener('click', function(e) {
    var top = e.clientY;
    var left = e.clientX;
    var form = document.querySelector('.form-wrapper');
    var screenHeight = window.innerHeight;
    var screenWidth = window.innerWidth;

    form.classList.remove('hidden');

    // контролируем, что бы popup не выходило за пределы карты по высоте
    if (top < 205) {
        form.style.top = 5 + 'px';
    } else
    if (screenHeight - top < 325) {
        form.style.top = screenHeight - 535 + 'px';
    } else {
        form.style.top = top - 200 + 'px';
    }

    // контролируем, что бы popup не выходило за пределы карты по ширине
    if (left < 455) {
        form.style.left = left + 80 + 'px';
    } else {
        form.style.left = left - 450 + 'px';
    }
})

// скрываем popup
document.getElementById('close').addEventListener('click', function(e) {
    var comments = document.querySelector('.comments');

    this.parentElement.parentElement.classList.add('hidden');
    // чистим div с комментариями
    comments.innerHTML = '';
})
