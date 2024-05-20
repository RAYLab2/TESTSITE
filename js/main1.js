//DrawCavase 및 더블 버퍼링을 위한 BufferCanvas
var ViewCanvas, ViewContext, BufferCanvas, BufferContext;

//Image 변수
var ppl_all_pohang_process,
  ppl_all_pohang_process_digital,
  ppl_pohang_process1,
  ppl_pohang_process1_hover,
  ppl_pohang_process2,
  ppl_pohang_process2_hover,
  ppl_pohang_process3,
  ppl_pohang_process3_hover,
  ppl_pohang_process4,
  ppl_pohang_process4_hover,
  ppl_pohang_process5,
  ppl_pohang_process5_hover;
var ppl_all_gwangyang_process,
  ppl_all_gwangyang_process_digital,
  ppl_gwangyang_process1,
  ppl_gwangyang_process1_hover,
  ppl_gwangyang_process2,
  ppl_gwangyang_process2_hover,
  ppl_gwangyang_process3,
  ppl_gwangyang_process3_hover,
  ppl_gwangyang_process4,
  ppl_gwangyang_process4_hover;
var ppl_digital_twin_background;
var ppl_circle;
var ppl_hover_text,
  ppl_hover_text2,
  ppl_hover_text3,
  ppl_hover_text4,
  ppl_hover_text5,
  ppl_hover_text6;

var IsCenterMove = false; // 확대 체크
var IsAlphaAnimationEnd = false; // 초기 이미지 알파값 체크
var ProcessSelect = -1; // 선택된 공정과정
var ProcessSelectImg; // 선택된 공정과정의 이미지
var ProcessSelectCount = 0; // 확대 이미지 프레임 카운트

var ProcessImages; // 공정 이미지 정보
var HoverInfo; // 마우스 오버시 나타나는 공정 정보

var IsPohangData = true; // 포항 데이터 확인
var IsHover = false; // 마우스 오버 확인
var IsClick = false; // 마우스 클릭 확인

// var MediaDeleteCheck = false; // 미디어 제거 확인

var UpdateInterval; // 이미지 업데이트 인터벌
var AnimationInterval; // 애니메이션 업데이트 인터벌

var COORDS; // 이미지 맵 좌표 정보

// 마우스 오버 정보 Draw에 필요한 정보
var HoverNumber = -1;

// 포항 이미지 클릭 좌료
var PohangSVGCOORDS = [
  [
    "509,299,511,382,534,410,560,402,567,410,550,417,533,436,448,461,443,452,435,453,437,471,446,480,665,412,659,399,633,406,618,397,589,401,589,358,597,352,614,367,651,358,652,349,594,290,595,276,584,266,583,249,567,235,536,242,529,268,531,292",
  ],
  [
    "318,276,320,315,307,309,296,320,274,307,260,314,258,338,285,351,288,375,235,341,225,346,298,398,314,389,315,408,334,419,327,435,340,446,373,444,380,437,390,448,397,444,379,417,387,395,375,385,378,372,373,365,362,314,361,304,341,292,333,294,328,296,324,276",
  ],
  [
    "459,276,456,327,448,327,446,314,421,302,414,288,410,278,396,279,364,263,348,269,349,292,401,322,401,333,412,340,421,336,425,339,425,347,447,360,462,365,481,353,483,334,468,326,464,277",
  ],
  [
    "225,214,230,246,223,242,197,251,270,296,325,272,325,260,324,253,312,247,303,251,253,224,253,222,289,233,290,230,253,214,251,209,244,207",
  ],
  [
    "203,111,209,185,189,201,189,206,197,203,210,192,207,204,220,210,234,206,243,201,244,198,282,186,287,189,296,187,298,180,359,157,358,154,349,153,340,88,331,91,329,98,302,133,306,159,300,162,296,140,281,144,275,153,281,171,271,172,233,145,227,128,226,104,220,103,205,109",
  ],
];

// 광양 이미지 클릭 좌표
var GwangYangCOORDS = [
  [
    "289,335,279,340,277,353,260,353,256,378,274,379,268,399,220,429,218,438,266,417,270,439,295,440,296,447,334,448,354,340,323,337,315,331",
  ],
  [
    "361,182,363,222,358,226,357,231,348,232,345,251,346,254,331,325,369,325,377,275,382,275,382,265,379,253,388,250,391,236,385,232,381,222,374,221,368,183",
  ],
  [
    "434,187,432,208,423,215,424,274,389,292,381,367,376,381,369,409,376,417,396,417,406,389,399,373,416,367,423,354,429,355,427,411,439,411,445,328,446,294,466,284,463,270,458,258,459,230,445,209,445,187",
  ],
  [
    "477,270,476,359,694,359,690,349,578,345,580,337,707,335,703,309,661,303,629,302,629,292,608,281,583,281,564,291,528,291,516,302,514,337,510,336,507,344,493,344,494,271",
  ],
];

