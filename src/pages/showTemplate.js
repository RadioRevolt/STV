
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
			showSkipped: false,
			showAudio: false,
			showMusic: true,
			showJingles: false
		}
	},

	toggelSkipped: function() {
		this.setState({
			showSkipped: !this.state.showSkipped
		});
	},

	toggleShowAudio: function() {
		this.setState({
			showAudio: !this.state.showAudio
		});
	},

	toggleMusic: function() {
		this.setState({
			showMusic: !this.state.showMusic
		});
	},

	toggleJingles: function() {
		this.setState({
			showJingles: !this.state.showJingles
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
			show: id,
			elements: [{fake_id:"Lolas", title:"Laster inn sendeskjemaet"}]
		});
		var startDate = new Date(id.starttime);
		var endDate = new Date(id.endtime);
		$.ajax({
			url: this.state.url + "/" + id.id,
			success: function(res) {
				var arr = [];
				var counter = 0;
				var foundLast = false
				res.elements.map(function(item) {
					if (foundLast)
						return;

					if (endDate <= new Date(item.actual_stop)){
						foundLast = true;
					}
					// for (var a in arr) {
					// 	// console.log("ARR: artist " + arr[a].artist + ", title: " + arr[a].title);
					// 	// console.log("Item: artist " + item.artist + ", title: " + item.title);
					// 	if (item.artist === "Hawkon") {
					// 		console.log("Denne skal være true:");
					// 		console.log("Arr: " + arr[a].artist + "   " + arr[a].artist.length);
					// 		console.log("Item: " + item.artist + "  " + item.artist.length);
					// 		console.log(arr[a].artist === item.artist && arr[a].title === item.title);
					// 	}
					// 	if (arr[a].artist === item.artist && arr[a].title === item.title)
					// 		return;
					// 	if (arr[a].id === item.id) {
					// 		item.id = item.id + "errorId";
					// 		break;
					// 	}
					// }
					if (item.sendstate === "Skipped" && (item.class === "Live" || item.class === "None")) {
						item.fake_id = counter;
						arr.push(item);
						counter++;
					}
					else if (item.from_jinglebank || item.media_type !== "Audio" 
						|| (item.class !== "Music" && item.class !== "Audio" && item.class !== "Promotion") 
						|| startDate > new Date(item.actual_start)) {
						//do nothing
					} else {
						item.fake_id = counter;
						arr.push(item);
						counter++;
						// console.log(item);
					}
				}.bind(this));

				var newArr = []

				for (var i in arr) {
					var found = false;
					for (var j in newArr) {
						if (arr[i].artist === newArr[j].artist && newArr[j].title === arr[i].title && arr[i].class === "Music" 
							|| (arr[i].class === "None" && arr[i].actual_start === newArr[j].actual_start)
							|| ((arr[i].class === "Audio" || arr[i].class === "Promotion") && arr[i].title === newArr[j].title)
							){
							found = true;
							break;
						}
					}
					if (!found) {
						newArr.push(arr[i]);
					}
				}

				if (this.state.show.id !== res.metadata.id) {
					console.log("The program was changed, aborting.");
					return;
				}

				if (!newArr.length) {
					this.setState({
						elements: [{fake_id:"mariuserenkuk", title:"Ingen elementer ble funnet."}]
					});
				} else {
					this.setState({
						elements: newArr
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
		var musicToggleRow = this.state.showMusic ? "song-row" : "";
		var skippedToggleRow = this.state.showSkipped ? "skipped-row": "";
		var audioToggleRow = this.state.showAudio ? "audio-row": "";
		var jingleToggleRow = this.state.showJingles ? "jingle-row": "";
		return (
			<div>
				<div className="row">
					<div className="col-md-4">
						<h3>Dabtext Shows</h3>
						<DateFields callback={this.updateDate} />

						<h4>Programmer den {this.state.day}.{this.state.month}.{this.state.year}</h4>
						<table className="table">
							<tbody>
								{
									this.state.shows.map(function(show) {
										var selected = this.state.show.id === show.id ? "chosen-program-row": "";
										return (
											<DayShow selected={selected} key={show.id} callback={this.updateElements} show={show} />
										);
									}.bind(this))
								}
							</tbody>
						</table>
						<div>
							<h4>Filter</h4>
							<table className="table">
								<tbody>
									<tr className={musicToggleRow} onClick={this.toggleMusic}>
										<td>Musikk</td>
										<td>
											<input id="music_elements" type="checkbox" checked={this.state.showMusic} onChange={this.toggleMusic} />
										</td>
									</tr>
									<tr className={audioToggleRow} onClick={this.toggleShowAudio}>
										<td>Lydsaker</td>
										<td>
											<input id="audio_elements" type="checkbox" checked={this.state.showAudio} onChange={this.toggleShowAudio} />
										</td>
									</tr>
									<tr className={skippedToggleRow} onClick={this.toggelSkipped}>
										<td>
											Stikkelementer
										</td>
										<td>
											<input id="skipped_elements" type="checkbox" checked={this.state.showSkipped} onChange={this.toggelSkipped} />
										</td>
									</tr>
									<tr className={jingleToggleRow} onClick={this.toggleJingles}>
										<td>Jingler</td>
										<td>
											<input id="jingle_elements" type="checkbox" checked={this.state.showJingles} onChange={this.toggleJingles} />
										</td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
					<div className="col-md-8">
						<h3>{this.state.show.title}: {this.getNiceTime(this.state.show.starttime)} - {this.getNiceTime(this.state.show.endtime)}</h3>
						<table className="table">
							<tbody>
								{
									this.state.elements.map(function(elem) {
										var typeClass = "song-row";
										if (elem.sendstate === "Skipped") {
											if (!this.state.showSkipped)
												return null;
											typeClass = "skipped-row";
										} else if (elem.class === "Audio") {
											if (!this.state.showAudio)
												return null;
											typeClass = "audio-row";
										} else if (elem.class === "Music") {
											if (!this.state.showMusic)
												return null;
										} else if (elem.class === "Promotion") {
											if (!this.state.showJingles) 
												return null;
											typeClass = "jingle-row";
										}
										// console.log(elem.id);
										return (
											<tr key={elem.fake_id} className={typeClass}>
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
