import React from 'react';
import Modal from 'react-modal';

Modal.setAppElement('#root');

const DeleteConfirmationModal = ({ isOpen, onRequestClose, onConfirmDelete, packageName }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      contentLabel="Confirm Deletion"
      className="m-auto w-1/4 h-auto bg-white rounded shadow-lg border p-6" // Adjusted width and added height
      overlayClassName="fixed z-50 top-0 bottom-0 left-0 right-0 bg-black bg-opacity-50 flex justify-center items-center"
    >
      <h2 className="text-xl font-bold mb-4">
        Are you sure you want to delete the package <span className="text-red-600">{packageName}</span>?
      </h2>
      <div className="flex justify-end">
        <button
          onClick={onConfirmDelete}
          className="btn bg-red-500 hover:bg-red-700 text-white font-bold px-4 py-2 mr-2 rounded"
        >
          Delete
        </button>
        <button
          onClick={onRequestClose}
          className="btn bg-gray-300 hover:bg-gray-400 text-black font-bold px-4 py-2 rounded"
        >
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;