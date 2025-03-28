$(function(){
	piechart5();
    //大屏
    });
function piechart5(){
    var myChart = echarts.init(document.getElementById('piechart5'));

    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        color:['#8fc31f','#f35833','#00ccff','#ffcc00','#f5e965',],
        series : [
            {
                name: '课堂情绪占比',
                type: 'pie',
                radius : '50%',
                center: ['49%', '50%'],
                data:[
                    {value:435, name:'认真'},
                    {value:679, name:'困惑'},
                    {value:848, name:'犯困'},
                    {value:348, name:'低头'},
                    {value:679, name:'侧头'}
                ],
                itemStyle: {
                    normal: {
                        label:{ 
                            show: true, 
                            formatter: '{b} : {c} ({d}%)' ,
                            fontSize : 13,    
                        },
                        labelLine :{show:true}
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
    window.addEventListener("resize", function () {
        myChart.resize();
    });
}

