class Fish {
    // x,y => centre du cercle (tete)
    // Hauteur Tete + Queue (1/2 tete)
    constructor(x,y,headRadius,controlType,maxSpeed=3,initialAngle=0){
        this.x=x;
        this.y=y;

        this.width=2*headRadius;
        this.height=2*headRadius; 

        this.headRadius = headRadius;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=initialAngle;
        this.distance=0;
        
        this.useBrain = controlType == "AI";
        
        this.sensor=new Sensor(this);

        if ( this.useBrain )
        {
            this.brain = new NeuralNetwork(
                // 3 couches 
                //      Senseurs
                //      Couche Cachee
                //      4 directions
                [this.sensor.rayCount,11,5]
            );
        }

        this.controls = new Controls(controlType);
    }

    update(pondBorders,traffic=null) {

        if ( this.damaged ) return;

        if ( !this.damaged ) {
            if (this.useBrain!="DUMMY") 
            {
                this.#move();
            }
            this.triangle=this.#createTriangle();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(pondBorders,traffic);
            if ( this.damaged ) this.speed = 0;
        }         
        
        if (this.sensor) {
            this.sensor.update(pondBorders,traffic);
            
            if ( this.useBrain ) {
                // 1 = On est tout pres
                const offsets = this.sensor.readings.map(
                    s => s == null ? 0 : 1 - s.offset 
                );
                const outputs = NeuralNetwork.feedForward(offsets,this.brain);


                this.controls.left    = outputs[0] || outputs[1];

                this.controls.forward = outputs[2];
                
                this.controls.right   = outputs[3] || outputs[4];
                // Un poisson ne nage pas en marche arrière
                // this.controls.reverse = outputs[3];
            }            
        }
        
    }

    #assessDamage(pondBorders,traffic) {
        for ( let i = 0; i < pondBorders.length; i++ ) {
            if ( polysIntersect(this.polygon,pondBorders[i])) {
                return true;
            }
        }

        if ( traffic ) {
            for ( let i = 0; i < traffic.length; i++ ) {
                if ( polysIntersect(this.polygon,traffic[i].polygon)) {
                    return true;
                }
            }
        }
        return false;
    }

    #createPolygon() {
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);

        // 4 coins du rectangle
            // Top Right
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
            // Top Left
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
            // Bottom Left
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
            // Bottom Right
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #createTriangle() {
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);

        // 3 points du triangle                

            // Top center
        points.push({
            x:this.x, // -Math.sin(this.angle+alpha)*rad,
            y:this.y+10 //-Math.cos(this.angle+alpha)*rad
        });


            // Bottom Left
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
            // Bottom Right
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;
    }

    #move() {
        // Acceleration augmente la vitesse
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        // Vitesse max atteinte
        if(this.speed > this.maxSpeed){
            this.speed = this.maxSpeed;
        }
        if(this.speed < -this.maxSpeed/2){
            this.speed = -this.maxSpeed/2;
        }

        // Friction de la route
        if(this.speed > 0){
            this.speed -= this.friction;
        }
        if(this.speed < 0){
            this.speed += this.friction;
        }
        if(Math.abs(this.speed) < this.friction) {
            this.speed = 0;
        }

        // Mouvement lateral
        // if (this.speed!=0)
        {
            // Inverser Gauche et Droite en marche arriere
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                // this.x-=2;
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                // this.x+=2;
                this.angle-=0.03*flip;
            }
        }

        const dx = Math.sin(this.angle)*this.speed;  
        const dy = Math.cos(this.angle)*this.speed;
        
        this.distance += Math.sqrt(  dx*dx + dy*dy );        

        this.x -= dx;
        this.y -= dy;
    }

    draw(ctx,color,drawSensor=false) {
        if ( this.damaged ) {
            ctx.fillStyle="gray";
        }
        else {
            ctx.fillStyle=color;
        }                        

        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);

        // Tete
        ctx.beginPath();        
        ctx.arc(0,0,this.headRadius,0,Math.PI*2);        
        ctx.fill();        

        // Queue
        ctx.moveTo(0,.8*this.headRadius);
        ctx.lineTo(-this.headRadius,2*this.headRadius);
        ctx.lineTo(+this.headRadius,2*this.headRadius);
        ctx.lineTo(0,.8*this.headRadius);
        ctx.fill();

        // Croix centre du carre
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(-5,0);
        ctx.lineTo(+5,0)
        ctx.moveTo(0,-5);
        ctx.lineTo(0,+5)
        ctx.stroke();


        ctx.restore();    

        // Hitbox
        ctx.lineWidth = 0.5;
        ctx.strokeStyle = "black";
        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x,this.polygon[0].y);
        for ( let i = 1; i < this.polygon.length; i++ ) {
            ctx.lineTo(this.polygon[i].x,this.polygon[i].y);
        }
        ctx.lineTo(this.polygon[0].x,this.polygon[0].y);
        ctx.stroke();
    
        if(this.sensor && drawSensor) {
            this.sensor.draw(ctx);
        }

        ctx.save();
        ctx.globalAlpha = 1;
        ctx.textAlign="center";
        ctx.textBaseline="middle";
        ctx.strokeStyle="black";
        ctx.fillStyle="white";
        ctx.font="10px Arial";
        ctx.fillText(this.distance,this.x,this.y);
        ctx.lineWidth=.5;
        ctx.strokeText(this.distance,this.x,this.y);
        ctx.restore();

        
    }
}