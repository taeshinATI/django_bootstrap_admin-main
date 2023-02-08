// Set new default font family and font color to mimic Bootstrap's default styling
//Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
//Chart.defaults.global.defaultFontColor = '#858796';



function sayHi () {
    console.log('HI!!!!!!!!!!!!!!!!!')
    var labels2, data2, color2
    $.ajax({
            type:'GET',
            url:'/test2',
            async: false,
            success:function(res){
            labels2 = res['labels']
            data2 = res['data']
            color2 = res['color']
            },
            error : function() {
            }
        });

    var ctx = document.getElementById("myPieChart");
    var ctx22 = document.getElementById("myPieChart").getContext("2d");
//    ctx22.destroy()

    var myPieChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels2,
        datasets: [{
          data: data2,
          backgroundColor: color2,
          hoverBackgroundColor: color2,
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        title: {
            display: true,
            text: 'Bar Graph Test'
        },
        legend: {
          display: false
        },
      },
    });
//    myPieChart.destroy();
}

function draw_chart2 () {
    setInterval(sayHi, 600000);
//    var labels2, data2, color2
//    $.ajax({
//            type:'GET',
//            url:'/test2',
//            async: false,
//            success:function(res){
//            labels2 = res['labels']
//            data2 = res['data']
//            color2 = res['color']
//            },
//            error : function() {
//            }
//        });
//
//
//    var ctx = document.getElementById("myPieChart");
//    var myPieChart = new Chart(ctx, {
//      type: 'bar',
//      data: {
//        labels: labels2,
//        datasets: [{
//          data: data2,
//          backgroundColor: color2,
//          hoverBackgroundColor: color2,
//          hoverBorderColor: "rgba(234, 236, 244, 1)",
//        }],
//      },
//      options: {
//        maintainAspectRatio: false,
//        title: {
//            display: true,
//            text: 'Bar Graph Test'
//        },
//        legend: {
//          display: false
//        },
//      },
//    });
}

function draw_chart3(){
    var ctx = document.getElementById("myPieChart2");
    var myPieChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ["Direct", "Referral", "Social"],
        datasets: [{
          data: [55, 30, 15],
          backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
          hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
          hoverBorderColor: "rgba(234, 236, 244, 1)",
        }],
      },
      options: {
        maintainAspectRatio: false,
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          caretPadding: 10,
        },
        legend: {
          display: false
        },
        cutoutPercentage: 80,
      },
    });
}