//포항 마우스 오버 초기화 함수
function PohangHoverInit() {
  HoverInfo = [
    {
      xpos: 671,
      ypos: 305,
      width: 128.6,
      height: 49.6,
      imageWidth: 241,
      imageHeight: 93,
      dir: 0,
    },
    {
      xpos: 306,
      ypos: 409,
      width: 99.7,
      height: 50.1,
      imageWidth: 187,
      imageHeight: 94,
      dir: 1,
    },
    {
      xpos: 437,
      ypos: 262,
      width: 99.7,
      height: 49.6,
      imageWidth: 187,
      imageHeight: 93,
      dir: 2,
    },
    {
      xpos: 202,
      ypos: 295,
      width: 113.8,
      height: 50.1,
      imageWidth: 214,
      imageHeight: 94,
      dir: 3,
    },
    {
      xpos: 266,
      ypos: 90,
      width: 111.2,
      height: 49.6,
      imageWidth: 209,
      imageHeight: 93,
      dir: 4,
    },
  ];
}

//광양 마우스 오버 초기화 함수
function GwangyangHoverInit() {
  HoverInfo = [
    {
      xpos: 226,
      ypos: 448,
      width: 113.8,
      height: 50.1,
      imageWidth: 214,
      imageHeight: 94,
      dir: 3,
    },
    {
      xpos: 415,
      ypos: 166,
      width: 99.7,
      height: 49.6,
      imageWidth: 187,
      imageHeight: 93,
      dir: 2,
    },
    {
      xpos: 495,
      ypos: 227,
      width: 100,
      height: 49.6,
      imageWidth: 188,
      imageHeight: 93,
      dir: 1,
    },
    {
      xpos: 654,
      ypos: 294,
      width: 128.6,
      height: 49.6,
      imageWidth: 241,
      imageHeight: 93,
      dir: 0,
    },
  ];
}

// 광양 이미지 초기화
function GwangyangInit() {
  ProcessImages = [
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 15,
      maxYIndex: 11,
      lastXIndex: 1,
      xpos: 523,
      ypos: 261.5,
      move_x_pos: 0,
      move_y_pos: 0,
      width: 1046,
      height: 523,
      origin_width: 1046,
      origin_height: 523,
      move_width: 1046,
      move_height: 523,
      dirX: 0,
      dirY: 0,
      imageWidth: 1920,
      imageHeight: 960,
      imageType: 12,
      visible: true,
      opacitiy: 0,
      opacitiyspeed: 0.12,
    }, //밑에깔리는 디지털 이미지 0
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 15,
      maxYIndex: 11,
      lastXIndex: 1,
      xpos: 523,
      ypos: 261.5,
      move_x_pos: 0,
      move_y_pos: 0,
      width: 1046,
      height: 523,
      origin_width: 1046,
      origin_height: 523,
      move_width: 1046,
      move_height: 523,
      dirX: 0,
      dirY: 0,
      imageWidth: 1920,
      imageHeight: 960,
      imageType: 13,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //전체 공정 과정 1
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 363,
      ypos: 255,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 63.1,
      height: 149.2,
      origin_width: 63.1,
      origin_height: 149.2,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 116,
      imageHeight: 274,
      imageType: 16,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 2단계 4
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 363,
      ypos: 255,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 58.8,
      height: 144.9,
      origin_width: 58.8,
      origin_height: 144.9,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 108,
      imageHeight: 266,
      imageType: 17,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 2단계 Hover 5
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 287,
      ypos: 391,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 142.1,
      height: 120.9,
      origin_width: 142.1,
      origin_height: 120.9,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 261,
      imageHeight: 222,
      imageType: 14,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 1단계 2
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 287,
      ypos: 391,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 137.8,
      height: 118.2,
      origin_width: 137.8,
      origin_height: 118.2,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 253,
      imageHeight: 217,
      imageType: 15,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 1단계 Hover 3
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 418,
      ypos: 304,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 99.1,
      height: 239.7,
      origin_width: 99.1,
      origin_height: 239.7,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 182,
      imageHeight: 440,
      imageType: 18,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 3단계 6
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 418,
      ypos: 304,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 95.3,
      height: 235.8,
      origin_width: 95.3,
      origin_height: 235.8,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 175,
      imageHeight: 433,
      imageType: 19,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 3단계 Hover 7
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 592,
      ypos: 318,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 235.8,
      height: 95.3,
      origin_width: 235.8,
      origin_height: 95.3,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 433,
      imageHeight: 175,
      imageType: 20,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 4단계 8
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 592,
      ypos: 318,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 231.5,
      height: 91.525,
      origin_width: 231.5,
      origin_height: 91.525,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 425,
      imageHeight: 168,
      imageType: 21,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 4단계 Hover 9
  ];
}

