var SVG_MAP = {};
        var pathOpt = {
            fill: "#fff9c5",
            stroke: "#eeeeee",
            "stroke-width": 2,
            "stroke-linejoin": "round"
        };
        var textOpt = {
            "font-size": '15px',
            "font-family": "Microsoft YaHei,微软雅黑,STXihei,华文细黑,serif"
        };


      var textOpt2 = {
            "font-size": '18px',
            "font-family": "Microsoft YaHei,微软雅黑,STXihei,华文细黑,serif"
        };

        var $backIcon;
        CODE_LIST = [];

        function svgObj(key) {
            this.key = key;
            this.pathMap = {};
            this.init(key);
        }

        svgObj.prototype = {
            init: function (key) {
                var self = this;
                //COMMON_PATH+ "/common/data/area/areamap/byareacode.do"
                $.get(COMMON_PATH + "/common/data/area/areamap/byareacode.do", {
                    "areaCode": key,
                    'basePlatId': selectedPlat.basePlatformDataId
                }, function (data) {
                    var data = data.result;
                    //var data= data.result
                    var obj = JSON.parse(data.mapOutput);
                    var hasRoom;
                    var svgData;
                    var areaName;
                    var keyMap;
                    var schoolDatas = [];
                    if (obj != null) {
                        hasRoom = obj.hasRoom;
                        svgData = obj.svgData;
                        areaName = obj.areaName;
                        schoolDatas = obj.schoolData;
                        keyMap = obj.keyMap;
                    }
                    var islands = "";
                    if (self.key == "000000") {
                        islands = "with-islands";
                    } else if (self.key == "460000") {
                        islands = "hn-with-islands";
                    } else {
                        islands = " ";
                    }
                    self.$elm = $('<div data-maincode="' + self.key + '"/>').addClass('svg-item').addClass(islands).appendTo('.section-map');
                    self.hasRoom = hasRoom;
                    var svgData = self.svgData = svgData;
                    self.areaName = areaName;
                    self.schoolData = schoolDatas;
                    self.keyMap = keyMap;

                    self.paper = Raphael(self.$elm[0], 548, 548);
                    self.paper.setViewBox(0, 0, 660, 660, false);
                    self.draw();
                    self.show();
                    self.bindEvent();
                    var keyMap = {};
                    var keyTab = [];
                    for (var i = 0, len = svgData.length; i < len; i++) {
                        var shap = svgData[i];
                        if (shap.shap == 'path') {
                            shap.color = COLOR_GROUP_MAP[shap.color] || shap.color;
                        }
                        if (shap.shap != 'satr' && !keyMap[shap.key]) {
                            keyMap[shap.key] = 1;
                            keyTab.push(shap.key);
                        }
                    }
                    self.getChilds(keyTab.join(','));
                }, 'json');
            },
            bindEvent: function () {
                var self = this;
                var timer = null;
                var hoverPathKey;
                var hoverTimeId;
                var mouseenterElm = false;
                this.$elm.on('mouseenter', 'text,path,image,shape', function (event) {
                    clearTimeout(timer)
                    mouseenterElm = true;
                    var key = this.getAttribute('data-key');
                    var shap = this.getAttribute('data-shap');
                    if (shap == 'star') return;//星星page进行处理
                    if (hoverPathKey == key) return;
                    if (self.hasRoom.indexOf(key) != -1) {
                        hoverPathKey = key;
                        var rElmPath = self.pathMap[key];
                        if (rElmPath) {
                            rElmPath.stop();
                            rElmPath.animate({
                                fill: rElmPath[0].getAttribute('data-color').split(',')[1]
                            }, 500, function () {
                                page.hoverShap(key);
                            });
                        }
                    }
                    if (this.tagName == 'path' || this.tagName == "text") {
                        clearTimeout(timer);
                        var pageX = event.pageX;
                        var pageY = event.pageY;
                        if (pageX == undefined) {
                            pageX = event.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
                            pageY = event.clientY + document.body.scrollTop || document.documentElement.scrollTop;
                        }
                        timer = setTimeout(function () {
                            //根据区域id获取行政区名称
                            initMapCount(key);
                            getClassToClassCount(key)
                            //$(".area-name").css({left: pageX, top: pageY })
                        }, 20)
                    }

                    //$("#mapAreaName").html($("text[data-key='"+key+"']").find("tspan").html());//改统计头部区域名字
                }).on('mouseleave', 'text,path,image,shape', function (event) {
                    var key = this.getAttribute('data-key');
                    var shap = this.getAttribute('data-shap');
                    if (shap == 'star') return;//星星page进行处理
                    hoverPathKey = null;
                    if (self.hasRoom.indexOf(key) != -1) {
                        setTimeout(function () {
                            if (hoverPathKey != key) {
                                var rElmPath = self.pathMap[key];
                                if (rElmPath) {
                                    rElmPath.stop();
                                    rElmPath.animate({
                                        fill: rElmPath[0].getAttribute('data-color').split(',')[0]
                                    }, 500);
                                }
                            }
                        }, 200);
                    }
                    //地区的悬浮事件
                    if (this.tagName == 'path' || this.tagName == "text") {
                        clearTimeout(timer);
                        var pageX = event.pageX;
                        var pageY = event.pageY;
                        if (pageX == undefined) {
                            pageX = event.clientX + document.body.scrollLeft || document.documentElement.scrollLeft;
                            pageY = event.clientY + document.body.scrollTop || document.documentElement.scrollTop;
                        }
                        // timer = setTimeout(function () {
                        //     $(".area-name").hide()
                        // }, 20)
                    }
                }).on('click', 'text,path,image,shape', function () {
                    var key = this.getAttribute('data-key');
                    var shap = this.getAttribute('data-shap');
                    if (shap == 'star') return;//星星page进行处理
                    if (self.hasRoom.indexOf(key) != -1) {
                        params.areaCode= key;
                        // 同步更新右边的数据
                        initMapCount(key);
                        getClassToClassCount(key);
                        page.clickShap(key, self.keyChildMap[key]);
                    }
                }).on('mousemove', 'text,image,shape', function () {
                    return false;
                }).on('mousemove', function () {
                    if (mouseenterElm) {
                        page.hoverShap(self.key);
                        mouseenterElm = false;
                    }
                });
                /* 学校悬浮事件 */
//                        var _timer=null;
//                        $(".schoolStar").on("mouseover",function(e){
//                            clearTimeout(_timer)
//                            var $schoolName=$(this).attr("schoolName")
//                            var scrollTop=document.documentElement.scrollTop || document.body.scrollTop,
//                                mouse=[e.clientX+8, e.clientY + scrollTop -10];
//                            $("#schoolInfo").css({left:mouse[0]+"px",top:mouse[1]+"px"}).html($schoolName).show()
//                        }).on("mouseleave",function(){
//                            _timer=setTimeout(function(){
//                                $("#schoolInfo").hide()
//                            },10)
//                        });
//                        $("#schoolInfo").on("mouseenter",function(){
//                            clearTimeout(_timer)
//                        }).on("mouseleave",function(){
//                            _timer=setTimeout(function(){
//                                $("#schoolInfo").hide()
//                            },10)
//                        })
            },
            draw: function () {
                var paper = this.paper;
                var hasRoom = this.hasRoom;
                var self = this;
                $.each(this.svgData, function () {
                    var shap = this;
                    var key = shap.key;
                    var _hasRoom = hasRoom.indexOf(key) != -1;
                    var opt = {};
                    var rElm;
                    if (_hasRoom) {
                        opt['cursor'] = "pointer";
                    }
                    if (shap.shap == 'path') {
                        shap.color = COLOR_GROUP_MAP[shap.color] || shap.color;
                        opt['fill'] = _hasRoom ? shap.color.split(',')[0] : shap.color.split(',')[2];
                        rElm = paper.path(shap.path).attr($.extend({}, pathOpt, opt));
                        rElm[0].setAttribute('data-shap', shap.shap);
                        rElm[0].setAttribute('data-key', key);
                        rElm[0].setAttribute('data-color', shap.color);
                        if (_hasRoom) {
                            self.pathMap[key] = rElm;
                        }
                    } else if (shap.shap == 'center') {
                        rElm = paper.image(getCenterImg(shap.level), shap.x, shap.y, 10, 10).attr(opt);
                        rElm[0].setAttribute('data-key', key);
                        var $fillColor = shap.TColor || "#000000";
                        if (shap.text != 1 && (shap.isShowText != false)) {
                            rElm = paper.text(shap.x, shap.y - 5, shap.textArea || self.keyMap[key]).attr($.extend(opt, textOpt)).attr({fill: $fillColor});
                            rElm[0].setAttribute('data-key', key);
                        }
                    } else if (shap.shap == 'text') {
                        if (shap.isShowText != false) {
                            var $fillColor = shap.TColor || "#000000";
                            self.keyMap[key] = self.keyMap[key] == undefined ? " " : self.keyMap[key];
                            rElm = paper.text(shap.x, shap.y - 5, shap.textArea || self.keyMap[key]).attr($.extend(opt, textOpt)).attr({fill: $fillColor});
                            rElm[0].setAttribute('data-key', key);
                        }
                    } else if (shap.shap == 'star') {
                        rElm = paper.text(shap.x, shap.y - 5, "★").attr({
                            stroke: '#FF2424',
                            fill: '#FF2424',
                            cursor: "pointer"
                        });
                        rElm[0].setAttribute('data-shap', shap.shap);
                        rElm[0].setAttribute('data-key', key);
                        rElm[0].setAttribute('data-textarea', shap.textArea || self.keyMap[key]);
                    }
                });
                /* 遍历学校，添加学校图标 */
//                        if(this.schoolData && (this.schoolData.length>0) ){
//                            $.each(this.schoolData, function (index,value) {
//                                var oImage= paper.image("http://imgcdn.9itest.com:85/img/map/school.png", value.x, value.y, 10, 10)
//                                $(oImage.node).attr({parentCode: value.parentCode,schoolName:value.schoolName, id: value.id,class:"schoolStar"})
//                            });
//                        }

                if (self.areaName) {
                    /* paper.text(660-(30*self.areaName.length/2), 30, self.areaName).attr({
                     "font-size": '30px',
                     "font-family": 'Microsoft YaHei,微软雅黑,STXihei,华文细黑,serif'
                     }); */
                    $("#mapAreaName").html(self.areaName);
                }
            },
            getChilds: function (keys) {
                var self = this;
//                        self.keyChildMap={
//                            650000:1
//                        }
                $.post(COMMON_PATH + '/common/data/area/areamap/byareacodes.do', {
                    basePlatId: selectedPlat.basePlatformDataId,
                    areaCode: keys,
                }, function (data) {
                    var data = data.result;
                    var map = {};
                    for (var i = 0, len = data.length; i < len; i++) {
                        map[data[i].areaCode] = 1;
                    }
                    self.keyChildMap = map;
                }, 'json');
            },
            show: function () {
                this.$elm.show().siblings('.svg-item').hide();
            },
            clickKey: function (key) {
                var svgData = this.svgData;
                if (this.hasRoom.indexOf(key) != -1) {//变色
                    var $path = this.$elm.find('path[data-key="' + key + '"]');
                    $tuouch_path = $path;
                    var color = $path.attr('data-color');
                    if (color != '') {
                        $path.attr('fill', color.split(',')[1]);
                        /*setTimeout(function () {
                         $path.attr('fill', colorTab[0]);
                         }, 300))*/
                    }
                }
                if (this.keyChildMap[key]) {//显示下一个地图
                    page.showSvg(key);
                }
            }
        };
        return {
            init: function () {
                $backIcon = $('.map-back');
                $('.section-adBox').on('click', 'a', function () {
                    var $elm = $(this);
                    page.openVideo($elm.index(), $elm.attr('title'));
                });
                $backIcon.on('click', function () {
                    CODE_LIST.pop();
                    params.areaCode= CODE_LIST[CODE_LIST.length - 1];
                    initMapCount(params.areaCode);
                    getClassToClassCount(params.areaCode);
                    page.showSvg(params.areaCode);
                });
                this.showSvg(MAIN_AREA_CODE);
                this.bindStar();
                this.hoverShap(MAIN_AREA_CODE);
                return this;
            },
            bindStar: function () {
                var $mapPopTip = $('<div class="map-popTip"><div class="map-popTip-l"></div><div class="map-popTip-m"></div><div class="map-popTip-r"></div></div>').appendTo('body');
                var mapPopTipTime = 0;
                $('.section-map').on('mouseenter', 'text,shape', function () {
                    var key = this.getAttribute('data-key');
                    var shap = this.getAttribute('data-shap');
                    if (shap == 'star') {
                        var elm = this;
                        var textArea = this.getAttribute('data-textarea');
                        clearTimeout(mapPopTipTime);
                        mapPopTipTime = setTimeout(function () {
                            var offset = $(elm).offset();
                            $mapPopTip.css({left: offset.left - 10, top: offset.top - 30});
                            $mapPopTip.find('.map-popTip-m').html(textArea);
                            $mapPopTip.show();
                        }, 200);
                    }
                }).on('mouseleave', 'text,shape', function () {
                    clearTimeout(mapPopTipTime);
                    $mapPopTip.hide();
                }).on('click', 'text,shape', function () {
                    var shap = this.getAttribute('data-shap');
                    if (shap == 'star') {
                        page.clickStar(this.getAttribute('data-key'));
                    }
                });
            },
            openVideo: function (index, title) {
                /* var opt = {mask: true, width: 740, height: 510};
                 opt.html = '<embed width="700" height="430" wmode="direct" flashvars="url='
                 + PUBLIC_PATH + "/public/video/ad_video_" + (index*1 + 1) + ".mp4" + '&skin=http://imgcdn.9itest.com:85/public/flash/MinimaFlatCustomColorAll.swf&autoplay=1" allowscriptaccess="always" allowfullscreeninteractive="true" allowfullscreen="true" allownetworking="all" type="application/x-shockwave-flash" pluginspage="http://www.macromedia.com/shockwave/download/index.cgi?P1_Prod_Version=ShockwaveFlash" src="http://imgcdn.9itest.com:85/public/player/videoPlayer.swf">'
                 opt.title = title;
                 Win.open(opt); */
            },
            showSvg: function (areaCode) {//显示地图
                if (!SVG_MAP[areaCode]) {
                    SVG_MAP[areaCode] = new svgObj(areaCode);
                } else {
                    SVG_MAP[areaCode].show();
                }
                if (areaCode != CODE_LIST[CODE_LIST.length - 1]) {
                    CODE_LIST.push(areaCode);
                }
                if (areaCode == MAIN_AREA_CODE) {
                    $backIcon.hide();
                } else {
                    $backIcon.show();
                }
                //getIndexResource(areaCode);
            },
            clickShap: function (key, hasChild) {
                //switch(key)
                //{
                /* case "421121": //黄冈跳团风
                 window.location.href= "http://218.200.101.30:88/jg";
                 break;  //咸宁跳崇阳县
                 case "421223":
                 window.location.href= "http://120.202.58.208:88/jg/";
                 break;*///武昌区跳湖北省援疆互动平台
                /*  case "420106":
                 window.location.href= "http://user.hb.needu.cn/";
                 break;
                 case "421223": //崇阳县跳转
                 window.location.href= "http://218.200.146.2:88/jg/front/main/index.html"
                 return false;
                 break;
                 default:
                 break;  */
                //}
                if (hasChild) {
                    //window.location.href=ROOT+"/toIndex.html?areaCode="+key;
                    this.showSvg(key);
                }
            },
            hoverShap: function (key) {
                var data = statisticsData[key];
                if (data != null) {
                    writeStatistics(data);
                    return;
                }
                if (key == MAIN_AREA_CODE && CLASS_NUMBER == 'Y') {
                    writeStatistics(numData);
                    statisticsData[key] = numData;
                    return;
                }
                //initMapCount(key)
//                        $.post(TP_PATH+"/home/statistics/summary.do",{"areaCode":key},function(result){
//                            initMapCount(key)
//                            statisticsData[key] =data;
//                        });
            },
            clickStar: function (key) {
                console.log('点击星星', key);
            }
        };
    })().init(params.areaCode);
    $(".section-map").on("mouseleave","svg", function(){
        initMapCount(params.areaCode);
        getClassToClassCount(params.areaCode)
        //$(".point-area").html(selectedAreaInfo.areaName)

    });