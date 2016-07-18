<template>
  <div id="app">
    <input type="text" name="player_name" placeholder="Your Name" v-model="playerName">
    <button type="button" name="button" v-on:click="createRoom">Create Room</button>
    <ul>
      <li v-for="room in rooms">
        vs {{ room.firstPlayerSocketId }}
        <button type="button" name="button" v-on:click="enterRoom(room)">Enter room</button>
      </li>
    </ul>
    <div class="match">
      <div class="">
        You: {{ playerName }}
      </div>
      <div class="">
        initiativePlayer: {{room.stateManager.gameState.initiativePlayer}}
      </div>
      <div class="">
        firstPlayer: {{ room.firstPlayerSocketId }}
      </div>
      <div class="">
        secondPlayer: {{room.secondPlayerSocketId}}
      </div>
      <div class="">
        movePower: {{room.stateManager.gameState.movePower}}
      </div>
      <div class="" v-for="row in [1,2,3,4,5,6]">
        <span v-for="column in [1,2,3,4,5,6]"
                v-on:click="onClickCell(row, column)"
                v-bind:class="getCellClass(row, column)">
          {{ getCellText(row, column) }}
        </span>
      </div>
    </div>
    <hello></hello>
  </div>
</template>

<script>
import Hello from './components/Hello'
import Room from './components/Room'

export default {
  sockets: {
    connect(){
      console.log('socket connected');
      this.playerName = this.$socket.id;
    },
    start_match(room){
      console.log('on start_match');
      console.log(room);
      this.room = room;
    },
    moved(room){
      console.log('on moved');
      console.log(room);
      this.room = room;
    },
    game_end(){
      console.log('on game_end');
    },
    waiting_rooms(rooms){
      console.log('on waiting rooms');
      console.log(rooms);
      this.rooms = rooms;
    }
  },
  data(){
    return {
      rooms: [],
      room: {
        firstPlayerSocketId: 'first',
        secondPlayerSocketId: 'second',
      },
      playerName: ''
    };
  },
  components: {
    Hello
  },
  ready(){
  },
  methods: {
    createRoom(){
      this.$socket.emit('create_room', this.playerName);
    },
    enterRoom(room){
      this.$socket.emit('enter_room', room.roomId);
    },
    getCellText(row, column){
      if (!this.room.stateManager){
        return '';
      }
      if (row === 0 || column === 0){
        return '';
      }
      const die = this.room.stateManager.gameState.board[row][column].die;
      if (die === null){
        return 'x';
      }else{
        return die.dots;
      }
    },
    getCellClass(row, column){
      if (!this.room.stateManager){
        return '';
      }
      const die = this.room.stateManager.gameState.board[row][column].die;
      if(die.player === 0/*first player*/){
        return 'first-player';
      }else if (die.player === 1 /*second player*/){
        return 'second player';
      }
      return '';
    },
    onClickCell(row, column){
      console.log(row, ',', column);
      this.$socket.emit('move', this.room.stateManager.gameState.board[row][column]);
    }
  }
}
</script>

<style>
html {
  height: 100%;
}

body {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}

#app {
  color: #2c3e50;
  margin-top: -100px;
  max-width: 600px;
  font-family: Source Sans Pro, Helvetica, sans-serif;
  text-align: center;
}

#app a {
  color: #42b983;
  text-decoration: none;
}

.logo {
  width: 100px;
  height: 100px
}

.first-player {
  color: red;
}

.second-player {
  color: blue;
}
</style>
