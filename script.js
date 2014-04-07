window.onload=function(){
  // Page
  setName();
  var level=0;
  var health=100;
  var playerLevel = document.getElementById("myLevel");
  var playerHealth = document.getElementById("myHealth");
  var bit = 64;
  var grid_side = 10;

  // Player
  var player_x = 1;
  var player_y = 2;
  var player=Sprite.player.right;

  // Canvas
  var canvas = document.getElementById("myCanvas");
  var context = canvas.getContext("2d");
  context.mozImageSmoothingEnabled = false;
  context.webkitImageSmoothingEnabled = false;

  // Image Sprites
  var sprite = new Image();
  sprite.src = "game_sprite.png"
  sprite.addEventListener('load', eventSheetLoaded, false);

  var symbol = new Image();
  symbol.src = "symbol1.png"
  symbol.addEventListener('load', eventSheetLoaded, false);

  // Map
  var map = Map.grid_0_0
  
  var animationFrames = [1,2,3,4,5,6,7,8,9,10]
  var frameIndex = 0;
  var animDir = -1;

  window.onkeypress = function(e){
    var x=player_x;
    var y=player_y;
    switch (e.keyCode){
      case 119:
        if (player_y>0){y=player_y-1}
        else if(player_y == 0){
          if(map == Map.grid_0_m1 && Map.grid_0_m2.terrain[grid_side][player_x]!=1){map = Map.grid_0_m2;y=grid_side;}
          else if(map == Map.grid_0_0 && Map.grid_0_m1.terrain[grid_side][player_x]!=1){map = Map.grid_0_m1;y=grid_side;}
          else if (map == Map.grid_0_1 && Map.grid_0_0.terrain[grid_side][player_x]!=1){map = Map.grid_0_0;y=grid_side;}
        }
        player = Sprite.player.up;
        break;
      case 100:
        if (player_x<grid_side){x=player_x+1}
        else if(player_x==grid_side){
          if(map == Map.grid_m1_0 && Map.grid_0_0.terrain[player_y][0]!=1){map = Map.grid_0_0;x=0;}
        }
        player = Sprite.player.right;
        break;
      case 115:
        if (player_y<grid_side){y=player_y+1}
        else if(player_y == grid_side){
          if (map == Map.grid_0_m2 && Map.grid_0_m1.terrain[0][player_x]!=1){map = Map.grid_0_m1;y=0;}
          else if (map == Map.grid_0_m1 && Map.grid_0_0.terrain[0][player_x]!=1){map = Map.grid_0_0;y=0;}
          else if (map == Map.grid_0_0 && Map.grid_0_1.terrain[0][player_x]!=1){map = Map.grid_0_1;y=0;}
        }
        player = Sprite.player.down;
        break;
      case 97:
        if (player_x>0){x=x-1}
        else if(player_x==0){
          if(map == Map.grid_0_0 && Map.grid_m1_0.terrain[player_y][grid_side]!=1){map = Map.grid_m1_0;x=grid_side;}
        }
        player = Sprite.player.left;
        break;
      case 32:
        attack();
        break;
    }

    if (map.terrain[y][x]!=1){
      player_x=x;
      player_y=y;
    }

    drawScreen(player); 
    
  }

  function eventSheetLoaded(){
    gameLoop();
  }

  function gameLoop(){
    window.setTimeout(gameLoop,100);
    drawScreen();
  }
  

  function attack(){
    var direction = playerDirection();
    if (((player_x+direction[0])>=0&&(player_x+direction[0])<=grid_side)&&((player_y+direction[1])>=0&&(player_y+direction[1])<=grid_side)){
      if (map.terrain[player_y+direction[1]][player_x+direction[0]]==1){
        map.terrain[player_y+direction[1]][player_x+direction[0]]=0;
        drawScreen();
      }
    }
  }

  function drawScreen(){
    if (frameIndex%9==0){animDir*=-1}
    frameIndex=frameIndex+animDir;
    if (map.terrain[player_y][player_x]==3){health-=5}
    if (health>0){
      if(frameIndex==0&&health<100&&map==Map.grid_m1_0){
        health+=0.5;
      }
      playerLevel.innerText=level;
      playerHealth.innerText=Math.floor(health)+"%";
      updateView();

    } else {
      playerLevel.innerText=level;
      playerHealth.innerText=0+"%";
      context.fillStyle="#60aa30";
      context.fillRect(0,0,canvas.width,canvas.height);
      context.fillStyle="#000000";
      context.fillRect(0,200,canvas.width,200);
      context.fillStyle="#808080";
      context.font = "20px 'Press Start 2P'";
      context.textBaseline='top';
      context.fillText("You Died",250,300);
    }

  }

  function updateView(){
      context.fillStyle="#60aa30";
      context.fillRect(0,0,canvas.width,canvas.height);
      drawTerrain();
      drawSymbols();
      placeRoad();
      placeItems();
      placeBuildings();
      placePeople();
      drawScaled(sprite, player,player_x,player_y);
  }

  function placeRoad(){
    if (map.road!=undefined){
      for(var i=0;i<=grid_side;i++){
        for(var j=0;j<=grid_side;j++){
          if (map.road[j][i]==1){
            drawScaled(sprite, Sprite.road,i,j);
          }
        }
      }
    }
  }
  function placeItems(){
    if (map.items!=undefined){
      for(var i=0;i<=grid_side;i++){
        for(var j=0;j<=grid_side;j++){
          if (map.items[j][i]==1){
            drawScaled(sprite, Sprite.items.sword,i,j);
          }
        }
      }
    }
  }
  function drawTerrain(){
    for(var i=0;i<=grid_side;i++){
      for(var j=0;j<=grid_side;j++){
        if (map.terrain[j][i]==0){drawScaled(sprite, Sprite.terrain.grass,i,j)}
        else if (map.terrain[j][i]==1){drawScaled(sprite, Sprite.terrain.grass,i,j);drawScaled(sprite, Sprite.terrain.tree,i,j)} 
        else if (map.terrain[j][i]==2){drawScaled(sprite, Sprite.terrain.ash,i,j)} 
        else if (map.terrain[j][i]==3){drawScaled(sprite, Sprite.terrain.lava,i,j)}
        else if (map.terrain[j][i]==4){drawScaled(sprite, Sprite.terrain.snow,i,j)}
        else if (map.terrain[j][i]==5){drawScaled(sprite, Sprite.terrain.ice,i,j)}
      }
    }
  }
  function drawSymbols(){
    if (map.symbols!=undefined){
      for(var i=0;i<=grid_side;i++){
        for(var j=0;j<=grid_side;j++){
          if (map.symbols[j][i]==1){
            drawScaled(symbol, Symbols.one,i,j);
          }
        }
      }
    }
  }
  function placeBuildings(){
    if (map.buildings!=undefined){
      for(var i=0;i<=grid_side;i++){
        for(var j=0;j<=grid_side;j++){
          if (map.buildings[j][i]==1){
            drawScaled(sprite, Sprite.buildings.house,i,j);
          }
        }
      }
    }
  }
  function placePeople(){
    if (map.people!=undefined){
      for(var i=0;i<=grid_side;i++){
        for(var j=0;j<=grid_side;j++){
          if (map.people[j][i]==1){drawScaled(sprite, Sprite.people.person1,i,j)}
          else if (map.people[j][i]==2){drawScaled(sprite, Sprite.people.person2,i,j)}
          else if (map.people[j][i]==3){drawScaled(sprite, Sprite.people.person3,i,j)}
        }
      }
    }
  }

  function setName(){
    var names = ["Eturn", "Phays", "Vesshy", "Lerat", "Chaen", "Entony", "Usk'ate", "Warn", "Quaum", "Achlyekal", "Rynine", "Banr", "Ceorm", "Engrakos", "Nyeld", "Moswar", "Itona", "Llus", "Ryh", "Nyrum", "Riline", "Qua'cheu", "Bur'ade", "Brapol", "Emvor", "Kinaughe", "Nalscha", "Angol", "Rad'mora", "Shynt", "Anerche", "Tasache", "Pekel", "Undenn", "Aw'isa", "Alelt", "Huorit", "Lyeasor", "Bromoraw", "Queenser", "Ackler", "Garuld", "Rischa", "Uime", "Bantor", "Taiyl", "Kingmor", "Aldom", "As'orm", "Romris", "Shoust", "Urnmos", "Ekima", "Hualeang", "Xymiha", "Crysul", "Ingenge", "Gharisest", "Tiadan", "Sikyrym", "Kimelm", "Ormom", "Sheelsul", "Torineechkaldan", "Skeldelo", "Ormena", "Emroth", "Eldd", "Estover", "Inether", "Oldw", "Zheyd", "Kotyp", "Odela", "Ardxar", "Honenver", "Hinuage", "Schyenth", "Regar", "Atino", "Ashiss", "Y'toren", "Tontiad", "Sulxis", "Kauntin", "Usk'age", "Lypetu", "Asque", "Rodsulshy", "Angild", "Mor'end", "Lyehin", "Ettin", "Uskeess", "Delranler", "Tia'dar", "Therbust", "Tonchekin", "Kelrod", "Delall", "Heirran", "As-osir", "Enurn", "Dynnt", "Aengy", "Aughld", "Byos", "Ciech", "Elmerr", "Atori", "Zaque", "Quakelver", "Ack'tia", "Asoaw", "Noliku", "Garldra", "Osys", "Skelkinend", "Kalper"]
    var index=Math.floor(Math.random()*names.length);
    var title = document.getElementById("name");
    title.innerText=names[index];
  }

  function drawScaled(spr, element, dx, dy){
    var sx = element[0];
    var sy = element[1];
    var sw = element[2];
    var sh = element[3];
    if (element == Symbols.one){
      context.drawImage(spr, sx*bit, (sy+3*frameIndex)*bit, sw*bit, sh*bit, dx*bit, dy*bit, sw*bit, sh*bit)
    } else {
      context.drawImage(spr, sx*bit, sy*bit, sw*bit, sh*bit, dx*bit, dy*bit, sw*bit, sh*bit)
    }
  }

  function playerDirection(){
    switch (player){
      case Sprite.player.up:
        return [0,-1];
        break;
      case Sprite.player.right:
        return [1,0];
        break;
      case Sprite.player.down:
        return [0,1];
        break;
      case Sprite.player.left:
        return [-1,0];
        break;
    }
  }

}

