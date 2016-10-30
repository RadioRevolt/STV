
const React = require("react");


class DateField extends React.Component {
	constructor(props) {
		super(props);
		const days = [];
		for (let i = 1; i < 32; i++) {
			days.push(i);
		}
		const months = [];
		for (let i = 1; i <= 12; i++) {
			months.push(i);
		}
		const years = [];
		for (let i = 2010; i <= new Date().getFullYear(); i++) {
			years.push(i);
		}
		// this.props.callback(days[0], months[0], years[0]);
		const today = new Date();
		this.state = {
			days: days,
			months: months,
			years: years,
			day: days[today.getDate() - 1],
			month: months[today.getMonth()],
			year: years[years.length - 1],
			source: "studio"
		};

		this.monthNames = ["Januar", "Februar", "Mars", "April", "Mai", "Juni", "Juli", "August", "September", "Oktober", "November", "Desember"];
		this.dayNames = ["Søndag", "Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag"];
	}

  	changeSource(e)  {
		this.setState({source: e.target.value});
		this.props.doChangeSource(e.target.value);
	}

	updateParent() {
		this.props.callback(this.state.day, this.state.month, this.state.year);
	}

	changeYear(e) {
		this.setState({year: e.target.value});
		// this.updateParent();
		this.props.callback(this.state.day, this.state.month, e.target.value);
	}

	changeMonth(e) {
		this.setState({month: e.target.value});
		// this.updateParent();
		this.props.callback(this.state.day, e.target.value, this.state.year);
	}

	changeDay(e) {
		this.setState({day: e.target.value});
		// this.updateParent();
		this.props.callback(e.target.value, this.state.month, this.state.year);
	}

	componentDidMount() {
		this.updateParent();
	}

	getDayName(day) {
		const date = new Date(this.state.year, this.state.month - 1, day);
		return this.dayNames[date.getDay()];
	}

	render() {
		return (
			<div>
				<table className="table">
					<thead>
						<tr>
							<td>Kilde</td>
							<td>
								<select className="form-control" value={this.state.source} onChange={this.changeSource.bind(this)}>
									<option value="studio" key="studio">Studio</option>
									<option value="autoavvikler" key="autoavvikler">Autoavvikler</option>
									<option value="teknikerrom" key="teknikerrom">Teknikerrom</option>
								</select>
							</td>
						</tr>
						<tr>
							<td>År</td>
							<td>
								<select className="form-control" value={this.state.year} onChange={this.changeYear.bind(this)}>
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
								<select className="form-control" value={this.state.month} onChange={this.changeMonth.bind(this)}>
									{
										this.state.months.map(function(month) {
											const name = this.monthNames[month - 1];
											return (<option value={month} key={month}>{name}</option>);
										}.bind(this))
									}
								</select>
							</td>
						</tr>
						<tr>
							<td>Dag</td>
							<td>
								<select className="form-control" value={this.state.day} onChange={this.changeDay.bind(this)}>
									{
										this.state.days.map(function(day) {
											const name = this.getDayName(day);
											// if (day > 28) {
											// 	const month = this.state.month;
											// 	if (month === 2)
											// 		return null;
											// 	if (month === 4 || month === 6 || month === 9 || month === 11)
											// 		return null;
											// }
											return (<option value={day} key={day}>{day} - {name}</option>);
										}.bind(this))
									}
								</select>
							</td>
						</tr>
					</thead>
				</table>
			</div>
		);
	}
}

module.exports = DateField;
