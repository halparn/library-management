import React, { useState } from 'react';
import { Modal, Button, Rating, RatingProps } from 'semantic-ui-react';

interface Props {
  bookName: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (score: number) => void;
}

const RatingModal: React.FC<Props> = ({ bookName, isOpen, onClose, onSubmit }) => {
  const [rating, setRating] = useState<number>(0);

  const handleRate = (e: React.MouseEvent, data: RatingProps) => {
    setRating(Number(data.rating) || 0);
  };

  const handleClose = () => {
    setRating(0);
    onClose();
  };

  const handleSubmit = () => {
    if (rating > 0) {
      onSubmit(rating);
      handleClose();
    }
  };

  return (
    <Modal open={isOpen} onClose={handleClose} size="tiny">
      <Modal.Header>Rate "{bookName}"</Modal.Header>
      <Modal.Content>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <Rating 
            icon="star"
            maxRating={10}
            rating={rating}
            onRate={handleRate}
            size="huge"
          />
          <div style={{ marginTop: '10px' }}>
            {rating > 0 ? `Your rating: ${rating}/10` : 'Select your rating'}
          </div>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button color="grey" onClick={handleClose}>
          Cancel
        </Button>
        <Button 
          color="green" 
          onClick={handleSubmit}
          disabled={rating === 0}
        >
          Submit Rating
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default RatingModal; 