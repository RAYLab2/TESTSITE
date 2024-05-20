// "use strict";

////////////////////////////////////
///// 광양 제철소 Json Data //////////
//////////////////////////////////

var worksArea = "광양제철소"; // 지역

var mainTipDialog = null;
var isMainScene = true;
var isJsonFileLoad = false;
var nextSceneName = undefined;
var currentOverMesh = null;
var showName = false;
var currentScene = null;
var plantFlag = "./Site_K";
var cameraViewChange = false;
var onceCheck = false;
var showUIFlag = 2;
var bChange = false;
var bAnimationPlay = true;
var bFocus = false;
var bLoadingComplete = false;

function LoadingScreen(canvas) {
  bLoadingComplete = false;
  this._loadingDiv = null;
  this._loadingTextDiv = null;
  this._renderingCanvas = canvas;
}

LoadingScreen.prototype.displayLoadingUI = function () {
  if (this._loadingDiv) {
    // Do not add a loading screen if there is already one
    return;
  }

  //// 로딩 씬 구성...
  this._loadingDiv = document.createElement("div");
  // let canvasPositioning = window.getComputedStyle(this._renderingCanvas).position;

  this._loadingDiv.id = "babylonjsLoadingDiv";
  this._loadingDiv.style.opacity = "255";
  this._loadingDiv.style.transition = "opacity 0.5s ease";
  this._loadingDiv.style.pointerEvents = "none";

  // Loading text
  this._loadingTextDiv = document.createElement("div");
  this._loadingTextDiv.style.position = "absolute";
  this._loadingTextDiv.style.left = "0";
  this._loadingTextDiv.style.top = "50%";
  this._loadingTextDiv.style.marginTop = "80px";
  this._loadingTextDiv.style.width = "100%";
  this._loadingTextDiv.style.height = "20px";
  this._loadingTextDiv.style.fontFamily = "Malgun Gothic";
  this._loadingTextDiv.style.fontSize = "20px";
  this._loadingTextDiv.style.color = "#00588a";
  this._loadingTextDiv.style.textAlign = "center";
  //this._loadingTextDiv.style.letterSpacing = "100px";
  this._loadingTextDiv.innerHTML = "Loading...";
  this._loadingDiv.appendChild(this._loadingTextDiv);

  //set the predefined text
  //this._loadingTextDiv.innerHTML = this._loadingText;

  // // Generating keyframes
  // let style = document.createElement('style');
  // style.type = 'text/css';
  // let keyFrames =
  //     `@-webkit-keyframes spin1 {\
  //         0% { -webkit-transform: rotate(0deg);}
  //         100% { -webkit-transform: rotate(360deg);}
  //     }\
  //     @keyframes spin1 {\
  //         0% { transform: rotate(0deg);}
  //         100% { transform: rotate(360deg);}
  //     }`;
  // style.innerHTML = keyFrames;
  // document.getElementsByTagName('head')[0].appendChild(style);

  // Loading img
  let imgBack = new Image();
  imgBack.src = plantFlag + "/model/Textures/posco_ci.png";
  //imgBack.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADEAAAAzCAYAAAA+VOAXAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyJpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuMy1jMDExIDY2LjE0NTY2MSwgMjAxMi8wMi8wNi0xNDo1NjoyNyAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENTNiAoV2luZG93cykiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6QTYxODlEMUQ0NkJCMTFFODhERUFGRDZFRTM2MEVENTEiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6QTYxODlEMUU0NkJCMTFFODhERUFGRDZFRTM2MEVENTEiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDpBNjE4OUQxQjQ2QkIxMUU4OERFQUZENkVFMzYwRUQ1MSIgc3RSZWY6ZG9jdW1lbnRJRD0ieG1wLmRpZDpBNjE4OUQxQzQ2QkIxMUU4OERFQUZENkVFMzYwRUQ1MSIvPiA8L3JkZjpEZXNjcmlwdGlvbj4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gPD94cGFja2V0IGVuZD0iciI/PmezyUAAAAhYSURBVHja1FprbFTXEZ67bz92Dfuwl7JejISCCUYJMZA0YEqUqJRg/Egogio/oiQ/2x/pD6okv0uk5EciVX1FqVSpapU2BT8IJU4aKcEmbTEOtCLBkDTAehHrfdjGz31v5zu7d/eusene3ZsAIx2d+zpz5jtnZs7M7EqZTIZAfxs8QwoycevKte9y+07u2bdNs9z83M5x6+HWxy2++CPDEgO7ub3W4LCvc9lXUJ21hkwmE+kk6VtHkEqla6PxePPs3HxzcGLyUDAy+RU//hm3Y8uB0HM74rKvPOxxu8heZ6M7TXq9jmqqLKI1OO00cXN63fVA6CgDeo1fvwyci0Ec8bjrD6/zrubBerobCQtbV8ua4TMe9geClNsV0uXsYX+9Y+VdDaCwO3qCnJCXb/cLEAwABvuGp6H+rgegBAJ5md6Ew8FO/NDtdHhW1lnpXiLI63Y5VvPlAdhEF7yQFhQOhejSpVHyXbtGoWCQ5ufnKBqNksVioerqGnLVu8i7ponWr28mp8tV8XyulSsoEIp0AcRWGxtLuYRz5tLoRRo6dYr8/rElvwEQtImJCH87Sh8OvE8eTyPt2LmT1jdvIKlM952TewtAuE1GY1lMIuEwHe/rpatXr6geC8Dv/OmP1NS0lto7u8jpdKrmYTIJuVcBhFmnU78Sn1+4QH09RykejxcZ3AMPbubVbWbVqRcqBFXCLkC1oGLYiX+fP8cHmXDxYgHe+vUvqbP7adrY0qJKhtwBbDKUswMjZ4fpvf4+kkMW0Pd/sIe2bnuYjEvsKoCg2e0OoT579rbT8Jl/0QfvnxTvsRB//cs7DLaTWrdsVS2PahBffH6BThzvzwNwsYFiFT2NjSXzANBHt+8gr3eN2M0QOwTwA1+A3diySd2OqLWBvp5jlE6nxX1jo5f2HzioCoCSMA7jwQcEvv29PWKebwQEVgpGHIvFxD1c5N6ODmpwuytykxgPPrAhEPhjHqWqagYCblTphTq7nyK3e1XlkSpv6rx5FbU+3p1/hnkwn+Y2cXpwsMiIZRVQSwl2SscvE12OZNt/J9mw+dljTV5qZ76ysWO+5g33a7cTOInHxnzZATqd8ELlEqzpxJec3VwiuhjOAgDVcAQHvuAPwnyYVzMQCCVkenDzQ0u60VLJzDHmL/Zw7FNV/Nxqynot8FeqsGYgEAvJhIOsyOC5jc+qCFMQMv+TaHKh+Hmt6Vb+Pp9POxA4afNBV86LCJfLgrw4QPQMZ78/H8wKeFtV4g+O8HfvXS48a7QV1Gkxf+W8FRv23FxhqWtqakU/5MsKPhXNPpcFe7mNSFoGwKtDxQDa7yN6aQfRr4b5zLAW8188b8Ug5LMhO8JMr39K1HPx1pVfDshyAOTvfrxNYTNm89LzVqpOSsbPH43RMQWAtZyKPL62GMgRhWr9PwC3WzDlvBXvBLZYZn5jgrfYaBYCdG8g+gmvook9TpWxIKjcQ1XUAFhOdTUBAWNDQiO8SCJIJqtDCNKmOO8gsBIA+vMBzhumSwdwOydSsTp5vQVpN0qj9IfuYgDZ2D4LBILmEx+VALJnw+iS81YMAjlAPjcIn6M6Y2KZJOVWIGoAJBIJOn/usyXnrRgEIlbkxMJQOSNDQrN8tpUVGIJvdpcOAAS+yjC/1GJCyQEgknrkxCAEaUholssjIPArbSpz7rGxfPAH2t5WOoOSQ3Fs7Zqmpvx9X+8xCgRuaFLqAZ/+3kKNGPOUqkqqQKCs0tHZLSrkshc50d9P44FARQAwHnyCOa8E/vt4HjVlHFXpqcPpFMmQMlxGgg9VKIcwDuOVYX5H11Oqyzc6tRMjid+7ryO/Ukjy337rN/Tp6SHhXUpKjPi7f5w+LcaFcjkD+IFvy6ZNqhejrJINyioWS1VR3QlG+dGHH+TqThtEyRInLkIHnPY4iUPBkMgRlHUnWYXKqTtVBCK7Iy2cY7upv6+Hrl29ms2XWbDPRs6KVirBiGED5VQAKwYh28izz70gVnfw1Cd03e8veexqj4d2tH2P8+jya7GagJB1GQk9mqiKM6AzfGjdnJpaWvjVHup+er8mVXHNQCw+2dEeeXQ7/f53b+e9Tj6L41P42edf0PzHHHinGaWRaUEQ8sChQ2S1Fn68tFqt4pmWANLZAlscIG7ESnSNaggAZKEFqIM/KgKlBcXjQu4bUKf/zM4t3FdtsWgOBOrzZPu+7LXXqzn/6dk5dGcBojc0MYVfT+mboHJK9aVSaFI4j16o07uBcMQ/eXOG7iWCvIFQ5Drk1z3Ztg1H7k/940H8DeGeAAA5IS/Ti6gtiNiJgbwbjEy+/pXPr6qkficI0kFOyItdEN5w165d5HA49F+OXhxaSJJjbiG6xWgwUJXFfFeqEACwGv02NhV66bFHtqR9gXBGOnnypIUJKRqqR7a4ZNyZ0hkONjj52LKvIFttNZk5QJPuwL9soBUxDjCnZ+eJnQ+Nh8MhfTr5Z1Mm8QmcE7cr0Wh0TBoeHrbPzMw8wULuQjiEoJKvqxKkb0xJhoa0JNVmSDJRaWmy5jgkysR1mcysPpMcN1JqjIGhFA07jvD1x3yI/t0QDofneSfwpyj4Kxu/qOa+ykDJakMmiQI8moWBmfmdOdcDqBE9v0Od38D3Bk7y9dzr0PgdmoQdxIpyjxs+ZDOicQKU4j7JY9ES/C7O93If4z6Gnt+h2gvBF9ge5gGC381jJ7i/AvkNDCDa2tr69cDAgM/r9eqnp6eNLIyBSW80GhEjGDgs4UNXr0PPTPSykLmwRcffQ3AlQWiJv5dkR8FCZ6hQ3czwmAyIn6ezEUQmLYPEUJ4vlUwm0+gBlBMp3Kf4+6TNZkv4fL7U7t27kyMjI6n/CTAAB6e3KeRWfNUAAAAASUVORK5CYII=";
  imgBack.style.position = "absolute";
  imgBack.style.left = "50%";
  imgBack.style.top = "50%";
  imgBack.style.marginLeft = "-128px";
  imgBack.style.marginTop = "-34px";
  imgBack.style.animation = "spin1 2s infinite ease-in-out";
  imgBack.style.webkitAnimation = "spin1 2s infinite ease-in-out";
  imgBack.style.transformOrigin = "50% 50%";
  imgBack.style.webkitTransformOrigin = "50% 50%";

  this._loadingDiv.appendChild(imgBack);
  this._resizeLoadingUI();
  window.addEventListener("resize", this._resizeLoadingUI);
  this._loadingDiv.style.backgroundColor = "white";
  document.body.appendChild(this._loadingDiv);
  this._loadingDiv.style.opacity = "1";
};

