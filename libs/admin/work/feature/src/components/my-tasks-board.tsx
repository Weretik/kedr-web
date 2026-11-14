import { emptyWorkTaskInput, workTaskInputOf } from '@admin/work/model';
import { WorkAssigneeField, WorkBoard, WorkTaskDonePanel, WorkTaskPanel } from '@admin/work/ui';
import { Alert, Button } from '@mui/material';

import { useMyTasksBoard } from '../hooks/use-my-tasks-board';

import type { WorkAssignees } from '../work.routes';

interface MyTasksBoardProps {
  /** The page header button sets this to open «Нова задача». */
  creating: boolean;
  onCreatingChange: (creating: boolean) => void;
  onNotice: (message: string) => void;
  /** For an administrator: people a new task may be given to. Null for everyone else. */
  assignees: WorkAssignees | null;
}

/** The own board with its right panels: new task, edit, and «Готово» with the result. */
export function MyTasksBoard(props: MyTasksBoardProps) {
  const board = useMyTasksBoard(props);
  const { assignees } = props;
  const { current, error, ownerId, saving, tasks } = board;

  if (tasks.isError)
    return (
      <Alert action={<Button onClick={() => tasks.refetch()}>Повторити</Button>} severity="error">
        Не вдалося завантажити задачі. Спробуйте ще раз.
      </Alert>
    );

  return (
    <>
      <WorkBoard
        busyTaskId={board.movingId}
        loading={tasks.isLoading}
        onEdit={board.edit}
        onMove={board.move}
        onToggleStep={board.toggleStep}
        tasks={tasks.data ?? []}
      />
      {current?.kind === 'new' ? (
        <WorkTaskPanel
          error={error}
          initial={emptyWorkTaskInput}
          key="new"
          leadingFields={
            assignees && ownerId ? (
              <WorkAssigneeField
                disabled={saving}
                onChange={board.setAssigneeId}
                people={assignees.people}
                value={ownerId}
              />
            ) : undefined
          }
          onCancel={board.close}
          onSave={board.save}
          saving={saving}
          title="Нова задача"
        />
      ) : null}
      {current?.kind === 'edit' ? (
        <WorkTaskPanel
          error={error}
          initial={workTaskInputOf(current.task)}
          key={current.task.id}
          onCancel={board.close}
          onDelete={board.deleteCurrent}
          onSave={board.save}
          saving={saving}
          subtitle={current.task.createdByOwner ? undefined : 'Від адміністратора'}
          title="Задача"
        />
      ) : null}
      {current?.kind === 'done' ? (
        <WorkTaskDonePanel
          error={error}
          key={current.task.id}
          onCancel={board.close}
          onDone={board.finish}
          saving={saving}
          task={current.task}
        />
      ) : null}
    </>
  );
}
