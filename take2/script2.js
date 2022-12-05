// set the dimensions and margins of the graph
var margin = { top: 20, right: 30, bottom: 30, left: 60 },
  width = 450 - margin.left - margin.right,
  height = 300 - margin.top - margin.bottom;

// append the svg object to the body of the page
var svg_global = d3
  .select("#heatmap_global")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var svg_us = d3
  .select("#heatmap_us")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var agg_svg_us = d3
  .select("#aggregated_us")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 75)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
var agg_svg_global = d3
  .select("#aggregated_global")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom + 75)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// read data
d3.csv("sof_22_5000sample.csv").then((data) => {
  d3.json("sof_22_aggregated.json").then((agg_data) => {
    agg_data_global = agg_data.all_regions;
    agg_data_usa = agg_data.usa;
    agg_data_nonusa = agg_data.non_usa;
    console.log(data);

    var global = true;
    var overview = true;
    data_to_use = data;
    data_us = [];
    data.forEach((d) => {
      if (d.Country == "United States of America") data_us.push(d);
    });

    // Get max and min of data
    var xLim = [0, 50];
    var yLim = [0, 1112000];

    // some people only fill out workexp, while others only fill out yearscodepro
    var xAccessor = (d) => +Math.max(+d.WorkExp, +d.YearsCodePro);
    var yAccessor = (d) => +d.ConvertedCompYearly;

    // Add X axis
    var x = d3.scaleLinear().nice().domain(xLim).range([0, width]);
    svg_global
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));
    svg_us
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

    // Add Y axis
    var y = d3.scaleLinear().nice().domain(yLim).range([height, 0]);
    svg_global.append("g").call(d3.axisLeft(y));
    svg_us.append("g").call(d3.axisLeft(y));

    // Reformat the data: d3.rectbin() needs a specific format
    var ySize = 30000;
    var xSize = 1;
    var inputForRectBinning = [];
    var inputForRectBinning_us = [];
    data_to_use.forEach(function (d) {
      inputForRectBinning.push([
        +Math.max(+d.WorkExp, +d.YearsCodePro),
        +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
      ]); // Note that we had the transform value of X and Y !
    });
    data_us.forEach(function (d) {
      inputForRectBinning_us.push([
        +Math.max(+d.WorkExp, +d.YearsCodePro),
        +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
      ]); // Note that we had the transform value of X and Y !
    });

    // Compute the rectbin
    var rectbinData = d3.rectbin().dx(xSize).dy(ySize)(inputForRectBinning);
    var rectbinData_us = d3.rectbin().dx(xSize).dy(ySize)(
      inputForRectBinning_us
    );
    // Prepare a color palette
    var color = d3
      .scaleLinear()
      .domain([0, 12]) // Number of points in the bin?
      .range(["white", "#69a3b2"]);

    var color_barplot = d3
      .scaleOrdinal()
      .domain([
        "Remote",
        "Hybrid",
        "In-Person",
        "Men",
        " Women",
        "Other",
        "Independent Contributors",
        "People Managers",
      ])
      .range([
        "#D2B4DE",
        "#D2B4DE",
        "#D2B4DE",
        "#82E0AA",
        "#82E0AA",
        "#82E0AA",
        "#F8C471",
        "#F8C471",
      ]);
    var color_scatterplot = d3
      .scaleOrdinal()
      .domain(["Man", "Woman", ""])
      .range(["#0436D3", "#D30404", "#0436D3"]);

    // What is the height of a square in px?
    heightInPx = y(yLim[1] - ySize);

    // What is the width of a square in px?
    //   var widthInPx = x(xLim[0] + size);
    var widthInPx = 1000;

    var line_global = agg_svg_global
      .append("line")
      .style("stroke", "black")
      .style("opacity", 0);

    var clicky_global = function (e, i) {
      var y_agg_new = d3
        .scaleLinear()
        .domain([0, Math.max(+i.ConvertedCompYearly + 10000, 160000)])
        .range([height, 0]);

      var yAxis_new = d3.axisLeft(y_agg_new);
      agg_global_yaxis.transition().call(yAxis_new);

      line_global
        .style("opacity", 1)
        .attr("x1", 0)
        .attr("y1", y_agg_new(+i.ConvertedCompYearly))
        .attr("x2", width)
        .attr("y2", y_agg_new(+i.ConvertedCompYearly));

      if (global) {
        agg_svg_global
          .selectAll("rect")
          .data(agg_data_global)
          .transition() // .transition()
          .attr("x", function (d) {
            return x_agg(d.attribute);
          })
          .attr("y", function (d) {
            console.log(d);
            console.log(y_agg_new(d.median));

            return y_agg_new(d.median);
          })
          .attr("width", x_agg.bandwidth())
          .attr("height", function (d) {
            return height - y_agg_new(d.median);
          })
          .attr("fill", function (d) {
            switch (d.attribute) {
              case "Remote":
                if (i.RemoteWork == "Fully remote") return "#FE1C1C";
                else return "#D2B4DE";
                break;
              case "Hybrid":
                if (i.RemoteWork == "Hybrid (some remote, some in-person)")
                  return "#FE1C1C";
                else return "#D2B4DE";
                break;
              case "In-Person":
                if (i.RemoteWork == "Full in-person") return "#FE1C1C";
                else return "#D2B4DE";
                break;
              case "Men":
                if (i.Gender == "Man") return "#FE1C1C";
                else return "#82E0AA";
                break;
              case " Women":
                if (i.Gender == "Woman") return "#FE1C1C";
                else return "#82E0AA";
                break;
              case "Other":
                if (i.Gender !== "Woman" && i.Gender !== "Man")
                  return "#FE1C1C";
                else return "#82E0AA";
                break;
              case "Independent Contributors":
                if (i.ICorPM == "Independent contributor") return "#FE1C1C";
                else return "#F8C471";
                break;
              case "People Managers":
                if (i.ICorPM == "People manager") return "#FE1C1C";
                else return "#F8C471";
                break;
            }
          });
      } else {
        agg_svg_global
          .selectAll("rect")
          .data(agg_data_nonusa)
          .transition() // .transition()
          .attr("x", function (d) {
            return x_agg(d.attribute);
          })
          .attr("y", function (d) {
            console.log(d);
            console.log(y_agg_new(d.median));

            return y_agg_new(d.median);
          })
          .attr("width", x_agg.bandwidth())
          .attr("height", function (d) {
            return height - y_agg_new(d.median);
          })
          .attr("fill", function (d) {
            switch (d.attribute) {
              case "Remote":
                if (i.RemoteWork == "Fully remote") return "#FE1C1C";
                else return "#D2B4DE";
                break;
              case "Hybrid":
                if (i.RemoteWork == "Hybrid (some remote, some in-person)")
                  return "#FE1C1C";
                else return "#D2B4DE";
                break;
              case "In-Person":
                if (i.RemoteWork == "Full in-person") return "#FE1C1C";
                else return "#D2B4DE";
                break;
              case "Men":
                if (i.Gender == "Man") return "#FE1C1C";
                else return "#82E0AA";
                break;
              case " Women":
                if (i.Gender == "Woman") return "#FE1C1C";
                else return "#82E0AA";
                break;
              case "Other":
                if (i.Gender !== "Woman" && i.Gender !== "Man")
                  return "#FE1C1C";
                else return "#82E0AA";
                break;
              case "Independent Contributors":
                if (i.ICorPM == "Independent contributor") return "#FE1C1C";
                else return "#F8C471";
                break;
              case "People Managers":
                if (i.ICorPM == "People manager") return "#FE1C1C";
                else return "#F8C471";
                break;
            }
          });
      }
    };
    var line_usa = agg_svg_us
      .append("line")
      .style("stroke", "black")
      .style("opacity", 0);

    var clicky_usa = function (e, i) {
      var y_agg_new = d3
        .scaleLinear()
        .domain([0, Math.max(+i.ConvertedCompYearly + 10000, 160000)])
        .range([height, 0]);

      var yAxis_new = d3.axisLeft(y_agg_new);
      agg_us_yaxis.transition().call(yAxis_new);

      line_usa
        .style("opacity", 1)
        .attr("x1", 0)
        .attr("y1", y_agg_new(+i.ConvertedCompYearly))
        .attr("x2", width)
        .attr("y2", y_agg_new(+i.ConvertedCompYearly));

      agg_svg_us
        .selectAll("rect")
        .data(agg_data_usa)
        .transition() // .transition()
        .attr("x", function (d) {
          return x_agg(d.attribute);
        })
        .attr("y", function (d) {
          console.log(d);
          console.log(y_agg_new(d.median));

          return y_agg_new(d.median);
        })
        .attr("width", x_agg.bandwidth())
        .attr("height", function (d) {
          return height - y_agg_new(d.median);
        })
        .attr("fill", function (d) {
          switch (d.attribute) {
            case "Remote":
              if (i.RemoteWork == "Fully remote") return "#FE1C1C";
              else return "#D2B4DE";
              break;
            case "Hybrid":
              if (i.RemoteWork == "Hybrid (some remote, some in-person)")
                return "#FE1C1C";
              else return "#D2B4DE";
              break;
            case "In-Person":
              if (i.RemoteWork == "Full in-person") return "#FE1C1C";
              else return "#D2B4DE";
              break;
            case "Men":
              if (i.Gender == "Man") return "#FE1C1C";
              else return "#82E0AA";
              break;
            case " Women":
              if (i.Gender == "Woman") return "#FE1C1C";
              else return "#82E0AA";
              break;
            case "Other":
              if (i.Gender !== "Woman" && i.Gender !== "Man") return "#FE1C1C";
              else return "#82E0AA";
              break;
            case "Independent Contributors":
              if (i.ICorPM == "Independent contributor") return "#FE1C1C";
              else return "#F8C471";
              break;
            case "People Managers":
              if (i.ICorPM == "People manager") return "#FE1C1C";
              else return "#F8C471";
              break;
          }
        });
    };

    var tooltip = d3
      .select("#heatmap_global")
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
      d3.select(this).style("cursor", "pointer");
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
        .style("top", d3.pointer(e)[1] + 95 + "px");
    };

    var mouseleave = function (e, d) {
      tooltip
        .transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", reset_position);
      d3.select(this).style("cursor", "default");
    };

    var reset_position = function (e, d) {
      tooltip.style("left", 0 + "px").style("top", 0 + "px");
    };
    var reset_position_us = function (e, d) {
      tooltip_us.style("left", 0 + "px").style("top", 0 + "px");
    };
    var tooltip_us = d3
      .select("#heatmap_us")
      .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip_us")
      .style("background-color", "white")
      .style("position", "absolute")
      .style("border", "solid")
      .style("border-width", "1px")
      .style("border-radius", "5px")
      .style("padding", "10px");

    var mouseover_us = function (e, d) {
      tooltip_us.style("opacity", 1);
      d3.select(this).style("cursor", "pointer");
    };

    var mousemove_us = function (e, d) {
      tooltip_us
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
        .style("top", d3.pointer(e)[1] + 45 + height + 200 + "px");
    };

    var mouseleave_us = function (e, d) {
      tooltip_us
        .transition()
        .duration(200)
        .style("opacity", 0)
        .on("end", reset_position_us);
      d3.select(this).style("cursor", "default");
    };

    d3.select("#global_button").on("click", function () {
      global = true;
      d3.select("#us_button").style("background-color", "#e7e7e7");
      d3.select("#global_button").style("background-color", "gray");
      data_to_use = data;
      // svg_global.selectAll("rect").remove();
      svg_global.selectAll("circle").remove();
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
        svg_global
          .append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("height", height);
        svg_global
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
        svg_global
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
          .on("mouseleave", mouseleave)
          .on("click", clicky_global);
      }
      agg_svg_global
        .selectAll("rect")
        .data(agg_data_global)
        .transition() // .transition()
        .attr("x", function (d) {
          return x_agg(d.attribute);
        })
        .attr("y", function (d) {
          console.log(d);
          console.log(y_agg(d.median));

          return y_agg(d.median);
        })
        .attr("width", x_agg.bandwidth())
        .attr("height", function (d) {
          return height - y_agg(d.median);
        })
        .attr("fill", function (d) {
          return color_barplot(d.attribute);
        });
    });
    d3.select("#us_button").on("click", function () {
      global = false;
      d3.select("#global_button").style("background-color", "#e7e7e7");
      d3.select("#us_button").style("background-color", "gray");
      data_to_use = [];
      data.forEach((d) => {
        if (d.Country !== "United States of America") data_to_use.push(d);
      });

      // svg_global.selectAll("rect").remove();
      svg_global.selectAll("circle").remove();
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
        svg_global
          .append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("height", height);
        svg_global
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
        svg_global
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
          .on("mouseleave", mouseleave)
          .on("click", clicky_global);
      }
      agg_svg_global
        .selectAll("rect")
        .data(agg_data_nonusa)
        .transition() // .transition()
        .attr("x", function (d) {
          return x_agg(d.attribute);
        })
        .attr("y", function (d) {
          console.log(d);
          console.log(y_agg(d.median));

          return y_agg(d.median);
        })
        .attr("width", x_agg.bandwidth())
        .attr("height", function (d) {
          return height - y_agg(d.median);
        })
        .attr("fill", function (d) {
          return color_barplot(d.attribute);
        });
    });

    d3.select("#overview_button").on("click", function () {
      overview = true;
      d3.select("#detailed_button").style("background-color", "#e7e7e7");
      d3.select("#overview_button").style("background-color", "gray");

      if (!global) {
        data_to_use = [];
        data.forEach((d) => {
          if (d.Country !== "United States of America") data_to_use.push(d);
        });
      } else {
        data_to_use = data;
      }

      svg_global.selectAll("circle").remove();
      svg_us.selectAll("circle").remove();
      var inputForRectBinning = [];
      var inputForRectBinning_us = [];
      data_to_use.forEach(function (d) {
        inputForRectBinning.push([
          +Math.max(+d.WorkExp, +d.YearsCodePro),
          +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
        ]); // Note that we had the transform value of X and Y !
      });
      data_us.forEach(function (d) {
        inputForRectBinning_us.push([
          +Math.max(+d.WorkExp, +d.YearsCodePro),
          +(Math.floor(+d.ConvertedCompYearly / ySize) * ySize),
        ]); // Note that we had the transform value of X and Y !
      });

      // Compute the rectbin
      var rectbinData = d3.rectbin().dx(xSize).dy(ySize)(inputForRectBinning);
      var rectbinData_us = d3.rectbin().dx(xSize).dy(ySize)(
        inputForRectBinning_us
      );
      svg_global
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("height", height);
      svg_us
        .append("clipPath")
        .attr("id", "clip")
        .append("rect")
        .attr("height", height);
      svg_global
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
      svg_us
        .append("g")
        // .attr("clip-path", "url(#clip)")
        .selectAll("myRect")
        .data(rectbinData_us)
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
      svg_global.selectAll("rect").remove();
      svg_us.selectAll("rect").remove();

      if (!global) {
        data_to_use = [];
        data.forEach((d) => {
          if (d.Country !== "United States of America") data_to_use.push(d);
        });
      } else {
        data_to_use = data;
      }

      svg_global
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
        .on("mouseleave", mouseleave)
        .on("click", clicky_global);
      svg_us
        .append("g")
        .selectAll("circle")
        .data(data_us)
        .enter()
        .append("circle")
        .attr("cx", (d) => x(xAccessor(d)))
        .attr("cy", (d) => y(yAccessor(d)))
        .attr("fill", (d) => color_scatterplot(d.Gender))
        .attr("r", 3)
        .on("mouseover", mouseover_us)
        .on("mousemove", mousemove_us)
        .on("mouseleave", mouseleave_us)
        .on("click", clicky_usa);
    });

    // Now we can add the squares
    svg_global
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);
    svg_us
      .append("clipPath")
      .attr("id", "clip")
      .append("rect")
      .attr("width", width)
      .attr("height", height);
    svg_global
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
    svg_us
      .append("g")
      .attr("clip-path", "url(#clip)")
      .selectAll("myRect")
      .data(rectbinData_us)
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

    var x_agg = d3
      .scaleBand()
      .range([0, width])
      .domain(
        agg_data_global.map(function (d) {
          return d.attribute;
        })
      )
      .padding(0.2);
    var y_agg = d3.scaleLinear().domain([0, 160000]).range([height, 0]);
    agg_svg_us
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_agg))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    agg_svg_global
      .append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x_agg))
      .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end");
    agg_us_yaxis = agg_svg_us.append("g").call(d3.axisLeft(y_agg));
    agg_global_yaxis = agg_svg_global.append("g").call(d3.axisLeft(y_agg));
    agg_svg_global
      .selectAll("mybar")
      .data(agg_data_global)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x_agg(d.attribute);
      })
      .attr("y", function (d) {
        return y_agg(d.median);
      })
      .attr("width", x_agg.bandwidth())
      .attr("height", function (d) {
        return height - y_agg(d.median);
      })
      .attr("fill", function (d) {
        return color_barplot(d.attribute);
      });
    console.log(agg_data);
    agg_svg_us
      .selectAll("mybar")
      .data(agg_data_usa)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x_agg(d.attribute);
      })
      .attr("y", function (d) {
        return y_agg(d.median);
      })
      .attr("width", x_agg.bandwidth())
      .attr("height", function (d) {
        return height - y_agg(d.median);
      })
      .attr("fill", function (d) {
        return color_barplot(d.attribute);
      });
    console.log(agg_data);
  });
});
