var React = require('react/addons');

var RoundedToggle = React.createClass({
  mixins: [React.addons.PureRenderMixin],
  propTypes: {
    options: React.PropTypes.array.isRequired,
    active: React.PropTypes.string,
    update: React.PropTypes.func.isRequired,
    disabled: React.PropTypes.bool,
    className: React.PropTypes.string
  },
  getDefaultProps() {
    return {
      disabled: false,
      className: ''
    };
  },
  render() {
    /* jshint ignore:start */
    var options = this.props.options.map((o, i) => {
      var handleClick = (e) => {
        if (!this.props.disabled) this.props.update(o.value);
      };
      var classes = React.addons.classSet({
        active: o.value === this.props.active
      }) + ' flex center ' + o.className;
      return (
        <a key={o.value}
          title={o.value}
          className={'flex center ' +
            (o.value === this.props.active ?
              'active flex-' + (this.props.activeFlex ? this.props.activeFlex : 3) : 'flex-1') + ' ' +
            o.className}
          onClick={handleClick}>{o.key}</a>
      );
    });
    return (
      <div className={this.props.className + ' flex rounded-toggle '  + (this.props.disabled && ' disabled')}>
        {options}
      </div>
    );
    /* jshint ignore:end */
  }
});

module.exports = RoundedToggle;
