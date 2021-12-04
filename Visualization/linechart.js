function LineChart(file_path) {
    // set the dimensions and margins of the graph
    var margin = {top: 80, right: 100, bottom: 50, left: 100},
    width = 1200 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
    
    
    // append the svg object to the body of the page
    var svg = d3.select("#myFeatureGraph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg
      .append('text')
      .text('Musical Features Trend (1980-2020)')
      .attr('id', 'title-a')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${margin.left + width / 2}, -50)`)
      .style('font-size', '24px');

    var svg2 = d3.select("#myMlGraph")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");

    svg2
      .append('text')
      .text('ML Model Analysis (1980-2020)')
      .attr('id', 'title-b')
      .attr('text-anchor', 'middle')
      .attr('transform', `translate(${margin.left + width / 2}, -50)`)
      .style('font-size', '24px');


    // legend setup
    var legend2 = svg2
      .append('g')
      .attr('id', 'legend-b')
      .attr('width', 50)
      .attr('height', 100)
      .attr('transform', `translate(${width}, 0)`);

    
    //Read the data
    //var file_path = "static/linechart_data_normalized.csv";
    d3.csv(file_path, function(data) {
    
        // List of groups (here I have one group per column)
        var featureGroup = ['danceability','energy','key','loudness','mode','speechiness','acousticness',
            'instrumentalness','liveness','valence','tempo','duration_ms']

        var mlGroup = ['accuracy','recall','precision']


        var dataReady = mlGroup.map( function(grpName) { // .map allows to do something for each element of the list
          return {
            name: grpName,
            values: data.map(function(d) {
              return {year: d.year, value: +d[grpName]};
            })
          };
        });
    
        // add the options to the button
        d3.select("#selectButton")
          .selectAll('myOptions')
             .data(featureGroup)
          .enter()
            .append('option')
          .text(function (d) { return d; }) // text showed in the menu
          .attr("value", function (d) { return d; }) // corresponding value returned by the button
    
        // A color scale: one color for each group
        var myColor = d3.scaleOrdinal()
          .domain(featureGroup)
          .range(d3.schemeSet2);

        var myColor2 = d3.scaleOrdinal()
          .domain(mlGroup)
          .range(d3.schemeSet1);
    
        // Add X axis --> it is a date format
        var x = d3.scaleLinear()
          .domain([1980,2021])
          .range([ 0, width ]);
        const xAxis = d3.axisBottom(x)
          .tickFormat(d3.format(""));

        svg.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

        var x2 = d3.scaleLinear()
          .domain([1980,2021])
          .range([ 0, width ]);
        const xAxis2 = d3.axisBottom(x2)
          .tickFormat(d3.format(""));

        svg2.append("g")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis2);
    

        // Add Y axis
        var y = d3.scaleLinear()
          .domain([0,100])
          .range([ height, 0 ]);
        svg.append("g")
          .call(d3.axisLeft(y));

        var y2 = d3.scaleLinear()
          .domain([0,100])
          .range([ height, 0 ]);
        svg2.append("g")
          .call(d3.axisLeft(y2));



        // Initialize line with group a
        var line = svg
          .append('g')
          .append("path")
            .datum(data)
            .attr("d", d3.line()
              .x(function(d) { return x(+d.year) })
              .y(function(d) { return y(+d.danceability) })
            )
            .attr("stroke", function(d){ return myColor("danceability") })
            .style("stroke-width", 4)
            .style("fill", "none")

            // Add the points
        var circle = svg
          .selectAll("circle")
          .data(data)

        circle.exit().remove()

        circle
          .enter()
          .append("circle")
            .attr("cx", function(d) { return x(+d.year) } )
            .attr("cy", function(d) { return y(+d.danceability) } )
            .attr("r", 0)
            .transition()
            .duration(1000)
            .attr("r", 5)
            .attr("fill", function(d){ return myColor("danceability") })


        /*****************************************Second Graph******************************************/
        var line2 = svg2
          .append('g')
          .append("path")
            .datum(data)
            .attr("d", d3.line()
              .x(function(d) { return x(+d.year) })
              .y(function(d) { return y(+d.accuracy) })
            )
            .attr("stroke", function(d){ return myColor2("accuracy") })
            //.attr("stroke", "red")
            .style("stroke-width", 2)
            .style("fill", "none")

        var line3 = svg2
          .append('g')
          .append("path")
            .datum(data)
            .attr("d", d3.line()
              .x(function(d) { return x(+d.year) })
              .y(function(d) { return y(+d.recall) })
            )
            .attr("stroke", function(d){ return myColor2("recall") })
            //.attr("stroke", "blue")
            .style("stroke-width", 2)
            .style("fill", "none")

        var line4 = svg2
          .append('g')
          .append("path")
            .datum(data)
            .attr("d", d3.line()
              .x(function(d) { return x(+d.year) })
              .y(function(d) { return y(+d.precision) })
            )
            .attr("stroke", function(d){ return myColor2("precision") })
            //.attr("stroke", "orange")
            .style("stroke-width", 2)
            .style("fill", "none")

        // circles
        svg2
          .selectAll("circle")
          .data(dataReady)
          .enter()
            .append('g')
            .style("fill", function(d){ return myColor2(d.name) })
          // Second we need to enter in the 'values' part of this group
          .selectAll("circle")
          .data(function(d){ return d.values })
          .enter()
          .append("circle")
            .attr("cx", function(d) { return x(d.year) } )
            .attr("cy", function(d) { return y(d.value) } )
            .attr("r", 3)

        // legend
        svg2.append("circle").attr("cx",width).attr("cy",30).attr("r", 4).style("fill", d3.schemeSet1[0])
        svg2.append("circle").attr("cx",width).attr("cy",60).attr("r", 4).style("fill", d3.schemeSet1[1])
        svg2.append("circle").attr("cx",width).attr("cy",90).attr("r", 4).style("fill", d3.schemeSet1[2])
        svg2.append("text").attr("x", width+5).attr("y", 30).text("Accuracy").style("font-size", "15px").attr("alignment-baseline","middle")
        svg2.append("text").attr("x", width+5).attr("y", 60).text("Recall").style("font-size", "15px").attr("alignment-baseline","middle")
        svg2.append("text").attr("x", width+5).attr("y", 90).text("Precision").style("font-size", "15px").attr("alignment-baseline","middle")


        /***********************************************************************************/

    
        // A function that update the chart
        function update(selectedGroup) {
    
          // Give these new data to update line
          line
              .transition()
              .duration(1000)
              .attr("d", d3.line()
                .x(function(d) { return x(+d.year) })
                .y(function(d) { 
                  if (selectedGroup == 'danceability') return y(+d.danceability)
                  else if (selectedGroup == 'energy') return y(+d.energy)
                  else if (selectedGroup == 'key') return y(+d.key)
                  else if (selectedGroup == 'loudness') return y(+d.loudness)
                  else if (selectedGroup == 'mode') return y(+d.mode)
                  else if (selectedGroup == 'speechiness') return y(+d.speechiness)
                  else if (selectedGroup == 'acousticness') return y(+d.acousticness)
                  else if (selectedGroup == 'instrumentalness') return y(+d.instrumentalness)
                  else if (selectedGroup == 'liveness') return y(+d.liveness)
                  else if (selectedGroup == 'valence') return y(+d.valence)
                  else if (selectedGroup == 'tempo') return y(+d.tempo)
                  else if (selectedGroup == 'duration_ms') return y(+d.duration_ms)
                })
              )
              .attr("stroke", function(d){ return myColor(selectedGroup) })

          // Remove circle
          svg.selectAll('circle')
            .attr("r", 5)
            .transition()
            .duration(1000)
            .attr("r", 0)
            .remove()

          circle
            .enter()
            .append("circle")
              .attr("cx", function(d) { return x(+d.year) } )
              .attr("cy", function(d) { 
                if (selectedGroup == 'danceability') return y(+d.danceability)
                  else if (selectedGroup == 'energy') return y(+d.energy)
                  else if (selectedGroup == 'key') return y(+d.key)
                  else if (selectedGroup == 'loudness') return y(+d.loudness)
                  else if (selectedGroup == 'mode') return y(+d.mode)
                  else if (selectedGroup == 'speechiness') return y(+d.speechiness)
                  else if (selectedGroup == 'acousticness') return y(+d.acousticness)
                  else if (selectedGroup == 'instrumentalness') return y(+d.instrumentalness)
                  else if (selectedGroup == 'liveness') return y(+d.liveness)
                  else if (selectedGroup == 'valence') return y(+d.valence)
                  else if (selectedGroup == 'tempo') return y(+d.tempo)
                  else if (selectedGroup == 'duration_ms') return y(+d.duration_ms)
              })
              .attr("r", 0)
              .transition()
              .duration(1000)
              .attr("r", 5)
              .attr("fill", function(d){ return myColor(selectedGroup) })
        }
    
        // When the button is changed, run the updateChart function
        d3.select("#selectButton").on("change", function(d) {
  

            // recover the option that has been chosen
            var selectedOption = d3.select(this).property("value")
            console.log(selectedOption)
            // run the updateChart function with this selected option
            update(selectedOption)
        })
    
    })
}