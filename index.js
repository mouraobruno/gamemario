class Game {
  constructor() {
    this.score = 0;
    this.obstacles = [];
    this.player = null;
    this.playing = false;
    this.intervalId = null;
    this.frames = 0;
  }
  start() {
    startScreen.classList.add("hidden");
    gameScreen.classList.remove("hidden");
    this.player = new Player();
    this.playing = true;
    this.intervalId = setInterval(this.updateObstacles, 20);
  }
  updateObstacles = () => {
    this.frames += 1;
    this.countScore();

    if (this.frames % 120 === 0) {
      this.createRandomObstacle();
    }

    for (let i = 0; i < this.obstacles.length; i += 1) {
      this.obstacles[i].moveLeft();
      const crash = this.player.crashesWith(this.obstacles[i]);
      if (crash) {
        clearInterval(this.intervalId);
        this.playing = false;
        this.showGameOver();
      }
      if (this.obstacles[i].x <= 0) {
        this.obstacles[i].hide();
        this.obstacles.shift();
      }
    }
  };
  createRandomObstacle() {
    const y = Math.floor(Math.random() * gameScreen.offsetHeight);
    const obstacle = new Obstacle(y);
    this.obstacles.push(obstacle);
  }
  countScore() {
    this.score = Math.floor(this.frames / 30);
    document.querySelector("#score").innerHTML = this.score;
  }
  showGameOver() {
    document.querySelector("#game-over span").innerHTML = this.score;
    document.querySelector("#game-over").classList.remove("hidden");
  }
}

class Player {
  constructor() {
    this.width = 120;
    this.height = 120;
    this.x = 0;
    this.y = 390;
    this.speed = 50;
    this.element = null;
    this.createElement();
    this.show();
  }

  createElement() {
    const div = document.createElement("img");
    div.setAttribute("id", "player");
    div.style.width = `${this.width}px`;
    div.style.height = `${this.height}px`;
    div.style.position = "absolute";
    div.style.top = `${this.y}px`;
    div.style.left = `${this.x}px`;
    div.src = "./Imagens/mario.gif";
    this.element = div;
  }
  show() {
    gameScreen.appendChild(this.element);
  }
  moveLeft() {
    if (this.x <= 0) return;
    this.x -= this.speed;
    this.element.style.left = `${this.x}px`;
  }
  moveRight() {
    if (this.x + this.width >= gameScreen.offsetWidth) return;
    this.x += this.speed;
    this.element.style.left = `${this.x}px`;
  }

  crashesWith(obstacle) {
    // limites do player
    const top = this.y;
    const bottom = this.y + this.height;
    const left = this.x;
    const right = this.x + this.width;
    // limites do obstáculo
    const obsTop = obstacle.y;
    const obsBottom = obstacle.y + obstacle.height;
    const obsLeft = obstacle.x;
    const obsRight = obstacle.x + obstacle.width;
    // verificar se eles estão "fora" um do outro
    const out =
      bottom < obsTop || top > obsBottom || left > obsRight || right < obsLeft;
    return !out;
  }
}

class Obstacle {
  constructor(y) {
    this.x = gameScreen.offsetWidth - 100;
    this.y = y;
    this.speed = 6;
    this.width = 70;
    this.height = 70;
    this.element = null;
    this.createElement();
    this.show();
  }
  createElement() {
    const div = document.createElement("img");
    div.classList.add("obstacle");
    div.style.width = `${this.width}px`;
    div.style.height = `${this.height}px`;
    div.style.position = "absolute";
    div.style.top = `${this.y}px`;
    div.style.left = `${this.x}px`;
    div.src = "./Imagens/pipe.png";

    this.element = div;
  }
  show() {
    gameScreen.appendChild(this.element);
  }
  hide() {
    gameScreen.removeChild(this.element);
  }
  moveLeft() {
    if (this.x <= 0) return;
    this.x -= this.speed;
    this.element.style.left = `${this.x}px`;
  }
}

const mario = document.querySelector(".mario");
//criar o elemento com a imagem do mario e trazer do css a classe

const pipe = document.querySelector(".pipe");

const jump = () => {
  mario.classList.add("jump");
  setTimeout(() => {
    mario.classList.remove("jump");
  }, 500);
}; // nessa funcao usar o settimeout para remover e adicionar o evento do pulo

const loop = setInterval(() => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window
    .getComputedStyle(mario)
    .bottom.replace("px", "");
  //foi preciso adicionar o getcomputestyle para pegar a posicao do mario
  //adicionei o sinal de + para converter a string em numero
  if (pipePosition <= 100 && pipePosition > 0 && marioPosition < 70) {
    pipe.style.animation = "none";
    pipe.style.left = `${pipePosition}px`;

    mario.style.animation = "none";
    mario.style.bottom = `${marioPosition}px`;

    mario.src = "./imagens/mariogameover.jpg";
    mario.style.width = "80px";
    mario.style.marginLeft = "20px";

    clearInterval(loop);
  }
}, 10);

document.addEventListener("keydown", jump); //keydown e usado para ativar o movimento atraves de qualquer tecla do teclado
