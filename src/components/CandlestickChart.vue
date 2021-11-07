<template>
  <div class="chart-container">
    <svg id="container" ref="chart"></svg>
  </div>
</template>

<script>
import * as d3 from "d3";
export default {
  props: {
    // Stock details.
    stockDetails: {
      type: Array,
      required: true,
    },
  },
  watch: {
    // Watch stockDetails to rerender chart.
    stockDetails(val) {
      if (val.length > 0) {
        this.createCandlestickChart();
      }
    },
  },
  methods: {
    /**
     * Create candlestick chart if stockDetails is not empty.
     */
    createCandlestickChart() {
      // Chart's ref.
      this.$refs.chart.innerHTML = "";
      // Stock details.
      const history = this.stockDetails;
      const wrap = this.wrap;
      d3.csv("").then(function (prices) {
        prices = history;

        // Change date format.
        var dateFormat = d3.timeParse("%Y-%m-%d");
        for (var i = 0; i < prices.length; i++) {
          prices[i]["timestamp"] = dateFormat(prices[i]["timestamp"]);
        }

        const margin = { top: 15, right: 65, bottom: 205, left: 50 },
          w = 1100 - margin.left - margin.right,
          h = 625 - margin.top - margin.bottom;

        // Create Svg.
        var svg = d3
          .select("#container")
          .attr("width", w + margin.left + margin.right)
          .attr("height", h + margin.top + margin.bottom)
          .append("g")
          .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        let dates = prices.map((price) => {
          return price["timestamp"];
        });

        var xmin = d3.min(prices.map((r) => new Date(r.Date).getTime()));
        var xmax = d3.max(prices.map((r) => new Date(r.Date).getTime()));
        var xScale = d3.scaleLinear().domain([-1, dates.length]).range([0, w]);
        var xDateScale = d3.scaleQuantize().domain([0, dates.length]).range(dates);
        let xBand = d3
          .scaleBand()
          .domain(d3.range(-1, dates.length))
          .range([0, w])
          .padding(0.3);
        var xAxis = d3.axisBottom().scale(xScale);

        svg
          .append("rect")
          .attr("id", "rect")
          .attr("width", w)
          .attr("height", h)
          .style("fill", "none")
          .style("pointer-events", "all")
          .attr("clip-path", "url(#clip)");

        var gX = svg
          .append("g")
          .attr("class", "axis x-axis") //Assign "axis" class
          .attr("transform", "translate(0," + h + ")")
          .call(xAxis);

        gX.selectAll(".tick text").call(wrap, xBand.bandwidth());

        var ymin = d3.min(prices.map((r) => r.low));
        var ymax = d3.max(prices.map((r) => r.high));
        var yScale = d3.scaleLinear().domain([ymin, ymax]).range([h, 0]).nice();
        var yAxis = d3.axisLeft().scale(yScale);

        let gY = svg.append("g").attr("class", "axis y-axis").call(yAxis);

        var chartBody = svg
          .append("g")
          .attr("class", "chartBody")
          .attr("clip-path", "url(#clip)");

        // draw rectangles
        let candles = chartBody
          .selectAll(".candle")
          .data(prices)
          .enter()
          .append("rect")
          .attr("x", (d, i) => xScale(i) - xBand.bandwidth())
          .attr("class", "candle")
          .attr("y", (d) => yScale(Math.max(d.open, d.close)))
          .attr("width", xBand.bandwidth())
          .attr("height", (d) =>
            d.open === d.close
              ? 1
              : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close)) >= 0
              ? yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
              : 0
          )
          .attr("fill", (d) =>
            d.open === d.close ? "silver" : d.open > d.close ? "red" : "green"
          );

        // draw high and low
        let stems = chartBody
          .selectAll("g.line")
          .data(prices)
          .enter()
          .append("line")
          .attr("class", "stem")
          .attr("x1", (d, i) => xScale(i) - xBand.bandwidth() / 2)
          .attr("x2", (d, i) => xScale(i) - xBand.bandwidth() / 2)
          .attr("y1", (d) => yScale(d.high))
          .attr("y2", (d) => yScale(d.low))
          .attr("stroke", (d) =>
            d.open === d.close ? "white" : d.open > d.close ? "red" : "green"
          );

        svg
          .append("defs")
          .append("clipPath")
          .attr("id", "clip")
          .append("rect")
          .attr("width", w)
          .attr("height", h);

        const extent = [
          [0, 0],
          [w, h],
        ];

        var resizeTimer;
        var zoom = d3
          .zoom()
          .scaleExtent([1, 100])
          .translateExtent(extent)
          .extent(extent)
          .on("zoom", zoomed)
          .on("zoom.end", zoomend);

        svg.call(zoom);

        function zoomed() {
          var t = d3.event.transform;
          let xScaleZ = t.rescaleX(xScale);
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])));
            xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])));
            let filtered = prices.filter(
              (d) => d.timestamp >= xmin && d.timestamp <= xmax
            );
            let minP = +d3.min(filtered, (d) => d.Low);
            let maxP = +d3.max(filtered, (d) => d.High);
            let buffer = Math.floor((maxP - minP) * 0.1);

            yScale.domain([minP - buffer, maxP + buffer]);
            candles
              .transition()
              .duration(800)
              .attr("y", (d) => yScale(Math.max(d.open, d.close)))
              .attr("height", (d) =>
                d.open === d.close
                  ? 1
                  : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
              );

            stems
              .transition()
              .duration(800)
              .attr("y1", (d) => yScale(d.high))
              .attr("y2", (d) => yScale(d.low));

            gY.transition().duration(800).call(d3.axisLeft().scale(yScale));
          }, 500);
        }

        function zoomend() {
          var t = d3.event.transform;
          let xScaleZ = t.rescaleX(xScale);
          clearTimeout(resizeTimer);
          resizeTimer = setTimeout(function () {
            xmin = new Date(xDateScale(Math.floor(xScaleZ.domain()[0])));
            let xmax = new Date(xDateScale(Math.floor(xScaleZ.domain()[1])));
            let filtered = prices.filter(
              (d) => d.timestamp >= xmin && d.timestamp <= xmax
            );
            let minP = +d3.min(filtered, (d) => d.low);
            let maxP = +d3.max(filtered, (d) => d.high);
            let buffer = Math.floor((maxP - minP) * 0.1);

            yScale.domain([minP - buffer, maxP + buffer]);
            candles
              .transition()
              .duration(800)
              .attr("y", (d) => yScale(Math.max(d.open, d.close)))
              .attr("height", (d) =>
                d.open === d.close
                  ? 1
                  : yScale(Math.min(d.open, d.close)) - yScale(Math.max(d.open, d.close))
              );

            stems
              .transition()
              .duration(800)
              .attr("y1", (d) => yScale(d.high))
              .attr("y2", (d) => yScale(d.low));

            gY.transition().duration(800).call(d3.axisLeft().scale(yScale));
          }, 500);
        }
      });
    },
    wrap(text, width) {
      text.each(function () {
        var text = d3.select(this),
          words = text.text().split(/\s+/).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text
            .text(null)
            .append("tspan")
            .attr("x", 0)
            .attr("y", y)
            .attr("dy", dy + "em");
        while ((word = words.pop())) {
          line.push(word);
          tspan.text(line.join(" "));
          if (tspan.node().getComputedTextLength() > width) {
            line.pop();
            tspan.text(line.join(" "));
            line = [word];
            tspan = text
              .append("tspan")
              .attr("x", 0)
              .attr("y", y)
              .attr("dy", ++lineNumber * lineHeight + dy + "em")
              .text(word);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.chart-container {
  overflow: auto;
}
</style>
