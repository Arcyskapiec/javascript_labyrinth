let game = 0
let checkpoints = 0
let player
let map

class Player {
    constructor(x, y){
        this.x = x;
        this.y = y;
        //this.x_momentum = 0;
        //this.y_momentum = 0;
        //document.addEventListener("keydown", (e) => this.movementStart(e));
        //document.addEventListener("keyup", (e) => this.movementEnd(e));
        //setInterval(() => this.setPosition(), 10);
        document.addEventListener("keydown", (e) => this.movement(e.key))
    }

    movement(key){
        let possible_moves = this.getPossibleTilesToMoveTo();
        
        switch (key){
            case "w":
                if (possible_moves[0] == true){
                    this.y -= 1
                    this.move()
                    //this.checkInteractable()
                    
                    possible_moves = this.getPossibleTilesToMoveTo();
                    if(possible_moves[0] == true && possible_moves[1] == false && possible_moves[3] == false){
                        this.movement("w")
                    }
                }
                break;
            case "d":
                if (possible_moves[1] == true){
                    this.x += 1
                    this.move()
                    //this.checkInteractable()

                    possible_moves = this.getPossibleTilesToMoveTo();
                    if(possible_moves[0] == false && possible_moves[1] == true && possible_moves[2] == false){
                        this.movement("d")
                    }
                }
                break;
            case "s":
                if (possible_moves[2] == true){
                    this.y += 1
                    this.move()
                    //this.checkInteractable()

                    possible_moves = this.getPossibleTilesToMoveTo();
                    if(possible_moves[2] == true && possible_moves[1] == false && possible_moves[3] == false){
                        this.movement("s")
                    }
                }
                break;
            case "a":
                if (possible_moves[3] == true){
                    this.x -= 1
                    this.move()
                    //this.checkInteractable()

                    possible_moves = this.getPossibleTilesToMoveTo();
                    if(possible_moves[0] == false && possible_moves[2] == false && possible_moves[3] == true){
                        this.movement("a")
                    }
                }
                break;
            default:
                break;
        }
        /*
        if(map.tiles[this.x][this.y].hasOwn("interactable")){
            map.tiles[this.x][this.y].interactable.interact()
        }
        */
        if(Object.hasOwn(map.tiles[this.x][this.y], "interactable")){
            map.tiles[this.x][this.y].interactable.interact()
        }
    }

    move(){
        document.getElementById("player_sprite").style.left = (this.x * this.width).toString() + "px";
        document.getElementById("player_sprite").style.top = (this.y * this.height).toString() + "px";
    }

    checkInteractable(){
        if(Object.hasOwn(map.tiles[this.x][this.y], "interactable")){
            map.tiles[this.x][this.y].interactable.interact()
        }
    }
    /*
    movementStart(event){
        switch (event.key) {
            case "a":
                this.x_momentum = -10;
                break;
            case "d":
                this.x_momentum = 10;
                break;
            default:
                break;
        }
    }

    movementEnd(event){
        switch (event.key) {
            case "a":
                this.x_momentum = 0;
                break;
            case "d":
                this.x_momentum = 0;
                break;
            default:
                break;
        }
    }
    
    setPosition(){
        //this.x += 1;
        //console.log(this.x);
        this.x += this.x_momentum;
        this.y += this.y_momentum;
        //document.getElementById("button_start").innerHTML = this.x;
        document.getElementById("player_sprite").style.left = this.x.toString() + "px";
        document.getElementById("player_sprite").style.top = this.y.toString() + "px";
    }
    */
    setSize(){
        document.getElementById("player_sprite").style.width = (this.width - 4).toString() + "px";
        document.getElementById("player_sprite").style.height = (this.height - 4).toString() + "px";
    }
    
    setScale(map_x, map_y){
        this.width = 1600 / map_x
        this.height = 800 / map_y

        if (this.x > 0){
            this.x = map_x - 1;
        }
        if (this.y > 0){
            this.y = map_y - 1;
        }

        this.move()
    }

