function FStackOfPaper(manufacturer, pageAmount) {
  this.manufacturer = manufacturer;
  this.pageAmount = pageAmount;

  this.checkPageAmount = function() {
    console.log(`Now it has ${this.pageAmount} page(s)`);
    if (this.pageAmount < 0) {
      console.log('Is it a blackhole???');
    }
  }

  this.dropOnFloor = function() {
    let lostedPageAmount = Math.floor(Math.random() * (this.pageAmount + 1));
    this.pageAmount -= lostedPageAmount;
    console.log(`Ooops, ${lostedPageAmount} page(s) are lost!`);
    this.checkPageAmount();
  }

  this.readManufacturer = function() {
    console.log(`Hmm, the manufacturer is "${this.manufacturer}"`);
  }

  this.addPages = function(amount) {
    if (amount < 0) {
      console.log('Ha-ha :)');
      return;
    }

    this.pageAmount += amount;
    console.log(`We add ${amount} page(s) with love 4 u`);
    this.checkPageAmount();
  }

  this.makeSomeWooDoo = function() {
    console.log('Making some Woo Doo, looking to the sky...');
    setTimeout(function() {
      console.log('Alliens arrived and applied some allien technologies. Area 51 shoked!');
      if (this.pageAmount < 0) {
        this.pageAmount = Math.abs(this.pageAmount);
        console.log('Hey, they fixed your blackhole!');
        this.checkPageAmount();
      }
      this.manufacturer = 'Universe Wide Web Consortium';
      this.readManufacturer();
    }.bind(this), 1500);
  }
}

function FNotebook(manufacturer, pageAmount, isFastened) {
  FStackOfPaper.call(this, manufacturer, pageAmount);
  this.isFastened = isFastened;

  let parentDropOnFloor = this.dropOnFloor;
  this.dropOnFloor = function() {
    if (this.isFastened) {
      if (Math.random() < 0.7) {
        console.log('Huuuh, this notebook is fastened, everything is OK');
        return;
      }
      else {
        this.isFastened = false;
        console.log('This notebook is not fastened anymore!');
      }
    }

    parentDropOnFloor.call(this);
  }

  this.addClips = function() {
    if (this.isFastened) {
      console.log('Already, man!');
      return;
    }
    this.isFastened = true;
    console.log('Yeah, we pumped up your notebook');
  }

  this.removeClips = function() {
    this.isFastened = false;
    console.log('You\'re truly risky...');
  }
}