// 포항 이미지 초기화
function PohangDataInit() {
  ProcessImages = [
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 15,
      maxYIndex: 11,
      lastXIndex: 1,
      xpos: 523,
      ypos: 261.5,
      move_x_pos: 0,
      move_y_pos: 0,
      width: 1046,
      height: 523,
      origin_width: 1046,
      origin_height: 523,
      move_width: 1046,
      move_height: 523,
      dirX: 0,
      dirY: 0,
      imageWidth: 1920,
      imageHeight: 960,
      imageType: 1,
      visible: true,
      opacitiy: 0,
      opacitiyspeed: 0.12,
    }, //밑에깔리는 디지털 이미지 0
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 15,
      maxYIndex: 11,
      lastXIndex: 1,
      xpos: 523,
      ypos: 261.5,
      move_x_pos: 0,
      move_y_pos: 0,
      width: 1046,
      height: 523,
      origin_width: 1046,
      origin_height: 523,
      move_width: 1046,
      move_height: 523,
      dirX: 0,
      dirY: 0,
      imageWidth: 1920,
      imageHeight: 960,
      imageType: 2,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //전체 공정 과정 1
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 314,
      ypos: 364,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 174.3,
      height: 177.6,
      origin_width: 174.3,
      origin_height: 177.6,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 320,
      imageHeight: 326,
      imageType: 3,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 2단계 2
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 314,
      ypos: 364,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 169.4,
      height: 174.3,
      origin_width: 169.4,
      origin_height: 174.3,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 311,
      imageHeight: 320,
      imageType: 0,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 2단계 Hover 3
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 550,
      ypos: 360,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 232.6,
      height: 248.425,
      origin_width: 232.6,
      origin_height: 248.425,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 427,
      imageHeight: 456,
      imageType: 4,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 1단계 4
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 550,
      ypos: 360,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 228.2,
      height: 244.6,
      origin_width: 228.2,
      origin_height: 244.6,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 419,
      imageHeight: 449,
      imageType: 5,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 1단계 Hover 5
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 415,
      ypos: 316,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 142.1,
      height: 105.1,
      origin_width: 142.1,
      origin_height: 105.1,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 261,
      imageHeight: 193,
      imageType: 6,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 3단계 6
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 415,
      ypos: 316,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 137.8,
      height: 101.3,
      origin_width: 137.8,
      origin_height: 101.3,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 253,
      imageHeight: 186,
      imageType: 7,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 3단계 Hover 7
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 264,
      ypos: 253,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 132.3,
      height: 94.7,
      origin_width: 132.3,
      origin_height: 94.7,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 243,
      imageHeight: 174,
      imageType: 8,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 4단계 8
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 264,
      ypos: 253,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 128,
      height: 92,
      origin_width: 128,
      origin_height: 92,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 235,
      imageHeight: 169,
      imageType: 9,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 4단계 Hover 9
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 275,
      ypos: 151,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 175.9,
      height: 126.3,
      origin_width: 175.9,
      origin_height: 126.3,
      move_width: 209.7,
      move_height: 205.8,
      dirX: 0,
      dirY: 0,
      imageWidth: 323,
      imageHeight: 232,
      imageType: 10,
      visible: true,
      opacitiy: -0.75,
      opacitiyspeed: 0.08,
    }, //공정 5단계 10
    {
      xIndex: 0,
      yIndex: 0,
      maxXIndex: 0,
      maxYIndex: 0,
      lastXIndex: 0,
      xpos: 275,
      ypos: 151,
      move_x_pos: 523,
      move_y_pos: 216.5,
      width: 172.1,
      height: 122,
      origin_width: 172.1,
      origin_height: 122,
      move_width: 523,
      move_height: 216.5,
      dirX: 0,
      dirY: 0,
      imageWidth: 316,
      imageHeight: 224,
      imageType: 11,
      visible: false,
      opacitiy: 1,
      opacitiyspeed: 0,
    }, //공정 5단계 Hover 11
  ];
}

// 이미지 클릭 좌표 초기화
function COORDSInit() {
  if (IsPohangData) {
    PohangDataInit();
    PohangHoverInit();
    COORDS = PohangSVGCOORDS;
  } else {
    GwangyangInit();
    GwangyangHoverInit();
    COORDS = GwangYangCOORDS;
  }
}

// 리플래쉬 버튼 클릭시 실행할 함수
function Refresh() {
  if (PohangDataInit) PohangDataInit();
  else GwangyangInit();

  COORDSInit();
  TouchResize();
  SetProcessImage();

  // $("#media-area").html('<img src = "./img/digitalTwin_load.jpg" id = "media-load-img"> <video src = "./media/ppl_digitalTwin_Intro.mp4" id = "media" onplaying = "mediaOnplay()" autoplay></video>');
  //   LoadingImageLoadEnd();
  //   $("#media-load-img").css("visibility", "visible");
  //   $("#media").css("width", $("#media-area").css("width"));

  // var vid = document.getElementById("media");
  // vid.playbackRate = 3.0;
  IsAlphaAnimationEnd = false;
  IsCenterMove = false;
  IsHover = false;
  IsClick = false;
  HoverNumber = -1;

  $("#canvas-pop-area").css("visibility", "hidden");
  StartUpdate();
  //   $("#media").on("ended", function () {
  //     MediaDeleteCheck = false;
  //     StartUpdate();
  //     $("#main-image").css("visibility", "visible");
  //   });
}

//포항 광양 버튼 변경시 작동할 함수
function ChangeImage() {
  COORDSInit();
  TouchResize();
  SetProcessImage();

  $("#canvas-pop-area").css("visibility", "hidden");

  IsAlphaAnimationEnd = false;
  IsCenterMove = false;
  IsHover = false;
  IsClick = false;
  HoverNumber = -1;

  StartUpdate();
}

