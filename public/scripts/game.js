
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

    var dice = document.getElementById("dice");
    var dices = ['&#9856;', '&#9857;', '&#9858;', '&#9859;', '&#9860;', '&#9861;'];
    var stopped = true;
    var t;
    var requestAnim = window.requestAnimationFrame ||
                    window.webkitRequestAnimationFrame ||
                    window.mozRequestAnimationFrame ||
                    setInterval;
    game.player1 = new Player('Nishi');
    game.player2 = new Player();

    function Player(name){
        this.name = name || 'Danny';
        this.oldX = 0;
        this.oldY = 660;
        this.oldBack = new Image();
        this.score = 0;
        this.newScore = 0;
    }

    function paintGameBoard() {
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var img = new Image();
        img.onload = function () {
            ctx.drawImage(img, 0, 0, 950, 800);
            var owMP3 = new Audio("../assets/background-sound.mp3");
            owMP3.addEventListener('ended', function() {
                this.currentTime = 0;
                this.play();
            }, false);
            owMP3.play();
        }
        img.src = "../assets/snakenladder.png";
        ctx.drawImage(img, 10, 10);
    }

    function init() {
        paintGameBoard();
        stopstartDice();
    }

    function change() {
        var random = Math.floor(Math.random() * 6);
        this.diceScore = random;
        dice.innerHTML = dices[random];
    }

    function stopstartDice() {
        if (stopped) {
            stopped = false;
            t = setInterval(change.bind(this), 100);
        } else {
            console.log(game[game.currPlayer].score);
            game[game.currPlayer].newScore += this.diceScore + 1;
            clearInterval(t);
            stopped = true;
            movePlayer(game[game.currPlayer].score);
        }

    }

    function movePlayer(){
        var c = document.getElementById("myCanvas");
        var ctx = c.getContext("2d");
        var currPlayer = game[game.currPlayer];
        var altPlayer = game.currPlayer == "player1" ? "player2" : "player1";
        
        // check if positions coincides
        if(currPlayer.newScore == game[altPlayer].newScore){
            ctx.putImageData(altPlayer.oldBack, altPlayer.oldX, altPlayer.oldY);
            currPlayer.oldBack = altPlayer.oldBack;
            updateCoordinates(currPlayer);
            game.currPlayer = altPlayer;
            setTimeout(stopstartDice,2000);

            return;
        }

        if(currPlayer.score < currPlayer.newScore){
            var owMP3 = new Audio("../assets/key7.mp3");
            owMP3.play();
            if (currPlayer.oldX) {
                ctx.putImageData(currPlayer.oldBack, currPlayer.oldX, currPlayer.oldY);
            }
            var img = new Image();
            img.src = "assets/"+ game.currPlayer +".png";
            img.onload = function(){
                currPlayer.score += 1;
                updateCoordinates(currPlayer);
                currPlayer.oldBack = ctx.getImageData(currPlayer.oldX, currPlayer.oldY, 80, 50);
                ctx.drawImage(img, currPlayer.oldX, currPlayer.oldY, 80, 50);
                setTimeout(movePlayer,1200);
            }
        }else{
            if(game.dangerPoints.hasOwnProperty(currPlayer.newScore)){
                checkSnake();
                return;
            }
            if(game.successPoints.hasOwnProperty(currPlayer.newScore)){
                checkLadder();
                return;
            }
            game.currPlayer = game.currPlayer == "player1" ? "player2" : "player1";
            setTimeout(function(){
                var arrow = document.getElementById('arrow');
                arrow.classList.toggle('towards-left');
                arrow.classList.toggle('towards-right');
                stopstartDice();
            },2000);
        }
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
            player.oldY = 375;
            setXForOddRow(player);
            return;
        }
        if(score >= 51 && score <= 60){
            player.oldY = 305;
            setXForEvenRow(player);
            return;
        }
        if(score >= 61 && score <= 70){
            player.oldY = 235;
            setXForOddRow(player);
            return;
        }
        if(score >= 71 && score <= 80){
            player.oldY = 165;
            setXForEvenRow(player);
            return;
        }
        if(score >= 81 && score <= 90){
            player.oldY = 90;
            setXForOddRow(player);
            return;
        }
        if(score >= 100 && score <= 91){
            player.oldY = 15;
            setXForEvenRow(player);
            return;
        }
    }

    function setXForOddRow(player){
        var score = player.score;
        switch(score%10){
            case 0:
                player.oldX = 860;
                break;
            case 1:
                player.oldX = 13;
                break;
            case 2:
                player.oldX = 105;
                break;
            case 3:
                player.oldX = 200;
                break;
            case 4:
                player.oldX = 295;
                break;
            case 5:
                player.oldX = 385;
                break;
            case 6:
                player.oldX = 480;
                break;
            case 7:
                player.oldX = 575;
                break;
            case 8:
                player.oldX = 670;
                break;
            case 9:
                player.oldX = 765;
                break;
        }
    }

    function setXForEvenRow(player){
        var score = player.score;
        switch(score%10){
            case 0:
                player.oldX = 13;
                break;
            case 1:
                player.oldX = 860;
                break;
            case 2:
                player.oldX = 765;
                break;
            case 3:
                player.oldX = 670;
                break;
            case 4:
                player.oldX = 575;
                break;
            case 5:
                player.oldX = 480;
                break;
            case 6:
                player.oldX = 385;
                break;
            case 7:
                player.oldX = 295;
                break;
            case 8:
                player.oldX = 200;
                break;
            case 9:
                player.oldX = 105;
                break;
        }
    }

    function checkSnake(){
        var currPlayer = game[game.currPlayer];
        var owMP3 = new Audio("../assets/snakehiss2.mp3");
        owMP3.play();
        // check for snake        
        currPlayer.newScore = game.dangerPoints[currPlayer.score];
        currPlayer.score = currPlayer.newScore - 1;
        movePlayer();
         
    }

    function checkLadder(){
        var currPlayer = game[game.currPlayer];
        var owMP3 = new Audio("../assets/happykids.mp3");
        owMP3.play();
        currPlayer.newScore = game.successPoints[currPlayer.score];
        currPlayer.score = currPlayer.newScore - 1;
        movePlayer();
    }

    init();
