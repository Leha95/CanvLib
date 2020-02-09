let canvas = new CanvLibCanvas('#canvas');

canvas.background_color = 'red';

class Button extends CanvLibObject{

    constructor(params){
        super(...(params.children||[]));
        this.unpack(params,'x', 'y', 'width', 'height', 'text','font', 'text_fill_color', 'text_border_color', 'text_border_width','background_color','border_color','border_width' , ['onclick','click']);

        this._body = new CanvLibRectangle({
            x:0,
            y:0,
            width:()=>this.width,
            height:()=>this.height,
            background_color:()=>this.background_color,
            border_color:()=>this.border_color,
            border_width:()=>this.border_width
        });

        this._text = new CanvLibText({
            x:()=>this.width/2,
            y:()=>this.height/2,
            center_x:function(){return -this.text.length*this.font.size/4},
            center_y:()=>-(this.font.size/1.5),
            fill_color:()=>this.text_fill_color,
            border_color:()=>this.text_border_color,
            border_width:()=>this.text_border_width,
            font:()=>this.font,
            text:()=>this.text
        });

        this.addChildren(this._body,this._text);

    }

}

let button = canvas.addObject(new Button({
    x:20,
    y:20,
    width:100,
    height:30,
    background_color:'black',
    text_fill_color:'white',
    font:new Font(12,'arial'),
    text:'Button'
}));


canvas._render();
