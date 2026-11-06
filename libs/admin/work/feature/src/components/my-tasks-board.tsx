import {
  useChangeMyWorkTaskStatusMutation,
  useCreateMyWorkTaskMutation,
  useDeleteMyWorkTaskMutation,
  useGetMyWorkTasksQuery,
  useUpdateMyWorkTaskMutation,
} from '@admin/work/data-access';
import { emptyWorkTaskInput } from '@admin/work/model';
import { WorkBoard, WorkTaskDonePanel, WorkTaskPanel } from '@admin/work/ui';
import { Alert, Button } from '@mui/material';
import { useState } from 'react';

import { workErrorMessage } from '../errors/work-error-message';

import type { WorkTask, WorkTaskInput, WorkTaskStatus } from '@admin/work/model';

type Editing =
  { kind: 'new' } | { kind: 'edit'; task: WorkTask } | { kind: 'done'; task: WorkTask };

interface MyTasksBoardProps {
  /** The page header button sets this to open «Нова задача». */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (message: string) => void;
}

/** The own board with its right panels: new task, edit, and «Готово» with the result. */
export function MyTasksBoard({ creating, onCreatingChange, onNotice }: MyTasksBoardProps) {
  const tasks = useGetMyWorkTasksQuery();
  const [create, created] = useCreateMyWorkTaskMutation();
  const [update, updated] = useUpdateMyWorkTaskMutation();
  const [move, moved] = useChangeMyWorkTaskStatusMutation();
  const [remove, removed] = useDeleteMyWorkTaskMutation();
  const [editing, setEditing] = useState<Editing | null>(null);
  const [movingId, setMovingId] = useState<number | null>(null);
  const [error, setError] = useState<string>();

  const current: Editing | null = creating ? { kind: 'new' } : editing;
  const saving = created.isLoading || updated.isLoading || moved.isLoading || removed.isLoading;

  const close = () => {
    setEditing(null);
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

  const save = (input: WorkTaskInput) => {
    if (current?.kind === 'edit')
      void run(() => update({ id: current.task.id, input }).unwrap(), 'Задачу збережено.');
    else void run(() => create(input).unwrap(), 'Задачу додано в «План».');
  };

  const onMove = async (task: WorkTask, status: WorkTaskStatus) => {
    if (status === 'Done') {
      setError(undefined);
      setEditing({ kind: 'done', task });
      return;
    }
    setMovingId(task.id);
    try {
      await move({ id: task.id, status }).unwrap();
    } catch (cause) {
      onNotice(workErrorMessage(cause));
    } finally {
      setMovingId(null);
    }
  };

  if (tasks.isError)
    return (
      <Alert action={<Button onClick={() => tasks.refetch()}>Повторити</Button>} severity="error">
        Не вдалося завантажити задачі. Спробуйте ще раз.
      </Alert>
    );

  return (
    <>
      <WorkBoard
        busyTaskId={movingId}
        loading={tasks.isLoading}
        onEdit={(task) => {
          setError(undefined);
          setEditing({ kind: 'edit', task });
        }}
        onMove={(task, status) => void onMove(task, status)}
        tasks={tasks.data ?? []}
      />
      {current?.kind === 'new' ? (
        <WorkTaskPanel
          error={error}
          initial={emptyWorkTaskInput}
          key="new"
          onCancel={close}
          onSave={save}
          saving={saving}
          title="Нова задача"
        />
      ) : null}
      {current?.kind === 'edit' ? (
        <WorkTaskPanel
          error={error}
          initial={{ title: current.task.title, details: current.task.details ?? '' }}
          key={current.task.id}
          onCancel={close}
          onDelete={() => void run(() => remove(current.task.id).unwrap(), 'Задачу видалено.')}
          onSave={save}
          saving={saving}
          subtitle={current.task.createdByOwner ? undefined : 'Від адміністратора'}
          title="Задача"
        />
      ) : null}
      {current?.kind === 'done' ? (
        <WorkTaskDonePanel
          error={error}
          key={current.task.id}
          onCancel={close}
          onDone={(result) =>
            void run(
              () => move({ id: current.task.id, status: 'Done', result }).unwrap(),
              'Задачу виконано.',
            )
          }
          saving={saving}
          task={current.task}
        />
      ) : null}
    </>
  );
}
