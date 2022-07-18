
const btnPause = document.getElementById("btnPause");
const btnPlay = document.getElementById("btnPlay");

const pondCanvas = document.getElementById("pondCanvas");

// Bassin carre
pondCanvas.width = pondCanvas.height = 600;

const networkCanvas = document.getElementById("networkCanvas");
networkCanvas.width = 400;

const pondCtx = pondCanvas.getContext("2d");
const networkCtx = networkCanvas.getContext("2d");

const pond = new Pond(pondCanvas.width/2,pondCanvas.width/2,pondCanvas.width*.95,30);

const traffic = generateFishes(5);
const fishes  = generateFishes(20);

let bestFish = fishes[0];
if(localStorage.getItem("bestBrain")) {
    for ( let i = 0; i < fishes.length; i++ ) {
        fishes[i].brain=JSON.parse(localStorage.getItem("bestBrain")); 
        if ( i != 0 ) {
            NeuralNetwork.mutate(fishes[i].brain,0.1);
        }
    }
}


bestFish = fishes[0];

if ( traffic ) {
    for (let i =0; i < traffic.length; i++ ) {
        traffic[i].update(pond.borders,[]);
    }
}

for (let i = 0; i < fishes.length; i++) {
    fishes[i].update(pond.borders,[]);
}

let toggled = false;
let paused  = false;

play();

function animate(time) {
    if ( paused ) return;

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
        // Meilleur poisson celui qui va le plus loin
        c => 
            // Spread operateur
            ( c.distance == Math.max(...fishes.map(c=>c.distance)) )
    );

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

    // Tracer le reseau
        // Resize cause clearing
    networkCanvas.height = window.innerHeight * .9;
    Visualizer.drawNetwork(networkCtx,bestFish.brain);

    requestAnimationFrame(animate);
}

// Generation de N poissons au centre du bassin
function generateFishes(N) {
    const fishes = [];
    for ( let i = 0; i < N; i++) {
        fishes.push( 
            new Fish(pond.getCenterX(),pond.getCenterY(),15,"AI")
        );
    }
    return fishes;
}

// Inverse
function toggle() {
    toggled = !toggled;
}

// Sauve le meilleur cerveau
function save() {
    localStorage.setItem("bestBrain",JSON.stringify(bestFish.brain));
}

// Efface le meilleur cerveau
function discard() {
    localStorage.removeItem("bestBrain");
}

// Redemarrage
function play() {
    paused = false;
    btnPlay.disabled = true;
    btnPause.disabled =false;
    animate();
}

// Mise en pause
function pause() {
    paused = true;
    btnPlay.disabled = false;
    btnPause.disabled =true;
}
