import React from 'react';
import API from '../../Internals/API';  

interface DeleteAnimalButtonProps {
    animalToDeleteId: string;  // The ID of the animal to delete
  onDeleteSuccess?: () => void;  // Optional callback for success
}

const DeleteAnimalButton: React.FC<DeleteAnimalButtonProps> = ({ animalToDeleteId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    try {
      const deleteUrl = API.DeleteAnimal(animalToDeleteId);  
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      if (response.ok) {
        if (onDeleteSuccess) {
          onDeleteSuccess();  // Call the success callback if provided
        }
        alert('Animal and associated videos deleted successfully');
      } else {
        const errorData = await response.json();
        alert(`Failed to delete animal: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting animal:', error);
      alert('An error occurred while deleting the animal.');
    }
  };

  return (
    <button onClick={handleDelete} style={{ color: 'red' }}>
      Delete Animal
    </button>
  );
};

export default DeleteAnimalButton;
