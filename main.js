const pondCanvas = document.getElementById("pondCanvas");


// Bassin carre
pondCanvas.width = pondCanvas.height = 600;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const pondCtx = pondCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const pond = new Pond(pondCanvas.width/2,pondCanvas.width/2,pondCanvas.width*.9);

// x,y, width, height, controlType, maxSpeed
//const fish = new Fish(pond.getCenterX(),pond.getCenterY(),30,50,"KEYS");

// const fish = new Fish(pond.getCenterX(),pond.getCenterY(),15,"AI");


//const traffic = null;
/*
    new Fish(pond.getCenterX()*.5,pond.getCenterY()*.5,10,"DUMMY",0.3,Math.PI),
    new Fish(pond.getCenterX()*1.5,pond.getCenterY()*1.5,10,"AI",0.3)        
];
*/


const N = 10;
const traffic = generateFishes(5);
const fishes  = generateFishes(20);

let bestFish = fishes[0];
if(localStorage.getItem("bestBrain")){
    // bestCar.brain=JSON.parse(localStorage.getItem("bestBrain"));
    for ( let i = 0; i < fishes.length; i++ ) {
        fishes[i].brain=JSON.parse(localStorage.getItem("bestBrain")); 
        if ( i != 0 ) {
            NeuralNetwork.mutate(fishes[i].brain,0.1);
        }
    }
}


// fish.update(pond.borders,[]);
bestFish = fishes[0];

if ( traffic )
{
    for (let i =0; i < traffic.length; i++ ) {
        // if ( traffic[i].useBrain ) bestFish = traffic[i];
        traffic[i].update(pond.borders,[]);
    }
}

for (let i = 0; i < fishes.length; i++) {
    fishes[i].update(pond.borders,[]);
}

let toggled = false;
animate();

function animate(time){
    // Deplacement et controle des collisions
    if ( traffic ) {
        for (let i =0; i < traffic.length; i++ ) {
            traffic[i].update(pond.borders);
        }
    }

    

    if ( toggled ) {
        for (let i = 0; i < fishes.length; i++) {
            fishes[i].update(pond.borders,traffic);
        }
    }
    else {
        for (let i = 0; i < fishes.length; i++) {
            fishes[i].update(pond.borders);
        }
    }

    bestFish=fishes.find(
        
        c => ( c.speed == Math.max( ...fishes.map(c=>c.speed) ))
            &&
            // Spread operateur
            ( c.distance == Math.max(...fishes.map(c=>c.distance)) )
    );

    bestFish=fishes.find(
        
        c => 
            // Spread operateur
            ( c.distance == Math.max(...fishes.map(c=>c.distance)) )
    );

    // fish.update(pond.borders,traffic);


    // Tracer la scene
    pondCtx.clearRect(0,0,600,600); 
    pond.draw(pondCtx);


    pondCtx.globalAlpha=0.2;
    for (let i = 0; i < fishes.length; i++) {
        fishes[i].draw(pondCtx,"blue");
    }
    pondCtx.globalAlpha=1;
    bestFish.draw(pondCtx,"blue",true);
    
    
    if ( traffic ) {
        pondCtx.globalAlpha=0.2;
        for (let i =0; i < traffic.length; i++ ) {
            traffic[i].draw(pondCtx,"red");
        }
    }
    pondCtx.globalAlpha=1;

    // fish.draw(pondCtx,"red",true);

    // Tracer le reseau
        // Resize cause clearing
    networkCanvas.height = window.innerHeight * .9;
    Visualizer.drawNetwork(networkCtx,bestFish.brain);

    requestAnimationFrame(animate);
}

function generateFishes(N){
    const fishes = [];
    for ( let i = 0; i < N; i++) {
        fishes.push( 
            new Fish(pond.getCenterX(),pond.getCenterY(),15,"AI")
        );
    }
    return fishes;
}

function toggle() {
    toggled = !toggled;
}


