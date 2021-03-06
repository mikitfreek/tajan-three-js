const express = require('express')
const WsServer = require('ws')
const { createServer } = require('http')

const app = express()
const server = createServer(app)

const path = require('path')

let joinCode
const cardsMax=5,//5
      cardsStart=2//2

function initWs() {
  const options = {
    noServer: true
  }

  return new WsServer.Server(options)
}

function initHttpServer(port) {
  // app.set('view engine', 'ejs')

  app.use(express.static(__dirname + '/dist'));

  app.get('/r/:roomId', async(req, res) => {
    // req.params.roomId; // { roomId: '42' }
    console.log('id from url: ' + req.params.roomId)
    joinCode = req.params.roomId
    // joinCode=req.params.roomId;
    // app.use(express.static(__dirname + '/dist'));
    // join(req.params.roomId)
    res.redirect('back');
    
  });// res.redirect('back');

  server.listen(process.env.PORT || port, () => {
    console.log(`Server is working on http://localhost:${process.env.PORT || port}`)
  })

  return app
}

// Import
const config = require('./config.json');

function initWebSocketServer(port = config.port) {
  initHttpServer(port)
  const wss = initWs()

  server.on('upgrade', async(req, socket, head) => {
    try {
      wss.handleUpgrade(req, socket, head, (ws) => {
        // Do something before firing the connected event

        wss.emit('connection', ws, req)
      })
    } catch(err) {
      // Socket uprade failed
      // Close socket and clean
      console.log('Socket upgrade failed', err)
      socket.destroy()
    }
  })

  return wss
}
const wss = initWebSocketServer()

wss.on('connection', async(ws, req) => {
  connect(ws, req)
  // console.log('Joincode: ' + joinCode)
})

const { v4: uuidv4 } = require('uuid')
// const { join } = require('path')

const clients = {}
const rooms = []
const _rooms = []
let randomColor = () => { return Math.floor(Math.random()*16777215).toString(16) }
  
///////////////////

///////////////////

