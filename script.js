// CHART INIT ------------------------------

    const margin = ({top: 20, right: 20, bottom: 20, left: 50}),
    width = 650 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

    const svg = d3.select(".chart").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
	    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    const xScale = d3
        .scaleBand()
        //.domain(data.map(d=>d.company))
        .rangeRound([0, width])
        .padding(0.1)
    var xAxis = svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .attr('class', 'axis x-axis');
        
    const yScale = d3
        .scaleLinear()
        //.domain([0, d3.max(data, function (d) {return d.stores})])
        .range([height, 0])
    var yAxis = svg.append("g")
        .attr('class', 'axis y-axis'); 

    var axes = svg.append("text")
        .attr("class", "y-axis-title")
        
        //.text("Stores")
    
    function id(d){
        return d;
    }

    let type = d3.select("#group-by").node().value;
    var direction = 'Descending';

// CHART UPDATES ---------------------------

function update(data,type){
    // Update scale domains
    xScale.domain(data.map(data=>data.company))
        
    yScale.domain([0, d3.max(data, function (d) {return d[type]})])
    
    // Implement the enter-update-exist sequence

    var bars = svg.selectAll('.bar')
        .data(data,id); 
    
    //bars.exit().transition().duration(500).remove()

    bars.enter().append('rect')
        .merge(bars)
        .transition()
        .delay((d, i) => i * 100)
        .duration(1000) 
        .ease(d3.easeLinear)
        .attr('class','bar')
        .attr("fill", "steelblue")
        .attr("x", function(d) { return xScale(d.company); })
        .attr("y", function(d) { return yScale(d[type]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[type])});
    
   //newbars
        //.merge()
    bars
        //.merge(bars)
        //.transition()
        //.delay((d, i) => i * 20)
        //.duration(1000) 
        .attr("x", function(d) { return xScale(d.company); })
        .attr("y", function(d) { return yScale(d[type]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[type])}); 

    bars.exit().remove()
    // Update axes and axis title
    xAxis.call(d3.axisBottom(xScale));
        
    yAxis.transition().duration(1000).call(d3.axisLeft(yScale)); 

    d3.selectAll(".y-axis-title")
        .attr('y', 5)
        .attr('dy', -10)
        .attr("text-anchor", "middle")
        .text(type.toUpperCase());

    
        }

    
  
// CHART UPDATES ---------------------------
d3.csv('coffee-house-chains.csv', d=>{
    return {
      ...d, // spread operator
      stores: +d.stores,
      revenue: +d.revenue
    }
  }).then(data=>{
    data.sort(function(a,b){
        return d3.descending(a[type],b[type]);
    });
    update(data,type);
    

    var eventHandler = function() {
        let type = String(d3.select('#group-by').node().value);
        console.log(type);
        data.sort(function(a,b){
            return d3.descending(a[type],b[type]);
        });
        update(data,type);
        direction = 'Descending';
    };

    var sortHandler = function(){
        let type = String(d3.select('#group-by').node().value);
        if (direction == 'Ascending' ){
            data.sort(function(a,b){
                return d3.descending(a[type],b[type]);
            });
            direction = 'Descending';
            update(data,type);
        }
        else{
            data.sort(function(a,b){
                return d3.ascending(a[type],b[type]);
            });
            direction = 'Ascending';
            update(data,type);
        }
        console.log(direction,type)
    };

    d3.select('#sort').node().addEventListener('click',sortHandler);
    d3.select('#group-by').node().addEventListener('change',eventHandler);
  })
;