// Resize
LoadingScreen.prototype._resizeLoadingUI = function () {
  if (!this._loadingDiv) {
    return;
  }

  let canvasRect = this._renderingCanvas.getBoundingClientRect();
  let canvasPositioning = window.getComputedStyle(
    this._renderingCanvas
  ).position;

  this._loadingDiv.style.position =
    canvasPositioning === "fixed" ? "fixed" : "absolute";
  this._loadingDiv.style.left = canvasRect.left + "px";
  this._loadingDiv.style.top = canvasRect.top + "px";
  this._loadingDiv.style.width = canvasRect.width + 1 + "px";
  this._loadingDiv.style.height = canvasRect.height + 50 + "px";
};

LoadingScreen.prototype.hideLoadingUI = function () {
  bLoadingComplete = true;
  //console.log(window.hasFocus());
  console.log(document.activeElement.id);

  if (!this._loadingDiv) {
    return;
  }

  this._loadingDiv.style.opacity = "0";
  this._loadingDiv.addEventListener(
    "transitionend",
    function () {
      if (!this._loadingDiv) {
        return;
      }

      document.body.removeChild(this._loadingDiv);
      window.removeEventListener("resize", this._resizeLoadingUI);
      this._loadingDiv = null;
    }.bind(this)
  );
};

var SetAnimationPlay = function (bPlay) {
  bAnimationPlay = bPlay;
  if (bAnimationPlay) animationPlay();
  else animationPause();
};

var animationPause = function () {
  //if(!bAnimationPlay) return;

  if (currentScene === null || currentScene.isDisposed) {
    return;
  }

  for (let i = 0; i < currentScene.animationGroups.length; ++i) {
    currentScene.animationGroups[i].pause();
  }
};

var animationPlay = function () {
  if (!bAnimationPlay) return;

  if (currentScene === null || currentScene.isDisposed) {
    return;
  }

  for (let i = 0; i < currentScene.animationGroups.length; ++i) {
    currentScene.animationGroups[i].play();
  }
};

var createMainGUI = function (scene, jsonData) {
  let mainUI = UIDialog.GetInstance().CreateContainer("mainUI");
  mainUI.isHitTestVisible = false;

  //   let fitButton = UIDialog.GetInstance().CreateSimpleImageButton(
  //     "Fit",
  //     plantFlag + "/model/icon/btn_prev_default.png",
  //     mainUI
  //   );
  //   fitButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //   fitButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //   fitButton.paddingTop = "5px";
  //   fitButton.paddingLeft = "5px";
  //   fitButton.width = "32px";
  //   fitButton.height = "32px";

  //   fitButton.onPointerDownObservable.add(function () {
  //     scene.activeCamera._restoreStateValues();
  //   });

  //let fitButton1 = UIDialog.GetInstance().CreateSimpleImageButton("Fit", plantFlag + "/model/icon/btn_prev_default.png",mainUI);
  //fitButton1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //fitButton1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //fitButton1.paddingTop = "5px";
  //fitButton1.paddingLeft = "5px";
  //fitButton1.left = "36px";
  //fitButton1.width = "32px";
  //fitButton1.height = "32px";
  // let _bPlay = true;
  // fitButton1.onPointerDownObservable.add(function(){

  //     SetAnimationPlay(_bPlay);
  //     _bPlay = !_bPlay;

  //     //scene.animationGroups.restart
  //     //scene.animationGroups.reset
  //     //scene.animationGroups.stop
  //     //scene.animationGroups.pause

  // //window.open("http://doc.babylonjs.com/");//
  //     // var steelworks1 ={};
  //     // steelworks1.kpi_data = [ { title : "가동율",date : "2018.05.18",value : "98 %"},{title : "생산량", date : "2018.05.18", value : "233,231,232,130,154 ton"} ];
  //     // // steelworks.fac_list = [ "KSG01", "KSG02", "KSG03","KSG04", "KSG05", "KGR01","KGR02","KGR03","KGR04", "KGR05",
  //     // //                         "KJG01","KJG02","KYJ01","KYJ02","KYY01","KYY02","KYY03","KYY04","KNY01","KNY02","KNY03","KNY04",
  //     // //                         "KEL01","KEL02","KCL01","KCL04","KHP01","KJG03","KYJ03","KCM01"];

  //     // steelworks1.smartization_fac = [ "KYY03", "KHP01"];//, "KJG03" ];//, "KYJ03" ];
  //     // steelworks1.area_data = [
  //     //     {id : "KYY03",name : "3열연", stat: 1, message : ["3열련>전로,공정장애,32분 경과"] },
  //     //     {id : "KHP01",name : "후판", stat: 2,message : ["5제강>전로>2전로,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과"]},
  //     //     //{id : "KJG03",name : "3제강", stat: 3,message : ["3제강>전로>2전로,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과","5제강>전로>2전로,공정장애,32분 경과"]},
  //     //     //{id : "KYJ03",name : "3연주", stat: 0 },

  //     //     {id : "KSG01",name : "1소결", stat: 1, message : ["3열련>전로,공정장애,32분 경과"]},
  //     //     {id : "KSG02",name : "2소결", stat: 2,message : ["5제강>전로>2전로,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과"]},
  //     //     {id : "KSG03",name : "3소결", stat: 3,message : ["3제강>전로>2전로,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과","5제강>전로>2전로,공정장애,32분 경과"]},
  //     //     {id : "KSG04",name : "4소결", stat: 0 },
  //     //     {id : "KGR01",name : "1고로",stat: 2, message : ["1냉연>압연,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과"] },

  //     //     {id : "KYY01",name : "1열연",stat: 1, message : ["1냉연>압연,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과"]},

  //     //     {id : "KCL04",name : "4CGL",stat: 1, message : ["1냉연>압연,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과"]},
  //     //     {id : "KJG02",name : "2제강",stat: 3, message : ["1냉연>압연,공정장애,32분 경과","3제강>전로>2전로,공정장애,32분 경과"]},
  //     // ];

  //     // steelworks1.factoryop = [

  //     //     {fac_id : "KYY03",name : "3열연",kpi_data : [{icon_id: 1,title : "가동률",date : "2018.05.18",value : "90.9 %", },{icon_id: 2,title : "작업률",date : "2018.05.18",value : "98 %"},{icon_id: 3,title : "생상량",date : "2018.05.18",value : "525,234,234,332,123 ton"},{icon_id: 4,title : "품질부적합률",date : "2018.05.18",value : "98 %"}]},
  //     //     {fac_id : "KHP01",name : "후판",kpi_data : [{icon_id: 1,title : "가동률",date : "2018.05.18",value : "90.9 %", },{icon_id: 2,title : "작업률",date : "2018.05.18",value : "98 %"},{icon_id: 3,title : "생상량",date : "2018.05.18",value : "525,234,234,332,123 ton"},{icon_id: 4,title : "품질부적합률",date : "2018.05.18",value : "98 %"}]},
  //     //     {fac_id : "KJG03",name : "3제강",kpi_data : [{icon_id: 1,title : "가동률",date : "2018.05.18",value : "90.9 %", },{icon_id: 2,title : "작업률",date : "2018.05.18",value : "98 %"},{icon_id: 3,title : "생상량",date : "2018.05.18",value : "525,234,234,332,123 ton"},{icon_id: 4,title : "품질부적합률",date : "2018.05.18",value : "98 %"}]},
  //     //     {fac_id : "KYJ03",name : "3연주",kpi_data : [{icon_id: 1,title : "가동률",date : "2018.05.18",value : "90.9 %", },{icon_id: 2,title : "작업률",date : "2018.05.18",value : "98 %"},{icon_id: 3,title : "생상량",date : "2018.05.18",value : "525,234,234,332,123 ton"},{icon_id: 4,title : "품질부적합률",date : "2018.05.18",value : "98 %"}]}
  //     // ];

  //     // refreshData(steelworks1);
  // });

  let _x = 15;

  //   let statusInfoDialog = UIDialog.GetInstance().CreateDialog(
  //     "statusInfoDialog",
  //     275,
  //     32,
  //     mainUI
  //   );
  //   statusInfoDialog.horizontalAlignment =
  //     BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //   statusInfoDialog.verticalAlignment =
  //     BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //   statusInfoDialog.ChangeDialogBackgroundColor("#315871");
  //   statusInfoDialog.ChangeDialogBackgroundOpecity(0.2);
  //   statusInfoDialog.left = "10px";
  //   statusInfoDialog.top = "-10px";
  //   statusInfoDialog.MoveDialogLock(false);
  //   {
  //     let listName = ["계획정지", "공정장애", "설비/운전장애"];
  //     let iconName = [
  //       plantFlag + "/model/icon/ico_green_s.png",
  //       plantFlag + "/model/icon/ico_purple_s.png",
  //       plantFlag + "/model/icon/ico_red_s.png",
  //     ];
  //     for (let i = 0; i < listName.length; ++i) {
  //       let icon = UIDialog.GetInstance().CreateImage(
  //         "icon" + i,
  //         iconName[i],
  //         statusInfoDialog
  //       );
  //       icon.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //       icon.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  //       icon.isHitTestVisible = false;
  //       icon.left = _x + "px";
  //       icon.width = "10px";
  //       icon.height = "15px";

  //       let iconText = UIDialog.GetInstance().CreateTextBlock(
  //         "iconTextText" + i,
  //         statusInfoDialog
  //       );
  //       iconText.isHitTestVisible = false;
  //       iconText.textHorizontalAlignment =
  //         BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //       iconText.textVerticalAlignment =
  //         BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  //       iconText.left = _x + 15 + "px";
  //       iconText.color = "white";
  //       iconText.fontFamily = "Malgun Gothic";
  //       iconText.text = listName[i];
  //       iconText.fontSize = "12px";

  //       if (i === listName.length - 1) break;

  //       _x += 82;

  //       let line = UIDialog.GetInstance().CreateRectangle(
  //         "line" + i,
  //         1,
  //         9,
  //         statusInfoDialog
  //       );
  //       line.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  //       line.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //       line.isHitTestVisible = false;
  //       line.background = "white";
  //       line.alpha = 0.4;
  //       line.left = _x - 10 + "px";
  //     }
  //   }

  //   _x = -12;
  //   for (let i = 0; i < jsonData.kpi_data.length; ++i) {
  //     let dialog = UIDialog.GetInstance().CreateTitleDialog(
  //       "mainDialog" + i,
  //       180,
  //       80,
  //       mainUI
  //     );
  //     dialog.ChangeTitleDialogBackgroundColor("#315871");
  //     dialog.ChangeTitleDialogLineColor("#ffffff");
  //     dialog.ChangeTitleDialogBackgroundOpecity(0.8);
  //     dialog.ChangeTitleDialogLineOpecity(0.2);
  //     dialog.ChangeTitleDialogLineCenterOffset(-5);
  //     dialog.ChangeTitleDialogBackgroundCornerRadius(5);
  //     dialog.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //     dialog.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //     dialog.left = _x + "px";
  //     dialog.top = "-12px";
  //     dialog.MoveTitleDialogLock(false);
  //     {
  //       let titleText = UIDialog.GetInstance().CreateTextBlock(
  //         "titleText",
  //         dialog
  //       );
  //       titleText.textHorizontalAlignment =
  //         BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //       titleText.textVerticalAlignment =
  //         BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //       titleText.left = "14px";
  //       titleText.top = "10px";
  //       titleText.fontFamily = "Malgun Gothic";
  //       titleText.text = jsonData.kpi_data[i].title;
  //       titleText.color = "white";
  //       titleText.fontSize = "12px";

  //       let dateText = UIDialog.GetInstance().CreateTextBlock("dateText", dialog);
  //       dateText.textHorizontalAlignment =
  //         BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //       dateText.textVerticalAlignment =
  //         BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //       dateText.left = "-14px";
  //       dateText.top = "12px";
  //       dateText.fontFamily = "Malgun Gothic";
  //       dateText.color = "white";
  //       dateText.fontSize = "10px";
  //       dateText.text = jsonData.kpi_data[i].date;

  //       let rate = UIDialog.GetInstance().CreateTextBlock("rate", dialog);
  //       rate.textHorizontalAlignment =
  //         BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //       rate.textVerticalAlignment =
  //         BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //       rate.left = "-14px";
  //       rate.top = "-8px";
  //       rate.fontFamily = "Malgun Gothic";
  //       rate.color = "#fffac3";
  //       rate.fontSize = "20px";
  //       rate.text = jsonData.kpi_data[i].value;
  //       rate.fontStyle = "bold";

  //       let type = rate.text.match("%");
  //       if (type === null || type === undefined) {
  //         type = rate.text.match("ton");
  //       }

  //       if (type) {
  //         let stringSplit = rate.text.split(type[0]);
  //         if (stringSplit.length > 1) {
  //           let typeText = UIDialog.GetInstance().CreateTextBlock(
  //             "typeText",
  //             dialog
  //           );
  //           typeText.textHorizontalAlignment =
  //             BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //           typeText.textVerticalAlignment =
  //             BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //           typeText.left = "-14px";
  //           typeText.top = "-10px";
  //           typeText.fontFamily = "Malgun Gothic";
  //           typeText.color = "#fffac3";
  //           typeText.fontSize = "15px";
  //           typeText.fontStyle = "bold";
  //           typeText.text = type[0];

  //           let value = "";
  //           for (let n = 0; n < stringSplit.length - 1; ++n) {
  //             value += stringSplit[n];
  //           }
  //           rate.text = value;

  //           if ("%" === type[0]) rate.left = "-24px";
  //           else rate.left = "-34px";
  //         }
  //       }

  //       rate.onLinesReadyObservable.add(function (target) {
  //         let maxLineWidth = 0;
  //         for (let i = 0; i < target.lines.length; i++) {
  //           let line = target.lines[i];

  //           if (line.width > maxLineWidth) maxLineWidth = line.width;
  //         }

  //         if (maxLineWidth + 50 > 180) {
  //           target.parent.ChangeTitleDialogBackgroundSize(
  //             parseInt(maxLineWidth + 50),
  //             80
  //           );
  //           target.parent.ChangeTitleDialogLineSize(parseInt(maxLineWidth + 50));

  //           let _XX = -12;
  //           for (let t = 0; t < jsonData.kpi_data.length; ++t) {
  //             let _dialog = mainUI.getChildByName("mainDialog" + t);
  //             if (_dialog) {
  //               _dialog.left = _XX + "px";
  //             }
  //             _XX -= _dialog.widthInPixels + 10;
  //           }
  //         }
  //       });
  //     }
  //     _x -= dialog.widthInPixels + 10;
  //   }

  let _rect = {
    x: 25,
    y: 12,
    width: 2,
    height: 18,
    sizeX: 42,
    sizeY: 42,
    at: { x: 0, y: 12, width: 25, height: 1 },
    ac: { x: 0, y: 13, width: 25, height: 16 },
    ab: { x: 0, y: 29, width: 25, height: 1 },
  };
  mainTipDialog = UIDialog.GetInstance().CreateTipDialog(
    "mainTipDialog",
    plantFlag + "/model/Textures/tip_dialog_bg2.png",
    _rect,
    38,
    42
  );
  mainTipDialog.isVisible = false;
  mainTipDialog.link = null;
  mainTipDialog.ChangeTipDialogDir(1);

  let textListDialog = UIDialog.GetInstance().CreateContainer(
    "textListDialog",
    mainTipDialog
  );
  textListDialog.isHitTestVisible = false;

  textListDialog.thickness = false;
  textListDialog.verticalAlignment =
    BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  textListDialog.horizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;

  mainUI.zIndex = jsonData.area_data.length;
  mainTipDialog.zIndex = jsonData.area_data.length + 1;
};