function save() {
    localStorage.setItem("bestBrain",JSON.stringify(bestFish.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

/*

// const car = new Car(road.getLaneCenter(1),100,30,50,"AI");

const N = 10;
const cars = generateCars(N);
let bestCar = cars[0];
if(localStorage.getItem("bestBrain")){
    // bestCar.brain=JSON.parse(localStorage.getItem("bestBrain"));
    for ( let i = 0; i < cars.length; i++ ) {
        cars[i].brain=JSON.parse(localStorage.getItem("bestBrain")); 
        if ( i != 0 ) {
            NeuralNetwork.mutate(cars[i].brain,0.1);
        }
    }
}

// Best Brain Yet 
// {"levels":[{"inputs":[0.4320958973535929,0,0,0,0],"outputs":[0,1,0,1,0,0],"biases":[0.5792663433172249,-0.17789886000449134,-0.12994990800695347,-0.2763115474503432,0.0019625597488244634,0.20821447442134927],"weights":[[-0.08446118996094601,0.2182172892863825,-0.3012987813582378,-0.6383418696987733,-0.22091593436245782,-0.40274130590336205],[0.3777611465112639,-0.13033578616162694,0.4174139736986942,-0.5156833917657618,0.051173399166647426,-0.09545892953511119],[-0.29195817450623784,0.3802059498786002,0.1543586105957912,-0.5655220474230399,-0.05988459260279606,0.01749629604894678],[-0.4777254665168426,-0.06178150881088723,-0.5674256000370175,0.12466504385678233,-0.5250540875078248,-0.7013932537556294],[-0.057967988365854796,0.37099596944123586,0.6767618707738131,0.46798638190704467,-0.39952191894391703,0.6428695354241719]]},{"inputs":[0,1,0,1,0,0],"outputs":[1,1,1,0],"biases":[-0.04629526295539271,-0.3170536464758954,-0.2520595260134617,0.030126674272837287],"weights":[[0.08453419844370075,0.0657057255658385,-0.04980507826862344,0.31387354502363024],[0.05416917510018972,-0.41140042914100017,0.18007289660699366,-0.558349495518382],[-0.023960205600265377,0.05624650775581213,-0.2681484554780964,0.30187212688059495],[0.007079980145226844,0.3692942540809972,-0.4056503121043736,-0.049229896968211256],[-0.4464585985079479,0.05921174251337499,-0.2046374358920124,0.13843232879032866],[0.1930210512215805,0.12276950120247287,0.26178770511766297,0.010910572714490571]]}]}
const traffic = [    
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-300,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(0),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-500,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(1),-700,30,50,"DUMMY",2),
    new Car(road.getLaneCenter(2),-700,30,50,"DUMMY",2)
];

animate();

function save() {
    localStorage.setItem("bestBrain",JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N){
    const cars = [];
    for ( let i = 0; i < N; i++) {
        cars.push(new Car(road.getLaneCenter(1),100,30,50,"AI"));
    }
    return cars;
}

function animate(time){
    for (let i =0; i < traffic.length; i++ ) {
        traffic[i].update(road.borders,[]);
    }
    for (let i = 0; i < cars.length; i++) {
        cars[i].update(road.borders,traffic);
    }
    bestCar=cars.find(
        c=>c.y==Math.min(
            // Spread operateur
            ...cars.map(c=>c.y)
        )
    );

    // Resize cause clearing
    carCanvas.height = window.innerHeight;
    networkCanvas.height = window.innerHeight * .9;

    // Centre la scene sur la voiture
    carCtx.save();
    carCtx.translate(0,-bestCar.y+carCanvas.height*0.5);

    road.draw(carCtx);
    for (let i =0; i < traffic.length; i++ ) {
        traffic[i].draw(carCtx,"red");
    }
    carCtx.globalAlpha=0.2;
    for (let i = 0; i < cars.length; i++) {
        cars[i].draw(carCtx,"blue");
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);

    carCtx.restore();

    networkCtx.lineDashOffset = -time/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain);

    requestAnimationFrame(animate);
}

*/