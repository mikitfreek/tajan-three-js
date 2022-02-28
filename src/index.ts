// add styles
import './style.css';

let clientId,
    roomId


createScene()
function createScene() {
  init()
  renderSidebar()
  // toggleDarkMode()
  updateUI()
  // if (typeof clientId === "undefined") {
  //   let _cards_ = createCards([['A','h'],['K','d'],['T','c'],['9','s']])
  //   document.body.appendChild(_cards_)
  // }
}

function createCards(cards_) {
  const cards = document.createElement('div')
  cards.className = 'cards'

  for (let i = 0; i < cards_.length; i++) {
    const card = document.createElement('div')
    card.className = 'card'
    const label = document.createElement('div')
    label.className = 'label'
    if (cards_[i][1] === 'h' || cards_[i][1] === 'd')
      label.className += ' red'
    for (let k = 0; k < 2; k++) {
      const span = document.createElement('span')
      span.innerHTML = cards_[i][k]
      label.appendChild(span)
    }
    card.appendChild(label)
    cards.appendChild(card)
  }
  return cards
}


function init() {
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

    if (res.method === 'turn') {
      console.log('Now is client: ' + clientId + ' turn, from room id: ' + roomId)
    }

    if (res.method === 'create') {
      roomId=res.room.id
      const clientId=res.room.hostId
      console.log('Room created successfully by client: ' + clientId + ', with id: ' + roomId)
      // console.log(location.origin + '/r/' + roomId)
      navigator.clipboard.writeText(location.origin + '/r/' + roomId).then(res=>{
        console.log(`${location.origin + '/r/' + roomId} - copied to clipboard`);
      })
      const alert = document.getElementById('alert')
      while (alert.children.length >= 1) {
        alert.removeChild(alert.lastChild);
      }
      const p = document.createElement('p')
      p.innerText = `Created a room! id: ${roomId}`
      alert.append(p)
      const inp = document.createElement('input')
      inp.value=`${location.origin.replace(/^(http|https):\/\//, '') + '/r/' + roomId}`
      alert.append(inp)
      const a = document.createElement('span')
      a.innerText=`- copied to clipboard! -`
      a.className='clip'
      alert.append(a)
    }

    if (res.method === 'join') {
      roomId=res.room.id
      const clientId=res.clientId
      console.log('Room:' + roomId + ' joined successfully by client: ' + clientId)
      const alert = document.getElementById('alert')
      while (alert.children.length >= 1) {
        alert.removeChild(alert.lastChild);
      }
      const p = document.createElement('p')
      p.innerText = `Joined a room: ${roomId}`
      alert.append(p)
    }

    if (res.method === 'draw') {
      const cards = res.cards
      console.log('Room:' + roomId + ' ; client: ' + clientId + ' ; cards: ' + [cards])
      
      let check = document.querySelector('.cards')
      if ( check !== null ) document.body.removeChild(check)
      let _cards_ = createCards(cards)
      document.body.appendChild(_cards_)
      //update three js
    }
  };

  ////////////////////////////////////////////////////////


  // add canvas to dom
  // document.body.appendChild(renderer.domElement);

  /// Resize event
  // window.addEventListener('resize', onWindowResize, false);

  // function onWindowResize() {

  //   camera.aspect = window.innerWidth / window.innerHeight;
  //   camera.updateProjectionMatrix();

  //   renderer.setSize(window.innerWidth, window.innerHeight);
  // }
}


/// 1. Save a object in cookie
  // let user = {
  // 	id: clientId
  // };
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

/////////////////////////////////////////

/////////////////////////////////////////
function toggleDarkMode() {
  const e = document.body;
  e.classList.toggle("dark-mode");
}
toggleDarkMode()

