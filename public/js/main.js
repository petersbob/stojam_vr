var camera, scene, renderer;
var element, stats, container, controls, keyboard;
var move_clock, update_clock, previous_time;
var cube;
var guiControls, gui;
var sendAndReceive = true;

var localClient;

init();

var myself;

var players = {};

function newCube(cubeMapCube) {

    var cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    var cubeMaterial = new THREE.MeshNormalMaterial();

    var newCube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    newCube.position.x = cubeMapCube.x;
    newCube.position.y = cubeMapCube.y;
    newCube.position.z = camera.position.z;

    scene.add(newCube);

    players[cubeMapCube.id] = newCube;

}

function init() {
    renderer = new THREE.WebGLRenderer();
    renderer;
    renderer.setClearColor(0xffffff, 1);
    element = renderer.domElement;
    container = document.getElementById('example');
    container.appendChild(element);

    renderer.setSize(window.innerWidth, window.innerHeight);

    stats = new Stats();
    container.appendChild(stats.domElement);

    guiControls = {
        sendAndReceiveButton: true
    };
    gui = new dat.GUI();
    var sendAndReceiveButton = gui.add(guiControls, 'sendAndReceiveButton').listen();
    sendAndReceiveButton.onChange(function(value) {
        sendAndReceive = value;
    })

    scene = new THREE.Scene();

    var aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.001, 700);
    camera.position.set(10, 10, 25);

    //controls = new THREE.OrbitControls(camera, element);
    keyboard = new THREEx.KeyboardState();

    if (checkMobile()) {
        console.log('mobile');
        controls = new THREE.DeviceOrientationControls(camera, true);

        control.connect();
        controls.update();

        window.addEventListener('click', fullscreen, false);

    }

    //============A plane===================//

    var texture_loader = new THREE.TextureLoader();
    var plane_texture = texture_loader.load('/public/assets/dirt.png');

    //var plane_texture = new THREE.ImageUtils.loadTexture( 'assets/dirt.png');
    plane_texture.wrapS = plane_texture.wrapT = THREE.RepeatWrapping;
    plane_texture.repeat.set(1000, 1000);

    var plane_material = new THREE.MeshBasicMaterial({
        map: plane_texture,
        side: THREE.DoubleSide
    });
    var plane_geometry = new THREE.PlaneGeometry(1000, 1000, 1, 1);

    var plane = new THREE.Mesh(plane_geometry, plane_material);

    plane.rotation.x = Math.PI / 2;

    plane.position.set(0, -.05, 0);

    scene.add(plane);

    //============A simple box that follows camera===============//
    /* var cube_geometry = new THREE.BoxGeometry(2, 2, 2);
     * var cube_material = new THREE.MeshNormalMaterial();

     * cube = new THREE.Mesh(cube_geometry, cube_material);
     * cube.position.x = camera.position.z
     * cube.position.z = myself.z;
     *
     * scene.add(cube);*/
    //======================================//

}

var check = 0;

function animate() {
    requestAnimationFrame(animate);

    cube = players[myself].mesh;

    var delta = move_clock.getDelta(); // seconds since last getDelta was called
    var moveDistance = 30 * delta;
    var rotateAngle = Math.PI / 2 * delta;

    // local transformations

    // move forwards/backwards/left/right
    if (keyboard.pressed("W"))
        cube.translateZ(-moveDistance);
    if (keyboard.pressed("S"))
        cube.translateZ(moveDistance);

    var rotation_matrix = new THREE.Matrix4().identity();
    if (keyboard.pressed("A"))
        cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), rotateAngle);
    if (keyboard.pressed("D"))
        cube.rotateOnAxis(new THREE.Vector3(0, 1, 0), -rotateAngle);

    var relativeCameraOffset = new THREE.Vector3(0, 7, 10);

    var cameraOffset = relativeCameraOffset.applyMatrix4(cube.matrixWorld);

    camera.position.x = cameraOffset.x;
    camera.position.y = cameraOffset.y;
    camera.position.z = cameraOffset.z;
    camera.lookAt(cube.position);

    var current_time = update_clock.getElapsedTime();

    if ((current_time - previous_time) > 0.0166) {
      socket.emit('update', players[myself].GetData());
      previous_time = current_time;
    }

    render();

    stats.update();
}

function render() {

    renderer.render(scene, camera);
}

var socket = io();

socket.on('socket_id', function(id) {
    myself = id;
    var local_player = new Player(id);
    local_player.CreateMesh(0, 1, 0);
    players[myself] = local_player;

    socket.emit('update', local_player.GetData());
    move_clock = new THREE.Clock();
    update_clock = new THREE.Clock();
    previous_time = update_clock.startTime;
    animate();

});

socket.on('update', function(server_players) {
    server_players = JSON.parse(server_players);
    for (var server_player in server_players) {
        if (server_player in players) {
            players[server_player].UpdatePos(server_players[server_player]);
        } else {
            var new_player = new Player(server_players[server_player].id);
            new_player.CreateMesh(0, 1,0);
            new_player.UpdatePos(server_players[server_player]);
            players[server_players[server_player].id] = new_player;
        }
        //console.log(players);
    }
});

/* socket.on('disconnect', function(dis_id) {
 *     scene.remove(players[dis_is]);
 *     delete players[dis_id];
 * });*/

function checkMobile() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true;
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
};

function fullscreen() {
    if (container.requestFullscreen) {
        container.requestFullscreen();
    } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
    } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
    } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
    }
};
