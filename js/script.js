/*------------------------*/
// 初期値としてnameを設定
var FrameSetValue = "set_A";
var src2 = "img/frame/frame_A.png";
var frameStyle = "styleA";
// nameの値を変更する関数
function changeFrameSet(changeFrameSet) {
  FrameSetValue = changeFrameSet;
  $(".frameSetArea").show();
  if (FrameSetValue === "set_A") {
    document.getElementById("bg_img").src = "img/frame/frame_A.png";

    document.getElementById("frameSetImgA").src = "img/FrameAY.png";
    document.getElementById("frameSetImgB").src = "img/FrameAX.png";

    src2 = "img/frame/frame_A.png";
    frameStyle = "styleA";
    console.log(frameStyle);
  } else if (FrameSetValue === "set_B") {
    document.getElementById("bg_img").src = "img/frame/frame_B.png";
    document.getElementById("frameSetImgA").src = "img/FrameBY.png";
    document.getElementById("frameSetImgB").src = "img/FrameBX.png";
    src2 = "img/frame/frame_B.png";
    frameStyle = "styleB";
    console.log(frameStyle);
  } else if (FrameSetValue === "set_C") {
    document.getElementById("bg_img").src = "img/frame/frame_C.png";
    document.getElementById("frameSetImgA").src = "img/FrameCY.png";
    document.getElementById("frameSetImgB").src = "img/FrameCX.png";
    src2 = "img/frame/frame_C.png";
    frameStyle = "styleC";
    console.log(frameStyle);
  } else if (FrameSetValue === "set_D") {
    document.getElementById("bg_img").src = "img/frame/frame_D.png";
    document.getElementById("frameSetImgA").src = "img/FrameDY.png";
    document.getElementById("frameSetImgB").src = "img/FrameDX.png";
    src2 = "img/frame/frame_D.png";
    frameStyle = "styleD";
    console.log(frameStyle);
  }
}
/*------------------------*/

const bg_img = document.getElementById("bg_img");
bg_img.src = src2;

var video = document.getElementById("video");
video.style.display = "none";
var canvas = document.getElementById("sourceCanvas");
canvas.style.transform = "rotateY(180deg)";
var context = canvas.getContext("2d");

const welcomeButton = $("#welcome");
welcomeButton.on("click", function () {
  navigator.getUserMedia =
    navigator.getUserMedia || navigator.webkitGetUserMedia;
  navigator.getUserMedia(
    { video: true, audio: false },
    function (stream) {
      video.srcObject = stream;
      draw();
    },
    function () {}
  );
});

var draw = function () {
  var canvasHeight = canvas.height;
  var videoWidth = video.videoWidth;
  var videoHeight = video.videoHeight;
  var videoAspectRatio = videoWidth / videoHeight;
  var canvasWidth = canvasHeight * videoAspectRatio;
  context.drawImage(
    video,
    -(canvasWidth / 4) + 5,
    0,
    canvasWidth,
    canvasHeight
  );
  chromaKey();
  requestAnimationFrame(draw);
};

var chromaKeyColor = { r: 66, g: 215, b: 66 };
var colorDistance = 100;

// 設定の読み込み
var savedColor = localStorage.getItem("chromaKeyColor");
var savedDistance = localStorage.getItem("colorDistance");
if (savedColor) {
  chromaKeyColor = JSON.parse(savedColor);
}
if (savedDistance) {
  colorDistance = parseInt(savedDistance);
}

// 設定の初期化
var color = document.getElementById("color");
color.value = rgb2color(chromaKeyColor);

var distance = document.getElementById("distance");
distance.value = colorDistance;

// イベントリスナーの追加
color.addEventListener("change", function () {
  chromaKeyColor = color2rgb(this.value);
  localStorage.setItem("chromaKeyColor", JSON.stringify(chromaKeyColor));
});

distance.style.textAlign = "right";
distance.addEventListener("change", function () {
  colorDistance = parseInt(this.value);
  localStorage.setItem("colorDistance", colorDistance);
});

// 色の変換関数
function color2rgb(color) {
  color = color.replace(/^#/, "");
  return {
    r: parseInt(color.substr(0, 2), 16),
    g: parseInt(color.substr(2, 2), 16),
    b: parseInt(color.substr(4, 2), 16),
  };
}

function rgb2color(rgb) {
  return (
    "#" +
    ((1 << 24) | (rgb.r << 16) | (rgb.g << 8) | rgb.b).toString(16).slice(1)
  );
}

var chromaKey = function () {
  var imageData = context.getImageData(0, 0, canvas.width, canvas.height),
    data = imageData.data;
  for (var i = 0, l = data.length; i < l; i += 4) {
    var target = { r: data[i], g: data[i + 1], b: data[i + 2] };
    if (getColorDistance(chromaKeyColor, target) < colorDistance) {
      data[i + 3] = 0;
    }
  }
  context.putImageData(imageData, 0, 0);
};

var getColorDistance = function (rgb1, rgb2) {
  return Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );
};

const sourceCanvas = document.getElementById("sourceCanvas");
const sourceContext = sourceCanvas.getContext("2d");
const destinationCanvases = document.getElementById("destinationCanvases");
let copyCount = 0;

var countdownInterval;
var count = 0;

