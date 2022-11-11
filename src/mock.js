const dataObj = {
    items: new Array(10000).fill('').map((item, index) => {
        return {
            id: index,
            name: 'mock',
            polygons: randomLnglat(4)
        }
    })
}

const geoJSON = {
    type: "FeatureCollection",
    features: new Array(10000).fill('').map(item => {
        return {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: randomLnglat(4)
            },
            properties: {
                name: "Dinagat Islands"
            }
        }
    })
}
// console.log(randomLnglat(4), 'random')

function randomLnglat(num) {
    const lng = Number((113.0 + Math.random() * 0.1).toFixed(5))
    const lat = Number((22.9 + Math.random() * 0.1).toFixed(5))
    return new Array(num).fill('').map((item, index) => {
        if (index === 0) return [lng, lat]
        else if (index === 1) return [lng + 0.0005, lat]
        else if (index === 2) return [lng + 0.0005, lat - 0.0005]
        else if (index === 3) return [lng, lat - 0.0005]
    })
}