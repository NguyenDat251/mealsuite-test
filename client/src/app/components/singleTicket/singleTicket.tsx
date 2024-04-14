import {
  OnChangeAssignee,
  OnChangeCompletedStatus,
} from '../../../types/general';
import { Ticket, User } from '@acme/shared-models';

type SingleTicketProps = {
  ticket: Ticket;
  users: User[];
  user: User | undefined;
  readOnly?: boolean;
  onChangeCompletedStatus?: OnChangeCompletedStatus;
  onChangeAssignee?: OnChangeAssignee;
};

const SingleTicket = ({
  ticket,
  users,
  user,
  readOnly = false,
  onChangeCompletedStatus,
  onChangeAssignee,
}: SingleTicketProps) => {
  const assignee = users.find((u) => u.id === ticket.assigneeId);
  const completed = ticket.completed;

  const handleChangeCompleted = (e: any) => {
    if (readOnly) return;

    onChangeCompletedStatus && onChangeCompletedStatus(ticket, !completed);
  };

  const handleChangeAssignee = (e: any) => {
    const newAssigneeId = parseInt(e.target.value);
    onChangeAssignee && onChangeAssignee(ticket, newAssigneeId);
  };

  return (
    <div>
      <h3>{ticket.description}</h3>
      <p>Assignee: {assignee ? assignee.name : 'unassigned'}</p>
      {!readOnly && (
        <select onChange={handleChangeAssignee}>
          {users.map((u) => (
            <option key={u.id} value={u.id}>
              {u.name}
            </option>
          ))}
        </select>
      )}
      <div>
        Completed:
        <input
          type="checkbox"
          checked={completed}
          value={ticket.id}
          onChange={handleChangeCompleted}
        />
      </div>
    </div>
  );
};

export default SingleTicket;
