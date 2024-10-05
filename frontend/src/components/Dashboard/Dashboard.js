
// import React, { useEffect, useState } from 'react';
// import * as d3 from 'd3';
// import './Dashboard.css'; // Assuming you create a separate CSS file for styling
// import WorldData from 'geojson-world-map';

// const Dashboard = () => {
//   const [data, setData] = useState([]);
//   const [sectors, setSectors] = useState([]);
//   const [selectedSector, setSelectedSector] = useState('');
//   const [relevances, setRelevances] = useState([]);
//   const [selectedRelevance, setSelectedRelevance] = useState('');
//   const [intensities, setIntensities] = useState([]);
//   const [selectedIntensity, setSelectedIntensity] = useState('');
//   const [filteredTitles, setFilteredTitles] = useState([]);
//   const [countries, setCountries] = useState([]);
//   const [selectedCountry, setSelectedCountry] = useState('');
//   const [countryData, setCountryData] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/api/data')
//       .then(response => response.json())
//       .then(data => {
//         setData(data);

//         // Get unique sectors
//         const uniqueSectors = Array.from(new Set(data.map(d => d.sector))).filter(d => d);
//         setSectors(uniqueSectors);

//         // Get unique relevances
//         const uniqueRelevances = Array.from(new Set(data.map(d => d.relevance))).filter(d => d);
//         setRelevances(uniqueRelevances);

//         // Get unique intensities
//         const uniqueIntensities = Array.from(new Set(data.map(d => d.intensity))).filter(d => d);
//         setIntensities(uniqueIntensities);

//         // Get unique countries
//         const uniqueCountries = Array.from(new Set(data.map(d => d.country))).filter(d => d);
//         setCountries(uniqueCountries);
//       });
//   }, []);

//   useEffect(() => {
//     if (data.length > 20 ) {
//       drawCharts(data);
//     }
//   }, [data,]);

//   useEffect(() => {
//     filterData();
//   }, [selectedSector, selectedRelevance, selectedIntensity, data]);

//   useEffect(() => {
//     if (selectedCountry) {
//       const filteredData = data.filter(d => d.country === selectedCountry);
//       setCountryData(filteredData);
//     } else {
//       setCountryData([]);
//     }
//   }, [selectedCountry, data]);

//   const filterData = () => {
//     let filteredData = data;

//     if (selectedSector) {
//       filteredData = filteredData.filter(d => d.sector === selectedSector);
//     }
//     if (selectedRelevance) {
//       filteredData = filteredData.filter(d => d.relevance === parseInt(selectedRelevance));
//     }
//     if (selectedIntensity) {
//       filteredData = filteredData.filter(d => d.intensity === parseInt(selectedIntensity));
//     }

//     setFilteredTitles(filteredData.map(d => d.title));
//   };

//   const drawCharts = (data) => {
//     d3.selectAll('svg > *').remove(); // Clear existing charts

//     const svgWidth = 600; // Adjusted width for each chart
//     const svgHeight = 400; // Adjusted height for each chart
//     const margin = { top: 20, right: 30, bottom: 90, left: 40 };

//     const groupedData = d3.rollups(data, v => ({
//       relevance: d3.sum(v, d => d.relevance),
//       likelihood: d3.sum(v, d => d.likelihood)
//     }), d => d.country).map(([key, value]) => ({ country: key, ...value }));

//     const intensityData = d3.rollups(data.filter(d => d.start_year), v => d3.sum(v, d => d.intensity), d => d.start_year)
//       .map(([key, value]) => ({ year: key, intensity: value }))
//       .sort((a, b) => a.year - b.year);

//     const relevanceData = d3.rollups(data.filter(d => d.start_year), v => d3.sum(v, d => d.relevance), d => d.start_year)
//       .map(([key, value]) => ({ year: key, relevance: value }))
//       .sort((a, b) => a.year - b.year);

//     const pestleData = d3.rollups(data, v => v.length, d => d.pestle)
//       .map(([key, value]) => ({ pestle: key, count: value }));

//     // Bar Chart
//     const barSvg = d3.select('#barChart')
//       .attr('width', svgWidth)
//       .attr('height', svgHeight);

