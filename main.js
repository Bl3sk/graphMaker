document.getElementById("dateFrom").value = "2021-02-26"
document.getElementById("dateTo").value = "2023-02-02"
function handleSubmit() {
	const dateFrom = document.getElementById("dateFrom").value
	const dateTo = document.getElementById("dateTo").value
	console.log(dateFrom, new Date(dateFrom))
	
	const data = document.getElementById("dataTextArea").value
	const dataArr = data.split('\n');
	
	const fromTime = new Date(dateFrom).getTime()
	const toTime = new Date(dateTo).getTime()
	const filteredData = dataArr.filter(line => {
		const day = line.slice(8, 10)
		const month = line.slice(11, 13)
		const year = line.slice(14, 18)
		const lineTime = new Date(`${year}-${month}-${day}`).getTime()
		console.log(new Date(`${year}-${month}-${day}`).getTime())
		return lineTime >= fromTime && lineTime <= toTime;
	});	
	
	const timeData = filteredData.map(line => {
	  const parts = line.split(';');
	  return {dates: parts[1], times: parts[2]}
	});
	timeData.splice(-1)
	
	const humidity = filteredData.map(line => {
	  let firstCommaIndex = line.indexOf(',');
	  let secondCommaIndex = line.indexOf(',', firstCommaIndex + 1);
	  line = line.substr(0, secondCommaIndex) + '.' + line.substr(secondCommaIndex + 1);
	  const parts = line.split(';')
	  return parts[4];
	});
	
	const temperature = filteredData.map(line => {
	  line = line.replace(",", ".");
	  const parts = line.split(';')
	  return parts[3];
	});
	showGraph(timeData, humidity, temperature)	
} 

function showGraph(timeData, humidity, temperature) {
	const showHumidity = document.getElementById("humidityCheckbox").checked
	const showTemperature = document.getElementById("temperatureCheckbox").checked
	
	const dateAndTime = timeData.map(value => {
		return value.dates.slice(0, 6) + " " +  value.times.slice(0, 5)
	});
	
	var xValues = dateAndTime;
	const humidityData = { 
		  label: 'Vlhkost',
		  data: humidity,
		  borderColor: "blue",
		  fill: false
		}
	const temperatureData = { 
		  label: 'Teplota',
		  data: temperature,
		  borderColor: "red",
		  fill: true
		}

	const data = [];
	if (showHumidity) data.push(humidityData)
	if (showTemperature) data.push(temperatureData)

	const chart = new Chart("myChart", {
	  type: "line",
	  data: {
		labels: xValues,
		datasets: data
	  },
	  options: {
		legend: {display: true},
		maintainAspectRatio: true,
		responsive: true
	  }
	});
	chart.render();
} 

