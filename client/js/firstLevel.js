var firstLevel = new Phaser.Scene("First Level");

//Declaração de objetos
var player;
var platforms;
var skull;

var MUSIC_TitleOpening;

var php_bar;
var pmn_bar;
var psp_hud;
var bsp_hud;
var playerX;
var playerY;
var bhp_bar;
var psc_counter;
var cursors;
var gameOver = false;

//var game = new Phaser.Game(config);

//Declaração de variáveis de estado
var php = 5; //Define HP do Cavaleiro e Mago
var pmn = 3; //Define Mana do Mago
var bhp = 10; //Define HP do chefe

var MUSIC_TitleOpening_Time = 0; //Para tocar apenas uma vez quando inicia o jogo
var wasJumping = false; //Serve para tocar o som de aterrisagem, assim muda a variável e toca o som
var SFX_Hit;
var SFX_HitGround;
var SFX_HoverButton;
var SFX_Jump;
var SFX_Land;
var SFX_Parry;
var SFX_ParryHit;
var SFX_SpellCast;
var SFX_Step;

var parryTime = 0; //Define o tempo que pode manter o aparo
var parrying = false; //Define se está aparando ou não
var parryCooldown = 0; //Cooldown do aparo

var airSpeed = 0; //Aceleração no ar

var dodging = false; //Verifica se está esquivando
var dodgingTime = 0; //Tempo da duração da esquiva

var jumpTimer = 0; //Tempo no ar
var jumpTune = 0; //

var last_direction = "null"; //Verifica qual a última direção que o jogador se moveu

var p_attacking = false; //Verifica se o jogador está atacando
var p_lastAttack = "null"; //Informa o último ataque feito, se um certo tempo passar, se tornará nulo novamente
var p_attackTime = 0; //Informa o tempo que está na animação de ataque
var p_attackCooldown = 0; //Informa o tempo necessário para executar o próximo golpe

var p_justAttacked = false; //Se estiver verdadeiro, jogador não recebe dano
var p_attackedCooldown = 0; //Tempo até o jogador poder receber dano novamente

//Declarando teclas do jogo

//Cavaleiro
let keyA;
let keyS;
let keyD;
let keyW;
let keyJ;
let keyK;

//Ações Mago
let keyNum0;
let keyNum1;
let keyNum2;
let keyNum3;

//Direções Mago
let keyUp;
let keyDown;
let keyRight;
let keyLeft;

