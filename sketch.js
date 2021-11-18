document.addEventListener('contextmenu', contextmenu);

function contextmenu(e) {
    e.preventDefault();
}

var blocks = [];
var click = false;
var first = true;
var size = 15;

var windowSize = 0;

let txt;
var tempRow;
let answer = [];

function preload() {
    txt = loadStrings('./question.txt');
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
            blocks[i].push(new Block(j, i, size, 0));
        }
    }
    background(220);
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
        if (click == false) {
            background(220);

            draw_hint();

            for (let i = 0; i < blocks.length; i++) {
                for (let j = 0; j < blocks[i].length; j++) {
                    blocks[i][j].press(mouseButton);
                    blocks[i][j].display();
                    click = true;
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
        }
    } else {
        click = false;
    }
    first = false;
}

function draw_hint() {
    fill(0);
    stroke(0);
    line(0, 100, 100, 100);
    for (let row = 0; row < txt_hint_row.length; row++) {
        stroke(0);
        line(0, (row + 1) * size + 100, 100, (row + 1) * size + 100);
        textAlign(RIGHT);
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

function draw_line(){
    for (let i = 0; i < blocks.length/5+1; i++) {
        for (let j = 0; j < blocks[i].length/5+1; j++) {
            stroke(0);
            line(i * size*5 +100, 0, i*size*5+100, blocks[i].length*size+100);
            line(0, j * size*5+100, blocks.length*size+100, j * size*5+100);
        }
    }
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

class Block {
    constructor(_x, _y, _size, _status) {
        this.x = _size * _x + 100;
        this.y = _size * _y + 100;
        this.size = _size;
        this.status = _status;
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
        }
    }

}