var CalculateTipDialog = function (
  scene,
  mesh,
  maxLineHeight,
  maxLineWidth,
  control
) {
  if (mainTipDialog === null || mainTipDialog === undefined) return;

  let engine = scene.getEngine();
  let screenW = engine.getRenderWidth();
  let screenH = engine.getRenderHeight();

  let p = BABYLON.Vector3.Project(
    mesh.getAbsolutePosition(),
    BABYLON.Matrix.Identity(),
    scene.getTransformMatrix(),
    scene.activeCamera.viewport.toGlobal(engine)
  );

  if (control.parent.topInPixels > maxLineHeight + 20) {
    if (control.parent.leftInPixels < maxLineWidth + 30) {
      mainTipDialog.ChangeTipDialogDir(0); // 말풍선의 방향 0 우, 1 위, 2 좌, 3 아래,
    } else {
      mainTipDialog.ChangeTipDialogDir(1); // 말풍선의 방향 0 우, 1 위, 2 좌, 3 아래,
    }
  } else {
    if (control.parent.leftInPixels > maxLineWidth + 30) {
      mainTipDialog.ChangeTipDialogDir(3); // 말풍선의 방향 0 우, 1 위, 2 좌, 3 아래,
    } else {
      mainTipDialog.ChangeTipDialogDir(2); // 말풍선의 방향 0 우, 1 위, 2 좌, 3 아래,
    }
  }

  let textListDialog = mainTipDialog.getChildByName("textListDialog");
  let x = 0;
  let y = 0;

  if (mainTipDialog.dir === 0) {
    textListDialog.left = "7px";
    textListDialog.top = "0px";
    mainTipDialog.linkOffsetY = -65;
    mainTipDialog.linkOffsetX =
      (control.parent.widthInPixels + (maxLineWidth + 30)) * 0.5;
  } else if (mainTipDialog.dir === 1) {
    textListDialog.left = "0px";
    textListDialog.top = "-6px";
    mainTipDialog.linkOffsetY =
      (maxLineHeight + 30) * -0.5 - control.parent.heightInPixels;
    mainTipDialog.linkOffsetX = 0;
    // x = ((control.parent.widthInPixels * 0.5) + (maxLineWidth + 30) * -0.5 + control.parent.leftInPixels);
    // y = (control.parent.topInPixels + (maxLineHeight + 20) * -1);
  } else if (mainTipDialog.dir === 2) {
    textListDialog.left = "-6px";
    textListDialog.top = "0px";
    mainTipDialog.linkOffsetY = -65;
    mainTipDialog.linkOffsetX =
      (control.parent.widthInPixels + (maxLineWidth + 30)) * -0.5;
  } else {
    textListDialog.left = "0px";
    textListDialog.top = "7px";
    mainTipDialog.linkOffsetY = (maxLineHeight + 30) * 0.5 - 50;
    mainTipDialog.linkOffsetX = 0;
    // x = ((control.parent.widthInPixels * 0.5) + (maxLineWidth + 30) * -0.5 + control.parent.leftInPixels);
    // y = ((control.parent.heightInPixels * 0.5) + control.parent.topInPixels + (maxLineHeight + 20));
  }

  if (maxLineHeight < 42) maxLineHeight = 42;

  mainTipDialog.ChangeTipDialogBackgroundSize(
    maxLineWidth + 30,
    maxLineHeight + 20
  );
  // console.log(control.left + control.top);
  // console.log(control.parent.left + control.parent.top);
  // let oldLeft = target._left.getValue(target._host);
  // var oldTop = target._top.getValue(target._host);
  // var newLeft = ((projectedPosition.x + target._linkOffsetX.getValue(target._host)) - target._currentMeasure.width / 2);
  // var newTop = ((projectedPosition.y + target._linkOffsetY.getValue(target._host)) - target._currentMeasure.height / 2);
  // if (target._left.ignoreAdaptiveScaling && target._top.ignoreAdaptiveScaling)
  // {
  //     if (Math.abs(newLeft - oldLeft) < 0.5)
  //     {
  //         newLeft = oldLeft;
  //     }
  //     if (Math.abs(newTop - oldTop) < 0.5)
  //     {
  //         newTop = oldTop;
  //     }
  // }
  // target.left = newLeft + "px";
  // target.top = newTop + "px";
};

