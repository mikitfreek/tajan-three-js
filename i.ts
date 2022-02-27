// // add styles
// import './style.css';
// // three.js
// import * as THREE from 'three';
// // import { response } from 'express';

// let scene, camera, renderer,
//     box,
//     cards="AhKdDd"

// createScene()

// function createScene() {
//   init()
//   animate()
// }

// function createCards() {
//   let _cards = cards.match(/.{1,2}/g);
//   const material_cards = new THREE.MeshMatcapMaterial({
//     color: 0xaaaaaa,
//   });
//   for (let i = 0; i < _cards.length; i++) {
//     const card = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.01, 0.6), material_cards);

//     scene.add(card);

//     const cor_y = [0, 0.43, 0.50, 0.54, 0.5625];
//     card.position.z = -.1 + (_cards.length * cor_y[_cards.length - 1] / 2) - 0.65 * i;
//     const cor_x = [
//       [4.43],
//       [4.35, 4.35],
//       [4.35, 4.26, 4.35],
//       [4.43, 4.26, 4.26, 4.43],
//       [4.43, 4.26, 4.20, 4.26, 4.43]
//     ];

//     // card.position.x = !mobile ? cor_x[cards.length-1][i] - 1 : cor_x[cards.length-1][i] - 1.4;
//     card.position.x = cor_x[_cards.length - 1][i] - 0.4;

//     // card.position.y = 7 * 0.6;
//     card.position.y = 3;

//     const minus = (_cards.length === 1) ? 1 : -1; /// bug one card on hand fix
//     card.rotation.z = minus * Math.PI / 4;

//     //const pi_cards = 3.75 / Math.PI;
//     //card.rotation.y = Math.PI * pi_cards - (Math.PI / cards.length / 2) * i;
//     const rot = [1, 15, 12, 10.5, 10];
//     const pi_cards = Math.PI / rot[_cards.length - 1];
//     card.rotation.y = pi_cards - (Math.PI / 4) / _cards.length * i;
//   }
// }

// function frame() {
//   createCards()
// }

// function init() {

//   // create the scene
//   scene = new THREE.Scene();

//   // create the camera
//   camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//   renderer = new THREE.WebGLRenderer(); //{ antialias: true}

//   renderer.setPixelRatio(window.devicePixelRatio)
//   // renderer.setClearColor(0xBAC4CC)
//   renderer.setSize(window.innerWidth, window.innerHeight); // set size

//   // add canvas to dom
//   document.body.appendChild(renderer.domElement);

//   // add axis to the scene
//   const axis = new THREE.AxesHelper(10);

//   scene.add(axis);

//   // add lights
//   const light = new THREE.DirectionalLight(0xffffff, 1.0);

//   light.position.set(100, 100, 100);

//   scene.add(light);

//   const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

//   light2.position.set(-100, 100, -100);

//   scene.add(light2);

//   const material = new THREE.MeshBasicMaterial({
//     color: 0xaaaaaa,
//     wireframe: true,
//   });

//   // create a box and add it to the scene
//   box = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);

//   scene.add(box);

//   box.position.x = 4;
//   box.position.y = 4;

//   ////////////////////////////////////////////////////////

//   // function getCookie(cname) {
//   //   let name = cname + '=';
//   //   let decodedCookie = decodeURIComponent(document.cookie);
//   //   let ca = decodedCookie.split(';');
//   //   for (let i = 0; i < ca.length; i++) {
//   //       let c = ca[i];
//   //       while (c.charAt(0) == ' ') {
//   //           c = c.substring(1);
//   //       }
//   //       if (c.indexOf(name) == 0) {
//   //           return c.substring(name.length, c.length);
//   //       }
//   //   }
//   //   return '';
//   // }

//   // function setCookie(cname, cvalue, exhours) {
//   //   let d = new Date();
//   //   d.setTime(d.getTime() + (exhours*60*60*1000));
//   //   let expires = 'expires='+ d.toUTCString();
//   //   document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
//   // }

//   let clientId;
//   let roomId;
//   let hand;
//   /// 1. Save a object in cookie
//   // let user = {
//   // 	id: clientId
//   // };

//   // convert the user object to JSON string using JSON.stringify() function 
//   // let userJsonString = JSON.stringify(user); 

