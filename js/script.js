const dataForm = d3.select('#dataForm');
/**
 * Set maximum values for date input fields.
 * start and end dates: maximum values -> today
 * end date: minimun value -> start date
 */
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, '0'); // January is 0
const day = String(today.getDate()).padStart(2, '0');
const todayString = `${year}-${month}-${day}`;

d3.select('#start_time').attr('max', todayString);
d3.select('#end_time').attr('max', todayString);
d3.select('#start_time').on('change', function() {
    d3.select('#end_time').attr('min', d3.select('#start_time').property('value'));
})
/**
 * On submit: save input values to variables and send API-request to Fingrid data endpoint.
 * Draw data with drawData-function.
 */
dataForm.on('submit', async function (event) {
    event.preventDefault();
    try{
        let start_time = d3.select('#start_time').property('value');
        let end_time = d3.select('#end_time').property('value');
        const id = d3.select('input[name="datasource"]:checked').property('value');
        const title = d3.select('input[name="datasource"]:checked').property('id');
        // Remove previous graph
        const wrapper = d3.select("#wrapper");
        wrapper.selectAll("*").remove();
        // Api request
        const apiURL = `https://api.fingrid.fi/v1/variable/${id}/events/csv?start_time=${start_time}T00:00:00Z&end_time=${end_time}T23:00:00Z` 
        const response = await d3.csv(apiURL)
        // Draw
        await drawData(title, response)
    } catch(e){
        d3.select('#error').text(e.message)
        setTimeout(()=> {
            d3.select('#error').text('')
        }, 4000)
        console.log(e.message)
    }
});
/**
 * Function to draw the electricity graph based on the data received by the Fingrid endpoint.
 * @param {string} title 
 * @param {Array.<Object>} dataset 
 */
async function drawData(title, dataset){
    const dateParser = d3.timeParse("%Y-%m-%dT%H:%M:%S+0000") 
    // access data for x- and y-axis:
    const xAccessor = d => dateParser(d.start_time)
    const yAccessor = d => parseFloat(d.value)

// Define dimensions
    let dimensions = {
        width: window.innerWidth * 0.9,
        height: 600,
        margins: {
            top: 15,
            right: 15,
            bottom: 40,
            left: 60
        }
    }
    // make new properties boundedWidth and boundedHeight to the dimensions-object by substracting the margins from the original dimensions
    dimensions.boundedWidth = dimensions.width - dimensions.margins.left - dimensions.margins.right
    dimensions.boundedHeight = dimensions.height - dimensions.margins.top - dimensions.margins.bottom

// Draw base-svg
    const wrapper = d3.select("#wrapper")
        .append("svg") // wrapper viittaa nyt html-koodin svg-tagiin
            .attr("height", dimensions.height)
            .attr("width", dimensions.width)
    // drawing area for data
    const boundingBox = wrapper.append("g") // uusi osa liitetään svg:hen (ei wrapperiin)
    // move drawing area by marginals
        .style("transform", `translate(
            ${dimensions.margins.left}px, 
            ${dimensions.margins.top}px)`)

// Define scaling (accoridng to min and max values and base dimensions)
    const maxYValue = d3.max(dataset, yAccessor);
    const minYValue = d3.min(dataset, yAccessor)
    const yScale = d3.scaleLinear()
        .domain([minYValue-1000, maxYValue+1000]) // Adjust the multiplier (1.1) to control the amount of extra space
        .range([dimensions.boundedHeight, 0]);
    const xScale = d3.scaleTime()
        .domain(d3.extent(dataset, xAccessor))
        .range([0, dimensions.boundedWidth])

// Draw data
    // draw the line graph
    const lineGenerator = d3.line()
        .x(d => xScale(xAccessor(d)))
        .y(d => yScale(yAccessor(d)))

    boundingBox.append("path")
        .attr("d", lineGenerator(dataset))
        .attr("stroke", "black")
        .attr("fill", "none")

// Draw axis and headings
    const yAxisGenerator = d3.axisLeft().scale(yScale)
    const yAxis = boundingBox
        .append("g")
        .call(yAxisGenerator)
    const xAxisGenerator = d3.axisBottom().scale(xScale) 
    // if less than 8 days: show day, month and time
    if(dataset.length < 24*8){ 
        xAxisGenerator.tickFormat(d3.timeFormat('%d.%b(%Hh)'));
    // if 6 months or more: show month and year
    }else if (dataset.length >= 24*25*6) { 
        xAxisGenerator.tickFormat(d3.timeFormat('%b %Y'));
    // if less than six months: show day and month
    } else { 
        xAxisGenerator.tickFormat(d3.timeFormat('%d.%b'));
    }
    const xAxis = boundingBox
        .append("g")
        .call(xAxisGenerator)
        .style("transform", `translateY(${dimensions.boundedHeight}px)`)

    const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margins.bottom -5)
    .text(title)
    .attr("fill", "black")
    .style("font-size", "14px")
    .style("padding", "24px")
    .style("font-family", "arial");
}

