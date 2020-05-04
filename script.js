class Wall {
    constructor(x, y, width, height) {
        this.x = x*window.innerWidth/100;
        this.y = y*window.innerHeight/100;
        this.height = height*window.innerHeight/100;
        this.width = width*window.innerWidth/100;
    }

    getHTML() {
        return (`
            <div class="wall" id="wall-"${Math.floor(Math.random()*1000)}"
                    style="
                        left: ${this.x}px;
                        top: ${this.y}px;
                        height: ${this.height}px;
                        width: ${this.width}px;
                    "
            </div>
        `)
    }
}

class Square {
    constructor(x, y) {
        this.x = x*window.innerWidth/100;
        this.y = y*window.innerHeight/100;
        this.velocity = {x: 0, y: 0};
        this.acceleration = {x: 0, y: 1};
        this.id = "square";

        this.jumping = false;

        this.walls = [];

        //TODO: update with screen size updates and also what if not 50px?
        this.width = 50;
        this.height = 50;
    }

    moving(direction, state) {
        if(direction, state) {
            $("#"+this.id).addClass("moving-"+direction);
        } else {
            $("#"+this.id).removeClass("moving-"+direction);
        }
    }

    jump() {
        if(!this.jumping) {
            this.jumping = true;
            $("#"+this.id).addClass("jumping");
            this.velocity.y += -20;
            setTimeout(() => {
                this.jumping = false;
                $("#"+this.id).removeClass("jumping");
            }, 700);
        }
    }

    updateWalls() {
        let walls = [];
        $(".wall").each(function(idx, item) {
            let pxToNum = item => Math.round(item.substring(0, item.length - 2));
            // we might have rounding issues
            
            walls.push({
                x: pxToNum(item.style.left),
                y: pxToNum(item.style.top),
                height: item.offsetHeight,
                width: item.offsetWidth,
            });
        });
        this.walls = walls;
    }

    updateCoords() {
        // this.x = x;
        const oldCoords = {x: this.x, y: this.y};
        this.velocity.x += this.acceleration.x;
        this.velocity.y += this.acceleration.y;

        let y = this.y + this.velocity.y;
        let x = this.x + this.velocity.x;

        this.walls.forEach((wall, idx) => {
            if (x < wall.x + wall.width &&
                x + this.width > wall.x &&
                y < wall.y + wall.height &&
                y + this.height > wall.y) {

                const xDifference = Math.min(Math.abs(x - (wall.x + wall.width)),
                                        Math.abs(x + this.width - wall.x));
                const yDifference = Math.min(Math.abs(y - (wall.y + wall.height)),
                                        Math.abs(y + this.height - wall.y));

                                        console.log(idx, xDifference, yDifference);

                if(xDifference > yDifference) {
                    console.log("Y");
                    if(this.velocity.y > 0) {
                        this.velocity.y = wall.y - (oldCoords.y + this.height);
                    }
                    if(this.velocity.y < 0) {
                        this.velocity.y = oldCoords.y - (wall.y + wall.height);
                    }
                } else {
                    console.log("X");
                    if(this.velocity.x > 0) {
                        this.velocity.x = wall.x - (oldCoords.x + this.width);
                    }
                    if(this.velocity.x < 0) {
                        this.velocity.x = oldCoords.x - (wall.x + wall.width);
                    }
                }
             }
        });

        x = this.x + this.velocity.x;
        y = this.y + this.velocity.y;

        this.x = x;
        this.y = y;

        // console.log(this.velocity);

        $("#"+this.id).css({
            left: this.x + "px",
            top: this.y + "px",
        });
    }

    getHTML() {
        return (`
        <div class="square" id="${this.id}"
            style="
                left: ${this.x}px;
                top: ${this.y}px;
            "
        </div>
    `)
    }
}

initMainLoop = square => {
    const tickLength = 20;

    let update = () => {
        square.updateCoords();
    }

    let updateWalls = () => {
        square.updateWalls();
    }

    setInterval(update, tickLength);
    setInterval(updateWalls, tickLength*10);
}

$(document).ready(function() {
    $("#hello").html("hi");

    $("#board-outer").append(new Wall(19, 20, 10, 20).getHTML());
    $("#board-outer").append(new Wall(10, 40, 50, 20).getHTML());
    $("#board-outer").append(new Wall(0, 95, 100, 5).getHTML());
    $("#board-outer").append(new Wall(0, 80, 100, 5).getHTML());

    let square = new Square(30, 20);

    $("#board-outer").append(square.getHTML());

    initMainLoop(square);

    $("body").keydown(function(e) {
        if(e.keyCode == 37) { // left
            square.velocity.x = -5;
            square.moving("left", true);
        }
        if(e.keyCode == 38) { // up
            if(square.velocity.y === 0) {
                square.jump();
            }
        }
        else if(e.keyCode == 39) { // right
            square.velocity.x = 5;
            square.moving("right", true);
        }
    });
    $("body").keyup(function(e) {
        if(e.keyCode == 37) { // left
            square.velocity.x = 0;
            square.moving("left", false);
        }
        else if(e.keyCode == 39) { // right
            square.velocity.x = 0;
            square.moving("right", false);
        }
    });
});