//PRELOAD
firstLevel.preload = function () {
  //Plano de fundo
  this.load.image("sky", "assets/images/sky.png");

  //Tileset e personagens
  this.load.image("ground", "assets/images/platform.png");

  this.load.spritesheet(
    "playerDefault",
    "assets/spritesheets/player_move.png",
    {
      frameWidth: 64,
      frameHeight: 64,
    }
  );
  this.load.spritesheet(
    "playerAttack",
    "assets/spritesheets/player_combo1.png",
    {
      frameWidth: 192,
      frameHeight: 128,
    }
  );
  this.load.spritesheet("P_Move1", "assets/spritesheets/P_Move1.png", {
    frameWidth: 240,
    frameHeight: 240,
  });

  //Projéteis
  this.load.spritesheet("p_spellOrb", "assets/spritesheets/p_spellOrb.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("skull", "assets/images/skull.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  //HUD principal
  this.load.spritesheet("PHP_Bar", "assets/hud/PHP_Bar.png", {
    frameWidth: 216,
    frameHeight: 216,
  });
  this.load.spritesheet("PSP_HUD", "assets/hud/PSP_HUD.png", {
      frameWidth: 216,
      frameHeight: 216,
  });
  this.load.spritesheet("PMN_Bar", "assets/hud/PMN_Bar.png", {
    frameWidth: 216,
    frameHeight: 216,
  });
  this.load.spritesheet("BHP_Bar", "assets/hud/BHP_Bar.png", {
    frameWidth: 512,
    frameHeight: 256,
  });
  this.load.spritesheet("BSP_HUD", "assets/hud/BSP_HUD.png", {
    frameWidth: 512,
    frameHeight: 256,
  });

  //Botões
  this.load.spritesheet("musicButton", "assets/hud/music_button.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("pausedButton", "assets/hud/paused_button.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("playButton", "assets/hud/play_button.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("soundButton", "assets/hud/sound_button.png", {
    frameWidth: 64,
    frameHeight: 64,
  });
  this.load.spritesheet("startButton", "assets/hud/start_button.png", {
    frameWidth: 64,
    frameHeight: 64,
  });

  //Áudio
  this.load.audio("MUSIC_TitleOpening", [
    "assets/music/MUSIC_TitleOpening.wav",
  ]);
  this.load.audio("SFX_Hit", ["assets/sfx/SFX_Hit.wav"]);
  this.load.audio("SFX_HitGround", ["assets/sfx/SFX_HitGround.wav"]);
  this.load.audio("SFX_HoverButton", ["assets/sfx/SFX_HoverButton.wav"]);
  this.load.audio("SFX_Jump", ["assets/sfx/SFX_Jump.wav"]);
  this.load.audio("SFX_Land", ["assets/sfx/SFX_Land.wav"]);
  this.load.audio("SFX_Parry", ["assets/sfx/SFX_Parry.wav"]);
  this.load.audio("SFX_ParryHit", ["assets/sfx/SFX_ParryHit.wav"]);
  this.load.audio("SFX_SpellCast", ["assets/sfx/SFX_SpellCast.wav"]);
  this.load.audio("SFX_Step", ["assets/sfx/SFX_Step.wav"]);
};

//CREATE
firstLevel.create = function () {
  this.cameras.main.setBounds(0, -150, 1000, 800);

  //Criando as teclas
  //Cavaleiro
  keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A); // A
  keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S); // S
  keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D); // D
  keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W); // W
  keyJ = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.J); // J
  keyK = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.K); // K

  //Mago
  keyNum0 = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.NUMPAD_ZERO
  ); // Num0
  keyNum1 = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE
  ); // Num1
  keyNum2 = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.NUMPAD_TWO
  ); // Num2
  keyNum3 = this.input.keyboard.addKey(
    Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE
  ); // Num3

  //Setas Direcionais do Mago
  keyUp = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP); // UP
  keyDown = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN); // DOWN
  keyRight = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT); // RIGHT
  keyLeft = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT); // LEFT

  //  A simple background for our game
  this.add.image(400, 300, "sky").setScale(8);

  //  The platforms group contains the ground and the 2 ledges we can jump on
  platforms = this.physics.add.staticGroup();

  //  Here we create the ground.
  //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
  platforms.create(400, 568, "ground").setScale(2).refreshBody();

  // The player and its settings
  player = this.physics.add.sprite(100, 450, "playerDefault")//.setScale(0.65);
  // player.setSize(100, 130, true);
  // player.setOffset(70, 54);

  //THE SKELETON APPEARS
  skull = this.physics.add.sprite(630, 350, "skull");
  this.physics.add.collider(skull, platforms);

  //Dano no jogador quando tocar na caveira
  this.physics.add.collider(skull, player, function (skull, player) {
    if (p_justAttacked === false && dodging === false) {
      SFX_Hit.play();
      php = php - 1;
      bhp = bhp - 1;
      p_justAttacked = true;
      p_attackedCooldown = 0;

      if (last_direction === "RIGHT") {
        player.setVelocityX(-300);
        player.setVelocityY(-350);
      } else if (last_direction === "LEFT") {
        player.setVelocityX(300);
        player.setVelocityY(-350);
      }
    }
  });

  //Player physics properties.
  player.setCollideWorldBounds(false);

  //Now let's create some ledges
  platforms.create(1500, 500, "ground").setScale(5).refreshBody();
  platforms.create(-400, 270, "ground").setScale(3).refreshBody();
  platforms.create(600, 150, "ground");
  platforms.create(125, 325, "ground");
  platforms.create(800, 410, "ground");

  //HUD do jogo
  php_bar = this.add.image(120, 45, "PHP_Bar", 0).setScrollFactor(0);
  psp_hud = this.add.sprite(120, 45, "PSP_HUD", 0).setScrollFactor(0);
  pmn_bar = this.add.image(120, 45, "PMN_Bar", 0).setScrollFactor(0);
  bhp_bar = this.add.image(575, 565, "BHP_Bar", 0).setScrollFactor(0);
  bhp_bar.visible = true;
  bsp_hud = this.add.sprite(575, 565, "BSP_HUD", 0).setScrollFactor(0);
  bsp_hud.visible = true;

  //Áudio do jogo
  MUSIC_TitleOpening = this.sound.add("MUSIC_TitleOpening", { loop: false });
  SFX_Hit = this.sound.add("SFX_Hit", { loop: false });
  SFX_HitGround = this.sound.add("SFX_HitGround", { loop: false });
  SFX_HoverButton = this.sound.add("SFX_HoverButton", { loop: false });
  SFX_Jump = this.sound.add("SFX_Jump", { loop: false });
  SFX_Land = this.sound.add("SFX_Land", { loop: false });
  SFX_Parry = this.sound.add("SFX_Parry", { loop: false });
  SFX_ParryHit = this.sound.add("SFX_ParryHit", { loop: false });
  SFX_SpellCast = this.sound.add("SFX_SpellCast", { loop: false });
  SFX_Step = this.sound.add("SFX_Step", { loop: false });

  this.cameras.main.startFollow(player);

  //ANIMAÇÕES DE HUD

  this.anims.create({
    key: "coreSpin",
    frames: this.anims.generateFrameNumbers("PSP_HUD", {
      start: 0,
      end: 7,
    }),
    frameRate: 10,
    repeat: -1,
  });

  this.anims.create({
    key: "bossCoreLoop",
    frames: this.anims.generateFrameNumbers("BSP_HUD", {
      start: 0,
      end: 11,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //ANIMAÇÕES DE MOVIMENTO
  //Anda Esquerda
  this.anims.create({
    key: "walkLeft",
    frames: this.anims.generateFrameNumbers("playerDefault", {
      start: 35,
      end: 42,
    }),
    frameRate: 17,
    repeat: -1,
  });

  //Anda Direita
  this.anims.create({
    key: "idleRight",
    frames: this.anims.generateFrameNumbers("playerDefault", { start: 0, end: 11 }),
    frameRate: 8,
    repeat: -1,
  });

  //Parado Esquerda
  this.anims.create({
    key: "idleLeft",
    frames: this.anims.generateFrameNumbers("playerDefault", { start: 12, end: 23 }),
    frameRate: 8,
    repeat: -1,
  });

  //Parado Direita
  this.anims.create({
    key: "walkRight",
    frames: this.anims.generateFrameNumbers("playerDefault", {
      start: 28,
      end: 34,
    }),
    frameRate: 17,
    repeat: -1,
  });

  //Salto Direita
  this.anims.create({
    key: "risingRight",
    frames: [{ key: "playerDefault", frame: 24 }],
    frameRate: 15,
  });

  //Queda Direita
  this.anims.create({
    key: "fallingRight",
    frames: [{ key: "playerDefault", frame: 26 }],
    frameRate: 15,
  });

  //Agacha Direita
  this.anims.create({
    key: "crouchingRight",
    frames: [{ key: "playerDefault", frame: 47 }],
    frameRate: 20,
  });

  //Agacha Esquerda
  this.anims.create({
    key: "crouchingLeft",
    frames: [{ key: "playerDefault", frame: 48 }],
    frameRate: 20,
  });

  //Salto Esquerda
  this.anims.create({
    key: "risingLeft",
    frames: [{ key: "playerDefault", frame: 25 }],
    frameRate: 15,
  });

  //Queda Esquerda
  this.anims.create({
    key: "fallingLeft",
    frames: [{ key: "playerDefault", frame: 27 }],
    frameRate: 15,
  });

  //Corre Direita
  this.anims.create({
    key: "sprintRight",
    frames: this.anims.generateFrameNumbers("playerDefault", {
      start: 49,
      end: 54,
    }),
    frameRate: 20,
    repeat: -1,
  });

  //Corre Esquerda
  this.anims.create({
    key: "sprintLeft",
    frames: this.anims.generateFrameNumbers("playerDefault", {
      start: 55,
      end: 59,
    }),
    frameRate: 20,
    repeat: -1,
  });

  //ANIMAÇÕES DEFENSIVAS

  //Aparo Direita
  this.anims.create({
    key: "parryRight",
    frames: [{ key: "playerDefault", frame: 70 }],
    frameRate: 20,
  });

  //Aparo Esquerda
  this.anims.create({
    key: "parryLeft",
    frames: [{ key: "playerDefault", frame: 71 }],
    frameRate: 20,
  });

  //Esquiva Direita
  this.anims.create({
    key: "dodgeRight",
    frames: this.anims.generateFrameNumbers("playerDefault", {
      start: 60,
      end: 64,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //Esquiva Esquerda
  this.anims.create({
    key: "dodgeLeft",
    frames: this.anims.generateFrameNumbers("playerDefault", {
      start: 65,
      end: 69,
    }),
    frameRate: 10,
    repeat: -1,
  });

  //ANIMAÇÕES OFENSIVAS

  //Combo 1 Direita
  this.anims.create({
    key: "combo1Right",
    frames: this.anims.generateFrameNumbers("playerAttack", {
      start: 0,
      end: 11,
    }),
    frameRate: 12,
    repeat: -1,
  });

  //Combo 1 Esquerda

  this.anims.create({
    key: "combo1Left",
    frames: this.anims.generateFrameNumbers("playerAttack", {
      start: 12,
      end: 24,
    }),
    frameRate: 12,
    repeat: -1,
  });

  //Combo 2 Direita
  this.anims.create({
    key: "combo2Right",
    frames: this.anims.generateFrameNumbers("playerAttack", {
      start: 25,
      end: 37,
    }),
    frameRate: 12,
    repeat: -1,
  });
  //Combo 2 Esquerda
  this.anims.create({
    key: "combo2Left",
    frames: this.anims.generateFrameNumbers("playerAttack", {
      start: 38,
      end: 50,
    }),
    frameRate: 12,
    repeat: -1,
  });

  //Combo 3 Direita
  this.anims.create({
    key: "combo3Right",
    frames: this.anims.generateFrameNumbers("playerAttack", {
      start: 51,
      end: 56,
    }),
    frameRate: 12,
    repeat: -1,
  });

  //Combo 3 Esquerda
  this.anims.create({
    key: "combo3Left",
    frames: this.anims.generateFrameNumbers("playerAttack", {
      start: 57,
      end: 62,
    }),
    frameRate: 12,
    repeat: -1,
  });

  //  Input Events
  cursors = this.input.keyboard.createCursorKeys(); //Informa que o jogo tem input das keys

  //  Collide the player and the stars with the platforms
  this.physics.add.collider(player, platforms);
};

//UPDATE
firstLevel.update = function () {
  playerX = player.body.x;
  playerY = player.body.y;

  if (MUSIC_TitleOpening_Time === 0) {
    MUSIC_TitleOpening.play();
    MUSIC_TitleOpening_Time = 1;
  }

  if (gameOver) {
    return;
  }

  //Cooldown para receber dano
  if (p_attackedCooldown <= 10) {
    p_attackedCooldown = p_attackedCooldown + 1;
  } else {
    p_justAttacked = false;
  }

  skull.setVelocityX(0);
  skull.setVelocityY(0);

  //HUD CÓDIGO

  if (php >= 1) {
    psp_hud.anims.play("coreSpin", true);    
  }

  if (bhp >= 1){
    bsp_hud.anims.play("bossCoreLoop", true);
  }

  if (php === 5) {
    //Vitalidade do Cavaleiro e do Mago HUD
    php_bar.setFrame(0);
  } else if (php === 4) {
    php_bar.setFrame(1);
  } else if (php === 3) {
    php_bar.setFrame(2);
  } else if (php === 2) {
    php_bar.setFrame(3);
  } else if (php === 1) {
    php_bar.setFrame(4);
  } else if (php <= 0) {
    psp_hud.setFrame(8);
  }

  if (pmn === 3) {
    //Mana do Mago HUD
    pmn_bar.setFrame(0);
  } else if (pmn === 2) {
    pmn_bar.setFrame(1);
  } else if (pmn === 1) {
    pmn_bar.setFrame(2);
  } else if (pmn === 0) {
    pmn_bar.setFrame(3);
  }
  
  if (bhp === 10) {
    bhp_bar.setFrame(10);
  } else if (bhp === 9) {
    bhp_bar.setFrame(9);
  } else if (bhp === 8) {
    bhp_bar.setFrame(8);
  } else if (bhp === 7) {
    bhp_bar.setFrame(7);
  } else if (bhp === 6) {
    bhp_bar.setFrame(6);
  } else if (bhp === 5) {
    bhp_bar.setFrame(5);
  } else if (bhp === 4) {
    bhp_bar.setFrame(4);
  } else if (bhp === 3) {
    bhp_bar.setFrame(3);
  } else if (bhp === 2) {
    bhp_bar.setFrame(2);
  } else if (bhp === 1) {
    bhp_bar.setFrame(1);
  } else if (bhp <= 0) {
    bsp_hud.setFrame(12);
  }

  //SALTO
  if (keyW.isDown && dodging == false && parrying == false) {
    if (jumpTimer === 0 && player.body.touching.down) {
      //jumpTimer verifica o tempo que o jogador está no ar

      SFX_Jump.play();
      player.setVelocityY(-350); //Altura inicial do salto
      jumpTimer = 1; //Inicia o jumpTimer
    } else if (jumpTimer > 0 && jumpTimer <= 20) {
      //Enquanto o jumpTimer estiver entre 1 e 20, vai adicionar 1 ao jumpTimer e à cada verificação vai alterar a velocidade do Y

      jumpTimer = jumpTimer + 1;
      jumpTune = -350 + jumpTimer * 4; //Assim, a cada jumpTimer, a velocidade será diminuida por um fator 4 em relação ao timer, tudo isso se segurar o W e o time for menor que 20
      player.setVelocityY(jumpTune);
    }
  } else {
    jumpTimer = 0;
  }

  //Verifica se a velocidade horizontal do jogador está direcionada à direita, o que altera a variável last_direction
  if (player.body.velocity.x > 0) {
    last_direction = "RIGHT";
  }

  //Verifica se a velocidade horizontal do jogador está direcionada à esquerda, o que altera a variável last_direction
  if (player.body.velocity.x < 0) {
    last_direction = "LEFT";
  }

  //NO CHÃO
  if (player.body.touching.down) {
    if (wasJumping === true) {
      SFX_Land.play();
      wasJumping = false;
    }

    // player.setSize(100, 130, true);
    // player.setOffset(70, 54);

    if (dodgingTime > 25) {
      //COOLDOWN DA EVASÃO
      dodging = false;
      dodgingCooldown = dodgingCooldown + 1;

      if (dodgingCooldown >= 50) {
        //Cooldown para se esquivar
        dodgingTime = 0;
      }
    }

    //EVASÃO
    if (keyK.isDown || dodging === true) {
      if (dodgingTime <= 25) {
        //Enquanto o tempo de esquiva não houver passado
        parryTime = 0;
        parrying = false;
        dodging = true;
        dodgingCooldown = 0;
        dodgingTime = dodgingTime + 1;

        if (last_direction === "RIGHT") {
          player.anims.play("dodgeRight", true);
          player.setVelocityX(500);
        }

        if (last_direction === "LEFT") {
          player.anims.play("dodgeLeft", true);
          player.setVelocityX(-500);
        }
      } else {
        dodging = false;
      }
    }

    //Evasão tem prioridade máxima
    if (dodging === false) {
      if (parryTime > 25) {
        //COOLDOWN DO APARO
        parrying = false;
        parryCooldown = parryCooldown + 1;

        if (parryCooldown >= 50) {
          parryTime = 0;
        }
      }

      //APARO
      if (keyNum0.isDown || (parrying === true && p_justAttacked === false)) {
        if (pmn >= 1) {
          if (parryTime === 1) {
            SFX_Parry.play();
          }
          if (parryTime === 25) {
            pmn = pmn - 1;
          }

          if (parryTime <= 25) {
            //Enquanto o tempo de aparo não houver passado
            parrying = true;
            parryCooldown = 0;
            parryTime = parryTime + 1;
            player.setVelocityX(0);

            if (last_direction === "RIGHT") {
              player.anims.play("parryRight");
            }

            if (last_direction === "LEFT") {
              player.anims.play("parryLeft");
            }
          }
        } else {
          parrying = false;
        }
      }

      if (parrying === false) {
        //Andar e Correr ESQUERDA
        if (keyA.isDown && p_justAttacked === false && p_attacking === false) {
          if (cursors.shift.isDown) {
            player.setVelocityX(-300);
            player.anims.play("sprintLeft", true);
          } else {
            player.setVelocityX(-160);
            player.anims.play("walkLeft", true);
          }
        } else if (
          keyD.isDown &&
          p_justAttacked === false &&
          p_attacking === false
        ) {
          if (cursors.shift.isDown) {
            player.setVelocityX(300);
            player.anims.play("sprintRight", true);
          } else {
            player.setVelocityX(160);
            player.anims.play("walkRight", true);
          }
        }

        //Se estiver parado no chão

        //ATAQUE
        else if (keyJ.isDown && dodging === false && parrying === false) {
          if (p_lastAttack === "null") {
            p_attacking = true;
            p_attackTime = 0;
            p_attackCooldown = 0;
            p_lastAttack = "null";

            if (last_direction === "RIGHT") {
              player.anims.play("combo1Right", true);
              player.setVelocityX(25);
            } else if (last_direction === "LEFT") {
              player.anims.play("combo1Left", true);
              player.setVelocityX(-25);
            }
          }
        } else if (p_justAttacked === false) {
          player.setVelocityX(0);

          //A variável last_direction serve para checar para qual direção o jogador estava olhando antes de soltar os botões LEFT e RIGHT,
          //Assim podemos usar sprites de IDLE diferentes

          //Verifica se está apertando S para agachar
          if (keyS.isDown) {
            //Muda a hitbox do personagem para ficar devidamente agachado
            //player.setSize(49, 34, true);
            //player.setOffset(7, 30);

            //Agachado para direita
            if (last_direction === "RIGHT") {
              player.anims.play("crouchingRight", true);
            }

            //Agachado para esquerda
            else if (last_direction === "LEFT") {
              player.anims.play("crouchingLeft", true);
            }
          }

          //Se não estiver segurando o S para se agachar
          else {
            //Parado para direita
            if (last_direction === "RIGHT") {
              player.anims.play("idleRight", true);
            }

            //Parado para esquerda
            if (last_direction === "LEFT") {
              player.anims.play("idleLeft", true);
            }
          }
        }
      }
    }
  }

  if (player.body.touching.down === false) {
    //NO AR
    wasJumping = true;
    dodging = false;
    parrying = false;

    //Checa se o jogador está indo para CIMA e aplica respectivas animações
    if (p_attackedCooldown <= 25 || p_justAttacked === false) {
      //PARA O KNOCKBACK DOS ATAQUES

      if (player.body.velocity.y < 0 && last_direction === "RIGHT") {
        player.anims.play("risingRight");
      }

      if (player.body.velocity.y < 0 && last_direction === "LEFT") {
        player.anims.play("risingLeft");
      }

      //Checa se o jogador está indo para BAIXO e aplica respectivas animações
      if (player.body.velocity.y > 0 && last_direction === "RIGHT") {
        player.anims.play("fallingRight");
      }

      if (player.body.velocity.y > 0 && last_direction === "LEFT") {
        player.anims.play("fallingLeft");
      }
    }

    //Define a aceleração do jogador no ar, para que não se movimente livremente fora do chão [DIREITA]
    if (keyD.isDown && player.body.velocity.x <= 200) {
      airSpeed = player.body.velocity.x + 5;
      player.setVelocityX(airSpeed);
    }

    //Define a aceleração do jogador no ar, para que não se movimente livremente fora do chão [ESQUERDA]
    if (keyA.isDown && player.body.velocity.x >= -200) {
      airSpeed = player.body.velocity.x - 5;
      player.setVelocityX(airSpeed);
    }
  }
};

export { firstLevel };