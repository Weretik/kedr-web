import { baseApi } from '@admin/shared/api-client';

import {
  mapScheduledTask,
  mapScheduledTaskRuns,
  mapScheduledTasks,
  toScheduleBody,
} from '../mappers/scheduled-task.mapper';

import type {
  ScheduledTask,
  ScheduledTaskRun,
  ScheduledTaskScheduleInput,
} from '@admin/scheduling/model';

const url = '/api/admin/scheduling/tasks';
const tasksTag = { type: 'ScheduledTasks' as const, id: 'LIST' };
const runsTag = (key: string) => ({ type: 'ScheduledTaskRuns' as const, id: key });
const taskUrl = (key: string, rest: string) => `${url}/${encodeURIComponent(key)}/${rest}`;

/** «Фонові задачі»: the list, the history of one task, the schedule and «Запустити зараз». */
export const adminSchedulingApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScheduledTasks', 'ScheduledTaskRuns'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getScheduledTasks: build.query<ScheduledTask[], void>({
        query: () => ({ url, method: 'GET' }),
        transformResponse: mapScheduledTasks,
        providesTags: [tasksTag],
      }),
      getScheduledTaskRuns: build.query<ScheduledTaskRun[], string>({
        query: (key) => ({ url: taskUrl(key, 'runs'), method: 'GET' }),
        transformResponse: mapScheduledTaskRuns,
        providesTags: (_result, _error, key) => [runsTag(key)],
      }),
      updateScheduledTaskSchedule: build.mutation<
        ScheduledTask,
        { key: string; input: ScheduledTaskScheduleInput }
      >({
        query: ({ key, input }) => ({
          url: taskUrl(key, 'schedule'),
          method: 'PUT',
          data: toScheduleBody(input),
        }),
        transformResponse: mapScheduledTask,
        invalidatesTags: [tasksTag],
      }),
      runScheduledTaskNow: build.mutation<ScheduledTask, string>({
        query: (key) => ({ url: taskUrl(key, 'run'), method: 'POST' }),
        transformResponse: mapScheduledTask,
        invalidatesTags: (_result, _error, key) => [tasksTag, runsTag(key)],
      }),
    }),
  });

export const {
  useGetScheduledTaskRunsQuery,
  useGetScheduledTasksQuery,
  useRunScheduledTaskNowMutation,
  useUpdateScheduledTaskScheduleMutation,
} = adminSchedulingApi;