function takePicture() {
  var countdown = 10;
  $(".result").css("display", "none");
  $(".first_greeting").css("display", "none");

  // Reset countdown value and styling
  $("#current_time").text(countdown).css("color", "black");
  $("#finish").hide();

  countdownInterval = setInterval(function () {
    countdown--;

    // Update countdown value
    $("#current_time").text(countdown);

    if (countdown <= 3) {
      // Change color to red when countdown is less than or equal to 3
      $("#current_time").css("color", "blue");
    }

    if (countdown <= 0) {
      // Stop countdown
      clearInterval(countdownInterval);

      //take a picture
      const destinationWidth = Math.floor(sourceCanvas.width);
      const destinationHeight = Math.floor(sourceCanvas.height);
      const canvas = document.createElement("canvas");
      canvas.width = destinationWidth;
      canvas.height = destinationHeight;
      canvas.id = `destinationCanvas${copyCount}`;
      copyCount++;
      const context = canvas.getContext("2d");
      context.drawImage(
        sourceCanvas,
        0,
        0,
        destinationWidth,
        destinationHeight
      );

      const frame2Image = new Image();
      frame2Image.src = src2;
      frame2Image.onload = function () {
        context.save(); // 現在の描画状態を保存

        // 画像を左右反転させるために座標系を反転させる
        context.translate(canvas.width, 0);
        context.scale(-1, 1);
        // 反転後の座標で画像を描画
        context.drawImage(
          frame2Image,
          0,
          0,
          destinationWidth,
          destinationHeight
        );
        context.drawImage(
          sourceCanvas,
          0,
          0,
          destinationWidth,
          destinationHeight
        );
        context.restore(); // 描画状態を元に戻す
        destinationCanvases.appendChild(canvas);
      };

      // Increment count
      count++;
      $("#count").text(count + 1);

      // Show the "finish" message
      $("#finish").show();

      // Change color based on count
      if (count === 1) {
        if (FrameSetValue === "set_A") {
          src2 = "img/frame/frame_A.png";
        } else if (FrameSetValue === "set_B") {
          src2 = "img/frame/frame_B.png";
        } else if (FrameSetValue === "set_C") {
          src2 = "img/frame/frame_C.png";
        } else if (FrameSetValue === "set_D") {
          src2 = "img/frame/frame_D.png";
        }
        bg_img.src = src2;
        startAnimation();
      } else if (count === 2) {
        if (FrameSetValue === "set_A") {
          src2 = "img/frame/frame_A.png";
        } else if (FrameSetValue === "set_B") {
          src2 = "img/frame/frame_B.png";
        } else if (FrameSetValue === "set_C") {
          src2 = "img/frame/frame_C.png";
        } else if (FrameSetValue === "set_D") {
          src2 = "img/frame/frame_D.png";
        }
        startAnimation();
        bg_img.src = src2;
      } else if (count === 3) {
        if (FrameSetValue === "set_A") {
          src2 = "img/frame/frame_A.png";
        } else if (FrameSetValue === "set_B") {
          src2 = "img/frame/frame_B.png";
        } else if (FrameSetValue === "set_C") {
          src2 = "img/frame/frame_C.png";
        } else if (FrameSetValue === "set_D") {
          src2 = "img/frame/frame_D.png";
        }
        startAnimation();
        bg_img.src = src2;
      } else if (count === 4) {
        if (FrameSetValue === "set_A") {
          src2 = "img/frame/frame_A.png";
        } else if (FrameSetValue === "set_B") {
          src2 = "img/frame/frame_B.png";
        } else if (FrameSetValue === "set_C") {
          src2 = "img/frame/frame_C.png";
        } else if (FrameSetValue === "set_D") {
          src2 = "img/frame/frame_D.png";
        }
        startAnimation();
        bg_img.src = src2;
      } else if (count >= 5) {
        $("#next").hide();
        $("#btn2").show();
        $("#count").text(5);
      }

      // Copy canvas1 to canvas2
      $(".result").css("display", "block");
      $(".result_photo").css("display", "block");
      var result_canvas = document.getElementById("result_canvas");
      var result_ctx = result_canvas.getContext("2d");
      result_ctx.drawImage(
        sourceCanvas,
        0,
        0,
        result_canvas.width,
        result_canvas.height
      );

      result_ctx.save(); // 現在の描画状態を保存

      // 画像を左右反転させるために座標系を反転させる
      result_ctx.translate(result_canvas.width, 0);
      result_ctx.scale(-1, 1);
      // 反転後の座標で画像を描画
      result_ctx.drawImage(
        frame2Image,
        0,
        0,
        result_canvas.width,
        result_canvas.height
      );
      result_ctx.drawImage(
        sourceCanvas,
        0,
        0,
        result_canvas.width,
        result_canvas.height
      );
      result_ctx.restore(); // 描画状態を元に戻す

      // Change color back to black after 2 seconds
      $(".flash_light").show();
      setTimeout(function () {
        $(".flash_light").fadeOut(200, function () {
          $(this).hide();
        });
      }, 300);
    }
  }, 1100); //本番は1100
}
/*-------------------------------*/
$("#btn1").click(function () {
  takePicture();
  Timer = new radialTimer();
  Timer.init("timer", 10);
});
/*--------------------------------*/
function radialTimer() {
  var self = this;

  this.seconds = 0;
  this.count = 0;
  this.degrees = 0;
  this.interval = null;
  this.timerHTML =
    "<div class='n'></div><div class='slice'><div class='q'></div><div class='pie r'></div><div class='pie l'></div></div>";
  this.timerContainer = null;
  this.number = null;
  this.slice = null;
  this.pie = null;
  this.pieRight = null;
  this.pieLeft = null;
  this.quarter = null;

  this.init = function (e, s) {
    self.timerContainer = $("#" + e);
    self.timerContainer.html(self.timerHTML);

    self.number = self.timerContainer.find(".n");
    self.slice = self.timerContainer.find(".slice");
    self.pie = self.timerContainer.find(".pie");
    self.pieRight = self.timerContainer.find(".pie.r");
    self.pieLeft = self.timerContainer.find(".pie.l");
    self.quarter = self.timerContainer.find(".q");

    // start timer
    self.start(s);
  };

  this.start = function (s) {
    self.seconds = s;
    self.interval = window.setInterval(function () {
      self.number.html(self.seconds - self.count);
      self.count++;

      if (self.count > self.seconds - 1) clearInterval(self.interval);

      self.degrees = self.degrees + 360 / self.seconds;
      if (self.count >= self.seconds / 2) {
        self.slice.addClass("nc");
        if (!self.slice.hasClass("mth"))
          self.pieRight.css({ transform: "rotate(180deg)" });
        self.pieLeft.css({ transform: "rotate(" + self.degrees + "deg)" });
        self.slice.addClass("mth");
        if (self.count >= self.seconds * 0.75) self.quarter.remove();
      } else {
        self.pie.css({ transform: "rotate(" + self.degrees + "deg)" });
      }
    }, 1000);
  };
}

var Timer;
/*--------------------------------*/
function startAnimation() {
  var fillBox = document.getElementById("fill");
  fillBox.style.animationPlayState = "running";
  var timerDiv = document.getElementById("next_timer");
  var remainingTime = 5;
  timerDiv.innerText = "次の撮影まで " + remainingTime + " 秒";

  var countdown = setInterval(function () {
    remainingTime--;
    timerDiv.innerText = "次の撮影まで " + remainingTime + " 秒";

    if (remainingTime <= 0) {
      clearInterval(countdown);
    }
  }, 1000); //本番は1000

  setTimeout(function () {
    fillBox.style.animationPlayState = "paused";
    takePicture();
    Timer = new radialTimer();
    Timer.init("timer", 10);
  }, 5000); //本番は5000
}
/*--------------------------------*/

function transitionPicture() {
  location.href = "#room3";
  var box = document.getElementById("bar");
  var clipAnimation = document.createElement("div");
  clipAnimation.classList.add("clip-animation");
  box.appendChild(clipAnimation);
  setTimeout(function () {
    clipAnimation.parentNode.removeChild(clipAnimation);
    location.href = "#room4";
  }, 5000);
}

$(".reset").click(function () {
  location.href = "#room1";
  location.reload();
});

$("#open_settingRoom").click(function () {
  $("#setting").toggle();
});

$("#open_developer").click(function () {
  $("body").toggleClass("scroll-disabled");
  $("#setting").toggle();
});

$("#open_control").click(function () {
  clearInterval(countdownInterval);
  $(".control").show();
  $(".result").hide();
  $(".timer_circle").hide();
  $(".progress_counter").hide();
  $("#setting").toggle();
});

var counterElement = document.getElementById("end_counter");
var seconds = 200;
var intervalId;

