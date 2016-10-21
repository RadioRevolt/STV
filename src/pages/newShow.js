
var React = require("react");
var DigAiRange = require("./modules/digAIrangeData.js");
var Shows = require("./modules/shows.js");
var DateFields = require("./modules/dateFields.js").first;
var Sendeskjema = require("./modules/sendeskjema.js");
var $ = require("jquery");

var LoadSending = React.createClass({
	loadSendingAPI: function(e) {
		e.preventDefault();
		this.props.callback([]);
		// $.ajax({

		// });
	},

	render: function() {
		return (
			<tr>
				<td></td>
				<td><button onClick={this.loadSendingAPI}>Last sending</button></td>
			</tr>
		);
	}
});

module.exports = React.createClass({

	getInitialState: function() {
		return {
			live: true,
			show: "",
			data: [],
			dataLoaded: false
		}
	},

	toggleLiveShow: function() {
		this.setState({
			live: !this.state.live
		});
	},

	submitForm: function() {

	},

	render: function() {
		var setCurrentShow = function(show) {
			this.setState({
				show: show
			});
			console.log("Show updated in parent. " + show);
		}.bind(this);

		var setDate = function(day, month, year) {
			this.setState({
				day: day,
				month: month,
				year: year
			});
			console.log(day, month, year);
			console.log("date updated kis");
		}.bind(this)

		var setDataSendeskjema = function(data) {
			this.setState({
				dataLoaded: true,
				data: data
			});
		}.bind(this);

		var getLoadedShow = function() {
			console.log(this.state.show);
			return this.state.show;
		}.bind(this);

		return (
			<div>
				<h2>Ny sending</h2>
				<form onSubmit={this.submitForm}>
					<table>
						<tbody>
							<tr>
								<td>Velg show</td>
								<td><Shows setShow={setCurrentShow} /></td>
							</tr>
							<tr>
								<td>Opprett for live produksjon? (nei hvis det skal lages for en preprod)</td>
								<td><input type="checkbox" onChange={this.toggleLiveShow} checked={this.state.live}/></td>
							</tr>
							{this.state.live ? null : <DateFields callback={setDate} />}
							{this.state.live ? null : <LoadSending callback={setDataSendeskjema}/>}
							
						</tbody>
					</table>
					<input type="submit" value="Neste" />
				</form>
				{this.state.dataLoaded ? <Sendeskjema 
					dateUrl={"/" + this.state.year + "/" + this.state.month + "/" + this.state.day}
					getLoadedShow={getLoadedShow}
					/> : false}
			</div>
		);
	}
});
