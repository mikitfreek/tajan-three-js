const express = require('express');
const expressWs = require('express-ws');

const app = express();
expressWs(app);

//serve static files, 'public/index.html' will be served as '/'
app.use(express.static('dist'));

// normal express.js handler for HTTP GET
// app.get('/hello', function(req, res, next){
//   res.send('hello');
// });


// expressWs(app).getWss().on('connection', function(ws) {
//   console.log('connection open');

//   // GET ID
// });
//const { v5: uuidv5 } = require('uuid');
//const _NAMESPACE_ = 'bed9ae2b-25bd-4dcb-90e9-613038349430';


const { v4: uuidv4 } = require('uuid');

const clients = {};
const rooms = [];
const _rooms = [];
let randomColor = () => { return Math.floor(Math.random()*16777215).toString(16); }
//const colors = ['green', 'red', 'blue', 'yellow', 'orange', 'cyan', 'magenta']
// let clientData = {name:null, cards:[], bid:false, move:false, active:true}

// const url = require('url')
// websocket handler
app.get('/p/:tagId', async function(req, res) {
  // console.log("tagId is set to " + req.params.tagId);
  req.joinByTag = 1
  // res.redirect('back');

  // res.end();
});

////wsInstance.getWss()
//Returns the underlying WebSocket server/handler. You can use wsInstance.getWss().clients to obtain a list of all the connected WebSocket clients for this server.
// Note that this list will include all clients, not just those for a specific route - this means that it's often not a good idea to use this for broadcasts, for example.

// wss.on('connection', async (ws) => {
  
