class Word {
    constructor(text, size, speed, x, y) {
        this.text = text;
        this.size = size;
        this.speed = speed;
        this.x = x;
        this.y = y;
    }

    getWidth(ctx) {
        if (!(ctx instanceof CanvasRenderingContext2D))
            throw Error('Invalid context');

        ctx.save();
        ctx.font = `${this.size}px serif`;
        let width = ctx.measureText(this.text).width;
        ctx.restore();

        return width;
    }
    
    update(dt = 1) {
        this.x -= this.speed * dt;
    }

    draw(ctx) {
        if (!(ctx instanceof CanvasRenderingContext2D))
            throw Error('Invalid context');
        ctx.font = `${this.size}px serif`;
        ctx.fillText(this.text, this.x, this.y);
    }
}

export {Word};
