(function _mainClosures($) {
    // Utilities
    var logIt = function _logger(name, f) {
        return function _logging(/* args */) {
            var args = arguments;

            console.log('Executed ' + name);

            return f.apply(this, arguments);
        };
    };

    var parseInteger = function _parser(defaultValue, text) {
        var value = parseInt(text, 10);

        return isNaN(value) ? defaultValue : value;
    };

    $(function () {
        var $playground = $('#playground'),
            playgroundTop = $playground.offset().top;

        var $paddleA = $("#paddleA"),
            $paddleB = $("#paddleB");

        var $ball = $('#ball');

        var pingpong = {
            paddleA: {
                element: $paddleA,
                x: 50,
                y: 100,
                width: 20,
                height: 70
            },
            paddleB: {
                element: $paddleB,
                x: 320,
                y: 100,
                width: 20,
                height: 70
            },
            ball: {
                element: $ball,
                speed: 5,
                radius: 5,
                x: 150,
                y: 100,
                directionX: 1,
                directionY: 1
            },
            playground: {
                offsetTop: playgroundTop,
                height: parseInteger(0, $playground.height()),
                width: parseInteger(0, $playground.width())
            },
            score: {
                player: 0,
                agent: 0
            }
        };

        $playground.on('mouseenter', function () {
            Object.assign(pingpong, {
                isPaused: false
            });

        }).on('mouseleave', function () {
            Object.assign(pingpong, {
                isPaused: true
            });
        }).on('mousemove', function (event) {
            var mouseY = event.pageY;

            Object.assign(pingpong.paddleB, {
                y: mouseY - pingpong.playground.offsetTop
            });
        });

        // view rendering
        var renderPaddle = function (paddle) {
            paddle.element.css('top', paddle.y);
        };

        var renderPaddles = function _renderPaddles() {
            renderPaddle(pingpong.paddleA);
            renderPaddle(pingpong.paddleB);

        };

        var renderBall = function _renderBall(ball) {
            ball.element.css('top', ball.y);
            ball.element.css('left', ball.x);
        };

        var ballHitsTopBottom = function _colnlisionVertical(ball, playground) {
            var y = ball.y + ball.speed * ball.directionY;

            return y < 0 || y > playground.height;
        };

        var ballHitsLeftWall = function _collisionLeft(ball, playground) {
            var x = ball.x + ball.speed * ball.directionX;

            return x < 0;
        };

        var ballHitsRightWall = function _collisionLeft(ball, playground) {
            var x = ball.x + ball.speed * ball.directionX;

            return x > playground.width;
        };

        var accelerateBall = function _accelerate(ball) {
            Object.assign(ball, {
                x: ball.x  + ball.directionX * ball.speed,
                y: ball.y + ball.directionY * ball.speed
            });
        };

        var movePaddle = function (paddle, ball) {
            var speed = 4,
              direction = 1;

            var paddleY = paddle.y + paddle.height / 2;

            if (paddleY > ball.y) {
                direction = -1;
            }

            Object.assign(paddle, {
                y: paddle.y + speed * direction
            });
        };

        var renderScore = function (score) {
            $('#playerScore').text(score.player);
            $('#agentScore').text(score.agent);
        };

        var moveBall = logIt('BALL MOVE', function _moveBall() {
            var ball = pingpong.ball,
              playground = pingpong.playground;

            if (ballHitsLeftWall(ball, playground)) {
                playerAWin();
            }

            ball.speed = ball.speed * 0.999;

            if (ballHitsRightWall(ball, playground)) {
                playerBWin()
            }

            if (ballHitsTopBottom(ball, playground)) {
                Object.assign(ball, {
                    directionY: -1 * ball.directionY
                });
            }

            var ballX = ball.x,
              ballY = ball.y;

            // Check lef
            if (ballX >= pingpong.paddleA.x && ballX < pingpong.paddleA.x + pingpong.paddleA.width) {
                if (ballY <= pingpong.paddleA.y + pingpong.paddleA.height && ballY >= pingpong.paddleA.y) {
                    ball.directionX = 1;
                }
            }

            // check right paddle
            if (ballX + pingpong.ball.radius >= pingpong.paddleB.x && ballX < pingpong.paddleB.x + pingpong.paddleB.width) {
                if (ballY <= pingpong.paddleB.y + pingpong.paddleB.height && ballY >= pingpong.paddleB.y) {
                    ball.directionX = -1;
                }
            }

            var agentPaddle = pingpong.paddleA,
              myPaddle = pingpong.paddleB;

            accelerateBall(ball);

            movePaddle(agentPaddle, ball);


            renderBall(ball);
            renderScore(pingpong.score);
        });

        var playerAWin = function _aWins() {
            Object.assign(pingpong.ball, {
                x: 250,
                y: 100,

                directionX: -1
            });

            Object.assign(pingpong.score, {
                agent: pingpong.score.agent + 1
            });
        };

        var playerBWin = function _bWins() {
            Object.assign(pingpong.ball, {
                x: 150,
                y: 100,

                directionX: 1
            });

            Object.assign(pingpong.score, {
                player: pingpong.score.player + 1
            });
        };


        var gameLoop = function _gameLoop() {
            moveBall();
        };

        var handleMouseInput = function () {
            // NOOP
        };

        var render = function _renderer() {
            renderPaddles();

            window.requestAnimationFrame(_renderer);
        };

        var init = logIt('INIT', function _init() {
            window.requestAnimationFrame(render);

            var fps = 60;

            setInterval(gameLoop, 1000 / fps);

            handleMouseInput();
        });

        (function _main() {
            init();
        }());

    });
}(jQuery));