app.ws('/', async(ws, req) => {
  const clientName = 'client' + Object.keys(clients).length//req.url.replace('/?uuid=', '')

  // TODO Load id from cookie on comeback
  const clientId = uuidv4();
  ws.id = clientId
  
  if (typeof req.params.tagId !== 'undefined') ws.room = req.params.tagId
  else ws.room = 'lobby'

  // check if another client has same name   // ws.id = req.headers['sec-websocket-key'];
  const clientIp = req.socket.remoteAddress;

  function joinRoom(clientId, room) {
    let c = clients[clientId]
    if (c.color === null)
      c.color = randomColor
      
    room.clients.push({
      'id': clientId,
      'color': c.color
    })
  }

  console.log('New connection: '+ clientId);
  
  // console.log('websocket connection open')

  ws.on('message', function(msg) {
    const res = JSON.parse(msg) //.utf8Data

    // Create
    if (res.method === 'create') {
      // ws.send(clientId)
      // console.log('name: ', savedUser.id)
      const hostId=res.hostId
      // Give another client host if previons left lobby
      const roomId=hostId.split('-')[0]
      ws.room=roomId
      console.log('Room created successfully by client: ' + hostId + ', with id: ' + roomId)
      console.log('http://localhost:3000/p/' + roomId)

      rooms[roomId] = {
        'id': roomId,
        'hostId': hostId,
        'clients': []
      }

      _rooms[roomId] = {
        'last': 0,
        'bid': '',
        'cards': []
      }

      // color = randomColor
      
      // auto join room
      // rooms[roomId].clients.push({
      //   'clientId': clientId,
      //   'color': color
      // })
      joinRoom(hostId, rooms[roomId])

      const payLoad = {
        'method': 'create',
        'room': rooms[roomId]
      }

      const wss = clients[clientId].connection
      wss.send(JSON.stringify(payLoad))
      // console.log(rooms)
    }

    // Join
    if (res.method === 'join') {

      const clientId=res.clientId
      const roomId=res.roomId
      // console.log(rooms)

      // if exists
      if (typeof rooms[roomId] !== 'undefined'){
        ws.room=roomId
        // &&  typeof rooms[roomId].clients !== 'undefined' 
        //&&  
        // if(!rooms[roomId].clients.some(c => c.clientId === clientId) ) {
        
        if ( (typeof rooms[roomId].clients !== 'undefined' 
        &&    rooms[roomId].clients.some(c => c.id !== clientId))
        ||    typeof rooms[roomId].clients === 'undefined' )
          console.log('HERE')
        
        // color = randomColor

        // room.clients.push({
        //   'clientId': clientId,
        //   'color': color
        // })
        joinRoom(clientId, rooms[roomId])

        const payLoad = {
          'method': 'join',
          'clientId': clientId,
          'room': rooms[roomId]
        }

        rooms[roomId].clients.forEach(c => {
          clients[c.id].connection.send(JSON.stringify(payLoad))
        })

        console.log('Room: ' + roomId + ' joined successfully by client: ' + clientId)

        // const wss = clients[clientId].connection
        // wss.send(JSON.stringify(payLoad))
      } 
      // if doesnt exist
      else {
        console.log('Get Down! Client ' + clientId + ' is shooting!!')
        const payLoad = {
          'method': 'error',
          'info': 'Room not found'
        }
        const payLoad1 = {
          'method': 'error',
          'info': 'Too many attempts'
        }
        
        const wss = clients[clientId].connection

        wss.send(JSON.stringify(payLoad))

        const limit=3, burst=2, burstTime=1000, burstDelay=5000
        if(this.limitCounter >= limit) {
          if(this.burstCounter >= burst) {
             console.log('* Leaking * :: ' + clientId)
          }
          ++this.burstCounter
          setTimeout(() => {
            wss.send(JSON.stringify(payLoad1))
            console.log('* Block * :: ' + clientId)
          setTimeout(_ => --this.burstCounter, burstTime)
          }, burstDelay)
        }
        ++this.limitCounter
      }
    }

    // Draw
    if (res.method === 'draw') {
      const roomId = res.roomId
      const room = rooms[roomId]

      const deck = new Deck();
      deck.shuffle()

      // Draw cards
      // 2 times for all, then only for
      for (i=0; i<5; i++)
        room.clients.forEach(c => {
          const client = clients[c.id]
          if (client.score - i >= 1)
            client.cards.push(deck.deal())
        })
      console.log('Rozdano karty')

      // rooms[roomId].clients.forEach(c => {
      //   clients[c.clientId].connection.send(JSON.stringify(payLoad))
      // })
    }

    // Move
    if (res.method === 'move') {
      const roomId = res.roomId
      const room = rooms[roomId]
      const _room = _rooms[roomId]
      const bid = res.bid

      

      // Raise
      if (bid !== 'check') {
        if (_room.bid === '') _room.bid=bid
        // raise = Number(); ranks[raise]

        // check if bid>room.lastbid
        if ( bid > _room.bid) {
          console.log('gituwa mordeczko dobry zakładzik')
          // room
        } // else report error
        else console.log('Erro: smaller bid')
      }
      // Check
      else {
        // sum cards on hands
        
        room.clients.forEach(c => {
          clients[c.id].cards.forEach(card => {
            _room.cards.push(card)
          })
          clients[c.id].cards = []
        })
        console.log(_room.cards)

        // clients
        // _room.cards
      }
    }
  })

  const clientData = {
    'name': clientName, 
    'id': clientId,
    'connection': ws,
    'ip': clientIp,
    'color': null,
    'score': 2,
    'cards':[]
    // 'bid':false, 
    // 'move':false, 
    // 'active':true
  }
  clients[clientId] = clientData
  //inform client of client's id
  // socket.emit('setclientId', clientId);

  // console.log(ws)

  const payLoad = {
    'method': 'connect',
    'clientId': clientId
  }
  ws.send(JSON.stringify(payLoad))

  // var id = setInterval(function() {
  //   // console.log('websocket connection');
  //   ws.send(JSON.stringify(ws.id), function() {  }) //new Date()
  // }, 60000)
  // console.log(Number(Object.keys(clients).length))

  // Close
  ws.on('close', function() {
    // clients[clientId].active = false
    const clientId = ws.id
    const roomId = ws.room
    const room = rooms[roomId]
    // room.clients.splice((room.clients[clientId].index), 1);
    // let index = Object.keys(clients).findIndex( e => {
    //   if (e === clientId) { return true; }
    // });
    delete clients[clientId]
    // console.log(Object.keys(clients))

    if (  typeof room !== 'undefined' 
    &&    typeof room.clients !== 'undefined' ) {
      room.clients.forEach((c, i) => {
        if (c.id === clientId) {
          delete room.clients[i]
          if (i=2) console.log('jeden#')
        }
      })
    }

    console.log('Connection close: ' + clientId)
    // clearInterval(id)
  })
});

// app.listen(3000);

// Create an http server with Node's HTTP module. 
// Pass it the Express application, and listen on port. 
// const host = require('http').createServer(app)

// Import
const config = require('./config.json');
// const { createSourceFile } = require('typescript');

app.listen(config.port, () => {
  console.log(`listening on http://localhost:${config.port}`)// \n http://nodeapp2401.azuresite.com:${config.port}
})


