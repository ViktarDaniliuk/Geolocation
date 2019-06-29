export default (coord) => {
    return fetch(`https://geocode-maps.yandex.ru/1.x/?apikey=<dcbcc347-ca94-452b-b918-d0dc3ce72247>&format=json&geocode=${coord.lat},${coord.lan}`)
        .then(response => response.json())
        .then(res => res)
} // этот метод по переданным в него координатам вернет данные об объекте находящемся по этим координатам
