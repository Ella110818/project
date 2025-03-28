$(function(){
	echarts_2();
    });
function echarts_2() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('feng02'));
var gauge_value=30;

option = {
title: {
        x: "center",
        bottom: 0,
        text: gauge_value,
        subtext: '作业提交率%',
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
        name: '作业提交率%',
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
                width:5,
                shadowBlur: 0,
                color: [
                
                    [1, '#2ea7ff']
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
            color: "#2ea7ff",
            
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
