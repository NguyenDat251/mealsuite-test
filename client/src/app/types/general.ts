import { Ticket } from '@acme/shared-models';

export type AssigneeId = Ticket['assigneeId'];
export type Completed = Ticket['completed'];

export type OnChangeCompletedStatus = (
  ticket: Ticket,
  isCompleted: Completed
) => void;
export type OnChangeAssignee = (ticket: Ticket, assigneeId: AssigneeId) => void;
