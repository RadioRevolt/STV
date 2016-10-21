
var React = require("react");
var DateFields = require("./modules/dateFields.js").second;
var $ = require("jquery");
var DayShow = require("./modules/dayShows.js");

module.exports = React.createClass({
	getInitialState: function() {
		var today = new Date();
		return {
			day: 0,
			month: 0,
			year: 0,
			shows: [],
			url: "",
			elements: [],
			show: {},
			showSkipped: true
		}
	},

	toggelSkipped: function() {
		this.setState({
			showSkipped: !this.state.showSkipped
		});
	},

	updateDate: function(day, month, year) {
		console.log("Date updated kis: " + year + ":" + month + ":" + day);
		this.setState({
			day: day,
			month: month,
			year: year
		});

		var url = "http://pappagorg.radiorevolt.no/v1/sendinger/dato/" + year + "/" + month + "/" + day + "/studio/";
		this.setState({
			url: url
		});
		$.ajax({
			url: url,
			success: function(res) {
				this.setState({
					shows: res,
					elements: [],
					show: {}
				});
			}.bind(this),
			error: function(err) {
				console.log("Nå skjedde det en error kis.");
				console.log(err);
			}
		});
	},

	updateElements: function(id) {
		console.log("Update elements kis.");
		// console.log(this.state.url);
		this.setState({
			show: id
		});
		var startDate = new Date(id.starttime);
		var endDate = new Date(id.endtime);
		$.ajax({
			url: this.state.url + "/" + id.id,
			success: function(res) {
				var arr = [];
				var counter = 0;
				res.elements.map(function(item) {
					for (var a in arr) {
						if (arr[a].artist === item.artist && arr[a].title === item.title)
							return;
					}
					if (item.sendstate === "Skipped" && (item.class === "Live" || item.class === "None")) {
						item.fake_id = counter;
						arr.push(item);
						counter++;
					}
					else if (item.from_jinglebank || item.media_type !== "Audio" || item.class !== "Music" 
						|| startDate < item.actual_start || endDate < item.actual_stop) {

					} else {
						item.fake_id = counter;
						arr.push(item);
						counter++;
					}
				}.bind(this));
				if (!arr.length) {
					this.setState({
						elements: [{id:"mariuserenkuk", title:"Ingen elementer ble funnet."}]
					});
				} else {
					this.setState({
						elements: arr
					});
				}
			}.bind(this),
			error: function(err) {
				console.log(err);
				console.log("Enda en error kis.");
			}
		});
		// console.log(id);
	},

	getNiceTime: function(date, secs) {
		if (!date)
			return;
		date = new Date(date);
		var hours = date.getHours(), minutes = date.getMinutes();
		if (hours < 10)
			hours = "0" + hours;
		if (minutes < 10) 
			minutes = "0" + minutes;
		if (!secs)
			return hours + ":" + minutes;
		var seconds = date.getSeconds();
		if (seconds < 10)
			seconds = "0" + seconds;
		return hours + ":" + minutes + ":" + seconds
	},

	render: function() {
		return (
			<div>
				<div className="row">
					<div className="col-md-4">
						<h3>Dabtext Shows</h3>
						<DateFields callback={this.updateDate} />
						<div>
							Vis skippede elementer <input type="checkbox" checked={this.state.showSkipped} onChange={this.toggelSkipped} />
						</div>
						<h4>Programmer denne dagen</h4>
						<table className="table">
							<tbody>
								{
									this.state.shows.map(function(show) {
										return (
											<DayShow key={show.id} callback={this.updateElements} show={show} />
										);
									}.bind(this))
								}
							</tbody>
						</table>
					</div>
					<div className="col-md-8">
						<h3>{this.state.show.title}: {this.getNiceTime(this.state.show.starttime)} - {this.getNiceTime(this.state.show.endtime)}</h3>
						<table className="table">
							<tbody>
								{
									this.state.elements.map(function(elem) {
										if (!this.state.showSkipped && elem.sendstate === "Skipped") {
											return null;
										} 
										return (
											<tr key={elem.id}>
												<td>{elem.title}</td>
												<td>{elem.artist}</td>
												<td>{elem.album}</td>
												<td>{this.getNiceTime(elem.actual_start, true)}</td>
												<td>{this.getNiceTime(elem.actual_stop, true)}</td>
											</tr>
										)
									}.bind(this))
								}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
});
