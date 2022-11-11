# 高德地图矢量图形聚合

解决高德地图中绘制大量矢量图形引起的页面卡顿,使用宏观视角点聚合 + 缩放视角显示矢量图形的方式解决卡顿问题.

[演示地址]

## 使用方法

```js
const clus = new PolygonClusterer(map, {
  SuperclusterOpt() {
    return {};
  },
  markerOpt,
  polygonOpt,
});
clus.setGeoJson(data);
```

## Options

| Option          | Type     | Default               | Description                                                                                               |
| --------------- | -------- | --------------------- | ----------------------------------------------------------------------------------------------------------|
| SuperclusterOpt | Function | ()=>{return {optObj}} | 返回 superclusterOpt [supercluster 文档地址](https://github.com/mapbox/supercluster)                       |
| markerOpt       | Function | ()=>{return {optObj}} | 返回 MarkerOpt [MarkerOpt 文档地址](https://lbs.amap.com/api/javascript-api/reference/overlay#marker)      |
| polygonOpt      | Function | ()=>{return {optObj}} | 返回 PolygonOpt [supercluster 文档地址](https://lbs.amap.com/api/javascript-api/reference/overlay#polygon) |

## Methods

#### `setGeoJson(data，option)`

导入矢量图形数据,数据支持两种类型 Array[Object] 与 [GeoJson](https://geojson.org/), 如果引入类型是 Array[Object] 需要设置 option = { lnglatsKey: "polygons" }，lnglatsKey 为矢量图形坐标数组的键值

```
// Array[Object]
const object = [
    {
        id: index,
        name: 'mock',
        polygons: [
            [113.05852, 22.94554],
            [113.05902, 22.94554],
            [113.05902, 22.94504],
            [113.05852, 22.945040000000002]
        ]
    },
    ...
]
// GeoJson
const geoJSON = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                type: "Polygon",
                coordinates: [
                    [113.05852, 22.94554],
                    [113.05902, 22.94554],
                    [113.05902, 22.94504],
                    [113.05852, 22.945040000000002]
                ]
            },
            properties: {
                name: "Dinagat Islands"
            }
        },
        ...
    ]
}

```

#### `getView()`

立即进行视图刷新，有些情况可能会因高德地图加载问题不显示图层，可用该方法进行手动刷新

#### `removeAMapEvent`

移除事件绑定，主要绑定了 moveend 与 zoomend 两个事件

#### `getOverLayGroup`

返回高德地图 OverLayGroup 覆盖物群实例

[GeoJson](https://geojson.org/)
高德地图: v1.4.15  
supercluster: 7.1.2