function updateUI() {
  const pokerSymbols = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

  const pokerColors = ['k', 'h', 't', 'p']; // k: 9826, h: 9825, t: 9831, p: 9828

  let _pokerSymbols=pokerSymbols
  const cardsSymbols9 = _pokerSymbols.splice(7,6).reverse()

  const cardsColors9 = pokerColors.map(e => {
    if(e==='k') e='karo'
    if(e==='h') e='serducho'
    if(e==='t') e='treflik'
    if(e==='p') e='pikuś'
  return e});

  const cards2Symbols9 = cardsSymbols9.map(e => {
    e=e+e
  return e});

  const cards3Symbols9 = cardsSymbols9.map(e => {
    e=e+e+e
  return e});

  const cards4Symbols9 = cards2Symbols9.map(e => {
    e=e+e
  return e});

  const cardsStraightSymbols9 = ['TJQKA', '9TJQK']
  // let _cardsStraightSymbols9=cardsStraightSymbols9
  // const cardsStraightSymbol9 = ['9TJQK']//_cardsStraightSymbols9.splice(1,1)

  // karty od 9
  const ranks9 = [
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
  const ranks8 = [
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
let cards = 'AhApAtKkKp'; // - ,, -
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

let _cards = cards.match(/.{1,2}/g);

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
  const BB = (sym, col) => {
    let n=0, _max=0;
    for (let i = 0; i < sym.length; i++) {
      let curr = (bid_.cards.split(sym[i]).length - 1);
      if (curr!=0) {
        _arr[n] = (curr>_max) && curr;
        arr[n] = sym[i];
        n++;
      }
    }
    if (col > 0) {
      for (let i = 0; i < sym.length; i++) {
        color = ((bid_.cards.split(pokerColors[i]).length - 1) != 0) ? pokerColors[i] :'';
      }
    }
  }
  console.log(color)
  // figures
  switch(Number(_bid[0])) {
    case 6:
      BB(pokerColors, 0);
      break;
    case 8:
      BB(pokerSymbols, 0);
      break;
    case 9:
      BB(pokerSymbols, 0); ////////////// edit
      break;
    default:
      BB(pokerSymbols, 0);
      break;
  }
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

    //////////////////////////////////
    const lists = document.createElement('div');
    lists.classList.add('lists');

    const list0 = document.createElement('select');
    list0.id='ranks'
    list0.name='Ranks'
    list0.title="ranks"
    list0.size=10
    list0.addEventListener('change', function () { 
      onButtonClick(list0.options.selectedIndex);
      // list2.options.selectedIndex
    }, false );

    function onButtonClick(val) {
      while (lists.children.length > 1) {
        lists.removeChild(lists.lastChild);
      }

      const list1 = document.createElement('select');
      list1.name='Cards'
      list1.title="cards"
      list1.size=10
      let _width='4.1rem'
      if(val==7 || val==4)list1.style.minWidth=_width
      list1.addEventListener('change', function () { 
        if (lists.childNodes.length > 2)
          onButtonClick2(list1.options.selectedIndex);
      }, false );

      let symbols = [
        cardsColors9,
        cardsColors9, //here cardsStraightSymbol9
        cards4Symbols9,
        cardsColors9,
        cards3Symbols9,
        cards3Symbols9,
        cardsStraightSymbols9,
        cards2Symbols9,
        cards2Symbols9,
        cardsSymbols9
      ]
      symbols[val].forEach(function(e, i) {
        const p = document.createElement('option');
        p.appendChild(document.createTextNode(e));
        // p.value=String(symbols.length-i)
        list1.appendChild(p);
      });

      lists.appendChild(list1);

      const list2 = document.createElement('select');
      if(val==7 || val==4) { // || val==1
      
      list2.name='Cards'
      list2.title="cards"
      list2.size=10
      list2.style.minWidth=_width
      
      //const _symbols= (val==7 || val==4) ? cards2Symbols9 : cardsColors9;

      cards2Symbols9.forEach(function(e, i) {
        const p = document.createElement('option');
        p.appendChild(document.createTextNode(e));
        // p.value=String(cards2Symbols9.length-i)
        list2.appendChild(p);
      });

      lists.appendChild(list2);
      }
      function onButtonClick2(val) { 
        Array.from(list2.options).forEach(function(e) { e.disabled = false });
        list2.options[val].disabled = true;
        list2.options[val].selected = false;
      }
    }

    // list.innerHTML = "";
    ranks9.forEach(function(e, i) {
        const p = document.createElement('option');
        p.appendChild(document.createTextNode(e));
        // p.value=String(ranks9.length-i)
        list0.appendChild(p);
    });
    

    // cardsSymbols9.forEach(function(e) {
    //   var p = document.createElement('option');
    //   p.appendChild(document.createTextNode(e));
    //   list1.appendChild(p);
    // });

    
    // function onButtonClick() {
    //   console.log('click')
    //   // ranks9.forEach(function(e) {
    //   //   var p = document.createElement('option');
    //   //   p.appendChild(document.createTextNode(e));
    //   //   list1.appendChild(p);
    //   // });
    //   // lists.appendChild(list1);
    //   // content.appendChild(lists);
    // }

    // const _buttons = document.querySelectorAll('option'); //getElementsByTagName('option')
    // _buttons.forEach(e => {
    //   e.addEventListener('click', onButtonClick, false);
    // })

     //////////////////////////////////


    switch (id) {
      case 'raise':
        title.innerHTML = 'Raise a bet!';
        // content.innerHTML = 'Select..!';

        lists.appendChild(list0);

        content.appendChild(lists);
        break;
      case 'fire':
        title.innerHTML = 'Check last player!';

        const mess = document.createElement('div');
        mess.classList.add('message')
        mess.innerHTML = 'Are you sure to check last player figure?';
        content.appendChild(mess);
        break;
      // case 'checked':
      //   title.innerHTML = 'Check last player!';

      //   const mess1 = document.createElement('div');
      //   mess1.classList.add('message')
      //   mess1.innerHTML = 'Are you sure to check last player figure?';
      //   content.appendChild(mess1);
      //   break;
      // case 'checkedu':
      //   title.innerHTML = 'Check last player!';

      //   const mess2 = document.createElement('div');
      //   mess2.classList.add('message')
      //   mess2.innerHTML = 'Are you sure to check last player figure?';
      //   content.appendChild(mess2);
      //   break;
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

  // function onButtonClick() {
  //   console.log('click')
  //   // ranks9.forEach(function(e) {
  //   //   var p = document.createElement('option');
  //   //   p.appendChild(document.createTextNode(e));
  //   //   list1.appendChild(p);
  //   // });
  //   // lists.appendChild(list1);
  //   // content.appendChild(lists);
  // }

  // const _buttons = document.querySelectorAll('option'); //getElementsByTagName('option')
  // _buttons.forEach(e => {
  //   e.addEventListener('click', onButtonClick, false);
  // })

  // Set up buttons
  // var buttons = document.getElementsByTagName('button');
  // for (let i = 0; i < buttons.length; i++) {
  //   buttons[i].addEventListener('click', onButtonClick, false);
  // };

  // function onButtonClick(event) {
  //   //console.log(event.target.id);
  //   switch (event.target.id) {
  //     case 'raise':
  //       openMd('raise');
  //       break;
  //     case 'fire':
  //       openMd('fire');
  //       break;
  //     case 'menu':
  //       break;
  //     case 'online':
  //       console.log('online: ' );
  //       break;
  //   }
  // }
  const raise = document.getElementById('raise')
  raise.addEventListener("click", function () {
    openMd('raise');
  });

  const fire = document.getElementById('fire')
  fire.addEventListener("click", function () {
    openMd('fire');
  });

  const online = document.getElementById('online')
  online.addEventListener("click", function () {
    console.log('online: ' );
  });
}

function renderSidebar() {
  const ui: any = document.querySelector('#renderUi');
  const menu = document.getElementById('menu')

  function uii() {  
    if (ui.classList.contains('hidden')) {
      ui.classList.remove('hidden');
      setTimeout(function () {
        ui.classList.remove('visuallyhidden');
      }, 20);
    } else {
      ui.classList.add('visuallyhidden');    
      setTimeout(function () {
        ui.classList.add('hidden');
      }, 60);
      // ui.addEventListener('transitionend', function() {
      //   ui.classList.add('hidden');
      // }, {
      //   capture: false,
      //   once: true,
      //   passive: false
      // });
    }
  }

  menu.addEventListener("click", function (e) {
    uii()
  });

  const sidebar = document.querySelector('.sidebar');
  const closeBtn = document.querySelector('#btn');
  // const searchBtn = document.querySelector('.bx-search');

  closeBtn.addEventListener('click', () => {
      // sidebar.classList.toggle('open');
      // menuBtnChange();//calling the function(optional)
      uii()
  });
// searchBtn.addEventListener('click', () => { // Sidebar open when you click on the search iocn
//     sidebar.classList.toggle('open');
//     menuBtnChange(); //calling the function(optional)
// });

// following are the code to change sidebar button(optional)
// function menuBtnChange() {
//     if (sidebar.classList.contains('open')) {
//         closeBtn.classList.replace('bx-menu', 'bx-menu-alt-right');//replacing the iocns class
//     } else {
//         closeBtn.classList.replace('bx-menu-alt-right', 'bx-menu');//replacing the iocns class
//     }
//}
}

// function animate() { // : void
// 	requestAnimationFrame(animate)
//   frame()
// 	render()
// }

// function render() { //  : void
//   // const timer = 0.003 * Date.now();
//   renderer.render(scene, camera);
// }