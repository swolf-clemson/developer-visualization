// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 30, left: 60 },
  width = 700 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg = d3
  .select("#heatmap")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv("sof_22_5000sample.csv").then((data) => {
  var global = true;
  var overview = true;
  data_to_use = data;

  // Get max and min of data
  var xLim = [0, 50];
  var yLim = [0, 1112000];
  var xAccessor = (d) => +Math.max(+d.WorkExp, +d.YearsCodePro);
  var yAccessor = (d) => +d.ConvertedCompYearly;

  // Add X axis
  var x = d3.scaleLinear().nice().domain(xLim).range([0, width]);
  svg
    .append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x));

  // Add Y axis
  var y = d3.scaleLinear().nice().domain(yLim).range([height, 0]);
  svg.append("g").call(d3.axisLeft(y));

  // Reformat the data: d3.rectbin() needs a specific format
  var ySize = 30000;
  var xSize = 1;
  var inputForRectBinning = [];
  data_to_use.forEach(function (d) {
    inputForRectBinning.push([
      +Math.max(+d.WorkExp, +d.YearsCodePro),
      +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
    ]); // Note that we had the transform value of X and Y !
  });

  // Compute the rectbin
  var rectbinData = d3.rectbin().dx(xSize).dy(ySize)(inputForRectBinning);
  // Prepare a color palette
  var color = d3
    .scaleLinear()
    .domain([0, 12]) // Number of points in the bin?
    .range(["white", "#69a3b2"]);

  var color_scatterplot = d3
    .scaleOrdinal()
    .domain(["Man", "Woman", ""])
    .range(["#0436D3", "#D30404", "#0436D3"]);

  // What is the height of a square in px?
  heightInPx = y(yLim[1] - ySize);

  // What is the width of a square in px?
  //   var widthInPx = x(xLim[0] + size);
  var widthInPx = 1000;

  var tooltip = d3
    .select("#heatmap")
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
      .style("left", d3.pointer(e)[0] + 10 + "px")
      .style("top", d3.pointer(e)[1] + 45 + "px");
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

  var mouseoverlog = function (e, d) {
    console.log("hello");
  };

  d3.select("#global_button").on("click", function () {
    global = true;
    d3.select("#us_button").style("background-color", "#e7e7e7");
    d3.select("#global_button").style("background-color", "gray");
    data_to_use = data;
    svg.selectAll("rect").remove();
    svg.selectAll("circle").remove();
    if (overview) {
      var inputForRectBinning = [];
      data_to_use.forEach(function (d) {
        inputForRectBinning.push([
          +Math.max(+d.WorkExp, +d.YearsCodePro),
          +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
        ]); // Note that we had the transform value of X and Y !
      });

      // Compute the rectbin
      var rectbinData = d3.rectbin().dx(xSize).dy(ySize)(inputForRectBinning);
      svg
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("height", height);
      svg
        .append("g")
        // .attr("clip-path", "url(#clip)")
        .selectAll("myRect")
        .data(rectbinData)
        .enter()
        .append("rect")
        .raise()
        .attr("x", function (d) {
          return x(d.x);
        })
        .attr("y", function (d) {
          return y(d.y) - heightInPx;
        })
        .attr("width", widthInPx)
        .attr("height", heightInPx)
        .attr("fill", function (d) {
          return color(d.length);
        });
    } else {
      svg
        .append("g")
        .selectAll("circle")
        .data(data_to_use)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(xAccessor(d)))
        .attr("cy", (d) => y(yAccessor(d)))
        .attr("fill", (d) => color_scatterplot(d.Gender))
        .attr("r", 3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  });
  d3.select("#us_button").on("click", function () {
    global = false;
    d3.select("#global_button").style("background-color", "#e7e7e7");
    d3.select("#us_button").style("background-color", "gray");
    data_to_use = [];
    data.forEach((d) => {
      if (d.Country == "United States of America") data_to_use.push(d);
    });

    svg.selectAll("rect").remove();
    svg.selectAll("circle").remove();
    if (overview) {
      var inputForRectBinning = [];
      data_to_use.forEach(function (d) {
        inputForRectBinning.push([
          +Math.max(+d.WorkExp, +d.YearsCodePro),
          +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
        ]); // Note that we had the transform value of X and Y !
      });

      // Compute the rectbin
      var rectbinData = d3.rectbin().dx(xSize).dy(ySize)(inputForRectBinning);
      svg
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("height", height);
      svg
        .append("g")
        // .attr("clip-path", "url(#clip)")
        .selectAll("myRect")
        .data(rectbinData)
        .enter()
        .append("rect")
        .raise()
        .attr("x", function (d) {
          return x(d.x);
        })
        .attr("y", function (d) {
          return y(d.y) - heightInPx;
        })
        .attr("width", widthInPx)
        .attr("height", heightInPx)
        .attr("fill", function (d) {
          return color(d.length);
        });
    } else {
      svg
        .append("g")
        .selectAll("circle")
        .data(data_to_use)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(xAccessor(d)))
        .attr("cy", (d) => y(yAccessor(d)))
        .attr("fill", (d) => color_scatterplot(d.Gender))
        .attr("r", 3)
        .on("mouseover", mouseover)
        .on("mousemove", mousemove)
        .on("mouseleave", mouseleave);
    }
  });

  d3.select("#overview_button").on("click", function () {
    overview = true;
    d3.select("#detailed_button").style("background-color", "#e7e7e7");
    d3.select("#overview_button").style("background-color", "gray");

    if (!global) {
      data_to_use = [];
      data.forEach((d) => {
        if (d.Country == "United States of America") data_to_use.push(d);
      });
    } else {
      data_to_use = data;
    }

    svg.selectAll("circle").remove();
    var inputForRectBinning = [];
    data_to_use.forEach(function (d) {
      inputForRectBinning.push([
        +Math.max(+d.WorkExp, +d.YearsCodePro),
        +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
      ]); // Note that we had the transform value of X and Y !
    });

    // Compute the rectbin
    var rectbinData = d3.rectbin().dx(xSize).dy(ySize)(inputForRectBinning);
    svg
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("height", height);
    svg
      .append("g")
      // .attr("clip-path", "url(#clip)")
      .selectAll("myRect")
      .data(rectbinData)
      .enter()
      .append("rect")
      .raise()
      .attr("x", function (d) {
        return x(d.x);
      })
      .attr("y", function (d) {
        return y(d.y) - heightInPx;
      })
      .attr("width", widthInPx)
      .attr("height", heightInPx)
      .attr("fill", function (d) {
        return color(d.length);
      });
  });
  d3.select("#detailed_button").on("click", function () {
    overview = false;
    d3.select("#overview_button").style("background-color", "#e7e7e7");
    d3.select("#detailed_button").style("background-color", "gray");
    svg.selectAll("rect").remove();

    if (!global) {
      data_to_use = [];
      data.forEach((d) => {
        if (d.Country == "United States of America") data_to_use.push(d);
      });
    } else {
      data_to_use = data;
    }

    svg
      .append("g")
      .selectAll("circle")
      .data(data_to_use)
      .enter()
      .append("circle")
      .attr("cx", (d) => x(xAccessor(d)))
      .attr("cy", (d) => y(yAccessor(d)))
      .attr("fill", (d) => color_scatterplot(d.Gender))
      .attr("r", 3)
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave);
  });

  // Now we can add the squares
  svg
    .append("clipPath")
    .attr("id", "clip")
    .append("rect")
    .attr("width", width)
    .attr("height", height);
  svg
    .append("g")
    .attr("clip-path", "url(#clip)")
    .selectAll("myRect")
    .data(rectbinData)
    .enter()
    .append("rect")
    .attr("x", function (d) {
      return x(d.x);
    })
    .attr("y", function (d) {
      return y(d.y) - heightInPx;
    })
    .attr("width", widthInPx)
    .attr("height", heightInPx)
    .attr("fill", function (d) {
      return color(d.length);
    });
  // .attr("stroke", "black")
  // .attr("stroke-width", "0.4")
});