var ShowTipDialog = function (scene, mesh, control, jsonData) {
  if (mainTipDialog === null || mainTipDialog === undefined) return;

  mainTipDialog.isVisible = true;
  let textListDialog = mainTipDialog.getChildByName("textListDialog");

  if (mainTipDialog.link === null || mainTipDialog.link !== mesh) {
    mainTipDialog.link = mesh;
    let iComplete = jsonData.message.length;
    let count = textListDialog.children.length;
    let n = 0;
    let maxLineWidth = 0;
    let maxLineHeight = 0;

    for (let i = 0; i < jsonData.message.length; ++i) {
      let richText = textListDialog.getChildByName("" + i);
      if (richText === null) {
        richText = UIDialog.GetInstance().CreateRichTextBlock(
          "" + i,
          textListDialog
        );
        richText.textHorizontalAlignment =
          BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
        richText.textVerticalAlignment =
          BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
        richText.fontFamily = "Malgun Gothic";
        richText.fontStyle = "bold";
        richText.fontSize = "12px";
        richText.textColors = ["#333333", "#c469d2", "#1da291"];
        richText.isHitTestVisible = false;
      }

      richText.onLinesReadyObservable.clear();
      richText.textList = [0, 0, 0];
      richText.text = "";

      richText.onLinesReadyObservable.add(function (target) {
        --iComplete;
        target.top = maxLineHeight + "px";
        maxLineHeight += target.fontOffset.height * target.lines.length;

        for (let n = 0; n < target.lines.length; n++) {
          let lineWidth = target.lines[n].width;

          if (lineWidth > maxLineWidth) maxLineWidth = lineWidth;
        }

        if (iComplete === 0) {
          maxLineHeight = parseInt(maxLineHeight);
          maxLineWidth = parseInt(maxLineWidth);

          if (maxLineWidth % 2 === 1) {
            maxLineWidth += 1;
          }

          if (maxLineHeight % 2 === 1) {
            maxLineHeight += 1;
          }

          textListDialog.width = maxLineWidth + "px";
          textListDialog.height = maxLineHeight + "px";
          mainTipDialog.alpha = 1;

          if (mainTipDialog.dir === 0) {
            textListDialog.left = "7px";
            textListDialog.top = "0px";
            mainTipDialog.linkOffsetY = -65;
            mainTipDialog.linkOffsetX =
              (control.parent.widthInPixels + (maxLineWidth + 30)) * 0.5;
          } else if (mainTipDialog.dir === 1) {
            textListDialog.left = "0px";
            textListDialog.top = "-6px";
            mainTipDialog.linkOffsetY =
              (maxLineHeight + 30) * -0.5 - control.parent.heightInPixels;
            mainTipDialog.linkOffsetX = 0;
          } else if (mainTipDialog.dir === 2) {
            textListDialog.left = "-6px";
            textListDialog.top = "0px";
            mainTipDialog.linkOffsetY = -65;
            mainTipDialog.linkOffsetX =
              (control.parent.widthInPixels + (maxLineWidth + 30)) * -0.5;
          } else {
            textListDialog.left = "0px";
            textListDialog.top = "7px";
            mainTipDialog.linkOffsetY = (maxLineHeight + 30) * 0.5 - 50;
            mainTipDialog.linkOffsetX = 0;
          }

          if (jsonData.message.length > 1) maxLineHeight += 20;

          mainTipDialog.ChangeTipDialogBackgroundSize(
            maxLineWidth + 30,
            maxLineHeight + 20
          );
          //CalculateTipDialog(scene,mesh,maxLineHeight,maxLineWidth,control);
          // mainTipDialog.left = x + "px";
          // mainTipDialog.top = y + "px";
        }

        target.onLinesReadyObservable.clear();
      });

      richText.isVisible = true;
      let _text = "";
      if (jsonData.message[i] === undefined || jsonData.message[i] === null) {
        console.log(
          "jsonData.message[i] = undefined index :" +
            i +
            "  id :" +
            jsonData.Identity
        );
        richText.textList = [0, 0, 0];
      } else {
        let textList = jsonData.message[i].split(",", 3);
        let _textList = [];
        let index = 0;
        for (let t = 0; t < textList.length; ++t) {
          index += textList[t].length;
          _textList.push(index);
          _text += textList[t] + " ";
        }
        richText.textList = _textList;
      }
      richText.text = _text;
      ++n;
    }

    if (count > n) {
      for (let i = n; i < count; ++i) {
        textListDialog.children[i].textList = [0, 0, 0];
        textListDialog.children[i].text = "";
        textListDialog.children[i].onLinesReadyObservable.add(function (
          target
        ) {
          target.isVisible = false;
          target.onLinesReadyObservable.clear();
        });
      }
    }

    mainTipDialog.alpha = 0;
    mainTipDialog.linkWithMesh(mesh);
  } else {
    // maxLineHeight = mainTipDialog.heightInPixels - 20;
    // maxLineWidth = mainTipDialog.widthInPixels - 30;
    // mainTipDialog.alpha = 1;
    // mainTipDialog.linkWithMesh(mesh);
    // CalculateTipDialog(scene,mesh,maxLineHeight,maxLineWidth,control);
  }
};

var createSubGUI = function (scene, jsonData) {
  if (jsonData === null || jsonData === undefined) return;

  let iOrder = 0;
  //   for (let i = 0; i < jsonData.fac_info.length; ++i) {
  //     let _mesh = scene.getMeshByName(jsonData.fac_info[i].id);
  //     if (_mesh === null) continue;

  //     iOrder = createSubInfoDialog(_mesh, jsonData.fac_info[i], iOrder);
  //   }

  let subUI = UIDialog.GetInstance().CreateContainer("subUI");
  subUI.zIndex = iOrder + 2;
  subUI.isHitTestVisible = false;
  let backButton = UIDialog.GetInstance().CreateSimpleImageButton(
    "Close",
    plantFlag + "/model/icon/btn_back_default.png",
    subUI
  );
  backButton.horizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  backButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  backButton.paddingTop = "5px";
  backButton.paddingLeft = "5px";
  backButton.width = "32px";
  backButton.height = "32px";

  backButton.onPointerDownObservable.add(function () {
    subUI.isVisible = false;
    subUI.dispose();
    UIDialog.GetInstance().Dispose();
    scene.dispose();

    isMainScene = true;
  });

  //   let fitButton = UIDialog.GetInstance().CreateSimpleImageButton(
  //     "Fit",
  //     plantFlag + "/model/icon/btn_prev_default.png",
  //     subUI
  //   );
  //   fitButton.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //   fitButton.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //   fitButton.paddingTop = "5px";
  //   fitButton.paddingLeft = "5px";
  //   fitButton.left = "36px";
  //   fitButton.width = "32px";
  //   fitButton.height = "32px";

  //   fitButton.onPointerDownObservable.add(function () {
  //     scene.activeCamera._restoreStateValues();

  //     let y = 10;
  //     for (let i = 0; i < jsonData.kpi_data.length; ++i) {
  //       let subDialog = subUI.getChildByName("subDialog" + i);
  //       if (subDialog) {
  //         subDialog.left = "-10px";
  //         subDialog.top = y + "px";
  //         y += subDialog.heightInPixels + 10;
  //       }
  //     }
  //   });

  //   let title = UIDialog.GetInstance().CreateContainer("Title", subUI);
  //   title.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //   title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //   title.left = "10px";
  //   title.top = "10px";
  //   title.width = "200px";
  //   title.height = "80px";

  //   let titleText = UIDialog.GetInstance().CreateTextBlock("titleText", title);
  //   titleText.textWrapping = true;
  //   titleText.textHorizontalAlignment =
  //     BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //   titleText.textVerticalAlignment =
  //     BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //   titleText.left = "25px";
  //   titleText.top = "-20px";
  //   titleText.isHitTestVisible = false;
  //   titleText.fontFamily = "Malgun Gothic";
  //   titleText.color = "#333333";
  //   titleText.fontSize = "14px";

  //   titleText.text = worksArea + " " + jsonData.name;
  //   titleText.fontStyle = "bold";

  //   let y = 10;
  //   for (let i = 0; i < jsonData.kpi_data.length; ++i) {
  //     let subDialog = UIDialog.GetInstance().CreateDialog(
  //       "subDialog" + i,
  //       240,
  //       80,
  //       subUI
  //     );
  //     subDialog.ChangeDialogBackgroundColor("#315871");
  //     subDialog.ChangeDialogBackgroundOpecity(0.8);
  //     subDialog.MoveDialogLock(false);
  //     subDialog.horizontalAlignment =
  //       BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //     subDialog.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //     subDialog.left = "-10px";
  //     subDialog.top = y + "px";

  //     titleText = UIDialog.GetInstance().CreateTextBlock("titleText", subDialog);
  //     titleText.textWrapping = false;
  //     titleText.textHorizontalAlignment =
  //       BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
  //     titleText.textVerticalAlignment =
  //       BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //     titleText.left = "14px";
  //     titleText.top = "10px";
  //     titleText.fontFamily = "Malgun Gothic";
  //     titleText.isHitTestVisible = false;
  //     titleText.text = jsonData.kpi_data[i].title;
  //     titleText.color = "white";
  //     titleText.fontSize = "12px";
  //     titleText.fontStyle = "bold";

  //     let dateText = UIDialog.GetInstance().CreateTextBlock("Date", subDialog);
  //     dateText.textHorizontalAlignment =
  //       BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //     dateText.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
  //     dateText.left = "-14px";
  //     dateText.top = "12px";
  //     dateText.isHitTestVisible = false;
  //     dateText.fontFamily = "Malgun Gothic";
  //     dateText.color = "white";
  //     dateText.fontSize = "12px";
  //     dateText.text = jsonData.kpi_data[i].date;

  //     let valueRate = UIDialog.GetInstance().CreateTextBlock(
  //       "valueRate",
  //       subDialog
  //     );
  //     valueRate.textHorizontalAlignment =
  //       BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //     valueRate.textVerticalAlignment =
  //       BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //     valueRate.left = "-14px";
  //     valueRate.top = "-8px";
  //     valueRate.isHitTestVisible = false;
  //     valueRate.fontFamily = "Malgun Gothic";
  //     valueRate.color = "#fffac3";
  //     valueRate.fontSize = "23px";
  //     valueRate.text = jsonData.kpi_data[i].value;
  //     valueRate.fontStyle = "bold";

  //     let type = valueRate.text.match("%");
  //     if (type === null || type === undefined) {
  //       type = valueRate.text.match("ton");
  //     }

  //     if (type) {
  //       let stringSplit = valueRate.text.split(type[0]);
  //       if (stringSplit.length > 1) {
  //         let typeText = UIDialog.GetInstance().CreateTextBlock(
  //           "typeText",
  //           subDialog
  //         );
  //         typeText.textHorizontalAlignment =
  //           BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
  //         typeText.textVerticalAlignment =
  //           BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
  //         typeText.left = "-14px";
  //         typeText.top = "-10px";
  //         typeText.fontFamily = "Malgun Gothic";
  //         typeText.color = "#fffac3";
  //         typeText.fontSize = "15px";
  //         typeText.text = type[0];
  //         let value = "";
  //         for (let i = 0; i < stringSplit.length - 1; ++i) {
  //           value += stringSplit[i];
  //         }
  //         valueRate.text = value;

  //         if ("%" === type[0]) valueRate.left = "-24px";
  //         else valueRate.left = "-34px";
  //       }
  //     }

  //     valueRate.onLinesReadyObservable.add(function (target) {
  //       let maxLineWidth = 0;
  //       for (let i = 0; i < target.lines.length; i++) {
  //         let line = target.lines[i];

  //         if (line.width > maxLineWidth) maxLineWidth = line.width;
  //       }

  //       if (maxLineWidth + 100 > 222) {
  //         target.parent.ChangeDialogBackgroundSize(
  //           parseInt(maxLineWidth + 100),
  //           80
  //         );
  //       }
  //     });

  //     y += subDialog.heightInPixels + 10;
  //   }
};

