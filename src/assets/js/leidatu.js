$(function(){

	leidatu();
    //大屏
    });
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