function updateCounter() {
  location.href = "#room6";
  seconds--;
  counterElement.textContent = seconds;

  if (seconds <= 0) {
    clearInterval(intervalId);
    location.href = "#room1";
    location.reload();
  }
}
function copyCheck() {
  var canvas1 = document.getElementById("destinationCanvas0");
  var canvas2 = document.getElementById("destinationCanvas1");
  var canvas3 = document.getElementById("destinationCanvas2");
  var canvas4 = document.getElementById("destinationCanvas3");
  var canvas5 = document.getElementById("destinationCanvas4");

  var checkPicture1 = document.getElementById("checkPicture1");
  var checkPicture2 = document.getElementById("checkPicture2");
  var checkPicture3 = document.getElementById("checkPicture3");
  var checkPicture4 = document.getElementById("checkPicture4");
  var checkPicture5 = document.getElementById("checkPicture5");
  var checkPictureCtx1 = checkPicture1.getContext("2d");
  var checkPictureCtx2 = checkPicture2.getContext("2d");
  var checkPictureCtx3 = checkPicture3.getContext("2d");
  var checkPictureCtx4 = checkPicture4.getContext("2d");
  var checkPictureCtx5 = checkPicture5.getContext("2d");
  checkPictureCtx1.drawImage(canvas1, 0, 0, 210, 260);
  checkPictureCtx2.drawImage(canvas2, 0, 0, 210, 260);
  checkPictureCtx3.drawImage(canvas3, 0, 0, 210, 260);
  checkPictureCtx4.drawImage(canvas4, 0, 0, 210, 260);
  checkPictureCtx5.drawImage(canvas5, 0, 0, 210, 260);

  var checkPictureB1 = document.getElementById("checkPictureB1");
  var checkPictureB2 = document.getElementById("checkPictureB2");
  var checkPictureB3 = document.getElementById("checkPictureB3");
  var checkPictureB4 = document.getElementById("checkPictureB4");
  var checkPictureB5 = document.getElementById("checkPictureB5");
  var checkPictureCtxB1 = checkPictureB1.getContext("2d");
  var checkPictureCtxB2 = checkPictureB2.getContext("2d");
  var checkPictureCtxB3 = checkPictureB3.getContext("2d");
  var checkPictureCtxB4 = checkPictureB4.getContext("2d");
  var checkPictureCtxB5 = checkPictureB5.getContext("2d");
  checkPictureCtxB1.drawImage(canvas1, 0, 0, 210, 260);
  checkPictureCtxB2.drawImage(canvas2, 0, 0, 210, 260);
  checkPictureCtxB3.drawImage(canvas3, 0, 0, 210, 260);
  checkPictureCtxB4.drawImage(canvas4, 0, 0, 210, 260);
  checkPictureCtxB5.drawImage(canvas5, 0, 0, 210, 260);
  checkFrameStyle();

  location.href = "#room5";
}
FrameSetValueX = "empty";
var go_frame = "caseA";
function chooseFrameSetX(chooseFrameSetX) {
  FrameSetValueX = chooseFrameSetX;
  if (FrameSetValueX === "frame_A") {
    $(".frame_A").addClass("chosen");
    $(".frame_B").removeClass("chosen");
    go_frame = "caseA";
    drawSubCanvas();
  } else if (FrameSetValueX === "frame_B") {
    $(".frame_B").addClass("chosen");
    $(".frame_A").removeClass("chosen");
    go_frame = "caseB";
    drawSubCanvas();
  }
  console.log(go_frame);
  console.log(FrameSetValueX);
}
function go_next_frame() {
  console.log(FrameSetValueX);
  if(FrameSetValueX === "empty"){
    $(".frame_A").addClass("chosen");
    $(".frame_B").removeClass("chosen");
    go_frame = "caseA";
    drawSubCanvas();
  }
  if(go_frame === "caseA"){
    location.href = "#room7";
  }else{
    location.href = "#room9";
  }
}

function checkFrameStyle() {
  console.log(frameStyle);
  var frameY1 = document.getElementById("frameX_1");
  var frameX1 = document.getElementById("frameY_1");
  var frameX2 = document.getElementById("frameX_2");
  var frameY2 = document.getElementById("frameY_2");
  if (frameStyle === "styleA") {
    frameX1.src = "img/FrameAY.png";
    frameY1.src = "img/FrameAX.png";
    frameX2.src = "img/FrameAY.png";
    frameY2.src = "img/FrameAX.png";
  } else if (frameStyle === "styleB") {
    frameX1.src = "img/FrameBY.png";
    frameY1.src = "img/FrameBX.png";
    frameX2.src = "img/FrameBY.png";
    frameY2.src = "img/FrameBX.png";
  } else if (frameStyle === "styleC") {
    frameX1.src = "img/FrameCY.png";
    frameY1.src = "img/FrameCX.png";
    frameX2.src = "img/FrameCY.png";
    frameY2.src = "img/FrameCX.png";
  } else if (frameStyle === "styleD") {
    frameX1.src = "img/FrameDY.png";
    frameY1.src = "img/FrameDX.png";
    frameX2.src = "img/FrameDY.png";
    frameY2.src = "img/FrameDX.png";
  }
}
function go_edit_from_choose() {

  location.href = "#room9";
}
/*aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa*/

function drawSubCanvas() {
  var canvas1 = document.getElementById("destinationCanvas0");
  var canvas2 = document.getElementById("destinationCanvas1");
  var canvas3 = document.getElementById("destinationCanvas2");
  var canvas4 = document.getElementById("destinationCanvas3");
  var canvas5 = document.getElementById("destinationCanvas4");

  var SubCanvas1 = document.getElementById("SubCanvas1");
  var SubCanvas2 = document.getElementById("SubCanvas2");
  var SubCanvas3 = document.getElementById("SubCanvas3");
  var SubCanvas4 = document.getElementById("SubCanvas4");
  var SubCanvas5 = document.getElementById("SubCanvas5");
  var SubCanvasCtx1 = SubCanvas1.getContext("2d");
  var SubCanvasCtx2 = SubCanvas2.getContext("2d");
  var SubCanvasCtx3 = SubCanvas3.getContext("2d");
  var SubCanvasCtx4 = SubCanvas4.getContext("2d");
  var SubCanvasCtx5 = SubCanvas5.getContext("2d");
  SubCanvasCtx1.drawImage(canvas1, 0, 0, 103, 128);
  SubCanvasCtx2.drawImage(canvas2, 0, 0, 103, 128);
  SubCanvasCtx3.drawImage(canvas3, 0, 0, 103, 128);
  SubCanvasCtx4.drawImage(canvas4, 0, 0, 103, 128);
  SubCanvasCtx5.drawImage(canvas5, 0, 0, 103, 128);
  var CanvasC1 = document.getElementById("canvasC0");
  var CanvasC2 = document.getElementById("canvasC1");
  var CanvasC3 = document.getElementById("canvasC2");
  var CanvasC4 = document.getElementById("canvasC3");
  var CanvasC5 = document.getElementById("canvasC4");
  var CanvasCCtx1 = CanvasC1.getContext("2d");
  var CanvasCCtx2 = CanvasC2.getContext("2d");
  var CanvasCCtx3 = CanvasC3.getContext("2d");
  var CanvasCCtx4 = CanvasC4.getContext("2d");
  var CanvasCCtx5 = CanvasC5.getContext("2d");
  CanvasCCtx1.drawImage(canvas1, 0, 0, 585, 720);
  CanvasCCtx2.drawImage(canvas2, 0, 0, 585, 720);
  CanvasCCtx3.drawImage(canvas3, 0, 0, 585, 720);
  CanvasCCtx4.drawImage(canvas4, 0, 0, 585, 720);
  CanvasCCtx5.drawImage(canvas5, 0, 0, 585, 720);
}

const boxes = document.querySelectorAll(".checkPicture2");
const boxSpares = document.querySelectorAll(".boxB");
const canvasBtn = document.querySelectorAll(".canvasBtn");
const canvas_set = document.querySelectorAll(".canvas_set");

