// Set new default font family and font color to mimic Bootstrap's default styling
//Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
//Chart.defaults.global.defaultFontColor = '#858796';
const CSS_COLOR_NAMES2 = [
"#96ceb4",
"#c3dbb1",
"#d7e1b0",
"#ffeead",
"#ffd69f",
"#ffa583",
"#ff6f69",
"#ff8467",
"#ffa963",
"#ffcc5c",
"#eccf6e",
"#c2d490",
"#88d8b0",
"#aeb490",
"#be9b7b",
"#e59c87",
"#fe9c8f"

]
const CSS_COLOR_NAMES = [
"#fe4a49",
"#2ab7ca",
"#fed766",
"#51e2f5",
"#9df9ef",
"#edf756",
"#ffa8B6",
"#a28089",
"#a0d2eb",
"#e5eaf5",
"#d0bdf4",
"#8458B3",
"#a28089",
"#ff1d58",
"#f75990",
"#fff685",
"#00DDFF",
"#0049B7",
"#e1b382",
"#c89666",
"#2d545e",
"#12343b",
"#9bc400",
"#8076a3",
"#f9c5bd",
"#7c677f",
"#478559",
"#161748",
"#f95d9b",
"#39a0ca",
"#ffde22",
"#ff414e",
"#ff8928",
"#3d7c47",
"#09868b",
"#76c1d4",
"#f7f7f7"
];

function getCookie(name) {
    var cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        var cookies = document.cookie.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

var csrftoken = getCookie('csrftoken');

function csrfSafeMethod(method) {
    // these HTTP methods do not require CSRF protection
    return (/^(GET|HEAD|OPTIONS|TRACE)$/.test(method));
}
$.ajaxSetup({
    beforeSend: function(xhr, settings) {
        if (!csrfSafeMethod(settings.type) && !this.crossDomain) {
            xhr.setRequestHeader("X-CSRFToken", csrftoken);
        }
    }
});

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}




function draw_chart() {
    var labels2, data2
    $.ajax({
            type:'GET',
            url:'/test',
            async: false,
            success:function(res){
    //            console.log("data pass success", json);
            labels2 = res['labels']
            data2 = res['data']
            },
            error : function() {
            }
        });

    //var labels2 = ["Jan", "Feb", "Mar", "Apr"]
    //var data2 = [100, 80, 150, 200]

    // Area Chart Example
    var ctx = document.getElementById("myAreaChart");
    var myLineChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels2,
        datasets: [{
          label: "Earnings",
          lineTension: 0.3,
          backgroundColor: "rgba(78, 115, 223, 0.05)",
          borderColor: "rgba(78, 115, 223, 1)",
          pointRadius: 3,
          pointBackgroundColor: "rgba(78, 115, 223, 1)",
          pointBorderColor: "rgba(78, 115, 223, 1)",
          pointHoverRadius: 3,
          pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
          pointHoverBorderColor: "rgba(78, 115, 223, 1)",
          pointHitRadius: 10,
          pointBorderWidth: 2,
          data: data2,
        }],
      },
      options: {
        maintainAspectRatio: false,
        layout: {
          padding: {
            left: 10,
            right: 25,
            top: 25,
            bottom: 0
          }
        },
        scales: {
          xAxes: [{
            time: {
              unit: 'date'
            },
            gridLines: {
              display: false,
              drawBorder: false
            },
            ticks: {
              maxTicksLimit: 7
            }
          }],
          yAxes: [{
            ticks: {
              maxTicksLimit: 5,
              padding: 5,
              // Include a dollar sign in the ticks
              callback: function(value, index, values) {
                return '$' + number_format(value);
              }
            },
            gridLines: {
              color: "rgb(234, 236, 244)",
              zeroLineColor: "rgb(234, 236, 244)",
              drawBorder: false,
              borderDash: [2],
              zeroLineBorderDash: [2]
            }
          }],
        },
        legend: {
          display: false
        },
        tooltips: {
          backgroundColor: "rgb(255,255,255)",
          bodyFontColor: "#858796",
          titleMarginBottom: 10,
          titleFontColor: '#6e707e',
          titleFontSize: 14,
          borderColor: '#dddfeb',
          borderWidth: 1,
          xPadding: 15,
          yPadding: 15,
          displayColors: false,
          intersect: false,
          mode: 'index',
          caretPadding: 10,
          callbacks: {
            label: function(tooltipItem, chart) {
              var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
              return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
            }
          }
        }
      }
    });
}