var createSubInfoDialog = function (mesh, jsonData, zOrder) {
  if (jsonData === undefined || mesh === undefined || mesh === null)
    return zOrder;

  let lineUI = null;
  let meshChildren = mesh.getChildren();
  if (meshChildren.length > 0) {
    lineUI = UIDialog.GetInstance().CreateDrawLine("line_" + jsonData.id);
    lineUI.lineWidth = 1;
    lineUI.alpha = 0.5;
    lineUI.zIndex = zOrder;
    //lineUI.dash = [5, 10]; // 점선

    let endRound = UIDialog.GetInstance().CreateEllipse(
      "endRound_" + jsonData.id
    );
    endRound.width = "5px";
    endRound.height = "5px";
    ++zOrder;
    endRound.zIndex = zOrder;
    ++zOrder;

    lineUI.linkWithMesh(mesh);
    endRound.linkWithMesh(mesh);
    mesh = meshChildren[0];
  }
  //let _rect = {x:16,y:12,width:8,height:7,sizeX:34,sizeY:35};
  let _rect = { x: 14, y: 14, width: 1, height: 1, sizeX: 30, sizeY: 29 };
  let subInfoDialog = UIDialog.GetInstance().CreateRectImageDialog(
    "subInfoDialog_" + jsonData.id,
    plantFlag + "/model/Textures/tip_dialog_bg4.png",
    _rect,
    34,
    35
  );
  subInfoDialog.MoveRectImageDialogLock(false);

  if (zOrder !== null || zOrder !== undefined) {
    subInfoDialog.zIndex = zOrder;
  }

  subInfoDialog.linkWithMesh(mesh);
  subInfoDialog.thickness = false;
  subInfoDialog.isPointerBlocker = false;
  subInfoDialog.isHitTestVisible = false;

  if (lineUI !== null) {
    lineUI.connectedControl = subInfoDialog;
    // subInfoDialog._lineUI = lineUI;
  }

  let button = new BABYLON.GUI.Button("button");

  button.alpha = 0;
  button.thickness = false;
  button.pointerEnterAnimation = undefined;
  button.pointerOutAnimation = undefined;
  button.pointerDownAnimation = undefined;
  button.pointerUpAnimation = undefined;
  // button.background = "#222222";

  let color = "#333333";
  button.blink_url = jsonData.hasOwnProperty("link_url");
  if (button.blink_url) {
    color = "#2d71b2";
    button.onPointerDownObservable.add(function () {
      let canvas = document.getElementById("renderCanvas");
      canvas.style.cursor = "";
      window.open(jsonData.link_url);
    });
  }

  button.onPointerEnterObservable.add(function (target) {
    if (target.blink_url) {
      let canvas = document.getElementById("renderCanvas");
      canvas.style.cursor = "pointer";
    }

    if (currentOverMesh && currentOverMesh.actionManager)
      currentOverMesh.actionManager.processTrigger(
        BABYLON.ActionManager.OnPointerOutTrigger,
        BABYLON.ActionEvent.CreateNew(currentOverMesh)
      );

    target.order = target.parent.zIndex;

    let subUI = UIDialog.GetInstance().GetUIByName("subUI", "Container");
    target.parent.zIndex = subUI.zIndex - 2;
  });

  button.onPointerOutObservable.add(function (target) {
    if (target.blink_url) {
      let canvas = document.getElementById("renderCanvas");
      canvas.style.cursor = "";
    }

    if (target.order) target.parent.zIndex = target.order;
  });

  let factoryName = UIDialog.GetInstance().CreateTextBlock(
    "factoryName",
    subInfoDialog
  );
  factoryName.textHorizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  factoryName.textVerticalAlignment =
    BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;

  factoryName.fontFamily = "Malgun Gothic";
  factoryName.isHitTestVisible = false;
  factoryName.text = jsonData.title;
  factoryName.color = color;
  factoryName.fontSize = "12px";
  factoryName.fontStyle = "bold";
  factoryName.left = "4px";
  factoryName.onLinesReadyObservable.add(function (target) {
    let height = target.fontSizeInPixels * target.lines.length + 10;
    let maxLineWidth = 0;
    if (height < 30) height = 30;

    for (let i = 0; i < target.lines.length; i++) {
      let line = target.lines[i];

      if (line.width > maxLineWidth) maxLineWidth = line.width;
    }

    if (maxLineWidth < 40) maxLineWidth = 40;

    target.parent.ChangeRectImageDialogSize(
      parseInt(maxLineWidth + 20),
      parseInt(height)
    );
    target.parent.linkOffsetX = parseInt((maxLineWidth + 30) * 0.6);

    // if(target.parent._lineUI !== undefined)
    //     target.parent._lineUI.x2Offset = parseInt((maxLineWidth + 30) * -0.45);
    target.onLinesReadyObservable.clear();
  });

  subInfoDialog.addControl(button);
  return zOrder + 1;
};

// Over/Out
var meshOverOutClick = function (mesh, scene, jsonData) {
  if (mesh.actionManager === null || mesh.actionManager.getScene() !== scene) {
    mesh.actionManager = new BABYLON.ActionManager(scene);
  } else {
    mesh.actionManager.dispose();
  }

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOverTrigger,
      function (target) {
        //target.meshUnderPointer.renderOutline = true;
        if (target.meshUnderPointer.overMaterail !== null)
          target.meshUnderPointer.material =
            target.meshUnderPointer.overMaterail;

        if (target.meshUnderPointer.orginScale !== null)
          target.meshUnderPointer.scaling =
            target.meshUnderPointer.scaling.scale(1.15);

        if (target.meshUnderPointer.orginAbsolutePosition !== null)
          target.meshUnderPointer.position =
            target.meshUnderPointer.orginAbsolutePosition;

        currentOverMesh = target.meshUnderPointer;
        if (target.meshUnderPointer.stat === 0) {
          let ui = UIDialog.GetInstance().GetUIByName(
            "notificationDialog." + target.meshUnderPointer.name,
            "Container"
          );
          target.meshUnderPointer.order = ui.zIndex;
          //   ui.zIndex = mainTipDialog.zIndex - 2;
          ui.isVisible = true;
        }
      }
    )
  );

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPointerOutTrigger,
      function (target) {
        //target.meshUnderPointer.renderOutline = false;
        if (target.meshUnderPointer.normalMaterail !== null)
          target.meshUnderPointer.material =
            target.meshUnderPointer.normalMaterail;

        if (target.meshUnderPointer.orginScale !== null)
          target.meshUnderPointer.scaling = target.meshUnderPointer.orginScale;

        if (target.meshUnderPointer.orginAbsolutePosition !== null)
          target.meshUnderPointer.position =
            target.meshUnderPointer.orginAbsolutePosition;

        if (target.meshUnderPointer.stat === 0) {
          let ui = UIDialog.GetInstance().GetUIByName(
            "notificationDialog." + target.meshUnderPointer.name,
            "Container"
          );

          if (target.meshUnderPointer.order) ui.zIndex = target.order;

          ui.isVisible = false;
        }

        currentOverMesh = null;
        bChange = false;
      }
    )
  );

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnLeftPickTrigger,
      function (target) {
        bChange = true;
      }
    )
  );

  mesh.actionManager.registerAction(
    new BABYLON.ExecuteCodeAction(
      BABYLON.ActionManager.OnPickUpTrigger,
      function (target) {
        if (cameraViewChange === true) return;
        if (currentOverMesh === null) return;
        if (bChange === false) return;

        currentOverMesh = null;
        scene.onBeforeRenderObservable.clear();
        scene.activeCamera.onViewMatrixChangedObservable.clear();
        let mainUI = UIDialog.GetInstance().GetUIByName("mainUI", "Container");
        mainUI.dispose();
        UIDialog.GetInstance().Dispose();
        scene.dispose();

        isMainScene = false;
        nextSceneName = target.meshUnderPointer.name;
      }
    )
  );
};

