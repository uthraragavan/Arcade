//
// app.js
// Author: Uthra Vijayaragavan
// Date modified: 10/11/2016
// Defines Enemy class and Player class, Handles Keyboard and Mouse events
//

// Enemy Class
// Enemies our player must avoid
//
var Enemy = function() {
    this.sprite = 'images/enemy-bug.png';
    this.origx = 0;
    this.origy = 0;
    this.speed = 1;
    this.x = 0;
    this.y = 0;
};

//
// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
//
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

    if((this.x+(dt*100*this.speed)) < 500) {
        this.x = this.x+(dt*100*this.speed);
    }
    else
    {
        this.x = this.origx;
    }

};

//
// Resets Enemy object
//
Enemy.prototype.reset = function() {
    this.x=this.origx;
    this.y=this.origy;
    this.speed = Math.random()*5;

};

//
// Draw the enemy on the screen, required method for game
//
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);

};

//
// Resets the speed of enemy to 0 - makes the enemy to stop moving
//
Enemy.prototype.resetSpeed = function() {
    this.speed = 0;
};

//
// Player Class
//
var Player = function() {
    this.playchar = 'images/char-boy.png';
    this.x = 200;
    this.y = 400;
    this.won = false;
    this.winstar = 'images/Star.png';
    this.timeup = false;
    this.score = 0;
};

//
// Resets Player object
//
Player.prototype.reset = function() {
    this.x = 200;
    this.y = 400;
    this.won = false;
    this.timeup = false;
};

//
// Draw the player on the screen, required method for game
//
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.playchar), this.x, this.y);
    if(this.y === 0) {
        if(this.won === false) {
            $("#start").prop("disabled",false);
            $("#reset").prop("disabled",false);
            this.score++;
        }
        this.won = true;
    }
};

//
// Handle keyboard input of up/down/left/right to move player one block accordingly
//
Player.prototype.handleInput = function(kc) {
    if(this.won === true) {
        return;
    }
    if(this.timeup === true) {
        return;
    }
    if (kc === 'left') {
        if(this.x-100 >= 0) {
            this.x = this.x-100;
        }
    }
    else if (kc === 'right') {
        if(this.x+100 < 500) {
            this.x = this.x+100;
        }
    }
    else if (kc === 'up') {
        if(this.y-100 >= 0) {
            this.y = this.y-100;
        }
    }
    else if (kc === 'down') {
        if(this.y+100 < 500) {
            this.y = this.y+100;
        }
    }
};

//
// Objects Instantiation
//
var allEnemies=[];
for(var i=0;i<4;i++) {
    var enemy = new Enemy();
    enemy.origy = (i+1)*75;
    enemy.origx = -50;
    enemy.x = enemy.origx;
    enemy.y = enemy.origy;
    enemy.speed = Math.random()*5;
    allEnemies[i] = enemy;
}

var player = new Player();

//
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
//
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

//
//Handling the click of Start button
//
$("#start").click(function() {
    startTime = Date.now();
    // Disable Start and Reset Button once the game is on
    $("#start").prop("disabled",true);
    $("#reset").prop("disabled",true);

    // Do a Player and Enemy reset
    player.reset();
    var i;
    for(i=0;i<allEnemies.length;i++)
        allEnemies[i].reset();

    //Update the captions
    $("#game").text("Arcade Game");
    $("#game").css({"color": "white"});
    $("#logo").attr("src","images/Gem Orange.png");
    console.log(startTime);
});
