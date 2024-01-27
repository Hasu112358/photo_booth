$(document).ready(function() {
  // 4つのキャンバスのデータを取得
  var canvas1 = document.getElementById("destinationCanvas0");
  var canvas2 = document.getElementById("destinationCanvas1");
  var canvas3 = document.getElementById("destinationCanvas2");
  var canvas4 = document.getElementById("destinationCanvas3");
  var canvas5 = document.getElementById("destinationCanvas4");
  
  // 4つのキャンバスのコンテキストを取得
  var ctx1 = canvas1.getContext("2d");
  var ctx2 = canvas2.getContext("2d");
  var ctx3 = canvas3.getContext("2d");
  var ctx4 = canvas4.getContext("2d");


  if (FrameSetValue === "set_A") {
    console.log('A');
    var combinedCanvas = document.getElementById("combined_CanvasA");
    var combinedCtx = combinedCanvas.getContext("2d");
    combinedCtx.fillStyle = "red"; // 四角形の色を設定
  } else if (FrameSetValue === "set_B") {
    console.log('B');
    var combinedCanvas = document.getElementById("combined_CanvasB");
    var combinedCtx = combinedCanvas.getContext("2d");
    combinedCtx.fillStyle = "blue"; // 四角形の色を設定
  } else if (FrameSetValue === "set_C") {
    console.log('C');
    var combinedCanvas = document.getElementById("combined_CanvasC");
    var combinedCtx = combinedCanvas.getContext("2d");
    combinedCtx.fillStyle = "green"; // 四角形の色を設定
  } else if (FrameSetValue === "set_D") {
    console.log('D');
      var combinedCanvas = document.getElementById("combined_CanvasD");
  var combinedCtx = combinedCanvas.getContext("2d");
    combinedCtx.fillStyle = "yellow"; // 四角形の色を設定
  }
  combinedCtx.fillRect(2905, 0, 10, 720);

  // 各キャンバスのデータを読み込んで合成先のキャンバスに描画
  combinedCtx.drawImage(canvas1, 0, 0, 581, 720); // 1つ目のキャンバスを描画
  combinedCtx.drawImage(canvas2, 581, 0, 581, 720); // 2つ目のキャンバスを描画
  combinedCtx.drawImage(canvas3, 1162, 0, 581, 720); // 3つ目のキャンバスを描画
  combinedCtx.drawImage(canvas4, 1743, 0, 581, 720); // 4つ目のキャンバスを描画
  combinedCtx.drawImage(canvas5, 2324, 0, 581, 720); // 5つ目のキャンバスを描画

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
});
/*-------------------------------------------------------------*/