var createNotificationDialog = function (scene, mesh, jsonData, zOrder) {
  if (
    jsonData === undefined ||
    (showName == false && jsonData.stat <= 0 && mesh.bSmart === undefined)
  )
    return zOrder;

  let notificationDialog = UIDialog.GetInstance().CreateContainer(
    "notificationDialog." + jsonData.id
  );
  if (zOrder !== null || zOrder !== undefined) {
    notificationDialog.zIndex = zOrder;
  }

  notificationDialog.linkWithMesh(mesh);
  notificationDialog.thickness = false;
  notificationDialog.isPointerBlocker = false;
  notificationDialog.isHitTestVisible = false;
  notificationDialog.link = mesh;
  // notificationDialog.background = "green";

  let fileName = undefined;
  let fileName1 = undefined;
  //   if (jsonData.stat === 1) {
  //     fileName = plantFlag + "/model/icon/ico_green.png";
  //     fileName1 = plantFlag + "/model/Textures/title_dialog_bg_1.png";
  //   } else if (jsonData.stat === 2) {
  //     fileName = plantFlag + "/model/icon/ico_purple.png";
  //     fileName1 = plantFlag + "/model/Textures/title_dialog_bg_2.png";
  //   } else if (jsonData.stat === 3) {
  //     fileName = plantFlag + "/model/icon/ico_red.png";
  //     fileName1 = plantFlag + "/model/Textures/title_dialog_bg_3.png";
  //   } else {
  //     fileName1 = plantFlag + "/model/Textures/title_dialog_bg.png";
  //   }

  let _rect = { x: 14, y: 14, width: 1, height: 1, sizeX: 30, sizeY: 29 };
  let factoryNameDialog = UIDialog.GetInstance().CreateRectImageDialog(
    "factoryNameDialog",
    fileName1,
    _rect,
    30,
    29,
    notificationDialog
  );
  factoryNameDialog.MoveRectImageDialogLock(false);

  let iconSize = 0;
  if (fileName !== undefined) {
    let iconButton = UIDialog.GetInstance().CreateSimpleImageButton(
      "iconButton",
      fileName,
      notificationDialog
    );
    iconButton.horizontalAlignment =
      BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
    iconButton.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    iconButton.width = "30px";
    iconButton.height = "45px";
    iconSize = 45;
    iconButton.pointerEnterAnimation = undefined;
    iconButton.pointerOutAnimation = undefined;
    iconButton.pointerDownAnimation = undefined;
    iconButton.pointerUpAnimation = undefined;

    iconButton.onPointerEnterObservable.add(function (target) {
      if (currentOverMesh && currentOverMesh.actionManager)
        currentOverMesh.actionManager.processTrigger(
          BABYLON.ActionManager.OnPointerOutTrigger,
          BABYLON.ActionEvent.CreateNew(currentOverMesh)
        );

      target.order = target.parent.zIndex;
      //   target.parent.zIndex = mainTipDialog.zIndex - 2;
      ShowTipDialog(scene, mesh, target, jsonData);
    });

    iconButton.onPointerOutObservable.add(function (target) {
      if (target.order) target.parent.zIndex = target.order;

      //   mainTipDialog.isVisible = false;
    });

    let factoryNameDialogButton = new BABYLON.GUI.Button(
      "factoryNameDialogButton"
    );
    factoryNameDialog.addControl(factoryNameDialogButton);
    factoryNameDialogButton.alpha = 0;
    factoryNameDialogButton.thickness = false;
    factoryNameDialogButton.pointerEnterAnimation = undefined;
    factoryNameDialogButton.pointerOutAnimation = undefined;
    factoryNameDialogButton.pointerDownAnimation = undefined;
    factoryNameDialogButton.pointerUpAnimation = undefined;

    factoryNameDialogButton.onPointerEnterObservable.add(function (target) {
      if (currentOverMesh && currentOverMesh.actionManager)
        currentOverMesh.actionManager.processTrigger(
          BABYLON.ActionManager.OnPointerOutTrigger,
          BABYLON.ActionEvent.CreateNew(currentOverMesh)
        );

      target.order = target.parent.parent.zIndex;
      //   target.parent.parent.zIndex = mainTipDialog.zIndex - 2;

      ShowTipDialog(scene, mesh, iconButton, jsonData);
    });

    factoryNameDialogButton.onPointerOutObservable.add(function (target) {
      if (target.order) target.parent.parent.zIndex = target.order;

      //   mainTipDialog.isVisible = false;
    });
  }

  let factoryName = UIDialog.GetInstance().CreateTextBlock(
    "factoryName",
    factoryNameDialog
  );
  factoryName.textHorizontalAlignment =
    BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
  factoryName.textVerticalAlignment =
    BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
  factoryName.fontFamily = "Malgun Gothic";
  factoryName.isHitTestVisible = false;
  factoryName.text = "";
  factoryName.color = "#333333";
  factoryName.fontSize = "12px";

  factoryName.onLinesReadyObservable.add(function (target) {
    let height = target.fontSizeInPixels * target.lines.length + 10;
    let maxLineWidth = 0;
    if (height < 30) height = 30;

    for (let i = 0; i < target.lines.length; i++) {
      let line = target.lines[i];

      if (line.width > maxLineWidth) maxLineWidth = line.width;
    }

    if (maxLineWidth < 40) maxLineWidth = 40;

    target.parent.ChangeRectImageDialogSize(
      parseInt(maxLineWidth + 20),
      parseInt(height)
    );
    target.parent.parent.width = target.parent.widthInPixels + 10 + "px";
    target.parent.parent.height =
      iconSize + 5 + target.parent.heightInPixels + "px";
    target.parent.verticalAlignment =
      BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    //target.parent.parent.transformCenterY = 1;
    target.parent.parent.linkOffsetY =
      target.parent.parent.heightInPixels * -0.5 + "px";
  });

  if (mesh.bSmart && jsonData.stat === 0) {
    notificationDialog.isVisible = false;
  }

  return zOrder + 1;
};

var createSceneGLTF = function (scene, fileName) {
  // scene.clearCachedVertexData();
  // scene.cleanCachedTextureBuffer();

  let camList = {};

  camList["KYY03"] = {
    a: 0.6176900201355014,
    b: 0.8385441278865438,
    r: 83.44606436164918,
    t: new BABYLON.Vector3(
      -19.147650132450682,
      -11.382325590475508,
      23.50292375641763
    ),
  };
  camList["KHP01"] = {
    a: 0.6491024813959839,
    b: 0.9898221763978501,
    r: 82.55956820959157,
    t: new BABYLON.Vector3(
      -23.39656780751971,
      -12.201528240002125,
      27.014674853844383
    ),
  };
  camList["KJG03"] = {
    a: 2.045176532140994,
    b: 1.1274009320658573,
    r: 32.40368277995819,
    t: new BABYLON.Vector3(
      -22.670075772828923,
      10.663370944471184,
      6.159484509452867
    ),
  };
  camList["KYJ03"] = {
    a: 2.2337564105626075,
    b: 1.0723103656417974,
    r: 29.79713085762932,
    t: new BABYLON.Vector3(
      -30.30563262528059,
      10.573086857580108,
      2.136524743992545
    ),
  };

  let engine = scene.getEngine();
  let canvas = engine.getRenderingCanvas();

  scene.clearColor = new BABYLON.Color3.White();
  scene.ambientColor = new BABYLON.Color3.White();
  // let hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(plantFlag + "/model/Textures/backgroundSkybox.dds", scene);
  // hdrTexture.name = "envTex";
  // hdrTexture.gammaSpace = false;
  // scene.createDefaultSkybox(hdrTexture, true, 500, 0);

  let camera = new BABYLON.ArcRotateCamera(
    "camera",
    camList[fileName].a,
    camList[fileName].b,
    camList[fileName].r,
    camList[fileName].t,
    scene
  );
  scene.activeCamera = camera;

  camera.attachControl(canvas, true);
  camera.wheelDeltaPercentage = 0.01;
  camera.ignoreBobleClickRestoreState = true;

  camera.lowerBetaLimit = -0.5;
  camera.upperBetaLimit = 1.5;
  camera.lowerRadiusLimit = 10;
  camera.upperRadiusLimit = 100;
  camera.storeState();

  camera.collisionRadius = new BABYLON.Vector3(1.7, 1.7, 1.7);
  camera.checkCollisions = true;

  new BABYLON.GlowLayer("glow", scene, {
    mainTextureFixedSize: 256,
    blurKernelSize: 32,
  });

  let gltfLoader = BABYLON.SceneLoader.Append(
    plantFlag + "/model/",
    fileName + ".gltf",
    scene,
    function (scene) {
      //dyn light to generate shadows
      let light = new BABYLON.DirectionalLight(
        "dirLight",
        new BABYLON.Vector3(0.3, -1, -0.2),
        scene
      );
      let lightNode = scene.getMeshByName("light");
      if (lightNode != null) {
        light.position = lightNode.position;
        light.rotation = lightNode.rotation;
      }

      let helper = scene.createDefaultEnvironment({
        // plantFlag: "K",
        groundTexture: new BABYLON.Texture(
          plantFlag + "/model/Textures/backgroundGround.png",
          scene
        ),
        skyboxTexture: new BABYLON.Texture(
          plantFlag + "/model/Textures/backgroundSkybox.dds",
          scene
        ),
        environmentTexture: BABYLON.CubeTexture.CreateFromPrefilteredData(
          plantFlag + "/model/Textures/environmentSpecular.env",
          scene
        ),
        enableGroundMirror: true,
        groundShadowLevel: 0.6,
      });

      helper.setMainColor(BABYLON.Color3.Gray());

      // // Shadows
      // let shadowGenerator = new BABYLON.ShadowGenerator(512, light);
      // shadowGenerator.useBlurExponentialShadowMap = true;
      // shadowGenerator.blurKernel = 10;

      let _materail = scene.getMaterialByName("glow");
      if (_materail) _materail.emissiveColor = new BABYLON.Color3(0, 0, 0);

      for (let i = 0; i < scene.meshes.length; ++i) {
        scene.meshes[i].isPickable = false;
      }

      // for(let i = 0; i < scene.meshes.length; ++i)
      // {
      //     // shadowGenerator.addShadowCaster(scene.meshes[i]);
      // }

      // prepare the room to receive shadows
      let ground = scene.getMeshByName("ground");
      //ground.receiveShadows = true;
      if (ground !== null) {
        ground.dispose();
      }

      ground = scene.getMeshByName("collision");
      //ground.receiveShadows = true;
      if (ground !== null) {
        ground.checkCollisions = true;
        ground.material = new BABYLON.StandardMaterial("greenMat", scene);
        ground.material.alpha = 0;
      }

      scene.workerCollisions = true;

      let jsonData = undefined;
      for (let i = 0; i < steelworks.factoryop.length; ++i) {
        if (steelworks.factoryop[i].fac_id === fileName) {
          jsonData = steelworks.factoryop[i];
          break;
        }
      }

      createSubGUI(scene, jsonData);
      //window.setTimeout(function(){engine.hideLoadingUI();}, 500);
    }
  );
};