let selectedBoxes = []; // 選択されたボックスのリスト

// ボックス要素がクリックされたときの処理を定義
function handleClick() {
  if (selectedBoxes.includes(this)) {
    // すでに選択されている場合は選択解除
    this.classList.remove("selected");
    selectedBoxes = selectedBoxes.filter((box) => box !== this);
  } else {
    // 選択されていない場合は選択状態のトグル
    if (selectedBoxes.length < 2) {
      this.classList.add("selected");
      selectedBoxes.push(this);
    } else {
      // 2つ以上のボックスが選択されている場合は最初のボックスを解除して新しいボックスを選択
      const removedBox = selectedBoxes.shift();
      removedBox.classList.remove("selected");
      this.classList.add("selected");
      selectedBoxes.push(this);
    }
  }

  // 選択されたボックスの数を更新して表示
  const numSelected = selectedBoxes.length;
  const confirmBtn = document.getElementById("confirmBtn");
  confirmBtn.textContent = `${numSelected}/2`;

  // 2つのボックスが選択されたら、confirmBtnの背景色を変更
  if (numSelected === 2) {
    confirmBtn.classList.add("selectedBtn");
  } else {
    confirmBtn.classList.remove("selectedBtn");
  }
}

// 各ボックス要素にクリックイベントを追加
boxes.forEach((box) => {
  box.addEventListener("click", handleClick);
});

// 決定ボタンがクリックされたときの処理を定義
const confirmBtn = document.getElementById("confirmBtn");
confirmBtn.addEventListener("click", () => {
  // 選択されていないボックスに対応するboxSpare要素の表示を非表示にする
  boxes.forEach((box) => {
    if (!selectedBoxes.includes(box)) {
      const index = Array.from(boxes).indexOf(box);
      boxSpares[index].style.display = "none";
      canvasBtn[index].style.display = "none";
      console.log(index);
    }
  });

  // 選択されたボックスのクラスを表示する
  const selectedBoxClasses = selectedBoxes.map((box) => box.classList[1]);
  console.log(selectedBoxClasses);
});

/*-------------------------------------------------------*/

/*DrawDrawDrawDrawDrawDrawDrawDrawDrawDrawDrawDrawDrawDraw*/
var canvasAList = [];
var canvasBList = [];
var canvasCList = [];
var activeCanvasIndex = 0;
var opacity = 1;
var undoHistoryList = [];
var redoHistoryList = [];

function disableCanvasB() {
  var canvasB = canvasBList[activeCanvasIndex];
  canvasB.wrapperEl.style.pointerEvents = "none";
  toggleButtons("buttonA");
  if (canvasB.getActiveObject()) {
    canvasB.discardActiveObject();
    canvasB.renderAll();
  }
  $(".draw_tab").show();
  $(".stamp_tab").hide();
}

function enableCanvasB() {
  var canvasB = canvasBList[activeCanvasIndex];
  canvasB.wrapperEl.style.pointerEvents = "auto";
  toggleButtons("buttonB");
  $(".draw_tab").hide();
  $(".stamp_tab").show();
}

function toggleButtons(activeButtonId) {
  var buttonA = document.getElementById("buttonA");
  var buttonB = document.getElementById("buttonB");

  if (activeButtonId === "buttonA") {
    buttonA.classList.add("active-button");
    buttonB.classList.remove("active-button");
  } else if (activeButtonId === "buttonB") {
    buttonA.classList.remove("active-button");
    buttonB.classList.add("active-button");
  }
}

window.onload = function () {
  toggleButtons("buttonA");
  disableCanvasB();
};

// Initialize canvases
for (var i = 0; i < 5; i++) {
  var canvasAId = "canvasA" + i;
  var canvasA = new fabric.Canvas(canvasAId);
  canvasAList.push(canvasA);
  undoHistoryList.push([]);
  redoHistoryList.push([]);

  var canvasBId = "canvasB" + i;
  var canvasB = new fabric.Canvas(canvasBId);
  canvasBList.push(canvasB);

  var canvasCId = "canvasC" + i;
  var canvasC = new fabric.Canvas(canvasCId);
  canvasCList.push(canvasC);
}

