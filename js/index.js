let canvas = new CanvLibCanvas('#canvas');


canvas.background_color = 'pink'

let polygon = canvas.addObject(new CanvLibPolygon({
    x:50,
    y:50,
    background_color:'red',
    points:[
        [50,50],
        [0,50]
    ]
}))

canvas._render();
