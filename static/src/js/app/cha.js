define(["jquery","lay","api"], function($, layer,api) {

  var titleColor = "#3ce3e3";
  var labelColor = "#9fceff";
  var dataSubject = ['语文', '数学', '英语', '音乐', '美术', '科学', '生命安全', '心理健康'];
  var dataSubject2 = dataSubject.reverse();



  api.ajaxGet("http://wangyong.ncjxd.dev.dodoedu.com/api/getYxCityCount",{},function(res){
     if(res.type == "success"){
          var arr = [];
          var list = res.data.data;
          $.each(list,function(index, el) {
              arr[index] = el.num;
          });
          jsgk(arr);
     }
  })



   api.ajaxGet("http://wangyong.ncjxd.dev.dodoedu.com/api/getYxSubjectCount",{},function(res){
       if(res.type == "success"){
          var list = res.data.data;
          var plan_nums = list.map(function(item){
                  return  item.plan_num;
          })
          var actual_nums = list.map(function(item){
               return  item.actual_num;
          })
          wlyx(actual_nums,plan_nums)
     }
  })

  

  api.ajaxGet("http://wangyong.ncjxd.dev.dodoedu.com/api/getResourceSubjectCount",{},function(res){
       if(res.type == "success"){
          var list = res.data.data;
          var zysdata = list.map(function(item){
               return  item.num;
          })
          var max = zysdata[0];
          for(var i = 1; i < zysdata.length; i++) {
             var cur = zysdata[i];
             cur > max ? max = cur : null
          }
         var maxdata = [];
         $.each(zysdata,function(index, el) {
              maxdata[index] = max;
         });
         zygk (zysdata,maxdata)
     }
  })
















 
function zygk (dzysdata,maxdata){
  var myChart3 = echarts.init(document.getElementById('main3'));
  var option3 = {
    grid: {
      x: 100, //左侧与y轴的距离
      y: 70, //top部与x轴的距离
      x2: 50, //右侧与y轴的距离
      y2: 20 //bottom部与x轴的距离
    },
    color: ["#02d0e7","#02d0e7"],
    tooltip: {},
    legend: {
      data: ['资源数'],
        top: "18",
      orient: 'vertical',
      right: "10%",
      textStyle: {
        color: labelColor
      },
    },
    xAxis: {
      type: 'value',
      interval:0,
      axisLabel: {
        formatter: '{value}'
      },
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      }
    },
    yAxis: {
      data: dataSubject2,
      interval:0, 
      axisLine: {
        show: false
      },
      splitLine: {
        show: false
      },
      axisLabel: {
        textStyle: {
          color: labelColor

        },
        interval:0 
      }
    },
    series: [{
      name: '资源数',
      type: 'bar',
      data:dzysdata,
     
      z: 10,
      barWidth: '36%',
      itemStyle: {
        barBorderRadius:[10, 10, 10, 10]
      },
      label: {
        normal: {
          show: false,
          position: 'right',
          textStyle: {
            color: "#ffffff"
          },
        }
      }
    },{
      name: '同比最大值',
       interval:0,
      type: 'bar',
      barWidth: '36%',
      data: maxdata,
      barGap: '-100%',
      itemStyle: {
         barBorderRadius:[10, 10, 10, 10],
         color: 'rgba(2,208,231,0.2)',
      },
      label: {
        normal: {
          show:true,
          position: 'right',
          formatter: function(p){
            return dzysdata[p.dataIndex]
          },
          textStyle: {
            color: labelColor
          },
        }
      }
    }]
  };

  myChart3.setOption(option3);

}




 
 function wlyx(actual_nums,plan_nums) {
   var myChart = echarts.init(document.getElementById('main'));
   var option = {
    color: ["#0090ff", '#5f45ff'],
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
      },
    },
    legend: {
      data: ['年度计划开设', '实际已开'],
      right: "5%",
      textStyle: {
        color: labelColor
      },
       top: "18"
    },
     grid: {
      x: 30, //左侧与y轴的距离
      y:90, //top部与x轴的距离
      x2: 30, //右侧与y轴的距离
      y2: 50 //bottom部与x轴的距离
    },
    xAxis: [{
      type: 'category',
      data: ['语文', '数学', '英语', '音乐', '美术', '科学', '生命安全', '心理健康'],
      axisLine: {
        show: false
      },
     axisTick:{       //y轴刻度线
          show:false
      },
      axisLabel: {
        textStyle: {
          color: labelColor
        },
      interval:0  
      }
    }],
    yAxis: {
      type: 'value',
       interval:0,
      splitLine: {
        show: false
      },
      show: false
    },
    series: [{
      name: '年度计划开设',
      type: 'bar',
      // barGap: 0,
      data: actual_nums,
      // data: [20,20],
      barWidth: "18%",
      barGap:0.5,
      interval:0,
      itemStyle:{
          barBorderRadius:[10, 10, 10, 10]
      },
      label: {
        normal: {
          show: true,
          position: 'top',

        }
      }
    }, {
      name: '实际已开',
      type: 'bar',
      barWidth: "18%",
      data: plan_nums,
      // data: [20,20],
      barGap:0.5,
      interval:0,
      itemStyle:{
          barBorderRadius:[10, 10, 10, 10],
      },
      label: {
        normal: {
          barBorderRadius:[10, 10, 10, 10],
          show: true,
          position: 'top',

        }
      }
    }]
  };
  myChart.setOption(option);
 }


function  jsgk(data){
  var myChart2 = echarts.init(document.getElementById('main2'));
    // 使用刚指定的配置项和数据显示图表。
  var option2 = {
    tooltip: {
      trigger: 'axis',
      axisPointer: { // 坐标轴指示器，坐标轴触发有效
        type: 'line',
        color:"#000000"// 默认为直线，可选为：'line' | 'shadow'
      }
    },
    grid: {
      x: 40, //左侧与y轴的距离
      y: 100, //top部与x轴的距离
      x2: 30, //右侧与y轴的距离
      y2: 50 //bottom部与x轴的距离
    },
    xAxis: {
        type: 'category',
        data: ['武汉', '黄石','十堰', '宜昌','襄阳','鄂州', '荆门','孝感','荆州','黄冈','咸宁','随州','恩施','仙桃',"潜江","天门","神龙架"],
        axisLabel: {
          textStyle: {
            color: labelColor
          },
        interval:0 
      },
         axisTick:{       //y轴刻度线
          show:false
      },
      axisLine:{
        lineStyle:{
          color:"#00a0e9",
          width:2
        }
      }
    },
    yAxis: {
        type: 'value',
       
      axisTick:{       //y轴刻度线
          show:false
      },
      axisLabel:{
           show:false
      },
      splitLine:{
         lineStyle:{
           color: "#115372",
           type:"dashed"
         }
      },
      axisLine:{
        lineStyle:{
          color:"#00a0e9",
          width:2
        }
      }
    },
    color: ["#02d0e7"],
    series: [{
        data: data,
        type: 'line',
        smooth: true,
        label: {
            normal: {
                show: true,
                position: 'top'
              }
        },

    }]
  };
  myChart2.setOption(option2);
}






})


