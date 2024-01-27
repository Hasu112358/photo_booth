$(document).ready(function() {
  // 4つのキャンバスのデータを取得

});
/*-------------------------------------------------------------*/

FrameSetValue = "empty";
function chooseFrameSet(chooseFrameSet) {
  FrameSetValue = chooseFrameSet;
  if (FrameSetValue === "frame_A") {
    $(".frame_A").addClass("chosen");
    $(".frame_B").removeClass("chosen");
    go_frame = "caseA";
    drawSubCanvas();
  } else if (FrameSetValue === "frame_B") {
    $(".frame_B").addClass("chosen");
    $(".frame_A").removeClass("chosen");
    go_frame = "caseB";
    drawSubCanvas();
  }
  console.log(go_frame);
}

function go_next_frame() {
  if(FrameSetValue === "empty"){
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
