function Player(id) {
    this.mesh;
    this.id = id;
};

Player.prototype.CreateMesh = function(x, y, z) {
    var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    var cubeMaterial = new THREE.MeshNormalMaterial();

    this.mesh  = new THREE.Mesh(cubeGeometry, cubeMaterial);
    this.mesh.position.x = x;
    this.mesh.position.y = y;
    this.mesh.position.z = z;

    scene.add(this.mesh);
};

Player.prototype.GetData = function() {

    var data = {
	px: this.mesh.position.x,
	py: this.mesh.position.y,
	pz: this.mesh.position.z,

	rx: this.mesh.rotation.x,
	ry: this.mesh.rotation.y,
	rz: this.mesh.rotation.z,

	id: this.id
    };

    return data;

};

Player.prototype.UpdatePos = function(data) {

    this.mesh.position.x = data.px;
    this.mesh.position.y = data.py;
    this.mesh.position.z = data.pz;

    this.mesh.rotation.x = data.rx;
    this.mesh.rotation.y = data.ry;
    this.mesh.rotation.z = data.rz;
};

Player.prototype.Remove = function() {
    scene.remove(this.mesh);
}
