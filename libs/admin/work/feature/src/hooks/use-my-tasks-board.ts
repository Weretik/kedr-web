import {
  useChangeMyWorkTaskStatusMutation,
  useCreateAdminWorkTaskMutation,
  useCreateMyWorkTaskMutation,
  useDeleteMyWorkTaskMutation,
  useGetMyWorkTasksQuery,
  useSetMyWorkTaskStepMutation,
  useUpdateMyWorkTaskMutation,
} from '@admin/work/data-access';
import { useState } from 'react';

import { workErrorMessage } from '../errors/work-error-message';

import type { WorkAssignees } from '../work.routes';
import type { WorkTask, WorkTaskInput, WorkTaskStatus } from '@admin/work/model';

/** Which right panel of the own board is open. */
export type MyTaskPanel =
  { kind: 'new' } | { kind: 'edit'; task: WorkTask } | { kind: 'done'; task: WorkTask };

interface MyTasksBoardOptions {
  /** The page header button sets this to open «Нова задача». */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (message: string) => void;
  /** For an administrator: people a new task may be given to. Null for everyone else. */
  assignees: WorkAssignees | null;
}

/** Controller of the own board: tasks, the open panel, and every save, move, and delete. */
export function useMyTasksBoard({
  assignees,
  creating,
  onCreatingChange,
  onNotice,
}: MyTasksBoardOptions) {
  const tasks = useGetMyWorkTasksQuery();
  const [create, created] = useCreateMyWorkTaskMutation();
  const [update, updated] = useUpdateMyWorkTaskMutation();
  const [changeStatus, moved] = useChangeMyWorkTaskStatusMutation();
  const [remove, removed] = useDeleteMyWorkTaskMutation();
  const [give, given] = useCreateAdminWorkTaskMutation();
  const [setStep] = useSetMyWorkTaskStepMutation();
  const [assigneeId, setAssigneeId] = useState<string | null>(null);
  const [editing, setEditing] = useState<MyTaskPanel | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [error, setError] = useState<string>();

  const current: MyTaskPanel | null = creating ? { kind: 'new' } : editing;
  const saving =
    created.isLoading ||
    updated.isLoading ||
    moved.isLoading ||
    removed.isLoading ||
    given.isLoading;
  const ownerId = assigneeId ?? assignees?.selfId ?? null;

  const close = () => {
    setEditing(null);
    setAssigneeId(null);
    setError(undefined);
    onCreatingChange(false);
  };

  const run = async (action: () => Promise<unknown>, notice: string) => {
    setError(undefined);
    try {
      await action();
      close();
      onNotice(notice);
    } catch (cause) {
      setError(workErrorMessage(cause));
    }
  };

  /** Runs a quick card action (move, step) and reports a failure as a notice. */
  const onCard = async (task: WorkTask, action: () => Promise<unknown>) => {
    setMovingId(task.id);
    try {
      await action();
    } catch (cause) {
      onNotice(workErrorMessage(cause));
    }
    setMovingId(null);
  };

  const save = (input: WorkTaskInput) => {
    if (current?.kind === 'edit')
      void run(() => update({ id: current.task.id, input }).unwrap(), 'Задачу збережено.');
    else if (assignees && ownerId && ownerId !== assignees.selfId) {
      const name = assignees.people.find((person) => person.id === ownerId)?.name ?? '';
      void run(
        () => give({ ownerUserId: ownerId, input }).unwrap(),
        `Задачу додано в «План»: ${name}.`,
      );
    } else void run(() => create(input).unwrap(), 'Задачу додано в «План».');
  };

  const edit = (task: WorkTask) => {
    setError(undefined);
    setEditing({ kind: 'edit', task });
  };

  const move = (task: WorkTask, status: WorkTaskStatus) => {
    if (status === 'Done') {
      setError(undefined);
      setEditing({ kind: 'done', task });
      return;
    }
    void onCard(task, () => changeStatus({ id: task.id, status }).unwrap());
  };

  const toggleStep = (task: WorkTask, index: number, isDone: boolean) =>
    void onCard(task, () => setStep({ id: task.id, index, isDone }).unwrap());

  const deleteCurrent = () => {
    if (current?.kind !== 'edit') return;
    void run(() => remove(current.task.id).unwrap(), 'Задачу видалено.');
  };

  const finish = (result: string) => {
    if (current?.kind !== 'done') return;
    void run(
      () => changeStatus({ id: current.task.id, status: 'Done', result }).unwrap(),
      'Задачу виконано.',
    );
  };

  return {
    tasks,
    current,
    error,
    saving,
    ownerId,
    movingId,
    setAssigneeId,
    close,
    save,
    edit,
    move,
    toggleStep,
    deleteCurrent,
    finish,
  };
}