$(document).ready(function () {
  COORDSInit();

  //화면에 보여줄 캔버스
  ViewCanvas = document.getElementById("main-canvas");
  ViewContext = ViewCanvas.getContext("2d");
  ViewCanvas.width = 1046;
  ViewCanvas.height = 523;
  ViewContext.fillStyle = "white";
  ViewContext.fillRect(0, 0, 1046, 523);

  //버퍼 캔버스
  BufferCanvas = document.createElement("canvas");
  BufferContext = BufferCanvas.getContext("2d");
  BufferCanvas.width = 1046;
  BufferCanvas.height = 523;
  StartUpdate();
  //   $("#media").on("ended", function () {
  //     MediaDeleteCheck = false;
  //     StartUpdate();
  //     $("#main-image").css("visibility", "visible");
  //   });

  //   $("#media").on("onplay", function () {
  //     console.log("media play");
  //     $("#media-load-img").css("visibility", "hidden");
  //   });

  $("#refresh").click(function (input) {
    Refresh();
  });

  $(".mvButton._g").click(function (input) {
    if (!IsPohangData) return;

    IsPohangData = false;

    $("#mvButton-text-g").removeClass("text-size-up");
    $("#mvButton-text-g").removeClass("mvButton-text-color");
    $("#mvButton-text-p").removeClass("text-size-up-move");
    $("#mvButton-text-p").removeClass("text-p-start");
    $("#mvButton-text-p").addClass("mvButton-text-color");
    $("#mvButton-text-g").addClass("text-size-up-move");

    ChangeImage();
  });

  $(".mvButton._p").click(function (input) {
    if (IsPohangData) return;

    IsPohangData = true;

    $("#mvButton-text-p").removeClass("text-size-up");
    $("#mvButton-text-p").removeClass("mvButton-text-color");
    $("#mvButton-text-g").removeClass("text-size-up-move");
    $("#mvButton-text-g").addClass("mvButton-text-color");
    $("#mvButton-text-p").addClass("text-size-up-move");

    ChangeImage();
  });

  $(".mvButton._g").hover(
    function (input) {
      if (!IsPohangData) return;

      $("#mvButton-text-g").addClass("text-size-up");
    },
    function () {
      if (!IsPohangData) return;

      $("#mvButton-text-g").removeClass("text-size-up");
    }
  );

  $(".mvButton._p").hover(
    function (input) {
      if (IsPohangData) return;

      $("#mvButton-text-p").addClass("text-size-up");
    },
    function () {
      $("#mvButton-text-p").removeClass("text-size-up");
    }
  );

  $("#canvas-pop-area").click(function (input) {
    $("#canvas-pop-area").css("visibility", "hidden");
    ProcessImages[ProcessSelect].visible = true;
    ProcessImages[ProcessSelect + 1].visible = false;
    ProcessImages[ProcessSelect + 1].width =
      ProcessImages[ProcessSelect + 1].origin_width;
    ProcessImages[ProcessSelect + 1].height =
      ProcessImages[ProcessSelect + 1].origin_height;
    IsClick = false;
    HoverNumber = -1;
    UpdateImage();
  });

  ProcessHoverEvent();
  ProcessClickEvent();
  LoadImage();
});

// function LoadingImageLoadEnd() {
//   $("#vedio-area").html(
//     '<video src = "./media/ppl_digitalTwin_Intro.mp4" id = "media" onplaying = "mediaOnplay()" autoplay></video>'
//   );
// }

// // 미디어 실행할때 앞쪽 이미지 제거
// function mediaOnplay() {
//   $("#media-load-img").css("visibility", "hidden");
// }

// 공정 마우스 오버 이벤트
function ProcessHoverEvent() {
  $(".process1").hover(
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;
      IsHover = true;
      ProcessImages[5].visible = true;

      HoverNumber = 0;
      $("html").css("cursor", "pointer");

      UpdateImage();
    },
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;

      IsHover = false;
      ProcessImages[5].visible = false;
      HoverNumber = -1;
      $("html").css("cursor", "default");

      UpdateImage();
    }
  );

  $(".process2").hover(
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;
      IsHover = true;
      ProcessImages[3].visible = true;
      HoverNumber = 1;
      $("html").css("cursor", "pointer");
      UpdateImage();
    },
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;

      IsHover = false;
      ProcessImages[3].visible = false;
      HoverNumber = -1;
      $("html").css("cursor", "default");
      UpdateImage();
    }
  );

  $(".process3").hover(
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;
      IsHover = true;
      ProcessImages[7].visible = true;
      HoverNumber = 2;
      $("html").css("cursor", "pointer");
      UpdateImage();
    },
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;

      IsHover = false;
      ProcessImages[7].visible = false;
      HoverNumber = -1;
      $("html").css("cursor", "default");
      UpdateImage();
    }
  );

  $(".process4").hover(
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;
      IsHover = true;
      ProcessImages[9].visible = true;
      HoverNumber = 3;
      $("html").css("cursor", "pointer");
      UpdateImage();
    },
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;

      IsHover = false;
      ProcessImages[9].visible = false;
      HoverNumber = -1;
      $("html").css("cursor", "default");
      UpdateImage();
    }
  );

  $(".process5").hover(
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;
      IsHover = true;
      ProcessImages[11].visible = true;
      HoverNumber = 4;
      $("html").css("cursor", "pointer");
      UpdateImage();
    },
    function () {
      if (IsCenterMove || !IsAlphaAnimationEnd || IsClick) return;

      IsHover = false;
      ProcessImages[11].visible = false;
      HoverNumber = -1;
      $("html").css("cursor", "default");

      UpdateImage();
    }
  );
}

