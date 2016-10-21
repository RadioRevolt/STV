
var React = require("react");

var DateField = React.createClass({
	getInitialState: function() {
		var days = [];
		for (var i = 1; i < 32; i++) {
			days.push(i);
		}
		var months = [];
		for (var i = 1; i <= 12; i++) {
			months.push(i);
		}
		var years = [];
		for (var i = 2010; i <= new Date().getFullYear(); i++) {
			years.push(i);
		}
		// this.props.callback(days[0], months[0], years[0]);
		var today = new Date();
		return {
			days: days,
			months: months,
			years: years,
			day: days[today.getDate() - 1],
			month: months[today.getMonth()],
			year: years[years.length - 1]
		}
	},

	updateParent: function() {
		this.props.callback(this.state.day, this.state.month, this.state.year);
	},

	changeYear: function(e) {
		this.setState({year: e.target.value});
		// this.updateParent();
		this.props.callback(this.state.day, this.state.month, e.target.value);
	},

	changeMonth: function(e) {
		this.setState({month: e.target.value});
		// this.updateParent();
		this.props.callback(this.state.day, e.target.value, this.state.year);
	},

	changeDay: function(e) {
		this.setState({day: e.target.value});
		// this.updateParent();
		this.props.callback(e.target.value, this.state.month, this.state.year);
	},

	componentDidMount: function() {
		this.updateParent();
	}, 

	render: function() {
		return (
			<div>
				<table className="table">
					<thead>
						<tr>
							<td>År</td>
							<td>
								<select className="form-control" value={this.state.year} onChange={this.changeYear}>
									{
										this.state.years.map(function(year) {
											return (
												<option value={year} key={year}>{year}</option>
											)
										})
									}
								</select>
							</td>
						</tr>
						<tr>
							<td>Måned</td>
							<td>
								<select className="form-control" value={this.state.month} onChange={this.changeMonth}>
									{
										this.state.months.map(function(month) {
											return (<option value={month} key={month}>{month}</option>);
										})
									}
								</select>
							</td>
						</tr>
						<tr>
							<td>Dag</td>
							<td>
								<select className="form-control" value={this.state.day} onChange={this.changeDay}>
									{
										this.state.days.map(function(day) {
											return (<option value={day} key={day}>{day}</option>);
										})
									}
								</select>
							</td>
						</tr>
					</thead>
				</table>
			</div>
		);
	}
});

module.exports.first = React.createClass({
	render: function() {
		return (
			<tr>
				<td>Dato for produseringen</td>
				<td><DateField callback={this.props.callback} /></td>
			</tr>
		);
	}
});


module.exports.second = React.createClass({
	render: function() {
		// console.log("nå har dato oppdatert seg.");
		return (
			<div>
				<DateField callback={this.props.callback} />
			</div>
		)
	}
});
