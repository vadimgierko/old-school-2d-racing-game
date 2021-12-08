let speed, randomNum, randomColor, enemyCarColor, stripesYs, car, enemyCar;
let shift, enemyCars, enemyCarsXs;

let carsPassed, level, crushes;

let startScreen, game, pause, end;

let canvas;

function setup() {
  //setting canvas
  canvasWidth = 400;
  canvasHeight = 400;
  // putting canvas into the div
  canvas = createCanvas(canvasWidth, canvasHeight);
  canvas.parent("canvas");

  noStroke();
  rectMode(CENTER);

  // number of pixels to be shifted when car goes left/ right
  shift = 100;
  
  speed = 1;
  
  startScreen = true;
  game = false;
  pause = false;
  end = false;

  carsPassed = 0;
  level = 0;
  crushes = 0;

  //tablica samochodów przeciwników = tablica obiektów !!!
  //to, z czym wchodzimy w interakcję, tuż po wywołaniu postaci!
  //z randomowym x oraz stałą odległością pomiędzy autami y
  enemyCar = []; //array to store enemyCars properties

  for (let i = 0; i < 200; i++) {
    //adding an enemyCar to the array
    // with y & random color
    enemyCar.push(new EnemyCar(0 - i * 450, color(random(0, 255), 0, random(0, 255))));
  }

  car = new Car();

  randomNum = floor(random(0, 3));

  //tablica y-ków pasków
  stripesYs = [];
  for (var i = 0; i < 10; i++) {
    stripesYs.push(0 + i * 50);
  }
}

function draw() {
  background(69, 77, 102);
  
  // carPassed, level & speed text style:
  noStroke();
  textAlign(LEFT);
  fill("white");
  textStyle(NORMAL);
  textSize(15);
  text("Crushes: " + crushes, 305, 40);
  text("Cars passed: " + carsPassed, 277, 66);
  text("Level: " + level, 325, 95);
  text("Speed: " + speed, 317, 122);

  textSize(30);

  car.draw();

  //draw stripes
  for (let j = 0; j < 4; j++) {
    for (let i = 0; i < 10; i++) {
      fill(255, 255, 255);
      rect(50 + j * 100, stripesYs[i], 5, 25);

      if (game) {
        stripesYs[i] += speed;
      }

      if (stripesYs[i] >= 400) {
        stripesYs[i] = 0;
      }
    }
  }

  //adding an enemyCar to the array
  for (let i = 0; i < enemyCar.length; i++) {
    if (game) {
      enemyCar[i].y += speed * 4;
    }

    enemyCar[i].draw();

    //check for crush
    if (car.crush(enemyCar[i])) {
      crushes++;
    }

    //check for pass an enemyCar
    if (car.passed(enemyCar[i])) {
      carsPassed++;
    }
  }

  if (startScreen || pause) {
    textAlign(CENTER);
    fill("yellow");
    stroke(1)
    textStyle(BOLD);
    text(
      "Press ENTER to start!",
      canvasWidth / 2,
      canvasHeight / 2
    );
    speed = 0;
  } else {
    speed = 1;
  }
  
  level = floor(carsPassed / 10);
  speed = 1 + level * 0.2;

  // end game check & text
  if (crushes === 5) {
    textAlign(CENTER);
    fill("red");
    stroke(1)
    textStyle(BOLD);
    text(
      "You lose!",
      canvasWidth / 2,
      canvasHeight / 2 - 15
    );
    text(
      "Press ENTER to play again!",
      canvasWidth / 2,
      canvasHeight / 2 + 15
    );
    speed = 0;
    end = true;
    game = false;
    pause = false;
  }
}

// p5 function for KeyReleased events
keyReleased = function () {
  //samochód skręca dopiero kiedy puścisz klawisz
  if (keyCode === LEFT_ARROW) {
    car.left();
  }

  if (keyCode === RIGHT_ARROW) {
    car.right();
  }
  
  if (keyCode === ENTER) {
    if (startScreen) {
      startScreen = false;
      pause = false;
      game = true;
    } else {
      if (pause) {
        pause = false;
        game = true;
      } else {
        if (game) {
          game = false;
          pause = true;
        } else {
          if (end) {
            speed = 1;

            game = true;
            pause = false;
            end = false;

            carsPassed = 0;
            level = 0;
            crushes = 0;
            
            enemyCars = [];
          }
        }
      }
    }
  }
};

//--------------------------- CAR CONSTRUCTOR -------------------
let Car = function () {
  this.x = canvasWidth / 2;
  this.y = canvasHeight - 55;
  this.width = 50;
  this.height = 100;
};