// 공정 마우스 클릭 이벤트
function ProcessClickEvent() {
  $(".process1").click(function () {
    if (IsCenterMove || !IsAlphaAnimationEnd) return;

    IsHover = false;
    IsClick = true;
    $("html").css("cursor", "default");
    $("#canvas-pop-area").css("visibility", "visible");
    HoverNumber = 0;
    ProcessImages[4].visible = false;
    ProcessImages[5].visible = true;
    ProcessImages[5].width = ProcessImages[5].width * 1.1;
    ProcessImages[5].height = ProcessImages[5].height * 1.1;
    ProcessSelect = 4;
    UpdateImage();
  });

  $(".process2").click(function () {
    if (IsCenterMove || !IsAlphaAnimationEnd) return;
    IsHover = false;
    IsClick = true;
    $("html").css("cursor", "default");
    $("#canvas-pop-area").css("visibility", "visible");
    HoverNumber = 1;
    ProcessImages[2].visible = false;
    ProcessImages[3].visible = true;
    ProcessImages[3].width = ProcessImages[3].width * 1.1;
    ProcessImages[3].height = ProcessImages[3].height * 1.1;
    ProcessSelect = 2;
    UpdateImage();
  });

  $(".process3").click(function () {
    if (IsCenterMove || !IsAlphaAnimationEnd) return;
    IsHover = false;
    IsClick = true;
    $("html").css("cursor", "default");
    $("#canvas-pop-area").css("visibility", "visible");
    HoverNumber = 2;
    ProcessImages[6].visible = false;
    ProcessImages[7].visible = true;
    ProcessImages[7].width = ProcessImages[7].width * 1.1;
    ProcessImages[7].height = ProcessImages[7].height * 1.1;
    ProcessSelect = 6;
    UpdateImage();
  });

  $(".process4").click(function () {
    if (IsCenterMove || !IsAlphaAnimationEnd) return;
    IsHover = false;
    IsClick = true;
    $("html").css("cursor", "default");
    $("#canvas-pop-area").css("visibility", "visible");
    HoverNumber = 3;
    ProcessImages[8].visible = false;
    ProcessImages[9].visible = true;
    ProcessImages[9].width = ProcessImages[9].width * 1.1;
    ProcessImages[9].height = ProcessImages[9].height * 1.1;
    ProcessSelect = 8;
    UpdateImage();
  });

  $(".process5").click(function () {
    if (IsCenterMove || !IsAlphaAnimationEnd) return;
    IsHover = false;
    IsClick = true;
    $("html").css("cursor", "default");
    $("#canvas-pop-area").css("visibility", "visible");
    HoverNumber = 4;
    ProcessImages[10].visible = false;
    ProcessImages[11].visible = true;
    ProcessImages[11].width = ProcessImages[11].width * 1.1;
    ProcessImages[11].height = ProcessImages[11].height * 1.1;
    ProcessSelect = 10;
    UpdateImage();
  });
}

// 업데이트 호출 함수
function StartUpdate() {
  UpdateInterval = setInterval(Update, 80);
}

// 업데이트 함수
function Update() {
  UpdateImage();
  //   if (MediaDeleteCheck == false) {
  //     MediaDeleteCheck = true;
  //     // $("#media-area").html("");
  //     $("#vedio-area").html("");
  //   }
}

