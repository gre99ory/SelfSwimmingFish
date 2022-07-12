class Sensor {
    constructor(fish){
        this.fish=fish;
        this.rayCount=5;
        this.rayLength=150;
        this.raySpread=Math.PI/3; //1.3*Math.PI; // /2;

        this.rays=[];
        this.readings=[];
    }

    update(borders,traffic){
        this.#castRays();
        this.readings=[];
        for ( let i = 0; i < this.rays.length; i++ ) {
            this.readings.push(
                this.#getReading(this.rays[i],borders,traffic)
            );
        }
    }

    #getReading(ray,borders,traffic) {
        let touches=[];

        for ( let i = 0; i < borders.length; i++ ) {
            const touch=getIntersection(
                ray[0],
                ray[1],
                borders[i][0],
                borders[i][1]
            );
            if (touch) {
                touches.push(touch);
            }
        }

        if ( traffic ) {
            for( let i = 0; i < traffic.length; i++ ) {
                const poly = traffic[i].polygon
                for ( let j = 0; j < poly.length; j++ ) {
                    const value=getIntersection(
                        ray[0],
                        ray[1],
                        poly[j],
                        poly[(j+1)%poly.length]
                    );
                    if (value) {
                        touches.push(value);
                    }
                }
            }
        }

        if ( touches.length == 0 )
            return null;
        
        const offsets=touches.map(e=>e.offset);
        // Spreading the array with ...
        const minOffset=Math.min(...offsets);
        return touches.find(e=>e.offset==minOffset);
    }

    #castRays(){        
        this.rays=[];
        for ( let i = 0; i < this.rayCount; i++) {
            const rayAngle = lerp(
                this.raySpread/2,
                -this.raySpread/2,
                // Si on a un seul rayon, il est au centre de l'angle de vision
                this.rayCount == 1 ? 0.5: i/(this.rayCount-1)
            ) 
            // Permet au senseur de respecter la direction du vehicule
            + this.fish.angle;

            const start={x:this.fish.x,y:this.fish.y};
            const end={
                x:this.fish.x-
                    Math.sin(rayAngle)*this.rayLength,
                y:this.fish.y-
                    Math.cos(rayAngle)*this.rayLength,
            };
            this.rays.push([start,end]);
        }
    }

    draw(ctx){
        ctx.lineWidth=2;
        for ( let i = 0; i < this.rayCount; i++ ) {
            let end=this.rays[i][1];
            
            // Rayon touche qq chose
            if (this.readings[i] ) {
                end=this.readings[i];
            }

            ctx.beginPath();
            ctx.strokeStyle="yellow";
            ctx.moveTo(
                this.rays[i][0].x,
                this.rays[i][0].y
                );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
                    
            ctx.beginPath();
            ctx.strokeStyle="black";
            ctx.moveTo(
                this.rays[i][1].x,
                this.rays[i][1].y
            );
            ctx.lineTo(
                end.x,
                end.y
            );
            ctx.stroke();
        }
    }
}