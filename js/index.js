let canvas = new CanvLibCanvas('#canvas');

let rectangle = canvas.addObject(new CanvLibProgressBar({
    width:100,
    height: 30,
    x:10,
    y:10,
    fill_color: 'green',
    border_width:1,
    border_color:'black',
    progress:0,
    onclick(event){
        this.progress+=5;
    }
}));

canvas._render();
