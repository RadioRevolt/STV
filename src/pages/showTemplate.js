
const React = require("react");
const DateFields = require("./modules/dateFields.js");
// const $ = require("jquery");
const DayShow = require("./modules/dayShows.js");


module.exports = React.createClass({
	getInitialState: function() {
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
			showJingles: false,
			source: "studio"
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

	changeSource: function(source) {
		console.log("Souce updated.");
		this.setState({
			source: source
		});
		this.receiveShows(this.state.day, this.state.month, this.state.year, source);
	},

	receiveShows: function(day, month, year, source) {
		const url = "http://pappagorg.radiorevolt.no/v1/sendinger/dato/" + year + "/" + month + "/" + day + "/" + source + "/";
		this.setState({
			url: url,
			shows: [],
			show: {},
			elements: []
		});

		fetch(url).then(function(response) {
			return response.json();
		}).then(function(json) {
			this.setState({
				shows: json
			});
		}.bind(this)).catch(err => {
			console.log("An error kis.");
			console.log(err);
		});
	},

	updateDate: function(day, month, year) {
		console.log("Date updated kis: " + year + ":" + month + ":" + day);
		this.setState({
			day: day,
			month: month,
			year: year
		});
		this.receiveShows(day, month, year, this.state.source);
	},

	updateElements: function(id) {
		console.log("Update elements kis.");

		this.setState({
			show: id,
			elements: [{fake_id:"Lolas", title:"Laster inn sendeskjemaet"}]
		});

		const startDate = new Date(id.starttime);
		const endDate = new Date(id.endtime);
		fetch(this.state.url + "/" + id.id).then(res => {
			return res.json();
		}).then(data => {
			const arr = [];
			let counter = 0;
			let foundLast = false;

			data.elements.map(item => {
				if (foundLast)
					return;

				if (endDate <= new Date(item.actual_stop)){
					foundLast = true;
				}

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
			});

			const newArr = [];

			for (let i in arr) {
				let found = false;
				for (let j in newArr) {
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

			if (this.state.show.id !== data.metadata.id) {
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

		}).catch(err => {
			console.log("Error!");
			console.log(err);
		});
	},

	getNiceTime: function(date, secs) {
		if (!date)
			return;
		date = new Date(date);
		let hours = date.getHours(), minutes = date.getMinutes();
		if (hours < 10)
			hours = "0" + hours;
		if (minutes < 10) 
			minutes = "0" + minutes;
		if (!secs)
			return hours + ":" + minutes;
		let seconds = date.getSeconds();
		if (seconds < 10)
			seconds = "0" + seconds;
		return hours + ":" + minutes + ":" + seconds
	},

	render: function() {
		const musicToggleRow = "show-row " + (this.state.showMusic ? "song-row" : "");
		const skippedToggleRow = "show-row " + (this.state.showSkipped ? "skipped-row": "");
		const audioToggleRow = "show-row " + (this.state.showAudio ? "audio-row": "");
		const jingleToggleRow = "show-row " + (this.state.showJingles ? "jingle-row": "");
		return (
			<div>
				<div className="row">
					<div className="col-md-4">
						<h3>Dabtext Shows</h3>
						<DateFields callback={this.updateDate} doChangeSource={this.changeSource} />

						<h4>Programmer den {this.state.day}.{this.state.month}.{this.state.year}</h4>
						<table className="table">
							<tbody>
								{
									this.state.shows.map(function(show) {
										const selected = this.state.show.id === show.id ? "chosen-program-row": "";
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
										let typeClass = "song-row";
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
