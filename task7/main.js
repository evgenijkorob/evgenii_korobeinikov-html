class HouseConfigurator {
  constructor() {
    this._config = {
      floors: 1,
      entrances: {
        amount: 1,
        width: 1
      },
      door: null,
      isWindowExist: false,
      roof: "",
      block: this._defaultBlock
    };
  }

  get _defaultBlock() {
    return {
      width: 9,
      height: 5
    };
  }

  get _defaultDoor() {
    return {
      width: 4,
      height: 4
    };
  }

  setFloors(amount) {
    if (amount > 0) {
      this._config.floors = amount;
    }
  }

  setEntrances(amount, widthInBlocks) {
    if (amount > 0) {
      this._config.entrances.amount = amount;
    }
    if (widthInBlocks > 0) {
      this._config.entrances.width = widthInBlocks;
    }
  }

  setBlockSize(width, height) {
    const def = this._defaultBlock;
    if (width >= def.width) {
      this._config.block.width = width;
    }
    if (height >= def.height) {
      this._config.block.height = height;
    }
  }

  setDoors(width, height) {
    if (!this._config.door) {
      this._config.door = this._defaultDoor;
    }
    if (width >= this._defaultDoor.width && width <= this._config.block.width - 2) {
      this._config.door.width = width;
    }
    if (height >= this._defaultDoor.height && height <= this._config.block.height - 1) {
      this._config.door.height = height;
    }
  }

  addWindows() {
    if (this._config.entrances.width > 1 || this._config.floors > 1) {
      this._config.isWindowExist = true;
    }
  }

  addRoof(type) {
    switch(type) {
      case "triangle":
      case "rectangle":
      case "trapezium":
        this._config.roof = type;
        break;
    }
  }

  make() {
    return this._config;
  }
}

class RectangleElements {
  constructor(corners, sides) {
    this.corner = {
      topLeft: corners[0],
      topRight: corners[1],
      bottomRight: corners[2],
      bottomLeft: corners[3]
    };
    this.side = {
      top: sides[0],
      right: sides[1],
      bottom: sides[2],
      left: sides[3]
    };
  }
}

class LineElements {
  constructor(start, middle, end) {
    this.start = start;
    this.middle = middle;
    this.end = end;
  }
}

class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class Line {
  constructor(x1, y1, x2, y2) {
    let coords = {
          x1,
          y1,
          x2,
          y2
        },
        line;
    if (x1 === x2) {
      line = this._generateByY(coords);
    }
    else {
      line = this._generateByX(coords);
    }
    return line;
  }

  _generateByY(coords) {
    let line = [],
        x = coords.x1,
        y = coords.y1;
    if (y < coords.y2) {
      for (; y <= coords.y2; y++) {
        line.push(new Point(x, y));
      }
    }
    else {
      for (; y >= coords.y2; y--) {
        line.push(new Point(x, y));
      }
    }
    return line;
  }

  _generateByX(coords) {
    let line = [],
        k,
        b;
    k = (coords.y2 - coords.y1) / (coords.x2 - coords.x1);
    b = coords.y1 - k * coords.x1;
    let x = coords.x1,
        y;
    if (x < coords.x2) {
      for (; x <= coords.x2; x++) {
        y = Math.round(k * x + b);
        line.push(new Point(x, y));
      }
    }
    else {
      for (; x >= coords.x2; x--) {
        y = Math.round(k * x + b);
        line.push(new Point(x, y));
      }
    }
    return line;
  }
}

class HouseBuilder {
  _isRoofed() {
    return this._config.roof !== "";
  }

  _getRectangleElems(type = "normal") {
    let corners, sides;
    switch(type) {
      case "normal":
        corners = ["\u250c", "\u2510", "\u2518", "\u2514"];
        sides = ["\u2500", "\u2502", "\u2500", "\u2502"];
        break;
      case "double":
        corners = ["\u2554", "\u2557", "\u255d", "\u255a"];
        sides = ["\u2550", "\u2551", "\u2550", "\u2551"];
        break;
    }
    return new RectangleElements(corners, sides);
  }

