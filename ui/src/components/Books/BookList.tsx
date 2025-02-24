import React, { useState, useEffect } from 'react';
import { Card, Grid, Header, Message, Loader, Icon, Container, Segment, Input, Checkbox, Pagination } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useGetBooksQuery } from '../../services/api';
import './BookList.scss';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { Book } from '../../types';

const BookList: React.FC = () => {
  const [search, setSearch] = useState('');
  const [showAvailable, setShowAvailable] = useState<boolean>(false);
  const [page, setPage] = useState(1);
  const [books, setBooks] = useState<Book[]>([]);
  
  const { data, isLoading, error } = useGetBooksQuery({ 
    search: search.trim().length >= 2 ? search : undefined,
    available: showAvailable,
    page,
    limit: 12
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setBooks(data.data);
      } else {
        setBooks(prev => [...prev, ...data.data]);
      }
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
    setBooks([]);
  }, [search, showAvailable]);

  const hasMore = data ? page < data.pagination.totalPages : false;
  
  useInfiniteScroll(() => {
    if (!isLoading && hasMore) {
      setPage(p => p + 1);
    }
  }, hasMore, isLoading);

  if (isLoading) return <Loader active>Loading books...</Loader>;
  if (error) return <Message negative>Error loading books</Message>;
  if (!data) return null;

  return (
    <Container>
      <Segment basic>
        <Header as="h1" className="page-header">
          <Icon name="book" />
          <Header.Content>
            Library Collection
            <Header.Subheader>{data.pagination.total} books available</Header.Subheader>
          </Header.Content>
        </Header>

        <div className="filters">
          <Input 
            icon="search" 
            placeholder="Search book by name or author" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <Checkbox
            label="Show available only"
            checked={showAvailable}
            onChange={() => setShowAvailable(!showAvailable)}
          />
        </div>

        <Grid columns={4} doubling stackable>
          {books.map(book => (
            <Grid.Column key={`${book.id}-${book.userId}`} className="book-column">
              <Link to={`/books/${book.id}`} className="card-link">
                <Card raised className="book-card">
                  <Card.Content>
                    <Icon name="book" size="large" className={`book-icon ${book.userId ? 'borrowed' : 'available'}`} />
                    <Card.Header className="book-title">{book.name}</Card.Header>
                    <Card.Meta className="book-author">{book.author}</Card.Meta>
                  </Card.Content>
                  <Card.Content extra className={`book-status ${book.userId ? 'borrowed' : 'available'}`}>
                    <Icon name={book.userId ? 'user' : 'circle'} />
                    {book.userId ? 'Borrowed' : 'Available'}
                  </Card.Content>
                </Card>
              </Link>
            </Grid.Column>
          ))}
        </Grid>

        {isLoading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <Loader active inline />
          </div>
        )}
      </Segment>
    </Container>
  );
};

export default BookList; 