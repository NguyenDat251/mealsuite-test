import { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Ticket, User } from '@acme/shared-models';
import axios from 'axios';
import { useCallback } from 'react';

import styles from './app.module.css';
import Tickets from './components/tickets/tickets';
import TicketDetails from './components/ticketDetails/ticketDetails';

const App = () => {
  const [tickets, setTickets] = useState([] as Ticket[]);
  const [users, setUsers] = useState([] as User[]);

  const fetchTickets = useCallback(async () => {
    try {
      const data = await axios.get('/api/tickets');
      setTickets(data.data);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Very basic way to synchronize state with server.
  // Feel free to use any state/fetch library you want (e.g. react-query, xstate, redux, etc.).
  useEffect(() => {
    async function fetchUsers() {
      const data = await fetch('/api/users').then();
      setUsers(await data.json());
    }

    fetchUsers();
  }, []);

  return (
    <div className={styles['app']}>
      <h1>Ticketing App</h1>
      <Routes>
        <Route
          path="/"
          element={
            <Tickets
              tickets={tickets}
              users={users}
              fetchTickets={fetchTickets}
            />
          }
        />
        {/* Hint: Try `npx nx g component TicketDetails --project=client --no-export` to generate this component  */}
        <Route
          path="/:id"
          element={
            <TicketDetails
              tickets={tickets}
              users={users}
              setTickets={setTickets}
            />
          }
        />
      </Routes>
    </div>
  );
};

export default App;
