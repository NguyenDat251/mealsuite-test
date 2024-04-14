import { useEffect } from 'react';
import SingleTicket from '../singleTicket/singleTicket';
import { useParams } from 'react-router-dom';
import axios from '../../../utils/axios';
import { Ticket, User } from '@acme/shared-models';
import { useState } from 'react';
import {
  OnChangeAssignee,
  OnChangeCompletedStatus,
} from '../../../types/general';
import debounce from 'lodash-es/debounce';
import { useNavigate } from 'react-router-dom';

const requestChangeAssignee: OnChangeAssignee = debounce(
  async (ticket, assigneeId) => {
    const ticketId = ticket.id;

    //if the assignee is the same, no need to make a request
    // if (assigneeId === ticket.assigneeId) {
    //   return;
    // }

    await axios.put(`/api/tickets/${ticketId}/unassign`);

    axios.put(`/api/tickets/${ticketId}/assign/${assigneeId}`);
  },
  1000
);

const requestChangeCompletedStatus: OnChangeCompletedStatus = debounce(
  (ticket, isCompleted) => {
    const ticketId = ticket.id;

    //if the completed status is the same, no need to make a request
    // if (isCompleted === ticket.completed) {
    //   return;
    // }

    if (isCompleted) {
      axios.put(`/api/tickets/${ticketId}/complete`);
    } else {
      axios.delete(`/api/tickets/${ticketId}/complete`);
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

  const getAssignee = (id: number | null) => {
    if (id === null) {
      return undefined;
    }
    return users.find((u) => u.id === id);
  };

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

  const onChangeAssignee: OnChangeAssignee = (ticket, assigneeId) => {
    requestChangeAssignee(ticket, assigneeId);

    setTickets((tickets) => {
      const modifiedTicket = tickets.find((t) => t.id === ticket.id);

      if (!modifiedTicket) {
        return tickets;
      }

      modifiedTicket.assigneeId = assigneeId;

      return [...tickets];
    });
  };

  const handleGoBack = () => {
    //go back to the tickets page
    navigate('/');
  };

  useEffect(() => {
    if (!ticket) {
      //if ticket is not found, fetch single ticket
      axios.get(`/api/tickets/${id}`).then((res) => {
        const ticket = res.data;
        setTickets((tickets) => {
          return [...tickets, ticket];
        });
      });
    }
  }, [id, ticket, setTickets]);

  return (
    <div>
      <h2>Ticket Details</h2>
      <button onClick={handleGoBack}>Go back</button>
      {ticket && (
        <div>
          <SingleTicket
            key={ticket.id}
            ticket={ticket}
            user={getAssignee(ticket.assigneeId)}
            users={users}
            onChangeCompletedStatus={onChangeCompletedStatus}
            onChangeAssignee={onChangeAssignee}
          />
        </div>
      )}
    </div>
  );
}

export default TicketDetails;