function setActiveCanvas(index) {
  activeCanvasIndex = index;
  canvasAList.forEach(function (canvasA, canvasIndex) {
    var canvasB = canvasBList[canvasIndex];
    var canvasC = canvasCList[canvasIndex];
    canvasA.wrapperEl.style.display = canvasIndex === index ? "block" : "none";
    canvasA.isDrawingMode = canvasIndex === index;
    canvasA.freeDrawingBrush.color = new fabric.Color(getCurrentColor())
      .setAlpha(opacity)
      .toRgba();
    canvasA.freeDrawingBrush.width = getCurrentStrokeWidth();

    canvasB.wrapperEl.style.display = canvasIndex === index ? "block" : "none";
    canvasC.wrapperEl.style.display = canvasIndex === index ? "block" : "none";
    toggleButtons("buttonA");
    disableCanvasB();
  });

  // Change button styles
  var canvasBtns = document.getElementsByClassName("canvasBtn");
  for (var i = 0; i < canvasBtns.length; i++) {
    if (i === index) {
      canvasBtns[i].classList.add("active-button");
    } else {
      canvasBtns[i].classList.remove("active-button");
    }
  }

  // Reset settings
  setColor("black");
  setStrokeWidth(7);
  setOpacity(1);
  redrawCanvas();
}
function finish_edit() {
  redrawCanvas();
  if (go_frame === "caseA") {
    location.href = "#room10B";
  } else {
    location.href = "#room10A";
  }
}
function redrawCanvas() {
  const canvasA0 = document.getElementById("canvasA0");
  const canvasB0 = document.getElementById("canvasB0");
  const canvasC0 = document.getElementById("canvasC0");
  const canvasA1 = document.getElementById("canvasA1");
  const canvasB1 = document.getElementById("canvasB1");
  const canvasC1 = document.getElementById("canvasC1");
  const canvasA2 = document.getElementById("canvasA2");
  const canvasB2 = document.getElementById("canvasB2");
  const canvasC2 = document.getElementById("canvasC2");
  const canvasA3 = document.getElementById("canvasA3");
  const canvasB3 = document.getElementById("canvasB3");
  const canvasC3 = document.getElementById("canvasC3");
  const canvasA4 = document.getElementById("canvasA4");
  const canvasB4 = document.getElementById("canvasB4");
  const canvasC4 = document.getElementById("canvasC4");
  const mergedCanvas1 = document.getElementById("SubCanvas1");
  const merged1Ctx = mergedCanvas1.getContext("2d");
  const mergedCanvas2 = document.getElementById("SubCanvas2");
  const merged2Ctx = mergedCanvas2.getContext("2d");
  const mergedCanvas3 = document.getElementById("SubCanvas3");
  const merged3Ctx = mergedCanvas3.getContext("2d");
  const mergedCanvas4 = document.getElementById("SubCanvas4");
  const merged4Ctx = mergedCanvas4.getContext("2d");
  const mergedCanvas5 = document.getElementById("SubCanvas5");
  const merged5Ctx = mergedCanvas5.getContext("2d");
  merged1Ctx.drawImage(canvasC0, 0, 0, 103, 128);
  merged1Ctx.drawImage(canvasB0, 0, 0, 103, 128);
  merged1Ctx.drawImage(canvasA0, 0, 0, 103, 128);
  merged2Ctx.drawImage(canvasC1, 0, 0, 103, 128);
  merged2Ctx.drawImage(canvasB1, 0, 0, 103, 128);
  merged2Ctx.drawImage(canvasA1, 0, 0, 103, 128);
  merged3Ctx.drawImage(canvasC2, 0, 0, 103, 128);
  merged3Ctx.drawImage(canvasB2, 0, 0, 103, 128);
  merged3Ctx.drawImage(canvasA2, 0, 0, 103, 128);
  merged4Ctx.drawImage(canvasC3, 0, 0, 103, 128);
  merged4Ctx.drawImage(canvasB3, 0, 0, 103, 128);
  merged4Ctx.drawImage(canvasA3, 0, 0, 103, 128);
  merged5Ctx.drawImage(canvasC4, 0, 0, 103, 128);
  merged5Ctx.drawImage(canvasB4, 0, 0, 103, 128);
  merged5Ctx.drawImage(canvasA4, 0, 0, 103, 128);

  const subCanvasA1 = document.getElementById("subCanvasA1");
  const subCanvasA2 = document.getElementById("subCanvasA2");
  const subCanvasA3 = document.getElementById("subCanvasA3");
  const subCanvasA4 = document.getElementById("subCanvasA4");
  const subCanvasA5 = document.getElementById("subCanvasA5");
  const subCanvasA1Ctx = subCanvasA1.getContext("2d");
  const subCanvasA2Ctx = subCanvasA2.getContext("2d");
  const subCanvasA3Ctx = subCanvasA3.getContext("2d");
  const subCanvasA4Ctx = subCanvasA4.getContext("2d");
  const subCanvasA5Ctx = subCanvasA5.getContext("2d");
  subCanvasA1Ctx.drawImage(
    canvasC0,
    0,
    0,
    subCanvasA1.width,
    subCanvasA1.height
  );
  subCanvasA1Ctx.drawImage(
    canvasB0,
    0,
    0,
    subCanvasA1.width,
    subCanvasA1.height
  );
  subCanvasA1Ctx.drawImage(
    canvasA0,
    0,
    0,
    subCanvasA1.width,
    subCanvasA1.height
  );
  subCanvasA2Ctx.drawImage(
    canvasC1,
    0,
    0,
    subCanvasA2.width,
    subCanvasA2.height
  );
  subCanvasA2Ctx.drawImage(
    canvasB1,
    0,
    0,
    subCanvasA2.width,
    subCanvasA2.height
  );
  subCanvasA2Ctx.drawImage(
    canvasA1,
    0,
    0,
    subCanvasA2.width,
    subCanvasA2.height
  );
  subCanvasA3Ctx.drawImage(
    canvasC2,
    0,
    0,
    subCanvasA3.width,
    subCanvasA3.height
  );
  subCanvasA3Ctx.drawImage(
    canvasB2,
    0,
    0,
    subCanvasA3.width,
    subCanvasA3.height
  );
  subCanvasA3Ctx.drawImage(
    canvasA2,
    0,
    0,
    subCanvasA3.width,
    subCanvasA3.height
  );
  subCanvasA4Ctx.drawImage(
    canvasC3,
    0,
    0,
    subCanvasA4.width,
    subCanvasA4.height
  );
  subCanvasA4Ctx.drawImage(
    canvasB3,
    0,
    0,
    subCanvasA4.width,
    subCanvasA4.height
  );
  subCanvasA4Ctx.drawImage(
    canvasA3,
    0,
    0,
    subCanvasA4.width,
    subCanvasA4.height
  );
  subCanvasA5Ctx.drawImage(
    canvasC4,
    0,
    0,
    subCanvasA5.width,
    subCanvasA5.height
  );
  subCanvasA5Ctx.drawImage(
    canvasB4,
    0,
    0,
    subCanvasA5.width,
    subCanvasA5.height
  );
  subCanvasA5Ctx.drawImage(
    canvasA4,
    0,
    0,
    subCanvasA5.width,
    subCanvasA5.height
  );

  const subCanvasB1 = document.getElementById("subCanvasB1");
  const subCanvasB2 = document.getElementById("subCanvasB2");
  const subCanvasB3 = document.getElementById("subCanvasB3");
  const subCanvasB4 = document.getElementById("subCanvasB4");
  const subCanvasB5 = document.getElementById("subCanvasB5");
  const subCanvasB1Ctx = subCanvasB1.getContext("2d");
  const subCanvasB2Ctx = subCanvasB2.getContext("2d");
  const subCanvasB3Ctx = subCanvasB3.getContext("2d");
  const subCanvasB4Ctx = subCanvasB4.getContext("2d");
  const subCanvasB5Ctx = subCanvasB5.getContext("2d");
  subCanvasB1Ctx.drawImage(
    canvasC0,
    0,
    0,
    subCanvasA1.width,
    subCanvasA1.height
  );
  subCanvasB1Ctx.drawImage(
    canvasB0,
    0,
    0,
    subCanvasA1.width,
    subCanvasA1.height
  );
  subCanvasB1Ctx.drawImage(
    canvasA0,
    0,
    0,
    subCanvasA1.width,
    subCanvasA1.height
  );
  subCanvasB2Ctx.drawImage(
    canvasC1,
    0,
    0,
    subCanvasA2.width,
    subCanvasA2.height
  );
  subCanvasB2Ctx.drawImage(
    canvasB1,
    0,
    0,
    subCanvasA2.width,
    subCanvasA2.height
  );
  subCanvasB2Ctx.drawImage(
    canvasA1,
    0,
    0,
    subCanvasA2.width,
    subCanvasA2.height
  );
  subCanvasB3Ctx.drawImage(
    canvasC2,
    0,
    0,
    subCanvasA3.width,
    subCanvasA3.height
  );
  subCanvasB3Ctx.drawImage(
    canvasB2,
    0,
    0,
    subCanvasA3.width,
    subCanvasA3.height
  );
  subCanvasB3Ctx.drawImage(
    canvasA2,
    0,
    0,
    subCanvasA3.width,
    subCanvasA3.height
  );
  subCanvasB4Ctx.drawImage(
    canvasC3,
    0,
    0,
    subCanvasA4.width,
    subCanvasA4.height
  );
  subCanvasB4Ctx.drawImage(
    canvasB3,
    0,
    0,
    subCanvasA4.width,
    subCanvasA4.height
  );
  subCanvasB4Ctx.drawImage(
    canvasA3,
    0,
    0,
    subCanvasA4.width,
    subCanvasA4.height
  );
  subCanvasB5Ctx.drawImage(
    canvasC4,
    0,
    0,
    subCanvasA5.width,
    subCanvasA5.height
  );
  subCanvasB5Ctx.drawImage(
    canvasB4,
    0,
    0,
    subCanvasA5.width,
    subCanvasA5.height
  );
  subCanvasB5Ctx.drawImage(
    canvasA4,
    0,
    0,
    subCanvasA5.width,
    subCanvasA5.height
  );
}