    getPossibleTilesToMoveTo(){
        let can_move_to = []
        for(let i = 0; i < 4; i++){
            let tile = map.getNeighbourTile(this.x, this.y, i)
            
            can_move_to[i] = false
            if(tile != "none"){
                if (tile.y < this.y && tile.walls[2] == "open"){
                    can_move_to[i] = true
                } else if (tile.x > this.x && tile.walls[3] == "open"){
                    can_move_to[i] = true
                } else if (tile.y > this.y && tile.walls[0] == "open"){
                    can_move_to[i] = true
                } else if (tile.x < this.x && tile.walls[1] == "open"){
                    can_move_to[i] = true
                }
            }
        }
        return can_move_to
    }
}

class Map {
    constructor(){
        this.width
        this.height
        this.sides = ["top", "right", "bottom", "left"];
    }

    async generate(){

        document.querySelectorAll(".tile").forEach(tile_sprite => {
            tile_sprite.style.borderColor = "transparent"
        });

        await this.sleep(500)

        document.querySelectorAll(".tile").forEach(tile_sprite => {
            tile_sprite.remove()
        });

        this.tiles = []
        for (let x = 0; x < this.width; x++){
            this.tiles[x] = []
            for (let y = 0; y < this.height; y++){
                this.tiles[x][y] = new Tile(x, y, this.width, this.height)
            }
        }

        let tiles_to_add_checkpoint = [this.tiles[0][0], this.tiles[this.width - 1][0], this.tiles[0][this.height - 1], this.tiles[this.width - 1][this.height - 1]];
        tiles_to_add_checkpoint.forEach(tile => {
            if(tile.x != player.x || tile.y != player.y){
                setTimeout(() => {
                    tile.addInteractable(new Checkpoint(tile.x, tile.y, tile.sprite_id))
                }, 100);
            }
        });

        let x = player.x;
        let y = player.y;

        while (this.getNeighbourTilesFreeOrToBacktrack(x, y).length > 0) {
            let tiles_to_move = this.getNeighbourTilesFreeOrToBacktrack(x, y);
            let tiles_free = []
            let tile_to_backtrack
            
            tiles_to_move.forEach(tile => {
                if(tile.state == "free"){
                    tiles_free.push(tile)
                } else {
                    if (tile.y < y && tile.walls[2] == "open"){
                        tile_to_backtrack = tile
                    } else if (tile.x > x && tile.walls[3] == "open"){
                        tile_to_backtrack = tile
                    } else if (tile.y > y && tile.walls[0] == "open"){
                        tile_to_backtrack = tile
                    } else if (tile.x < x && tile.walls[1] == "open"){
                        tile_to_backtrack = tile
                    }
                }                
            });

            if (tiles_free.length == 0){
                this.tiles[x][y].state = "done"
                x = tile_to_backtrack.x;
                y = tile_to_backtrack.y;
            } else {
                this.tiles[x][y].state = "to backtrack"
                let new_tile = tiles_free[(Math.floor(Math.random() * tiles_free.length))]

                if(new_tile.y < y){
                    this.tiles[x][y].setWall("open", "top")
                    this.tiles[x][y - 1].setWall("open", "bottom")
                }
                if(new_tile.x > x){
                    this.tiles[x][y].setWall("open", "right")
                    this.tiles[x + 1][y].setWall("open", "left")
                }
                if(new_tile.y > y){
                    this.tiles[x][y].setWall("open", "bottom")
                    this.tiles[x][y + 1].setWall("open", "top")
                }
                if(new_tile.x < x){
                    this.tiles[x][y].setWall("open", "left")
                    this.tiles[x - 1][y].setWall("open", "right")
                }

                x = new_tile.x
                y = new_tile.y

                this.display()
                await this.sleep(10)
            }

            /*
            this.display()
            await this.sleep(10)
            */
        }

        this.tiles[x][y].state = "done"

        

        this.display()
    }

    display(){
        this.tiles.forEach(column => {
            column.forEach(tile => {
                tile.display()
            });
        });
    }

    getNeighbourTilesFreeOrToBacktrack(x, y){
        let neighbour_tiles_free_or_to_backtrack = []

        for (let side = 0; side < 4; side++){
            let neighbour_state = this.getNeighbourTileState(x, y, side)
            if (neighbour_state == "free" || neighbour_state == "to backtrack"){
                neighbour_tiles_free_or_to_backtrack.push(this.getNeighbourTile(x, y, side))
            }
        }
        return neighbour_tiles_free_or_to_backtrack;
    }

