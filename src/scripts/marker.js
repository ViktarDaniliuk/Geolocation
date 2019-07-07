export default (map, coords, popup, clusterer) => {
    // создаем placepark
    const marker = new ymaps.Placemark({
        coords
    })


    marker.events.add('click', () => {
        const markCoords = marker.geometry.getCoorbinates();
        // получаем координаты места нажатия кнопки мыши и добавляем их в html, чтобы открыть это окно по этим координатам
        popup.setattributes('data-coordsX', markCoords[0]);
        popup.setattributes('data-coordsX', markCoords[1]);
    })

    // добавляем маркер на карту
    map.geoObjects.add(marker);

    // при необходимости добавляем маркер в кластер (если масштаб маленький и маркеры находятся близко друг к другу)
    clusterer.add(marker);
}
