---
layout: post
title: Visualizing customer churn
featured: true
---
I've been working on an internal dashboard showing various business-level metrics like the churn rate.
The churn rate[^churn] is one of those concepts which seems simple but turns out to be harder than expected to understand.

Like with a lot of things in statistics, it's easier to play with visualization of the data to get a feel of how things work. Here's a quick and dirty dataviz in Javascript.

##  The impact of customer churn on revenue

Here's a simple example. Let's say you're running a pretty simple SaaS app with a single 29$/month plan. Every month you add 50 customers but you lose 20 others. How does this affect your bottom-line?

<style>
.axis path,
.axis line {
  fill: none;
  stroke: #000;
  shape-rendering: crispEdges;
}

.x.axis path {
  display: none;
}

.line {
  fill: none;
  stroke: steelblue;
  stroke-width: 1.5px;
}
</style>

<section id="firstGraph">
  <canvas id="canvas"></canvas>
  <label>Number of new customers: <span id="newCustomers_v"></span>
    <input id="newCustomers" type="range" min="0" value="50" max="500" step="1"></input></label> <br>
  <label>Number of churning customers: <span id="churningCustomers_v"></span>
     <input id="churningCustomers" type="range" min="0" value="20" max="500" step="1"></input></label> <br>
  <label>Price: <input id="pricePlan" type="number" value="29"></input></label>
</section>

[^churn]: The churn rate is the percentage of customers who've stopped using your product over a period of time.

<script type='text/javascript' src='/static/js/jquery.min.js'></script>
<script type='text/javascript' src='/static/js/Chart.min.js'></script>
<script type='text/javascript'>
  /* This is terrible, terrible code */
  var currentChart;

  function setChartDimensions() {
    var width = $("section").width(),
        height = 400;
    if (currentChart) {
      currentChart.chart.aspectRatio = width / height;
    } else {
      $("canvas").attr("width", width);
      $("canvas").attr("height", height);
    }
  }

  function computeRevenue(new_customers, lost_customers, pricetag) {
    var i = 0;
    var revenue = 0;
    var totalCustomers = 0;
    var result = [];

    for (i = 0; i < 12; i++) {
      totalCustomers += new_customers - lost_customers;
      revenue = totalCustomers * pricetag;
      result.push(revenue);
    }

    return result;
  }

  function computeChurn(new_customers, lost_customers) {
    var i = 0;
    var totalCustomers = 0;
    var result = [];

    result.push(0.0);
    totalCustomers = new_customers - lost_customers;

    for (i = 1; i < 12; i++) {
        result.push((lost_customers / totalCustomers) * 100);
        totalCustomers += new_customers - lost_customers;
    }

    return result;
  }

  function getChartData(new_customers, lost_customers, pricetag) {

      var data = {
        labels: ["January", "February", "March", "April", "May", "June", "July", "August",
                 "September", "October", "November", "December"],
        scaleUse2Y: true,
        datasets: [
            {
              label: "Customer churn",
              fillColor: "rgba(151,187,205,0.2)",
              strokeColor: "rgba(151,187,205,1)",
              pointColor: "rgba(151,187,205,1)",
              pointStrokeColor: "#fff",
              pointHighlightFill: "#fff",
              pointHighlightStroke: "rgba(151,187,205,1)",
              yAxesGroup: "1",
              data: computeRevenue(new_customers, lost_customers, pricetag),
            },

            {
            label: "Computed churn rate",
            fillColor: "rgba(220,220,220,0.2)",
            strokeColor: "rgba(220,220,220,1)",
            pointColor: "rgba(220,220,220,1)",
            pointStrokeColor: "#fff",
            pointHighlightFill: "#fff",
            pointHighlightStroke: "rgba(220,220,220,1)",
            yAxesGroup: "2",
            data: computeChurn(new_customers, lost_customers),
            },
          ],
         yAxes: [{
             name: "1",
             scalePositionLeft: false,
             scaleFontColor: "rgba(151,137,200,0.8)"
         }, {
             name: "2",
             scalePositionLeft: true,
             scaleFontColor: "rgba(151,187,205,0.8)"
         }]
      };

      console.log(data);
      return data;
  }

  function drawChart() {
    setChartDimensions();

    var new_customers = parseInt($("#newCustomers").val());
    var lost_customers = parseInt($("#churningCustomers").val());
    var pricetag = parseInt($("#pricePlan").val());
    $('#newCustomers_v').text(new_customers);
    $('#churningCustomers_v').text(lost_customers);

    data = getChartData(new_customers, lost_customers, pricetag);

    var ctx = document.getElementById("canvas").getContext("2d");
    currentChart = new Chart(ctx).Line(data, {animation: false, responsive: false});
  }

  window.onload = function() {
    drawChart();
    $(window).resize(function() {
      if (currentChart) {
        setChartDimensions();
        currentChart.stop();
        currentChart.resize(currentChart.render, true);
      }
    });

    $(document).on("change", "#firstGraph input", function() {
        var new_customers = parseInt($("#newCustomers").val());
        var lost_customers = parseInt($("#churningCustomers").val());
        var pricetag = parseInt($("#pricePlan").val());
        $('#newCustomers_v').text(new_customers);
        $('#churningCustomers_v').text(lost_customers);

        var newRevenueValues = computeRevenue(new_customers, lost_customers, pricetag);
        var newChurnValues = computeChurn(new_customers, lost_customers);
        var i;
        for (i = 0; i < 12; i++) {
            currentChart.datasets[0].points[i].value = newRevenueValues[i];
            currentChart.datasets[1].points[i].value = newChurnValues[i];
        }
        currentChart.update();
    });
  };
</script>