function connect(ws, req) {
  const clientName = 'client' + Object.keys(clients).length//req.url.replace('/?uuid=', '')

  // TODO Load id from cookie on comeback
  const clientId = uuidv4();
  ws.id = clientId
  
  //if (typeof req.params.tagId !== 'undefined') ws.room = req.params.tagId
  //else ws.room = 'lobby'
  // const urlId = req.url.split('/')[2]

  // check if another client has same name   // ws.id = req.headers['sec-websocket-key'];
  const clientIp = req.socket.remoteAddress;

  const clientData = {
    'name': clientName, 
    'id': clientId,
    'connection': ws,
    'ip': clientIp,
    'color': null,
    'score': cardsStart,
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

  ///////

  // const turn = (_rooms[ws.room].last) ? : ;

  // const payLoad1 = {
  //   'method': 'turn'
  // }
  // if (turn) {
  //   const wss = clients[clientId].connection

  //   wss.send(JSON.stringify(payLoad))
  // }
  
  // room.clients.forEach(c => {
  //       let cards = []
  //       clients[c.id].cards.forEach(card => {
  //         cards.push(card)
  //       })
  //       const payLoad = {
  //         'method': 'draw',
  //         'cards': cards
  //       }
  //       clients[c.id].connection.send(JSON.stringify(payLoad))
  //     })

  ///////////////////////

  function joinRoom(clientId, room) {
    let c = clients[clientId]
    if (c.color === null)
      c.color = randomColor()
      
    room.clients.push({
      'id': clientId,
      'color': c.color
    })
  }

  console.log('* >======== ' + clientName + ' ========>');
  console.log('New connection: '+ clientId);
  
  // console.log('websocket connection open')

  function joinNow(clientId, roomId) {
    // const clientId=clientId
    // const roomId=roomId
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

      // console.log('------------------------------------')
      // console.log(rooms[roomId].clients)
      // console.log('------------------------------------')
      
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

  if (typeof joinCode !== 'undefined') { 
    joinNow(ws.id, joinCode)
  }
  else ws.room = 'lobby'

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
      console.log((process.env.PORT) ? `https://infinite-mesa-09265.herokuapp.com:${process.env.PORT}/r/${roomId}` : `http://localhost:${config.port}/r/${roomId}`);

      rooms[roomId] = {
        'id': roomId,
        'hostId': hostId,
        'clients': []
      }

      _rooms[roomId] = {
        'last': 0,
        'bid': null,
        'clients': [],
        'cards': []
      }

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
      joinNow(res.clientId, res.roomId)
    }

    // Draw
    if (res.method === 'draw') {
      const roomId = res.roomId
      const room = rooms[roomId]

      const deck = new Deck();
      deck.shuffle()

      room.clients.forEach(c => {
        clients[c.id].cards = []
      })
      // Draw cards
      // 2 times for all, then only for
      for (i=0; i<cardsMax; i++)
        room.clients.forEach(c => {
          const client = clients[c.id]
          if (client.score - i >= 1)
            client.cards.push(deck.deal())
        })
      console.log('Rozdano karty')

      room.clients.forEach(c => {
        let cards = []
        clients[c.id].cards.forEach(card => {
          cards.push(card)
        })
        const payLoad = {
          'method': 'draw',
          'cards': cards
        }
        clients[c.id].connection.send(JSON.stringify(payLoad))
      })
    }

    // Move
    if (res.method === 'move') {
      const roomId = res.roomId
      const room = rooms[roomId]
      const _room = _rooms[roomId]
      const bid = res.bid

      

      // Raise
      if (bid !== 'check') {
        if (_room.bid === null) _room.bid=bid
        // raise = Number(); ranks[raise]

        // check if bid>room.lastbid
        if ( bid > _room.bid) {
          ++_room.last
          console.log('gituwa mordeczko dobry zak??adzik')
          // room

          //send
          room.clients.forEach(c => {
            const payLoad = {
              'method': 'raise',
              'stat': 'pass'
            }
            clients[c.id].connection.send(JSON.stringify(payLoad))
          })
        } // else report error
        else console.log('Error: smaller bid')
      }
      // Check
      else {
        // sum cards on hands
        let _cards = []
        room.clients.forEach(c => {
          clients[c.id].cards.forEach(card => {
            _cards.push(card)
          })
        })
        console.log(_cards)

        // check if cards contain bid
        let counts = {
          figures: {},
          colors: {},
          figuresByColors: {
            'k': [],
            'h': [],
            't': [],
            'p': []
          }
        };
        // for(col in pokerColors)
        //   counts.figuresByColors[col] = []

        _cards.forEach((card, i) => {
          const c = counts.figures[card[0]]
          counts.figures[card[0]] = c ? c + 1 : 1;
          const d = counts.colors[card[1]]
          counts.colors[card[1]] = d ? d + 1 : 1;
          // const b = counts.figuresByColors[card[1] + card[0]]
          // counts.figuresByColors[card[1] + card[0]] = b ? b + 1 : 1;

          // if (i<1) counts.figuresByColors[card[1]] = []
          counts.figuresByColors[card[1]].push(
            card[0]
          )
        })
        console.log('===================')
        console.log(counts.figures)
        console.log(counts.colors)
        console.log(counts.figuresByColors)
        // console.log(counts.colorsByFig['h'][pokerSymbols[4]])

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
        //_bid='5QT'//'0Q'
        // bid.match(/.{1,2}/g);
        _bid=bid
        console.log(bid)
        _bid.match(/.{1,1}/g);
        let   stat=false;
        const f0=counts.figures[_bid[1]],
              f1=counts.figures[_bid[2]],
              c0=counts.colors[_bid[1]]
            switch(Number(_bid[0])) {
              case 9: // Royal flush
                const z=pokerSymbols.length-5
                const arr=counts.figuresByColors[_bid[1]]
                if ( arr.includes(counts.figures[pokerSymbols[z]])
                  && arr.includes(counts.figures[pokerSymbols[z+1]])
                  && arr.includes(counts.figures[pokerSymbols[z+2]])
                  && arr.includes(counts.figures[pokerSymbols[z+3]])
                  && arr.includes(counts.figures[pokerSymbols[z+4]])
                  ) stat=true //counts.colorsByFig[card[1]].card[0]
                break;
              case 8: // Straight flush
                const w=pokerSymbols.indexOf(_bid[1])
                const arr1=counts.figuresByColors[_bid[2]]
                if ( arr1.includes(counts.figures[pokerSymbols[w]])
                  && arr1.includes(counts.figures[pokerSymbols[w+1]])
                  && arr1.includes(counts.figures[pokerSymbols[w+2]])
                  && arr1.includes(counts.figures[pokerSymbols[w+3]])
                  && arr1.includes(counts.figures[pokerSymbols[w+4]])
                  ) stat=true
                break;
              case 7: // Four of a kind
                if (f0 >= 4 && f1 >= 2) stat=true
                break;
              case 6: // Flush
                if (c0 >= 4) stat=true
                break;
              case 5: // Full house
                if (f0 >= 3 && f1 >= 2) stat=true
                break;
              case 4: // Three of a kind
                if (f0 >= 3) stat=true
                break;
              case 3: // Straight
                //f0
                // counts.figures[_bid[1]]
                const y=pokerSymbols.indexOf(_bid[1])
                if (f0 >= 1 
                  && counts.figures[pokerSymbols[y+1]] >= 1
                  && counts.figures[pokerSymbols[y+2]] >= 1
                  && counts.figures[pokerSymbols[y+3]] >= 1
                  && counts.figures[pokerSymbols[y+4]] >= 1
                  ) stat=true
                break;
              case 2: // Two pairs
                if (f0 >= 2 && f1 >= 2) stat=true
                break;
              case 1: // Pair;
                if (f0 >= 2) stat=true
                break;
              case 0: // High card
                if (f0 >= 1) stat=true
                break;
            }

        // const w0 = clients[room.clients[_room.last].id]
        // const w1 = clients[room.clients[_room.last+1].id]

        // rooms[roomId].clients.forEach(c => {
        //   clients[c.id].connection.send(JSON.stringify(payLoad))
        // })

        let winner = (stat) ? 1 : 0;
        //send
        room.clients.forEach(c => {
          const payLoad = {
            'method': 'check',
            'stat': winner
          }
          clients[c.id].connection.send(JSON.stringify(payLoad))
        })
        ++_room.last
      }
      // ++_rooms[roomId].last
    }
  })

  
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
}
///////////////////////////////////////
  // GAME LOGIC