function draw_gantt() {

    am4core.useTheme(am4themes_animated);
    // Themes end

    var chart = am4core.create("gantt_chart", am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0; // this creates initial fade-in

    chart.paddingRight = 30;
    chart.dateFormatter.inputDateFormat = "yyyy-MM-dd HH:mm";

    var colorSet = new am4core.ColorSet();
    colorSet.saturation = 0.4;

    chart.data = [
      {
        name: "John",
        fromDate: "2018-01-01 08:00",
        toDate: "2018-01-01 10:00",
        color: colorSet.getIndex(0).brighten(0)
      },
      {
        name: "John",
        fromDate: "2018-01-01 12:00",
        toDate: "2018-01-01 15:00",
        color: colorSet.getIndex(0).brighten(0.4)
      },
      {
        name: "John",
        fromDate: "2018-01-01 15:30",
        toDate: "2018-01-01 21:30",
        color: colorSet.getIndex(0).brighten(0.8)
      },

      {
        name: "Jane",
        fromDate: "2018-01-01 09:00",
        toDate: "2018-01-01 12:00",
        color: colorSet.getIndex(2).brighten(0)
      },
      {
        name: "Jane",
        fromDate: "2018-01-01 13:00",
        toDate: "2018-01-01 17:00",
        color: colorSet.getIndex(2).brighten(0.4)
      },

      {
        name: "Peter",
        fromDate: "2018-01-01 11:00",
        toDate: "2018-01-01 16:00",
        color: colorSet.getIndex(4).brighten(0)
      },
      {
        name: "Peter",
        fromDate: "2018-01-01 16:00",
        toDate: "2018-01-01 19:00",
        color: colorSet.getIndex(4).brighten(0.4)
      },

      {
        name: "Melania",
        fromDate: "2018-01-01 16:00",
        toDate: "2018-01-01 20:00",
        color: colorSet.getIndex(6).brighten(0)
      },
      {
        name: "Melania",
        fromDate: "2018-01-01 20:30",
        toDate: "2018-01-01 24:00",
        color: colorSet.getIndex(6).brighten(0.4)
      },

      {
        name: "Donald",
        fromDate: "2018-01-01 13:00",
        toDate: "2018-01-01 24:00",
        color: colorSet.getIndex(8).brighten(0)
      }
    ];

    var categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "name";
    categoryAxis.renderer.grid.template.location = 0;
    categoryAxis.renderer.inversed = true;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dateFormatter.dateFormat = "yyyy-MM-dd HH:mm";
    dateAxis.renderer.minGridDistance = 70;
    dateAxis.baseInterval = { count: 30, timeUnit: "minute" };
    dateAxis.max = new Date(2018, 0, 1, 24, 0, 0, 0).getTime();
    dateAxis.strictMinMax = true;
    dateAxis.renderer.tooltipLocation = 0;

    var series1 = chart.series.push(new am4charts.ColumnSeries());
    series1.columns.template.width = am4core.percent(80);
    series1.columns.template.tooltipText = "{name}: {openDateX} - {dateX}";

    series1.dataFields.openDateX = "fromDate";
    series1.dataFields.dateX = "toDate";
    series1.dataFields.categoryY = "name";
    series1.columns.template.propertyFields.fill = "color"; // get color from data
    series1.columns.template.propertyFields.stroke = "color";
    series1.columns.template.strokeOpacity = 1;

    chart.scrollbarX = new am4core.Scrollbar();




//    var ctx_test = document.getElementById("gantt_chart");
//    const labels5 = Utils.months({count: 7});
//    const data = {
//          labels: labels5,
//          datasets: [{
//            label: 'Weekly Sales',
//            data: [18, 12, 6, 9, 12, 3, 9],
//            backgroundColor: [
//              'rgba(255, 26, 104, 0.2)',
//              'rgba(54, 162, 235, 0.2)',
//              'rgba(255, 206, 86, 0.2)',
//              'rgba(75, 192, 192, 0.2)',
//              'rgba(153, 102, 255, 0.2)',
//              'rgba(255, 159, 64, 0.2)',
//              'rgba(0, 0, 0, 0.2)'
//            ],
//            borderColor: [
//              'rgba(255, 26, 104, 1)',
//              'rgba(54, 162, 235, 1)',
//              'rgba(255, 206, 86, 1)',
//              'rgba(75, 192, 192, 1)',
//              'rgba(153, 102, 255, 1)',
//              'rgba(255, 159, 64, 1)',
//              'rgba(0, 0, 0, 1)'
//            ],
//            borderWidth: 1
//          }]
//        };
//
//    var scatterChart = new Chart(ctx_test, {
//            type: 'bar',
//            data,
//            options: {
//              indexAxis: "y",
//              scales: {
//                  y: {
//                    beginAtZero: true
//                  }
//            }
//          }
//
//        });
//
//}

//function lineChart(target, data){
//    var root = am5.Root.new("chartdiv");
//    root.dateFormatter.setAll({
//      dateFormat: "yyyy-MM-dd",
//      dateFields: ["valueX", "openValueX"]
//    });
//
//		am4core.useTheme(am4themes_animated);
//
//		// Create chart instance
//		var chart = am4core.create(target, am4charts.XYChart);
//
//		// 차트 크기 지정, 자동 여백 사용x
//		chart.autoMargins = false;
//		chart.width = am4core.percent(100);
//		chart.height = am4core.percent(100);
//
//		// 차트 데이터
//		chart.data = data;
//
//		// x 축
//		var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
//		dateAxis.renderer.minGridDistance = 30;
//		dateAxis.endLocation = 0;
//		dateAxis.renderer.labels.template.location = 0.0001;
//		dateAxis.renderer.inside = false;
//		dateAxis.tooltip.disabled = true;
//
//		//선과 라벨 글자 색
//		dateAxis.renderer.labels.template.fill = "#ffffff";
//		dateAxis.renderer.line.stroke = "#ffffff";
//
//		// y 축
//		var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
//		valueAxis.maxPrecision = 0;
//
//		// 최소, 최대값 지정
//		valueAxis.min = 0;
//		valueAxis.max = 100;
//
//		//0이 안보이게
//		valueAxis.renderer.minLabelPosition = 0.01;
//
//		//선과 라벨 글자 색
//		valueAxis.renderer.labels.template.fill = "#ffffff";
//		valueAxis.renderer.line.stroke = "#ffffff";
//
//		// Create series
//		function createSeries(field, name) {
//		  var series = chart.series.push(new am4charts.LineSeries());
//		  series.dataFields.valueY = field;
//		  series.dataFields.dateX = "date";
//		  series.name = name;
//		  series.tooltipText = "{dateX}: [b]{valueY}[/]";
//		  series.strokeWidth = 2;
//
//
//		  var bullet = series.bullets.push(new am4charts.CircleBullet());
//
//		//하얀색 동그라미 태두리
//		  bullet.circle.stroke = am4core.color("#fff");
//		  bullet.circle.strokeWidth = 2;
//		  series.dataItems.template.locations.dateX = 0;
//
//		  //클릭 시 alert
//		  bullet.events.on("hit", function(ev) {
//		    alert("Clicked on " + ev.target.dataItem.dateX + ": " + ev.target.dataItem.valueY);
//		  });
//		}
//
//		createSeries("value", "Series #1");
//
//		chart.cursor = new am4charts.XYCursor();
//
//		return chart;
}


function draw_gantt2() {
    var g_data = [{
             "date": new Date(2018, 1, 2, 3, 10),
             "value": 50
            }, {
             "date": new Date(2018, 1, 2, 3, 20),
             "value": 70
            }, {
             "date": new Date(2018, 1, 2, 3, 30),
             "value": 49
            }, {
             "date": new Date(2018, 1, 2, 3, 40),
             "value": 50
            }, {
             "date": new Date(2018, 1, 2, 3, 50),
             "value": 55
            }, {
             "date": new Date(2018, 1, 2, 4, 0),
              "value": 42
            }, {
             "date": new Date(2018, 1, 2, 4, 10),
              "value": 49
            }];

            lineChart("gantt_chart", g_data);
}




//draw_chart2()
draw_chart3()
draw_gantt()

//// Pie Chart Example
//var ctx = document.getElementById("myPieChart");
//var myPieChart = new Chart(ctx, {
//  type: 'doughnut',
//  data: {
//    labels: ["Direct", "Referral", "Social"],
//    datasets: [{
//      data: [55, 30, 15],
//      backgroundColor: ['#4e73df', '#1cc88a', '#36b9cc'],
//      hoverBackgroundColor: ['#2e59d9', '#17a673', '#2c9faf'],
//      hoverBorderColor: "rgba(234, 236, 244, 1)",
//    }],
//  },
//  options: {
//    maintainAspectRatio: false,
//    tooltips: {
//      backgroundColor: "rgb(255,255,255)",
//      bodyFontColor: "#858796",
//      borderColor: '#dddfeb',
//      borderWidth: 1,
//      xPadding: 15,
//      yPadding: 15,
//      displayColors: false,
//      caretPadding: 10,
//    },
//    legend: {
//      display: false
//    },
//    cutoutPercentage: 80,
//  },
//});