function setColor(color) {
  var canvas = canvasAList[activeCanvasIndex];
  canvas.freeDrawingBrush.color = new fabric.Color(color)
    .setAlpha(opacity)
    .toRgba();
  document.getElementById("colorPicker").value = "";

  // Change button styles
  var colorBtns = document.querySelectorAll('[id^="colorBtn"]');
  for (var i = 0; i < colorBtns.length; i++) {
    if (
      colorBtns[i].id ===
      "colorBtn" + color.charAt(0).toUpperCase() + color.slice(1)
    ) {
      colorBtns[i].classList.add("active-button");
    } else {
      colorBtns[i].classList.remove("active-button");
    }
  }
}

function setCustomColor() {
  var color = document.getElementById("colorPicker").value;
  var canvas = canvasAList[activeCanvasIndex];
  canvas.freeDrawingBrush.color = new fabric.Color(color)
    .setAlpha(opacity)
    .toRgba();
}

function setStrokeWidth(width) {
  var canvas = canvasAList[activeCanvasIndex];
  canvas.freeDrawingBrush.width = width;

  // Change button styles
  var strokeBtns = document.querySelectorAll('[id^="strokeBtn"]');
  for (var i = 0; i < strokeBtns.length; i++) {
    if (strokeBtns[i].id === "strokeBtn" + width) {
      strokeBtns[i].classList.add("active-button");
    } else {
      strokeBtns[i].classList.remove("active-button");
    }
  }
}

function getCurrentColor() {
  var canvas = canvasAList[activeCanvasIndex];
  return canvas.freeDrawingBrush.color;
}

function getCurrentStrokeWidth() {
  var canvas = canvasAList[activeCanvasIndex];
  return canvas.freeDrawingBrush.width;
}

function setOpacity(newOpacity) {
  opacity = newOpacity;
  var canvas = canvasAList[activeCanvasIndex];
  canvas.freeDrawingBrush.color = new fabric.Color(getCurrentColor())
    .setAlpha(opacity)
    .toRgba();

  // Change button styles
  var opacityBtns = document.querySelectorAll('[id^="opacityBtn"]');
  for (var i = 0; i < opacityBtns.length; i++) {
    if (opacityBtns[i].id === "opacityBtn" + newOpacity * 100) {
      opacityBtns[i].classList.add("active-button");
    } else {
      opacityBtns[i].classList.remove("active-button");
    }
  }
}

function undo() {
  var canvasA = canvasAList[activeCanvasIndex];
  var undoHistory = undoHistoryList[activeCanvasIndex];
  if (canvasA._objects.length > 0) {
    var removedObject = canvasA._objects.pop();
    undoHistory.push(removedObject);
    canvasA.renderAll();
  }
}

function redo() {
  var canvasA = canvasAList[activeCanvasIndex];
  var undoHistory = undoHistoryList[activeCanvasIndex];
  var redoHistory = redoHistoryList[activeCanvasIndex];
  if (undoHistory.length > 0) {
    var restoredObject = undoHistory.pop();
    canvasA.add(restoredObject);
    redoHistory.push(restoredObject);
    canvasA.renderAll();
  }
}

function clearCanvas() {
  var canvasA = canvasAList[activeCanvasIndex];
  var undoHistory = undoHistoryList[activeCanvasIndex];
  var redoHistory = redoHistoryList[activeCanvasIndex];
  canvasA.clear();
  undoHistory.length = 0;
  redoHistory.length = 0;
}

/*--------------------------------------*/
// スタンプを追加する関数
function addStamp(svgId) {
  var canvasB = canvasBList[activeCanvasIndex];
  fabric.loadSVGFromURL("svg/" + svgId + ".svg", function (objects, options) {
    var stamp = fabric.util.groupSVGElements(objects, options);
    canvasB.add(stamp);
    stamp.setControlsVisibility(HideControls);

    stamp.on("mousedown", function () {
      canvasB.bringToFront(stamp);
      var doomedObj = canvasB.getActiveObject();
    });
  });
}

//コントロールの設定
var HideControls = {
  tl: true,
  tr: false,
  bl: true,
  br: true,
  ml: true,
  mt: true,
  mr: true,
  mb: true,
  mtr: true,
};
// create a rect object
var deleteIcon = "svg/close3.svg";
var img = document.createElement("img");
img.src = deleteIcon;

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = "rgba(78, 127, 224, 0.6)";

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
  x: 0.5,
  y: -0.5,
  cursorStyle: "pointer",
  mouseUpHandler: deleteObject,
  render: renderIcon,
  cornerSize: 24,
});

function deleteObject(eventData, transform) {
  var canvasB = canvasBList[activeCanvasIndex];
  var activeObject = canvasB.getActiveObject();
  canvasB.remove(activeObject);
  canvasB.discardActiveObject();
  canvasB.renderAll();
}

function renderIcon(ctx, left, top, styleOverride, fabricObject) {
  var size = this.cornerSize;
  ctx.save();
  ctx.translate(left, top);
  ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
  ctx.drawImage(img, -size / 2, -size / 2, size, size);
  ctx.restore();
}
canvasB.selection = false;

/*--------------------------------*/
// 部分削除
document.getElementById("deleteButton").addEventListener("click", function () {
  var canvasB = canvasBList[activeCanvasIndex];
  var activeObject = canvasB.getActiveObject();
  if (activeObject) {
    canvasB.remove(activeObject);
    canvasB.discardActiveObject();
    canvasB.renderAll();
  }
});

document.getElementById("clearButton").addEventListener("click", function () {
  var canvasB = canvasBList[activeCanvasIndex];
  canvasB.clear();
});
/*--------------------------------------*/
setActiveCanvas(activeCanvasIndex);

/*aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa*/

var selectedBoxesA = []; // 選択されたボックスを格納する配列
var subCanvasPositionsA = [
  { leftA: "52px", topA: "70px", widthA: "279px", heightA: "348px" },
  { leftA: "364px", topA: "70px", widthA: "133px", heightA: "166px" },
  { leftA: "511px", topA: "70px", widthA: "133px", heightA: "166px" },
  { leftA: "364px", topA: "252px", widthA: "133px", heightA: "166px" },
  { leftA: "511px", topA: "252px", widthA: "133px", heightA: "166px" },
];

function selectBoxA(boxNumber) {
  var selectedBoxA = document.getElementById("boxA" + boxNumber);
  var selectedParagraphA = selectedBoxA.querySelector("p");

  if (selectedBoxA.classList.contains("selected")) {
    selectedBoxA.classList.remove("selected");
    selectedParagraphA.textContent = ""; // 選択された順番を表示するテキストをクリア

    // 解除された要素を配列から削除する
    var indexA = selectedBoxesA.indexOf(boxNumber);
    if (indexA !== -1) {
      selectedBoxesA.splice(indexA, 1);
    }

    // 選択されたボックスの順番を再調整する
    updateBoxOrderA();
  } else {
    var boxesA = document.getElementsByClassName("box");
    for (var i = 0; i < boxesA.length; i++) {
      boxesA[i].classList.remove("selected");
      var paragraph = boxesA[i].querySelector("p");
      paragraph.textContent = ""; // 他のボックスのテキストをクリア
    }

    selectedBoxA.classList.add("selected");
    selectedParagraphA.textContent = "選択順: " + (selectedBoxesA.length + 1); // 選択された順番を表示

    // 選択されたボックスを配列に追加する
    selectedBoxesA.push(boxNumber);

    // subCanvasをmainCanvasに統合する
    mergeSubCanvasesA();

    // 5つのボックスが選択された場合、id=go_nextの要素の背景色を変更する
    if (selectedBoxesA.length === 5) {
      document.getElementById("go_nextA").style.backgroundColor = "#787878";
      document.getElementById("go_nextA").style.pointerEvents = "auto";
    }
  }
}