///////////////////////////////////////
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

// karty do 8
// const ranks08 = [
//   'Royal flush',      // 09 01 02 // 2nd color
//   'Straight flush',   // 08 01 08_// 2nd color
//   'Four of a kind',   // 07 02 00 
//   'Full house',       // 06 02 03 
//   'Flush',            // 05 01 00 // 2nd color
//   'Three of a kind',  // 04 02 00    
//   'Straight',         // 02 08 00
//   'Two pairs',        // 02 03 02 // sort max to begin
//   'Pair',             // 01 02 00 
//   'High card',        // 00 02 00 
// ]
// prawdopodobienstwo
// dla kart:
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
// let bid = '090102'; // output from server ------> client  // ['K','K','Q','Q','Q']
/////////////////
// let cards = 'AhApAtKkKp'; // - ,, -
/////////////////

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

/////////////
// 1. Draw clients random cards
class Deck {
  constructor() {
    this.deck = [];

    const suits = ['k', 'h', 't', 'p'];
    const values = ['9', 'T', 'J', 'Q', 'K', 'A'];

    for (let suit in suits) {
      for (let value in values) {
        this.deck.push([`${values[value]}`, `${suits[suit]}`]);
      }
    }
  }

  shuffle() {
    const { deck } = this;
    let m = deck.length, i;

    while(m){
      i = Math.floor(Math.random() * m--);
      [deck[m], deck[i]] = [deck[i], deck[m]];
    }
    return this;
  }

  deal() {
    return this.deck.pop();
  }
}

// 2. MAKE A BID / CHANGE CURRENT client

// 3. WAIT FOR CHECK()

// CHECK()
// 1. SUM ALL CARDS ON HANDS

// 2. CHECK FOR LAST BID

// 3. RESPONSE
