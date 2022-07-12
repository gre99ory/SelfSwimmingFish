class Pond {
  // Bassin carre centre en x,y
  constructor(x,y,width,sides=4) {
    this.x=x;
    this.y=y;

    this.width=width;
    this.height=width;

    this.left=x-this.width/2;
    this.right=x+this.width/2;

    this.top=y-this.height/2;
    this.bottom=y+this.height/2;


    // 4 points 
    const topLeft={x:this.left,y:this.top};
    const topRight={x:this.right,y:this.top};
    const bottomLeft={x:this.left,y:this.bottom};
    const bottomRight={x:this.right,y:this.bottom};

    // 2 segments
    this.borders=[
      [topLeft,bottomLeft],
      [topRight,bottomRight],
      [topLeft,topRight],
      [bottomLeft,bottomRight]    
    ];


    this.sides = sides;
    this.#setBorders();



  }

  draw(ctx){
    ctx.lineWidth=5;
    ctx.strokeStyle="white";
    
    // Trace des bords du bassin
    this.borders.forEach(border=>{
      ctx.beginPath();
      ctx.moveTo(border[0].x,border[0].y);
      ctx.lineTo(border[1].x,border[1].y);
      ctx.stroke();        
    });
  }

  getCenterX() {
    return this.x;
  }

  getCenterY() {
    return this.y;
  }

  #setBorders() {
    /*
    var numberOfSides = 3,
        size = ctx.canvas.width / 2,
        Xcenter = ctx.canvas.width / 2,
        Ycenter = ctx.canvas.height / 2;
    */

    let xa,ya,xb,yb;
    this.borders = [];
    
    xa = Math.ceil( this.x + this.width /2 * Math.cos(0) );
    ya = Math.ceil( this.y + this.height /2 * Math.sin(0) );
  
    for (var i = 1; i <= this.sides; i++ ) {
        xb = Math.ceil( this.x + this.width/2 * Math.cos(i * 2 * Math.PI / this.sides ));
        yb = Math.ceil( this.y + this.height/2  * Math.sin(i * 2 * Math.PI / this.sides ));
        
        this.borders.push( [{x:xa,y:ya},{x:xb,y:yb}]);
        xa = xb;
        ya = yb;
    }

    /*
    xa = this.x + this.width * Math.cos(0);
    ya = this.y + this.height * Math.sin(0);
    this.borders.push( [{x:xa,y:ya},{x:xb,y:yb}]);
    */
    
    /*

    // 4 points 
    const topLeft={x:this.left,y:this.top};
    const topRight={x:this.right,y:this.top};
    const bottomLeft={x:this.left,y:this.bottom};
    const bottomRight={x:this.right,y:this.bottom};

    // 2 segments
    this.borders=[
      [topLeft,bottomLeft],
      [topRight,bottomRight],
      [topLeft,topRight],
      [bottomLeft,bottomRight]
    ];
    */

  }

}
  