var createMainScene = function (scene) {
  // scene.clearCachedVertexData();
  // scene.cleanCachedTextureBuffer();

  let engine = scene.getEngine();
  let canvas = engine.getRenderingCanvas();
  let camera = new BABYLON.ArcRotateCamera(
    "Camera",
    1.214698141525938,
    1.04539105492025,
    17.59531503604024,
    new BABYLON.Vector3(4.671, -0.2971, -2.9091),
    scene
  );

  scene.activeCamera = camera;
  camera.storeState();
  camera.attachControl(canvas, true);
  camera.wheelDeltaPercentage = 0.01;
  camera.ignoreBobleClickRestoreState = true;
  // // setting these to the same disables the beta movement.
  // // beta movement needs to be controlled by scrolling
  // camera.lowerBetaLimit = 0.3;
  camera.upperBetaLimit = Math.PI / 2.25;
  // // these limit how close/far the camera can get to the target.
  camera.lowerRadiusLimit = 5;
  camera.upperRadiusLimit = 30;

  camera.collisionRadius = new BABYLON.Vector3(0.5, 0.5, 0.5);
  camera.checkCollisions = true;

  scene.clearColor = new BABYLON.Color3.White();
  scene.ambientColor = new BABYLON.Color3.White();

  //let hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData("model/Textures/backgroundSkybox.dds", scene);
  let hdrTexture = BABYLON.CubeTexture.CreateFromPrefilteredData(
    plantFlag + "/model/Textures/neutral_env_EnvHDR.dds",
    scene
  );
  hdrTexture.name = "envTex";
  // hdrTexture.gammaSpace = true;
  // hdrTexture.level = 1.5;
  scene.createDefaultSkybox(hdrTexture, true, 500, 10);
  scene.workerCollisions = true;

  // // Create default pipeline
  // var defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, scene, [camera]);
  // var curve = new BABYLON.ColorCurves();
  // curve.globalHue = 200;
  // curve.globalDensity = 80;
  // curve.globalSaturation = 80;
  // curve.highlightsHue = 20;
  // curve.highlightsDensity = 80;
  // curve.highlightsSaturation = -80;
  // curve.shadowsHue = 2;
  // curve.shadowsDensity = 10;
  // curve.shadowsSaturation = 2;

  // defaultPipeline.imageProcessing.colorCurves = curve;
  // //defaultPipeline.depthOfField.focalLength = 50;
  // //defaultPipeline.depthOfField.focusDistance = 100;
  // //defaultPipeline.depthOfFieldEnabled = true;

  // defaultPipeline.fxaaEnabled = true;

  //BABYLON.Scene.FOGMODE_NONE;
  // scene.fogMode =BABYLON.Scene.FOGMODE_EXP;
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;

  //scene.fogMode =BABYLON.Scene.FOGMODE_LINEAR;
  scene.fogColor = new BABYLON.Color3(0.78, 1, 1);
  scene.fogDensity = 0.009;

  // var helper = scene.createDefaultEnvironment({
  //     enableGroundMirror: true,
  //     groundShadowLevel: 1,
  // });

  // helper.setMainColor(BABYLON.Color3.Gray());

  let gltfLoader = BABYLON.SceneLoader.Append(
    plantFlag + "/model/",
    "KY_main.gltf",
    scene,
    function (scene) {
      for (let i = 0; i < scene.meshes.length; ++i) {
        if (
          scene.meshes[i].material &&
          scene.meshes[i].material.lightmapTexture === undefined
        ) {
          let temp = scene.meshes[i].material.getActiveTextures();
          if (temp.length > 1) {
            // scene.meshes[i].material.roughness
            //scene.meshes[i].material.metallic = 0;
            // scene.meshes[i].material.roughness = 0;
            // let temp = scene.meshes[i].material.emissiveTexture;
            // temp.coordinatesIndex = 0;
            // temp.level = 1;
            // temp.vScale = -1;
            scene.meshes[i].material.lightmapTexture =
              scene.meshes[i].material.emissiveTexture;
            scene.meshes[i].material.useLightmapAsShadowmap = true;
            scene.meshes[i].material.emissiveTexture = undefined;
          }
        }
        //shadowGenerator.getShadowMap().renderList.push(scene.meshes[i]);
        scene.meshes[i].isPickable = false;
      }

      // dyn light to generate shadows
      let light = new BABYLON.DirectionalLight(
        "dirLight",
        new BABYLON.Vector3(0.3, -1, -0.2),
        scene
      );
      light.intensity = 0.3;
      let lightDummy = scene.getMeshByName("light");
      if (lightDummy !== null) {
        light.position = lightDummy.position;
        light.rotation = lightDummy.rotation;
      }

      // let shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
      // shadowGenerator.useBlurExponentialShadowMap = true;
      // shadowGenerator.useVarianceShadowMap = true;
      // shadowGenerator.useCloseExponentialShadowMap = true;
      // shadowGenerator.useBlurCloseExponentialShadowMap = true;
      // shadowGenerator.useKernelBlur = true;
      //shadowGenerator.useBlurExponentialShadowMap = true;
      // shadowGenerator.blurKernel = 4;
      //shadowGenerator._contactHardeningLightSizeUVRatio = 0.3;
      // shadowGenerator._transparencyShadow = true;
      //shadowGenerator._lightDirection = new BABYLON.Vector3(0.3, -1, -0.2)

      let normalColorMap = new BABYLON.Texture(
        plantFlag + "/model/PEQ_c_gyPers_normal.png",
        scene
      );
      normalColorMap.coordinatesIndex = 1;
      normalColorMap.level = 1;
      normalColorMap.vScale = -1;

      let overColorMap = new BABYLON.Texture(
        plantFlag + "/model/PEQ_c_gyPers_over.png",
        scene
      );
      overColorMap.coordinatesIndex = 1;
      overColorMap.level = 1;
      overColorMap.vScale = -1;
      let smartColorMap = new BABYLON.Texture(
        plantFlag + "/model/PEQ_c_gyPers_smart.png",
        scene
      );
      smartColorMap.coordinatesIndex = 1;
      smartColorMap.level = 1;
      smartColorMap.vScale = -1;

      // Water material
      let waterMaterial = new BABYLON.WaterMaterial(
        "waterMaterial",
        scene,
        new BABYLON.Vector2(512, 512)
      );
      waterMaterial.bumpTexture = new BABYLON.Texture(
        plantFlag + "/model/Textures/waterb.png",
        scene
      );
      waterMaterial.windForce = -5;
      waterMaterial.waveHeight = 0.001;
      waterMaterial.bumpHeight = 0.06;
      waterMaterial.waveLength = 0.02;
      waterMaterial.waveSpeed = 20;
      waterMaterial.colorBlendFactor = 0;
      waterMaterial.windDirection = new BABYLON.Vector2(1, 0.5);
      waterMaterial.colorBlendFactor = 0;

      let waterMesh = BABYLON.Mesh.CreateGround(
        "waterMesh",
        170,
        170,
        32,
        scene,
        false
      );
      waterMesh.material = waterMaterial;

      let _sea = scene.getMeshByName("sea");
      let _ground = scene.getMeshByName("ground");

      if (_sea.material) {
        //_sea.material.freeze();
        //_sea.material.unfreeze();
        //mesh.freezeWorldMatrix();
        //mesh.unfreezeWorldMatrix();
        //scene.freezeActiveMeshes();
        //scene.unfreezeActiveMeshes();
        //mesh.alwaysSelectAsActiveMesh = true.
        //scene.autoClear = false; // Color buffer
        //scene.autoClearDepthAndStencil = false; // Depth and stencil, obviously
        //_sea.material.albedoTexture = lightmapData.KY_lightmap_01;
        //_sea.material.useLightmapAsShadowmap = true;
        // _sea.receiveShadows = true;
        // Configure water material
        //waterMaterial.addToRenderList(_ground);
        waterMaterial.addToRenderList(_sea);
        waterMaterial.addToRenderList(scene.getMeshByName("bridgeA_001"));
        waterMaterial.addToRenderList(scene.getMeshByName("ship_002"));
        waterMaterial.addToRenderList(scene.getMeshByName("ship_001"));
        waterMaterial.addToRenderList(scene.getMeshByName("bridgeB_001"));
        waterMaterial.addToRenderList(scene.getMeshByName("bridgeC_003"));
        waterMaterial.addToRenderList(scene.getMeshByName("bridgeC_001"));
        waterMaterial.addToRenderList(scene.getMeshByName("bridgeC_002"));

        //_ground.receiveShadows = true;
        _ground.checkCollisions = true;

        let _collision = scene.getMeshByName("collision");
        if (_collision) {
          _collision.checkCollisions = true;
          _collision.material = new BABYLON.StandardMaterial("greenMat", scene);
          _collision.material.alpha = 0;
        }

        _ground.isWorldMatrixFrozen = true;
        _sea.isWorldMatrixFrozen = true;
        //_sea.material.useLightmapAsShadowmap
        _sea.checkCollisions = true;
      }

      let iOrder = 0;
      let arrList = [];
      for (let i = 0; i < steelworks.smartization_fac.length; ++i) {
        let _mesh = scene.getMeshByName(steelworks.smartization_fac[i]);
        if (_mesh === null) continue;

        _mesh.bSmart = true;

        _mesh.normalMaterail = _mesh.material.clone();
        _mesh.normalMaterail.albedoTexture = smartColorMap;
        _mesh.material = _mesh.normalMaterail;

        _mesh.overMaterail = _mesh.material.clone();
        _mesh.overMaterail.albedoTexture = overColorMap;

        _mesh.orginScale = _mesh.scaling;
        _mesh.orginAbsolutePosition = _mesh.position;
        arrList.push(_mesh);
        let bEmpty = true;

        for (let n = 0; n < steelworks.area_data.length; ++n) {
          if (steelworks.area_data[n].id == steelworks.smartization_fac[i]) {
            bEmpty = false;
            break;
          }
        }

        if (bEmpty) {
          let _jsonData = {};
          _jsonData.stat = 0;
          _jsonData.id = steelworks.smartization_fac[i];
          for (let t = 0; t < steelworks.factoryop.length; ++t) {
            if (
              steelworks.factoryop[t].fac_id === steelworks.smartization_fac[i]
            ) {
              _jsonData.name = steelworks.factoryop[t].name;
              break;
            }
          }

          if (_jsonData.name === undefined || _jsonData.name === null) {
            console.log(
              "steelworks.smartization_fac에 해당 데이터가 없습니다."
            );
          }
          _mesh.stat = 0;
          iOrder = createNotificationDialog(scene, _mesh, _jsonData, iOrder);
        }
      }

      // let notificationDialogList = {};
      for (let n = 0; n < steelworks.area_data.length; ++n) {
        let _mesh = scene.getMeshByName(steelworks.area_data[n].id);
        if (_mesh === null) continue;

        _mesh.stat = steelworks.area_data[n].stat;

        if (steelworks.area_data[n].stat >= 0) {
          iOrder = createNotificationDialog(
            scene,
            _mesh,
            steelworks.area_data[n],
            iOrder
          );
        }
      }

      for (let i = 0; i < arrList.length; ++i) {
        arrList[i].isPickable = true;
        meshOverOutClick(arrList[i], scene, steelworks);
      }

      // scene.freezeActiveMeshes();
      createMainGUI(scene, steelworks);
      // scene.createOrUpdateSelectionOctree();
      //BABYLON.SceneOptimizer.OptimizeAsync(scene,	OptimizerOptions(), null, null);
      onceCheck = true;

      scene.onAfterRenderObservable.add(function (target, event) {
        if (cameraViewChange === false) {
          if (isMainScene && onceCheck) {
            animationPlay();
            if (showUIFlag === 0) {
              if (UIDialog.GetInstance().GetUIManager().rootContainer) {
                UIDialog.GetInstance().GetUIManager().rootContainer.isVisible = true;
              }
            } else if (showUIFlag === 1) {
              let rootContainer =
                UIDialog.GetInstance().GetUIManager().rootContainer;
              if (rootContainer) {
                for (let i = 0; i < rootContainer.children.length; ++i) {
                  //rootContainer.children[i].isVisible = true;
                  if (
                    rootContainer.children[i].link &&
                    rootContainer.children[i].link.stat === 0
                  )
                    rootContainer.children[i].isVisible = false;
                  else rootContainer.children[i].isVisible = true;
                }

                // mainTipDialog.isVisible = false;
              }
            }
            onceCheck = false;
          }
        }
        cameraViewChange = false;
      });

      cameraViewChange = false;
      camera.onViewMatrixChangedObservable.add(function (target, event) {
        if (isMainScene) {
          if (cameraViewChange === false) {
            // animationPause();
          }

          if (showUIFlag === 0) {
            if (UIDialog.GetInstance().GetUIManager().rootContainer) {
              UIDialog.GetInstance().GetUIManager().rootContainer.isVisible = false;
              //   mainTipDialog.isVisible = false;
            }
          } else if (showUIFlag === 1) {
            let rootContainer =
              UIDialog.GetInstance().GetUIManager().rootContainer;
            if (rootContainer) {
              for (let i = 0; i < rootContainer.children.length; ++i) {
                if (rootContainer.children[i].name !== "mainUI") {
                  rootContainer.children[i].isVisible = false;
                }
              }
            }
          }
        }

        cameraViewChange = true;
        onceCheck = true;

        return;

        //     if(!target ) return;
        //     let keys = Object.keys(notificationDialogList);
        //     if(keys.length == 0 ) return;
        //     let manager = UIDialog.GetInstance();
        //     let uiList = [];
        //     let posList = [];
        //     let RM = target.getWorldMatrix().getRotationMatrix();
        //     let TM = BABYLON.Matrix.Translation(target.position.x,target.position.y,target.position.z);

        //     for( let key in notificationDialogList)
        //     {
        //         let pos = notificationDialogList[key].absolutePosition.add(notificationDialogList[key].getBoundingInfo().boundingBox.center);
        //         pos = BABYLON.Vector3.TransformCoordinates(pos, TM.invert());
        //         pos = BABYLON.Vector3.TransformCoordinates(pos, RM.invert());
        //         let oj = {n:key,p:pos};
        //         posList.push(oj);
        //     }

        //     posList.sort(function(a,b){
        //          return b.p.y - a.p.y;
        //     });

        //     let num = posList.length;
        //     for( let i = 0; i < num; ++i)
        //     {
        //         let ui = manager.GetUIByName("notificationDialog." + posList[i].n,"Container");
        //         ui.zIndex = i;
        //     }
      });

      //window.setTimeout(function(){engine.hideLoadingUI();}, 100);
    }
  );
  // gltfLoader.compileShadowGenerators = true;
  //gltfLoader.animationStartMode = BABYLON.GLTFLoaderAnimationStartMode.FIRST;
};

