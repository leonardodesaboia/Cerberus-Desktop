import PropTypes from 'prop-types'

function Input({ label, type = 'text', ...props }) {
    return (
      <div className="input-container">
        <label className="input-label">
          {label}
        </label>
        <input
          type={type}
          className="input-field"
          {...props}
        />
      </div>
    );
  }

  Input.propTypes = {
    label: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired
  }

  export default Input;