//   // /// 2. Read the saved user info from cookie 
//   // let savedUserJsonString = getCookie('user_info')
//   // if (savedUserJsonString.length === 0) { 
//   //   // no user in cookie 
//   //   //return; 
//   //   // save the the json string in session 
//   //   setCookie('user_info', userJsonString, .2)
//   //   savedUserJsonString = getCookie('user_info')
//   // } 
//   //   // convert the saved user info to JSON object using JSON.parse() function 
//   //   let savedUser = JSON.parse(savedUserJsonString)
//   //   // finally, display the user info in the view or console 
//   //   // console.log('name: ', savedUser.id)

//   ////////////////////////////


//   ////
//   // if(location.pathname.split('/')[2]==='p') console.log(location.pathname.split('/')[3])

//   let host = location.origin.replace(/^http/, 'ws')
//   let ws = new WebSocket(host);

//   const bidd = document.createElement('input')
//   bidd.id = 'bid-code'
//   bidd.placeholder = '00 02 00 ... 09 01 02 ..'
//   document.body.append(bidd)

//   const btnBid = document.createElement('button')
//   btnBid.id = 'bid'
//   btnBid.innerText = 'bid'
//   document.body.append(btnBid)
//   btnBid.addEventListener('click', e => {
//     const payLoad = {
//       'method': 'move',
//       'roomId': roomId,
//       'clientId': clientId,
//       'bid': bidd.value
//     }
//     // console.log('data')
//     ws.send(JSON.stringify(payLoad))
//   })

//   const btnCheck = document.createElement('button')
//   btnCheck.id = 'check'
//   btnCheck.innerText = 'check'
//   document.body.append(btnCheck)
//   btnCheck.addEventListener('click', e => {
//     const payLoad = {
//       'method': 'move',
//       'roomId': roomId,
//       'clientId': clientId,
//       'bid': 'check'
//     }
//     // console.log('data')
//     ws.send(JSON.stringify(payLoad))
//   })

//   const btnDraw = document.createElement('button')
//   btnDraw.id = 'draw'
//   btnDraw.innerText = 'draw'
//   document.body.append(btnDraw)
//   btnDraw.addEventListener('click', e => {
//     const payLoad = {
//       'method': 'draw',
//       'roomId': roomId
//     }
//     // console.log('data')
//     ws.send(JSON.stringify(payLoad))
//   })

//   const btnCreate = document.createElement('button')
//   btnCreate.id = 'create'
//   btnCreate.innerText = 'create'
//   document.body.append(btnCreate)
//   btnCreate.addEventListener('click', e => {
//     const payLoad = {
//       'method': 'create',
//       'hostId': clientId
//     }
//     // console.log('data')
//     ws.send(JSON.stringify(payLoad))
//   })

//   const destRoomId = document.createElement('input')
//   destRoomId.id = 'join-code'
//   destRoomId.placeholder = 'Enter room id..'
//   document.body.append(destRoomId)

//   const btnJoin = document.createElement('button')
//   btnJoin.id = 'join'
//   btnJoin.innerText = 'join'
//   document.body.append(btnJoin)
//   btnJoin.addEventListener('click', e => {
//     const dest = destRoomId.value
//     if (dest.length===8){
//       //if (roomId === null)

//       const payLoad = {
//         'method': 'join',
//         'clientId': clientId,
//         'roomId': dest
//       }
//       ws.send(JSON.stringify(payLoad))
//     }
//   })

//   ws.onmessage = function (event) {
//     //var li = document.createElement('li');
//     const res = JSON.parse(event.data);

//     if (res.method === 'connect') {
//       // ws.send(clientId)
//       // console.log('name: ', savedUser.id)
//       clientId=res.clientId
//       console.log('Client id set successfully ' + clientId)
//     }

//     if (res.method === 'create') {
//       roomId=res.room.id
//       const clientId=res.room.hostId
//       console.log('Room created successfully by client: ' + clientId + ', with id: ' + roomId)
//     }

//     if (res.method === 'join') {
//       roomId=res.room.id
//       const clientId=res.clientId
//       console.log('Room:' + roomId + ' joined successfully by client: ' + clientId)
//     }

//     // if (res.method === 'join-tag') {
//     //   // roomId=res.room.id
//     //   // const clientId=res.clientId
//     //   console.log('#########tag#########')
//     //   const payLoad = {
//     //     'method': 'join',
//     //     'rel': 'tag'
//     //   }
//     //   ws.send(JSON.stringify(payLoad))
//     // }

