import { render, screen } from '@testing-library/react';

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
      <Tickets
        tickets={tickets}
        setTickets={setTickets}
        users={users}
        fetchTickets={fetchTickets}
      />
    );
    expect(baseElement).toBeTruthy();
    expect(fetchTickets).toHaveBeenCalled();
    expect(setTickets).toHaveBeenCalled();

    expect(screen.getByText('test description')).toBeTruthy();
    expect(screen.getByText('Alice')).toBeTruthy();
  });
});
