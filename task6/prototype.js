function PStackOfPaper(manufacturer, pageAmount) {
  this.manufacturer = manufacturer;
  this.pageAmount = pageAmount;
}

PStackOfPaper.prototype.checkPageAmount = function() {
  console.log(`Now it has ${this.pageAmount} page(s)`);
  if (this.pageAmount < 0) {
    console.log('Is it a blackhole???');
  }
}

PStackOfPaper.prototype.dropOnFloor = function() {
  let lostedPageAmount = Math.floor(Math.random() * (this.pageAmount + 1));
  this.pageAmount -= lostedPageAmount;
  console.log(`Ooops, ${lostedPageAmount} page(s) are lost!`);
  this.checkPageAmount();
}

PStackOfPaper.prototype.readManufacturer = function() {
  console.log(`Hmm, the manufacturer is "${this.manufacturer}"`);
}

PStackOfPaper.prototype.addPages = function(amount) {
  if (amount < 0) {
    console.log('Ha-ha :)');
    return;
  }

  this.pageAmount += amount;
  console.log(`We add ${amount} page(s) with love 4 u`);
  this.checkPageAmount();
}

PStackOfPaper.prototype.makeSomeWooDoo = function() {
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

function PNotebook(manufacturer, pageAmount, isFastened) {
  PStackOfPaper.apply(this, arguments);
  this.isFastened = isFastened;
}

PNotebook.prototype = Object.create(PStackOfPaper.prototype);
PNotebook.prototype.constructor = PNotebook;

PNotebook.prototype.dropOnFloor = function() {
  if (this.isFastened) {
    if (Math.random() < 0.7) {
      console.log('Huuuh, this notebook is fastened, everything is OK');
      return;
    }
    else {
      this.isFastened = false;
      console.log('From now on this notebook is not fastened!');
    }
  }

  PStackOfPaper.prototype.dropOnFloor.apply(this, arguments);
}

PNotebook.prototype.addClips = function() {
  if (this.isFastened) {
    console.log('Already, man!');
    return;
  }
  this.isFastened = true;
  console.log('Yeah, we pumped up your notebook');
}

PNotebook.prototype.removeClips = function() {
  this.isFastened = false;
  console.log('You\'re truly risky...');
}