//이미지 로드 함수
function LoadImage() {
  ppl_pohang_process1 = new Image();
  ppl_pohang_process1.src = "./img/PPL_digitalTwin_pohang_01.png";
  ppl_pohang_process1.addEventListener(
    "load",
    function () {
      ppl_pohang_process1_hover = new Image();
      ppl_pohang_process1_hover.src = "./img/PPL_digitalTwin_pohang_out01.png";
      ppl_pohang_process1_hover.addEventListener(
        "load",
        function () {
          ppl_pohang_process2 = new Image();
          ppl_pohang_process2.src = "./img/PPL_digitalTwin_pohang_02.png";
          ppl_pohang_process2.addEventListener(
            "load",
            function () {
              ppl_pohang_process2_hover = new Image();
              ppl_pohang_process2_hover.src =
                "./img/PPL_digitalTwin_pohang_out02.png";
              ppl_pohang_process2_hover.addEventListener(
                "load",
                function () {
                  ppl_pohang_process3 = new Image();
                  ppl_pohang_process3.src =
                    "./img/PPL_digitalTwin_pohang_03.png";
                  ppl_pohang_process3.addEventListener(
                    "load",
                    function () {
                      ppl_pohang_process3_hover = new Image();
                      ppl_pohang_process3_hover.src =
                        "./img/PPL_digitalTwin_pohang_out03.png";
                      ppl_pohang_process3_hover.addEventListener(
                        "load",
                        function () {
                          ppl_pohang_process4 = new Image();
                          ppl_pohang_process4.src =
                            "./img/PPL_digitalTwin_pohang_04.png";
                          ppl_pohang_process4.addEventListener(
                            "load",
                            function () {
                              ppl_pohang_process4_hover = new Image();
                              ppl_pohang_process4_hover.src =
                                "./img/PPL_digitalTwin_pohang_out04.png";
                              ppl_pohang_process4_hover.addEventListener(
                                "load",
                                function () {
                                  ppl_pohang_process5 = new Image();
                                  ppl_pohang_process5.src =
                                    "./img/PPL_digitalTwin_pohang_05.png";
                                  ppl_pohang_process5.addEventListener(
                                    "load",
                                    function () {
                                      ppl_pohang_process5_hover = new Image();
                                      ppl_pohang_process5_hover.src =
                                        "./img/PPL_digitalTwin_pohang_out05.png";
                                      ppl_pohang_process5_hover.addEventListener(
                                        "load",
                                        function () {
                                          ppl_gwangyang_process1 = new Image();
                                          ppl_gwangyang_process1.src =
                                            "./img/PPL_digitalTwin_Gwangyang_01.png";
                                          ppl_gwangyang_process1.addEventListener(
                                            "load",
                                            function () {
                                              ppl_gwangyang_process1_hover =
                                                new Image();
                                              ppl_gwangyang_process1_hover.src =
                                                "./img/PPL_digitalTwin_Gwangyang_out01.png";
                                              ppl_gwangyang_process1_hover.addEventListener(
                                                "load",
                                                function () {
                                                  ppl_gwangyang_process2 =
                                                    new Image();
                                                  ppl_gwangyang_process2.src =
                                                    "./img/PPL_digitalTwin_Gwangyang_02.png";
                                                  ppl_gwangyang_process2.addEventListener(
                                                    "load",
                                                    function () {
                                                      ppl_gwangyang_process2_hover =
                                                        new Image();
                                                      ppl_gwangyang_process2_hover.src =
                                                        "./img/PPL_digitalTwin_Gwangyang_out02.png";
                                                      ppl_gwangyang_process2_hover.addEventListener(
                                                        "load",
                                                        function () {
                                                          ppl_gwangyang_process3 =
                                                            new Image();
                                                          ppl_gwangyang_process3.src =
                                                            "./img/PPL_digitalTwin_Gwangyang_03.png";
                                                          ppl_gwangyang_process3.addEventListener(
                                                            "load",
                                                            function () {
                                                              ppl_gwangyang_process3_hover =
                                                                new Image();
                                                              ppl_gwangyang_process3_hover.src =
                                                                "./img/PPL_digitalTwin_Gwangyang_out03.png";
                                                              ppl_gwangyang_process3_hover.addEventListener(
                                                                "load",
                                                                function () {
                                                                  ppl_gwangyang_process4 =
                                                                    new Image();
                                                                  ppl_gwangyang_process4.src =
                                                                    "./img/PPL_digitalTwin_Gwangyang_04.png";
                                                                  ppl_gwangyang_process4.addEventListener(
                                                                    "load",
                                                                    function () {
                                                                      ppl_gwangyang_process4_hover =
                                                                        new Image();
                                                                      ppl_gwangyang_process4_hover.src =
                                                                        "./img/PPL_digitalTwin_Gwangyang_out04.png";
                                                                      ppl_gwangyang_process4_hover.addEventListener(
                                                                        "load",
                                                                        function () {
                                                                          ppl_all_gwangyang_process =
                                                                            new Image();
                                                                          ppl_all_gwangyang_process.src =
                                                                            "./img/PPL_digitalTwin_Gwangyang_bg.png";
                                                                          ppl_all_gwangyang_process.addEventListener(
                                                                            "load",
                                                                            function () {
                                                                              ppl_all_gwangyang_process_digital =
                                                                                new Image();
                                                                              ppl_all_gwangyang_process_digital.src =
                                                                                "./img/PPL_digitalTwin_Gwangyang_00.png";
                                                                              ppl_all_gwangyang_process_digital.addEventListener(
                                                                                "load",
                                                                                function () {
                                                                                  ppl_all_pohang_process =
                                                                                    new Image();
                                                                                  ppl_all_pohang_process.src =
                                                                                    "./img/PPL_digitalTwin_pohang_bg.png";
                                                                                  ppl_all_pohang_process.addEventListener(
                                                                                    "load",
                                                                                    function () {
                                                                                      ppl_all_pohang_process_digital =
                                                                                        new Image();
                                                                                      ppl_all_pohang_process_digital.src =
                                                                                        "./img/PPL_digitalTwin_pohang_00.png";
                                                                                      ppl_all_pohang_process_digital.addEventListener(
                                                                                        "load",
                                                                                        function () {
                                                                                          ppl_digital_twin_background =
                                                                                            new Image();
                                                                                          ppl_digital_twin_background.src =
                                                                                            "./img/digitalTwin_B_BG.png";
                                                                                          ppl_digital_twin_background.addEventListener(
                                                                                            "load",
                                                                                            function () {
                                                                                              ppl_hover_text =
                                                                                                new Image();
                                                                                              ppl_hover_text.src =
                                                                                                "./img/ppl_hover_text.png";
                                                                                              ppl_hover_text.addEventListener(
                                                                                                "load",
                                                                                                function () {
                                                                                                  ppl_hover_text2 =
                                                                                                    new Image();
                                                                                                  ppl_hover_text2.src =
                                                                                                    "./img/ppl_hover_text2.png";
                                                                                                  ppl_hover_text2.addEventListener(
                                                                                                    "load",
                                                                                                    function () {
                                                                                                      ppl_hover_text3 =
                                                                                                        new Image();
                                                                                                      ppl_hover_text3.src =
                                                                                                        "./img/ppl_hover_text3.png";
                                                                                                      ppl_hover_text3.addEventListener(
                                                                                                        "load",
                                                                                                        function () {
                                                                                                          ppl_hover_text4 =
                                                                                                            new Image();
                                                                                                          ppl_hover_text4.src =
                                                                                                            "./img/ppl_hover_text4.png";
                                                                                                          ppl_hover_text4.addEventListener(
                                                                                                            "load",
                                                                                                            function () {
                                                                                                              ppl_hover_text5 =
                                                                                                                new Image();
                                                                                                              ppl_hover_text5.src =
                                                                                                                "./img/ppl_hover_text5.png";
                                                                                                              ppl_hover_text5.addEventListener(
                                                                                                                "load",
                                                                                                                function () {
                                                                                                                  ppl_hover_text6 =
                                                                                                                    new Image();
                                                                                                                  ppl_hover_text6.src =
                                                                                                                    "./img/ppl_hover_text6.png";
                                                                                                                  ppl_hover_text6.addEventListener(
                                                                                                                    "load",
                                                                                                                    function () {
                                                                                                                      SetProcessImage();
                                                                                                                    },
                                                                                                                    false
                                                                                                                  );
                                                                                                                },
                                                                                                                false
                                                                                                              );
                                                                                                            },
                                                                                                            false
                                                                                                          );
                                                                                                        },
                                                                                                        false
                                                                                                      );
                                                                                                    },
                                                                                                    false
                                                                                                  );
                                                                                                },
                                                                                                false
                                                                                              );
                                                                                            },
                                                                                            false
                                                                                          );
                                                                                        },
                                                                                        false
                                                                                      );
                                                                                    },
                                                                                    false
                                                                                  );
                                                                                },
                                                                                false
                                                                              );
                                                                            },
                                                                            false
                                                                          );
                                                                        },
                                                                        false
                                                                      );
                                                                    },
                                                                    false
                                                                  );
                                                                },
                                                                false
                                                              );
                                                            },
                                                            false
                                                          );
                                                        },
                                                        false
                                                      );
                                                    },
                                                    false
                                                  );
                                                },
                                                false
                                              );
                                            },
                                            false
                                          );
                                        },
                                        false
                                      );
                                    },
                                    false
                                  );
                                },
                                false
                              );
                            },
                            false
                          );
                        },
                        false
                      );
                    },
                    false
                  );
                },
                false
              );
            },
            false
          );
        },
        false
      );
    },
    false
  );
}

