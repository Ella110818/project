$(function(){

	zhexian();
    //大屏
    });
function zhexian() {
	var myChart = echarts.init(document.getElementById('zhexian'));

	dataText = [{
		name: '认真',
		type: 'line',
		smooth: true,
		symbolSize: 8,
		data: [127, 224, 120, 278, 227, 250],
		barWidth: '30%',
		itemStyle: {
			normal: {
				color: '#91ff1c'
			}
		}
	}, {
		name: '困惑',
		type: 'line',
		smooth: true,
		symbolSize: 8,
		data: [27, 124, 70, 178, 127, 157],
		barWidth: '30%',
		itemStyle: {
			normal: {
				color: '#ffff7f'
			}
		}
	},
		{
			name: '玩手机',
			type: 'line',
			smooth: true,
			symbolSize: 8,
			data: [127, 74, 120, 99, 130, 355],
			barWidth: '30%',
			itemStyle: {
				normal: {
					color: '#06c9ff'
				}
			}
		},
		{
			name: '低头',
			type: 'line',
			smooth: true,
			symbolSize: 8,
			data: [127, 74, 120, 99, 130, 355],
			barWidth: '30%',
			itemStyle: {
				normal: {
					color: '#ff4a03'
				}
			}
		},
		{
			name: '侧脸',
			type: 'line',
			smooth: true,
			symbolSize: 8,
			data: [127, 74, 120, 99, 130, 355],
			barWidth: '30%',
			itemStyle: {
				normal: {
					color: '#f9f102'
				}
			}
		}
	]
	dataObj = {
		time: ['20min', '40min', '60min', '80min', '100min', '120min'],
		data: {
			value: [{
				name: '认真',
				value: [50,40,48,32,20,33]
			}, {
				name: '困惑',
				value: [5,10,15,8,2,6]
			}, {
				name: '犯困',
				value: [0,1,3,5,2,0]
			}, {
				name: '低头',
				value: [10,30,20,25,12,10]
			}, {
				name: '侧脸',
				value: [5,7,3,2,5,2]
			}
		]
		}
	}
	let dataArr = []

	dataObj.data.value.map(item => {
		let datachild = []
		let newArr = {
			name: item.name,
			type: 'line',
			smooth: true,
			symbolSize: 8,
			data: item.value,
			barWidth: '30%',
			itemStyle: {
				normal: {
					color: item.name === '认真' ? '#91ff1c' : item.name === '困惑' ? '#ffff7f' : item.name === '玩手机' ? '#06c9ff': item.name === '低头' ? '#ff4a03':'#f9f102'
				}
			}
		}

		dataArr.push(newArr)
	})
	option = {
		color: ['#f0c725', '#16f892'],
		title: {
			left: 'center',
			text: '',
			textStyle: {
				color: '#FFFFFF',
				fontSize: '14',
			}
		},
		tooltip: {
			trigger: 'axis',
			axisPointer: { // 坐标轴指示器，坐标轴触发有效
				type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
			}
		},
		legend: {
			x: 'center',
			top: '25',
			textStyle: {
				color: '#c1cadf',
				"fontSize": 14
			}
		},
		grid: {
			left: '6%',
			right: '4%',
			top: '25%',
			bottom: '3%',
			containLabel: true
		},
		toolbox: {
			show: true,
			orient: 'vertical',
			x: 'right',
			y: 'center'
		},
		xAxis: [{
			type: 'category',
			boundaryGap: false,
			data: dataObj.time,
			axisLine: {
				lineStyle: {
					color: 'rgba(240,199,37,0.5)'
				}
			},
			axisLabel: {
				interval: 0,
				color: '#c1cadf',
				fontSize: '14'
			}
		}],
		yAxis: [{
			type: 'value',
			name: '(人)',
			nameTextStyle: {
				color: '#c1cadf',
				align: 'right',
				lineHeight: 10
			},
			axisLine: {
				lineStyle: {
					color: 'rgba(240,199,37,0.5)'
				}
			},
			axisLabel: {
				interval: 0,
				color: '#c1cadf',
				fontSize: '14'
			},
			splitLine: {
				show: false
			}
		}],
		series: dataArr
	};
    //大屏
	/*var myChart = echarts.init(document.getElementById('channel_handle_detail'));
    myChart.clear();
    if(data.handleTimeData.length>0){
        myChart.setOption(option);
    }else{
        noDataTip($("#channel_handle_detail"));
    }*/
	// 使用刚指定的配置项和数据显示图表。
	myChart.setOption(option);
	window.addEventListener("resize",function(){
		myChart.resize();
	});
}