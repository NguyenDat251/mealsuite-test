import { Ticket, User } from '@acme/shared-models';
import styles from './tickets.module.css';
import axios from '../../../utils/axios';
import SingleTicket from '../singleTicket/singleTicket';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

export interface TicketsProps {
  tickets: Ticket[];
  users: User[];
  fetchTickets: () => void;
}

enum COMPLETE_STATUS {
  ALL = '',
  COMPLETED = 'true',
  NOT_COMPLETED = 'false',
}

export function Tickets({ tickets, users, fetchTickets }: TicketsProps) {
  const navigate = useNavigate();
  const [ticketDescription, setTicketDescription] = useState('');
  const [isAddingTicket, setIsAddingTicket] = useState(false);

  const [filterCompleteStatus, setFilterCompleteStatus] =
    useState<COMPLETE_STATUS>(COMPLETE_STATUS.ALL);

  const getAssignee = (id: number | null) => {
    if (id === null) {
      return undefined;
    }
    return users.find((u) => u.id === id);
  };

  const handleGoToDetailPage = (ticketId: number) => {
    navigate(`/${ticketId}`);
  };

  const handleChangeTicketDescription = (e: any) => {
    setTicketDescription(e.target.value);
  };

  const handleAddTicket = async () => {
    if (!ticketDescription) return;

    setIsAddingTicket(true);
    await axios.post('/api/tickets', {
      description: ticketDescription,
    });
    setIsAddingTicket(false);
    setTicketDescription('');
  };

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  return (
    <div className={styles['tickets']}>
      <h2>Tickets</h2>
      <input
        type="text"
        placeholder="Enter ticket description"
        onChange={handleChangeTicketDescription}
        value={ticketDescription}
      />
      <button onClick={handleAddTicket} disabled={isAddingTicket}>
        Add ticket
      </button>

      {/* //add filter by completed */}
      <select
        onChange={(e) =>
          setFilterCompleteStatus(e.target.value as COMPLETE_STATUS)
        }
        value={filterCompleteStatus}
      >
        <option value={COMPLETE_STATUS.ALL}>All</option>
        <option value={COMPLETE_STATUS.COMPLETED}>Completed</option>
        <option value={COMPLETE_STATUS.NOT_COMPLETED}>Not completed</option>
      </select>

      {tickets ? (
        <div>
          {tickets
            .filter((ticket) => {
              if (filterCompleteStatus === COMPLETE_STATUS.ALL) {
                return true;
              }
              return (
                ticket.completed ===
                (filterCompleteStatus === COMPLETE_STATUS.COMPLETED)
              );
            })
            .map((t) => (
              <div key={t.id}>
                <SingleTicket
                  ticket={t}
                  user={getAssignee(t.assigneeId)}
                  users={users}
                  readOnly
                />
                <button onClick={() => handleGoToDetailPage(t.id)}>
                  Go to detail page
                </button>
              </div>
            ))}
        </div>
      ) : (
        <span>...</span>
      )}
    </div>
  );
}

export default Tickets;