//     if (res.method === 'draw') {
//       const cards = res.cards
//       console.log('Room:' + roomId + ' ; client: ' + clientId + ' ; cards: ' + [cards])
//       console.log({cards})
//       //update three js
//     }
//     //document.querySelector('#pings').appendChild(li);
//   };


//   ////////////////////////////////////////////////////////

//   // const material_cards = new THREE.MeshMatcapMaterial({
//   //   color: 0xaaaaaa,
//   // });

//   // create a table
//   const table = new THREE.Mesh(new THREE.BoxGeometry(4.20, 0.2, 4.20), material);

//   scene.add(table);

//   table.position.y = 2;
//   table.position.x = 2.2;


//   const pokerSymbols = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

//   const pokerColors = ['k', 'h', 't', 'p']; // k: 9826, h: 9825, t: 9831, p: 9828

//   // karty od 9
//   const ranks09 = [
//     'Royal flush',      // 09 01 02 // // 2nd color
//     'Straight flush',   // 08 01 09 // // 2nd color
//     'Four of a kind',   // 07 02 00 // 
//     'Flush',            // 06 01 00 //... // 2nd color
//     'Full house',       // 05 02 03 // 
//     'Three of a kind',  // 04 02 00 // 
//     'Straight',         // 03 09 00 //
//     'Two pairs',        // 02 03 02 // 03 03 02 02 // sort max to begin
//     'Pair',             // 01 02 00 // 02 02 
//     'High card',        // 00 02 00 // 02
//   ]

//   // karty od 8
//   const ranks08 = [
//     'Royal flush',      // 09 01 02 // 2nd color
//     'Straight flush',   // 08 01 08_// 2nd color
//     'Four of a kind',   // 07 02 00 
//     'Full house',       // 06 02 03 
//     'Flush',            // 05 01 00 // 2nd color
//     'Three of a kind',  // 04 02 00    
//     'Straight',         // 02 08_00
//     'Two pairs',        // 02 03 02 // sort max to begin
//     'Pair',             // 01 02 00 
//     'High card',        // 00 02 00 
//   ]

//   // create a cards array

//   /////////////////
//   let bid = '090102'; // output from server ------> client  // ['K','K','Q','Q','Q']
//   /////////////////
//   // let cards = 'AhApAtKkKp'; // - ,, -
//   // /////////////////

//   let _bid = bid.match(/.{1,2}/g);

//   class Bid { 
//     // field 
//     cards:string; 

//     // constructor 
//     constructor(cards:string) { 

//       let a, b, c, d, e;

//       let B = (n:number) => pokerColors[Number(_bid[1+n])]; /////////

//       for (let i = 0; i < _bid.length; i++) {
//         switch(i) {
//           case 0:
//             a = pokerSymbols[Number(_bid[1]) - 2];
//             break;
//           case 1:
//             b = pokerSymbols[Number(_bid[2]) - 2];
//             break;
//           case 2:
//             c = pokerSymbols[Number(_bid[3]) - 2];
//             break;
//           case 3:
//             d = pokerSymbols[Number(_bid[4]) - 2];
//             break;
//           case 4:
//             e = pokerSymbols[Number(_bid[5]) - 2];
//             break;
//         }
//       }

//       const _a = pokerColors[Number(_bid[1])];

//       switch(Number(_bid[0])) {
//         case 9: // Royal flush
//           cards = _a + b + c + d;//
//           break;
//         case 8: // Straight flush
//           cards = _a + b + b;//
//           break;
//         case 7: // Four of a kind
//           cards = a + a + a + a;
//           break;
//         case 6: // Flush
//           cards = _a + _a + _a + _a;//
//           break;
//         case 5: // Full house
//           cards = a + a + a + b + b;
//           break;
//         case 4: // Three of a kind
//           cards = a + a + a;
//           break;
//         case 3: // Straight
//           cards = a + b + c + d + e;
//           break;
//         case 2: // Two pairs
//           cards = a + a + b + b;
//           break;
//         case 1: // Pair
//           cards = a + a;
//           break;
//         case 0: // High card
//           cards = a;
//           break;
//       }

//       this.cards = cards
//     }
//   }

//   // let _cards = cards.match(/.{1,2}/g);

//   let bid_ = new Bid(bid);
//   // console.log(bid_.cards);

//   ////////

//   // for (let i = 0; i < _cards.length; i++) {
//   //   const card = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.01, 0.6), material_cards);

//   //   scene.add(card);

