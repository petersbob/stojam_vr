function Player(id) {

    this.px = 0;
    this.py = 0;
    this.pz = 0;
    this.rx = 0;
    this.ry = 0;
    this.rz = 0;
    this.id = id;

};

Player.prototype.UpdatePosition = function(data) {
    this.px = data.px;
    this.py = data.py;
    this.pz = data.pz;
    this.rx = data.rx;
    this.ry = data.ry;
    this.rz = data.rz;
};

module.exports = {Player};