    /*
    takes tile coordinates and side
    returns tile's neighbour on given side as Tile object or "none" if out of map size
    */
    getNeighbourTile(x, y, side){
        side = this.sides[side]
        let tile

        switch (side) {
            case "top":
                if (y <= 0) {
                    tile = "none"
                } else {
                    tile = this.tiles[x][y - 1]
                }
                break
                
            case "right":
                if (x >= this.width - 1) {
                    tile = "none"
                } else {
                    tile = this.tiles[x + 1][y]
                }
                break

            case "bottom":
                if (y >= this.height - 1) {
                    tile = "none"
                } else {
                    tile = this.tiles[x][y + 1]
                }
                break

            case "left":
                if (x <= 0) {
                    tile = "none"
                } else {
                    tile = this.tiles[x - 1][y]
                }
                break

            default:
                break;
        }

        //console.log(this.tiles[0[0]])
        //console.log(tile)
        return tile
    }

    /*
    takes tile coordinates and side
    returns tile's neighbour's state on given side as String or "none" if out of map size
    */
    getNeighbourTileState(x, y, side){
        let neighbour_tile = this.getNeighbourTile(x, y, side)
        //console.log(neighbour_tile);
        if (neighbour_tile != "none"){
            neighbour_tile = neighbour_tile.state
        }
        return neighbour_tile
    }

    setSize(width, height){
        this.width = width;
        this.height = height;
    }

    sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms))
    }
}

class Tile {
    constructor(x, y, map_x, map_y){
        this.x = x
        this.y = y
        this.state = "free"
        this.walls = ["wall", "wall", "wall", "wall"] //top, right, bottom, left    "open" if open, "wall" if walled
        this.sprite_id = x.toString() + "x" + y.toString() + "y"

        let tile_sprite = document.createElement("div");
        tile_sprite.className = "tile";
        tile_sprite.id = this.sprite_id

        tile_sprite.style.left = (this.x * (1600 / map_x)).toString() + "px";
        tile_sprite.style.top = (this.y * (800 / map_y)).toString() + "px";
        tile_sprite.style.width = (1600 / map_x - 4).toString() + "px";
        tile_sprite.style.height = (800 / map_y - 4).toString() + "px";

        document.getElementById("map").appendChild(tile_sprite);
    }

    getState(){
        return this.state
    }

    setWall(value, side){
        switch (side) {
            case "top":
                this.walls[0] = value
                break;
            
            case "right":
                this.walls[1] = value
                break;
        
            case "bottom":
                this.walls[2] = value
                break;
        
            case "left":
                this.walls[3] = value
                break;
        
            default:
                break;
        }
    }

    display(){
        let border_color = ""
        for(let i = 0; i < 4; i++){
            if(this.state == "free"){
                border_color += " transparent"
            } else if(this.walls[i] == "wall"){
                border_color += " white"
            } else {
                border_color += " transparent"
            }
        }
        document.getElementById(this.sprite_id).style.borderColor = border_color;

        /*
        let color = ""
        switch (this.state) {
            case "free":
                color = "lightgrey"
                break;
            
            case "to backtrack":
                color = "grey"
                break;

            case "done":
                color = "black"
                break;

            default:
                break;
        }
        document.getElementById(this.sprite_id).style.backgroundColor = color
        */
    }

    addInteractable(interactable){
        this.interactable = interactable;
    }
}

class Checkpoint {
    constructor(x, y, sprite_id){
        this.sprite_id = sprite_id
        this.x = x
        this.y = y
        this.name = "checkpoint"
        checkpoints += 1;
        document.getElementById(this.sprite_id).style.backgroundColor = "goldenrod";
    }

    interact(){
        checkpoints -= 1;
        document.getElementById(this.sprite_id).style.backgroundColor = "transparent";
        
        if(checkpoints == 0){
            newStart()
        }

        console.log(checkpoints)
        delete map.tiles[this.x][this.y].interactable
    }
}

function startGame(){
    document.getElementById("menu").style.opacity = "0";
    setTimeout(() => document.getElementById("menu").style.display = "none", 500)

    player = new Player(0, 0);
    map = new Map();
    
    newStart()
}

function newStart(){
    game += 1

    let width = 10 + game * 2
    let height = 5 + game
    if(width > 50){
        width = 50
    }
    if(height > 25){
        height = 25
    }

    player.setScale(width, height)
    player.setSize()
    map.setSize(width, height)
    map.generate()
}

