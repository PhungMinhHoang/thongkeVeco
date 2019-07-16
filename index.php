<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>VHT Report</title>
    <!-- bootsrap -->
    <link rel="stylesheet" href="./inc/bootstrap/bootstrap.min.css">
    <link rel="stylesheet" href="./inc/bootstrap/bootstrap-grid.min.css"> 
    <link rel="stylesheet" href="./inc/bootstrap/bootstrap-reboot.min.css">  
    <!-- css -->
    <link rel="stylesheet" href="./inc/css/main.css">  
    <link rel="stylesheet" href="./inc/css/fontawesome-free-5.9.0-web/css/all.css">   

</head>

<body >
    <header>
        <img src="./inc/img/logo.png" width="90px" height="90px">
        <h1>Hệ thống Thống kê báo cáo VHT</h1>
    </header>
    <div class='container-fluid'>

        <div class="row">
            <div class="col-md-6 ">
                <div class="content">
                    <div id="chart_1" class="ct-chart"></div>
                </div>
            </div>

            <div class="col-md-6 ">
                <div class="content">
                    <div id="chart_KPI_quytrinh" class="ct-chart"></div>
                </div>
            </div>
        </div>

        <div class="row">
            <div class="col-md-6 ">
                <div class="content">
                    <div id="chart_Voffice" class="ct-chart"></div>
                </div>
            </div>
        
            <div class="col-md-6 ">
                <div class="content">
                    <div id="chart_Veco" class="ct-chart"></div>
                </div>
            </div>
        </div>
        

    </div>

    <!-- script -->
    <script src="./inc/jquery.js"></script>
    <script src="./inc/bootstrap.js"></script>

    <!-- highchart -->
    <script src="./inc/Highcharts-7.1.2/code/highcharts.src.js"></script>
    <script src="./inc/Highcharts-7.1.2/code/modules/exporting.js"></script>
    <script src="./inc/Highcharts-7.1.2/code/modules/export-data.js"></script>
    <script src="./inc/Highcharts-7.1.2/code/modules/data.js"></script>
    <script src="./inc/Highcharts-7.1.2/code/modules/drilldown.js"></script>

    <!-- my js -->
    <script src="inc/js/myFunction.js"></script>

    <script src="inc/js/highchart.js"></script>
    <script src="inc/js/highchartKPI.js"></script>
    <script src="inc/js/highchartVoffice.js"></script>
    <script src="inc/js/highchartVeco.js"></script>
    
    <script>
        
        $.get( "./json/json.php", function(res) {
            let myObj = JSON.parse(res);
            renderChart(myObj,'chart_1',tuy_chon_1, '<a href="thongkeCongViec.php">Tổng quan công việc trên Veco</a>');
        });

        //Lấy trung bình tất cả
        $.post( "./json/jsonQT.php", function(res) {
            let myObj = JSON.parse(res);
            renderChartKPI(myObj,null,'<a href="quytrinh.php">KPI tuân thủ quy trình Tổng công ty </a>')
        });

        $.get( "./json/jsonVoffice.php", function(res) {
            let myObj = JSON.parse(res);
            renderChartVoffice(myObj,'chart_Voffice',5, `<a href="thongkeVoffice.php">Văn bản ký Voffice TCT tháng ${m}</a>`,'column',null);
        });

        $.get( "./json/jsonVeco.php", function(res) {
            let myObj = JSON.parse(res);
            renderChartVeco(myObj,'chart_Veco',tuy_chon, `<a href="thongkeVeco.php">Sử dụng công cụ tuần ${w}</a>`);
        });
        
    
    </script>

</body>

</html>