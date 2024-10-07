// Initialize nyanCat
let nyanCat;
let nyanCatX
let nyanCatY;
let nyanCatSize = 100;

// Random artwork obstacles
let bush;
let firehydrant;
let catpost;
let rat;
let obstacle;
let obstacleX;
let obstacleSize = 100; 
let obstacleSpeed = 5;

// Floor position
let floorY = 650;

// Jumping power
let jumpMode = false;
let jumpPower = 0;

//gravity constant
const gravity = 0.2;

// Game state
let gameOver = false;
let gameStarted = false;

// Score
let score = 0;
let highScore = window.localStorage.getItem('highScore') || 0; 

//sounds
let nyanCatSong;
let jumpSound;
let gameOverSound;

// Game logic
let game = function(p) {
    p.preload = function() {
        // images
        nyanCat = p.loadImage("images/nyancat.gif");
        brick = p.loadImage("images/brick.png");
        bush = p.loadImage("images/bush.png");
        catpost = p.loadImage("images/catpost.png");
        firehydrant = p.loadImage("images/firehydrant.png");
        rat = p.loadImage("images/rat.png");
        background = p.loadImage("images/nyanCatBackground.jpeg");
    
        // sounds
        nyanCatSong = createAudioElement('sounds/nyanCatSong.mp3', 'audio/mpeg');
        jumpSound = createAudioElement('sounds/jumpSound.mp3', 'audio/mpeg');
        gameOverSound = createAudioElement('sounds/gameOver.mp3', 'audio/mpeg');
    };
    
    p.setup = function() {
        let canvas = p.createCanvas(600, 800);
        canvas.parent("game-container");
        p.background(0);

        // initialize location of cat
        nyanCatX = 200;
        nyanCatY = floorY - nyanCatSize + 15;

        // initialize the first obstacle
        obstacleX = p.width;
        p.createRandomObstacle();


    };
    
    p.draw = function() {
        p.background(0);
    
        // draw background
        p.image(background, 0, 0, 600, 800);
    
        // draw cat
        p.image(nyanCat, nyanCatX, nyanCatY, nyanCatSize, nyanCatSize);
    
        // draw floor
        p.image(brick, 0, floorY, p.width, 160);
    
        if (gameStarted && !gameOver) {
            // draw obstacles and move them
            p.image(obstacle, obstacleX, floorY - obstacleSize + 15, obstacleSize, obstacleSize);
            obstacleX -= obstacleSpeed;
    
            // reset obstacle when it goes off screen
            if (obstacleX + obstacleSize < 0) {
                obstacleX = p.width;
                score++;
                //increase the speed
                if (obstacleSpeed <= 8){
                    obstacleSpeed *= 1.1; 
                }
                p.createRandomObstacle();
            }
        
            // movement mechanics - initiate a jump
            if (p.keyIsDown(32) && jumpMode === false) {
                jumpMode = true;
                jumpPower = -8;
                jumpSound.play();
            }
    
            // handle jumping
            if (jumpMode) {
                nyanCatY += jumpPower;
                jumpPower += gravity;
    
                if (nyanCatY + nyanCatSize >= floorY + 15) {
                    jumpMode = false;
                    jumpPower = 0;
                    nyanCatY = floorY - nyanCatSize + 15;
                }
            }
    
            // collision detection
            if (obstacleX < nyanCatX + nyanCatSize && obstacleX + obstacleSize > nyanCatX &&
                nyanCatY + nyanCatSize > floorY - obstacleSize + 15) {
                gameOver = true;
                gameOverSound.play();
                obstacleSpeed = 0;  // Stop obstacle movement
                nyanCatY = floorY - nyanCatSize + 15;
            }
    
            // update high score
            if (score > highScore) {
                highScore = score;
                window.localStorage.setItem("highScore", highScore);
            }
    
            // display active score
            p.noStroke();
            p.fill(255);
            p.textSize(32);
            p.text("Score: " + score, 30, 50);
        }

        // borders
        p.stroke(150);
        p.strokeWeight(20);
        p.line(0, 0, 0, p.height);  // left
        p.line(p.width, 0, p.width, p.height);  // right
        p.line(0, 0, p.width, 0);  // top
        p.line(0, p.height, p.width, p.height);  // bottom
    };
    
    p.createRandomObstacle = function() {
        let obstacleOptions = [bush, firehydrant, catpost, rat];
        obstacle = p.random(obstacleOptions);
        obstacleX = p.width;
    };

    p.restartGame = function() {
        gameOver = false;
        gameStarted = true;
        score = 0;
        jumpPower = 0;
        jumpPower = false;
        obstacleSpeed = 5;
        nyanCatY = floorY - nyanCatSize + 15;
        obstacleX = p.width;
        p.createRandomObstacle();
        nyanCatSong.play();
    };
};

// popup canvas logic
let popUp = function(p) {
    let canvas2;

    p.setup = function(){
        canvas2 = p.createCanvas(300, 300);
        canvas2.parent("second-container");
        p.background(135, 206, 250);

        button = p.createButton("START");
        button.parent("second-container");
        //button function
        button.mousePressed (function(){
            if (!gameStarted) {
                gameOver = false;
                gameStarted = true;
                nyanCatSong.play();
                p.select('#second-container').elt.style.display = 'none';
            }
            else if (gameOver) {
                mainCanvas.restartGame();
                p.select('#second-container').elt.style.display = 'none';
            }
        });
    };

    p.draw = function() {
        p.background(135, 206, 250);
        p.clear();
        p.noStroke();
        p.fill(0);
        p.textAlign(p.CENTER, p.CENTER);
        p.textSize(20);

        // Show or hide the popup based on game state
        if (gameStarted && !gameOver) {
            p.select('#second-container').elt.style.display = 'none';
        } else {
            p.select('#second-container').elt.style.display = 'flex';
            if (!gameStarted) {
                p.text("High Score: " + highScore, p.width / 2, p.height / 2 - 40);
                p.text("Press START to start the game!", p.width / 2, p.height / 2);
            } else if (gameOver) {
                p.text(
                    "Game Over!\nScore: " + score + "\nHigh Score: " + highScore + "\nPress START to restart",
                    p.width / 2,
                    p.height / 2
                );
            }
        }
    };
};
//sound code
function createAudioElement(filename,type){
    const elAudio = document.createElement("audio");
    const elSource = document.createElement("source");

    elSource.src = filename;
    elSource.type = type;

    elAudio.preload = "auto";
    elAudio.appendChild(elSource);
    document.body.appendChild(elAudio);

    elAudio.load();

    return elAudio;
}

// Create main canvas and second canvas
let mainCanvas = new p5(game);
let secondCanvas = new p5(popUp);

//make sure sound is working