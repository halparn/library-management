import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Header, Segment, Table, Button, Rating, Loader, Message, Icon } from 'semantic-ui-react';
import { useGetUserQuery, useReturnBookMutation } from '../services/api';
import { formatDate } from '../utils/dateUtils';
import ErrorMessage from '../components/ErrorMessage';
import RatingModal from '../components/RatingModal';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: user, isLoading, error: fetchError } = useGetUserQuery(Number(id));
  const [returnBook] = useReturnBookMutation();
  const [returnError, setReturnError] = useState<any>(null);
  const [ratingModal, setRatingModal] = useState<{
    isOpen: boolean;
    bookId: number;
    bookName: string;
  }>({
    isOpen: false,
    bookId: 0,
    bookName: ''
  });

  if (isLoading) return <Loader active>Loading user details...</Loader>;
  if (fetchError) return <ErrorMessage error={fetchError} />;
  if (!user) return null;

  const handleReturnBook = (bookName: string, bookId: number) => {
    setRatingModal({
      isOpen: true,
      bookId,
      bookName
    });
  };

  const handleRatingSubmit = async (score: number) => {
    setReturnError(null);
    
    try {
      await returnBook({
        userId: user!.id,
        bookId: ratingModal.bookId,
        score
      }).unwrap();
    } catch (error) {
      setReturnError(error);
    }
  };

  const closeRatingModal = () => {
    setRatingModal(prev => ({ ...prev, isOpen: false }));
  };

  return (
    <div className="detail-page">
      <Segment basic>
        <Header as="h2">
          <Icon name="user circle" />
          <Header.Content>
            {user.name}
            <Header.Subheader>Member #{user.id}</Header.Subheader>
          </Header.Content>
        </Header>

        {returnError && (
          <ErrorMessage error={returnError} />
        )}

        <RatingModal
          bookName={ratingModal.bookName}
          isOpen={ratingModal.isOpen}
          onClose={closeRatingModal}
          onSubmit={handleRatingSubmit}
        />

        <Segment>
          <Header as="h3">Currently Borrowed Books</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Book Name</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell>Borrowed Date</Table.HeaderCell>
                <Table.HeaderCell>Actions</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {user.books.present.map((book) => (
                <Table.Row key={book.id}>
                  <Table.Cell>{book.name}</Table.Cell>
                  <Table.Cell>{book.author}</Table.Cell>
                  <Table.Cell>{formatDate(book.borrowedAt)}</Table.Cell>
                  <Table.Cell>
                    <Button 
                      color="green" 
                      onClick={() => handleReturnBook(book.name, book.id)}
                    >
                      Return Book
                    </Button>
                  </Table.Cell>
                </Table.Row>
              ))}
              {user.books.present.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={4} textAlign="center">No books currently borrowed</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Segment>

        <Segment>
          <Header as="h3">Borrowing History</Header>
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Book Name</Table.HeaderCell>
                <Table.HeaderCell>Author</Table.HeaderCell>
                <Table.HeaderCell>Borrowed Date</Table.HeaderCell>
                <Table.HeaderCell>Returned Date</Table.HeaderCell>
                <Table.HeaderCell>Rating</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {user.books.past.map((book) => (
                <Table.Row key={`${book.id}-${book.borrowedAt}`}>
                  <Table.Cell>{book.name}</Table.Cell>
                  <Table.Cell>{book.author}</Table.Cell>
                  <Table.Cell>{formatDate(book.borrowedAt)}</Table.Cell>
                  <Table.Cell>{formatDate(book.returnedAt)}</Table.Cell>
                  <Table.Cell>
                    <Rating 
                      icon="star" 
                      defaultRating={book.userScore} 
                      maxRating={10} 
                      disabled
                    />
                    <span style={{ marginLeft: '0.5em' }}>
                      ({book.userScore}/10)
                    </span>
                  </Table.Cell>
                </Table.Row>
              ))}
              {user.books.past.length === 0 && (
                <Table.Row>
                  <Table.Cell colSpan={5} textAlign="center">No borrowing history</Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Segment>
      </Segment>
    </div>
  );
};

export default UserDetail; 