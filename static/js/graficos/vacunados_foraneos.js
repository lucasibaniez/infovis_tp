am4core.ready(function() {

// Themes begin
am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);
// Themes end

// Create chart
var chart = am4core.create("chartdiv", am4charts.PieChart);
chart.data = JSON.parse(foraneos_chaco)

var pieSeries = chart.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "counts";
pieSeries.dataFields.category = "jurisdiccion_residencia";
pieSeries.slices.template.stroke = am4core.color("#fff");
pieSeries.slices.template.strokeOpacity = 1;

// This creates initial animation
pieSeries.hiddenState.properties.opacity = 1;
pieSeries.hiddenState.properties.endAngle = -90;
pieSeries.hiddenState.properties.startAngle = -90;

chart.hiddenState.properties.radius = am4core.percent(0);




/* ======================
        GRAFICO PAIS
   ====================== */



var container = am4core.create("chartdiv2", am4core.Container);
container.width = am4core.percent(100);
container.height = am4core.percent(100);
container.layout = "horizontal";


var chart2 = container.createChild(am4charts.PieChart);

// Add data
chart2.data = JSON.parse(foraneos_pais);

// Add and configure Series
var pieSeries = chart2.series.push(new am4charts.PieSeries());
pieSeries.dataFields.value = "foraneos";
pieSeries.dataFields.category = "jurisdiccion";
pieSeries.slices.template.states.getKey("active").properties.shiftRadius = 0;
//pieSeries.labels.template.text = "{category}\n{value.percent.formatNumber('#.#')}%";

pieSeries.slices.template.events.on("hit", function(event) {
  selectSlice(event.target.dataItem);
})

var chart2 = container.createChild(am4charts.PieChart);
chart2.width = am4core.percent(30);
chart2.radius = am4core.percent(80);

// Add and configure Series
var pieSeries2 = chart2.series.push(new am4charts.PieSeries());
pieSeries2.dataFields.value = "counts";
pieSeries2.dataFields.category = "jurisdiccion";
pieSeries2.slices.template.states.getKey("active").properties.shiftRadius = 0;
//pieSeries2.labels.template.radius = am4core.percent(50);
//pieSeries2.labels.template.inside = true;
//pieSeries2.labels.template.fill = am4core.color("#ffffff");
pieSeries2.labels.template.disabled = true;
pieSeries2.ticks.template.disabled = true;
pieSeries2.alignLabels = false;
pieSeries2.events.on("positionchanged", updateLines);

var interfaceColors = new am4core.InterfaceColorSet();

var line1 = container.createChild(am4core.Line);
line1.strokeDasharray = "2,2";
line1.strokeOpacity = 0.5;
line1.stroke = interfaceColors.getFor("alternativeBackground");
line1.isMeasured = false;

var line2 = container.createChild(am4core.Line);
line2.strokeDasharray = "2,2";
line2.strokeOpacity = 0.5;
line2.stroke = interfaceColors.getFor("alternativeBackground");
line2.isMeasured = false;

var selectedSlice;

colores_disponibles = ["#D67272", "#D2B4DE", "#F9E79F", "#800080", "#FF00FF", "#000080", "#0000FF", "#008080", "#00FFFF", "#008000", "#00FF00", "#808000", "#FFFF00", "#800000", "#FF0000", "#808080", "#C0C0C0", "#D858E5", "#745C76", "#C24F05", "#6034A1", "#768D70", "#198980", "#3E36A7", "#D594BC", "#ACE087"]

function selectSlice(dataItem) {

  selectedSlice = dataItem.slice;

  var fill = selectedSlice.fill;

  var count = dataItem.dataContext.particion.length;
  pieSeries2.colors.list = [];
  for (var i = 0; i < count; i++) {
    
    // fill.brighten(i * 2 / count)
    pieSeries2.colors.list.push(am4core.color(colores_disponibles[i]));
  }

  chart2.data = dataItem.dataContext.particion;
  pieSeries2.appear();

  var middleAngle = selectedSlice.middleAngle;
  var firstAngle = pieSeries.slices.getIndex(0).startAngle;
  var animation = pieSeries.animate([{ property: "startAngle", to: firstAngle - middleAngle }, { property: "endAngle", to: firstAngle - middleAngle + 360 }], 600, am4core.ease.sinOut);
  animation.events.on("animationprogress", updateLines);

  selectedSlice.events.on("transformed", updateLines);

//  var animation = chart2.animate({property:"dx", from:-container.pixelWidth / 2, to:0}, 2000, am4core.ease.elasticOut)
//  animation.events.on("animationprogress", updateLines)
}


function updateLines() {
  if (selectedSlice) {
    var p11 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle) };
    var p12 = { x: selectedSlice.radius * am4core.math.cos(selectedSlice.startAngle + selectedSlice.arc), y: selectedSlice.radius * am4core.math.sin(selectedSlice.startAngle + selectedSlice.arc) };

    p11 = am4core.utils.spritePointToSvg(p11, selectedSlice);
    p12 = am4core.utils.spritePointToSvg(p12, selectedSlice);

    var p21 = { x: 0, y: -pieSeries2.pixelRadius };
    var p22 = { x: 0, y: pieSeries2.pixelRadius };

    p21 = am4core.utils.spritePointToSvg(p21, pieSeries2);
    p22 = am4core.utils.spritePointToSvg(p22, pieSeries2);

    line1.x1 = p11.x;
    line1.x2 = p21.x;
    line1.y1 = p11.y;
    line1.y2 = p21.y;

    line2.x1 = p12.x;
    line2.x2 = p22.x;
    line2.y1 = p12.y;
    line2.y2 = p22.y;
  }
}


}); // end am4core.ready()