// Connection
// io.sockets.on('connection', (socket) => {
//   console.log('a user connected')
//   socket.on('disconnect', () => {
//     console.log('user disconnected')
//   })
// })
// io.on('connection', (socket) => {
//   socket.on('cards', (msg) => {
//     console.log('cards: ' + msg + ', ' + socket.msg)
//     socket.emit('cards', msg)
//   })
// })

// io.on('connection', (socket) => {
//   socket.on('check', (msg) => {
//     console.log('check: ' + msg)
//     socket.emit('check', msg)
//   })
// })

// io.sockets.on('connection', (socket) => {
//   console.log('client connected')
//   agx.initGame(io, socket)
// })

///////////////////////////////////////
  // GAME LOGIC
///////////////////////////////////////
// const pokerSymbols = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A'];

// const pokerColors = ['k', 'h', 't', 'p']; // k: 9826, h: 9825, t: 9831, p: 9828
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

// karty do 8
const ranks08 = [
  'Royal flush',      // 09 01 02 // 2nd color
  'Straight flush',   // 08 01 08_// 2nd color
  'Four of a kind',   // 07 02 00 
  'Full house',       // 06 02 03 
  'Flush',            // 05 01 00 // 2nd color
  'Three of a kind',  // 04 02 00    
  'Straight',         // 02 08 00
  'Two pairs',        // 02 03 02 // sort max to begin
  'Pair',             // 01 02 00 
  'High card',        // 00 02 00 
]
// Obliczenia
// prawdopodobienstwo: 
// od 9 4*6=24
// 8 os. Full House:  ; Flush 
// 9 os. Full House:  ; Flush 
// od 8 4*7=28
// 8 os. Full House:  ; Flush 
// 9 os. Full House:  ; Flush 
// od 7 4*8=32
// 8 os. Full House:  ; Flush 
// 9 os. Full House:  ; Flush 

/////////////////
let bid = '090102'; // output from server ------> client  // ['K','K','Q','Q','Q']
/////////////////
let cards = 'AhApAtKkKp'; // - ,, -
/////////////////

// enum SUIT { None, Diamonds, Hearts, Clubs, Spades }
// enum RANK { None, Ace, Two, Three, Four, Five, Six, Seven, Eight,
//     Nine, Ten, Jack, Queen, King }
// foreach(SUIT in Enum.GetValues(typeof(SUIT)))
//     foreach(RANK in Enum.GetValues(typeof(RANK)))
//         if (RANK!=RANK.None && SUIT!=SUIT.None)
//             d[counter++] = new Card(RANK,SUIT);

// Season enums can be grouped as static members of a class
// class Season {
//   // Create new instances of the same class as static attributes
//   static Summer = new Season('summer')
//   static Autumn = new Season('autumn')
//   static Winter = new Season('winter')
//   static Spring = new Season('spring')

//   constructor(name) {
//     this.name = name
//   }
// }

// // Now we can access enums using namespaced assignments
// // this makes it semantically clear that 'Summer' is a 'Season'
// let season = Season.Summer

// // We can verify whether a particular variable is a Season enum
// console.log(season instanceof Season)
// // true
// console.log(Symbol('something') instanceof Season)
// //false

// // We can explicitly check the type based on each enums class
// console.log(season.constructor.name)
// 'Season'

// const SUIT = { None, Diamonds, Hearts, Clubs, Spades }
// const RANK = { None, Ace, Two, Three, Four, Five, Six, Seven, Eight,
//   Nine, Ten, Jack, Queen, King }


/////////////
// 1. GIVE clientS RANDOM CARDS
class Deck {
  constructor() {
    this.deck = [];

    const suits = ['Hearts', 'Spades', 'Clubs', 'Diamonds'];
    const values = [9, 10, 'Jack', 'Queen', 'King', 'Ace'];

    for (let suit in suits) {
      for (let value in values) {
        this.deck.push([`${values[value]}`, `${suits[suit]}`]);
      }
    }
  }

  shuffle(){
    const { deck } = this;
    let m = deck.length, i;

    while(m){
      i = Math.floor(Math.random() * m--);

      [deck[m], deck[i]] = [deck[i], deck[m]];
    }

    return this;
  }

  deal(){
    return this.deck.pop();
  }
}

// console.log(deck1.deck);




// room.clients.forEach(c => {
//   clients[c.clientId].connection.send(JSON.stringify(payLoad))
// })

// console.log(card);


// 2. MAKE A BID / CHANGE CURRENT client

// 3. WAIT FOR CHECK()

// CHECK()
// 1. SUM ALL CARDS ON HANDS

// 2. CHECK FOR LAST BID

// 3. RESPONSE