Car.prototype.draw = function () {
  this.x = constrain(this.x, 100, 300);

  //wheels
  fill(43, 43, 43);
  rect(this.x - 25, this.y - 30, 10, 18, 20); //lewe przednie koło
  rect(this.x + 25, this.y - 30, 10, 18, 20); //lewe prawe koło
  rect(this.x - 25, this.y + 35, 10, 18, 20); //lewe tylne koło
  rect(this.x + 25, this.y + 35, 10, 18, 20); //prawe tylne koło

  //karoseria
  fill(0, 0, 0);
  rect(this.x, this.y, this.width, this.height, 10);

  //paski
  fill(255, 247, 0);
  rect(this.x - 5, this.y, this.width / 10, this.height); //yellow stripes
  rect(this.x + 5, this.y, this.width / 10, this.height); //yellow stripes

  //szyby
  fill(73, 176, 250); //przednia
  rect(this.x, this.y - this.height / 4, 40, this.height / 10);
  fill(12, 93, 148); //tylna
  rect(this.x, this.y + this.height / 3, 40, this.height / 15);
  fill(10, 89, 145); //lewa
  rect(this.x - 19, this.y + 5, 3, this.height / 2);
  fill(53, 132, 189); //prawa
  rect(this.x + 18, this.y + 5, 3, this.height / 2);

  //lights
  fill(250, 238, 0);
  rect(this.x - 16, this.y - 48, 10, 4); //left light
  rect(this.x + 16, this.y - 48, 10, 4); //right light

  //tylne światła
  fill(176, 14, 27);
  rect(this.x - 19, this.y + 48, 10, 4); //left light
  rect(this.x + 19, this.y + 48, 10, 4); //right light
};

Car.prototype.left = function () {
  //samochód skręca dopiero kiedy puścisz klawisz
  //precyzyjnie na kolejny pas
  if (this.x === 200) {
    this.x = 100;
  }

  if (this.x === 300) {
    this.x = 200;
  }
};

Car.prototype.right = function () {
  if (this.x === 200) {
    this.x = 300;
  }

  if (this.x === 100) {
    this.x = 200;
  }
};

//detekcja zderzenia
Car.prototype.crush = function (enemyCar) {
  if (
    this.x === enemyCar.x &&
    this.y - this.height / 2 <= enemyCar.y + enemyCar.height / 2 &&
    this.y + this.height / 2 >= enemyCar.y - enemyCar.height / 2
  ) {
    //wynosimy uderzony samochód poza ekran
    enemyCar.x = -500;
    enemyCar.y = 500;

    let textY = this.y - 64;

    // wyświetlenie napisu "CRUSH!!!" podczas zderzenia
    fill(255, 0, 0);
    rect(this.x, this.y - 70, this.width * 2, this.height / 3);
    fill(255, 255, 255);
    textSize(20);
    text("CRUSH!!!", this.x - 44, textY);
    textY = 500;

    return true;
  }
};

//detekcja minięcia samochodów
Car.prototype.passed = function (enemyCar) {
  if (enemyCar.y >= canvasHeight && enemyCar.y < canvasHeight + speed * 4) {
    return true;
  }
};

//-------------------KONSTRUKTOR SAMOCHODU PRZECIWNIKA------------------
let EnemyCar = function (y, enemyCarColor) {
  this.x = canvasWidth / 2 + floor(random(-1, 2)) * 100;
  this.y = y;
  this.width = 50;
  this.height = 100;
  this.color = enemyCarColor;
};

EnemyCar.prototype.draw = function () {
  //wheels
  fill(43, 43, 43);
  rect(this.x - 25, this.y - 30, 10, 18, 20); //lewe przednie koło
  rect(this.x + 25, this.y - 30, 10, 18, 20); //lewe prawe koło
  rect(this.x - 25, this.y + 35, 10, 18, 20); //lewe tylne koło
  rect(this.x + 25, this.y + 35, 10, 18, 20); //prawe tylne koło

  //karoseria
  fill(this.color);
  rect(this.x, this.y, this.width, this.height, 10);

  //szyby
  fill(73, 176, 250); //przednia
  rect(this.x, this.y - this.height / 4, 40, this.height / 10);
  fill(12, 93, 148); //tylna
  rect(this.x, this.y + this.height / 3, 40, this.height / 15);
  fill(10, 89, 145); //lewa
  rect(this.x - 19, this.y + 5, 3, this.height / 2);
  fill(53, 132, 189); //prawa
  rect(this.x + 18, this.y + 5, 3, this.height / 2);

  //lights
  fill(250, 238, 0);
  rect(this.x - 16, this.y - 48, 10, 4); //left light
  rect(this.x + 16, this.y - 48, 10, 4); //right light

  //tylne światła
  fill(176, 14, 27);
  rect(this.x - 19, this.y + 48, 10, 4); //left light
  rect(this.x + 19, this.y + 48, 10, 4); //right light
};