function updateBoxOrderA() {
  // 選択されたボックスの順番を再調整する
  var boxesA = document.getElementsByClassName("box");
  for (var i = 0; i < selectedBoxesA.length; i++) {
    var boxNumberA = selectedBoxesA[i];
    var boxA = document.getElementById("boxA" + boxNumberA);
    var paragraphA = boxA.querySelector("p");
    paragraphA.textContent = "選択順: " + (i + 1);
  }

  // subCanvasをmainCanvasに統合する
  mergeSubCanvasesA();

  // 5つのボックスが選択された場合、id=go_nextの要素の背景色を変更する
  if (selectedBoxesA.length === 5) {
    document.getElementById("go_nextA").style.backgroundColor = "#787878";
    document.getElementById("go_nextA").style.pointerEvents = "auto";
  } else {
    document.getElementById("go_nextA").style.backgroundColor = ""; // 背景色をクリア
    document.getElementById("go_nextA").style.pointerEvents = "none";
  }
}

function mergeSubCanvasesA() {
  var mainCanvasA = document.getElementById("mainCanvasA");
  var mainContextA = mainCanvasA.getContext("2d");

  // mainCanvasをクリアする
  mainContextA.clearRect(0, 0, mainCanvasA.width, mainCanvasA.height);

  // subCanvasを順番に統合する
  for (var i = 0; i < selectedBoxesA.length; i++) {
    var boxNumberA = selectedBoxesA[i];
    var subCanvasIdC = document.getElementById("canvasC" + (boxNumberA - 1));
    var subCanvasIdB = document.getElementById("canvasB" + (boxNumberA - 1));
    var subCanvasIdA = document.getElementById("canvasA" + (boxNumberA - 1));

    var positionA = subCanvasPositionsA[i];
    var topA = parseInt(positionA.topA);
    var leftA = parseInt(positionA.leftA);
    var widthA = parseInt(positionA.widthA);
    var heightA = parseInt(positionA.heightA);

    // subCanvasの描画内容をmainCanvasにコピー
    mainContextA.drawImage(subCanvasIdC, leftA, topA, widthA, heightA);
    mainContextA.drawImage(subCanvasIdB, leftA, topA, widthA, heightA);
    mainContextA.drawImage(subCanvasIdA, leftA, topA, widthA, heightA);
  }
}
/*-----------------------------------------------------------------------------------*/
var selectedBoxesB = []; // 選択されたボックスを格納する配列
var subCanvasPositionsB = [
  { topB: "71px", leftB: "52px", widthB: "279px", heightB: "346px" },
  { topB: "71px", leftB: "364px", widthB: "279px", heightB: "346px" },
];

function selectBoxB(boxNumberB) {
  var selectedBoxB = document.getElementById("boxB" + boxNumberB);
  var selectedParagraphB = selectedBoxB.querySelector("p");

  if (selectedBoxB.classList.contains("selected")) {
    selectedBoxB.classList.remove("selected");
    selectedParagraphB.textContent = ""; // 選択された順番を表示するテキストをクリア

    // 解除された要素を配列から削除する
    var indexB = selectedBoxesB.indexOf(boxNumberB);
    if (indexB !== -1) {
      selectedBoxesB.splice(indexB, 1);
    }

    // 選択されたボックスの順番を再調整する
    updateBoxOrderB();
  } else {
    // 選択可能なボックスの上限は2つ
    if (selectedBoxesB.length >= 2) {
      return; // 選択できないようにする
    }

    selectedBoxB.classList.add("selected");
    selectedParagraphB.textContent = "選択順: " + (selectedBoxesB.length + 1); // 選択された順番を表示

    // 選択されたボックスを配列に追加する
    selectedBoxesB.push(boxNumberB);

    // subCanvasをmainCanvasに統合する
    mergeSubCanvasesB();

    // 2つのボックスが選択された場合、id=go_nextの要素の背景色を変更する
    if (selectedBoxesB.length === 2) {
      document.getElementById("go_nextB").style.backgroundColor = "#787878";
      document.getElementById("go_nextB").style.pointerEvents = "auto";
    }
  }
}

function updateBoxOrderB() {
  // 選択されたボックスの順番を再調整する
  var boxesB = document.getElementsByClassName("box");
  for (var i = 0; i < selectedBoxesB.length; i++) {
    var boxNumberB = selectedBoxesB[i];
    var boxB = document.getElementById("boxB" + boxNumberB);
    var paragraphB = boxB.querySelector("p");
    paragraphB.textContent = "選択順: " + (i + 1);
  }

  // subCanvasをmainCanvasに統合する
  mergeSubCanvasesB();

  // 2つのボックスが選択された場合、id=go_nextの要素の背景色を変更する
  if (selectedBoxesB.length === 2) {
    document.getElementById("go_nextB").style.backgroundColor = "#787878";
    document.getElementById("go_nextB").style.pointerEvents = "auto";
  } else {
    document.getElementById("go_nextB").style.backgroundColor = ""; // 背景色をクリア
    document.getElementById("go_nextB").style.pointerEvents = "none";
  }
}