var OptimizerOptions = function () {
  var result = new BABYLON.SceneOptimizerOptions(30, 2000); // limit 30 FPS min here
  var priority = 0;
  //result.optimizations.push(new BABYLON.ShadowsOptimization(priority));
  //result.optimizations.push(new BABYLON.LensFlaresOptimization(priority));

  // // Next priority
  // priority++;
  // result.optimizations.push(new BABYLON.PostProcessesOptimization(priority));
  // result.optimizations.push(new BABYLON.ParticlesOptimization(priority));

  // // Next priority
  priority++;
  result.optimizations.push(new BABYLON.TextureOptimization(priority, 512));

  // // Next priority
  // priority++;
  // result.optimizations.push(new BABYLON.RenderTargetsOptimization(priority));

  // Next priority
  priority++;
  result.optimizations.push(
    new BABYLON.HardwareScalingOptimization(priority, 6)
  );

  return result;
};

var refreshData = function (jsondata, isShowName) {
  if (jsondata === void 0) {
    console.log("jsondata == null -----------------!!!");
    return;
  }

  if (isShowName === void 0) showName = false;
  else showName = isShowName;

  steelworks = jsondata;

  if (currentScene === null || currentScene.isDisposed) {
    return;
  }

  if (isMainScene) {
    let mainUI = UIDialog.GetInstance().GetUIByName("mainUI", "Container");
    mainUI.dispose();
    UIDialog.GetInstance().Dispose();

    for (let i = 0; i < currentScene.meshes.length; ++i) {
      currentScene.meshes[i].isPickable = false;
    }

    let normalColorMap = new BABYLON.Texture(
      plantFlag + "/model/PEQ_c_gyPers_normal.png",
      currentScene
    );
    normalColorMap.coordinatesIndex = 1;
    normalColorMap.level = 1;
    normalColorMap.vScale = -1;

    let overColorMap = new BABYLON.Texture(
      plantFlag + "/model/PEQ_c_gyPers_over.png",
      currentScene
    );
    overColorMap.coordinatesIndex = 1;
    overColorMap.level = 1;
    overColorMap.vScale = -1;
    let smartColorMap = new BABYLON.Texture(
      plantFlag + "/model/PEQ_c_gyPers_smart.png",
      currentScene
    );
    smartColorMap.coordinatesIndex = 1;
    smartColorMap.level = 1;
    smartColorMap.vScale = -1;

    let iOrder = 0;
    let arrList = [];
    for (let i = 0; i < steelworks.smartization_fac.length; ++i) {
      let _mesh = currentScene.getMeshByName(steelworks.smartization_fac[i]);
      if (_mesh === null) continue;

      _mesh.bSmart = true;

      _mesh.normalMaterail = _mesh.material.clone();
      _mesh.normalMaterail.albedoTexture = smartColorMap;
      _mesh.material = _mesh.normalMaterail;

      _mesh.overMaterail = _mesh.material.clone();
      _mesh.overMaterail.albedoTexture = overColorMap;

      _mesh.orginScale = _mesh.scaling;
      _mesh.orginAbsolutePosition = _mesh.position;
      arrList.push(_mesh);
      let bEmpty = true;

      for (let n = 0; n < steelworks.area_data.length; ++n) {
        if (steelworks.area_data[n].id == steelworks.smartization_fac[i]) {
          bEmpty = false;
          break;
        }
      }

      if (bEmpty) {
        let _jsonData = {};
        _jsonData.stat = 0;
        _jsonData.id = steelworks.smartization_fac[i];
        for (let t = 0; t < steelworks.factoryop.length; ++t) {
          if (
            steelworks.factoryop[t].fac_id === steelworks.smartization_fac[i]
          ) {
            _jsonData.name = steelworks.factoryop[t].name;
            break;
          }
        }

        if (_jsonData.name === undefined || _jsonData.name === null) {
          console.log("steelworks.smartization_fac에 해당 데이터가 없습니다.");
        }
        _mesh.stat = 0;
        iOrder = createNotificationDialog(
          currentScene,
          _mesh,
          _jsonData,
          iOrder
        );
      }
    }

    for (let n = 0; n < steelworks.area_data.length; ++n) {
      let _mesh = currentScene.getMeshByName(steelworks.area_data[n].id);
      if (_mesh === null) continue;

      _mesh.stat = steelworks.area_data[n].stat;

      if (steelworks.area_data[n].stat >= 0) {
        iOrder = createNotificationDialog(
          currentScene,
          _mesh,
          steelworks.area_data[n],
          iOrder
        );
      }
    }

    for (let i = 0; i < arrList.length; ++i) {
      arrList[i].isPickable = true;
      meshOverOutClick(arrList[i], currentScene, steelworks);
    }

    createMainGUI(currentScene, steelworks);
  } else {
    let jsonData1 = undefined;
    for (let i = 0; i < steelworks.factoryop.length; ++i) {
      if (steelworks.factoryop[i].fac_id === nextSceneName) {
        jsonData1 = steelworks.factoryop[i];
        break;
      }
    }

    if (jsonData1 === null || jsonData1 === undefined) return;

    let subUI = UIDialog.GetInstance().GetUIByName("subUI", "Container");
    subUI.dispose();
    UIDialog.GetInstance().Dispose();
    createSubGUI(currentScene, jsonData1);
  }
};

var babylonInit = function (jsondata, isShowName, uiShowFlag) {
  bFocus = true;
  if (uiShowFlag === void 0) showUIFlag = 2;
  else showUIFlag = uiShowFlag;

  if (jsondata === void 0) {
    console.log("jsondata == null -----------------!!!");
    return;
  }

  if (isShowName === void 0) showName = false;
  else showName = isShowName;

  steelworks = jsondata;

  let canvas = document.getElementById("renderCanvas");
  canvas.oncontextmenu = function () {
    return false;
  };

  //create a BabylonJS engine object
  //let engine = new BABYLON.Engine(canvas, true, {preserveDrawingBuffer: false, stencil: false, audioEngine: false});
  let engine = new BABYLON.Engine(
    canvas,
    true,
    {
      doNotHandleContextLost: true,
      preserveDrawingBuffer: true,
      stencil: true,
      audioEngine: false,
    },
    false
  );
  engine.enableOfflineSupport = false;
  BABYLON.Animation.AllowMatricesInterpolation = true;

  let loadingScreen = new LoadingScreen(canvas);
  engine.loadingScreen = loadingScreen;
  //create scene
  currentScene = new BABYLON.Scene(engine);
  let jsonDataLoadComplete = !isJsonFileLoad;

  // Instrumentation
  //let instrumentation = new BABYLON.EngineInstrumentation(engine);
  //instrumentation.captureGPUFrameTime = true;
  //instrumentation.captureShaderCompilationTime = true;

  //let instrumentation1 = new BABYLON.SceneInstrumentation(scene);

  if (isJsonFileLoad) {
    let assetManager = new BABYLON.AssetsManager(currentScene);
    let task = assetManager.addTextFileTask("test", "data/steelworks.json");

    //onDoneCallback
    task.onSuccess = function (task) {
      //mainSceneJsonData = JSON.parse(task.text);
      createMainScene(currentScene, steelworks);
      jsonDataLoadComplete = true;
    };

    assetManager.onTaskErrorObservable.add(function (task) {
      console.log(task.errorObject.message);
    });

    assetManager.load();
  } else {
    createMainScene(currentScene);
  }

  engine.runRenderLoop(function () {
    if (bLoadingComplete && !bFocus) return;

    // scene.getCameraByName().setPosition();
    // rotation
    // let dateUI = UIDialog.GetInstance().GetUIByName("Date","TextBlock");
    if (currentScene !== null && jsonDataLoadComplete) {
      if (currentScene.isDisposed) {
        loadingScreen = new LoadingScreen(canvas);
        engine.loadingScreen = loadingScreen;

        if (isMainScene) {
          currentScene = new BABYLON.Scene(engine);
          createMainScene(currentScene);
        } else {
          currentScene = new BABYLON.Scene(engine);
          createSceneGLTF(currentScene, nextSceneName);
        }
      }

      currentScene.render();
      //let fpsLabel = document.getElementById("fpsLabel");
      //fpsLabel.innerHTML = engine.getFps().toFixed() + " fps";

      //     text1.text = "current frame time (GPU): " + (instrumentation.gpuFrameTimeCounter.current * 0.000001).toFixed(2) + "ms";
      // text2.text = "average frame time (GPU): " + (instrumentation.gpuFrameTimeCounter.average * 0.000001).toFixed(2) + "ms";
      // text3.text = "total shader compilation time: " + (instrumentation.shaderCompilationTimeCounter.total).toFixed(2) + "ms";
      // text4.text = "average shader compilation time: " + (instrumentation.shaderCompilationTimeCounter.average).toFixed(2) + "ms";
      // text5.text = "compiler shaders count: " + instrumentation.shaderCompilationTimeCounter.count;
    }
  });

  // Resize
  window.addEventListener("resize", function (event) {
    engine.resize();
  });
};
