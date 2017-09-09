
    var game = {
        currPlayer: 'player1',
        dangerPoints: {
            '27': 5,
            '40': 3,
            '43': 18,
            '54': 31,
            '66': 45,
            '76': 58,
            '89': 53,
            '99': 41
        },
        successPoints: {
            '4': 25,
            '13': 46,
            '33': 49,
            '42': 63,
            '50': 69,
            '62': 81,
            '74': 92
        }
    };
    var c = document.getElementById("myCanvas");
    var ctx = c.getContext("2d");
    var dice = document.getElementById("dice");
    var dices = ['&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];
    var stopped = true;
    var t;

    game.player1 = new Player(localStorage.getItem('player1Name') || 'Dummy');
    game.player2 = new Player();

    function Player(name){
        this.name = name || 'Danny';
        this.oldX = 87;
        this.oldY = 660;
        this.oldBack = new Image();
        this.score = 0;
        this.newScore = 0;
    }

    function paintGameBoard() {
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 87, 0, 893, 800);
            var owMP3 = new Audio("public/assets/background-sound.mp3");
            owMP3.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            owMP3.play();
         }
         img.src = "public/assets/snakenladder.png";
        ctx.drawImage(img, 10, 10);
    }

    function change() {
        var random = Math.floor(Math.random() * 6);
        this.diceScore = random;
        dice.innerHTML = dices[random];
    }

    function stopstartDice() {
        if (stopped) {
            stopped = false;
            t = setInterval(change.bind(this), 200);
        } else {
            var currPlayer = game[game.currPlayer];
            var altPlayer = game.currPlayer == "player1" ? game["player2"] : game["player1"];
            
            //extra chance when player gets six
            if (this.diceScore == 5) {
                ++ stopstartDice.sixCount; 

                // 3 simultaneous six, change player
                if(stopstartDice.sixCount == 3){
                    stopstartDice.sixCount = 0;
                    
                    // note is required here
                    changePlayer();
                }else{
                    clearInterval(t);
                    stopped = true;
                    // note is required here, roll the dice again
                    setTimeout(rollDice,2000);
                    
                }
            }else{
                currPlayer.newScore = currPlayer.newScore + (stopstartDice.sixCount*6) + this.diceScore + 1;
                stopstartDice.sixCount = 0;
                clearInterval(t);
                stopped = true;
                movePlayer(currPlayer, altPlayer);
            }
        }
    }

    stopstartDice.sixCount = 0;

    function movePlayer(currPlayer, altPlayer){
        
        if(currPlayer.score < currPlayer.newScore){
            var owMP3 = new Audio("public/assets/key7.mp3");
            owMP3.play();
            if (currPlayer.oldX != 87) {
                ctx.putImageData(currPlayer.oldBack, currPlayer.oldX, currPlayer.oldY);
            }

            var img = new Image();
            //img.setAttribute('crossOrigin', '*');
            img.src = "public/assets/"+ game.currPlayer +".png";
            img.onload = function(){
                currPlayer.score += 1;
                // check if positions coincides
                if(currPlayer.score == currPlayer.newScore && currPlayer.score == altPlayer.newScore){
                    handlePlayersCollision(currPlayer, altPlayer); 
                }

                updateCoordinates(currPlayer);
                currPlayer.oldBack = ctx.getImageData(currPlayer.oldX, currPlayer.oldY, 80, 50);
                ctx.drawImage(img, currPlayer.oldX, currPlayer.oldY, 80, 50);
                if(currPlayer.score == 100){
                    showPopup();
                    return;
                }
                setTimeout(movePlayer.bind(this,currPlayer, altPlayer),1200);
            }
        }else{
            if(game.dangerPoints.hasOwnProperty(currPlayer.newScore)){
                checkSnake(currPlayer, altPlayer);
                return;
            }
            if(game.successPoints.hasOwnProperty(currPlayer.newScore)){
                checkLadder(currPlayer, altPlayer);
                return;
            }

            changePlayer();
        }
    }

    function showPopup(){
        var div;
        if(game.currPlayer == "player1"){
            div = '<h2>Congratulations ! You win</h2><div class="emoticon" align="center">☺ ☺ ☺</div>';
        }else{
            div = '<h2>You lose. Better luck next time.</h2><div class="emoticon" align="center">☹ ☹ ☹</div>';
        }
        document.getElementById('content').innerHTML = div;
        window.location.href = 'game-board.html#notice'
    }

    function changePlayer(){
        game.currPlayer = game.currPlayer == "player1" ? "player2" : "player1";
        
        setTimeout(function(){
            var arrow = document.getElementById('arrow');
            arrow.classList.toggle('towards-left');
            arrow.classList.toggle('towards-right');

            rollDice();
        },2000);
    }

    function rollDice(){
        if(game.currPlayer == "player2"){
            //roll the dice for Danny
            stopstartDice();
        
            //stop the dice for danny
            setTimeout(function(){
                stopstartDice();
            },2000);
        }else{
            // player1 has to roll the dice
            document.getElementById('dice').classList.add('hide');
            document.getElementById('dice-roller').classList.remove('hide');
        }
    }

    function handlePlayersCollision(currPlayer, altPlayer){
        var imgName = game.currPlayer == 'player1' ? 'player2' : 'player1';
        ctx.putImageData(altPlayer.oldBack, altPlayer.oldX, altPlayer.oldY);
        currPlayer.oldBack = altPlayer.oldBack;

        var img = new Image();
        img.src = "public/assets/"+ imgName +".png";
        img.onload = function(){
            altPlayer.oldBack = ctx.getImageData(25, 660, 80, 50);
            ctx.drawImage(img, 25, 660, 80, 50);
        }
        altPlayer.score = 0;
        altPlayer.newScore = 0;
        altPlayer.oldX = 25;
        altPlayer.oldY = 660;
    }
 
    function updateCoordinates(player){
        var score = player.score;
        if(score >= 1 && score <= 10){
            player.oldY = 660;
            setXForOddRow(player);
            return;
        }
        if(score >= 11 && score <= 20){
            player.oldY = 585;
            setXForEvenRow(player);
            return;
        }
        if(score >= 21 && score <= 30){
            player.oldY = 515;
            setXForOddRow(player);
            return;
        }
        if(score >= 31 && score <= 40){
            player.oldY = 445;
            setXForEvenRow(player);
            return;
        }
        if(score >= 41 && score <= 50){
            player.oldY = 380;
            setXForOddRow(player);
            return;
        }
        if(score >= 51 && score <= 60){
            player.oldY = 305;
            setXForEvenRow(player);
            return;
        }
        if(score >= 61 && score <= 70){
            player.oldY = 225;
            setXForOddRow(player);
            return;
        }
        if(score >= 71 && score <= 80){
            player.oldY = 155;
            setXForEvenRow(player);
            return;
        }
        if(score >= 81 && score <= 90){
            player.oldY = 80;
            setXForOddRow(player);
            return;
        }
        if(score >= 91 && score <= 100){
            player.oldY = 15;
            setXForEvenRow(player);
            return;
        }
    }

    function setXForOddRow(player){
        var score = player.score;
        switch(score%10){
            case 0:
                player.oldX = 880;
                break;
            case 1:
                player.oldX = 98;
                break;
            case 2:
                player.oldX = 190;
                break;
            case 3:
                player.oldX = 277;
                break;
            case 4:
                player.oldX = 368;
                break;
            case 5:
                player.oldX = 446;
                break;
            case 6:
                player.oldX = 553;
                break;
            case 7:
                player.oldX = 644;
                break;
            case 8:
                player.oldX = 730;
                break;
            case 9:
                player.oldX = 815;
                break;
        }
    }

    function setXForEvenRow(player){
        var score = player.score;
        switch(score%10){
            case 0:
                player.oldX = 98;
                break;
            case 1:
                player.oldX = 880;
                break;
            case 2:
                player.oldX = 815;
                break;
            case 3:
                player.oldX = 730;
                break;
            case 4:
                player.oldX = 644;
                break;
            case 5:
                player.oldX = 553;
                break;
            case 6:
                player.oldX = 446;
                break;
            case 7:
                player.oldX = 368;
                break;
            case 8:
                player.oldX = 277;
                break;
            case 9:
                player.oldX = 190;
                break;
        }
    }

    function checkSnake(currPlayer, altPlayer){
        var owMP3 = new Audio("public/assets/snakehiss2.mp3");
        owMP3.play();
        // check for snake        
        currPlayer.newScore = game.dangerPoints[currPlayer.score];
        currPlayer.score = currPlayer.newScore - 1;
        movePlayer(currPlayer, altPlayer); 
    }

    function checkLadder(currPlayer, altPlayer){
        var currPlayer = game[game.currPlayer];
        var owMP3 = new Audio("public/assets/happykids.mp3");
        owMP3.play();
        currPlayer.newScore = game.successPoints[currPlayer.score];
        currPlayer.score = currPlayer.newScore - 1;
        movePlayer(currPlayer, altPlayer);
    }

    document.getElementById('dice-roller').addEventListener('click',function(){
        document.getElementById('dice').classList.remove('hide');
        this.classList.add('hide');
        // roll the dice for 3 sec and stop
        stopstartDice();
        setTimeout(function(){
            stopstartDice();
        },2000);
    });

    function init() {
        var targetPlayer = document.getElementById("player1").getElementsByClassName("player")[0];
        targetPlayer.innerHTML = localStorage.getItem('player1Name');
        paintGameBoard();
    }

    init();
