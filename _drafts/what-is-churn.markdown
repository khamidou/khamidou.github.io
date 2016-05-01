---
layout: post
title: Visualizing customer churn
featured: true
---
Customer churn is one of those metrics everybody looks at, but it can actually be quite deceptive! Since I had a hard time wrapping my hear around the idea[^idea], I figured I may as well write a quick explanation.

### What is churn?

Let's say you run a SaaS company and offer a single 19$/month plan. Every month you add 30 customers, and lose 10 others. How does this affect your bottom line?

To answer this question, a lot of people use a metric called the *churn rate*. This is how you compute it:

<center><img src='/images/churn_rate/churn_formula.gif' alt='formula to compute churn rate'></img></center>

Simple, right? There's one funny thing though --- because of the way it's defined, your churn rate becomes smaller every month.

Here's an interactive example to make things clearer (you can play with the sliders to see how it affects the churn rate):

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

#firstGraph {
    font-size: 0.9em;
    border: 1px solid #ccc;
    padding: 10px;
    border-radius: 3px;
}
</style>

<section id="firstGraph">
  <canvas id="canvas"></canvas>
  <label style='margin-right: 5em;'>Number of new customers: <span id="newCustomers_v"></span>
    <input id="newCustomers" type="range" min="0" value="10" max="100" step="1"></input></label>
  <label>Number of churning customers: <span id="churningCustomers_v"></span>
     <input id="churningCustomers" type="range" min="0" value="5" max="100" step="1"></input></label> <br>
  <label>Price: <input id="pricePlan" type="number" value="29"></input></label>
</section>

[^churn]: The churn rate is the percentage of customers who've stopped using your product over a period of time.
[^idea]: There's a lot of [blog](https://blog.rjmetrics.com/2014/08/20/how-to-calculate-your-saas-churn-rate/) [posts](https://engineering.shopify.com/17488468-defining-churn-rate-no-really-this-actually-requires-an-entire-blog-post) [explaining](https://blog.recurly.com/2014/08/better-way-to-calculate-your-churn-rate) why you should be cautious about your churn rate, but they're very mathy and hard to understand.



<script type='text/javascript' src='/static/js/jquery.min.js'></script>
<script type='text/javascript' src='/static/js/Chart.min.js'></script>
<script type='text/javascript'>
  /* This is terrible, terrible code */
  var currentChart;

  function setChartDimensions() {
    var width = $("section").width() - 30,
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
    var totalCustomers = 1;
    var result = [];

    for (i = 0; i < 12; i++) {
      totalCustomers += totalCustomers * (1 + new_customers - lost_customers);
      revenue = totalCustomers * pricetag;
      result.push(revenue);
    }

    return result;
  }

  function computeChurn(new_customers, lost_customers) {
    var i = 0;
    var totalCustomers = 1;
    var result = [];

    result.push(0.0);
    totalCustomers = totalCustomers * (1 + new_customers - lost_customers);

    for (i = 1; i < 12; i++) {
        result.push(((lost_customers * totalCustomers) / totalCustomers) * 100);
        totalCustomers += totalCustomers * (1 + new_customers - lost_customers);
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

    var new_customers = parseInt($("#newCustomers").val()) / 100;
    var lost_customers = parseInt($("#churningCustomers").val()) / 100;
    var pricetag = parseInt($("#pricePlan").val());
    $('#newCustomers_v').text(new_customers * 100 + '%');
    $('#churningCustomers_v').text(lost_customers * 100 + '%');

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
        var new_customers = parseInt($("#newCustomers").val()) / 100;
        var lost_customers = parseInt($("#churningCustomers").val()) / 100;
        var pricetag = parseInt($("#pricePlan").val());
        $('#newCustomers_v').text(new_customers * 100 + '%');
        $('#churningCustomers_v').text(lost_customers * 100 + '%');

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

As you can see, your churn rate decreases exponentially, even though your revenue is increasing linearly.
