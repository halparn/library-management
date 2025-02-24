import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Segment, Table, Button, Rating, Loader, Message } from 'semantic-ui-react';
import { useGetBookQuery, useGetUsersQuery, useBorrowBookMutation } from '../services/api';
import ErrorMessage from '../components/ErrorMessage';
import BorrowModal from '../components/BorrowModal';

const BookDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: book, isLoading, error: fetchError } = useGetBookQuery(Number(id));
  const { data: users } = useGetUsersQuery({ page: 1, limit: 50 });
  const [borrowBook] = useBorrowBookMutation();
  const [borrowModal, setBorrowModal] = useState(false);
  const [borrowError, setBorrowError] = useState<any>(null);

  if (isLoading) return <Loader active>Loading book details...</Loader>;
  if (fetchError) return <ErrorMessage error={fetchError} />;
  if (!book) return null;

  const handleBorrow = () => {
    setBorrowModal(true);
  };

  const handleBorrowSubmit = async (userId: number) => {
    setBorrowError(null);
    try {
      await borrowBook({
        userId,
        bookId: book!.id
      }).unwrap();
    } catch (error) {
      setBorrowError(error);
    }
  };

  return (
    <div className="detail-page">
      <Header as="h2">{book.name}</Header>

      {borrowError && <ErrorMessage error={borrowError} />}

      <BorrowModal
        bookName={book.name}
        users={users?.data || []}
        isOpen={borrowModal}
        onClose={() => setBorrowModal(false)}
        onSubmit={handleBorrowSubmit}
      />

      <Segment>
        <Table definition>
          <Table.Body>
            <Table.Row>
              <Table.Cell width={4}>Author</Table.Cell>
              <Table.Cell>{book.author}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Year</Table.Cell>
              <Table.Cell>{book.year}</Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Average Rating</Table.Cell>
              <Table.Cell>
                {book.score !== -1 ? (
                  <Rating 
                    icon="star" 
                    defaultRating={Math.round(Number(book.score))} 
                    maxRating={10} 
                    disabled
                  />
                ) : (
                  'No ratings yet'
                )}
              </Table.Cell>
            </Table.Row>
            <Table.Row>
              <Table.Cell>Current Owner</Table.Cell>
              <Table.Cell>{book.currentOwner || 'Available'}</Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table>

        {!book.currentOwner && (
          <Button 
            color="green" 
            onClick={handleBorrow}
            style={{ marginTop: '1rem' }}
          >
            Borrow Book
          </Button>
        )}
      </Segment>
    </div>
  );
};

export default BookDetail; 