//   //   const cor_y = [0, 0.35, 0.47, 0.52647, 0.5625];
//   //   card.position.z = -.1 + (_cards.length * cor_y[_cards.length - 1] / 2) - 0.65 * i;
//   //   const cor_x = [
//   //     [4.43],
//   //     [4.26, 4.26],
//   //     [4.43, 4.26, 4.43],
//   //     [4.43, 4.26, 4.26, 4.43],
//   //     [4.43, 4.26, 4.20, 4.26, 4.43]
//   //   ];

//   //   // card.position.x = !mobile ? cor_x[cards.length-1][i] - 1 : cor_x[cards.length-1][i] - 1.4;
//   //   card.position.x = cor_x[_cards.length - 1][i] - 0.4;

//   //   // card.position.y = 7 * 0.6;
//   //   card.position.y = 3;

//   //   const minus = (_cards.length === 1) ? 1 : -1; /// bug one card on hand fix
//   //   card.rotation.z = minus * Math.PI / 4;

//   //   //const pi_cards = 3.75 / Math.PI;
//   //   //card.rotation.y = Math.PI * pi_cards - (Math.PI / cards.length / 2) * i;
//   //   const rot = [1, 15, 12, 10.5, 10];
//   //   const pi_cards = Math.PI / rot[_cards.length - 1];
//   //   card.rotation.y = pi_cards - (Math.PI / 4) / _cards.length * i;
//   // }

//   ////////////////////////////////////////////////////////////////
//   // // bid UI
//   const bid_last = document.getElementById('last');
//   const bid_lastfig = document.getElementById('last-fig');
//   const span0 = document.createElement('span');

//   let _arr= [],
//       arr= [],
//       color;
//   const BB = (sym, col) => {
//     let n=0, _max=0;
//     for (let i = 0; i < sym.length; i++) {
//       let curr = (bid_.cards.split(sym[i]).length - 1);
//       if (curr!=0) {
//         _arr[n] = (curr>_max) && curr;
//         arr[n] = sym[i];
//         n++;
//       }
//     }
//     if (col > 0) {
//       for (let i = 0; i < sym.length; i++) {
//         color = ((bid_.cards.split(pokerColors[i]).length - 1) != 0) ? pokerColors[i] :'';
//       }
//     }
//   }
//   console.log(color)
//   // figures
//   switch(Number(_bid[0])) {
//     case 6:
//       BB(pokerColors, 0);
//       break;
//     case 8:
//       BB(pokerSymbols, 0);
//       break;
//     case 9:
//       BB(pokerSymbols, 0); ////////////// edit
//       break;
//     default:
//       BB(pokerSymbols, 0);
//       break;
//   }
//   // colors
//   // let BB = () => { for (let i = 0; i < pokerSymbols.length; i++) {
//   //   ((bid_.cards.split(pokerColors[i]).length - 1) > 0) }}
//   // if ()

//   span0.innerHTML = _arr[0] + 'x <i>' + arr[0] + '</i>';
//   const span1 = document.createElement('span');
//   span1.innerHTML = (_arr.length>1) ? _arr[1] + 'x <i>' + arr[1] + '</i>':'';
//   const span2 = document.createElement('span');
//   span2.innerHTML = (_arr.length>2) ? _arr[2] + 'x <i>' + arr[2] + '</i>':'';
//   bid_last.appendChild(span0);
//   bid_last.appendChild(span1);
//   bid_last.appendChild(span2);
//   bid_lastfig.innerHTML = ranks09[ranks09.length-Number(_bid[0])-1];

//   const openMd = (id) => {
//     const md = document.createElement('div');

//     md.classList.add('md-modal')

//     const exit = document.createElement('span');
//     exit.innerHTML = '&#10005;';
//     exit.classList.add('exit'); // esc
//     //exit.id = 'exit';
//     md.appendChild(exit);

//     const title = document.createElement('div');
//     title.classList.add('title');

//     const content = document.createElement('div');
//     content.classList.add('content');

//     switch (id) {
//       case 'raise':
//         title.innerHTML = 'Raise a bet!';
//         content.innerHTML = 'Select..!';
//         break;
//       case 'fire':
//         title.innerHTML = 'Check last player!';

//         const mess = document.createElement('div');
//         mess.classList.add('message')
//         mess.innerHTML = 'Are you sure to check last player figure?';
//         content.appendChild(mess);
//         break;
//     }

//     md.appendChild(title);
//     md.appendChild(content);

//     // btns accept
//     const _btns = document.createElement('div');
//     _btns.classList.add('btns-action', 'confirm');

