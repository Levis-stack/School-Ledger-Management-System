import { motion } from 'framer-motion';

const DeleteConfirmation = ({ student, onConfirm, onCancel }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="delete-confirmation"
    >
      <div className="confirmation-content">
        <p>Are you sure you want to delete {student.name} (Adm: {student.admissionNumber})?</p>
        <div className="confirmation-buttons">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onConfirm}
            className="confirm-button"
          >
            Yes, Delete
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onCancel}
            className="cancel-button"
          >
            Cancel
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default DeleteConfirmation;