document.addEventListener("DOMContentLoaded", function() {
    // Initialize table
    showTable('build', buildings);
    
    // Initialize chart with default settings
    drawGraph(buildings, {
        xAxis: "Страна",
        yValues: ["max"],
        chartType: "scatter"
    });
    
    // Toggle table button
    const toggleButton = document.getElementById("toggleTable");
    toggleButton.addEventListener("click", function() {
        if (toggleButton.textContent === "Скрыть таблицу") {
            hideTable('build');
            toggleButton.textContent = "Показать таблицу";
        } else {
            showTable('build', buildings);
            toggleButton.textContent = "Скрыть таблицу";
        }
    });
    
    // Build chart button
    const buildButton = document.getElementById("buildChart");
    buildButton.addEventListener("click", function() {
        const xAxis = document.querySelector('input[name="xAxis"]:checked').value;
        const yAxisChecks = document.querySelectorAll('input[name="yAxis"]:checked');
        const yValues = Array.from(yAxisChecks).map(check => check.value);
        const chartType = document.getElementById("chartType").value;
        
        drawGraph(buildings, {
            xAxis: xAxis,
            yValues: yValues,
            chartType: chartType
        });
    });
});