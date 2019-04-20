const ROOF_TYPE = Object.create(null);
ROOF_TYPE.TRIANGLE = 1;
ROOF_TYPE.RECTANGLE = 2;
ROOF_TYPE.TRAPEZIUM = 3;

class Roof {
  constructor(type, height, topWidth) {
    let isValidType = false;
    for (let roofType in ROOF_TYPE) {
      if (roofType === type) {
        this.type = type;
        isValidType = true;
        break;
      }
    }
    if (!isValidType) {
      this.type = ROOF_TYPE.TRIANGLE;
    }
    this.height = height;
    if (this.type === ROOF_TYPE.TRAPEZIUM) {
      this.topWidth = topWidth;
    }
  }
}

class HouseConfigurator {
  constructor() {
    this._config = {
      floors: 1,
      entrance: {
        amount: 1,
        width: 1
      },
      block: this._defaultBlock,
      door: null,
      window: null,
      roof: null,
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

  get _defaultWindow() {
    return {
      width: 5,
      height: 3,
      leaf: true
    };
  }

  get _defaultRoof() {
    return new Roof(ROOF_TYPE.TRIANGLE, 5);
  }

  setFloors(amount) {
    if (amount > 0) {
      this._config.floors = amount;
    }
    return this;
  }

  setEntrances(amount, widthInBlocks) {
    if (amount > 0) {
      this._config.entrance.amount = amount;
    }
    if (widthInBlocks > 0) {
      this._config.entrance.width = widthInBlocks;
    }
    return this;
  }

  _notIntegerValues(...values) {
    return values.some(n => !Number.isInteger(n));
  }

  _validateBlock() {
    let block = this._config.block,
        def = this._defaultBlock;
    if (this._notIntegerValues(block.width, block.height) ||
        block.width < def.width || block.height < def.height) {
      this._config.block = def;
    }
  }

  setBlock(width, height) {
    this._config.block.width = width;
    this._config.block.height = height;
    return this;
  }

  _validateDoor() {
    if (!this._config.door) {
      return;
    }
    let door = this._config.door,
        def = this._defaultDoor,
        block = this._config.block;
    if (this._notIntegerValues(door.width, door.height) ||
        door.width > block.width || door.height > block.height ||
        door.width < def.width || door.height < def.height) {
      this._config.door = def;
    }
  }

  setDoors(width, height) {
    if (!this._config.door) {
      this._config.door = this._defaultDoor;
    }
    this._config.door.width = width;
    this._config.door.height = height;
    return this;
  }

  _validateWindow() {
    if (!this._config.window) {
      return;
    }
    if (this._config.floors === 1 && this._config.entrance.width === 1 && this._config.door) {
      this._config.window = null;
      return;
    }
    let window = this._config.window,
        def = this._defaultWindow,
        block = this._config.block;
    if (this._notIntegerValues(window.width, window.height) ||
        window.width > block.width || window.height > block.height ||
        window.width < def.width || window.height < def.height) {
      this._config.window = def;
    }
  }

  setWindows(width, height, hasWindowLeaf) {
    if (!this._config.window) {
      this._config.window = this._defaultWindow;
    }
    this._config.window.width = width;
    this._config.window.height = height;
    if (hasWindowLeaf !== undefined) {
      this._config.window.leaf = hasWindowLeaf;
    }
    return this;
  }

  _validateRoof() {
    if (!this._config.roof) {
      return;
    }
    let config = this._config,
        roof = config.roof,
        houseWidth = config.block.width * config.entrance.width * config.entrance.amount;
    if (this._notIntegerValues(roof.height) ||
        (roof.type === ROOF_TYPE.TRAPEZIUM && (this._notIntegerValues(roof.topWidth) || roof.topWidth > houseWidth))  ||
        roof.height < 1) {
      this._config.roof = this._defaultRoof;
    }
  }

  setRoof(type, height, topWidth) {
    if (arguments.length === 0) {
      this._config.roof = this._defaultRoof;
    }
    else {
      this._config.roof = new Roof(type, height, topWidth);
    }
    return this;
  }

  make() {
    this._validateBlock();
    this._validateDoor();
    this._validateWindow();
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
        y = coords.y1,
        y2 = coords.y2;
    while(true) {
      line.push(new Point(x, y));
      if (y === y2) {
        break;
      }
      if (y < y2) {
        y++;
      }
      else {
        y--;
      }
    }
    return line;
  }

  _generateByX(coords) {
    let line = [],
        k = (coords.y2 - coords.y1) / (coords.x2 - coords.x1),
        b = coords.y1 - k * coords.x1,
        x = coords.x1,
        x2 = coords.x2,
        y;
    while(true) {
      y = Math.round(k * x + b);
      line.push(new Point(x, y));
      if (x === x2) {
        break;
      }
      if (x < x2) {
        x++;
      }
      else {
        x--;
      }
    }
    return line;
  }
}

class HouseBuilder {
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
        cols = config.entrance.amount * config.entrance.width * config.block.width;
    if (config.roof) {
      rows += config.roof.height;
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
        elemToDraw,
        point;
    for (let i = 0; i < line.length; i++) {
      point = line[i];
      if (i === 0) {
        elemToDraw = lineElems.start;
      }
      else if (i === line.length - 1) {
        elemToDraw = lineElems.end;
      }
      else {
        elemToDraw = lineElems.middle;
      }
      this._drawPixel(point.x, point.y, elemToDraw);
    }
  }

  _drawRectangle(x1, y1, x2, y2, rect = this._getRectangleElems("normal")) {
    let topLine = new LineElements(rect.corner.topLeft, rect.side.top, rect.corner.topRight),
        bottomLine = new LineElements(rect.corner.bottomLeft, rect.side.bottom, rect.corner.bottomRight),
        leftLine = new LineElements(rect.side.left, rect.side.left, rect.side.left),
        rightLine = new LineElements(rect.side.right, rect.side.right, rect.side.right);
    this._drawLine(x1, y1, x2, y1, topLine);
    this._drawLine(x1, y2, x2, y2, bottomLine);
    if (y2 - y1 !== 1) {
      this._drawLine(x1, y1 + 1, x1, y2 - 1, leftLine);
      this._drawLine(x2, y1 + 1, x2, y2 - 1, rightLine);
    }
  }

  _drawHouseBorder() {
    let x = 0,
        y = 0;
    if (this._config.roof) {
      y = this._config.roof.height;
    }
    this._drawRectangle(x, y, this._maxX, this._maxY);
  }

  _drawDoors() {
    let block = this._config.block,
        door = this._config.door,
        entranceWidth = this._config.entrance.width * block.width,
        doorElems = this._getRectangleElems("normal"),
        startY = this._maxY - (door.height - 1),
        startX = Math.floor((block.width / 2 - door.width / 2)),
        doorHandle = "\u2022",
        doorHandleY = startY + Math.floor(door.height / 2),
        x;
    doorElems.corner.bottomLeft = doorElems.corner.bottomRight = "\u2534";
    for (let i = 0; i < this._config.entrance.amount; i++) {
      x = i * entranceWidth + startX;
      this._drawRectangle(x, startY, x + door.width, startY + (door.height - 1), doorElems);
      this._drawPixel(x + 1, doorHandleY, doorHandle);
    }
  }

  _drawWindows() {
    let window = this._config.window,
        block = this._config.block,
        entranceWidth = block.width * this._config.entrance.width,
        startX = Math.floor((block.width / 2 - window.width / 2)),
        startY = this._maxY - block.height + 2,
        windowElems = this._getRectangleElems("double"),
        horizLeafPart = new LineElements("\u2560", "\u2550", "\u2563"),
        verticLeafPart = new LineElements("\u2566", "\u2551", "\u2569"),
        endX,
        endY;

    for (let entranceIndx = 0; entranceIndx < this._config.entrance.amount; entranceIndx++) {
      let x1 = startX + entranceIndx * entranceWidth;
      for (let y = startY; y >= 0; y -= block.height) {
        endY = y + window.height - 1;
        for (let x = x1; x < x1 + entranceWidth; x += block.width) {
          if (this._config.door && y === startY && x === x1) {
            continue;
          }
          endX = x + window.width - 1;
          this._drawRectangle(x, y, endX, endY, windowElems);
          if (window.leaf) {
            let centerX = endX - Math.floor(window.width / 2),
                centerY = endY - Math.floor(window.height / 2);
            this._drawLine(centerX, y, centerX, endY, verticLeafPart);
            this._drawLine(centerX, centerY, endX, centerY, horizLeafPart);
          }
        }
      }
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
    if (config.window) {
      this._drawWindows();
    }
    return this._makeStr();
  }
}



let configurator = new HouseConfigurator(),
    builder = new HouseBuilder(),
    config;
configurator.setDoors().setEntrances(2, 2).setFloors(3).setWindows();
config = configurator.make();
console.log(builder.build(config));