//     const xBar = d3.scaleBand()
//       .domain(groupedData.map(d => d.country))
//       .range([margin.left, svgWidth - margin.right])
//       .padding(0.1);

//     const yBar = d3.scaleLinear()
//       .domain([0, d3.max(groupedData, d => d.relevance)]).nice()
//       .range([svgHeight - margin.bottom, margin.top]);

//     const xBarAxis = g => g
//       .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
//       .call(d3.axisBottom(xBar))
//       .selectAll('text')
//       .attr('transform', 'rotate(-50)')
//       .style('text-anchor', 'end');

//     const yBarAxis = g => g
//       .attr('transform', `translate(${margin.left},0)`)
//       .call(d3.axisLeft(yBar));

//     barSvg.append('g')
//       .selectAll('rect')
//       .data(groupedData)
//       .join('rect')
//       .attr('x', d => xBar(d.country))
//       .attr('y', d => yBar(d.relevance))
//       .attr('height', d => yBar(0) - yBar(d.relevance))
//       .attr('width', xBar.bandwidth());

//     barSvg.append('g')
//       .call(xBarAxis);

//     barSvg.append('g')
//       .call(yBarAxis);

//     // Line Chart
//     const lineSvg = d3.select('#lineChart')
//       .attr('width', svgWidth)
//       .attr('height', svgHeight);

//     const xLine = d3.scaleBand()
//       .domain(groupedData.map(d => d.country))
//       .range([margin.left, svgWidth - margin.right])
//       .padding(0.1);

//     const yLine = d3.scaleLinear()
//       .domain([0, d3.max(groupedData, d => d.likelihood)]).nice()
//       .range([svgHeight - margin.bottom, margin.top]);

//     const xLineAxis = g => g
//       .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
//       .call(d3.axisBottom(xLine))
//       .selectAll('text')
//       .attr('transform', 'rotate(-45)')
//       .style('text-anchor', 'end');

//     const yLineAxis = g => g
//       .attr('transform', `translate(${margin.left},0)`)
//       .call(d3.axisLeft(yLine));

//     const line = d3.line()
//       .x(d => xLine(d.country) + xLine.bandwidth() / 2)
//       .y(d => yLine(d.likelihood));

//     lineSvg.append('path')
//       .datum(groupedData)
//       .attr('fill', 'none')
//       .attr('stroke', 'steelblue')
//       .attr('stroke-width', 1.5)
//       .attr('d', line);

//     lineSvg.append('g')
//       .call(xLineAxis);

//     lineSvg.append('g')
//       .call(yLineAxis);

//     // Intensity Chart
//     const intensitySvg = d3.select('#intensityChart')
//       .attr('width', svgWidth)
//       .attr('height', svgHeight);

//     const xIntensity = d3.scaleBand()
//       .domain(intensityData.map(d => d.year))
//       .range([margin.left, svgWidth - margin.right])
//       .padding(0.1);

//     const yIntensity = d3.scaleLinear()
//       .domain([0, d3.max(intensityData, d => d.intensity)]).nice()
//       .range([svgHeight - margin.bottom, margin.top]);

//     const xIntensityAxis = g => g
//       .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
//       .call(d3.axisBottom(xIntensity).tickFormat(d3.format("d"))); // Format as integer

//     const yIntensityAxis = g => g
//       .attr('transform', `translate(${margin.left},0)`)
//       .call(d3.axisLeft(yIntensity));

//     const intensityLine = d3.line()
//       .x(d => xIntensity(d.year) + xIntensity.bandwidth() / 2)
//       .y(d => yIntensity(d.intensity));

//     intensitySvg.append('path')
//       .datum(intensityData)
//       .attr('fill', 'none')
//       .attr('stroke', 'red')
//       .attr('stroke-width', 1.5)
//       .attr('d', intensityLine);

//     intensitySvg.append('g')
//       .call(xIntensityAxis);

//     intensitySvg.append('g')
//       .call(yIntensityAxis);

//     // Relevance Chart
//     const relevanceSvg = d3.select('#relevanceChart')
//       .attr('width', svgWidth)
//       .attr('height', svgHeight);

