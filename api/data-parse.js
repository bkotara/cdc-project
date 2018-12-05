const csv = require("fast-csv");

function parse_csv(filepath) {
	return new Promise((res, rej) => {
		var output = {};
		var measures_index = 0;
		var measures = {};
		var locations_index = 0;
		var locations = {};
		csv
			.fromPath(filepath, {
				headers: true,
				objectMode: true
			})
			.on("data", row => {
				var parsed_row = handle_row(row);
				var temp_measure = parsed_row["measure"];
				var city = parsed_row["city"];
				var state = parsed_row["state"];
				var temp_location = (city !== "" ? city + ", " : "") + state;
				if(typeof measures[temp_measure] === "undefined") {
					measures[temp_measure] = measures_index;
					measures_index += 1;
				}

				if(typeof locations[temp_location] === "undefined") {
					locations[temp_location] = locations_index;
					locations_index += 1;
				}
				
				var measure_key = measures[temp_measure];
				var location_key = locations[temp_location];
				if(typeof output[measure_key] === "undefined") {
					output[measure_key] = {};
				}

				var population = parsed_row["population"];
				if(typeof output[measure_key][location_key] === "undefined") {
					output[measure_key][location_key] = {
						"affected": parsed_row["value"] * population,
						"population": population
					};
					return;
				}
				output[measure_key][location_key]["affected"] += parsed_row["value"] * population;
				output[measure_key][location_key]["population"] += population;
			})
			.on("end", () => {
				// Round all totaled affected values
				Object.keys(output).forEach(mes => {
					Object.keys(output[mes]).forEach(cs => {
						output[mes][cs]["affected"] = parseInt(output[mes][cs]["affected"]+ 0.5);
					});
				});

				res({
					data: output,
					measures: measures,
					locations: locations
				});
			})
			.on("error", error => {
				rej(error);
			});
	});
}

function get_location_key(city, state) {
	return (city !== "" ? city.toLowerCase().replace(/\s+/g, '') + "-" : "") + state.toLowerCase();
}

function handle_row(data) {
	var measure = data["Measure"];
	var state = data["StateAbbr"];
	var city = data["CityName"];
	var year = data["Year"];
	var value = parseFloat(data["Data_Value"]);
	var population = data["PopulationCount"];
	return {
		measure: ((year < "2016") ? (year + " ") : "") + measure,
		state: state,
		city: city,
		value: Number.isNaN(value) ? 0.0 : value / 100.0,
		population: parseInt(population)
	};
}

module.exports = {
	parse_csv: parse_csv
}