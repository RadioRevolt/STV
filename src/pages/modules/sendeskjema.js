
var React = require("react");
var $ = require("jquery");


module.exports = React.createClass({
	getInitialState: function() {
		
		// console.log(this.props.dateUrl);
		// this.text: "Laster inn data for programmet"
		return {
			elements: [],
			start: "",
			end: ""
		}
	},

	retrieveData: function(e) {
		if (e)
			e.preventDefault();
		var url = "http://pappagorg.radiorevolt.no/v1/sendinger/dato" + this.props.dateUrl + "/studio/";
		console.log(url);
		$.ajax({
			url: url,
			success: function(res) {
				// console.log(res);
				console.log("Pappagorg answered!");
				if (!res.length) {
					console.log("No shows found on this day.");
					this.setState({

					});
					return;
				}
				for (var i in res) {
					if (res[i].title === this.props.getLoadedShow()) {
						console.log("Found your program for this day: " + res[i].title);
						var startDate = new Date(res[i].starttime);
						var endDate = new Date(res[i].endtime);
						this.setState({
							start: res[i].starttime,
							end: res[i].endtime
						});
						$.ajax({
							url: url + res[i].id,
							success: function(res) {
								console.log("Loaded all elements from the show!");
								var arr = [];
								var counter = 0;
								res.elements.map(function(item) {
									for (var a in arr) {
										if (arr[a].artist === item.artist && arr[a].title === item.title)
											return;
									}
									if (item.from_jinglebank || item.media_type !== "Audio" || item.class !== "Music" 
										|| startDate < item.actual_start || endDate < item.actual_stop) {

									} else {
										item.fake_id = counter;
										arr.push(item);
										counter++;
									}
								}.bind(this));
								this.setState({
									elements: arr
								});
							}.bind(this),
							error: function(err) {
								console.log(err);
							}
						});
						break;
					}
				}
			}.bind(this),
			error: function(err) {
				console.log(err);
			}
		});
	},

	componentDidMount: function() {
		this.retrieveData();
	},

	render: function() {
		return (
			<div>
				<div>
					<p>Start time {this.state.start}</p>
					<p>End time {this.state.end}</p>
					<button onClick={this.retrieveData}>Last på nytt</button>
				</div>
				<table>
					<tbody>
						<th>Låt</th>
						<th>Artist</th>
						<th>Started</th>
						<th>Stoppet</th>
					{
						this.state.elements.map(function(item) {
							var start = new Date(item.actual_start);
							var end = new Date(item.actual_stop);

							// if (item.from_jinglebank || item.media_type !== "Audio" || item.class !== "Music" 
							// 	|| this.state.start < start || this.state.end < end) 
							// 	return (null);
							return (
								<tr key={item.fake_id}>
									<td>{item.title}</td>
									<td>{item.artist}</td>
									<td>{item.actual_start}</td>
									<td>{item.actual_stop}</td>
								</tr>
							);
						}.bind(this))
					}
					</tbody>
				</table>
			</div>
		);
	}
});


var Row = React.createClass({
	render: function() {
		return (
			<p>Hade</p>
		);
	}
});
