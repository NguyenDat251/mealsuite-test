import { useEffect } from 'react';
import SingleTicket from '../singleTicket/singleTicket';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import { Ticket, User } from '@acme/shared-models';
import {
  OnChangeAssignee,
  OnChangeCompletedStatus,
} from '../../../types/general';
import debounce from 'lodash-es/debounce';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';

const requestChangeAssignee: OnChangeAssignee = async (ticket, assigneeId) => {
  const ticketId = ticket.id;

  try {
    await axios.put(`/api/tickets/${ticketId}/unassign`);
    axios.put(`/api/tickets/${ticketId}/assign/${assigneeId}`);
  } catch (e) {
    console.error(e);
  }
};

const requestChangeCompletedStatus: OnChangeCompletedStatus = debounce(
  (ticket, isCompleted) => {
    const ticketId = ticket.id;

    try {
      if (isCompleted) {
        axios.put(`/api/tickets/${ticketId}/complete`);
      } else {
        axios.delete(`/api/tickets/${ticketId}/complete`);
      }
    } catch (e) {
      console.error(e);
    }
  },
  500
);

function TicketDetails({
  users,
  tickets,
  setTickets,
}: {
  users: User[];
  tickets: Ticket[];
  setTickets: React.Dispatch<React.SetStateAction<Ticket[]>>;
}) {
  //get ticket id from query params with react router
  const { id } = useParams();
  const navigate = useNavigate();
  const ticket = tickets.find((t) => id && t.id === parseInt(id));
  const [isUpdatingAssignee, setIsUpdatingAssignee] = useState(false);

  const onChangeCompletedStatus: OnChangeCompletedStatus = (
    ticket,
    isCompleted
  ) => {
    requestChangeCompletedStatus(ticket, isCompleted);

    setTickets((tickets) => {
      const modifiedTicket = tickets.find((t) => t.id === ticket.id);

      if (!modifiedTicket) {
        return tickets;
      }

      modifiedTicket.completed = isCompleted;

      return [...tickets];
    });
  };

  const onChangeAssignee: OnChangeAssignee = async (ticket, assigneeId) => {
    setTickets((tickets) => {
      const modifiedTicket = tickets.find((t) => t.id === ticket.id);

      if (!modifiedTicket) {
        return tickets;
      }

      modifiedTicket.assigneeId = assigneeId;

      return [...tickets];
    });

    setIsUpdatingAssignee(true);
    await requestChangeAssignee(ticket, assigneeId);
    setIsUpdatingAssignee(false);
  };

  const handleGoBack = () => {
    //go back to the tickets page
    navigate('/');
  };

  useEffect(() => {
    if (!ticket) {
      //if ticket is not found, fetch single ticket
      try {
        axios.get(`/api/tickets/${id}`).then((res) => {
          const ticket = res.data;
          setTickets((tickets) => {
            return [...tickets, ticket];
          });
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, [id, ticket, setTickets]);

  return (
    <div>
      <h2>Ticket Details</h2>
      <button disabled={isUpdatingAssignee} onClick={handleGoBack}>
        Go back
      </button>
      {ticket ? (
        <div>
          <SingleTicket
            key={ticket.id}
            ticket={ticket}
            users={users}
            onChangeCompletedStatus={onChangeCompletedStatus}
            onChangeAssignee={onChangeAssignee}
          />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}

export default TicketDetails;
