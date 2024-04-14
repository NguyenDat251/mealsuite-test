import {
  OnChangeAssignee,
  OnChangeCompletedStatus,
} from '../../../types/general';
import { Ticket, User } from '@acme/shared-models';
import styled from 'styled-components';

type SingleTicketProps = {
  ticket: Ticket;
  users: User[];
  readOnly?: boolean;
  onChangeCompletedStatus?: OnChangeCompletedStatus;
  onChangeAssignee?: OnChangeAssignee;
};

const SingleTicket = ({
  ticket,
  users,
  readOnly = false,
  onChangeCompletedStatus,
  onChangeAssignee,
}: SingleTicketProps) => {
  const assignee = users.find((u) => u.id === ticket.assigneeId);
  const completed = ticket.completed;

  const handleChangeCompleted = () => {
    if (readOnly) return;

    onChangeCompletedStatus && onChangeCompletedStatus(ticket, !completed);
  };

  const handleChangeAssignee = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newAssigneeId = parseInt(e.target.value);
    onChangeAssignee && onChangeAssignee(ticket, newAssigneeId);
  };

  return (
    <SingleTicketWrapper>
      <h3>{ticket.description}</h3>
      <p>Assignee: {assignee ? assignee.name : 'unassigned'}</p>
      {!readOnly && (
        <select onChange={handleChangeAssignee}>
          {users.map((u) => (
            <option
              key={u.id}
              value={u.id}
              selected={u.name === assignee?.name}
            >
              {u.name}
            </option>
          ))}
        </select>
      )}
      <div>
        <label>Completed:</label>
        <input
          id="completedStatus"
          type="checkbox"
          checked={completed}
          value={ticket.id}
          onChange={handleChangeCompleted}
        />
      </div>
    </SingleTicketWrapper>
  );
};

const SingleTicketWrapper = styled['div']`
  border: 1px solid black;
  padding: 10px;
  background-color: #e5e5e5;
  width: fit-content;
`;

export default SingleTicket;
