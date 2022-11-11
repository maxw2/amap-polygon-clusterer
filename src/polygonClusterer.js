ops = {
    SuperclusterOpt() { },
    markerOpt() { },
    polygonOpt() { }
}

class PolygonClusterer {
    map = null
    options = null
    data = null
    Supercluster = null
    group = null
    moveendEvent = null
    constructor(map, options = ops) {
        this.map = map
        this.options = { ...ops, ...options }
    }

    setGeoJson(data, option = { lnglatsKey: null }) {
        if (!data) return console.warn('GeoJson is null')
        // ObjectData 转换为 GeoJsonObject
        if (option.lnglatsKey && !data.features) {
            const json = {
                "type": "FeatureCollection",
                "features": data.map(item => {
                    return {
                        type: "Feature",
                        geometry: {
                            type: "Point",
                            coordinates: item[option.lnglatsKey][0],
                        },
                        polygons: item[option.lnglatsKey],
                        dataItem: {...item}
                    };
                })
            }
            this.data = json
            // GeoJson 转换为 GeoJsonObject
        } else if (data.features) {
            let json = {...data}
            json.features = data.features.map(item => {
                return {
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: (item.geometry && item.geometry.coordinates[0]) || [],
                    },
                    polygons: (item.geometry && item.geometry.coordinates) || [],
                    dataItem: {...item}
                };
            })
            
            this.data = json
        }
        else return console.warn('GeoJson is null')
        this.initSupercluster()
    }

    initSupercluster() {
        this.Supercluster = new Supercluster(this.options.SuperclusterOpt())
        this.Supercluster.load(this.data.features);

        this.initAMapEvent()
        this.onMouseEndListen() 
    }

    initAMapEvent() {
        if (!this.map) console.warn('map is null')
        this.moveendEvent = this.onMouseEndListen.bind(this)
        this.map.on('moveend', this.moveendEvent)
        this.map.on('zoomend', this.moveendEvent)
    }

    removeAMapEvent() {
        if (!this.map) console.warn('map is null')
        this.map.off('moveend', this.moveendEvent)
        this.map.off('zoomend', this.moveendEvent)
    }

    onMouseEndListen() {
        const bound = this.map.getBounds();
        const zoom = this.map.getZoom();
        const bounds = [
            bound.southwest.lng,
            bound.southwest.lat,
            bound.northeast.lng,
            bound.northeast.lat,
        ];
        const ClusData = this.Supercluster.getClusters(bounds, zoom);
        this.geoJSONGroup(ClusData);
    }
    
    geoJSONGroup(geoJsonData) {
        const that = this
        // 筛选点标记还是矢量图形
        // 判断依据是 polygons 值是否存在
        const json = {
            "type": "FeatureCollection",
            "features": geoJsonData.map(item => {
                if (item.polygons) {
                    item.geometry = {
                        coordinates: item.polygons,
                        type: "Polygon",
                    }
                    return item
                } else return item
            })
        }

        if (this.group) {
            this.group.importData(json)
            return
        }

        const group = new AMap.GeoJSON({
            geoJSON: json,
            // geoJSON: JSON.parse(json),   // GeoJSON对象
            getMarker: function (geojson, lnglats) {//还可以自定义getMarker和getPolyline
                return new AMap.Marker({
                    position: lnglats,   // 经纬度对象，也可以是经纬度构成的一维数组[116.39, 39.9]
                    ...that.options.markerOpt(geojson, lnglats)
                }).on('click', () => {
                    const zoom = that.map.getZoom() + 1
                    that.map.setZoomAndCenter(zoom, lnglats)
                })
            },
            getPolygon: function (geojson, lnglats) {//还可以自定义getMarker和getPolyline
                return new AMap.Polygon({
                    path: lnglats,
                    ...that.options.polygonOpt(geojson, lnglats)
                });
            }
        });
        this.group = group
        this.map.add(group)
    }

    getOverLayGroup() {
        if(this.group) return this.group
        else return console.warn('OverLayGroup is null')
    }

    getView() {
        this.onMouseEndListen()
    }

}