//     const xRelevance = d3.scaleBand()
//       .domain(relevanceData.map(d => d.year))
//       .range([margin.left, svgWidth - margin.right])
//       .padding(0.1);

//     const yRelevance = d3.scaleLinear()
//       .domain([0, d3.max(relevanceData, d => d.relevance)]).nice()
//       .range([svgHeight - margin.bottom, margin.top]);

//     const xRelevanceAxis = g => g
//       .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
//       .call(d3.axisBottom(xRelevance).tickFormat(d3.format("d"))); // Format as integer

//     const yRelevanceAxis = g => g
//       .attr('transform', `translate(${margin.left},0)`)
//       .call(d3.axisLeft(yRelevance));

//     relevanceSvg.append('g')
//       .selectAll('rect')
//       .data(relevanceData)
//       .join('rect')
//       .attr('x', d => xRelevance(d.year))
//       .attr('y', d => yRelevance(d.relevance))
//       .attr('height', d => yRelevance(0) - yRelevance(d.relevance))
//       .attr('width', xRelevance.bandwidth());

//     relevanceSvg.append('g')
//       .call(xRelevanceAxis);

//     relevanceSvg.append('g')
//       .call(yRelevanceAxis);

    

//   const pieSvg = d3.select('#pieChart')
//   .attr('width', svgWidth)
//   .attr('height', svgHeight);

// const radius = Math.min(svgWidth, svgHeight) / 2 - margin.top;
// const labelRadius = radius- 25; // Increase the distance for labels

// const pie = d3.pie()
//   .value(d => d.count)(pestleData);

// const arc = d3.arc()
//   .innerRadius(0)
//   .outerRadius(radius);

// const outerArc = d3.arc()
//   .innerRadius(labelRadius)
//   .outerRadius(labelRadius);

// const color = d3.scaleOrdinal()
//   .domain(pestleData.map(d => d.pestle))
//   .range(d3.schemeCategory10);

// const pieGroup = pieSvg.append('g')
//   .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

// pieGroup.selectAll('path')
//   .data(pie)
//   .join('path')
//     .attr('d', arc)
//     .attr('fill', d => color(d.data.pestle))
//     .attr('stroke', 'white')
//     .attr('stroke-width', '2px');

// // Calculate label positions
// const labels = pie.map(d => {
//   const pos = outerArc.centroid(d);
//   const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
//   pos[0] = radius * 1.2 * (midangle < Math.PI ? 1 : -1);
//   return { data: d.data, pos: pos, midangle: midangle };
// });

// // Adjust labels to prevent overlap
// const adjustLabels = (labels) => {
//   const spacing = 5; // Minimum spacing between labels
//   for (let i = 0; i < labels.length - 1; i++) {
//     for (let j = i + 1; j < labels.length; j++) {
//       if (Math.abs(labels[i].pos[1] - labels[j].pos[1]) < spacing) {
//         if (labels[i].pos[1] > labels[j].pos[1]) {
//           labels[i].pos[1] += spacing / 2;
//           labels[j].pos[1] -= spacing / 2;
//         } else {
//           labels[i].pos[1] -= spacing / 2;
//           labels[j].pos[1] += spacing / 2;
//         }
//       }
//     }
//   }
// };

// adjustLabels(labels);

// // Add lines
// // pieGroup.selectAll('polyline')
// //   .data(labels)
// //   .join('polyline')
// //     .attr('stroke', 'black')
// //     .attr('stroke-width', 1)
// //     .attr('fill', 'none')
// //     .attr('points', d => {
// //       const posA = arc.centroid(d.data); // Line start position at slice
// //       const posB = outerArc.centroid(d.data); // Line end position at outer arc
// //       const posC = d.pos; // Position where text will be anchored
// //       return [posA, posB, posC];
// //     });
// pieGroup.selectAll('polyline')
//   .data(pie)
//   .join('polyline')
//     .attr('stroke', 'black')
//     .attr('stroke-width', 1)
//     .attr('fill', 'none')
//     .attr('points', d => {
//       const posA = arc.centroid(d); // Line start position at slice
//       const posB = outerArc.centroid(d); // Line end position at outer arc
//       const posC = outerArc.centroid(d); // Position where text will be anchored
//       const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
//       posC[0] = (radius+10) * 1.1 * (midangle < Math.PI ? 1 : -1); // Push label to the left or right
//       return [posA, posB, posC];
//     });

