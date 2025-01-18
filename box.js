class Box {
    constructor(x, y, w, h, img, options={}){
        this.body = Bodies.rectangle(
            x, y, w, h, options
        );
        this.w = w;
        this.h = h;
        this.img = img;
        World.add(world, this.body);

    }

    show(){
        push();
        //rectMode(CENTER);
        translate(
            this.body.position.x, 
            this.body.position.y, 
        )
        rotate(this.body.angle);
        /*rect(
            0, 
            0,
            this.w, 
            this.h
        );*/
        imageMode(CENTER);
        image(this.img, 0, 0, this.w, this.h);
        pop();
    }
}

