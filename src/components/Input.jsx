import PropTypes from 'prop-types';

function Input({ 
  label, 
  type = 'text', 
  error, 
  value,
  onChange,
  onBlur,
  ...props 
}) {
  return (
    <div className="input-container">
      <label className="input-label">
        {label}
      </label>
      <input
        type={type}
        className={`input-field ${error ? 'input-error' : ''}`}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        {...props}
      />
      {error && <span className="error-message">{error}</span>}
    </div>
  );
}

Input.propTypes = {
  label: PropTypes.string.isRequired,
  type: PropTypes.string,
  error: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func,
  onBlur: PropTypes.func
};

export default Input;