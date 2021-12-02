//Two is better than one
var test1_feature = {
  danceability: 0.521,
  energy: 0.702,
  key: 0,
  loudness: -5.189,
  mode: 1,
  speechiness: 0.0331,
  acousticness: 0.189,
  instrumentalness: 0,
  liveness: 0.0962,
  valence: 0.25,
  tempo: 127.976,
  duration_ms: 242840,
  time_signature: 4,
};

//Rap God
var test3_feature = {
  danceability: 0.708,
  energy: 0.843,
  key: 7,
  loudness: -2.66,
  mode: 1,
  speechiness: 0.314,
  acousticness: 0.397,
  instrumentalness: 0,
  liveness: 0.799,
  valence: 0.625,
  tempo: 148.14,
  duration_ms: 363521,
  time_signature: 4,
};

//We don't talk anymore
var test5_feature = {
  danceability: 0.728,
  energy: 0.563,
  key: 1,
  loudness: -8.053,
  mode: 0,
  speechiness: 0.134,
  acousticness: 0.621,
  instrumentalness: 0,
  liveness: 0.179,
  valence: 0.352,
  tempo: 100.017,
  duration_ms: 217707,
  time_signature: 4,
};

//How to save a life
var test7_feature = {
  danceability: 0.64,
  energy: 0.743,
  key: 10,
  loudness: -4.08,
  mode: 1,
  speechiness: 0.0379,
  acousticness: 0.269,
  instrumentalness: 0,
  liveness: 0.101,
  valence: 0.361,
  tempo: 122.035,
  duration_ms: 262533,
  time_signature: 4,
};

var song_2;
var fft_2;
var particles_2 = [];
var color_list = ["#001524", "#15616d", "#ffecd1", "#ff7d00", "#78290f"];
var features_2 = test7_feature; //Change here

if (features_2.key == 0) {
  color_list_c = ["#590d22", "#800f2f", "#ff4d6d", "#ff8fa3", "#ffccd5"];
}
if (features_2.key == 1) {
  color_list_c = ["#780116", "#c32f27", "#d8572a", "#db7c26", "#f7b538"];
}

if (features_2.key == 7) {
  color_list_c = ["#ff7b00", "#ff9500", "#ffaa00", "#ffd000", "#ffea00"];
}

if (features_2.key == 10) {
  color_list_c = ["#6f2dbd", "#a663cc", "#b298dc", "#b8d0eb", "#b9faf8"];
}

function preload() {
  song_2 = loadSound("../music_library/test7.mp3"); //Change here
}

function setup() {
  var canvas_2= createCanvas(600, 600);
  canvas_2.parent("song_2")
  angleMode(DEGREES);
  imageMode(CENTER);

  var button= document.querySelector("#button_2")
  button.addEventListener("click", (e) => {
    play_pause();
  });
  fft_2 = new p5.FFT();
}

function draw() {
  background(color_list[0]);
  stroke(color_list[1]);
  strokeWeight(3);
  noFill();
  smooth();

  translate(width / 2, height / 2);

  fft_2.analyze();
  amp_beat = fft_2.getEnergy(5, 200);
  amp_2 = fft_2.getEnergy(5, 100);
  amp = fft_2.getEnergy(101, 300); //Get the frequency betweeen 20~200 that are low frequencies
  amp_3 = fft_2.getEnergy(301, 500);
  amp_4 = fft_2.getEnergy(501, 700);
  amp_5 = fft_2.getEnergy(701, 1000);
  amp_5 = fft_2.getEnergy(1200, 1300);
  //console.log(amp)
  var wave = fft_2.waveform();

  //Add condition to generate particles
  var par_gen_threshold = 60 * parseFloat(features_2.speechiness) * 10;
  var par_gen_random = getRandomInt(60);
  if (par_gen_threshold > par_gen_random) {
    var p_2 = new Particle_2(features_2);
    particles_2.push(p_2);
  }

  for (var i = particles_2.length - 1; i >= 0; i--) {
    if (!particles_2[i].edges()) {
      particles_2[i].update(amp_beat > 220);
      particles_2[i].show();
    } else {
      particles_2.splice(i, 1);
    }
  }

  //Glow effect
  noStroke();

  fill(252, 246, 189, 4);
  for (i = 0; i < 80; i++) {
    ellipse(0, 0, (i * 3 * amp_5) / 120);
  }
  fill(255);
  stroke(0);

  pop();
  let c_1 = color(color_list_c[0]);
  fill(c_1);
  ellipse(0, 0, amp_2 + 90);
  noStroke();

  let c_2 = color(color_list_c[1]);
  fill(c_2);
  ellipse(0, 0, amp + 30);
  noStroke();

  let c_3 = color(color_list_c[2]);
  fill(c_3);
  ellipse(0, 0, amp_3 + 10);
  noStroke();

  let c_4 = color(color_list_c[3]);
  fill(c_4);
  ellipse(0, 0, amp_4 - 30);
  noStroke();

  let c_5 = color(color_list_c[4]);
  fill(c_5);
  ellipse(0, 0, amp_5 - 50);
  noStroke();

  push();
}

function play_pause() {
  console.log("here")
  if (song_2.isPlaying()) {
    song_2.pause();
    noLoop();
  } else {
    song_2.play();
    loop();
  }
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

class Particle_2 {
  constructor(features) {
    this.pos = p5.Vector.random2D().mult(40);
    this.vel = createVector(0, 0);
    this.acc = this.pos.copy().mult(random(0.0001, 0.000001));
    this.w = random(3, 20);
    //this.color=sample(color_list);
    this.color = [random(100, 255), random(150, 255), random(150, 255)];
    this.feature = parseInt(features.tempo);
  }
  edges() {
    if (
      this.pos.x < -width / 2 ||
      this.pos.x > width / 2 ||
      this.pos.y < -height / 2 ||
      this.pos.y > height / 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  update(cond) {
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    var adj_acc = Math.round(parseInt(this.feature) / 22);

    if (cond) {
      for (var i = 0; i < adj_acc; i++) {
        this.pos.add(this.vel);
      }
    }
  }
  show() {
    noStroke();
    fill(this.color);
    ellipse(this.pos.x, this.pos.y, 4);
  }
}