//     const _btns1 = document.createElement('button');
//     _btns1.classList.add('btn', 'cancel'); // esc
//     _btns1.innerHTML = 'Cancel';

//     const _btns2 = document.createElement('button');
//     _btns2.classList.add('btn');
//     _btns2.innerHTML = 'Accept';

//     _btns.appendChild(_btns1);
//     _btns.appendChild(_btns2);

//     md.appendChild(_btns);

//     // add canvas to dom
//     document.body.appendChild(md);

//     const btns = document.getElementById('action');
//     btns.style.visibility = 'hidden';

//     //const up = document.querySelector('.up');

//     const esc = [
//       exit,
//       _btns1
//     ]
//     esc.forEach((e) => {
//       e.addEventListener('click', () => {
//         document.body.removeChild(document.body.lastChild);
//         btns.style.visibility = 'visible';
//       });
//     });
//   }

//   // Set up buttons
//   var buttons = document.getElementsByTagName('button');
//   for (let i = 0; i < buttons.length; i++) {
//     buttons[i].addEventListener('click', onButtonClick, false);
//   };

//   function onButtonClick(event) {
//     //console.log(event.target.id);
//     switch (event.target.id) {
//       case 'raise':
//         openMd('raise');
//         break;
//       case 'fire':
//         openMd('fire');
//         break;
//       case 'menu':
//         break;
//       case 'online':
//         console.log('online: ' );
//         break;
//     }
//   }

//   //////

//   camera.position.x = 8//6;//7;
//   camera.position.y = 6//7;//5;
//   camera.position.z = 0;

//   // const _pos = new THREE.Vector3(0, 3.2, 0);
//   const _pos = new THREE.Vector3(2, 2, 0);

//   camera.lookAt(_pos);

//   /// Resize event
//   window.addEventListener('resize', onWindowResize, false);

//   function onWindowResize() {

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize(window.innerWidth, window.innerHeight);
//   }
// }


// function updateUI() {

// }

// function animate() : void {
// 	requestAnimationFrame(animate)
//   frame()
// 	render()
// }

// function render(): void {
//   const timer = 0.003 * Date.now();
//   box.position.y = 0.3 + 0.3 * Math.sin(timer);
//   box.rotation.x += 0.03;
//   renderer.render(scene, camera);
// }






// ============================================================

// add styles
import './style.css';
// three.js
import * as THREE from 'three';
// import { response } from 'express';

let scene, camera, renderer,
    cards="AhKdDd"

createScene()

function createScene() {
  init()
  animate()
}

function createCards() {
  let count = 5//cards.match(/.{1,2}/g);
  const material_cards = new THREE.MeshMatcapMaterial({
    color: 0xaaaaaa,
  });
  for (let i = 0; i < count; i++) {
    const card = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.01, 0.6), material_cards);

    scene.add(card);

    card.position.z = 0;

    card.position.x = 0;

    card.position.y = 3;

    const minus = (count === 1) ? 1 : -1; /// bug one card on hand fix
    card.rotation.z = minus * Math.PI / 4;

    const rot = [1, 15, 12, 10.5, 10];
    const pi_cards = Math.PI / rot[count - 1];
    card.rotation.y = pi_cards - (Math.PI / 4) / count * i;
  }
}

function frame() {
  createCards()
}

