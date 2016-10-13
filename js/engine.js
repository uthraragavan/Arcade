
//
// engine.js
// Author: Uthra Vijayaragavan
// Date modified: 10/11/2016
// This file provides the game loop functionality (update entities and render),
// draws the initial game board on the screen, and then calls the update and
// render methods on your player and enemy objects (defined in your app.js).
// When your player moves across
// the screen, it may look like just that image/character is moving or being
// drawn but that is not the case. What's really happening is the entire "scene"
// is being drawn over and over, presenting the illusion of animation.
// This engine is available globally via the Engine variable and it also makes
// the canvas' context (ctx) object globally available to make writing app.js
// a little simpler to work with.

//
// Engine class
//
'use strict';
var Engine = (function(global) {
    //
    //Predefine the variables we'll be using within this scope,
    //create the canvas element, grab the 2D context for that canvas
    //set the canvas elements height/width and add it to the DOM.
    //
    var doc = global.document,
        win = global.window,
        canvas = doc.createElement('canvas'),
        gametitle = doc.getElementById('game'),
        header = doc.getElementById('header'),
        ctx = canvas.getContext('2d'),
        lastTime,
        startTime;

    canvas.width = 505;
    canvas.height = 606;
    doc.body.appendChild(canvas);

    //
    //This function serves as the kickoff point for the game loop itself
    //and handles properly calling the update and render methods.
    //
    function main() {
        //
        // Time delta smoeethening calculation for constant speed across computers
        //
        var now = Date.now(),
            dt = (now - lastTime) / 1000.0;
        var timer = (now - global.startTime)/ 1000.0;
        if(timer > 20) {
            if(player.timeup === false)
            {
                $("#start").prop("disabled",false);
                $("#reset").prop("disabled",false);

            }
            player.timeup = true;
        }

        //
        // Call our update/render functions, pass along the time delta to
        // our update function since it may be used for smooth animation.
        //
        update(dt);
        render();

        //
        //Set our lastTime variable which is used to determine the time delta
        //for the next time this function is called.
        //
        lastTime = now;

        //
        // Use the browser's requestAnimationFrame function to call this
        // function again as soon as the browser is able to draw another frame.
        //
        win.requestAnimationFrame(main);
    }

    //
    // This function does some initial setup that should only occur once,
    // particularly setting the lastTime variable that is required for the
    // game loop.
    //
    function init() {
        $("#start").prop("disabled",true);
        $("#reset").prop("disabled",true);

        //player.reset();
        lastTime = Date.now();
        startTime = Date.now();
        global.startTime=startTime;
        main();
    }

    //
    // This function is called by main (our game loop) and itself calls all
    // of the functions which may need to update entity's data.
    //
    //
    function update(dt) {
        updateEntities(dt);
        checkCollisions();
    }

    //
    // This is called by the update function and loops through all of the
    // objects within your allEnemies array as defined in app.js and calls
    // their update() methods.
    //
    function updateEntities(dt) {
        var timerem = (Date.now() - global.startTime)/1000.0;
        var time = "Time: " + Math.round(timerem)+ "s";
        if(player.won === false && player.timeup === false)
            $("#time").text(time);
        else
            $("#score").text(player.score);

        allEnemies.forEach(function(enemy) {
            enemy.update(dt);
        });
        //player.update();
    }

    //
    // Check if Player and enemies collide with each other
    //
    function checkCollisions() {
        allEnemies.forEach(function(enemy) {
            //
            // Check if Player and Enemies are within 70px radius of each other
            // as the size of images would cover 70 px distance.
            // If any part of both player and enemy image touch each other
            // a collision should be detected
            //
            if((Math.abs(enemy.x - player.x) < 70) && (Math.abs(enemy.y - player.y) < 70)) {
                player.x = 200;
                player.y = 400;
            }
        });
    }

    //
    // This function initially draws the "game level", it will then call
    // the renderEntities function. Remember, this function is called every
    // game tick (or loop of the game engine) because that's how games work -
    // they are flipbooks creating the illusion of animation but in reality
    // they are just drawing the entire screen over and over.
    //
    function render() {
        //
        // This array holds the relative URL to the image used
        // for that particular row of the game level.
        //
        var rowImages = [
                'images/water-block.png',   // Top row is water
                'images/stone-block.png',   // Row 1 of 3 of stone
                'images/stone-block.png',   // Row 2 of 3 of stone
                'images/stone-block.png',   // Row 3 of 3 of stone
                'images/grass-block.png',   // Row 1 of 2 of grass
                'images/grass-block.png'    // Row 2 of 2 of grass
            ],
            numRows = 6,
            numCols = 5,
            row, col;

        for (row = 0; row < numRows; row++) {
            for (col = 0; col < numCols; col++) {
                /* The drawImage function of the canvas' context element
                 * requires 3 parameters: the image to draw, the x coordinate
                 * to start drawing and the y coordinate to start drawing.
                 * We're using our Resources helpers to refer to our images
                 * so that we get the benefits of caching these images, since
                 * we're using them over and over.
                 */
                ctx.drawImage(Resources.get(rowImages[row]), col * 101, row * 83);
            }
        }

        renderEntities();
    }

    //
    // This function is called by the render function and is called on each game
    // tick. Its purpose is to then call the render functions you have defined
    // on your enemy and player entities within app.js
    //
    function renderEntities() {
        allEnemies.forEach(function(enemy) {
            enemy.render();
        });

        player.render();
        if(player.won === true) {
            //
            // If player has won then set the speed of enemies to
            // zero so that they don't move
            //
            allEnemies.forEach(function(enemy) {
                enemy.resetSpeed();
            });
            // Update captions
            gametitle.innerHTML = "You won!";
            gametitle.style.color = "yellow";
            var img = document.getElementById("logo");
            img.src = "images/Star.png";

        }
        if(player.timeup === true) {
            //
            // If player has timed up then set the speed of enemies to
            // zero so that they don't move
            //
            allEnemies.forEach(function(enemy) {
                enemy.resetSpeed();
            });
            // Update captions only if player hasn't won
            if(player.won === false) {
                gametitle.innerHTML = "Time up!";
                gametitle.style.color = "yellow";
                var img = document.getElementById("logo");
                img.src = "images/Key.png";
            }

        }
    }

    //
    // Go ahead and load all of the images we know we're going to need to
    // draw our game level. Then set init as the callback method, so that when
    // all of these images are properly loaded our game will start.
    //
    Resources.load([
        'images/stone-block.png',
        'images/water-block.png',
        'images/grass-block.png',
        'images/enemy-bug.png',
        'images/char-boy.png'
    ]);
    Resources.onReady(init);

    //
    // Assign the canvas' context object to the global variable (the window
    // object when run in a browser) so that developers can use it more easily
    // from within their app.js files.
    //
    global.ctx = ctx;
    global.startTime = startTime;
})(this);
