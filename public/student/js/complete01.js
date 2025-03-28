$(function(){
	echarts_1(); 
    leidatu();
    });
function echarts_1() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('feng01'));
    var gauge_value=100;

option = {
title: {
        x: "center",
        bottom: 0,
        text: gauge_value,
        subtext: '到课率%',
        textStyle: {
            fontWeight: 'normal',
            fontSize: 18,
            color: "#fff"
        },
    },
    tooltip: {
        show: true,
     
     
    },
    series: [
        {
        type: 'gauge',
           radius:'60%',  
           center: ['50%', '55%'],
        splitNumber: 10, //刻度数量
        min: 0,
        max: 100,
          startAngle: 225,
        endAngle: -45,
        axisLine: {
            show: true,
            lineStyle: {
                width: 2,
                shadowBlur: 0,
                color: [
                    [1, '#8f8f8f']
                ]
            }
        },
        axisTick: {
            show: false,
            lineStyle: {
                color: '#8f8f8f',
                width: 1
            },
            length: -5,
            splitNumber: 7
        },
        splitLine: {
            show: true,
            length: -5,
            lineStyle: {
                color: "rgba(255,255,255,.2)",
            }
        },
        axisLabel: {
            distance: -15,
           
                formatter: function(e) {
                switch(e + "") {
                    case "0":
                        return "0";
                    case "10":
                        return "10";

                    case "20":
                        return "20";

                    case "30":
                        return "30";

                    case "40":
                        return "40"
                        
                    case "50":
                        return "50";
                        
                    case "60":
                        return "60";
                            
                    case "70":
                        return "70";

                    case "80":
                        return "80";
                    
                    case "90":
                        return "90";

                    case "100":
                        return "100";    
                        
                    default:
                        return e;
                }
            },
            textStyle: {
                fontSize: 10,
                 color: "rgba(255,255,255,.6)",
            }

        },
        pointer: { //仪表盘指针
            show: 0
        },
        detail: {
            show: false
        },
        data: [{
            name: "",
            value: 100
        }]
    } ,
     
    {
        name: '到课率%',
        type: 'gauge',
        startAngle: 225,
        endAngle: -45,
        radius: '56%',
    center: ['50%', '55%'], // 默认全局居中  
         
        min: 0,
        max: 100,

        axisLine: {
            show: false,
            lineStyle: {
                width: 5,
                shadowBlur: 0,
                color: [
                
                    [1, '#82b440']
                ]
            }
        },
        axisTick: {
            show: false,
             
        },
        splitLine: {
            show: false,
            length: 20,

        },

        axisLabel: {
            show:false
        },
        pointer: {
            show: true,
            length: '65%',
            width: 4
        },
        detail: {
            show:false,
            offsetCenter: [0, 0],
            textStyle: {
                fontSize: 10
            }
        },
        itemStyle: {
        normal: {
            color: "#82b440",
            
        }
    },
        data: [{
            name: "",
            value: Math.floor(gauge_value)
        }]
    }]
};
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}

