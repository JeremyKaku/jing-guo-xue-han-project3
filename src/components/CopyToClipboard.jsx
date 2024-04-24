import React, { useState } from 'react';
import { FaCopy } from "react-icons/fa";

const CopyToClipboard = ({ password }) => {
  const [showMessage, setShowMessage] = useState(false);

  const handleCopy = () => {
    const textarea = document.createElement('textarea');
    textarea.value = password;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);

    setShowMessage(true);

    setTimeout(() => {
      setShowMessage(false);
    }, 1000);
  };

  return (
    <>
      <FaCopy className='copy-icon' onClick={handleCopy} title="Copy To Clipboard" />
      {showMessage && (
        <div className="message">
          ✓ Copied Passcode To Clipboard
        </div>
      )}
    </>
  );
};

export default CopyToClipboard;
