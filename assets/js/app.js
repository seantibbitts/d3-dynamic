// @TODO: YOUR CODE HERE!
var svgWidth = 960;
var svgHeight = 500;

var margin = {
  top: 20,
  right: 40,
  bottom: 80,
  left: 100
};

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create an SVG wrapper, append an SVG group that will hold our chart,
// and shift the latter by left and top margins.
var svg = d3
  .select("#scatter")
  .append("svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight);

// Append an SVG group
var chartGroup = svg.append("g")
  .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Initial Params
var chosenXAxis = "poverty";
var chosenYAxis = "obesity";

// function used for updating x-scale var upon click on axis label
function xScale(csv_data, chosenXAxis) {
  // create scales
  var xLinearScale = d3.scaleLinear()
    .domain([d3.min(csv_data, d => d[chosenXAxis]) * 0.8,
      d3.max(csv_data, d => d[chosenXAxis]) * 1.2
    ])
    .range([0, width]);

  return xLinearScale;

}

// function used for updating y-scale var upon click on axis label
function yScale(csv_data, chosenYAxis) {
    // create scales
    var yLinearScale = d3.scaleLinear()
      .domain([d3.max(csv_data, d => d[chosenYAxis]) * 1.2,
      d3.min(csv_data, d => d[chosenYAxis]) * 0.8
      ])
      .range([0, height]);
  
    return yLinearScale;
  
  }

// function used for updating xAxis var upon click on axis label
function renderAxesX(newXScale, xAxis) {
  var bottomAxis = d3.axisBottom(newXScale);

  xAxis.transition()
    .duration(1000)
    .call(bottomAxis);

  return xAxis;
}

// function used for updating xAxis var upon click on axis label
function renderAxesY(newYScale, yAxis) {
    var leftAxis = d3.axisLeft(newYScale);
  
    yAxis.transition()
      .duration(1000)
      .call(leftAxis);
  
    return yAxis;
  }

// function used for updating circles group with a transition to
// new circles
function renderCirclesX(circlesGroup, newXScale, chosenXaxis) {

  circlesGroup.transition()
    .duration(1000)
    .attr("cx", d => newXScale(d[chosenXAxis]));

  return circlesGroup;
}

function renderCirclesY(circlesGroup, newYScale, chosenYaxis) {

    circlesGroup.transition()
      .duration(1000)
      .attr("cy", d => newYScale(d[chosenYAxis]));
  
    return circlesGroup;
  }

function renderAbbrsX(textGroup, newXScale, chosenXAxis) {
    textGroup.transition()
      .duration(1000)
      .attr("x", d => newXScale(d[chosenXAxis]));

    return textGroup;
}

function renderAbbrsY(textGroup, newYScale, chosenYAxis) {
    textGroup.transition()
      .duration(1000)
      .attr("y", d => newYScale(d[chosenYAxis]));

    return textGroup;

}
// function used for updating circles group with new tooltip
function updateToolTip(chosenXAxis, chosenYAxis, circlesGroup) {

  if (chosenXAxis === "poverty") {
    var xlabel = "Poverty: ";
  }
  else if (chosenXAxis === "age") {
    var xlabel = "Age: "
  }
  else {
    var xlabel = "Household Income: ";
  };

  if (chosenYAxis === "obesity") {
      var ylabel = "Obesity: "
  }
  else if (chosenYAxis === "smokes") {
      var ylabel = "Smokes: "
  }
  else {
      var ylabel = "Lacks Healthcare: "
  }

  var toolTip = d3.tip()
    .attr("class", "d3-tip")
    .offset([80, -60])
    .html(function(d) {
      return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
    });

  circlesGroup.call(toolTip);

  circlesGroup.on("mouseover", function(data) {
    toolTip.show(data, this);
  })
    // onmouseout event
    .on("mouseout", function(data, index) {
      toolTip.hide(data);
    });

  return circlesGroup;
}

// function used for updating text group with new tooltip
function updateToolTipText(chosenXAxis, chosenYAxis, textGroup) {

    if (chosenXAxis === "poverty") {
      var xlabel = "Poverty: ";
    }
    else if (chosenXAxis === "age") {
      var xlabel = "Age: "
    }
    else {
      var xlabel = "Household Income: ";
    };
  
    if (chosenYAxis === "obesity") {
        var ylabel = "Obesity: "
    }
    else if (chosenYAxis === "smokes") {
        var ylabel = "Smokes: "
    }
    else {
        var ylabel = "Lacks Healthcare: "
    }
  
    var toolTip = d3.tip()
      .attr("class", "d3-tip")
      .offset([80, -60])
      .html(function(d) {
        return (`${d.state}<br>${xlabel} ${d[chosenXAxis]}<br>${ylabel} ${d[chosenYAxis]}`);
      });
  
    textGroup.call(toolTip);
  
    textGroup.on("mouseover", function(data) {
      toolTip.show(data, this);
    })
      // onmouseout event
      .on("mouseout", function(data, index) {
        toolTip.hide(data);
      });
  
    return textGroup;
  }

// Retrieve data from the CSV file and execute everything below
d3.csv("assets/data/data.csv").then(function(csv_data) {
    // if (err) throw err;
  
    // parse data
    csv_data.forEach(function(data) {
      data.poverty = +data.poverty;
      data.age = +data.age;
      data.income = +data.income;
      data.healthcare = +data.healthcare;
      data.healthcareLow = +data.healthcareLow;
      data.healthcareHigh = +data.healthcareHigh;
      data.obesity = +data.obesity;
      data.obesityLow = +data.obesityLow;
      data.obesityHigh = +data.obesityHigh;
      data.smokes = +data.smokes;
      data.smokesLow = +data.smokesLow;
      data.smokesHigh = +data.smokesHigh;
    });
  
    // xLinearScale function above csv import
    var xLinearScale = xScale(csv_data, chosenXAxis);
  
    // Create y scale function
    var yLinearScale = yScale(csv_data, chosenYAxis);
  
    // Create initial axis functions
    var bottomAxis = d3.axisBottom(xLinearScale);
    var leftAxis = d3.axisLeft(yLinearScale);
  
    // append x axis
    var xAxis = chartGroup.append("g")
      .classed("x-axis", true)
      .attr("transform", `translate(0, ${height})`)
      .call(bottomAxis);
  
    // append y axis
    var yAxis = chartGroup.append("g")
      .call(leftAxis);

    var canvas = chartGroup.append("g");

    // append initial circles
    var circlesGroup = canvas.selectAll("circle")
      .data(csv_data)
      .enter()
      .append("circle")
      .attr("cx", d => xLinearScale(d[chosenXAxis]))
      .attr("cy", d => yLinearScale(d[chosenYAxis]))
      .attr("r", 20)
      .classed("stateCircle", true);

    var textGroup = canvas.selectAll("text")
      .data(csv_data)
      .enter()
      .append("text")
      .attr("x", d => xLinearScale(d[chosenXAxis]))
      .attr("y", d => yLinearScale(d[chosenYAxis]))
      .attr("text-anchor","middle")
      .attr("dy",5)
      .classed("stateText", true)
      .text(d => d.abbr);
  
    // Create group for  2 x- axis labels
    var xlabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(${width / 2}, ${height + 20})`);
  
    var povertyLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "poverty") // value to grab for event listener
      .classed("active", true)
      .text("In Poverty (%)");
  
    var ageLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "age") // value to grab for event listener
      .classed("inactive", true)
      .text("Age (Median)");

    var incomeLabel = xlabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "income") // value to grab for event listener
      .classed("inactive", true)
      .text("Household Income (Median)")
  
    // append y axis
    var ylabelsGroup = chartGroup.append("g")
      .attr("transform", `translate(-100, ${height / 2}) rotate(-90)`)
      .attr("dy", "1em");

    var obeseLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 20)
      .attr("value", "obesity") // value to grab for event listener
      .classed("active", true)
      .text("Obese (%)")
    
    var smokesLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 40)
      .attr("value", "smokes") // value to grab for event listener
      .classed("inactive", true)
      .text("Smokes (%)")

    var healthcareLabel = ylabelsGroup.append("text")
      .attr("x", 0)
      .attr("y", 60)
      .attr("value", "healthcare") // value to grab for event listener
      .classed("inactive", true)
      .text("Lacks Healthcare (%)")
  
    // updateToolTip function above csv import
    var circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

    var textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);
  
    // x axis labels event listener
    xlabelsGroup.selectAll("text")
      .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenXAxis) {
  
          // replaces chosenXAxis with value
          chosenXAxis = value;
  
          // console.log(chosenXAxis)
  
          // functions here found above csv import
          // updates x scale for new data
          xLinearScale = xScale(csv_data, chosenXAxis);
  
          // updates x axis with transition
          xAxis = renderAxesX(xLinearScale, xAxis);
  
          // updates circles with new x values
          circlesGroup = renderCirclesX(circlesGroup, xLinearScale, chosenXAxis);

          // updates text with new x values
          textGroup = renderAbbrsX(textGroup, xLinearScale, chosenXAxis)
  
          // updates tooltips with new info
          circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

          textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);
  
          // changes classes to change bold text
          if (chosenXAxis === "age") {
            ageLabel
              .classed("active", true)
              .classed("inactive", false);
            povertyLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true)
          }
          else if (chosenXAxis === "income") {
              incomeLabel
                .classed("active", true)
                .classed("inactive", false)
              povertyLabel
                .classed("active", false)
                .classed("inactive", true)
              ageLabel
                .classed("active", false)
                .classed("inactive", true)
          }
          else {
            povertyLabel
              .classed("active", true)
              .classed("inactive", false);
            ageLabel
              .classed("active", false)
              .classed("inactive", true);
            incomeLabel
              .classed("active", false)
              .classed("inactive", true);
          }
        }
      });

        // y axis labels event listener
        ylabelsGroup.selectAll("text")
        .on("click", function() {
        // get value of selection
        var value = d3.select(this).attr("value");
        if (value !== chosenYAxis) {

            // replaces chosenXAxis with value
            chosenYAxis = value;

            // console.log(chosenYAxis)

            // functions here found above csv import
            // updates y scale for new data
            yLinearScale = yScale(csv_data, chosenYAxis);

            // updates x axis with transition
            yAxis = renderAxesY(yLinearScale, yAxis);

            // updates circles with new x values
            circlesGroup = renderCirclesY(circlesGroup, yLinearScale, chosenYAxis);

            // updates text with new y values
            textGroup = renderAbbrsY(textGroup, yLinearScale, chosenYAxis)

            // updates tooltips with new info
            circlesGroup = updateToolTip(chosenXAxis, chosenYAxis, circlesGroup);

            textGroup = updateToolTipText(chosenXAxis, chosenYAxis, textGroup);

            // changes classes to change bold text
            if (chosenYAxis === "smokes") {
            smokesLabel
                .classed("active", true)
                .classed("inactive", false);
            obeseLabel
                .classed("active", false)
                .classed("inactive", true);
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true)
            }
            else if (chosenYAxis === "healthcare") {
                healthcareLabel
                .classed("active", true)
                .classed("inactive", false)
                obeseLabel
                .classed("active", false)
                .classed("inactive", true)
                smokesLabel
                .classed("active", false)
                .classed("inactive", true)
            }
            else {
            obeseLabel
                .classed("active", true)
                .classed("inactive", false);
            smokesLabel
                .classed("active", false)
                .classed("inactive", true);
            healthcareLabel
                .classed("active", false)
                .classed("inactive", true);
            }
        }
        });

  });