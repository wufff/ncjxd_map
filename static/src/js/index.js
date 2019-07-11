require(["jquery", "lay", "api", "cha"], function($, layer, api) {
  function getWith() {
    var Sreenwidth = document.documentElement.clientWidth;
    console.log(Sreenwidth);
    if (Sreenwidth > 1880) {
      return 1920;
    }
    if (Sreenwidth < 1880 && Sreenwidth > 1620) {
      return 1680;
    }
    if (Sreenwidth < 1620 && Sreenwidth > 1580) {
      return 1600;
    }
    if (Sreenwidth < 1580 && Sreenwidth > 1420) {
      return 1440;
    }
    if (Sreenwidth < 1420) {
      return 1336;
    }
  }

  var currutSreen = getWith();
  console.log(currutSreen);

// getSchoolTotal接口
// type 0全省 1城市 2地区
// id 城市id
// name 城市名称

  api.ajaxGet("http://wangyong.ncjxd.dev.dodoedu.com/api/getCityStatisData",{},function(res){
     if(res.type == "success"){
        var list = res.data.data;
        $.each(list,function(index, v) {
           var cy =  "."+v.city_code;
           console.log(list)
           var school_total = v.school_total;
           $(cy).html(school_total);
        });
        var radius = 100;
        //每一个BOX对应的角度;
        var spans = $(".bodybg").find('span')
        var width = $(".bodybg").width();
        var radius = width*0.3;
        var $width = width*0.96;
        var height = width*0.96;
        console.log(width/2)
        var avd = 360/spans.length;
        //每一个BOX对应的弧度;
        var ahd = avd*Math.PI/180;
     
        //设置圆的中心点的位置
        spans.each(function(index, element){
            var index = index+ 0.5;
            $(this).css({"left":Math.sin((ahd*index))*radius+$width/2,"top":Math.cos((ahd*index))*-radius+height/2});
        });

     }
  })


  var pathOptNone = {
    fill: "#021368",
    stroke: "#00bfe9",
    "stroke-width": 2,
    "stroke-linejoin": "round"
  };
  var pathOpthas = {
    fill: "#052664",
    stroke: "#00bfe9",
    // "cursor":"pointer",
    "stroke-width": 2,
    "stroke-linejoin": "round"
  };

  var textOpt2 = {
    "font-size": '18px',
    "font-family": "Microsoft YaHei,微软雅黑,STXihei,华文细黑,serif",
    "fill": "#9fceff"
  };

  var textOpt = {
    "font-size": '15px',
    "font-family": "Microsoft YaHei,微软雅黑,STXihei,华文细黑,serif",
    "fill": "#9fceff"
  };

  var map = {
    paperWidth: $("#map").width(),
    paperHeigt: $("#map").height(),
    currentId:"",
    mapArry: [],
    dom: '',
    is_border: true,
    drow: function(code) {
      $(".svg-item").hide();

      map.dom = $('<div class="svg-item"></div>').appendTo('#map');
      var paper = Raphael(map.dom[0], map.paperWidth, map.paperHeigt);
      if (currutSreen == 1920) {
        if (code.level == 2) {
          paper.setViewBox(-map.paperWidth / 4, -map.paperWidth / 20, map.paperHeigt / 0.76, map.paperHeigt / 0.76, false)
        } else {
          paper.setViewBox(-map.paperWidth / 15, map.paperWidth / 50, map.paperHeigt / 0.88, map.paperHeigt / 0.88, false)
        }
      }
      if (currutSreen == 1680) {
         if (code.level == 2) {
           paper.setViewBox(-map.paperWidth / 3, -map.paperWidth / 20, map.paperHeigt / 0.76, map.paperHeigt / 0.76, false)
        } else {
           paper.setViewBox(-map.paperWidth / 12, map.paperWidth /100, map.paperHeigt / 0.8, map.paperHeigt / 0.8, false)
        }
      }

       if (currutSreen == 1600) {
         if (code.level == 2) {
           paper.setViewBox(-map.paperWidth / 3, -map.paperWidth / 30, map.paperHeigt / 0.71, map.paperHeigt / 0.71, false)
        } else {
           paper.setViewBox(-map.paperWidth / 12, map.paperWidth /100, map.paperHeigt / 0.8, map.paperHeigt / 0.8, false)
        }
      }
      if (currutSreen == 1440) {
        if (code.level == 2) {
          paper.setViewBox(-map.paperWidth / 3, -map.paperWidth / 20, map.paperHeigt / 0.65, map.paperHeigt / 0.65, false)
        } else {
            paper.setViewBox(-map.paperWidth / 12, map.paperWidth / 30, map.paperHeigt / 0.7, map.paperHeigt / 0.7, false)
        }
      }

      if (currutSreen == 1336) {
        if (code.level == 2) {
          paper.setViewBox(-map.paperWidth / 3, -map.paperWidth / 20, map.paperHeigt / 0.60, map.paperHeigt / 0.60, false)
        } else {
           paper.setViewBox(-map.paperWidth / 12, map.paperWidth / 18, map.paperHeigt / 0.66, map.paperHeigt / 0.66, false)
        }
       
      }



      api.ajaxGet("http://wangyong.ncjxd.dev.dodoedu.com/api/getMap", {
        level: code.level,
        map_id: code.map_id
      }, function(data) {
        if (data.type == "success") {
          var list = data.data.data;
          $.each(list, function(index, vlue) {
            var rElm = paper.path(vlue.m_map_path);
            rElm.attr(pathOpthas);
            rElm[0].setAttribute('map_id', vlue.m_hex_code_path);
            rElm[0].setAttribute('map_name', vlue.m_region_name);
            rElm[0].setAttribute('level', vlue.m_level);
            rElm[0].setAttribute('has', vlue.m_is_child);
            if (vlue.m_is_child == 1) {
              rElm[0].setAttribute("cursor", "pointer");
            }
          });
          $.each(list, function(index, vlue) {
            var rElmText = paper.text(vlue.m_out_x, vlue.m_out_y, vlue.m_region_name);

            rElmText[0].setAttribute('map_id', vlue.m_hex_code_path);
            rElmText[0].setAttribute('map_name', vlue.m_region_name);
            rElmText[0].setAttribute('level', vlue.m_level);
            rElmText[0].setAttribute('has', vlue.m_is_child);
            if (vlue.m_level == 2) {
              rElmText.attr(textOpt2)
            } else {
              rElmText.attr(textOpt)
            }
            if (vlue.m_is_child == 1) {
              rElmText[0].setAttribute("cursor", "pointer");
            }
          });
          map.dom.show().siblings('.svg-item').hide();
          map.mapArry.push(map.dom);
          if (map.mapArry.length > 1) {
            $("#back").show();
          }
          map.bind();
        }
      })


    },
    renderDate:function(tpye,id,name){
       api.ajaxGet("http://wangyong.ncjxd.dev.dodoedu.com/api/getSchoolTotal",{tpye:tpye,id:id,name:name},function(res){
              
              if(res.type == "success"){
                  // console.log(res.data.data);
                  var list = res.data.data;
                  $(".class_total").html(list.class_total)
                  $(".course_total").html(list.course_total);
                  $(".school_total").html(list.school_total);
                  $(".student_total").html(list.student_total);
                  $(".teacher_total").html(list.teacher_total);
              }
       })
    },
    bind: function() {
      var timer = null;
      map.dom.on("click", "path,text", function() {
        var key = this.getAttribute('map_id');
        var level = this.getAttribute('level');
        var has_next = this.getAttribute('has');
        if (has_next == 1) {
          map.drow({
            level: 2,
            map_id: key
          });
        } else {
          if (level == 1) {
            layer.msg("该地区未接入", {
              time: 800
            });
          }
        }
      })
      map.dom.on('mouseenter', 'text,path', function() {
           map.is_border = !map.is_border;
           var id = $(this).attr('map_id');
           if(id == map.currentId){
              return;
           }
           map.currentId = id;
           var name = $(this).attr('map_name');
           var type = $(this).attr('level')
           map.renderDate(type,id,name)
      }).on('mouseleave', 'text,path', function() {
        map.is_border = !map.is_border;

        
        setTimeout(function() {
          console.log("leave" + map.is_border);
          if(map.is_border){
              if(map.currentId == 0){return};
               map.currentId = 0;
               map.renderDate(0,0,"")
          }
        }, 500)
      })
    },
    back: function() {
      $("#back").click(function() {
        $(".svg-item").hide();
        console.log(map.mapArry);
        map.mapArry.pop();
        if (map.mapArry.length == 1) {
          $("#back").hide();
        }
        var lastindex = map.mapArry.length - 1;
        map.mapArry[lastindex].show();
      })
    },
    init: function(code) {
      map.renderDate(0,0,"") 
      map.drow(code);
      map.back();
    }

  }
  map.init({
    level: "",
    map_id: ""
  });



})



            
         
