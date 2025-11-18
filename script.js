const ball = document.getElementById("ball");
    const scoreDisplay = document.getElementById("score");
    const gameOverScreen = document.getElementById("gameOver");
    const restartBtn = document.getElementById("restart");
    const menu = document.getElementById("menu");
    const muteBtn = document.getElementById("mute");
    const controlsBtn = document.getElementById("controls");
    const clickSound = document.getElementById("clickSound");
    const pointSound = document.getElementById("pointSound");
    const crashSound = document.getElementById("crashSound");
    const bgMusic = document.getElementById("bgMusic");

    let gravity = 1.8;
    let velocity = 0;
    let position = window.innerHeight / 2;
    let score = 0;
    let record = localStorage.getItem("record") || 0;
    let obstacles = [];
    let speed = 5.5;
    let gameRunning = false;
    let controlMode = 'flip';

    scoreDisplay.textContent = `Score: 0 | Recorde: ${record}`;

    function startGame() {
      menu.style.display = "none";
      gameRunning = true;
      bgMusic.play();
      setInterval(createObstacle, 2000);
      gameLoop();
    }

    function createObstacle() {
      if (!gameRunning) return;
      const top = Math.random() > 0.5;
      const obs = document.createElement("div");
      obs.classList.add("obstacle");
      obs.style.top = top ? "0" : "auto";
      obs.style.bottom = top ? "auto" : "0";
      obs.style.right = "0px";
      document.getElementById("game").appendChild(obs);
      obstacles.push(obs);
    }

    function gameLoop() {
      if (!gameRunning) return;

      velocity += gravity * 0.5;
      position += velocity;

      if (position < 0) {
        position = 0;
        velocity = 0;
      }
      if (position > window.innerHeight - 30) {
        position = window.innerHeight - 30;
        velocity = 0;
      }

      ball.style.top = position + "px";

      obstacles.forEach((obs, i) => {
        let right = parseInt(obs.style.right);
        obs.style.right = (right + speed) + "px";

        if (right > window.innerWidth) {
          obs.remove();
          obstacles.splice(i, 1);
          score++;
          pointSound.play();
          if (score > record) {
            record = score;
            localStorage.setItem("record", record);
          }
          scoreDisplay.textContent = `Score: ${score} | Recorde: ${record}`;
          speed += 0.1;
          ball.style.background = `hsl(${score * 10 % 360}, 100%, 50%)`;
        }

        const ballRect = ball.getBoundingClientRect();
        const obsRect = obs.getBoundingClientRect();
        if (
          ballRect.left < obsRect.right &&
          ballRect.right > obsRect.left &&
          ballRect.top < obsRect.bottom &&
          ballRect.bottom > obsRect.top
        ) {
          crashSound.play();
          bgMusic.pause();
          gameRunning = false;
          gameOverScreen.style.display = "block";
        }
      });

      requestAnimationFrame(gameLoop);
    }
    muteBtn.addEventListener("click", () => {
        isMuted = !isMuted;
        muteBtn.textContent = isMuted ? "Som: Off" : "Som: On";
        
        if (isMuted) {
          bgMusic.pause();
        } else if (gameRunning && bgMusic.src) {
          bgMusic.play().catch(() => {});
        }
      });

      controlsBtn.addEventListener("click", () => {
        controlMode = controlMode === 'flip' ? 'jump' : 'flip';
        controlsBtn.textContent = controlMode === 'flip' ? 'Controles: Flip' : 'Controles: Jump';
        gravity = 0.6;
        ball.style.transform = 'rotate(0deg)';
      });

    document.addEventListener("click", () => {
      if (gameRunning) {
        gravity *= -1;
        clickSound.play();
      }
    });

    restartBtn.addEventListener("click", () => {
      location.reload();
    });
    
