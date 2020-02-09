class CanvLibProgressBar extends CanvLibObject{

    constructor(params = {}){
        super(...(params.children||[]));
        this.unpack(params,'x','y','width','height', 'fill_color', 'border_color' , 'border_width','progress',['onclick','click']);
        let This = this;

        this.fill_rectangle = new CanvLibRectangle({
            x:0,
            y:0,
            width:function(){
                if(This.progress>100){
                    This.progress=100;
                    return This.width
                }
                if(This.progress<0){
                    This.progress=0;
                    return This.width*0;
                }
                return This.width/100*This.progress
            },
            height:this.height,
            background_color:this.fill_color,
            border_width:0
        });

        this.border_rectangle = new CanvLibRectangle({
            x:0,
            y:0,
            width:this.width,
            height:this.height,
            border_color:this.border_color,
            border_width:this.border_width,
            background_color:"transparent"
        });

        this.addChildren(this.fill_rectangle,this.border_rectangle);
    }

}