function draw_chart2(){
    var labels2, data2
    $.ajax({
            type:'GET',
            url:'/test3',
            async: false,
            success:function(res){
            labels2 = res['labels']
            data2 = res['data']
            model2 = res['model']
            },
            error : function() {
            }
        });
    var result = [];
    for (step= 0; step < data2.length; step++){
//        colorCode = "#" + Math.round(Math.random() * 0xffffff).toString(16);
        colorCode = CSS_COLOR_NAMES2[step]
        result.push({
        label: model2[step],
        data: data2[step],
        backgroundColor: colorCode,
        stack: 'Stack 0'
        });
        }

//    const DATA_COUNT = 7;
//    const NUMBER_CFG = {count: DATA_COUNT, min: -100, max: 100};
//    const Utils = ChartUtils.init();
//    const labels3 = Utils.months({count: 7});
    const labels3 = labels2
    const data3 = {
      labels: labels3,
      datasets: result
//      [
//        {
//          label: 'Dataset 1',
//          data: [40, 60, 33, 1, 100, 99, 20],
//          backgroundColor: '#e28743',
//          stack: 'Stack 0',
//        },
//        {
//          label: 'Dataset 2',
//          data: [140, 640, 353, 14, 110, 39, 30],
//          backgroundColor: '#76b5c5',
//          stack: 'Stack 0',
//        },
//        {
//          label: 'Dataset 3',
//          data: [20, 60, 35, 143, 10, 355, 10],
//          backgroundColor: '#d87c90',
//          stack: 'Stack 0',
//        },
//      ]
    };

        // Area Chart Example
    var ctx2 = document.getElementById("stack_area_chart");
    var myStackChart = new Chart(ctx2, {
      type: 'bar',
      data: data3,
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Chart.js Bar Chart - Stacked'
          },
        },
        responsive: true,
//        interaction: {
//          intersect: false,
//        },
        scales: {
          x: {
            stacked: true,
          },
          y: {
            stacked: true
          }
        },
        onClick: (e, items) =>{
            selectedItem = items[0]
            var data_ = e['chart']['data']['datasets']
            var clickedElementIndex = selectedItem['index']
            var datasetIndex = selectedItem['datasetIndex']
            console.log(data_)
            console.log(clickedElementIndex)
            console.log(datasetIndex)
            var label = data_[datasetIndex].label;
//            var value = data_.datasets[datasetIndex].data[clickedElementIndex];
            var date = labels3[clickedElementIndex]
            console.log(date, label)
            var result = {
            'date': date,   // 날짜
            'label': label   // 모델
            }
            $.ajax({
                    type:'POST',
                    url:'/test4',
                    data: JSON.stringify(result),
                    dataType:'json',
                    success: function (response){
                        draw_clickedChart(response, result)
                        }
                    });
        }
      }
      });
//    var canvas = document.getElementById('stack_area_chart');
//    canvas.onclick = function(evt){
//    var activePoints = myStackChart.getElementAtEvent(evt)[0];

//    if (activePoints) {
//        var data_ = activePoints._chart.data;
//        var clickedElementIndex = activePoints["_index"];
//        var datasetIndex = activePoints._datasetIndex;
//        var label = data_.datasets[datasetIndex].label;
//        var value = data_.datasets[datasetIndex].data[activePoints._index];
//        var date = labels3[clickedElementIndex]
//
//        var result = {
//        'date': date,
//        'label': label
//        }
//
//        $.ajax({
//                type:'POST',
//                url:'/test4',
//                data: JSON.stringify(result),
//                dataType:'json',
//                success: function (response){
//                    draw_clickedChart(response, result)
//                    }
//                });

}


function draw_clickedChart(response, clicked_barData) {
    let clicked_result = response
    let clicked_barInfo = clicked_barData
//    console.log('draw_clickedChart')

     var chartExist = Chart.getChart("myChart"); // <canvas> id
        if (chartExist != undefined)
          chartExist.destroy();

    var myPieChart = new Chart(ctx, {
      type: 'bar',
      data:{
        labels: clicked_result['labels'],
        datasets:[{
            label: "Strips",
            data: clicked_result['data'],
            backgroundColor: CSS_COLOR_NAMES.slice(undefined, clicked_result['data'].length)
                  }]
      },
      options: {
        maintainAspectRatio: false,
        title: {
            display: true,
            text: clicked_barInfo['date'] + ' ' + clicked_barInfo['label']
        },
        legend: {
          display: false
        },
      },
    });

//    console.log(clicked_result['labels'])
//    console.log(clicked_result['data'])
//    const labels3 = labels2
//    const data3 = {
//      labels: labels3,
//      datasets: result
//
//    };
//
//        // Area Chart Example
//    var ctx2 = document.getElementById("stack_area_chart");
//    var myStackChart = new Chart(ctx2, {
//      type: 'bar',
//      data: data3,
//      options: {
//        plugins: {
//          title: {
//            display: true,
//            text: 'Chart.js Bar Chart - Stacked'
//          },
//        },
//        responsive: true,
//        scales: {
//          x: {
//            stacked: true,
//          },
//          y: {
//            stacked: true
//          }
//        }
//      }
//      });
}


draw_chart()
draw_chart2()

