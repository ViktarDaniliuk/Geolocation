export default (map) => {
    // если масштаб маленький и маркеры находятся близко друг к другу, то они автоматически объеденятся в кластер
    var clusterer = new ymaps.Clusterer({
        clusterDisableClickZoom: true
    });

    clusterer.add(myGeoObjects);
    map.geoObjects.add(clusterer);
}
