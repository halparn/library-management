import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Container, Icon } from 'semantic-ui-react';
import './Navbar.scss';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="navbar">
      <Container>
        <Menu secondary>
          <Menu.Item 
            as={Link} 
            to="/" 
            active={isActive('/')}
            className="brand"
          >
            <Icon name="book" size="large" />
            Library App
          </Menu.Item>

          <Menu.Menu position="right">
            <Menu.Item
              as={Link}
              to="/books"
              active={isActive('/books')}
              className="nav-item"
            >
              <Icon name="book" />
              Books
            </Menu.Item>

            <Menu.Item
              as={Link}
              to="/users"
              active={isActive('/users')}
              className="nav-item"
            >
              <Icon name="users" />
              Members
            </Menu.Item>
          </Menu.Menu>
        </Menu>
      </Container>
    </div>
  );
};

export default Navbar; 