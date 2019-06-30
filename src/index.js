ymaps.ready(init);

function init() {
    let myPlacemark;
    let coords;
    let addressText;
    let popup = false;
    let myMap = new ymaps.Map('map', {
            center: [52.237750, 21.018374],
            zoom: 17
        });

    // вешаем событие на клик по карте
    myMap.events.add('click', e => {
        // получаем координаты клика
        coords = e.get('coords');
        // на клик по карте показываем popup
        showPopup();
        // полчаем адрес и добавляем его в popup
        getAddress(coords);

        createP();
    })

    createAllPlacemark(myMap);

    const submitBtn = document.getElementById('submit');
    const geocode = () => ymaps.geocode(coords).then(function (res) {
        let comment;
        let adr;
        let firstGeoObject = res.geoObjects.get(0);

        adr = firstGeoObject.getAddressLine();
        comment = localStorage.getItem(adr);
        createComment(comment);
        console.log('2');
    });
    const handlePlaceMarkClick = e => {
        coords = e.get('coords');
        geocode();
        console.log('1');
    }

    const handleSubmit = e => {
        e.preventDefault();

        if (isFormCompleted()) {
            addStore(coords);
            myPlacemark = createPlacemark(coords);
            myPlacemark.events.add('click', handlePlaceMarkClick);

            myMap.geoObjects.add(myPlacemark);
            closePopup();
        }
    }

    // при нажатии на кнопку "Добавить" проверяем заполнены ли все поля, добавляем placemark на карту, собираем данные с формы,добавляем в localStorage и закрываем окно
    submitBtn.addEventListener('click', handleSubmit);
}

// -----------------------------------------------------------------
// наносим существующие маркеры на карту при первом старте
function createAllPlacemark(myMap) {
    let objPlacemarks = localStorage;
    let coords;

    for (let key in objPlacemarks) {
        if (JSON.parse(localStorage.getItem(key)) !== null) {
            coords = JSON.parse(localStorage.getItem(key)).coords;
            console.log(coords);
            myPlacemark = createPlacemark(coords);
            myMap.geoObjects.add(myPlacemark);
        }
    }
}
// -----------------------------------------------------------------

// на клик по крестику скрываем popup
    document.getElementById('close').addEventListener('click', closePopup);

// получаем адрес по координатам и добавляем в форму
function getAddress(coords) {
    var adr,
        myAdr = ymaps.geocode(coords).then(function (res) {
        var firstGeoObject = res.geoObjects.get(0);

        // добавляем адресс в форму
        adr = firstGeoObject.getAddressLine();
        document.getElementById('address').innerHTML = adr;
    });
}

// создаем параграф с сообщением об отсутствии отзывав
function createP() {
    var comments = document.querySelector('.comments');
    var p = document.createElement('p');

    if (!document.querySelector('.text')) {
        p.className = 'text';
        p.innerText = 'Отзывов пока нет...';
        comments.append(p);
    }
}

// cоздание метки
function createPlacemark(coords) {
    return new ymaps.Placemark(coords, {}, {
        preset: 'islands#violetDotIconWithCaption',
        draggable: false
    });
}

// создание блока отзыва
function createComment(commentObj) {
    let frag = document.createDocumentFragment();
    let comment = document.createElement('div');
    let p = document.createElement('p');
    let name = document.createElement('span');
    let br = document.createElement('br');
    let placeName = document.createElement('span');
    let commentText = document.createElement('p');
    let comments = document.querySelector('.comments');
    let pText = document.querySelector('.text');


    commentObj = JSON.parse(commentObj);
    comment.className = 'comment';
    name.className = 'user-name';
    name.innerText = commentObj.name;
    placeName.className = 'place-name';
    placeName.innerText = commentObj.placeName;
    commentText.className = 'comment-text';
    commentText.innerText = commentObj.comment;
    p.append(name);
    p.append(br);
    p.append(placeName);
    comment.append(p);
    comment.append(commentText);
    frag.append(comment);
    showPopup();
    comments.append(frag);
}

// ----------------------------------------------------------------------
// создать форму и вставить в .container при первой инициализации (т.е. при первом запуске программы)
function createForm() {
    let form = document.createElement('form');
    let inputName = document.createElement('input');
    let inputPlace = document.createElement('input');
    let textArea = docuemnt.createElement('textarea');
    let submitButton = document.createEmeent('buttoon');
    let container = document.querySelector('.container');

    // настроить атрибуты всех полей ввода при помощи setAttribute

    // вставить все элементы в форму

    container.appendChild('form');
}
// -----------------------------------------------------------------------

// очистка формы после отправки данных в localStorage
function cleanForm() {
    document.form.reset()
}

// -----------------------------------------------------------------------
// собираем данные со всех полей формы (в т.ч. координаты), создаем объект и добавляем его в localStorage
function addStore(coords) {
    let address = document.getElementById('address').textContent;
    let name = document.getElementById('name');
    let placeName = document.getElementById('place-name');
    let comment = document.getElementById('comment');
    let commentBlock = {};

    commentBlock.name = name.value;
    commentBlock.placeName = placeName.value;
    commentBlock.comment = comment.value;
    commentBlock.coords = coords;
    // если адресс существует, то создавать массив объктов и
    localStorage.setItem(address, JSON.stringify(commentBlock));
    cleanForm();
}
// -----------------------------------------------------------------------

// -----------------------------------------------------------------------
// получаем данные с localStorage и добывляем их в блоки с комментариями
function getStore() {

}
// -----------------------------------------------------------------------

// проверяем заполнены ли все поля формы
function isFormCompleted() {
    let name = document.getElementById('name').value;
    let placeName = document.getElementById('place-name').value;
    let comment = document.getElementById('comment').value;

    if (Boolean(name) && Boolean(placeName) && Boolean(comment)) {
        return true;
    }
    alert('Заполните все поля формы');

    return false;
}

// показываем popup
function showPopup() {
    var form = document.querySelector('.form-wrapper');

    form.classList.remove('hidden');
    document.getElementById('map').onclick = function(e) {
            var top = e.clientY;
            var left = e.clientX;
            var screenHeight = window.innerHeight;
            var screenWidth = window.innerWidth;

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
    }
}

// закрываем popup
function closePopup() {
    var comments = document.querySelector('.comments');

    comments.parentElement.parentElement.classList.add('hidden');

    // чистим div с комментариями (лучше при помощи функции очистить и комментарии и форму)
    comments.innerHTML = '';
}

// получаем размер экрана
function setSizeMap() {
    var screenHeight = window.innerHeight;
    var container = document.querySelector('.container');

    container.style.height = screenHeight + 'px';
}

setSizeMap();

//// на клик по карте показываем popup
//document.getElementById('map').addEventListener('click', showPopup);
//
//// на клик по крестике скрываем popup
//document.getElementById('close').addEventListener('click', closePopup);
//
//// на клик по кнопке "Добавить" сохраняем данные в localStorage
//document.getElementById('submit').addEventListener('click', addStore);



// сделать свои попопы (всплывающие окна)
// сделать свои balloons (кружочки показвающие отзывы)
// от яндекса нужно взять плэйсмарк в типах геообъектов (объекты на карте)
// GeoObjectCollection
// геообъект - это объект на карте, который имеет какие-то свойства, по которому можно кликнуть и получить дополнительную информацию (которые можно создать при помощи placemark)
//
//
