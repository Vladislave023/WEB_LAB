function createArrGraph(data, key) {
    let groupObj = d3.group(data, d => d[key]);
    let arrGraph = [];
    for (let [label, entries] of groupObj) {
        let minMax = d3.extent(entries.map(d => d['Высота']));
        arrGraph.push({ labelx: label, values: minMax });
    }
    // Sort by labelx if key is Год (to display years in ascending order)
    if (key === "Год") {
        arrGraph.sort((a, b) => a.labelx - b.labelx);
    }
    return arrGraph;
}

function createAxis(svg, data, attr_area, keyx) {
    // Find extent of values for Y-axis
    let allValues = data.flatMap(d => d.values);
    let [min, max] = d3.extent(allValues);
    
    // Define scales
    let scaleX;
    if (keyx === "Год") {
        scaleX = d3.scaleLinear()
            .domain(d3.extent(data.map(d => +d.labelx)))
            .range([0, attr_area.width - 2 * attr_area.marginx]);
    } else {
        scaleX = d3.scaleBand()
            .domain(data.map(d => d.labelx))
            .range([0, attr_area.width - 2 * attr_area.marginx])
            .padding(0.1);
    }
    
    let scaleY = d3.scaleLinear()
        .domain([min * 0.85, max * 1.1])
        .range([attr_area.height - 2 * attr_area.marginy, 0]);
    
    // Create axes
    let axisX = keyx === "Год" ? d3.axisBottom(scaleX).tickFormat(d3.format("d")) : d3.axisBottom(scaleX);
    let axisY = d3.axisLeft(scaleY);
    
    // Remove existing axes
    svg.selectAll("g.axis").remove();
    
    // Draw X-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${attr_area.marginx}, ${attr_area.height - attr_area.marginy})`)
        .call(axisX)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", ".15em")
        .attr("transform", "rotate(-45)");
    
    // Draw Y-axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", `translate(${attr_area.marginx}, ${attr_area.marginy})`)
        .call(axisY);
    
    return [scaleX, scaleY];
}

function createScatter(svg, data, scaleX, scaleY, attr_area, yValues, color) {
    const r = 4;
    let points = [];
    
    data.forEach(d => {
        if (yValues.includes("min")) {
            points.push({ labelx: d.labelx, value: d.values[0], type: "min" });
        }
        if (yValues.includes("max")) {
            points.push({ labelx: d.labelx, value: d.values[1], type: "max" });
        }
    });
    
    svg.selectAll(".dot")
        .data(points)
        .enter()
        .append("circle")
        .attr("class", "dot")
        .attr("r", r)
        .attr("cx", d => scaleX(d.labelx) + (scaleX.bandwidth ? scaleX.bandwidth() / 2 : 0))
        .attr("cy", d => scaleY(d.value))
        .attr("transform", `translate(${attr_area.marginx}, ${attr_area.marginy})`)
        .style("fill", d => d.type === "min" ? "blue" : color);
}

function createHistogram(svg, data, scaleX, scaleY, attr_area, yValues, color) {
    let bars = [];
    
    data.forEach(d => {
        if (yValues.includes("min")) {
            bars.push({ labelx: d.labelx, value: d.values[0], type: "min" });
        }
        if (yValues.includes("max")) {
            bars.push({ labelx: d.labelx, value: d.values[1], type: "max" });
        }
    });
    
    svg.selectAll(".bar")
        .data(bars)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .attr("x", d => scaleX(d.labelx) + (scaleX.bandwidth ? scaleX.bandwidth() / 4 : 0))
        .attr("y", d => scaleY(d.value))
        .attr("width", scaleX.bandwidth ? scaleX.bandwidth() / 2 : 10)
        .attr("height", d => (attr_area.height - 2 * attr_area.marginy) - scaleY(d.value))
        .attr("transform", `translate(${attr_area.marginx}, ${attr_area.marginy})`)
        .style("fill", d => d.type === "min" ? "blue" : color);
}

function drawGraph(data, settings) {
    const keyx = settings.xAxis;
    const yValues = settings.yValues;
    const chartType = settings.chartType;
    
    if (yValues.length === 0) {
        alert("Ошибка: Выберите хотя бы одно значение по оси OY (Минимальная или Максимальная высота).");
        return;
    }
    
    const arrGraph = createArrGraph(data, keyx);
    let svg = d3.select("svg");
    svg.selectAll("*").remove();
    
    const attr_area = {
        width: parseFloat(svg.style('width')),
        height: parseFloat(svg.style('height')),
        marginx: 50,
        marginy: 50
    };
    
    const [scx, scy] = createAxis(svg, arrGraph, attr_area, keyx);
    
    if (chartType === "scatter") {
        createScatter(svg, arrGraph, scx, scy, attr_area, yValues, "red");
    } else {
        createHistogram(svg, arrGraph, scx, scy, attr_area, yValues, "red");
    }
}