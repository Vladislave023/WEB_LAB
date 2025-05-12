function showTable(idTable, data) {
    let table = d3.select("#" + idTable);
    
    // Clear existing content
    table.selectAll("*").remove();
    
    // Create header row
    let head = table
        .append("tr")
        .selectAll("th")
        .data(Object.keys(data[0]))
        .enter()
        .append("th")
        .text(d => d);
    
    // Create data rows
    let rows = table
        .selectAll("tr.data")
        .data(data)
        .enter()
        .append("tr")
        .attr("class", "data");
    
    // Create cells
    let cells = rows
        .selectAll("td")
        .data(d => Object.values(d))
        .enter()
        .append("td")
        .text(d => d);
}

function hideTable(idTable) {
    let table = d3.select("#" + idTable);
    table.selectAll("tr.data").remove();
}