import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

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

const tasksTag = { type: 'ScheduledTasks' as const, id: 'LIST' };
const runsTag = (key: string) => ({ type: 'ScheduledTaskRuns' as const, id: key });
/** «Фонові задачі»: the list, the history of one task, the schedule and «Запустити зараз». */
export const adminSchedulingApi = baseApi
  .enhanceEndpoints({ addTagTypes: ['ScheduledTasks', 'ScheduledTaskRuns'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getScheduledTasks: build.query<ScheduledTask[], void>({
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/admin/scheduling/tasks', { signal }), mapScheduledTasks),
        providesTags: [tasksTag],
      }),
      getScheduledTaskRuns: build.query<ScheduledTaskRun[], string>({
        queryFn: (key, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/scheduling/tasks/{key}/runs', {
              params: { path: { key } },
              signal,
            }),
            mapScheduledTaskRuns,
          ),
        providesTags: (_result, _error, key) => [runsTag(key)],
      }),
      updateScheduledTaskSchedule: build.mutation<
        ScheduledTask,
        { key: string; input: ScheduledTaskScheduleInput }
      >({
        queryFn: ({ key, input }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/admin/scheduling/tasks/{key}/schedule', {
              params: { path: { key } },
              body: toScheduleBody(input),
              signal,
            }),
            mapScheduledTask,
          ),
        invalidatesTags: [tasksTag],
      }),
      runScheduledTaskNow: build.mutation<ScheduledTask, string>({
        queryFn: (key, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/scheduling/tasks/{key}/run', {
              params: { path: { key } },
              signal,
            }),
            mapScheduledTask,
          ),
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