// // Add labels
// pieGroup.selectAll('text')
//   .data(labels)
//   .join('text')
//     .attr('transform', d => `translate(${d.pos})`)
//     .attr('text-anchor', d => d.midangle < Math.PI ? 'start' : 'end')
//     .attr('dy', '0.35em') // Adjust vertical alignment
//     .style('font-size', '9px') // Set font size
//     .style('font-family', 'Arial, sans-serif') // Set font family
//     .style('fill', 'black') // Set text color
//     .style('font-weight', 'bold') // Set font weight
//     .text(d => d.data.pestle);


//      // Draw World Map with Countries Marked
//      const mapSvg = d3.select('#mapChart')
//      .attr('width', svgWidth)
//      .attr('height', svgHeight);

//    const projection = d3.geoMercator()
//      .scale(150)
//      .translate([svgWidth / 2, svgHeight / 1.5]);

//    const path = d3.geoPath().projection(projection);

//    mapSvg.append('g')
//      .selectAll('path')
//      .data(WorldData.features)
//      .join('path')
//      .attr('d', path)
//      .attr('fill', '#ccc')
//      .attr('stroke', '#333');

//    mapSvg.append('g')
//      .selectAll('circle')
//      .data(groupedData)
//      .join('circle')
//      .attr('cx', d => {
//        const coords = projection([d.longitude, d.latitude]);
//        return coords ? coords[0] : null;
//      })
//      .attr('cy', d => {
//        const coords = projection([d.longitude, d.latitude]);
//        return coords ? coords[1] : null;
//      })
//      .attr('r', 5)
//      .attr('fill', 'red');
//   };
//   return (
//     <div className="dashboard">
//       <h1> Dashboard</h1>

//       <div className="charts-container">
//         <div>
//           <h3>PESTLE by total count</h3>
//           <svg id="pieChart"></svg>
//         </div>
//         <div>
//           <h3> Country by Data</h3>
//           <svg id="mapChart"></svg>
//           </div>
//           <div class="styled-div">
//             <h3>Total relevance by country</h3>
//             <svg id="barChart"></svg>
//           </div>
          
//           <div class="styled-div">
//             <h3>Total likelihood by country</h3>
//             <svg id="lineChart"></svg>
//           </div>
        
//         <div class="styled-div">
//           <h3>Total Intensity by year</h3>
//           <svg id="intensityChart"></svg>
//         </div>

//         <div class="styled-div">
//           <h3>Total relevance by year</h3>
//           <svg id="relevanceChart"></svg>
//         </div>
//       </div>
// <div>
//   <div className="sector-select">
//         <label htmlFor="sectorSelect">Select Sector:</label>
//         <select
//           id="sectorSelect"
//           value={selectedSector}
//           onChange={(e) => setSelectedSector(e.target.value)}
//         >
//           <option className="LabelBox" value="">All Sectors</option>
//           {sectors.map(sector => (
//             <option key={sector} value={sector}>{sector}</option>
//           ))}
//         </select>
//         <label htmlFor="relevanceSelect">Select Relevance:</label>
//         <select
//           id="relevanceSelect"
//           value={selectedRelevance}
//           onChange={(e) => setSelectedRelevance(e.target.value)}
//         >
//           <option value="">All Relevances</option>
//           {relevances.map(relevance => (
//             <option key={relevance} value={relevance}>{relevance}</option>
//           ))}
//         </select>

//         <label htmlFor="intensitySelect">Select Intensity:</label>
//         <select
//           id="intensitySelect"
//           value={selectedIntensity}
//           onChange={(e) => setSelectedIntensity(e.target.value)}
//         >
//           <option value="">All Intensities</option>
//           {intensities.map(intensity => (
//             <option key={intensity} value={intensity}>{intensity}</option>
//           ))}
//         </select>

