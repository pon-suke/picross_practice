document.addEventListener('contextmenu', contextmenu);

function contextmenu(e) {
    e.preventDefault();
}

var blocks = [];
var blocks_last = [];
var size = 15;

var windowSize = 0;

let txt;
var tempRow;
let answer = [];

function preload() {
    txt = loadStrings('./practice.txt');
    txt_hint_row = loadStrings('./hint_row.txt');
    txt_hint_column = loadStrings('./hint_column.txt');
}

function setup() {
    if (windowWidth > windowHeight) {
        windowSize = windowHeight;
    } else {
        windowSize = windowWidth;
    }
    createCanvas(windowSize, windowSize);
    for (let i = 0; i < txt.length; i++) {
        answer[i] = [];
        tempRow = split(txt[i], ',');
        for (let j = 0; j < tempRow.length; j++) {
            answer[i].push(int(tempRow[j]));
        }
    }
    if (windowWidth > windowHeight) {
        size = int((windowHeight - 100) / answer.length);
    } else {
        size = int((windowWidth - 100) / answer[0].length);
    }
    for (let i = 0; i < answer.length; i++) {
        blocks[i] = [];
        for (let j = 0; j < answer[i].length; j++) {
            blocks[i].push(new Block(j, i, size, 0, false));
        }
    }

    load_localStorage();

    blocks_last = JSON.parse(JSON.stringify(blocks));
    background(220);
    draw_undo();
    draw_hint();
    for (let i = 0; i < blocks.length; i++) {
        for (let j = 0; j < blocks[i].length; j++) {
            blocks[i][j].display();
        }
    }
    draw_line();
}

function draw() {
    if (mouseIsPressed) {

        background(220);

        draw_undo();

        draw_hint();


        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                blocks[i][j].press(mouseButton);
                blocks[i][j].display();
            }
        }

        draw_line();

        if (isEqualArray(answer, blocks)) {
            fill(255, 0, 0);
            textAlign(CENTER);
            noStroke();
            textSize(100);
            text('完成！', width / 2, height / 2);
            textSize(12);
        }
    } else {
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                blocks[i][j].change_false();
            }
        }
    }
}

function mousePressed() {
    if (10 <= mouseX && mouseX <= 90 && 20 <= mouseY && mouseY <= 80) {
        for (let i = 0; i < blocks.length; i++) {
            for (let j = 0; j < blocks[i].length; j++) {
                blocks[i][j].status = blocks_last[i][j].status;
            }
        }
    } else {
        blocks_last = JSON.parse(JSON.stringify(blocks));
    }
}

function mouseReleased(){
    save_localStorage();
}

function keyTyped(){
    if(keyCode === 13){
        if(mouseIsPressed){
            if (10 <= mouseX && mouseX <= 90 && 20 <= mouseY && mouseY <= 80) {
                remove_localStorage();
            }
        }
    }
}

function draw_undo() {
    stroke(255);
    fill(30);
    rect(10, 20, 80, 60);
    fill(255);
    stroke(255);
    textSize(25);
    textAlign(CENTER, BASELINE);
    text("UNDO", 50, 60);
}

function draw_hint() {
    fill(0);
    stroke(0);
    textSize(12);
    line(0, 100, 100, 100);
    for (let row = 0; row < txt_hint_row.length; row++) {
        stroke(0);
        line(0, (row + 1) * size + 100, 100, (row + 1) * size + 100);
        textAlign(RIGHT, BOTTOM);
        noStroke();
        text(txt_hint_row[row], 100, (row + 1) * size + 100);
    }
    stroke(0);
    line(100, 0, 100, 100);
    for (let column = 0; column < txt_hint_column.length; column++) {
        stroke(0);
        line((column + 1) * size + 100, 0, (column + 1) * size + 100, 100);
        textAlign(RIGHT);
        var temp = split(txt_hint_column[column], ',');
        for (let i = 0; i < temp.length; i++) {
            noStroke();
            text(temp[i], (column + 1) * size + 100, 100 - (temp.length - i - 1) * 12);
        }
    }
}

function draw_line() {
    strokeWeight(2);
    for (let i = 1; i < blocks.length / 5; i++) {
        for (let j = 1; j < blocks[i].length / 5; j++) {
            stroke(0, 255, 255);
            line(i * size * 5 + 100, 100, i * size * 5 + 100, blocks[i].length * size + 100);
            line(100, j * size * 5 + 100, blocks.length * size + 100, j * size * 5 + 100);
        }
    }
    for (let i = 1; i < blocks.length / 10; i++) {
        for (let j = 1; j < blocks[i].length / 10; j++) {
            stroke(255, 0, 0);
            line(i * size * 10 + 100, 100, i * size * 10 + 100, blocks[i].length * size + 100);
            line(100, j * size * 10 + 100, blocks.length * size + 100, j * size * 10 + 100);
        }
    }
    noFill();
    stroke(0);
    rect(100, 100, blocks.length * size, blocks[0].length * size);
    strokeWeight(1);
}

function isEqualArray(a, b) {
    var isEqual = true;
    for (let i = 0; i < a.length; i++) {
        for (let j = 0; j < a[i].length; j++) {
            if (a[i][j] != b[i][j].status && b[i][j].status != 2) {
                isEqual = false;
            }
        }
    }
    return isEqual;
}

function load_localStorage() {
    if (window.localStorage) {
        let data = localStorage.getItem('blocks');
        data = JSON.parse(data);
        if (data != null) {
            for (let i = 0; i < blocks.length; i++) {
                for (let j = 0; j < blocks[i].length; j++) {
                    blocks[i][j].status=data[i][j].status;
                    blocks[i][j].change=data[i][j].change;
                }
            }
        }
    }
}

function save_localStorage() {
    if (window.localStorage) {
        let json = JSON.stringify(blocks);
        localStorage.setItem('blocks', json);
    }
}

function remove_localStorage(){
    if (window.localStorage) {
        localStorage.removeItem('blocks');
        for (let i = 0; i < answer.length; i++) {
            blocks[i] = [];
            for (let j = 0; j < answer[i].length; j++) {
                blocks[i].push(new Block(j, i, size, 0, false));
            }
        }
    }
}

class Block {
    constructor(_x, _y, _size, _status, _change) {
        this.x = _size * _x + 100;
        this.y = _size * _y + 100;
        this.size = _size;
        this.status = _status;
        this.change = _change;
    }

    display() {
        switch (this.status) {
            case 0:
                fill(255);
                break;
            case 1:
                fill(0);
                break;
            case 2:
                noFill();
                stroke(0);
                line(this.x, this.y, this.x + this.size, this.y + this.size);
                line(this.x + this.size, this.y, this.x, this.y + this.size);
            default:
                break;
        }
        stroke(50);
        rect(this.x, this.y, this.size);
    }

    press(button) {
        if (this.x <= mouseX && mouseX <= this.x + this.size && this.y <= mouseY && mouseY <= this.y + this.size) {
            if (this.change == false) {
                if (button == LEFT) {
                    if (this.status != 1) {
                        this.status = 1;
                    } else {
                        this.status = 0;
                    }
                } else {
                    if (this.status != 2) {
                        this.status = 2;
                    } else {
                        this.status = 0;
                    }
                }
                if (this.status > 2) this.status = 0;
                this.change = true;
            }
        }
    }

    change_false() {
        this.change = false;
    }

}