function leidatu(){
    var myChart = echarts.init(document.getElementById('leidatu'));
    option = {

        color: ['#00c2ff', '#f9cf67', '#e92b77'],
        legend: {
            show: true,
            // icon: 'circle',//图例形状
            bottom: 0,
            center: 0,
            itemWidth: 20, // 图例标记的图形宽度。[ default: 25 ]
            itemHeight: 20, // 图例标记的图形高度。[ default: 14 ]
            itemGap: 25, // 图例每项之间的间隔。[ default: 10 ]横向布局时为水平间隔，纵向布局时为纵向间隔。
            textStyle: {
                fontSize: 12,
                color: '#ade3ff'
            },
            data: ['王某某', '李某某', '张某某'],
        },
        radar: [{

            indicator: [{
                    text: '认真',
                    max: 100
                },
                {
                    text: '困惑',
                    max: 100
                },
                {
                    text: '犯困',
                    max: 100
                },
                {
                    text: '侧脸',
                    max: 100
                },
                {
                    text: '低头',
                    max: 100
                }
            ],

            textStyle: {
                color: 'red'
            },
            center: ['50%', '50%'],
            radius: 80,
            startAngle: 90,
            splitNumber: 3,
            orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'vertical'为纵向.
            // shape: 'circle',
            // backgroundColor: {
            //     image:imgPath[0]
            // },
            name: {
                formatter: '{value}',
                textStyle: {
                    fontSize: 12, //外圈标签字体大小
                    color: '#5b81cb' //外圈标签字体颜色
                }
            },
            splitArea: { // 坐标轴在 grid 区域中的分隔区域，默认不显示。
                show: true,
                areaStyle: { // 分隔区域的样式设置。
                    color: ['#141c42', '#141c42'], // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
                }
            },
            // axisLabel:{//展示刻度
            //     show: true
            // },
            axisLine: { //指向外圈文本的分隔线样式
                lineStyle: {
                    color: '#153269'
                }
            },
            splitLine: {
                lineStyle: {
                    color: '#113865', // 分隔线颜色
                    width: 1, // 分隔线线宽
                }
            }
        }, ],
        series: [{
            name: '雷达图',
            type: 'radar',
            itemStyle: {
                emphasis: {
                    lineStyle: {
                        width: 4
                    }
                }
            },
            data: [{
                name: '王某某',
                value: [85, 65, 55, 90, 82],
                areaStyle: {
                    normal: { // 单项区域填充样式
                        color: {
                            type: 'linear',
                            x: 0, //右
                            y: 0, //下
                            x2: 1, //左
                            y2: 1, //上
                            colorStops: [{
                                offset: 0,
                                color: '#00c2ff'
                            }, {
                                offset: 0.5,
                                color: 'rgba(0,0,0,0)'
                            }, {
                                offset: 1,
                                color: '#00c2ff'
                            }],
                            globalCoord: false
                        },
                        opacity: 1 // 区域透明度
                    }
                },
                symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
                 label: {                    // 单个拐点文本的样式设置
                        normal: {
                            show: true,             // 单个拐点文本的样式设置。[ default: false ]
                            position: 'top',        // 标签的位置。[ default: top ]
                            distance: 2,            // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                            color: '#6692e2',          // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                            fontSize: 14,           // 文字的字体大小
                            formatter:function(params) {
                                return params.value;
                            }
                        }
                    },
                itemStyle: {
                    normal: { //图形悬浮效果
                        borderColor: '#00c2ff',
                        borderWidth: 2.5
                    }
                },
                // lineStyle: {
                //     normal: {
                //         opacity: 0.5// 图形透明度
                //     }
                // }
            }, {
                name: '李某某',
                value: [50, 20, 45, 30, 75],
                symbolSize: 2.5,
                itemStyle: {
                    normal: {
                        borderColor: '#f9cf67',
                        borderWidth: 2.5,
                    }
                },
                areaStyle: {
                    normal: { // 单项区域填充样式
                        color: {
                            type: 'linear',
                            x: 0, //右
                            y: 0, //下
                            x2: 1, //左
                            y2: 1, //上
                            colorStops: [{
                                offset: 0,
                                color: '#f9cf67'
                            }, {
                                offset: 0.5,
                                color: 'rgba(0,0,0,0)'
                            }, {
                                offset: 1,
                                color: '#f9cf67'
                            }],
                            globalCoord: false
                        },
                        opacity: 1 // 区域透明度
                    }
                },
                // lineStyle: {
                //     normal: {
                //         opacity: 0.5// 图形透明度
                //     }
                // }
            }, {
                name: '张某某',
                value: [37, 80, 12, 50, 25],
                symbolSize: 2.5,
                itemStyle: {
                    normal: {
                        borderColor: '#e92b77',
                        borderWidth: 2.5,
                    }
                },
                areaStyle: {
                    normal: { // 单项区域填充样式
                        color: {
                            type: 'linear',
                            x: 0, //右
                            y: 0, //下
                            x2: 1, //左
                            y2: 1, //上
                            colorStops: [{
                                offset: 0,
                                color: '#e92b77'
                            }, {
                                offset: 0.5,
                                color: 'rgba(0,0,0,0)'
                            }, {
                                offset: 1,
                                color: '#e92b77'
                            }],
                            globalCoord: false
                        },
                        opacity: 1 // 区域透明度
                    }
                }
            }]
        }, ]
    };


    myChart.setOption(option);
    window.addEventListener("resize",function(){
        myChart.resize();
    });
}