//공정과정 이미지 셋팅 함수
function SetProcessImage() {
  for (var i = 0; i < ProcessImages.length; i++) {
    switch (ProcessImages[i].imageType) {
      case 0:
        ProcessImages[i].imageType = ppl_pohang_process2_hover;
        break;
      case 1:
        ProcessImages[i].imageType = ppl_all_pohang_process;
        break;
      case 2:
        ProcessImages[i].imageType = ppl_all_pohang_process_digital;
        break;
      case 3:
        ProcessImages[i].imageType = ppl_pohang_process2;
        break;
      case 4:
        ProcessImages[i].imageType = ppl_pohang_process1;
        break;
      case 5:
        ProcessImages[i].imageType = ppl_pohang_process1_hover;
        break;
      case 6:
        ProcessImages[i].imageType = ppl_pohang_process3;
        break;
      case 7:
        ProcessImages[i].imageType = ppl_pohang_process3_hover;
        break;
      case 8:
        ProcessImages[i].imageType = ppl_pohang_process4;
        break;
      case 9:
        ProcessImages[i].imageType = ppl_pohang_process4_hover;
        break;
      case 10:
        ProcessImages[i].imageType = ppl_pohang_process5;
        break;
      case 11:
        ProcessImages[i].imageType = ppl_pohang_process5_hover;
        break;
      case 12:
        ProcessImages[i].imageType = ppl_all_gwangyang_process;
        break;
      case 13:
        ProcessImages[i].imageType = ppl_all_gwangyang_process_digital;
        break;
      case 14:
        ProcessImages[i].imageType = ppl_gwangyang_process1;
        break;
      case 15:
        ProcessImages[i].imageType = ppl_gwangyang_process1_hover;
        break;
      case 16:
        ProcessImages[i].imageType = ppl_gwangyang_process2;
        break;
      case 17:
        ProcessImages[i].imageType = ppl_gwangyang_process2_hover;
        break;
      case 18:
        ProcessImages[i].imageType = ppl_gwangyang_process3;
        break;
      case 19:
        ProcessImages[i].imageType = ppl_gwangyang_process3_hover;
        break;
      case 20:
        ProcessImages[i].imageType = ppl_gwangyang_process4;
        break;
      case 21:
        ProcessImages[i].imageType = ppl_gwangyang_process4_hover;
        break;
    }
  }
}

