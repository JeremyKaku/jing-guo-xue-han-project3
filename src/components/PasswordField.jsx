import React from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import CopyToClipboard from './CopyToClipboard';

const PasswordField = ({ type, placeholder, value, onChange }) => {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <label className='input-box'>
      <input type={showPassword ? "text" : "password"} placeholder={placeholder} value={value} onChange={onChange} required />
      <div className="icon-container">
        {showPassword ? <FaEyeSlash className='icon' onClick={() => setShowPassword(false)} title="Hide password" /> : <FaEye className='icon' onClick={() => setShowPassword(true)} title="Show password" />}
        <CopyToClipboard password={value} />
      </div>
    </label>
  );
};

export default PasswordField;
