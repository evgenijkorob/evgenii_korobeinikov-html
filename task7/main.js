class HouseConfigurator {
  constructor() {
    this._config = {
      floors: 1,
      entrances: {
        amount: 1,
        width: 1
      },
      doorExistence: false,
      windowExistence: false,
      roof: "",
      blockSize: 4
    };
  }

  setFloors(amount) {
    if (amount > 0) {
      this._config.floors = amount;
    }
  }

  setEntrances(amount, width) {
    if (amount > 0) {
      this._config.entrances.amount = amount;
    }
    if (width > 0) {
      this._config.entrances.width = width;
    }
  }

  addDoors() {
    this._config.doorExistence = true;
  }

  addWindows() {
    if (this._config.entrances.width > 1 || this._config.floors > 1) {
      this._config.windowExistence = true;
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

class HouseBuilder {
  _initialize() {
    let config = this._config,
        rows = this._rows = config.floors * config.blockSize,
        cols = this._cols = config.entrances.amount * config.entrances.width * config.blockSize;
    if (config.roof !== "") {
      rows += config.blockSize;
    }
    this._house2D = Array.from({ length: rows }, () => {
      let row = Array.from({ length: cols }, () => "\u2591");
      row.push("\n");
      return row;
    });
  }

  _makeStr() {
    return this._house2D.reduce((str, row) => {
      return str + row.reduce((resultRow, el) => resultRow + el);
    }, "");
  }

  build(config) {
    this._config = config;
    this._initialize();
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
