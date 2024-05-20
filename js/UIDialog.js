"use strict";


var UIDialog = (function()
{
    var kInstance;

    var Init = function()
    {
        return {

            enterButton : function(target)
            {
                let canvas = document.getElementById('renderCanvas');
                canvas.style.cursor = "move";
            },

            outButton : function(target)
            {
                let canvas = document.getElementById('renderCanvas');
                canvas.style.cursor = "pointer";
            },

            downButton : function(coordinates,target)
            {
                if (target.parent === null ) return;

                let parent = target.currentTarget.parent.parent;
                if(parent === null)
                {
                    console.log("parent === null");
                    return;
                }

                kInstance.ChangTopZIndex(parent,target.currentTarget.parent);
                parent = target.currentTarget.parent.parent;
                if(parent === null)
                {
                    console.log("parent === null11");
                    return;
                }

                target.currentTarget.parent.startingPoint = new BABYLON.Vector2(coordinates.x, coordinates.y);
                target.currentTarget.parent.buttonStart = new BABYLON.Vector2(parseFloat(target.currentTarget.parent.left), parseFloat(target.currentTarget.parent.top));
                target.currentTarget.parent.drag = true;
                target.currentTarget.parent.drop = false;
                target.currentTarget.parent.zIndex = 1;
            },

            upButton : function(coordinates,target)
            {
                if (target.currentTarget.parent === null) return;

                target.currentTarget.parent.drag = false;
                target.currentTarget.parent.drop = true;
                target.currentTarget.parent.startingPoint = null;
            },

            moveButton : function(coordinates,target)
            {
                if (target.currentTarget.parent === null || !target.currentTarget.parent.startingPoint) return;
                if (target.currentTarget.parent.drag == true && target.currentTarget.parent.drop == false)
                {
                    let diff = target.currentTarget.parent.startingPoint.subtract(new BABYLON.Vector2(coordinates.x, coordinates.y));
                    target.currentTarget.parent.left = -diff.x + target.currentTarget.parent.buttonStart.x;
                    target.currentTarget.parent.top = -diff.y + target.currentTarget.parent.buttonStart.y;
                }
            },

            Create:function(name)
            {
                let _name = name;
                if(name === undefined)
                    _name = "UI";

                this._advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI(_name);
                this._advancedTexture.layer.layerMask = 2;

                return true;
            },

            ChangTopZIndex : function(control,obj)
            {
                if(control === undefined ||  control.containsControl === undefined || control.containsControl(obj) === false )
                    return;

                let index = 0;
                for( let i = 0; i < control.children.length; ++i )
                {
                    if(index < control.children[i].zIndex)
                    {
                        index = control.children[i].zIndex;
                    }
                }

                if(index <= 0)
                    index +=1;

                obj.zIndex = index

                for( let i = 0; i < control.children.length; ++i )
                {
                    if(control.children[i] !== obj )
                    {
                        control.children[i].zIndex = 0;
                    }
                }
            },

            CreatePopupDailog :function(name,w,h,callback, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let panel = new BABYLON.GUI.Container(name);
                panel.drag = false;
                panel.drop = true;
                panel.startingPoint = null;
                panel.buttonStart = null;

                if(parent !== undefined)
                    parent.addControl(panel);
                else
                    this._advancedTexture.addControl(panel);

                let dragButton = new BABYLON.GUI.Button("drag");

                //button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                //button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                // dragButton.paddingBottom = "40px";
                // dragButton.paddingLeft = "40px";
                //w,h,

                dragButton.pointerEnterAnimation = undefined;
                dragButton.pointerOutAnimation  = undefined;
                dragButton.pointerDownAnimation  = undefined;
                dragButton.pointerUpAnimation  = undefined;

                dragButton.alpha = 0;
                dragButton.width = w+"px";
                dragButton.height = h+"px";
                dragButton.color = 'green';
                dragButton.background = 'green';
                //button1.notRenderable = true;

                let rect = new BABYLON.GUI.Rectangle("rect");
                rect.width = w+"px";
                rect.height = h+"px";
                //rect.cornerRadius = 20;
                rect.thickness = false;
                rect.background = "gray";
                panel.addControl(rect);
                rect.addControl(dragButton);

                let closeButton = BABYLON.GUI.Button.CreateSimpleButton("Close", "X");

                closeButton.width = "20px";
                closeButton.height = "20px";
                closeButton.left = w /2 -12  + "px";
                closeButton.top =  -h /2 + 12 + "px";
                closeButton.color = 'white';
                closeButton.background = "gray";
                rect.addControl(closeButton);

                if(callback !== undefined)
                {
                    panel._closeCallback = callback;
                    closeButton.onPointerDownObservable.add(function()
                    {
                        if(panel._closeCallback !== null)
                            panel._closeCallback();

                        panel.notRenderable = true;
                    }.bind(this));
                }

                dragButton.onPointerEnterObservable.add(kInstance.enterButton);
                dragButton.onPointerOutObservable.add(kInstance.outButton);
                dragButton.onPointerDownObservable.add(kInstance.downButton);
                dragButton.onPointerUpObservable.add(kInstance.upButton);
                dragButton.onPointerMoveObservable.add(kInstance.moveButton);
                panel.onPointerMoveObservable.add(kInstance.moveButton);

                if(parent !== undefined)
                {
                    parent.addControl(panel);
                }
                else
                {
                    this._advancedTexture.addControl(panel);
                }

                panel.__proto__.ChangePopupDailogBackground = function (color)
                {
                    let obj = this.getChildByName("rect");
                    if(obj === null)
                        return;
                    obj.background = color;
                };

                rect.__proto__.ChangePopupDailogBackgroundOpecity = function (alpha)
                {
                    let obj = this.getChildByName("rect");
                    if(obj === null)
                        return;
                    obj.alpha = alpha;
                };

                panel.__proto__.ChangePopupDailogSize = function (_w,_h)
                {
                    let obj = this.getChildByName("rect");
                    if(obj === null)
                        return;

                    obj.width = _w+"px";
                    obj.height = _h+"px";

                    let _obj = obj.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.width = _w+"px";
                    _obj.height = _h+"px";

                    _obj = obj.getChildByName("Close");
                    if(_obj === null)
                        return;

                    _obj.left = _w /2 -12  + "px";
                    _obj.top =  -_h /2 + 12 + "px";
                };

                return panel;
            },

            CreateTipDialog :function(name,imageUrl,_rect,w,h, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let rect = new BABYLON.GUI.Container(name);
                rect.isHitTestVisible = false;
                rect.drag = false;
                rect.drop = true;
                rect.startingPoint = null;
                rect.buttonStart = null;
                rect._closeCallback = undefined;
                rect.width = w+"px";
                rect.height = h+"px";
                rect.rectData = _rect;
                rect.dir = 0;
                rect.thickness = false;

                let bg = new BABYLON.GUI.Container("bg");
                bg.isHitTestVisible = false;
                bg.width = rect.width;
                bg.height = rect.height;
                bg.thickness = false;
                rect.addControl(bg);

                // let arrawMeasure = {};
                // arrawMeasure.alignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                // arrawMeasure.width = 30;
                // arrawMeasure.height = 20;
                // arrawMeasure.y = 10;
                // rect.arrawMeasure = arrawMeasure;

                if(parent !== undefined)
                {
                    parent.addControl(rect);
                }
                else
                {
                    this._advancedTexture.addControl(rect);
                }

                let _imageLT = new BABYLON.GUI.Image("imageLT",imageUrl);
                let _imageMT = new BABYLON.GUI.Image("imageMT",imageUrl);
                let _imageRT = new BABYLON.GUI.Image("imageRT",imageUrl);

                let _imageLMT = new BABYLON.GUI.Image("imageLMT",imageUrl);
                let _imageLM = new BABYLON.GUI.Image("imageLM",imageUrl);
                let _imageLMB = new BABYLON.GUI.Image("imageLMB",imageUrl);
                let _imageMM = new BABYLON.GUI.Image("imageMM",imageUrl);
                let _imageRM = new BABYLON.GUI.Image("imageRM",imageUrl);

                let _imageLB = new BABYLON.GUI.Image("imageLB",imageUrl);
                let _imageMB = new BABYLON.GUI.Image("imageMB",imageUrl);
                let _imageRB = new BABYLON.GUI.Image("imageRB",imageUrl);

                _imageLT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageMT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageRT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageLMT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageLM.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageLMB.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageMM.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageRM.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageLB.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageMB.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageRB.stretch = BABYLON.GUI.Image.STRETCH_FILL;

                _imageLT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageMT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageMT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageRT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                _imageRT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

                _imageLMT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLMT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageLM.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLM.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                _imageLMB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLMB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

                _imageMM.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageMM.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageRM.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                _imageRM.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

                _imageLB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                _imageMB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageMB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                _imageRB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                _imageRB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

                _imageLT.isHitTestVisible = false;
                _imageMT.isHitTestVisible = false;
                _imageRT.isHitTestVisible = false;
                _imageLMT.isHitTestVisible = false;
                _imageLM.isHitTestVisible = false;
                _imageLMB.isHitTestVisible = false;
                _imageMM.isHitTestVisible = false;
                _imageRM.isHitTestVisible = false;
                _imageLB.isHitTestVisible = false;
                _imageMB.isHitTestVisible = false;
                _imageRB.isHitTestVisible = false;

                if (imageUrl && imageUrl.indexOf("data:") === 0)
                {
                    _imageLT.src = imageUrl;
                    _imageMT.src = imageUrl;
                    _imageRT.src = imageUrl;
                    _imageLMT.src = imageUrl;
                    _imageLM.src = imageUrl;
                    _imageLMB.src = imageUrl;
                    _imageMM.src = imageUrl;
                    _imageRM.src = imageUrl;
                    _imageLB.src = imageUrl;
                    _imageMB.src = imageUrl;
                    _imageRB.src = imageUrl;
                }

                bg.addControl(_imageLT);
                bg.addControl(_imageMT);
                bg.addControl(_imageRT);
                bg.addControl(_imageLMT);
                bg.addControl(_imageLM);
                bg.addControl(_imageLMB);
                bg.addControl(_imageMM);
                bg.addControl(_imageRM);
                bg.addControl(_imageLB);
                bg.addControl(_imageMB);
                bg.addControl(_imageRB);
                rect.loaded = false;

                let ww = _rect.sizeX - (_rect.x + _rect.width);
                let hh = _rect.sizeY - (_rect.y + _rect.height);

                _imageLT.sourceLeft = 0;
                _imageLT.sourceTop = 0;
                _imageLT.sourceWidth = _rect.x;
                _imageLT.sourceHeight = _rect.y;
                _imageLT.width = _rect.x + "px";
                _imageLT.height = _rect.y + "px";

                _imageMT.sourceLeft = _rect.x;
                _imageMT.sourceTop = 0;
                _imageMT.sourceWidth = _rect.width;
                _imageMT.sourceHeight = _rect.y;
                _imageMT.height = _imageLT.height;
                _imageMT.left = _rect.x + "px";

                _imageRT.sourceLeft = _rect.x + _rect.width;
                _imageRT.sourceTop = 0;
                _imageRT.sourceWidth = ww;
                _imageRT.sourceHeight = _rect.y;
                _imageRT.width = ww + "px";
                _imageRT.height = _imageLT.height;

                _imageLMT.sourceLeft = _rect.at.x;
                _imageLMT.sourceTop = _rect.at.y;
                _imageLMT.sourceWidth = _rect.at.width;
                _imageLMT.sourceHeight = _rect.at.height;
                _imageLMT.width = _rect.at.width+ "px";
                _imageLMT.top = _rect.y + "px";

                _imageLM.sourceLeft = _rect.ac.x;
                _imageLM.sourceTop = _rect.ac.y;
                _imageLM.sourceWidth = _rect.ac.width;
                _imageLM.sourceHeight = _rect.ac.height;
                _imageLM.width = _rect.ac.width + "px";
                _imageLM.height = _rect.ac.height + "px";
                
                _imageLMB.sourceLeft = _rect.ab.x;
                _imageLMB.sourceTop = _rect.ab.y;
                _imageLMB.sourceWidth = _rect.ab.width;
                _imageLMB.sourceHeight = _rect.ab.height;
                _imageLMB.width = _rect.ab.width + "px";
                _imageLMB.top = (hh * -1) + "px";

                _imageMM.sourceLeft = _rect.x;
                _imageMM.sourceTop = _rect.y;
                _imageMM.sourceWidth = _rect.width;
                _imageMM.sourceHeight = _rect.height;
                _imageMM.left =  _rect.x + "px";
                _imageMM.top = _rect.y + "px";

                _imageRM.sourceLeft = _rect.x + _rect.width;
                _imageRM.sourceTop = _rect.y;
                _imageRM.sourceWidth = _rect.sizeX - (_rect.x + _rect.width);
                _imageRM.sourceHeight = _rect.height;
                _imageRM.width = _imageRT.width;
                _imageRM.top = _imageMM.top;

                _imageLB.sourceLeft = 0;
                _imageLB.sourceTop = _rect.y + _rect.height;
                _imageLB.sourceWidth = _rect.x;
                _imageLB.sourceHeight = _rect.sizeY - (_rect.y + _rect.height);
                _imageLB.width = _imageLT.width;
                _imageLB.height = hh + "px";

                _imageMB.sourceLeft = _rect.x;
                _imageMB.sourceTop = _rect.y + _rect.height;
                _imageMB.sourceWidth = _rect.width;
                _imageMB.sourceHeight = _rect.sizeY - (_rect.y + _rect.height);
                _imageMB.height = _imageLB.height;
                _imageMB.left = _imageMT.left;

                _imageRB.sourceLeft = _rect.x + _rect.width;
                _imageRB.sourceTop = _rect.y + _rect.height;
                _imageRB.sourceWidth = _rect.sizeX - (_rect.x + _rect.width);
                _imageRB.sourceHeight = _rect.sizeY - (_rect.y + _rect.height);
                _imageRB.width = _imageRT.width;
                _imageRB.height = _imageLB.height;

                _imageLT.onLoadedObservable.add(function(){
                    rect.loaded = true;
                    rect.ChangeTipDialogBackgroundSize(rect.widthInPixels,rect.heightInPixels);
                });

                rect.__proto__.ChangeTipDialogBackgroundOpecity = function (alpha)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.alpha = alpha;
                };

                rect.__proto__.ChangeTipDialogDir = function (dir)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    this.dir = dir;

                 //   this.ChangeTipDialogBackgroundSize( _obj.heightInPixels,_obj.widthInPixels);
                };

                rect.__proto__.ChangeTipDialogBackgroundSize = function (_w,_h)
                {
                    if( this.heightInPixels === _h && this.widthInPixels === _w)
                        return;

                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    let imageLT = _obj.getChildByName("imageLT");
                    if(imageLT === null)
                        return;

                    let imageMT = _obj.getChildByName("imageMT");
                    if(imageMT === null)
                        return;

                    let imageRT = _obj.getChildByName("imageRT");
                    if(imageRT === null)
                        return;

                    let imageLMT = _obj.getChildByName("imageLMT");
                    if(imageLMT === null)
                        return;

                    let imageLM = _obj.getChildByName("imageLM");
                    if(imageLM === null)
                        return;

                    let imageLMB = _obj.getChildByName("imageLMB");
                    if(imageLMB === null)
                        return;

                    let imageMM = _obj.getChildByName("imageMM");
                    if(imageMM === null)
                        return;

                    let imageRM = _obj.getChildByName("imageRM");
                    if(imageRM === null)
                        return;

                    let imageLB = _obj.getChildByName("imageLB");
                    if(imageLB === null)
                        return;

                    let imageMB = _obj.getChildByName("imageMB");
                    if(imageMB === null)
                        return;

                    let imageRB = _obj.getChildByName("imageRB");
                    if(imageRB === null)
                        return;

                    let rot = 0;
                    let imageWidth =  imageLT.domImage.width;
                    let imageHeight =  imageLT.domImage.height;

                    if(_w < imageWidth)
                        _w = imageWidth;

                    if(_h < imageHeight)
                        _h = imageHeight;

                    this.width = _w + "px";
                    this.height = _h +"px";
                    
                    let ww = imageWidth - (this.rectData.x + this.rectData.width);
                    let hh = imageHeight - (this.rectData.y + this.rectData.height);
                    let WW = 0;
                    let HH = 0;

                    if(this.dir === 0)
                    {
                        _obj.width = this.width;
                        _obj.height = this.height;
                        WW = _w - (this.rectData.x + ww);
                        HH = _h - (this.rectData.y + hh);// + this.rectData.at.height + this.rectData.ab.height);
                    }
                    else if(this.dir === 1)
                    {
                        rot = Math.PI / -2;
                        _obj.width = this.height;
                        _obj.height = this.width;
                        WW = _h - (this.rectData.x + ww);
                        HH = _w - (this.rectData.y + hh);// + this.rectData.at.height + this.rectData.ab.height);
                    }
                    else if(this.dir === 2)
                    {
                        rot = Math.PI;
                        _obj.width = this.width;
                        _obj.height = this.height;
                        WW = _w - (this.rectData.x + ww);
                        HH = _h - (this.rectData.y + hh);// + this.rectData.at.height + this.rectData.ab.height);
                    }
                    else
                    {
                        rot = Math.PI/2;
                        _obj.width = this.height;
                        _obj.height = this.width;
                        WW = _h - (this.rectData.x + ww);
                        HH = _w - (this.rectData.y + hh);// + this.rectData.at.height + this.rectData.ab.height);
                    }

                    let aH = HH - this.rectData.ac.height;
                    _obj.rotation = rot;

                    imageMT.width = WW + "px";
                    imageLMT.height = (aH * 0.5) + "px";
                    //imageLMT.top = (imageLT.topInPixels) + ( (this.rectData.y + imageLMT.heightInPixels) * 0.5 )+"px";

                    imageLMB.height = (aH * 0.5) + "px";
                    //imageLMB.top = (imageLM.topInPixels + ( (this.rectData.ac.height + imageLMB.heightInPixels) * 0.5)) +"px";

                    imageMM.width = WW + "px";
                    imageMM.height = HH + "px";

                    imageRM.height = HH + "px";
                    imageMB.width = WW + "px";
                };

                return rect;
            },

            CreateDialog :function(name,w,h, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let rect = new BABYLON.GUI.Container(name);
                rect.drag = false;
                rect.drop = true;
                rect.startingPoint = null;
                rect.buttonStart = null;
                rect._closeCallback = undefined;
                rect.width = w+"px";
                rect.height = h+"px";

                if(parent !== undefined)
                    parent.addControl(rect);
                else
                    this._advancedTexture.addControl(rect);

                let bg = new BABYLON.GUI.Rectangle("bg");
                bg.width = w +"px";
                bg.height = h+"px";
                bg.thickness = false;
                bg.background = "white";
                bg.cornerRadius = 3;
                bg.isHitTestVisible = false;
                rect.addControl(bg);

                let dragButton = new BABYLON.GUI.Button("drag");

                dragButton.pointerEnterAnimation = undefined;
                dragButton.pointerOutAnimation  = undefined;
                dragButton.pointerDownAnimation  = undefined;
                dragButton.pointerUpAnimation  = undefined;
                dragButton.thickness = false;
                dragButton.alpha = 0;
                dragButton.width = w+"px";
                dragButton.height = h+"px";
                dragButton.background = 'green';

                rect.addControl(dragButton);

                dragButton.onPointerEnterObservable.add(kInstance.enterButton);
                dragButton.onPointerOutObservable.add(kInstance.outButton);
                dragButton.onPointerDownObservable.add(kInstance.downButton);
                dragButton.onPointerUpObservable.add(kInstance.upButton);
                dragButton.onPointerMoveObservable.add(kInstance.moveButton);
                rect.onPointerMoveObservable.add(kInstance.moveButton);

                rect.__proto__.MoveDialogLock = function (enable)
                {
                    let _obj = this.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.isHitTestVisible = enable;
                };

                rect.__proto__.ChangeDialogBackgroundCornerRadius = function (r)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.cornerRadius = r;
                };

                rect.__proto__.ChangeDialogBackgroundColor = function (color)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.background = color;
                };

                rect.__proto__.ChangeDialogBackgroundOpecity = function (alpha)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.alpha = alpha;
                };

                rect.__proto__.ChangeDialogBackgroundSize = function (_w,_h)
                {
                    this.width = _w+"px";
                    this.height = _h+"px";

                    let _obj = this.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.width = _w+"px";
                    _obj.height = _h+"px";

                    _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.width = _w +"px";
                    _obj.height = _h +"px";
                };

                return rect;
            },

            CreateTitleDialog :function(name,w,h, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let rect = new BABYLON.GUI.Container(name);
                rect.drag = false;
                rect.drop = true;
                rect.startingPoint = null;
                rect.buttonStart = null;
                rect._closeCallback = undefined;
                rect.width = w+"px";
                rect.height = h+"px";

                if(parent !== undefined)
                    parent.addControl(rect);
                else
                    this._advancedTexture.addControl(rect);

                let bg = new BABYLON.GUI.Rectangle("bg");
                bg.width = w +"px";
                bg.height = h+"px";
                bg.thickness = false;
                bg.background = "white";
                bg.cornerRadius = 3;
                bg.isHitTestVisible = false;
                rect.addControl(bg);

                let line = new BABYLON.GUI.Rectangle('line');
                if(w > 24)
                {
                    line.width = (w -24) +"px";
                }
                else
                {
                    line.isVisible = false;
                }

                line.height = "1px";
                line.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
                line.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                line.thickness = false;
                line.background = "black";
                line.isHitTestVisible = false;
                rect.addControl(line);

                let dragButton = new BABYLON.GUI.Button("drag");

                dragButton.pointerEnterAnimation = undefined;
                dragButton.pointerOutAnimation  = undefined;
                dragButton.pointerDownAnimation  = undefined;
                dragButton.pointerUpAnimation  = undefined;
                dragButton.thickness = false;
                dragButton.alpha = 0;
                dragButton.width = w+"px";
                dragButton.height = h+"px";
                dragButton.background = 'green';

                rect.addControl(dragButton);

                dragButton.onPointerEnterObservable.add(kInstance.enterButton);
                dragButton.onPointerOutObservable.add(kInstance.outButton);
                dragButton.onPointerDownObservable.add(kInstance.downButton);
                dragButton.onPointerUpObservable.add(kInstance.upButton);
                dragButton.onPointerMoveObservable.add(kInstance.moveButton);
                rect.onPointerMoveObservable.add(kInstance.moveButton);

                rect.__proto__.MoveTitleDialogLock = function (enable)
                {
                    let _obj = this.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.isHitTestVisible = enable;
                };

                rect.__proto__.ChangeTitleDialogBackgroundCornerRadius = function (r)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.cornerRadius = r;
                };

                rect.__proto__.ChangeTitleDialogBackgroundColor = function (color)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.background = color;
                };

                rect.__proto__.ChangeTitleDialogLineColor = function (color)
                {
                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.background = color;
                };

                rect.__proto__.ChangeTitleDialogBackgroundOpecity = function (alpha)
                {
                    let _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.alpha = alpha;
                };

                rect.__proto__.ChangeTitleDialogLineOpecity = function (alpha)
                {
                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.alpha = alpha;
                };

                rect.__proto__.ChangeTitleDialogBackgroundSize = function (_w,_h)
                {
                    this.width = _w+"px";
                    this.height = _h+"px";

                    let _obj = this.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.width = _w+"px";
                    _obj.height = _h+"px";

                    _obj = this.getChildByName("bg");
                    if(_obj === null)
                        return;

                    _obj.width = _w +"px";
                    _obj.height = _h +"px";

                    if(_w <= 24)
                    {
                        _obj = this.getChildByName("line");
                        if(_obj === null)
                            return;

                        _obj.isVisible = false;
                    }
                };

                rect.__proto__.ChangeTitleDialogLineSize = function (_w)
                {
                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;
                    if(_w -24 < 1)
                        return;
                    _obj.width = (_w -24) +"px";
                };

                rect.__proto__.ChangeTitleDialogLineCenterOffset = function (_y)
                {
                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.top = _y+"px";
                };

                return rect;
            },

            CreateCloseDialog :function(name,w,h,callback, parent)
            {
                if(this._advancedTexture === undefined)
                {
                    this.Ceate();
                }

                let rect = new BABYLON.GUI.Rectangle(name);
                rect.width = w+"px";
                rect.height = h+"px";
                rect.color = 'gray';
                //rect.cornerRadius = 20;
                rect.thickness = false;
                rect.background = "gray";
                rect.isHitTestVisible = false;
                rect.drag = false;
                rect.drop = true;
                rect.startingPoint = null;
                rect.buttonStart = null;
                rect._closeCallback = undefined;

                if(parent !== undefined)
                    parent.addControl(rect);
                else
                    this._advancedTexture.addControl(rect);

                let title = new BABYLON.GUI.Rectangle('title');
                title.width = w + "px";
                title.height = "40px";
                title.color = 'black';
                title.top = '2px';
                title.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                //rect.cornerRadius = 20;
                title.thickness = false;
                title.background = "black";
                title.isHitTestVisible = false;
                rect.addControl(title);

                let dragButton = new BABYLON.GUI.Button("drag");

                //button1.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                //button1.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                // dragButton.paddingBottom = "40px";
                // dragButton.paddingLeft = "40px";
                //w,h,

                dragButton.pointerEnterAnimation = undefined;
                dragButton.pointerOutAnimation  = undefined;
                dragButton.pointerDownAnimation  = undefined;
                dragButton.pointerUpAnimation  = undefined;

                dragButton.alpha = 0;
                dragButton.width = w+"px";
                dragButton.height = h+"px";
                dragButton.color = 'green';
                dragButton.background = 'green';
                //button1.notRenderable = true;

                rect.addControl(dragButton);
                // dragButton.zIndex = 1000;

                let closeButton = BABYLON.GUI.Button.CreateSimpleButton("Close", "X");

                closeButton.width = "20px";
                closeButton.height = "20px";
                closeButton.left = w /2 -12  + "px";
                closeButton.top =  -h /2 + 12 + "px";
                closeButton.color = 'white';
                closeButton.background = "gray";
                rect.addControl(closeButton);

                if(callback !== undefined)
                {
                    rect._closeCallback = callback;
                    closeButton.onPointerDownObservable.add(function()
                    {
                        if(rect._closeCallback !== null)
                        rect._closeCallback();

                        rect.notRenderable = true;
                    }.bind(this));
                }

                dragButton.onPointerEnterObservable.add(kInstance.enterButton);
                dragButton.onPointerOutObservable.add(kInstance.outButton);
                dragButton.onPointerDownObservable.add(kInstance.downButton);
                dragButton.onPointerUpObservable.add(kInstance.upButton);
                dragButton.onPointerMoveObservable.add(kInstance.moveButton);
                rect.onPointerMoveObservable.add(kInstance.moveButton);

                rect.__proto__.ChangeBackground = function (color)
                {
                    this.background = color;
                };

                rect.__proto__.ChangeBackgroundOpecity = function (alpha)
                {
                    this.alpha = alpha;
                };

                rect.__proto__.ChangeSize = function (_w,_h)
                {
                    this.width = _w+"px";
                    this.height = _h+"px";

                    let _obj = this.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.width = _w+"px";
                    _obj.height = _h+"px";

                    _obj = this.getChildByName("title");
                    if(_obj === null)
                        return;

                    _obj.width = _w+"px";

                    _obj = this.getChildByName("Close");
                    if(_obj === null)
                        return;

                    _obj.left = _w /2 -12  + "px";
                    _obj.top =  -_h /2 + 12 + "px";
                };

                return rect;
            },

            CreateRectImageDialog :function(name,imageUrl,rect,w,h, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let _rect = new BABYLON.GUI.Container(name);
                _rect.width = w + "px";
                _rect.height = h + "px";
                _rect.rectData = rect;
                _rect.thickness = false;
                let _imageLT = new BABYLON.GUI.Image("imageLT",imageUrl);
                let _imageMT = new BABYLON.GUI.Image("imageMT",imageUrl);
                let _imageRT = new BABYLON.GUI.Image("imageRT",imageUrl);
                let _imageLM = new BABYLON.GUI.Image("imageLM",imageUrl);
                let _imageMM = new BABYLON.GUI.Image("imageMM",imageUrl);
                let _imageRM = new BABYLON.GUI.Image("imageRM",imageUrl);
                let _imageLB = new BABYLON.GUI.Image("imageLB",imageUrl);
                let _imageMB = new BABYLON.GUI.Image("imageMB",imageUrl);
                let _imageRB = new BABYLON.GUI.Image("imageRB",imageUrl);

                _imageLT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageMT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageRT.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageLM.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageMM.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageRM.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageLB.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageMB.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                _imageRB.stretch = BABYLON.GUI.Image.STRETCH_FILL;

                _imageLT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageMT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageMT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageRT.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                _imageRT.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

                _imageLM.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLM.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageMM.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageMM.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
                _imageRM.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                _imageRM.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;

                _imageLB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageLB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                _imageMB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                _imageMB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                _imageRB.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_RIGHT;
                _imageRB.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;

                _imageLT.isHitTestVisible = false;
                _imageMT.isHitTestVisible = false;
                _imageRT.isHitTestVisible = false;
                _imageLM.isHitTestVisible = false;
                _imageMM.isHitTestVisible = false;
                _imageRM.isHitTestVisible = false;
                _imageLB.isHitTestVisible = false;
                _imageMB.isHitTestVisible = false;
                _imageRB.isHitTestVisible = false;

                if (imageUrl && imageUrl.indexOf("data:") === 0)
                {
                    _imageLT.src = imageUrl;
                    _imageMT.src = imageUrl;
                    _imageRT.src = imageUrl;
                    _imageLM.src = imageUrl;
                    _imageMM.src = imageUrl;
                    _imageRM.src = imageUrl;
                    _imageLB.src = imageUrl;
                    _imageMB.src = imageUrl;
                    _imageRB.src = imageUrl;
                }

                _rect.addControl(_imageLT);
                _rect.addControl(_imageMT);
                _rect.addControl(_imageRT);
                _rect.addControl(_imageLM);
                _rect.addControl(_imageMM);
                _rect.addControl(_imageRM);
                _rect.addControl(_imageLB);
                _rect.addControl(_imageMB);
                _rect.addControl(_imageRB);

                let ww = _rect.rectData.sizeX - (_rect.rectData.x + _rect.rectData.width);
                let hh = _rect.rectData.sizeY - (_rect.rectData.y + _rect.rectData.height);

                _imageLT.sourceLeft = 0;
                _imageLT.sourceTop = 0;
                _imageLT.sourceWidth = _rect.rectData.x;
                _imageLT.sourceHeight = _rect.rectData.y;
                _imageLT.width = _rect.rectData.x + "px";
                _imageLT.height = _rect.rectData.y + "px";

                _imageMT.sourceLeft = _rect.rectData.x;
                _imageMT.sourceTop = 0;
                _imageMT.sourceWidth = _rect.rectData.width;
                _imageMT.sourceHeight = _rect.rectData.y;
                _imageMT.height = _imageLT.height;
                _imageMT.left = _imageLT.width;

                _imageRT.sourceLeft = _rect.rectData.x + _rect.rectData.width;
                _imageRT.sourceTop = 0;
                _imageRT.sourceWidth = ww;
                _imageRT.sourceHeight = _rect.rectData.y;
                _imageRT.width = ww + "px";
                _imageRT.height = _imageLT.height;

                _imageLM.sourceLeft = 0;
                _imageLM.sourceTop = _rect.rectData.y;
                _imageLM.sourceWidth = _rect.rectData.x;
                _imageLM.sourceHeight = _rect.rectData.height;
                _imageLM.width =_imageLT.width;
                _imageLM.top = _imageLT.height;

                _imageMM.sourceLeft = _rect.rectData.x;
                _imageMM.sourceTop = _rect.rectData.y;
                _imageMM.sourceWidth = _rect.rectData.width;
                _imageMM.sourceHeight = _rect.rectData.height;
                _imageMM.left = _imageLT.width;
                _imageMM.top = _imageLM.top;

                _imageRM.sourceLeft = _rect.rectData.x + _rect.rectData.width;
                _imageRM.sourceTop = _rect.rectData.y;
                _imageRM.sourceWidth = _rect.rectData.sizeX - (_rect.rectData.x + _rect.rectData.width);
                _imageRM.sourceHeight = _rect.rectData.height;
                _imageRM.width = _imageRT.width;
                _imageRM.top = _imageLM.top;

                _imageLB.sourceLeft = 0;
                _imageLB.sourceTop = _rect.rectData.y + _rect.rectData.height;
                _imageLB.sourceWidth = _rect.rectData.x;
                _imageLB.sourceHeight = _rect.rectData.sizeY - (_rect.rectData.y + _rect.rectData.height);
                _imageLB.width = _imageLT.width;
                _imageLB.height = hh + "px";

                _imageMB.sourceLeft = _rect.rectData.x;
                _imageMB.sourceTop = _rect.rectData.y + _rect.rectData.height;
                _imageMB.sourceWidth = _rect.rectData.width;
                _imageMB.sourceHeight = _rect.rectData.sizeY - (_rect.rectData.y + _rect.rectData.height);
                _imageMB.height = _imageLB.height;
                _imageMB.left = _imageLT.width;

                _imageRB.sourceLeft = _rect.rectData.x + _rect.rectData.width;
                _imageRB.sourceTop = _rect.rectData.y + _rect.rectData.height;
                _imageRB.sourceWidth = _rect.rectData.sizeX - (_rect.rectData.x + _rect.rectData.width);
                _imageRB.sourceHeight = _rect.rectData.sizeY - (_rect.rectData.y + _rect.rectData.height);
                _imageRB.width = _imageRT.width;
                _imageRB.height = _imageLB.height;

                _imageLT.onLoadedObservable.add(function(){
                    _rect.loaded = true;
                    _rect.ChangeRectImageDialogSize(_rect.widthInPixels,_rect.heightInPixels);
                });

                _rect.isHitTestVisible = false;

                _rect.drag = false;
                _rect.drop = true;
                _rect.startingPoint = null;
                _rect.buttonStart = null;
                _rect._closeCallback = undefined;

                if(parent !== undefined)
                    parent.addControl(_rect);
                else
                    this._advancedTexture.addControl(_rect);

                let dragButton = new BABYLON.GUI.Button("drag");

                dragButton.pointerEnterAnimation = undefined;
                dragButton.pointerOutAnimation  = undefined;
                dragButton.pointerDownAnimation  = undefined;
                dragButton.pointerUpAnimation  = undefined;

                dragButton.alpha = 0;
                dragButton.width = w+"px";
                dragButton.height = h+"px";
                dragButton.left = (w * 0.5) + "px";
                dragButton.top = (h * 0.5) + "px";

                _rect.addControl(dragButton);

                dragButton.onPointerEnterObservable.add(kInstance.enterButton);
                dragButton.onPointerOutObservable.add(kInstance.outButton);
                dragButton.onPointerDownObservable.add(kInstance.downButton);
                dragButton.onPointerUpObservable.add(kInstance.upButton);
                dragButton.onPointerMoveObservable.add(kInstance.moveButton);
                _rect.onPointerMoveObservable.add(kInstance.moveButton);

                 _rect.__proto__.MoveRectImageDialogLock = function (enable)
                {
                    let _obj = this.getChildByName("drag");
                    if(_obj === null)
                        return;

                    _obj.isHitTestVisible = enable;
                };

                _rect.__proto__.ChangeRectImageDialogBackgroundOpecity = function (alpha)
                {
                    this.alpha = alpha;
                };

                _rect.__proto__.ChangeRectImageDialogSize = function (_w,_h)
                {
                    let imageLT = this.getChildByName("imageLT");
                    if(imageLT === null)
                        return;

                    let imageMT = this.getChildByName("imageMT");
                    if(imageMT === null)
                        return;

                    let imageRT = this.getChildByName("imageRT");
                    if(imageRT === null)
                        return;

                    let imageLM = this.getChildByName("imageLM");
                    if(imageLM === null)
                        return;

                    let imageMM = this.getChildByName("imageMM");
                    if(imageMM === null)
                        return;

                    let imageRM = this.getChildByName("imageRM");
                    if(imageRM === null)
                        return;

                    let imageLB = this.getChildByName("imageLB");
                    if(imageLB === null)
                        return;

                    let imageMB = this.getChildByName("imageMB");
                    if(imageMB === null)
                        return;

                    let imageRB = this.getChildByName("imageRB");
                    if(imageRB === null)
                        return;

                    let imageWidth =  imageLT.domImage.width;
                    let imageHeight =  imageLT.domImage.height;

                    if(_w < imageWidth)
                        _w = imageWidth;

                    if(_h < imageHeight)
                        _h = imageHeight;

                    this.width = _w +"px";
                    this.height = _h + "px";

                    let ww = imageWidth - (this.rectData.x + this.rectData.width);
                    let hh = imageHeight - (this.rectData.y + this.rectData.height);
                    let WW = _w - (this.rectData.x + ww);
                    let HH = _h - (this.rectData.y + hh);

                    imageMT.width = WW + "px";
                    imageLM.height = HH + "px";
                    imageMM.width = WW + "px";
                    imageMM.height = HH + "px";
                    imageRM.height = HH + "px";
                    imageMB.width = WW + "px";
                };

                return _rect;
            },

            CreateContainer :function(name,parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let panel = new BABYLON.GUI.Container(name);
                panel.thickness = false;
                if(parent !== undefined)
                {
                    parent.addControl(panel);
                }
                else
                {
                    this._advancedTexture.addControl(panel);
                }

                return panel;
            },

            CreateRectangle :function(name,w,h, parent)
            {
                if(this._advancedTexture === undefined)
                {
                    this.Ceate();
                }

                let rect = new BABYLON.GUI.Rectangle(name);

                rect.thickness = false;
                rect.background = "white";
                rect.width = w+"px";
                rect.height = h+"px";

                if(parent !== undefined)
                {
                    parent.addControl(rect);
                }
                else
                {
                    this._advancedTexture.addControl(rect);
                }

                return rect;
            },
            CreateSimpleButton :function(name, text, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let button = BABYLON.GUI.Button.CreateSimpleButton(name, text);
                if(parent !== undefined)
                {
                    parent.addControl(button);
                }
                else
                {
                    this._advancedTexture.addControl(button);
                }

                return button;
            },

            CreateSimpleImageButton :function(name, fileName, parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let button = BABYLON.GUI.Button.CreateImageOnlyButton(name, fileName);
                button.thickness = false;

                if(parent !== undefined)
                {
                    parent.addControl(button);
                }
                else
                {
                    this._advancedTexture.addControl(button);
                }

                return button;
            },

            CreateTextBlock : function(name,parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let textBlock = new BABYLON.GUI.TextBlock(name);
                textBlock.isHitTestVisible = false;

                if(parent !== undefined)
                {
                    parent.addControl(textBlock);
                }
                else
                {
                    this._advancedTexture.addControl(textBlock);
                }

                return textBlock;
            },

            CreateRichTextBlock : function(name,parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let richTextBlock = new BABYLON.GUI.RichTextBlock(name);
                richTextBlock.isHitTestVisible = false;

                if(parent !== undefined)
                {
                    parent.addControl(richTextBlock);
                }
                else
                {
                    this._advancedTexture.addControl(richTextBlock);
                }

                return richTextBlock;
            },

            CreateImage : function(name,imageUrl,parent)
            {
                let image = new BABYLON.GUI.Image(name,imageUrl);
                if (imageUrl && imageUrl.indexOf("data:") === 0)
                {
                    image.src = imageUrl;
                }

                if(parent !== undefined)
                {
                    parent.addControl(image);
                }
                else
                {
                    this._advancedTexture.addControl(image);
                }
                image.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                //image.autoScale = true;
                return image;
            },

            CreateRectImage : function(name,imageUrl,rect,width,height, parent)
            {
                let image = new BABYLON.GUI.Image(name,imageUrl);
                if (imageUrl && imageUrl.indexOf("data:") === 0)
                {
                    image.src = imageUrl;
                }

                if(parent !== undefined)
                {
                    parent.addControl(image);
                }
                else
                {
                    this._advancedTexture.addControl(image);
                }

                image.sourceLeft = rect.x;
                image.sourceTop = rect.y;
                image.sourceWidth = rect.width;
                image.sourceHeight = rect.height;
                image.width = width + "px";
                image.height = height + "px";
                image.stretch = BABYLON.GUI.Image.STRETCH_FILL;
                //image.stretch = BABYLON.GUI.Image.STRETCH_UNIFORM;
                //image.autoScale = true;
                return image;
            },

            CreateEllipse : function(name,parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let ellipse = new BABYLON.GUI.Ellipse(name);
                ellipse.color = "white";
                ellipse.thickness = false;
                ellipse.background = "white";

                if(parent !== undefined)
                {
                    parent.addControl(ellipse);
                }
                else
                {
                    this._advancedTexture.addControl(ellipse);
                }

                return ellipse;
            },

            CreateSimpleSlider : function(name,parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let slider = new BABYLON.GUI.SimpleSlider(name);
                slider.minimum = 0;
                slider.maximum = 1;
                slider.value = 0.5;
                slider.height = "20px";
                slider.width = "100px";
                slider.color = "white";
                slider.background = "grey";
                //slider.rotation = 3.14 / -2;
                // slider.left = "120px";
                // slider.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                // slider.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_CENTER;
                // slider.onValueChangedObservable.add(function (value) {
                //     sphere.scaling = (new BABYLON.Vector3(1, 1, 1)).scale(value);
                // });

                if(parent !== undefined)
                {
                    parent.addControl(slider);
                }
                else
                {
                    this._advancedTexture.addControl(slider);
                }

                return slider;
            },

            CreateDrawLine : function(name,parent)
            {
                if(this._advancedTexture === null || this._advancedTexture === undefined)
                {
                    if(kInstance === null || kInstance === undefined)
                        kInstance = Init();

                    this.Create();
                }

                let drawLine = new BABYLON.GUI.Line(name);
                drawLine.color = "white";
                drawLine.lineWidth = 1;

                if(parent !== undefined)
                {
                    parent.addControl(drawLine);
                }
                else
                {
                    this._advancedTexture.addControl(drawLine);
                }

                return drawLine;
            },

            CreateDrawLineDialog : function(name, w, h, parent)
            {
                if(this._advancedTexture === undefined)
                {
                    this.Ceate();
                }

                let rect = new BABYLON.GUI.Rectangle(name);
                rect.width = w+"px";
                rect.height = h+"px";
                rect.color = 'gray';
                rect.thickness = false;
                rect.background = "gray";
                rect.isHitTestVisible = false;

                if(parent !== undefined)
                    parent.addControl(rect);
                else
                    this._advancedTexture.addControl(rect);

                let drawLine = new BABYLON.GUI.DrawLine("line");
                drawLine.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
                drawLine.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
                drawLine.color = "white";
                drawLine.lineWidth = 1;
                drawLine.left = "4px";
                drawLine.top = "-4px";
                rect.addControl(drawLine);

                rect.__proto__.SetPoints = function (points)
                {
                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.points = points;
                };

                rect.__proto__.AddPoint = function (p)
                {
                    if(p === null || p === undefined)
                        return;

                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.push(p);
                };

                rect.__proto__.LineColor = function (color)
                {
                    if(color === null || color === undefined)
                        return;

                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.color = color;
                };

                rect.__proto__.LineWidth = function (lineWidth)
                {
                    if(lineWidth === null || lineWidth === undefined)
                        return;

                    let _obj = this.getChildByName("line");
                    if(_obj === null)
                        return;

                    _obj.lineWidth = lineWidth;
                };

                rect.__proto__.ChangeSize = function (_w,_h)
                {
                    this.width = _w+"px";
                    this.height = _h+"px";

                    // let _obj = this.getChildByName("drag");
                    // if(_obj === null)
                    //     return;

                    // _obj.width = _w+"px";
                    // _obj.height = _h+"px";
                };

                return rect;
            },

            _findByName: function(name,type,root)
            {
                if(root.name === name && root.typeName === type)
                {
                    return root;
                }
                else
                {
                    if(root.children != null)
                    {
                        for(let i = 0; i < root.children.length; ++i)
                        {
                            let obj = this._findByName(name,type,root.children[i]);

                            if(obj)
                                return obj;
                        }
                    }
                }

                return null;
            },

            GetUIByName: function(name,type)
            {
                if(name === undefined || this._advancedTexture === undefined || this._advancedTexture === null)
                    return undefined;

                let obj = this._findByName(name,type,this._advancedTexture.rootContainer);

                return obj;
            },

            GetUIManager : function()
            {
                return this._advancedTexture;
            },

            Dispose : function()
            {
                if(this._advancedTexture !== null)
                    this._advancedTexture.dispose();

                this._advancedTexture = undefined;
            },
        };
    };

    return {
        GetInstance:function()
        {
            if(!kInstance)
            {
                kInstance = Init();
            }

            return kInstance;
        },
    };
})();

