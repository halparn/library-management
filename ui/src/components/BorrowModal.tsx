import React, { useState } from 'react';
import { Modal, Button, Dropdown } from 'semantic-ui-react';
import { User } from '../types';

interface Props {
  bookName: string;
  users: User[];
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (userId: number) => void;
}

const BorrowModal: React.FC<Props> = ({ bookName, users, isOpen, onClose, onSubmit }) => {
  const [selectedUser, setSelectedUser] = useState<number | null>(null);

  const handleSubmit = () => {
    if (selectedUser) {
      onSubmit(selectedUser);
      onClose();
      setSelectedUser(null);
    }
  };

  const userOptions = users.map(user => ({
    key: user.id,
    text: `${user.name} (ID: ${user.id})`,
    value: user.id,
  }));

  return (
    <Modal open={isOpen} onClose={onClose} size="tiny">
      <Modal.Header>Borrow "{bookName}"</Modal.Header>
      <Modal.Content>
        <Dropdown
          placeholder="Select Member"
          fluid
          search
          selection
          options={userOptions}
          value={selectedUser || undefined}
          onChange={(_, data) => setSelectedUser(Number(data.value))}
        />
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={onClose}>Cancel</Button>
        <Button 
          color="green" 
          onClick={handleSubmit}
          disabled={!selectedUser}
        >
          Confirm
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default BorrowModal;