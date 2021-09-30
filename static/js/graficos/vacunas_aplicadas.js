am4core.ready(function() {

var vacunas_aplicadas = JSON.parse(vacunas_aplicadas_json);

// Themes begin
am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart instance
var chart = am4core.create("chartdiv", am4charts.XYChart);

// Create axes
var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

vacunas_disponibles = ['Sputnik',
 'AstraZeneca',
 'COVISHIELD',
 'Sinopharm',
 'Moderna',
 'Cansino',
 'Pfizer']

for (let i = 0; i < vacunas_disponibles.length; i++) {
  createSeries("value" + i, vacunas_disponibles[i]);
}

// Create series
function createSeries(s, name) {
  var series = chart.series.push(new am4charts.LineSeries());
  series.dataFields.valueY = "value" + s;
  series.dataFields.dateX = "date";
  series.name = name;

  var segment = series.segments.template;
  segment.interactionsEnabled = true;

  var hoverState = segment.states.create("hover");
  hoverState.properties.strokeWidth = 3;

  var dimmed = segment.states.create("dimmed");
  dimmed.properties.stroke = am4core.color("#dadada");

  segment.events.on("over", function(event) {
    processOver(event.target.parent.parent.parent);
  });

  segment.events.on("out", function(event) {
    processOut(event.target.parent.parent.parent);
  });

  var data = [];
  for (var i = 1; i < vacunas_aplicadas.length; i++) {
    if (vacunas_aplicadas[i].vacuna == name){
      var dataItem = { date: new Date(vacunas_aplicadas[i].fecha_aplicacion) };
      dataItem["value" + s] = vacunas_aplicadas[i].counts;
      data.push(dataItem);
    }
  }

  series.data = data;

  series.tooltipText = "{valueY}";
  return series;
}

chart.cursor = new am4charts.XYCursor();
chart.cursor.xAxis = dateAxis;

var scrollbarX = new am4core.Scrollbar();
scrollbarX.marginBottom = 20;
chart.scrollbarX = scrollbarX;

chart.legend = new am4charts.Legend();
chart.legend.position = "right";
chart.legend.scrollable = true;

// setTimeout(function() {
//   chart.legend.markers.getIndex(0).opacity = 0.3;
// }, 3000)
chart.legend.markers.template.states.create("dimmed").properties.opacity = 0.3;
chart.legend.labels.template.states.create("dimmed").properties.opacity = 0.3;

chart.legend.itemContainers.template.events.on("over", function(event) {
  processOver(event.target.dataItem.dataContext);
})

chart.legend.itemContainers.template.events.on("out", function(event) {
  processOut(event.target.dataItem.dataContext);
})

function processOver(hoveredSeries) {
  hoveredSeries.toFront();

  hoveredSeries.segments.each(function(segment) {
    segment.setState("hover");
  })
  
  hoveredSeries.legendDataItem.marker.setState("default");
  hoveredSeries.legendDataItem.label.setState("default");

  chart.series.each(function(series) {
    if (series != hoveredSeries) {
      series.segments.each(function(segment) {
        segment.setState("dimmed");
      })
      series.bulletsContainer.setState("dimmed");
      series.legendDataItem.marker.setState("dimmed");
      series.legendDataItem.label.setState("dimmed");
    }
  });
}

function processOut() {
  chart.series.each(function(series) {
    series.segments.each(function(segment) {
      segment.setState("default");
    })
    series.bulletsContainer.setState("default");
    series.legendDataItem.marker.setState("default");
    series.legendDataItem.label.setState("default");
  });
}

document.getElementById("button").addEventListener("click", function(){
  processOver(chart.series.getIndex(3));
})

});