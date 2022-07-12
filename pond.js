class Pond {
  // Bassin carre centre en x,y
  constructor(x,y,width) {
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
    var numberOfSides = 3,
        size = ctx.canvas.width / 2,
        Xcenter = ctx.canvas.width / 2,
        Ycenter = ctx.canvas.height / 2;

    ctx.beginPath();
    ctx.moveTo( Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0) );
    for (var i = 1; i <= numberOfSides;i += 1) {
        ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }
    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.stroke();
  }

}
  

