d3.csv("sof_22_5000sample.csv").then(function (dataset) {
  male_dataset = [];
  female_dataset = [];
  dataset.forEach((d) => {
    if (d.Gender == "Man") {
      male_dataset.push(d);
    } else if (d.Gender == "Woman") {
      female_dataset.push(d);
    }
  });
  var dimensions = {
    width: 1000,
    height: 600,
    margin: {
      top: 10,
      bottom: 50,
      right: 10,
      left: 75,
    },
  };

  // var xAccessor = (d) => +Math.max(+d.WorkExp, +d.YearsCodePro);
  var xAccessor = (d) => +Math.max(+d.WorkExp, +d.YearsCodePro);
  var yAccessor = (d) => +d.ConvertedCompYearly;

  var svg = d3
    .select("#scatterplot")
    .append("svg")
    .style("width", dimensions.width)
    .style("height", dimensions.height);

  var xScale = d3
    .scaleLinear()
    .domain(d3.extent(male_dataset, xAccessor))
    .range([
      dimensions.margin.left,
      dimensions.width - dimensions.margin.right,
    ]);

  var yScale = d3
    .scaleLinear()
    .domain(d3.extent(male_dataset, yAccessor))
    .range([
      dimensions.height - dimensions.margin.bottom,
      dimensions.margin.top,
    ]);

  var color = d3
    .scaleOrdinal()
    .domain(["Independent contributor", "People manager", ""])
    .range(["#0436D3", "#D30404", "#0436D3"]);

  var tooltip = d3
    .select("#scatterplot")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("position", "absolute")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px");

  var mouseover = function (e, d) {
    tooltip.style("opacity", 1);
  };

  var mousemove = function (e, d) {
    tooltip
      .html(
        "<div>Years of Experience: " +
          Math.max(+d.WorkExp, +d.YearsCodePro) +
          "</div>" +
          "<div>Compensation: " +
          d.ConvertedCompYearly +
          "</div>" +
          "<div>Position: " +
          d.ICorPM +
          "</div>" +
          "<div>Age: " +
          d.Age +
          "</div>" +
          "<div>Gender: " +
          d.Gender +
          "</div>" +
          "<div>Work Type: " +
          d.RemoteWork
      )
      .style("left", d3.pointer(e)[0] + 20 + "px")
      .style("top", d3.pointer(e)[1] + "px");
  };

  var mouseleave = function (e, d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
      .on("end", reset_position);
  };

  var reset_position = function (e, d) {
    tooltip.style("left", 0 + "px").style("top", 0 + "px");
  };

  var dots = svg
    .append("g")
    .selectAll("circle")
    .data(male_dataset)
    .enter()
    .append("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 2)
    .attr("fill", (d) => color(d.ICorPM))
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave);

  var xAxisGen = d3.axisBottom().scale(xScale);
  var xAxis = svg
    .append("g")
    .call(xAxisGen)
    .style(
      "transform",
      `translateY(${dimensions.height - dimensions.margin.bottom}px)`
    );

  var yAxisGen = d3.axisLeft().scale(yScale);
  var yAxis = svg
    .append("g")
    .call(yAxisGen)
    .style("transform", `translateX(${dimensions.margin.left}px)`);

  svg
    .append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", dimensions.width / 1.5)
    .attr("y", dimensions.height - 12)
    .text("Work Experience");
  svg
    .append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("y", 2)
    .attr("x", -dimensions.height / 3)
    .attr("dy", ".75em")
    .attr("transform", "rotate(-90)")
    .text("Compensation");
});
