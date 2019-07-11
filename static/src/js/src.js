$(function () {
    //标题
    $(".areadistribution-title .area-name").html(selectedAreaInfo.areaName)
    $("#topTitle h2").html(selectedAreaInfo.areaName+"农村教学点可视化平台");
    var screenW = document.body.clientWidth;
    document.body.style.height = screenW * (1080 / 1920) + "px";
    var drawChart = {
        init: function () {
            pieChart = echarts.init(document.getElementById('baseBuild'));
            //circleChart = echarts.init(document.getElementById("circleChart"));
            barChart = echarts.init(document.getElementById("classAnalysis"));
        },
        drawStaticPie: function () {
            return pieChart.setOption(baseBuildOption);
        },
        drawCircleChart: function () {
           // circleChart.setOption(circleOption)
        },
        drawBarChart: function () {
            barChart.setOption(barOption);
        }
    }
    drawChart.init();
    var dataStyle = {
        normal: {
            label: {show: false},
            labelLine: {show: false},
            color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                    offset: 0, color: 'red' // 0% 处的颜色
                }, {
                    offset: 1, color: 'blue' // 100% 处的颜色
                }],
                globalCoord: false // 缺省为 false
            }
        }
    };
    var placeHolderStyle = {
        normal: {
            label: {
                show: false,
                position: "center"
            },
            labelLine: {
                show: false
            },
            color: "#112465"
        }

    }
    var circleOption = {};
    //第一个图标
    var cityOption = [];
    $.post(ROOT + "/home/countTpSchoolByBaseAreaId.do", {baseAreaId: selectedAreaInfo.baseAreaId}, function (data) {
        console.log(data)
        if(data.status== 1){
            if(selectedAreaInfo.areaCode=="420000"){
                var data= {
                    "message": "操作成功",
                    "result": [
                        {
                            "name": "武汉市",
                            "value": 12
                        },
                        {
                            "name": "黄石市",
                            "value": 191
                        },
                        {
                            "name": "十堰市",
                            "value": 372
                        },
                        {
                            "name": "宜昌市",
                            "value": 22
                        },
                        {
                            "name": "襄阳市",
                            "value": 453
                        },
                        {
                            "name": "鄂州市",
                            "value": 106
                        },
                        {
                            "name": "荆门市",
                            "value": 70
                        },
                        {
                            "name": "孝感市",
                            "value": 116
                        },
                        {
                            "name": "荆州市",
                            "value": 105
                        },
                        {
                            "name": "黄冈市",
                            "value": 672
                        },
                        {
                            "name": "咸宁市",
                            "value": 257
                        },
                        {
                            "name": "随州市",
                            "value": 6
                        },
                        {
                            "name": "恩施自治州",
                            "value": 380
                        },
                        {
                            "name": "仙桃市",
                            "value": 31
                        },
                        {
                            "name": "潜江市",
                            "value": 9
                        },
                        {
                            "name": "天门市",
                            "value": 6
                        },
                        {
                            "name": "神农架林区",
                            "value": 6
                        }
                    ],
                    "retcode": "",
                    "status": 1
                }
            }


            var result = data.result;

            //如果是湖北省

            result.forEach(function(item,index){
                // var obj = {}
                // console.log(item,index)
                // obj.name = item.areaName;
                // obj.value = item.totalRatio;
                cityOption.push(item)
            })
            // baseBuildOption.series[0].data.push(obj);
            //第一个图表pie
            cityOption.map(function(item){
                var oLi = "<li class='cityList'><h2>"+ item.value +"</h2><p>"+ item.name +"</p></li>"
                $("#cityWrap").append(oLi)
            });
            //根据数据更新配置项数据
            baseBuildOption = {
                series : [
                    {
                        name: '基础建设情况',
                        type: 'pie',
                        radius : ['6%', '55%'],
                        roseType: 'area',
                        color:['#3e56de'],
                        data:cityOption,
                        labelLine: {
                            normal: {
                                show: false
                            }
                        },
                        label: {
                            normal: {
                                show: false
                            }
                        },

                        itemStyle: {
                            normal: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            },
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    },

                    {
                        name: '',
                        type: 'gauge',
                        min: 0,
                        max: 24,
                        startAngle: 90,
                        endAngle: 449.9,
                        radius: '72%',
                        splitNumber: cityOption.length,
                        clockwise: false,
                        animation: false,
                        detail: {
                            formatter: '{value}',
                            textStyle: {
                                color: '#63869e'
                            }
                        },
                        detail:{
                            show: false
                        },
                        axisTick: {
                            show: false
                        },
                        axisLine: {
                            lineStyle: {
                                color: [
                                    [1, 'rgba(0,0,0,0)']
                                ],
                                width: '10%',
                                opacity:0.8
                            }
                        },
                        splitLine: {
                            show:true,
                            length: '92%',
                            lineStyle: {
                                color: 'rgba(6,40,91,1)',
                                width: '1'
                            }
                        },
                        axisLabel: {
                            show:false,
                            formatter: function(v){
                                return v?v:'';
                            },
                            textStyle: {
                                color: "#fb5310",
                                fontWeight: 700
                            }
                        },
                        itemStyle: {
                            normal: {
                                color: '',
                                width: 2,
                                borderWidth: 3,
                            }
                        }
                    }
                ]
            };
            function cityHighAndSow(type,name){
                pieChart.dispatchAction({
                    type:type,
                    name:name
                })
            }
            //半径
            var radius = 210;
            //每一个BOX对应的角度;
            var avd = 360/$(".cityList").length;
            //每一个BOX对应的弧度;
            var ahd = avd*Math.PI/180;
            var pieObj;
            //设置圆的中心点的位置
            $(".cityList").each(function(index, element){
                var index = index + 0.4;
                $(this).css({"left":Math.sin((ahd*index))*radius,"top":Math.cos((ahd*index))*-radius});
            });

            $(".cityList").hover(function(){
                var _index = $(this).index();
                cityHighAndSow("highlight",cityOption[_index].name)
                console.log("aaa")
            },function(){
                var _index = $(this).index();
                cityHighAndSow("downplay",cityOption[_index].name)
            })
            drawChart.drawStaticPie()
        };
        // pieObj.on('pieselectchanged', function () {
        //
        // });



    });
    var baseBuildOption = {
        series : [
            {
                name: '基础建设情况',
                type: 'pie',
                radius : ['6%', '55%'],
                roseType: 'area',
                color:['#3e56de'],
                data:cityOption,
                labelLine: {
                    normal: {
                        show: false
                    }
                },
                label: {
                    normal: {
                        show: false
                    }
                },
                splitLine: {
                    show:true,
                    length: '92%',
                    lineStyle: {
                        color: 'rgba(6,40,91,0.6)',
                        width: '1'
                    }
                },
                itemStyle: {
                    normal: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            },
            {
                name: '',
                type: 'gauge',
                min: 0,
                max: 24,
                startAngle: 0,
                startAngle: 0,
                endAngle: 449.9,
                radius: '72%',
                splitNumber: cityOption.length,
                clockwise: false,
                animation: false,
                detail: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#63869e'
                    }
                },
                detail:{
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: [

                        ],
                        width: '10%',
                        opacity:0.8
                    }
                },

                axisLabel: {
                    show:false,
                    formatter: function(v){
                        return v?v:'';
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#1c5078',
                        width: 2,
                        borderWidth: 3,
                    }
                },
                splitLine: {
                    show:true,
                    length: '92%',
                    lineStyle: {
                        color: '',
                        width: '1'
                    }
                },
            },
            {
                name: '',
                type: 'gauge',
                min: 0,
                max: 24,
                startAngle: 90,
                endAngle: 449.9,
                radius: '72%',
                splitNumber: cityOption.length,
                clockwise: false,
                animation: false,
                detail: {
                    formatter: '{value}',
                    textStyle: {
                        color: '#63869e'
                    }
                },
                detail:{
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLine: {
                    lineStyle: {
                        color: [
                            [1, 'rgba(0,0,0,0)']
                        ],
                        width: '10%',
                        opacity:0.8
                    }
                },
                splitLine: {
                    show:true,
                    length: '92%',
                    lineStyle: {
                        color: 'rgba(6,40,91,0.6)',
                        width: '1'
                    }
                },
                axisLabel: {
                    show:false,
                    formatter: function(v){
                        return v?v:'';
                    },
                    textStyle: {
                        color: "#fb5310",
                        fontWeight: 700
                    }
                },
                itemStyle: {
                    normal: {
                        color: 'green',
                        width: 2,
                        borderWidth: 3,
                    }
                }
            }
        ]
    };


    var trimesters = null;
    var trimesterArr = [];
    var currentItemIndex = 0;  // 第三个canvas  时间轴的当前位置
    var counturl = TP_PATH + "/home/course/count2.do";
    var dataOptions = new Array();
    var currentTimeIndex = 0;
    var trimesterWeeks=[];
    var barOption ;
    //判断是否有数据填报
    setTimeout(function(){
        $.post(ROOT+'/tpcustomdata/getTpCustomDataJson.do',{areaCode:selectedAreaInfo.areaCode, key:"weekData"},function(result){
            if((result.status==1) && result.result.length>0){
                var weekData= JSON.parse(result.result);

                var weeks= Object.keys(weekData);
                //因为此时weeks不是按周次排序的，所以需要再处理一遍
                var _index=[];
                for(var i=0,len= weeks.length;i<len; i++){
                    var index= weeks[i].substr(4);
                    _index.push(index)
                }
                _index= _index.sort(function(a,b){
                    return a-b
                });
                var datas=[], weeks=[];
                for(var j=0,L= _index.length;j<L; j++){
                    weeks[j]= "第"+_index[j]+"周";
                    datas.push(weekData['week'+parseInt(_index[j])]);
                };
                var lastShowIndex= datas.length;
                for(var m= lastShowIndex-1; m>= 0; m--){
                    if(datas[m]==0){
                        lastShowIndex= m;
                        continue
                    }else{
                        break
                    }
                }
                weeks.splice(lastShowIndex);
                datas.splice(lastShowIndex);
                barOption = {
                    baseOption: {
                        grid: {
                            top: "26%",
                            bottom: "12%",
                            left:"4%",
                            width:"92%"
                        },
                        title: {
                            text: '互动课堂开课概况',
                            textStyle: {
                                color: "#8fd4ff",
                                fontSize:24,
                                fontFamily:'PingFangHeavy'
                            },
                            padding: [35, 50]
                        },
                        xAxis: [{
                            type: 'category',
                            axisLabel: {

                                interval: 0,
                                textStyle: {
                                    color: "#84859a"
                                }
                            },
                            axisLine:{
                                show:false,
                            },
                            axisTick:{
                                show:false,
                            },
                            data:weeks
                        }],
                        yAxis: [
                            {
                                type: 'value',
                                name: '开课量',
                                splitNumber:5,
                                splitLine: {
                                    show: false
                                },
                                nameTextStyle: {
                                    color: "#84859a",
                                },
                                offset:20,
                                axisLabel: {
                                    margin:-17,
                                    formatter: '{value}',
                                    textStyle: {
                                        color: "#84859a"
                                    }
                                },
                                axisLine:{
                                    show:false,
                                },
                                axisTick:{
                                    show:false,
                                }
                            }
                        ],
                        series: [
                            {
                                name: '实际开课',
                                type: 'bar',
                                barWidth:18,
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#4142dd'
                                        }, {
                                            offset: 1,
                                            color: '#379cde'
                                        }]),
                                        barBorderRadius: 30,
                                    }
                                },
                                label:{
                                    normal:{
                                        show:true,
                                        position:'top',
                                        textStyle:{
                                            color:'#fff'
                                        },
                                    }
                                },
                                data: datas
                            }
                        ]
                    }
                };
            drawChart.drawBarChart(barOption,true);
            }else{

                CDUtil.ajaxGet(COMMON_PATH + "/common/data/trimester/byareaid2.do", {baseAreaId: selectedAreaInfo.baseAreaId}, function (data) {
                    if (data.status == 1) {
                        trimesters = data.result;
                        if (trimesters != null && trimesters.length > 0) {
                            var now = new Date().getTime();
                            $.each(trimesters, function (index, item) {
                                if (now >=item.startDate && now <= item.endDate) {
                                    currentItemIndex = index;
                                }
                                trimesterArr.push(item.trimesterName)
                            })
                        }
                    }
                }, false);

                if (trimesters != null && trimesters.length > 0) {
                    $.each(trimesters, function (index, item) {
                        $.ajax({
                            type: "post",
                            data: {
                                "baseAreaId": selectedAreaInfo.baseAreaId,
                                "roomType": "MASTER",
                                trimesterId: item.baseTrimesterId
                                //endDate: item.endDate
                            },
                            url: counturl,
                            async: false,
                            dataType: 'json',
                            success: function (result) {

                                var courseSummary = result.result;
                                //$(".chart-title").text(trimesters[0]+"互动课堂开课趋势图");

                                planedCourse = courseSummary['planedCourse'];
                                actualCourse = courseSummary['finishedCourse'];
                                actualPlanedPercent = courseSummary['percent'];
                                weeks = courseSummary["weeks"];
                                trimesterWeeks.push(weeks);
                                trimesterName = "";
                                trimesterName = trimesterArr[index];
                                var data = {};
                                data.title = {text: trimesterName + "互动课堂开课概况"};
                                data.series = new Array();
                                // data.series.push({data: planedCourse});
                                data.series.push({data: actualCourse});
                                // data.series.push({data: actualPlanedPercent});
                                dataOptions.push(data);
                            }
                        });
                    })
                }
                //
                // //第三个图表
                barOption = {
                    baseOption: {
                        timeline: {
                            axisType: 'category',
                            bottom: "4%",
                            data: trimesterArr,
                            currentIndex: currentItemIndex,
                            left:800,
                            right:800,
                            controlStyle:{
                                showPrevBtn :false,
                                showNextBtn:false
                            },
                            lineStyle: {
                                color: "white"
                            },
                            label: {
                                normal: {
                                    //interval: 5000,
                                    textStyle: {
                                        color: "white"
                                    }
                                },
                                emphasis: {
                                    textStyle: {
                                        color: "#00aeff"
                                    }
                                }
                            },
                            itemStyle: {
                                emphasis: {
                                    color: "#00aeff"
                                }
                            },
                            checkpointStyle: {
                                color: "#00aeff",
                                borderWidth: 0
                            },
                            controlStyle: {
                                showPlayBtn: false
                            }
                        },
                        grid: {
                            top: "26%",
                            bottom: "25%",
                            left:"4%",
                            width:"92%"
                        },
                        title: {
                            text: '',
                            textStyle: {
                                color: "#8fd4ff",
                                fontSize:24,
                                fontFamily:'PingFangHeavy'
                            },
                            padding: [35, 50]
                        },
                        /*tooltip: {
                         trigger: 'axis',
                         axisPointer: {
                         type: 'shadow'
                         },
                         backgroundColor: 'rgba(50,50,50,0)',
                         formatter: function (params) {

                         var htmlStr = "<table class='detailSty'>";
                         var percent = "<tr class='fontStyle'>";
                         var title = "<tr style='color:#9a9aa3'>";
                         for (var i = 0; i < params.length; i++) {
                         if(params[i].value==undefined){
                         continue;
                         }
                         percent += "<td>" + params[i].value + ((params[i].seriesName == '实开课占比') ? "%" : "") + "</td>";
                         title += "<td>" + params[i].seriesName + "</td>";
                         }
                         percent += "</tr>";
                         title += "</tr>";
                         htmlStr += percent + title + "</table>";
                         return htmlStr;
                         },
                         position: function (point, params, dom, rect, size) {
                         return [point[0], '5%'];
                         }
                         },*/
                        // legend: {
                        //     data: [ '实际开课'],//data: ['计划开课', '实际开课', '实开课占比'],
                        //     right: "2%",
                        //     textStyle: {
                        //         color: "white"
                        //     }
                        // },
                        xAxis: [{
                            type: 'category',
                            axisLabel: {

                                interval: 0,
                                textStyle: {
                                    color: "#84859a"
                                }
                            },
                            axisLine:{
                                show:false,
                            },
                            axisTick:{
                                show:false,
                            },
                            data:[]
                        }],
                        yAxis: [{
                            type: 'value',
                            name: '开课量',
                            splitNumber:5,
                            splitLine: {
                                show: false
                            },
                            nameTextStyle: {
                                color: "#84859a",
                            },
                            offset:20,
                            axisLabel: {
                                margin:-17,
                                formatter: '{value}',
                                textStyle: {
                                    color: "#84859a"
                                }
                            },
                            axisLine:{
                                show:false,
                            },
                            axisTick:{
                                show:false,
                            },
                        }
                            // , {
                            //     type: 'value',
                            //     name: '实开课占比',
                            //     splitLine: {
                            //         show: false
                            //     },
                            //     nameTextStyle: {
                            //         color: "#84859a"
                            //     },
                            //     axisLabel: {
                            //         formatter: '{value} %',
                            //         textStyle: {
                            //             color: "#84859a"
                            //         }
                            //     }
                            // }
                        ],
                        series: [
                            //     {
                            //     name: '计划开课',
                            //     type: 'bar',
                            //     label:{
                            //         normal:{
                            //             show:true,
                            //             position:'top',
                            //             color:'#fff'
                            //         }
                            //     },
                            //     itemStyle: {
                            //         normal: {
                            //             color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                            //                 offset: 0,
                            //                 color: 'rgba(65, 67,221, 1)'
                            //             }, {
                            //                 offset: 1,
                            //                 color: 'rgba(56, 155,222, 0.8)'
                            //             }])
                            //         }
                            //     }
                            // },
                            {
                                name: '实际开课',
                                type: 'bar',
                                barWidth:18,
                                itemStyle: {
                                    normal: {
                                        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                            offset: 0,
                                            color: '#4142dd'
                                        }, {
                                            offset: 1,
                                            color: '#379cde'
                                        }]),
                                        barBorderRadius: 30,
                                    }
                                },
                                label:{
                                    normal:{
                                        show:true,
                                        position:'top',
                                        textStyle:{
                                            color:'#fff'
                                        },
                                    }
                                },
                            }
                            // , {
                            //     name: '实开课占比',
                            //     type: 'line',
                            //     yAxisIndex: 1,
                            //     lineStyle: {
                            //         normal: {
                            //             color: "#e58f27"
                            //         }
                            //     },
                            //     itemStyle: {
                            //         normal: {
                            //             color: "#e58f27"
                            //         }
                            //     }
                            //
                            // }
                        ]

                    },

                    options: dataOptions
                };
                drawChart.drawBarChart(barOption);
                barOption.baseOption.xAxis[0].data=trimesterWeeks[0];
                barOption.baseOption.timeline.currentIndex = 0;
                barChart.setOption(barOption);
                barChart.on('timelinechanged', function(timelineIndex){
                    // clearInterval(intInterval);//切换学期时，清除之前的轮播，并设定新的轮播
                    // 设置 每个series里的xAxis里的值
                    var arrIndex = parseInt(timelineIndex.currentIndex);
                    if (arrIndex == trimesterArr.length) // 这里 5可理解为timeline节点数组的长度,此处的目的是防止 5.xAxis not found
                        arrIndex = 0
                    barOption.baseOption.xAxis[0].data=trimesterWeeks[arrIndex];
                    barOption.baseOption.timeline.currentIndex = arrIndex;
                    barChart.setOption(barOption);
                    //barOptionSetInterval(trimesterWeeks[arrIndex].length);
                });
            }
        });
    },2000)


    var pieChart, circleChart, barChart;

    function getCurrentIndex() {
        return [];//barChart.timeline.currentIndex;
    }

    //根据areaCode获取班班通统计
    var getClassToClassCount= function(areaCode){
        var url= TP_PATH + "/monitor/statistics/getThirdClassStatistic2.do";
        $.post(url, {"areaCode": areaCode}, function (result) {
            var status = result.status;
            var summary = result.result;
            if (status == 1) {
                $("#summary_classToClass").html(summary.totalClass)
            }
        })
    };
    //根据areaCode获取当前课程统计信息
    var initMapCount = function (areaCode) {
        var url = TP_PATH + "/home/statistics/summary.do";
        clearData();
        $.post(url, {"areaCode": areaCode, "userAreaId" : selectedAreaInfo.baseAreaId}, function (result) {
            var status = result.status;
            var summary = result.result;
            if (status == 1) {
                var keys = Object.keys(summary);
                $.each(keys, function (index, k) {
                    $("#summary_" + k).text(summary[k]);
                });

                var onlineClassRatio = summary.onlineCoursePercent==null?0:summary.onlineCoursePercent,
                    leftChildernPercent = summary.leftChildernPercent==null?0:summary.leftChildernPercent ,
                    govTeacherPercent = summary.govTeacherPercent==null?0:summary.govTeacherPercent;
                // circleOption.legend[0].data=[onlineClassRatio + "\n在线课堂教室比例", leftChildernPercent + "\n留守儿童比例", govTeacherPercent + "\n有编制教师比例"]
                // circleOption.series[0].data[0].value = onlineClassRatio;
                // circleOption.series[1].data[0].value = leftChildernPercent;
                // circleOption.series[2].data[0].value = govTeacherPercent;
                /*      onlineClassRatio = Number(onlineClassRatio.substring(0,onlineClassRatio.length - 1)).toFixed(2);*/
                var leftChildrenTitle="留守儿童比例",
                    govTeacherTitle="有编制教师比例";

                if(selectedAreaInfo.areaCode=="420000"){
                    $(".classToClass-wrap").hide();
                    leftChildrenTitle='平均每教师受益学生数';
                    govTeacherTitle="已开学科课程";
                    leftChildernPercent= 30;
                    govTeacherPercent= 100;
                    $("#teachPoint .secdLine").addClass("two-column")
                }
                circleOption = {
                    color: ['#58e694', '#ffcb00', '#f0f', '#090b35', '#2eb769'],
                    tooltip: {
                        show: true,
                        formatter: "{a}"
                    },
                    legend: [{
                        orient: 'vertical',
                        type: "circle",
                        right: '15%',
                        top: 'center',
                        itemGap: 60,
                        textStyle: {
                            color: "#A7B1CA",
                            fontSize: 16,
                            fontWeight: "bold"
                        },
                        formatter: function (name) {
                            // for(var i = 0;i < circleOption.series.length;i++){
                            //     if(circleOption.series[i].data[0].name == name){
                            //     return circleOption.series[i].data[0].value + "%\n\n" + circleOption.series[i].data[0].name
                            // }
                            // }
                        },
                        data: [{
                            name : '在线课堂教室比例',
                            icon : 'pin',
                            textStyle : {
                                color : '#fc0855',
                                fontSize : 20
                            }
                        },{
                            name : leftChildrenTitle,
                            icon : 'pin',
                            textStyle : {
                                color : '#ffcb00',
                                fontSize : 20
                            }
                        },{
                            name : govTeacherTitle,
                            icon : 'pin',
                            textStyle : {
                                color : '#58e694',
                                fontSize : 20
                            }
                        }]
                    }],
                    series: [
                        {
                            name: '',
                            type: 'pie',
                            clockWise: false,
                            radius: [45, 57],
                            center: ['30%', '50%'],
                            itemStyle: {
                                normal: {
                                    label: {show: false},
                                    labelLine: {show: false},
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#ec33ba' // 0% 处的颜色
                                        }, {
                                            offset: 0.5, color: '#f5197d' // 100% 处的颜色
                                        },{
                                            offset: 1, color: '#fc0855' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },

                            data: [
                                {
                                    value: onlineClassRatio,
                                    name: '在线课堂教室比例'
                                },
                                {
                                    value: 100 - onlineClassRatio,
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        },
                        {
                            name: '',
                            type: 'pie',
                            clockWise: false,
                            radius: [75, 87],
                            center: ['30%', '50%'],
                            itemStyle: {
                                normal: {
                                    label: {show: false},
                                    labelLine: {show: false},
                                    color: {
                                        type: 'linear',
                                        x: 0,
                                        y: 0,
                                        x2: 0,
                                        y2: 1,
                                        colorStops: [{
                                            offset: 0, color: '#ffd500' // 0% 处的颜色
                                        },{
                                            offset: 0.5, color: '#ff8d00' // 100% 处的颜色
                                        }, {
                                            offset: 1, color: '#ffca00' // 100% 处的颜色
                                        }],
                                        globalCoord: false // 缺省为 false
                                    }
                                }
                            },
                            data: [
                                {
                                    value: leftChildernPercent,
                                    name: leftChildrenTitle
                                },
                                {
                                    value: 100 - leftChildernPercent,
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        },
                       {
                            name: '',
                            type: 'pie',
                            clockWise: false,
                            radius: [103, 113],
                            center: ['30%', '50%'],
                           itemStyle: {
                               normal: {
                                   label: {show: false},
                                   labelLine: {show: false},
                                   color: {
                                       type: 'linear',
                                       x: 0,
                                       y: 0,
                                       x2: 0,
                                       y2: 1,
                                       colorStops: [{
                                           offset: 0, color: '#56e699' // 0% 处的颜色
                                       }, {
                                           offset: 0.5, color: '#2eb86a' // 100% 处的颜色
                                       },{
                                           offset: 1, color: '#41ce80' // 100% 处的颜色
                                       }],
                                       globalCoord: false // 缺省为 false
                                   }
                               }
                           },
                            data: [
                                {
                                    value: govTeacherPercent,
                                    name: govTeacherTitle
                                },
                                {
                                    value: 100 - govTeacherPercent,
                                    name: 'invisible',
                                    itemStyle: placeHolderStyle
                                }
                            ]
                        }
                    ]
                };
                //右侧pie图例，添加覆盖物
                var leftStudentTitle1= leftChildernPercent+"%",
                    govTeacherTitle1= govTeacherPercent + '%';
                if(selectedAreaInfo.areaCode=="420000"){
                    leftStudentTitle1= 30;
                    govTeacherTitle1= 8
                }
                var arr = [{
                    name:'在线课堂教室比例',
                    value:onlineClassRatio + '%'
                },{
                    name:leftChildrenTitle,
                    value:leftStudentTitle1
                },{
                    name:govTeacherTitle,
                    value: govTeacherTitle1
                }];
                // var FirstNum = Number(arr[0].value.substring(0,arr[0].value.length - 1)).toFixed(1)
                // var oLi = "<li class='EhartsToInner'><h2>"+ FirstNum +"%</h2><p>"+ arr[0].name +"</p></li><li class='EhartsToInner'><h2>"+ arr[1].value +"</h2><p>"+ arr[1].name +"</p></li><li class='EhartsToInner'><h2>"+ arr[2].value +"</h2><p>"+ arr[2].name +"</p></li>";
                // $("#EhartsToOuter").html(oLi);
                function hideToShow(type,name){
                    // circleChart.dispatchAction({
                    //     type:type,
                    //     name:name
                    // })
                }
                $(".EhartsToInner").click(function(){
                    var _index = $(this).index()
                    hideToShow("legendToggleSelect",arr[_index].name);
                    if($(this).find("h2").attr("class") == "action"){
                        $(this).find("h2").attr("class","")
                    }else{
                        $(this).find("h2").attr("class","action")
                    }
                })

                $(".EhartsToInner").hover(
                    function(){
                        var _index = $(this).index()
                        hideToShow("highlight",arr[_index].name);
                    },
                    function(){
                        var _index = $(this).index();
                        hideToShow("downplay",arr[_index].name);
                    }
                )

                // circleOption.series[0].name = onlineClassRatio + "\n在线课堂教室比例";
                // circleOption.series[1].name = leftChildernPercent + "\n留守儿童比例"
                // circleOption.series[2].name = govTeacherPercent + "\n有编制教师比例";
                drawChart.drawCircleChart();
            }

        });
    };
    var clearData = function () {
        $("#summary_tpSchool").html("");
        $("#summary_receiveRoom").html("")
        $("#summary_benefitStudent").html("");
        $("#summary_classToClass").html("");
        $("#summary_centerSchool").html("");
        $("#summary_masterRoom").html("");
        $("#summary_teacher").html("")
        $("#summary_totalCourse").html("");
        $("#summary_onlineCourse").html("")
        $("#summary_regularCourse").html("")
    }
    initMapCount(selectedAreaInfo.areaCode);
    getClassToClassCount(selectedAreaInfo.areaCode);


    //静态展示
    //drawChart.drawStaticPie();
    //drawChart.drawCircleChart();



    //开课分析条形图轮播效果
    // var app={},
    //     intInterval;

    // barOptionSetInterval(trimesterWeeks[currentItemIndex].length);
    /*

     function barOptionSetInterval(len){
     app.currentIndex = -1;
     intInterval = setInterval(function() {
     var dataLen = len;
     // 取消之前高亮的图形
     barChart.dispatchAction({
     type: 'downplay',
     seriesIndex: 0,
     dataIndex: app.currentIndex
     });
     app.currentIndex = (app.currentIndex + 1) % dataLen;
     // 高亮当前图形
     barChart.dispatchAction({
     type: 'highlight',
     seriesIndex: 0,
     dataIndex: app.currentIndex
     });
     // 显示 tooltip
     barChart.dispatchAction({
     type: 'showTip',
     seriesIndex: 0,
     dataIndex: app.currentIndex
     });
     }, 1000);
     }
     */

    // 获取在线教学已开课数量,查看是否有填报数据
    function getSubjectFillDatas(){
        $.post(ROOT+'/tpcustomdata/getTpCustomDataJson.do',{areaCode:selectedAreaInfo.areaCode, key:"subjectData"},function(result){
            if((result.status==1) && result.result.length > 0 ){
                var subjectData= JSON.parse(result.result);
                $("#circleChart .static-num").html(subjectData.screenOnlineData);
                $("#circleChart .chinese-count").html(subjectData.chinese);
                $("#circleChart .math-count").html(subjectData.math);
                $("#circleChart .english-data").html(subjectData.english);
                $("#circleChart .arts-nums").html(subjectData.art);
                $("#circleChart .music-count").html(subjectData.music);
            }
        })
    };
    getSubjectFillDatas()

    //关联图标
    // 调整窗口大小的时候，重新init图表
    var timer=true;
    $("window").on("resize", function () {
        if (timer) {
            clearTimeout(timer)
            timer = setTimeout(function () {
                pieChart = null;
                circleChart = null;
                barChart = null;
                var $baseBuild = $('#baseBuild');
                var $circleChart = $("#circleChart");
                var $barChart = $("#classAnalysis")
                //第一个图表
                $baseBuild.html("")
                pieChart = echarts.init($baseBuild);
                pieChart.setOption(option);
                //第二个图表
                $circleChart.html("");
                //circleChart = echarts.init($("#circleChart"));
                //circleChart.setOption(circleOption);
                //第三个图表
                barChart = null;
                $barChart.html("")
                barChart.setOption(barOption);


            }, 20)
        }
    });

    var params = {
        areaCode: selectedAreaInfo.areaCode//420000
    }
    if (window.top !== window.self) {
        window.top.location = window.location;
    }
    var page = (function () {
        var MAIN_AREA_CODE = selectedAreaInfo.areaCode;
        //console.log("defaultAreaCode:"+MAIN_AREA_CODE);
        var CLASS_NUMBER = "";
        var COLOR_GROUP_MAP = {
            0: '#d89026,#c46912,#d9d9d9',
            1: '#faf6d8,#d5d794,#dddcd3',
            2: '#bae9ee,#77c8ca,#c2d9da',
            3: '#dfbfd2,#dc97c6,#d3ccd1',
            4: '#cbe6c8,#79d466,#cfdde1',
            5: '#1bc840,#1da039,#96a974'
        };
        var statisticsData = {};
        var writeStatistics = function (data) {
            //console.log("");
            var tempData = data.countData;
            //$("#mapAreaName").html(this.areaName);
            $("#mapAreaName").html(tempData.areaName);
            $("#summary_tpSchool").html(tempData.masterClassroomCount);
            $("#summary_receiveRoom").html(tempData.receiveClassroomCount);

            $("#summary_benefitStudent").html(tempData.planScheduleCount);
            $("#summary_centerSchool").html(tempData.studentBenefitCount);
            $("#summary_masterRoom").html(tempData.teachTeacherCount);

            $("#summary_teacher").html(tempData.weekScheduleCount);

        };
        new Image().src = "http://imgcdn.9itest.com:85/webpc/index/images/map/pop-ui-l.png";
        new Image().src = "http://imgcdn.9itest.com:85/webpc/index/images/map/pop-ui-m.png";
        new Image().src = "http://imgcdn.9itest.com:85/webpc/index/images/map/pop-ui-m.png";

        var getCenterImg = function (level) {
            return "../images/" + level + ".png";
        };
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
    //  资源概况
    $.post(TP_PATH+ "/home/getResourceSubjectCount.do",{baseAreaId: selectedAreaInfo.baseAreaId} ,function(result) {
        var status = result.status;
        var result = result.result;
        if (status == 1) {
            var maxNum = 0,
                totalCount=0;
            //$("#resource_info .detail-num").html(result.resourceCount);
            for(var j = 0, len = result.length; j < len; j++) {
                if(maxNum<result[j].resourceCount){
                    maxNum= result[j].resourceCount
                }
                totalCount+= result[j].resourceCount
            }
            $("#resource_info .detail-num").html(totalCount);
            var str = "";
            for(var i = 0, len = result.length; i < len; i++) {
                if(maxNum>0){
                    var ratio= (result[i].resourceCount/maxNum).toFixed(3)*100;
                    str+= '<li><div class="subject-name">' + result[i].subjectName + '</div><div class="subject-bar"><div class="process-bar" style="width:'+ ratio +'%"></div></div><div class="subject-num">' + result[i].resourceCount + '</div></li>'
                }
                $(".resource-subject-list ul").html(str)
            }

        }
    })
})

