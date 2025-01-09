class Player {
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.x_momentum = 0;
        this.y_momentum = 0;
        console.log(this.x)
        console.log(this.y)
        document.addEventListener("keydown", (e) => this.movement(e))
        setInterval(() => this.setPosition(), 10)
    }

    /*

    */
    movement(event){
        switch (event.key) {
            case "a":
                this.x = this.x - 10;
                console.log(">w< klikłeś: " + event.key + ", teraz x = " + this.x.toString())
                break;
            case "d":
                this.x = this.x + 10;
                console.log(">w< klikłeś: " + event.key + ", teraz x = " + this.x.toString())
                break;
            default:
                break;
        }
    }



    setPosition(){
        //this.x += 1;
        //console.log(this.x);
        document.getElementById("button_start").innerHTML = this.x;
        document.getElementById("player_sprite").style.left = this.x.toString() + "px";
        document.getElementById("player_sprite").style.top = this.y.toString() + "px";
    }

}

class Wall {
    constructor(id, length){
        this.id = id;
        this.length = length;
    }
}

function startGame(){
    document.getElementById("menu").style.display = "none";
    let player = new Player(0, 0);
    console.log(player.x);
    console.log(player.y);
}









//setTimeout(myFunction,3000);

//console.log("siema");

//async function myFunction() {
//    document.getElementById("elo").innerHTML = "siema";
//}