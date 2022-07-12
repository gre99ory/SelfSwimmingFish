// lerp = linear interpolation
function lerp(A,B,t){
   return A+(B-A)*t;
}

function getIntersection(A,B,C,D) {
   const bottom=(D.y-C.y)*(B.x-A.x) - (D.x-C.x)*(B.y-A.y);

   if ( bottom == 0 ) return null;

   const tTop=(D.x-C.x)*(A.y-C.y) - (D.y-C.y)*(A.x-C.x);
   const uTop=(C.y-A.y)*(A.x-B.x) - (C.x-A.x)*(A.y-B.y);
   const t=tTop/bottom;
   const u=uTop/bottom;

   if ( t >= 0 && t <= 1 && u >= 0 && u <= 1 ) {
       return {
           x:lerp(A.x,B.x,t),
           y:lerp(A.y,B.y,t),
           offset:t
       }
   }

   return null;
}

function polysIntersect(poly1,poly2) {
    for ( let i = 0; i < poly1.length; i++ ) {
        for ( let j = 0; j < poly2.length; j++ ) {
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if ( touch ) {
                return true;
            }
        }            
    }
    return false;
}

function getRGBA(value){
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

function drawPolygon(ctx) {
    var numberOfSides = 3,
    size = ctx.canvas.width / 2,
    Xcenter = ctx.canvas.width / 2,
    Ycenter = ctx.canvas.height / 2;

    ctx.beginPath();
    ctx.moveTo (Xcenter +  size * Math.cos(0), Ycenter +  size *  Math.sin(0));          

    for (var i = 1; i <= numberOfSides;i += 1) {
        ctx.lineTo (Xcenter + size * Math.cos(i * 2 * Math.PI / numberOfSides), Ycenter + size * Math.sin(i * 2 * Math.PI / numberOfSides));
    }

    ctx.strokeStyle = "green";
    ctx.lineWidth = 3;
    ctx.stroke();
}