//write unit test for singleTicket

// Path: client/src/app/components/singleTicket/singleTicket.spec.tsx
import { render, screen } from '@testing-library/react';
import SingleTicket from './singleTicket';

describe('SingleTicket', () => {
  it('should render successfully', () => {
    const ticket = {
      id: 1,
      description: 'test description',
      assigneeId: 1,
      completed: false,
    };
    const users = [
      {
        id: 1,
        name: 'Alice',
      },
    ];

    render(<SingleTicket ticket={ticket} users={users} />);
    expect(screen.getByText('test description')).toBeTruthy();
    expect(screen.getByText('Assignee: Alice')).toBeTruthy();
  });
});
