import React, {useContext} from 'react';
import AuthContext from '../../context/AuthContext';
import '../../styles/ConfirmDialog.css';

const ConfirmDialog = () => {
  const { confirmOpen, confirmMessage, onConfirmAction, cancelConfirmDialog } = useContext(AuthContext);

  if (!confirmOpen) return null;

  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <p className="confirm-message">{confirmMessage}</p>
        <div className="confirm-buttons">
          <button onClick={cancelConfirmDialog} className="confirm-btn cancel-btn">Cancel</button>
          <button onClick={onConfirmAction} className="confirm-btn delete-btn">Confirm</button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