// 이미지 업데이트
function UpdateImage() {
  DrawBackGround();
  DrawProcess();
  ViewContext.drawImage(BufferCanvas, 0, 0); // ViewCanvas에 복사
}

// 그리드 이미지
function DrawBackGround() {
  BufferContext.drawImage(
    ppl_digital_twin_background,
    0,
    0,
    1046,
    523,
    0,
    0,
    1046,
    523
  );
}

// 공정 과정 그리기
function DrawProcess() {
  var opacitiyCount = 0;
  for (var i = 0; i < ProcessImages.length; i++) {
    if (ProcessImages[i].visible == false) continue;

    ProcessImages[i].opacitiy += ProcessImages[i].opacitiyspeed;
    if (ProcessImages[i].opacitiy >= 1) {
      ProcessImages[i].opacitiy = 1;
    } else {
      opacitiyCount++;
    }

    if (ProcessImages[i].opacitiy >= 0)
      BufferContext.globalAlpha = ProcessImages[i].opacitiy;
    else BufferContext.globalAlpha = 0;

    BufferContext.drawImage(
      ProcessImages[i].imageType,
      ProcessImages[i].imageWidth * ProcessImages[i].xIndex,
      ProcessImages[i].imageHeight * ProcessImages[i].yIndex,
      ProcessImages[i].imageWidth,
      ProcessImages[i].imageHeight,
      ProcessImages[i].xpos - ProcessImages[i].width / 2,
      ProcessImages[i].ypos - ProcessImages[i].height / 2,
      ProcessImages[i].width,
      ProcessImages[i].height
    );

    BufferContext.globalAlpha = 1;
  }

  if (HoverNumber != -1) {
    var image;
    if (HoverInfo[HoverNumber].dir == 0) image = ppl_hover_text;
    if (HoverInfo[HoverNumber].dir == 1 && IsPohangData)
      image = ppl_hover_text2;
    if (HoverInfo[HoverNumber].dir == 1 && !IsPohangData)
      image = ppl_hover_text6;
    if (HoverInfo[HoverNumber].dir == 2) image = ppl_hover_text3;
    if (HoverInfo[HoverNumber].dir == 3) image = ppl_hover_text4;
    if (HoverInfo[HoverNumber].dir == 4) image = ppl_hover_text5;

    BufferContext.drawImage(
      image,
      0,
      0,
      HoverInfo[HoverNumber].imageWidth,
      HoverInfo[HoverNumber].imageHeight,
      HoverInfo[HoverNumber].xpos - HoverInfo[HoverNumber].width / 2,
      HoverInfo[HoverNumber].ypos - HoverInfo[HoverNumber].height / 2,
      HoverInfo[HoverNumber].width,
      HoverInfo[HoverNumber].height
    );
  }

  if (opacitiyCount == 0) {
    IsAlphaAnimationEnd = true;
    clearInterval(UpdateInterval);
  }
}

// // 동영상 사이즈 갱신
// function MediaResize() {
//   $("#media").css("width", $("#media-area").css("width"));
// }

// 이미지 터치 영역 갱신
function TouchResize() {
  var widthrate = $("#click-area").css("width").replace("px", "") / 1046;
  var heightrate = $("#click-area").css("height").replace("px", "") / 523;

  for (var i = 1; i < COORDS.length + 1; i++) {
    var coords = COORDS[i - 1];
    var temp = coords[0].split(",");
    var int_temp = [];

    for (var index = 0; index < temp.length; index++) {
      if (index % 2 == 0) {
        int_temp[index] = Number(temp[index]) * widthrate;
      } else {
        int_temp[index] = Number(temp[index]) * heightrate;
      }
    }

    var result = "";

    for (var index = 0; index < int_temp.length; index++) {
      result += int_temp[index].toString();
      if (index != int_temp.length - 1) result += ",";
    }
    document.getElementsByClassName("process" + i.toString())[0].coords =
      result;
  }
}

//일반
$(function () {
  let mianWdth;

  mianWdth = $(".ppl").innerWidth();

  $(window).on("resize", function () {
    mianWdth = $(".ppl").innerWidth();
    chgSet();
    TouchResize(); //digital twin Touch area update
    // MediaResize();
  });

  function chgSet() {
    if (mianWdth > 1500) {
      $(".ppl").removeClass("mid");
      $(".ppl").removeClass("low");
    } else if (mianWdth <= 1500 && mianWdth > 1300) {
      $(".ppl").addClass("mid");
      $(".ppl").removeClass("low");
    } else if (mianWdth <= 1300) {
      $(".ppl").removeClass("mid");
      $(".ppl").addClass("low");
    } else {
      return false;
    }
  }

  chgSet();
  TouchResize();
  //   MediaResize();
});

//광양 포항 전환버튼
$(function () {
  $(".mvButton").click(function () {
    $(".mvButton").removeClass("big");
    $(this).addClass("big");
  });
});
//광양 포항 전환버튼
