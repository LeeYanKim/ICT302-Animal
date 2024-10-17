import React from 'react';
import API from '../../Internals/API';  

interface DeleteGraphicButtonProps {
  animaltoDelId: string;   
  graphictoDelId: string;  
  onDeleteSuccess?: () => void;  
}

const DeleteGraphicButton: React.FC<DeleteGraphicButtonProps> = ({ animaltoDelId, graphictoDelId, onDeleteSuccess }) => {
  const handleDelete = async () => {
    const graphicFileName = graphictoDelId.split('/').pop();  // Extract the file name from the full URL
    if (!graphicFileName) {
      alert('Invalid graphic URL');
      return;
    }

    try {
      const deleteUrl = API.DeleteGraphic(animaltoDelId, graphicFileName);  // Pass only the file name
      const response = await fetch(deleteUrl, {
        method: 'DELETE',
      });

      if (response.ok) {
        alert('Graphic deleted successfully');
        if (onDeleteSuccess) {
          onDeleteSuccess();  // Call the success callback if provided
        }
      } else {
        try {
          const errorData = await response.json();
          alert(`Failed to delete graphic: ${errorData.message}`);
        } catch {
          alert('Failed to delete graphic. Server returned an invalid response.');
        }
      }
    } catch (error) {
      console.error('Error deleting graphic:', error);
      alert('An error occurred while deleting the graphic.');
    }
  };

  return (
    <button onClick={handleDelete} style={{ color: 'red' }}>
      Delete Graphic
    </button>
  );
};

export default DeleteGraphicButton;