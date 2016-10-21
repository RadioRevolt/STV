
var React = require("react");

module.exports = React.createClass({
	getInitialState: function() {
		return {
			show: "Garasjen"
		}
	},

	changeShow: function(e) {
		this.setState({
			show: e.target.value
		});
	},

	render: function() {
		return (
			<tr>
				<td></td>
				<td>
					<select value={this.state.show} onChange={this.changeShow}>
						<option value="Garasjen">Garasjen</option>
						<option value="Reservebenken">Reservebenken</option>
						<option value="RevoltMorgen">RevoltMorgen</option>
					</select>
				</td>
			</tr>
		);
	}
});