//         <label htmlFor="countrySelect">Select Country:</label>
//         <select
//           id="countrySelect"
//           value={selectedCountry}
//           onChange={(e) => setSelectedCountry(e.target.value)}
//         >
//           <option value="">All Countries</option>
//           {countries.map(country => (
//             <option key={country} value={country}>{country}</option>
//           ))}
//         </select>
//       </div>

//       <div>
//         {filteredTitles.length > 0 && (
//           <ul>
//             {filteredTitles.map((title, index) => (
//               <li key={index}>{title}</li>
//             ))}
//           </ul>
//         )}
//       </div>

//       <div>
       
//       </div>

//       <div>
//         {filteredTitles.length > 0 && (
//           <ul>
//             {filteredTitles.map((title, index) => (
//               <li key={index}>{title}</li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {selectedCountry && (
//         <table>
//           <thead>
//             <tr>
//               <th>Title</th>
//               <th>Sector</th>
//               <th>Relevance</th>
//               <th>Intensity</th>
//               <th>Likelihood</th>
//               <th>Year</th>
//             </tr>
//           </thead>
//           <tbody>
//             {countryData.map((item, index) => (
//               <tr key={index}>
//                 <td>{item.title}</td>
//                 <td>{item.sector}</td>
//                 <td>{item.relevance}</td>
//                 <td>{item.intensity}</td>
//                 <td>{item.likelihood}</td>
//                 <td>{item.start_year}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from 'react';
import * as d3 from 'd3';
import './Dashboard.css'; // Assuming you create a separate CSS file for styling
import WorldData from 'geojson-world-map';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [selectedSector, setSelectedSector] = useState('');
  const [relevances, setRelevances] = useState([]);
  const [selectedRelevance, setSelectedRelevance] = useState('');
  const [intensities, setIntensities] = useState([]);
  const [selectedIntensity, setSelectedIntensity] = useState('');
  const [filteredTitles, setFilteredTitles] = useState([]);
  const [countries, setCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [countryData, setCountryData] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/data')
      .then(response => response.json())
      .then(data => {
        setData(data);

        // Get unique sectors
        const uniqueSectors = Array.from(new Set(data.map(d => d.sector))).filter(d => d);
        setSectors(uniqueSectors);

        // Get unique relevances
        const uniqueRelevances = Array.from(new Set(data.map(d => d.relevance))).filter(d => d);
        setRelevances(uniqueRelevances);

        // Get unique intensities
        const uniqueIntensities = Array.from(new Set(data.map(d => d.intensity))).filter(d => d);
        setIntensities(uniqueIntensities);

        // Get unique countries
        const uniqueCountries = Array.from(new Set(data.map(d => d.country))).filter(d => d);
        setCountries(uniqueCountries);
      });
  }, []);

  useEffect(() => {
    if (data.length > 20 ) {
      drawCharts(data);
    }
  }, [data,]);

  useEffect(() => {
    filterData();
  }, [selectedSector, selectedRelevance, selectedIntensity, data]);

  useEffect(() => {
    if (selectedCountry) {
      const filteredData = data.filter(d => d.country === selectedCountry);
      setCountryData(filteredData);
    } else {
      setCountryData([]);
    }
  }, [selectedCountry, data]);

  const filterData = () => {
    let filteredData = data;

    if (selectedSector) {
      filteredData = filteredData.filter(d => d.sector === selectedSector);
    }
    if (selectedRelevance) {
      filteredData = filteredData.filter(d => d.relevance === parseInt(selectedRelevance));
    }
    if (selectedIntensity) {
      filteredData = filteredData.filter(d => d.intensity === parseInt(selectedIntensity));
    }

    setFilteredTitles(filteredData.map(d => d.title));
  };

  const drawCharts = (data) => {
    d3.selectAll('svg > *').remove(); // Clear existing charts

    const svgWidth = 600; // Adjusted width for each chart
    const svgHeight = 400; // Adjusted height for each chart
    const margin = { top: 20, right: 30, bottom: 90, left: 40 };

    const groupedData = d3.rollups(data, v => ({
      relevance: d3.sum(v, d => d.relevance),
      likelihood: d3.sum(v, d => d.likelihood)
    }), d => d.country).map(([key, value]) => ({ country: key, ...value }));

    const intensityData = d3.rollups(data.filter(d => d.start_year), v => d3.sum(v, d => d.intensity), d => d.start_year)
      .map(([key, value]) => ({ year: key, intensity: value }))
      .sort((a, b) => a.year - b.year);

    const relevanceData = d3.rollups(data.filter(d => d.start_year), v => d3.sum(v, d => d.relevance), d => d.start_year)
      .map(([key, value]) => ({ year: key, relevance: value }))
      .sort((a, b) => a.year - b.year);

    const pestleData = d3.rollups(data, v => v.length, d => d.pestle)
      .map(([key, value]) => ({ pestle: key, count: value }));

    // Bar Chart
    const barSvg = d3.select('#barChart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xBar = d3.scaleBand()
      .domain(groupedData.map(d => d.country))
      .range([margin.left, svgWidth - margin.right])
      .padding(0.1);

    const yBar = d3.scaleLinear()
      .domain([0, d3.max(groupedData, d => d.relevance)]).nice()
      .range([svgHeight - margin.bottom, margin.top]);

    const xBarAxis = g => g
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(d3.axisBottom(xBar))
      .selectAll('text')
      .attr('transform', 'rotate(-50)')
      .style('text-anchor', 'end');

    const yBarAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yBar));

    barSvg.append('g')
      .selectAll('rect')
      .data(groupedData)
      .join('rect')
      .attr('x', d => xBar(d.country))
      .attr('y', d => yBar(d.relevance))
      .attr('height', d => yBar(0) - yBar(d.relevance))
      .attr('width', xBar.bandwidth());

    barSvg.append('g')
      .call(xBarAxis);

    barSvg.append('g')
      .call(yBarAxis);

    // Line Chart
    const lineSvg = d3.select('#lineChart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xLine = d3.scaleBand()
      .domain(groupedData.map(d => d.country))
      .range([margin.left, svgWidth - margin.right])
      .padding(0.1);

    const yLine = d3.scaleLinear()
      .domain([0, d3.max(groupedData, d => d.likelihood)]).nice()
      .range([svgHeight - margin.bottom, margin.top]);

    const xLineAxis = g => g
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(d3.axisBottom(xLine))
      .selectAll('text')
      .attr('transform', 'rotate(-45)')
      .style('text-anchor', 'end');

    const yLineAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yLine));

    const line = d3.line()
      .x(d => xLine(d.country) + xLine.bandwidth() / 2)
      .y(d => yLine(d.likelihood));

    lineSvg.append('path')
      .datum(groupedData)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    lineSvg.append('g')
      .call(xLineAxis);

    lineSvg.append('g')
      .call(yLineAxis);

    // Intensity Chart
    const intensitySvg = d3.select('#intensityChart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xIntensity = d3.scaleBand()
      .domain(intensityData.map(d => d.year))
      .range([margin.left, svgWidth - margin.right])
      .padding(0.1);

    const yIntensity = d3.scaleLinear()
      .domain([0, d3.max(intensityData, d => d.intensity)]).nice()
      .range([svgHeight - margin.bottom, margin.top]);

    const xIntensityAxis = g => g
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(d3.axisBottom(xIntensity).tickFormat(d3.format("d"))); // Format as integer

    const yIntensityAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yIntensity));

    const intensityLine = d3.line()
      .x(d => xIntensity(d.year) + xIntensity.bandwidth() / 2)
      .y(d => yIntensity(d.intensity));

    intensitySvg.append('path')
      .datum(intensityData)
      .attr('fill', 'none')
      .attr('stroke', 'red')
      .attr('stroke-width', 1.5)
      .attr('d', intensityLine);

    intensitySvg.append('g')
      .call(xIntensityAxis);

    intensitySvg.append('g')
      .call(yIntensityAxis);

    // Relevance Chart
    const relevanceSvg = d3.select('#relevanceChart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const xRelevance = d3.scaleBand()
      .domain(relevanceData.map(d => d.year))
      .range([margin.left, svgWidth - margin.right])
      .padding(0.1);

    const yRelevance = d3.scaleLinear()
      .domain([0, d3.max(relevanceData, d => d.relevance)]).nice()
      .range([svgHeight - margin.bottom, margin.top]);

    const xRelevanceAxis = g => g
      .attr('transform', `translate(0,${svgHeight - margin.bottom})`)
      .call(d3.axisBottom(xRelevance).tickFormat(d3.format("d"))); // Format as integer

    const yRelevanceAxis = g => g
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yRelevance));

    relevanceSvg.append('g')
      .selectAll('rect')
      .data(relevanceData)
      .join('rect')
      .attr('x', d => xRelevance(d.year))
      .attr('y', d => yRelevance(d.relevance))
      .attr('height', d => yRelevance(0) - yRelevance(d.relevance))
      .attr('width', xRelevance.bandwidth());

    relevanceSvg.append('g')
      .call(xRelevanceAxis);

    relevanceSvg.append('g')
      .call(yRelevanceAxis);

    const pieSvg = d3.select('#pieChart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const radius = Math.min(svgWidth, svgHeight) / 2 - margin.top;
    const labelRadius = radius - 25; // Increase the distance for labels

    const pie = d3.pie()
      .value(d => d.count)(pestleData);

    const arc = d3.arc()
      .innerRadius(0)
      .outerRadius(radius);

    const outerArc = d3.arc()
      .innerRadius(labelRadius)
      .outerRadius(labelRadius);

    const color = d3.scaleOrdinal()
      .domain(pestleData.map(d => d.pestle))
      .range(d3.schemeCategory10);

    const pieGroup = pieSvg.append('g')
      .attr('transform', `translate(${svgWidth / 2}, ${svgHeight / 2})`);

    pieGroup.selectAll('path')
      .data(pie)
      .join('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.pestle))
      .attr('stroke', 'white')
      .attr('stroke-width', '2px');

    // Calculate label positions
    const labels = pie.map(d => {
      const pos = outerArc.centroid(d);
      const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
      pos[0] = radius * 1.2 * (midangle < Math.PI ? 1 : -1);
      return { data: d.data, pos: pos, midangle: midangle };
    });

    // Adjust labels to prevent overlap
    const adjustLabels = (labels) => {
      const spacing = 5; // Minimum spacing between labels
      for (let i = 0; i < labels.length - 1; i++) {
        for (let j = i + 1; j < labels.length; j++) {
          if (Math.abs(labels[i].pos[1] - labels[j].pos[1]) < spacing) {
            if (labels[i].pos[1] > labels[j].pos[1]) {
              labels[i].pos[1] += spacing / 2;
              labels[j].pos[1] -= spacing / 2;
            } else {
              labels[i].pos[1] -= spacing / 2;
              labels[j].pos[1] += spacing / 2;
            }
          }
        }
      }
    };

    adjustLabels(labels);

    // Add lines
    pieGroup.selectAll('polyline')
      .data(pie)
      .join('polyline')
      .attr('stroke', 'black')
      .attr('stroke-width', 1)
      .attr('fill', 'none')
      .attr('points', d => {
        const posA = arc.centroid(d); // Line start position at slice
        const posB = outerArc.centroid(d); // Line end position at outer arc
        const posC = outerArc.centroid(d); // Position where text will be anchored
        const midangle = d.startAngle + (d.endAngle - d.startAngle) / 2;
        posC[0] = (radius + 10) * 1.1 * (midangle < Math.PI ? 1 : -1); // Push label to the left or right
        return [posA, posB, posC];
      });

    // Add labels
    pieGroup.selectAll('text')
      .data(labels)
      .join('text')
      .attr('transform', d => `translate(${d.pos})`)
      .attr('text-anchor', d => d.midangle < Math.PI ? 'start' : 'end')
      .attr('dy', '0.35em') // Adjust vertical alignment
      .style('font-size', '9px') // Set font size
      .style('font-family', 'Arial, sans-serif') // Set font family
      .style('fill', 'black') // Set text color
      .style('font-weight', 'bold') // Set font weight
      .text(d => d.data.pestle);

    // Draw World Map with Countries Marked
    const mapSvg = d3.select('#mapChart')
      .attr('width', svgWidth)
      .attr('height', svgHeight);

    const projection = d3.geoMercator()
      .scale(150)
      .translate([svgWidth / 2, svgHeight / 1.5]);

    const path = d3.geoPath().projection(projection);

    mapSvg.append('g')
      .selectAll('path')
      .data(WorldData.features)
      .join('path')
      .attr('d', path)
      .attr('fill', '#ccc')
      .attr('stroke', '#333');

    mapSvg.append('g')
      .selectAll('circle')
      .data(groupedData)
      .join('circle')
      .attr('cx', d => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[0] : null;
      })
      .attr('cy', d => {
        const coords = projection([d.longitude, d.latitude]);
        return coords ? coords[1] : null;
      })
      .attr('r', 5)
      .attr('fill', 'red');
  };

  return (
    <div className="dashboard">
      <h1> BLACK COFFER Dashboard </h1>

      <div className="charts-container">
        <div>
          <h3>PESTLE by total count</h3>
          <svg id="pieChart"></svg>
        </div>
        <div>
          <h3> Country by Data</h3>
          <svg id="mapChart"></svg>
          </div>
          <div class="styled-div">
            <h3>Total relevance by country</h3>
            <svg id="barChart"></svg>
          </div>
          
          <div class="styled-div">
            <h3>Total likelihood by country</h3>
            <svg id="lineChart"></svg>
          </div>
        
        <div class="styled-div">
          <h3>Total Intensity by year</h3>
          <svg id="intensityChart"></svg>
        </div>

        <div class="styled-div">
          <h3>Total relevance by year</h3>
          <svg id="relevanceChart"></svg>
        </div>
      </div>
<div>
  <div className="sector-select">
        <label htmlFor="sectorSelect">Select Sector:</label>
        <select
          id="sectorSelect"
          value={selectedSector}
          onChange={(e) => setSelectedSector(e.target.value)}
        >
          <option className="LabelBox" value="">All Sectors</option>
          {sectors.map(sector => (
            <option key={sector} value={sector}>{sector}</option>
          ))}
        </select>
        <label htmlFor="relevanceSelect">Select Relevance:</label>
        <select
          id="relevanceSelect"
          value={selectedRelevance}
          onChange={(e) => setSelectedRelevance(e.target.value)}
        >
          <option value="">All Relevances</option>
          {relevances.map(relevance => (
            <option key={relevance} value={relevance}>{relevance}</option>
          ))}
        </select>

        <label htmlFor="intensitySelect">Select Intensity:</label>
        <select
          id="intensitySelect"
          value={selectedIntensity}
          onChange={(e) => setSelectedIntensity(e.target.value)}
        >
          <option value="">All Intensities</option>
          {intensities.map(intensity => (
            <option key={intensity} value={intensity}>{intensity}</option>
          ))}
        </select>

        <label htmlFor="countrySelect">Select Country:</label>
        <select
          id="countrySelect"
          value={selectedCountry}
          onChange={(e) => setSelectedCountry(e.target.value)}
        >
          <option value="">All Countries</option>
          {countries.map(country => (
            <option key={country} value={country}>{country}</option>
          ))}
        </select>
      </div>

      <div>
        {filteredTitles.length > 0 && (
          <ul className="inline-list">
            {filteredTitles.map((title, index) => (
              <li key={index}>{title}</li>
            ))}
          </ul>
        )}
      </div>

      {selectedCountry && (
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Sector</th>
              <th>Relevance</th>
              <th>Intensity</th>
              <th>Likelihood</th>
              <th>Year</th>
            </tr>
          </thead>
          <tbody>
            {countryData.map((item, index) => (
              <tr key={index}>
                <td>{item.title}</td>
                <td>{item.sector}</td>
                <td>{item.relevance}</td>
                <td>{item.intensity}</td>
                <td>{item.likelihood}</td>
                <td>{item.start_year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      </div>
    </div>
  );
};

export default Dashboard;