function init() {

  // create the scene
  scene = new THREE.Scene();

  // create the camera
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // add axis to the scene
  const axis = new THREE.AxesHelper(10);

  scene.add(axis);

  // add lights
  const light = new THREE.DirectionalLight(0xffffff, 1.0);

  light.position.set(100, 100, 100);

  scene.add(light);

  const light2 = new THREE.DirectionalLight(0xffffff, 1.0);

  light2.position.set(-100, 100, -100);

  scene.add(light2);

  const material = new THREE.MeshBasicMaterial({
    color: 0xaaaaaa,
    wireframe: true,
  });

  ////////////////////////////////////////////////////////

  // function getCookie(cname) {
  //   let name = cname + '=';
  //   let decodedCookie = decodeURIComponent(document.cookie);
  //   let ca = decodedCookie.split(';');
  //   for (let i = 0; i < ca.length; i++) {
  //       let c = ca[i];
  //       while (c.charAt(0) == ' ') {
  //           c = c.substring(1);
  //       }
  //       if (c.indexOf(name) == 0) {
  //           return c.substring(name.length, c.length);
  //       }
  //   }
  //   return '';
  // }

  // function setCookie(cname, cvalue, exhours) {
  //   let d = new Date();
  //   d.setTime(d.getTime() + (exhours*60*60*1000));
  //   let expires = 'expires='+ d.toUTCString();
  //   document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
  // }

  let clientId;
  let roomId;
  let hand;
  /// 1. Save a object in cookie
  // let user = {
  // 	id: clientId
  // };

  // convert the user object to JSON string using JSON.stringify() function 
  // let userJsonString = JSON.stringify(user); 

  // /// 2. Read the saved user info from cookie 
  // let savedUserJsonString = getCookie('user_info')
  // if (savedUserJsonString.length === 0) { 
  //   // no user in cookie 
  //   //return; 
  //   // save the the json string in session 
  //   setCookie('user_info', userJsonString, .2)
  //   savedUserJsonString = getCookie('user_info')
  // } 
  //   // convert the saved user info to JSON object using JSON.parse() function 
  //   let savedUser = JSON.parse(savedUserJsonString)
  //   // finally, display the user info in the view or console 
  //   // console.log('name: ', savedUser.id)

  ////////////////////////////


  ////
  // if(location.pathname.split('/')[2]==='p') console.log(location.pathname.split('/')[3])

  let host = location.origin.replace(/^http/, 'ws')
  let ws = new WebSocket(host);

  const bidd = document.createElement('input')
  bidd.id = 'bid-code'
  bidd.placeholder = '00 02 00 ... 09 01 02 ..'
  document.body.append(bidd)

  const btnBid = document.createElement('button')
  btnBid.id = 'bid'
  btnBid.innerText = 'bid'
  document.body.append(btnBid)
  btnBid.addEventListener('click', e => {
    const payLoad = {
      'method': 'move',
      'roomId': roomId,
      'clientId': clientId,
      'bid': bidd.value
    }
    ws.send(JSON.stringify(payLoad))
  })

  const btnCheck = document.createElement('button')
  btnCheck.id = 'check'
  btnCheck.innerText = 'check'
  document.body.append(btnCheck)
  btnCheck.addEventListener('click', e => {
    const payLoad = {
      'method': 'move',
      'roomId': roomId,
      'clientId': clientId,
      'bid': 'check'
    }
    ws.send(JSON.stringify(payLoad))
  })

  const btnDraw = document.createElement('button')
  btnDraw.id = 'draw'
  btnDraw.innerText = 'draw'
  document.body.append(btnDraw)
  btnDraw.addEventListener('click', e => {
    const payLoad = {
      'method': 'draw',
      'roomId': roomId
    }
    ws.send(JSON.stringify(payLoad))
  })

  const btnCreate = document.createElement('button')
  btnCreate.id = 'create'
  btnCreate.innerText = 'create'
  document.body.append(btnCreate)
  btnCreate.addEventListener('click', e => {
    const payLoad = {
      'method': 'create',
      'hostId': clientId
    }
    // console.log('data')
    ws.send(JSON.stringify(payLoad))
  })

  const destRoomId = document.createElement('input')
  destRoomId.id = 'join-code'
  destRoomId.placeholder = 'Enter room id..'
  document.body.append(destRoomId)

  const btnJoin = document.createElement('button')
  btnJoin.id = 'join'
  btnJoin.innerText = 'join'
  document.body.append(btnJoin)
  btnJoin.addEventListener('click', e => {
    const dest = destRoomId.value
    if (dest.length===8){
      //if (roomId === null)

      const payLoad = {
        'method': 'join',
        'clientId': clientId,
        'roomId': dest
      }
      ws.send(JSON.stringify(payLoad))
    }
  })

  ws.onmessage = function (event) {
    const res = JSON.parse(event.data);

    if (res.method === 'connect') {
      // ws.send(clientId)
      clientId=res.clientId
      console.log('Client id set successfully ' + clientId)
    }

    if (res.method === 'create') {
      roomId=res.room.id
      const clientId=res.room.hostId
      console.log('Room created successfully by client: ' + clientId + ', with id: ' + roomId)
    }

    if (res.method === 'join') {
      roomId=res.room.id
      const clientId=res.clientId
      console.log('Room:' + roomId + ' joined successfully by client: ' + clientId)
    }

    if (res.method === 'draw') {
      const cards = res.cards
      console.log('Room:' + roomId + ' ; client: ' + clientId + ' ; cards: ' + [cards])
      console.log({cards})
      //update three js
    }
  };

  ////////////////////////////////////////////////////////

  camera.position.x = 8//6;//7;
  camera.position.y = 6//7;//5;
  camera.position.z = 0;

  // const _pos = new THREE.Vector3(0, 3.2, 0);
  const _pos = new THREE.Vector3(2, 2, 0);

  camera.lookAt(_pos);

  // Renderer
  renderer = new THREE.WebGLRenderer(); //{ antialias: true}{ alpha: true }

  renderer.setPixelRatio(window.devicePixelRatio)
  // renderer.setClearColor(0xBAC4CC)
  // scene.background = new THREE.Color(0x00ff00);
  renderer.setSize(window.innerWidth, window.innerHeight); // set size

  // add canvas to dom
  document.body.appendChild(renderer.domElement);

  /// Resize event
  window.addEventListener('resize', onWindowResize, false);

  function onWindowResize() {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

/////////////////////////////////////////

/////////////////////////////////////////

function updateUI() {
  const pokerSymbols = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

  const pokerColors = ['k', 'h', 't', 'p']; // k: 9826, h: 9825, t: 9831, p: 9828

  // karty od 9
  const ranks09 = [
    'Royal flush',      // 09 01 02 // // 2nd color
    'Straight flush',   // 08 01 09 // // 2nd color
    'Four of a kind',   // 07 02 00 // 
    'Flush',            // 06 01 00 //... // 2nd color
    'Full house',       // 05 02 03 // 
    'Three of a kind',  // 04 02 00 // 
    'Straight',         // 03 09 00 //
    'Two pairs',        // 02 03 02 // 03 03 02 02 // sort max to begin
    'Pair',             // 01 02 00 // 02 02 
    'High card',        // 00 02 00 // 02
  ]

  // karty od 8
  const ranks08 = [
    'Royal flush',      // 09 01 02 // 2nd color
    'Straight flush',   // 08 01 08_// 2nd color
    'Four of a kind',   // 07 02 00 
    'Full house',       // 06 02 03 
    'Flush',            // 05 01 00 // 2nd color
    'Three of a kind',  // 04 02 00    
    'Straight',         // 02 08_00
    'Two pairs',        // 02 03 02 // sort max to begin
    'Pair',             // 01 02 00 
    'High card',        // 00 02 00 
  ]

/////////////////
let bid = '090102'; // output from server ------> client  // ['K','K','Q','Q','Q']
/////////////////
// let cards = 'AhApAtKkKp'; // - ,, -
// /////////////////

let _bid = bid.match(/.{1,2}/g);

class Bid { 
  // field 
  cards:string; 

  // constructor 
  constructor(cards:string) { 

    let a, b, c, d, e;

    let B = (n:number) => pokerColors[Number(_bid[1+n])]; /////////

    for (let i = 0; i < _bid.length; i++) {
      switch(i) {
        case 0:
          a = pokerSymbols[Number(_bid[1]) - 2];
          break;
        case 1:
          b = pokerSymbols[Number(_bid[2]) - 2];
          break;
        case 2:
          c = pokerSymbols[Number(_bid[3]) - 2];
          break;
        case 3:
          d = pokerSymbols[Number(_bid[4]) - 2];
          break;
        case 4:
          e = pokerSymbols[Number(_bid[5]) - 2];
          break;
      }
    }

    const _a = pokerColors[Number(_bid[1])];

    switch(Number(_bid[0])) {
      case 9: // Royal flush
        cards = _a + b + c + d;//
        break;
      case 8: // Straight flush
        cards = _a + b + b;//
        break;
      case 7: // Four of a kind
        cards = a + a + a + a;
        break;
      case 6: // Flush
        cards = _a + _a + _a + _a;//
        break;
      case 5: // Full house
        cards = a + a + a + b + b;
        break;
      case 4: // Three of a kind
        cards = a + a + a;
        break;
      case 3: // Straight
        cards = a + b + c + d + e;
        break;
      case 2: // Two pairs
        cards = a + a + b + b;
        break;
      case 1: // Pair
        cards = a + a;
        break;
      case 0: // High card
        cards = a;
        break;
    }

    this.cards = cards
  }
}

// let _cards = cards.match(/.{1,2}/g);

let bid_ = new Bid(bid);
// console.log(bid_.cards);

  ////////////////////////////////////////////////////////////////
  // // bid UI
  const bid_last = document.getElementById('last');
  const bid_lastfig = document.getElementById('last-fig');
  const span0 = document.createElement('span');

  let _arr= [],
      arr= [],
      color;
  // const BB = (sym, col) => {
  //   let n=0, _max=0;
  //   for (let i = 0; i < sym.length; i++) {
  //     let curr = (bid_.cards.split(sym[i]).length - 1);
  //     if (curr!=0) {
  //       _arr[n] = (curr>_max) && curr;
  //       arr[n] = sym[i];
  //       n++;
  //     }
  //   }
  //   if (col > 0) {
  //     for (let i = 0; i < sym.length; i++) {
  //       color = ((bid_.cards.split(pokerColors[i]).length - 1) != 0) ? pokerColors[i] :'';
  //     }
  //   }
  // }
  console.log(color)
  // figures
  // switch(Number(_bid[0])) {
  //   case 6:
  //     BB(pokerColors, 0);
  //     break;
  //   case 8:
  //     BB(pokerSymbols, 0);
  //     break;
  //   case 9:
  //     BB(pokerSymbols, 0); ////////////// edit
  //     break;
  //   default:
  //     BB(pokerSymbols, 0);
  //     break;
  // }
  // colors
  // let BB = () => { for (let i = 0; i < pokerSymbols.length; i++) {
  //   ((bid_.cards.split(pokerColors[i]).length - 1) > 0) }}
  // if ()

  span0.innerHTML = _arr[0] + 'x <i>' + arr[0] + '</i>';
  const span1 = document.createElement('span');
  span1.innerHTML = (_arr.length>1) ? _arr[1] + 'x <i>' + arr[1] + '</i>':'';
  const span2 = document.createElement('span');
  span2.innerHTML = (_arr.length>2) ? _arr[2] + 'x <i>' + arr[2] + '</i>':'';
  bid_last.appendChild(span0);
  bid_last.appendChild(span1);
  bid_last.appendChild(span2);
  // bid_lastfig.innerHTML = ranks09[ranks09.length-Number(_bid[0])-1];

  const openMd = (id) => {
    const md = document.createElement('div');

    md.classList.add('md-modal')

    const exit = document.createElement('span');
    exit.innerHTML = '&#10005;';
    exit.classList.add('exit'); // esc
    //exit.id = 'exit';
    md.appendChild(exit);

    const title = document.createElement('div');
    title.classList.add('title');

    const content = document.createElement('div');
    content.classList.add('content');

    switch (id) {
      case 'raise':
        title.innerHTML = 'Raise a bet!';
        content.innerHTML = 'Select..!';
        break;
      case 'fire':
        title.innerHTML = 'Check last player!';

        const mess = document.createElement('div');
        mess.classList.add('message')
        mess.innerHTML = 'Are you sure to check last player figure?';
        content.appendChild(mess);
        break;
    }

    md.appendChild(title);
    md.appendChild(content);

    // btns accept
    const _btns = document.createElement('div');
    _btns.classList.add('btns-action', 'confirm');

    const _btns1 = document.createElement('button');
    _btns1.classList.add('btn', 'cancel'); // esc
    _btns1.innerHTML = 'Cancel';

    const _btns2 = document.createElement('button');
    _btns2.classList.add('btn');
    _btns2.innerHTML = 'Accept';

    _btns.appendChild(_btns1);
    _btns.appendChild(_btns2);

    md.appendChild(_btns);

    // add canvas to dom
    document.body.appendChild(md);

    const btns = document.getElementById('action');
    btns.style.visibility = 'hidden';

    //const up = document.querySelector('.up');

    const esc = [
      exit,
      _btns1
    ]
    esc.forEach((e) => {
      e.addEventListener('click', () => {
        document.body.removeChild(document.body.lastChild);
        btns.style.visibility = 'visible';
      });
    });
  }

  // Set up buttons
  var buttons = document.getElementsByTagName('button');
  for (let i = 0; i < buttons.length; i++) {
    buttons[i].addEventListener('click', onButtonClick, false);
  };

  function onButtonClick(event) {
    //console.log(event.target.id);
    switch (event.target.id) {
      case 'raise':
        openMd('raise');
        break;
      case 'fire':
        openMd('fire');
        break;
      case 'menu':
        break;
      case 'online':
        console.log('online: ' );
        break;
    }
  }
}

function animate() { // : void
	requestAnimationFrame(animate)
  frame()
	render()
}

function render() { //  : void
  // const timer = 0.003 * Date.now();
  renderer.render(scene, camera);
}