
var Tile = function (value, row, column) {
    this.value = value;
    this.row = row;
    this.column = column;
    this.id = Tile.id++;
    
};

Tile.id = 0;

var Board = function () {

    this.cells = [];
  
    for (var i = 0; i < Board.size; i++) {
        this.cells[i] = [];
        for(var j = 0; j < Board.size; j++) {
          this.cells[i].push(new Tile(0,i,j));
        }
    }
    this.cells[Board.size / 2 - 1][Board.size / 2 - 1].value = 1;
    this.cells[Board.size / 2 - 1][Board.size / 2].value = -1;
    this.cells[Board.size / 2][Board.size / 2 - 1].value = -1;
    this.cells[Board.size / 2][Board.size / 2].value = 1;
    this.won = false;
    this.playerId = 1;
    this.needFlip = this.initTwoDimensionArray(Board.size);
};


Board.size = 8;

Board.prototype.flipTiles = function(){
    for(var i = 0; i < Board.size; i++){
        for(var j = 0; j < Board.size; j++){
            if(this.needFlip[i][j]){
                this.cells[i][j] = new Tile(-1 * this.playerId,i,j);
            }
        }
    }
    this.needFlip = this.initTwoDimensionArray(Board.size);
    
}
Board.prototype.putTile = function(id){
    if(this.isPuttable(id)){
        var row = Math.floor(id / Board.size);
        var column = id % Board.size;
        this.cells[row][column] = new Tile(this.playerId,row,column);
        this.playerId *= (-1);
        this.flipTiles();
    }
    return this;
}

Board.prototype.initTwoDimensionArray = function(size){
    var a = [];
    for(var i = 0; i < size; i++){
        a[i] = [];
        for(var j = 0; j < size; j++){
            a[i][j] = false;
        }
    }
    return a;
}
    
Board.prototype.mergeArray = function(array1, array2){
    if(array1.length != array2.length) return false;
    
    if(array1[0].length != array2[0].length) return false;
    
    var result = [];
    for(var i = 0; i < array1.length; i++){
        result[i] = [];
        for(var j = 0; j < array1[0].length; j++){
            result[i][j] = array1[i][j] || array2[i][j];
        }
    }
    return result;
}
//Board.prototype.isPuttableHorizontal = function(row,column,direction){
//    if(direction == "right" && column == Board.size - 1) return false;
//    if(direction == "left" && column == 0) return false;
//    
//    var offset = direction == "right" ? 1 : -1;
//    
//    if(this.cells[row][column + offset].value == 0){
//        return false;
//    }
//    if(this.cells[row][column + offset].value == this.playerId){
//        return false;
//    }
//    var index = column + offset;
//    var needFlipTmp = this.initTwoDimensionArray(Board.size);
//    while((index < Board.size && index >= 0) && 
//          this.cells[row][index].value == (-1 * this.playerId)){
//        needFlipTmp[row][index] = true;  
//        index += offset;
//        
//    }
//    if(this.cells[row][index].value == this.playerId){
//        this.needFlip = this.mergeArray(this.needFlip,needFlipTmp);
//        return true;
//    }else{        
//        return false;
//    }
//}


Board.prototype.isPuttableInternal = function(row,column,rowDirection,columnDirection){
    var rowMove = 0;
    var columnMove = 0;
    if(rowDirection == "up"){
        if(row == 0) return false;
        rowMove = -1;
    }else if(rowDirection == "down"){
        if(row == Board.size - 1) return false;
        rowMove = 1;
    }else if(rowDirection == "none"){
        //nop
    }else{
        console.error("argerror in isPuttableInternal");
        console.error("rowDirection:" + rowDirection);
        return false;
    }
    
    if(columnDirection == "left"){
        if(column == 0) return false;
        columnMove = -1;
    }else if(columnDirection == "right"){
        if(column == Board.size - 1) return false;
        columnMove = 1;
    }else if(columnDirection == "none"){
        // nop;
    }else{
        console.error("argerror in isPuttableInternal");
        console.error("columnDirection:" + columnDirection);
        return false;
    }
    
    if(this.cells[row + rowMove][column + columnMove].value == 0){
        return false;
    }
    if(this.cells[row + rowMove][column + columnMove].value == this.playerId){
        return false;
    }
    var rowIndex = row + rowMove;
    var columnIndex = column + columnMove;
    var needFlipTmp = this.initTwoDimensionArray(Board.size);

    while(this.cells[rowIndex][columnIndex].value == (-1 * this.playerId)){
        needFlipTmp[rowIndex][columnIndex] = true;   
        rowIndex += rowMove;
        columnIndex += columnMove;
        if(rowIndex < 0 || 
           rowIndex > Board.size - 1 || 
           columnIndex < 0 || 
           columnIndex > Board.size - 1 ){
            return false;
        }
    }
    if(this.cells[rowIndex][columnIndex].value == this.playerId){
        this.needFlip = this.mergeArray(this.needFlip,needFlipTmp);
        return true;
    }else{
        return false;
    }

}

//Board.prototype.isPuttableVertical = function(row,column,direction){
//    if(row == 0 && direction == "up")  return false;
//    if(row == Board.size - 1 && direction == "down") return false;
//    
//    var offset = direction == "down" ? 1 : -1;
//    if(this.cells[row + offset][column].value == 0){
//        return false;
//    }
//    if(this.cells[row + offset][column].value == this.playerId){
//        return false;
//    }
//    var index = row + offset;
//    var needFlipTmp = this.initTwoDimensionArray(Board.size);
//    while(index >= 0 && 
//          this.cells[index][column].value == (-1 * this.playerId)){
//        needFlipTmp[index][column] = true;   
//        index += offset;
//    }
//    
//    if(this.cells[index][column].value == this.playerId){
//        this.needFlip = this.mergeArray(this.needFlip,needFlipTmp);
//        return true;
//    }else{
//        return false;
//    }
//
//}


Board.prototype.isPuttable = function(id){
    var row = Math.floor(id / Board.size);
    var column = id % Board.size;

    var result = this.isPuttableInternal(row,column,"none","right");
    result |= this.isPuttableInternal(row,column,"none","left");
    result |= this.isPuttableInternal(row,column,"up","none");
    result |= this.isPuttableInternal(row,column,"down","none");
    result |= this.isPuttableInternal(row,column,"up","right");
    result |= this.isPuttableInternal(row,column,"down","right");
    result |= this.isPuttableInternal(row,column,"up","left");
    result |= this.isPuttableInternal(row,column,"down","left");
    
    return result;
}


