import React, { useState, useEffect } from 'react';
import { Card, Grid, Header, Message, Loader, Icon, Container, Segment, Input } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useGetUsersQuery } from '../../services/api';
import './UserList.scss';
import ErrorMessage from '../ErrorMessage';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';
import { User } from '../../types';
import { useScrollTop } from '../../hooks/useScrollTop';

const UserList: React.FC = () => {
  useScrollTop();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [users, setUsers] = useState<User[]>([]);
  
  const { data, isLoading, error } = useGetUsersQuery({ 
    search: search.trim().length >= 2 ? search : undefined,
    page, 
    limit: 12 
  });

  useEffect(() => {
    if (data?.data) {
      if (page === 1) {
        setUsers(data.data);
      } else {
        setUsers(prev => [...prev, ...data.data]);
      }
    }
  }, [data]);

  useEffect(() => {
    setPage(1);
    setUsers([]);
  }, [search]);

  const hasMore = data ? page < data.pagination.totalPages : false;

  useInfiniteScroll(() => {
    if (!isLoading && hasMore) {
      setPage(p => p + 1);
    }
  }, hasMore, isLoading);

  if (isLoading) return <Loader active>Loading users...</Loader>;
  if (error) return <ErrorMessage error={error} />;
  if (!data) return null;

  return (
    <Container>
      <Segment basic>
        <Header as="h1" className="page-header">
          <Icon name="users" />
          <Header.Content>
            Library Members
            <Header.Subheader>{data.pagination.total} active members</Header.Subheader>
          </Header.Content>
        </Header>

        <div className="filters">
          <Input 
            icon="search" 
            placeholder="Search members by name" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <Grid columns={4} doubling stackable>
          {users.map(user => (
            <Grid.Column key={user.id} className="user-column">
              <Link to={`/users/${user.id}`} className="card-link">
                <Card raised className="user-card">
                  <Card.Content>
                    <Icon name="user circle" size="large" className="user-icon" />
                    <Card.Header className="user-name">{user.name}</Card.Header>
                    <Card.Meta className="user-id">Member #{user.id}</Card.Meta>
                  </Card.Content>
                  <Card.Content extra className="user-status">
                    <Icon name="book" /> View Library History
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

export default UserList; 