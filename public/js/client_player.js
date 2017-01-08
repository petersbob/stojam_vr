function Player(id) {
    this.mesh;
    this.id = id;
    this.rays = [
	new THREE.Vector3(0, 0, 1),
	new THREE.Vector3(0, 0, 1),
	new THREE.Vector3(0, -1, 0)
    ];
    this.raycaster = new THREE.Raycaster();
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

Player.prototype.CheckCollision = function(obstacle) {

    for (var vertexIndex = 0; vertexIndex < this.mesh.geometry.vertices.length; vertexIndex++){		
	var localVertex = this.mesh.geometry.vertices[vertexIndex].clone();
	var globalVertex = localVertex.applyMatrix4( this.mesh.matrix );

	for (var ray = 0; ray < this.rays.length; ray++) {
	    
	    this.raycaster.set(globalVertex, this.rays[ray]);
	    var collisionResults = this.raycaster.intersectObjects( [obstacle] );
	    if ( collisionResults.length > 0 && collisionResults[0].distance < 10 ) {
		this.mesh.position.y = collisionResults[0].point.y + 1;
	    }
	}
    }

};

Player.prototype.Remove = function() {
    scene.remove(this.mesh);
}
