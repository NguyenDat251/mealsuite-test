import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import Tickets from './tickets';

describe('Tickets', () => {
  it('should render successfully', () => {
    const setTickets = jest.fn();
    const users = [
      {
        id: 1,
        name: 'Alice',
      },
    ];

    const tickets = [
      {
        id: 1,
        description: 'test description',
        assigneeId: 1,
        completed: false,
      },
    ];

    const fetchTickets = jest.fn();

    const { baseElement } = render(
      <BrowserRouter>
        <Tickets
          tickets={tickets}
          setTickets={setTickets}
          users={users}
          fetchTickets={fetchTickets}
        />
      </BrowserRouter>
    );
    expect(baseElement).toBeTruthy();
    expect(fetchTickets).toHaveBeenCalled();

    expect(screen.getByText('test description')).toBeTruthy();
    expect(screen.getByText('Assignee: Alice')).toBeTruthy();
  });
});
