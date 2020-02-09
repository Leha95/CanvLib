class Font{

    constructor(size,family){
        this.size = size;
        this.family = family;
    }

    toString(){
        return `${this.size}px ${this.family}`;
    }

}



class CanvLibObject{

    constructor(...objects){
        this.children = objects;
        this.x = 0;
        this.y = 0;
        this.center_x = 0;
        this.center_y = 0;

    }

    pointInside(event){
        return false;
    }

    _click_children(event){
        let click_this = false;
        this.children.forEach((o)=>{
            click_this=o._click(event) ? true : click_this
        });
        return click_this;
    }

    _click(event){
        let click_this = this.pointInside(event)||this._click_children(event);

        if(click_this)
        if(this.click&&this.click.call)
        this.click(event);

        return click_this
    }

    unpack(params={},...keys){
        let This = this;
        for(let key of keys){
            if(key && key.push!==undefined){
                let param_name =key[0];
                let param_name_final =key[1]||param_name;
                let type =key[2]||'param';

                this[param_name_final] = params[param_name];
            }else{
                if(params[key]&&params[key].call!==undefined){
                    Object.defineProperty(this,key,{
                        get(){
                            return params[key].call(This);
                        }
                    })
                }else{
                    this[key] = params[key];
                }
            }
        }
    }

    renderChildren(context){
        this.children.forEach((o)=>o._render(context,this));
    }

    addChildren(...children){
        this.children.push(...children);
    }

    _render(context,parent){
        this.render ? this.render(context,parent) : false;
        this.renderChildren(context);
    }

}


class CanvLibRectangle extends CanvLibObject{

    constructor(params){
        super(...(params.children||[]));

        this.unpack(params,'x', 'y', 'width', 'height', 'background_color', 'border_color', 'border_width',['onclick','click']);
    }

    pointInside(event){
        let {x,y,width,height} = this;
        let {offsetX,offsetY} = event;
        return (x<=offsetX&&offsetX<=x+width) && (y<=offsetY&&offsetY<=y+height)
    }

    render(context={},parent={x:0,y:0}){
        context.fillStyle = this.background_color||'transparent';
        context.strokeStyle = this.border_color||'transparent';
        context.lineWidth = this.border_width||0;
        context.beginPath();
        context.rect(this.x+parent.x,this.y+parent.y,this.width,this.height);
        context.fill();
        context.stroke();
        this.renderChildren(context);
    }

}


class CanvLibPolygon extends CanvLibObject{

    constructor(params){
        super(...(params.children||[]));

        this.unpack(params,'x', 'y', 'points', 'background_color', 'border_color', 'border_width',['onclick','click']);
    }

    pointInside(event){
        return false;
    }

    render(context={},parent={x:0,y:0}){
        context.fillStyle = this.background_color||'transparent';
        context.strokeStyle = this.border_color||'transparent';
        context.lineWidth = this.border_width||0;
        context.beginPath();
        let x = this.x+parent.x;
        let y = this.y+parent.y;
        context.moveTo(x,y);
        this.points.forEach((point)=>{
            context.lineTo(point[0]+x,point[1]+y);
        });

        context.fill();
        context.stroke();
        this.renderChildren(context);
    }

}

class CanvLibCircle extends CanvLibObject{

    constructor(params){
        super(...(params.children||[]));

        this.unpack(params,'x', 'y', 'radius', 'background_color', 'border_color', 'border_width',['onclick','click']);
    }

    pointInside(event){
        let {x,y,radius} = this;
        let {offsetX,offsetY} = event;
        return ((offsetX - x)**2 + (offsetY - y)**2) <= radius**2;
    }

    render(context={},parent={x:0,y:0}){
        context.fillStyle = this.background_color||'transparent';
        context.strokeStyle = this.border_color||'transparent';
        context.lineWidth = this.border_width||0;
        context.beginPath();

        context.arc(this.x+parent.x, this.y+parent.y, this.radius, 0, 2 * Math.PI);

        context.fill();
        context.stroke();
        this.renderChildren(context);
    }

}


class CanvLibText extends CanvLibObject{

    constructor(params){
        super(...(params.children||[]));

        this.unpack(params,'x', 'y', 'width', 'height', 'text','font', 'fill_color', 'border_color', 'border_width', 'center_x', 'center_y' , ['onclick','click']);
        !this.center_y?this.center_y=0:0;
        !this.center_x?this.center_x=0:0;
    }

    pointInside(event){
        let {x,y,width,height} = this;
        y=y-20;
        let {offsetX,offsetY} = event;
        return (x<=offsetX&&offsetX<=x+width) && (y<=offsetY&&offsetY<=y+height);
    }

    render(context={},parent={x:0,y:0}){
        context.fillStyle = this.fill_color||'transparent';
        context.strokeStyle = this.border_color||'transparent';
        context.lineWidth = this.border_width||0;
        context.font = this.font.toString();

        context.fillText(this.text,this.x+parent.x+this.center_x, this.y+parent.y+this.font.size+this.center_y);
        context.strokeText(this.text,this.x+parent.x+this.center_x, this.y+parent.y+this.font.size+this.center_y);
        this.renderChildren(context);
    }

}


class CanvLibCanvas{

    constructor(selector, params={}){
        this._canvas = document.querySelector(selector);
        this._context = this._canvas.getContext('2d');
        this._context.imageSmoothingEnabled = false
        this.root = new CanvLibObject();
        this.click = params['onclick']||(()=>{})
        this._canvas.addEventListener('click',(event)=>{return this._click(event)});

    }

    _click(event){
        this.click(event);
        this.root._click(event);
    }

    addObject(object){
        this.root.addChildren(object);
        return object;
    }

    _render(){
        this._context.fillStyle = this._background_color||'white';
        this._context.fillRect(0,0,this._canvas.width,this._canvas.height);
        this.root.renderChildren(this._context);
        requestAnimationFrame(()=>this._render());
    }

    set background_color(background_color){
        this._background_color = background_color||this._background_color;
    }

}
