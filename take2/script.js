// d3.csv("sof_22_98percentile.csv").then(function (data) {
//   console.log(data);

//   var region = "global";

//   document.getElementById(
//     "title"
//   ).innerHTML = `Visualization for ${nameSelected}`;

//   var size = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9]);

//   var dimensions = {
//     width: size,
//     height: size / 3,
//     margin: {
//       top: 10,
//       right: 10,
//       bottom: 50,
//       left: 50,
//     },
//   };

//   var svg = d3
//     .select("#barchart")
//     .style("width", dimensions.width)
//     .style("height", dimensions.height);

//   dimensions.boundedWidth =
//     dimensions.width - dimensions.margin.right - dimensions.margin.left;
//   dimensions.boundedHeight =
//     dimensions.height - dimensions.margin.top - dimensions.margin.bottom;

//   var xScale = d3
//     .scaleBand()
//     .domain(
//       data.map(function (d) {
//         return d.year;
//       })
//     )
//     .range([0, dimensions.boundedWidth])
//     .padding(0.2);

//   var yScale = d3
//     .scaleLinear()
//     .domain([
//       0,
//       d3.max(
//         data.map(function (d) {
//           return d["Betty"];
//         }),
//         (s) => +s
//       ),
//     ])
//     .range([dimensions.boundedHeight, 0]);

//   var bounds = svg
//     .append("g")
//     .style(
//       "transform",
//       `translate(${dimensions.margin.left}px, ${dimensions.margin.top}px)`
//     );

//   var text = svg
//     .append("text")
//     .attr("id", "topbartext")
//     .attr("x", size - 200)
//     .attr("y", 20)
//     .attr("dx", "-.8em")
//     .attr("dy", ".15em")
//     .attr("font-family", "sans-serif")
//     .text("");

//   var bars = bounds
//     .selectAll("bar")
//     .data(data)
//     .enter()
//     .append("rect")
//     .attr("x", function (d) {
//       return xScale(d.year);
//     })
//     .attr("width", xScale.bandwidth)
//     .attr("y", function (d) {
//       return yScale(d["Betty"]);
//     })
//     .attr("height", function (d) {
//       return dimensions.boundedHeight - yScale(d["Betty"]);
//     })
//     .attr("fill", "steelblue")
//     .on("mouseover", function (d, i) {
//       d3.select(this).attr("stroke", "black");
//       text.transition().text(`Count for ${i["year"]}: ${i[nameSelected]}`);
//     })
//     .on("mouseout", function (d, i) {
//       d3.select(this).attr("stroke", "transparent");
//       text.transition().text("");
//     });

//   var xAxis = d3
//     .axisBottom(xScale)
//     .tickValues(
//       xScale.domain().filter(function (d, i) {
//         return !(i % 4);
//       })
//     )
//     .tickSizeOuter(0);

//   svg
//     .append("g")
//     .attr(
//       "transform",
//       "translate(" +
//         dimensions.margin.left +
//         "," +
//         (dimensions.boundedHeight + dimensions.margin.bottom / 4) +
//         ")"
//     )
//     .call(xAxis)
//     .selectAll("text")
//     .style("text-anchor", "end")
//     .attr("dx", "-.8em")
//     .attr("dy", ".15em")
//     .attr("transform", "rotate(-65)");

//   var yAxis = d3.axisLeft(yScale);

//   var changing_axis = svg
//     .append("g")
//     .attr(
//       "transform",
//       "translate(" + dimensions.margin.left + "," + dimensions.margin.top + ")"
//     )
//     .call(yAxis);

//   d3.select("#global").on("click", function () {
//     region = "global";

//     //   document.getElementById(
//     //     "title"
//     //   ).innerHTML = `Visualization for ${region}`;

//     yScale = d3
//       .scaleLinear()
//       .domain([
//         0,
//         d3.max(
//           data.map(function (d) {
//             return d["Betty"];
//           }),
//           (s) => +s
//         ),
//       ])
//       .range([dimensions.boundedHeight, 0]);

//     yAxis = d3.axisLeft(yScale);
//     changing_axis.transition().call(yAxis);

//     bars
//       .transition()
//       .attr("x", function (d) {
//         return xScale(d.year);
//       })
//       .attr("width", xScale.bandwidth)
//       .attr("y", function (d) {
//         return yScale(d[nameSelected]);
//       })
//       .attr("height", function (d) {
//         return dimensions.boundedHeight - yScale(d[nameSelected]);
//       })
//       .style("fill", "steelblue");
//   });

//   d3.select("#usa").on("click", function () {
//     region = "usa";

//     // document.getElementById(
//     //   "title"
//     // ).innerHTML = `Visualization for ${nameSelected}`;

//     yScale = d3
//       .scaleLinear()
//       .domain([
//         0,
//         d3.max(
//           data.map(function (d) {
//             return d["Linda"];
//           }),
//           (s) => +s
//         ),
//       ])
//       .range([dimensions.boundedHeight, 0]);

//     yAxis = d3.axisLeft(yScale);
//     changing_axis.transition().call(yAxis);

//     bars
//       .transition()
//       .attr("x", function (d) {
//         return xScale(d.year);
//       })
//       .attr("width", xScale.bandwidth)
//       .attr("y", function (d) {
//         return yScale(d[nameSelected]);
//       })
//       .attr("height", function (d) {
//         return dimensions.boundedHeight - yScale(d[nameSelected]);
//       })
//       .style("fill", "steelblue");
//   });
// });

d3.csv("sof_22_98percentile.csv").then(function (dataset) {
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

  console.log(dataset);

  var xAccessor = (d) => Math.max(+d.WorkExp, +d.YearsCodePro);
  var yAccessor = (d) => +d.ConvertedCompYearly;

  var svg = d3
    .select("#scatterplot")
    .append("svg")
    .style("width", dimensions.width)
    .style("height", dimensions.height);

  var xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor))
    .range([
      dimensions.margin.left,
      dimensions.width - dimensions.margin.right,
    ]);

  var yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor))
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
    .style("text-align", "center")
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
    .data(dataset)
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
