import { Ticket, User } from '@acme/shared-models';
import styles from './tickets.module.css';
import { useState } from 'react';
import axios from '../../utils/axios';

export interface TicketsProps {
  tickets: Ticket[];
  users: User[];
}

type OnChangeCompleted = (id: number, isCompleted: boolean) => void;

const SingleTicket = ({ticket, user, onChangeCompleted}: {ticket: Ticket, user: User | undefined, onChangeCompleted: OnChangeCompleted}) => {
  const [completed, setCompleted] = useState(ticket.completed);

  const handleChangeCompleted = (e: any) => {
    onChangeCompleted(e.target.value, !completed)
    setCompleted(completed => !completed);
  }

  return (
    <div>
      <h3>{ticket.description}</h3>
      <p>Assignee: {user  ? user.name : 'unassigned'}</p>
      <div>Completed: 
        <input type="checkbox" checked={ticket.completed} value={ticket.id} onChange={handleChangeCompleted}/>
      </div>
    </div>
  );
}

export function Tickets({tickets, users}: TicketsProps) {
  console.log("🚀 ~ Tickets ~ tickets:", tickets)
  const getAssignee = (id: number | null) => {
    if (id === null) {
      return undefined;
    }
    return users.find(u => u.id === id);
  }

  const onChange: OnChangeCompleted = (ticketId, isCompleted) => {
    console.log(ticketId);
    if(isCompleted) {
    axios.put(`/api/tickets/${ticketId}/complete`)
    } else {
      axios.delete(`/api/tickets/${ticketId}/complete`)
    }
  }

  return (
    <div className={styles['tickets']}>
      <h2>Tickets</h2>
      {tickets ? (
        <div>
          {tickets.map((t) => (
            <SingleTicket key={t.id} ticket={t} user={getAssignee(t.assigneeId)} onChangeCompleted={onChange}/>
          ))}
        </div>
      ) : (
        <span>...</span>
      )}
    </div>
  );
}

export default Tickets;