function mergeSubCanvasesB() {
  var mainCanvasB = document.getElementById("mainCanvasB");
  var mainContextB = mainCanvasB.getContext("2d");

  // mainCanvasをクリアする
  mainContextB.clearRect(0, 0, mainCanvasB.width, mainCanvasB.height);

  // subCanvasを順番に統合する
  for (var i = 0; i < selectedBoxesB.length; i++) {
    var boxNumberB = selectedBoxesB[i];
    var subCanvasIdC = document.getElementById("canvasC" + (boxNumberB - 1));
    var subCanvasIdB = document.getElementById("canvasB" + (boxNumberB - 1));
    var subCanvasIdA = document.getElementById("canvasA" + (boxNumberB - 1));

    var positionB = subCanvasPositionsB[i];
    var topB = parseInt(positionB.topB);
    var leftB = parseInt(positionB.leftB);
    var widthB = parseInt(positionB.widthB);
    var heightB = parseInt(positionB.heightB);

    // subCanvasの描画内容をmainCanvasにコピー
    mainContextB.drawImage(subCanvasIdC, leftB, topB, widthB, heightB);
    mainContextB.drawImage(subCanvasIdB, leftB, topB, widthB, heightB);
    mainContextB.drawImage(subCanvasIdA, leftB, topB, widthB, heightB);
  }
}
/*---------------------------------------------*/
var perfectCanvasPositionsA = [
  { leftP: "112px", topP: "138px", widthP: "625px", heightP: "773px" },
  { leftP: "808px", topP: "138px", widthP: "300px", heightP: "369px" },
  { leftP: "1143px", topP: "138px", widthP: "300px", heightP: "369px" },
  { leftP: "808px", topP: "542px", widthP: "300px", heightP: "369px" },
  { leftP: "1143px", topP: "542px", widthP: "300px", heightP: "369px" },
];
function mergePerfectCanvasesA() {
  var perfect_canvas = document.getElementById("perfect_canvas");
  var PerfectContext = perfect_canvas.getContext("2d");
  // mainCanvasをクリアする
  PerfectContext.clearRect(0, 0, perfect_canvas.width, perfect_canvas.height);
  var PerfectImg = new Image();

  if (frameStyle === "styleA") {
    PerfectImg.src = "img/FrameA.png";
  } else if (frameStyle === "styleB") {
    PerfectImg.src = "img/FrameB.png";
  } else if (frameStyle === "styleC") {
    PerfectImg.src = "img/FrameC.png";
  } else if (frameStyle === "styleD") {
    PerfectImg.src = "img/FrameD.png";
  }

  PerfectImg.onload = function () {
    PerfectContext.drawImage(
      PerfectImg,
      0,
      0,
      perfect_canvas.width,
      perfect_canvas.height
    );
    // subCanvasを順番に統合する
    for (var i = 0; i < selectedBoxesA.length; i++) {
      var boxNumberA = selectedBoxesA[i];
      var PerfectCanvasIdC = document.getElementById(
        "canvasC" + (boxNumberA - 1)
      );
      var PerfectCanvasIdB = document.getElementById(
        "canvasB" + (boxNumberA - 1)
      );
      var PerfectCanvasIdA = document.getElementById(
        "canvasA" + (boxNumberA - 1)
      );
      var PPositionA = perfectCanvasPositionsA[i];
      var topPA = parseInt(PPositionA.topP);
      var leftPA = parseInt(PPositionA.leftP);
      var widthPA = parseInt(PPositionA.widthP);
      var heightPA = parseInt(PPositionA.heightP);

      // subCanvasの描画内容をmainCanvasにコピー
      PerfectContext.drawImage(
        PerfectCanvasIdC,
        leftPA,
        topPA,
        widthPA,
        heightPA
      );
      PerfectContext.drawImage(
        PerfectCanvasIdB,
        leftPA,
        topPA,
        widthPA,
        heightPA
      );
      PerfectContext.drawImage(
        PerfectCanvasIdA,
        leftPA,
        topPA,
        widthPA,
        heightPA
      );
    }
  };
  var checkCanvasA = document.getElementById("checkCanvasA");
  var CheckContextA = checkCanvasA.getContext("2d");
  var mainCanvasA = document.getElementById("mainCanvasA");
  var PerfectImg = new Image();

  if (frameStyle === "styleA") {
    PerfectImg.src = "img/FrameA.png";
  } else if (frameStyle === "styleB") {
    PerfectImg.src = "img/FrameB.png";
  } else if (frameStyle === "styleC") {
    PerfectImg.src = "img/FrameC.png";
  } else if (frameStyle === "styleD") {
    PerfectImg.src = "img/FrameD.png";
  }

  PerfectImg.onload = function () {
    CheckContextA.drawImage(
      PerfectImg,
      0,
      0,
      checkCanvasA.width,
      checkCanvasA.height
    );
    CheckContextA.drawImage(
      mainCanvasA,
      0,
      0,
      checkCanvasA.width,
      checkCanvasA.height
    );
  };
  $(".check_style").show();
}

/*---------------------------------------------*/
var perfectCanvasPositionsB = [
  { topP: "152px", leftP: "112px", widthP: "604px", heightP: "747px" },
  { topP: "152px", leftP: "784px", widthP: "604px", heightP: "747px" },
];
function mergePerfectCanvasesB() {
  var perfect_canvas = document.getElementById("perfect_canvas");
  var PerfectContext = perfect_canvas.getContext("2d");

  // mainCanvasをクリアする
  PerfectContext.clearRect(0, 0, perfect_canvas.width, perfect_canvas.height);
  var PerfectImg = new Image();

  if (frameStyle === "styleA") {
    PerfectImg.src = "img/FrameA.png";
  } else if (frameStyle === "styleB") {
    PerfectImg.src = "img/FrameB.png";
  } else if (frameStyle === "styleC") {
    PerfectImg.src = "img/FrameC.png";
  } else if (frameStyle === "styleD") {
    PerfectImg.src = "img/FrameD.png";
  }

  PerfectImg.onload = function () {
    PerfectContext.drawImage(
      PerfectImg,
      0,
      0,
      perfect_canvas.width,
      perfect_canvas.height
    );
    // subCanvasを順番に統合する
    for (var i = 0; i < selectedBoxesB.length; i++) {
      var boxNumberB = selectedBoxesB[i];
      var PerfectCanvasIdC = document.getElementById(
        "canvasC" + (boxNumberB - 1)
      );
      var PerfectCanvasIdB = document.getElementById(
        "canvasB" + (boxNumberB - 1)
      );
      var PerfectCanvasIdA = document.getElementById(
        "canvasA" + (boxNumberB - 1)
      );
      var PPositionB = perfectCanvasPositionsB[i];
      var topPB = parseInt(PPositionB.topP);
      var leftPB = parseInt(PPositionB.leftP);
      var widthPB = parseInt(PPositionB.widthP);
      var heightPB = parseInt(PPositionB.heightP);

      // subCanvasの描画内容をmainCanvasにコピー
      PerfectContext.drawImage(
        PerfectCanvasIdC,
        leftPB,
        topPB,
        widthPB,
        heightPB
      );
      PerfectContext.drawImage(
        PerfectCanvasIdB,
        leftPB,
        topPB,
        widthPB,
        heightPB
      );
      PerfectContext.drawImage(
        PerfectCanvasIdA,
        leftPB,
        topPB,
        widthPB,
        heightPB
      );
    }
  };
  var checkCanvasB = document.getElementById("checkCanvasB");
  var CheckContextB = checkCanvasB.getContext("2d");
  var mainCanvasB = document.getElementById("mainCanvasB");
  var PerfectImg = new Image();

  if (frameStyle === "styleA") {
    PerfectImg.src = "img/FrameA.png";
  } else if (frameStyle === "styleB") {
    PerfectImg.src = "img/FrameB.png";
  } else if (frameStyle === "styleC") {
    PerfectImg.src = "img/FrameC.png";
  } else if (frameStyle === "styleD") {
    PerfectImg.src = "img/FrameD.png";
  }

  PerfectImg.onload = function () {
    CheckContextB.drawImage(
      PerfectImg,
      0,
      0,
      checkCanvasB.width,
      checkCanvasB.height
    );
    CheckContextB.drawImage(
      mainCanvasB,
      0,
      0,
      checkCanvasB.width,
      checkCanvasB.height
    );
  };
  $(".check_style").show();
}

function go_print() {
  location.href = "#room11";
  var barBox = document.getElementById("bar2");
  var clipAnimation = document.createElement("div");
  clipAnimation.classList.add("clip-animation");
  barBox.appendChild(clipAnimation);

  var canvas = document.getElementById("perfect_canvas");
  printJS({
    printable: canvas.toDataURL(), // CanvasのデータURLを指定
    type: "image", // 印刷タイプを画像に設定
    style: "@page { size: auto; margin: 0mm; }", // 印刷プレビューのスタイル
  });

  setTimeout(function () {
    clipAnimation.parentNode.removeChild(clipAnimation);
    location.href = "#room12";
    var counterElement = document.getElementById("end_counter");
    var seconds = 200;
    var intervalId;

    function updateCounter() {
      seconds--;
      counterElement.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(intervalId);
        location.href = "#room1";
        location.reload();
      }
    }
    intervalId = setInterval(updateCounter, 1000);
    document.getElementById("end_counter").textContent = seconds;
  }, 5000);
}
