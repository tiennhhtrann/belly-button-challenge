function buildMetadata(sample){
    d3.json("samples.json").then((data) => {

        let metadata = data.metadata;
        // Filter the data for the objejct with the desired sample number
        let resultsArray = metadata.filter(sampleObject => sampleObject.id == sample);
        let result = resultsArray[0];
        // Use d3 to select the panel with id of #sample-metadata
        let PANEL = d3.select("#sample-metadata")
        // Use '.html("") to clear any existing metadata
        PANEL.html("");
        // Hint: Inside the loop, you will need to use d3 to append new
        // tags for each key-value in the metadata.
        Object.entries(result).forEach(([key, value]) => {
            PANEL.append("h6").text(`${key}:${value}`);
        });
    })
}
 // BONUS: Build the Gauge Chart ... give this a try if you have time. Otherwise don't add anything.

function buildCharts(sample){
    d3.json("samples.json").then((data) => {
 
    // put the data into a variable
    let samples = data.samples;
    // filter the data
    let resultArray = samples.filter(sampleObject => sampleObject.id == sample);
    let results = resultArray[0];
    // grab the first entry [0]

    let otu_ids = results.otu_ids;
    let otu_labels = results.otu_labels;
    let sample_values = results.sample_values;

    // Build a Bubble Chart
    // https://plotly.com/javascript/bubble-charts/
    let bubbleLayout = {
        title: "Top 10 Microbial Species in Belly Buttons",
        xaxis: {title: "OTU ID"},
        yaxis: {title: "Bacteria Sample Values"},
        showlegend: false,
        height: 900,
        width: 1200
    };

    let bubble_Data = [{
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                color: otu_ids,
                size: sample_values,
            }
        }];

    Plotly.newPlot("bubble", bubble_Data, bubbleLayout);
    
    // slice the data down to 10 items
    // you will probably want to reverse them to get them into desc order
    let yticks = otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse();
    // create trace
    let bar_data = [
        {
        y: otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`).reverse(),
        x: sample_values.slice(0,10).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"
        }
    ];

    // create layout (title is enough)
    let barLayout = {
        title: "Top 10 Bacteria Cultures Found",
        margin: {t: 30, 1: 150}
    };
    // draw your plot Plotly.newPlot())
    Plotly.newPlot("bar", bar_data, barLayout);
    });
}

function init(){
    // Use d3 to select the dropdown element ($selDataset)
    let selector = d3.select("#selDataset");
    // Use the list of sample names to populate the select options
    d3.json("samples.json").then((data) => {
    // loop through names from sample names
    // append option
        let sampleNames= data.names;
        sampleNames.forEach((sample)=> {
            selector
            .append("option")
            .text(sample)
            .property("value", sample);
        });
    // Use the first sample from the list to build the initial plots
    // run build charts
    // run build metadata
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
    });
}

function optionChanged(newSample){
    // Fetch new data each time a row sample is selected
    // Run build charts
    // run build metadata
    buildCharts(newSample);
    buildMetadata(newSample);
}

init();