  _initialize() {
    let config = this._config,
        rows = config.floors * config.block.height,
        cols = config.entrances.amount * config.entrances.width * config.block.width;
    if (this._isRoofed()) {
      rows += config.block.height;
    }
    this._house2D = Array.from({ length: rows }, () => {
      let row = Array.from({ length: cols }, () => " ");
      row.push("\n");
      return row;
    });
    this._maxY = rows - 1;
    this._maxX = cols - 1;
  }

  _drawPixel(x, y, pixel) {
    this._house2D[y][x] = pixel;
  }

  _drawLine(x1, y1, x2, y2, lineElems = new LineElements("\u2588", "\u2588", "\u2588")) {
    let line = new Line(x1, y1, x2, y2),
        elemToDraw;
    line.forEach((point) => {
      if (point.x === x1) {
        elemToDraw = lineElems.start;
      }
      else if (point.x === x2) {
        elemToDraw = lineElems.end;
      }
      else {
        elemToDraw = lineElems.middle;
      }
      this._drawPixel(point.x, point.y, elemToDraw);
    });
  }

  _drawRectangle(x1, y1, x2, y2, rectElems = this._getRectangleElems("normal")) {
    let rectangle = rectElems;
    for (let y = y1; y <= y2; y++) {
      if (y === y1 || y === y2) {
        let x = x1,
            elemToDraw,
            left,
            right,
            middle;
        if (y === y1) {
          left = rectangle.corner.topLeft;
          right = rectangle.corner.topRight;
          middle = rectangle.side.top;
        }
        else {
          left = rectangle.corner.bottomLeft;
          right = rectangle.corner.bottomRight;
          middle = rectangle.side.bottom;
        }
        while (x <= x2) {
          if (x === x1) {
            elemToDraw = left;
          }
          else if (x === x2) {
            elemToDraw = right;
          }
          else {
            elemToDraw = middle;
          }
          this._drawPixel(x, y, elemToDraw);
          x++;
        }
      }
      else {
        this._drawPixel(x1, y, rectangle.side.left);
        this._drawPixel(x2, y, rectangle.side.right);
      }
    }
  }

  _drawHouseBorder() {
    let x = 0,
        y = 0;
    if (this._isRoofed()) {
      y = this._config.block.height;
    }
    this._drawRectangle(x, y, this._maxX, this._maxY);
  }

  _drawDoors() {
    let block = this._config.block,
        door = this._config.door,
        entranceWidth = this._config.entrances.width * block.width,
        doorElems = this._getRectangleElems("normal"),
        y1 = this._maxY - (door.height - 1),
        doorHandle = "\u2022",
        doorHandleY = y1 + Math.floor(door.height / 2),
        x1;
    doorElems.corner.bottomLeft = doorElems.corner.bottomRight = "\u2534";
    for (let i = 0; i < this._config.entrances.amount; i++) {
      x1 = i * entranceWidth + Math.floor((block.width - door.width) / 2);
      this._drawRectangle(x1, y1, x1 + door.width, y1 + (door.height - 1), doorElems);
      this._drawPixel(x1 + 1, doorHandleY, doorHandle);
    }
  }

  _makeStr() {
    return this._house2D.reduce((str, row) => {
      return str + row.reduce((resultRow, el) => resultRow + el);
    }, "");
  }

  build(config) {
    this._config = config;
    this._initialize();
    this._drawHouseBorder();
    if (config.door) {
      this._drawDoors();
    }
    return this._makeStr();
  }
}

class HouseDirector {
  make(config = new HouseConfigurator().make()) {
    let builder = new HouseBuilder();
    return builder.build(config);
  }
}



let director = new HouseDirector();
console.log(director.make());
