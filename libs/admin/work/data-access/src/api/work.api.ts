import { baseApi } from '@admin/shared/api-client';

import {
  mapWorkReport,
  mapWorkTask,
  mapWorkTasks,
  toSaveWorkTaskBody,
} from '../mappers/work.mapper';

import type {
  ChangeWorkTaskStatusBody,
  CreateWorkTaskForUserBody,
} from '../contracts/work.contract';
import type {
  WorkPeriod,
  WorkReport,
  WorkTask,
  WorkTaskInput,
  WorkTaskStatus,
} from '@admin/work/model';

const tasksTag = 'WorkTasks' as const;
const reportTag = 'WorkReport' as const;

export const workApi = baseApi
  .enhanceEndpoints({ addTagTypes: [tasksTag, reportTag] })
  .injectEndpoints({
    endpoints: (build) => ({
      getMyWorkTasks: build.query<WorkTask[], void>({
        query: () => ({ url: '/api/work/tasks', method: 'GET' }),
        transformResponse: mapWorkTasks,
        providesTags: [tasksTag],
      }),
      createMyWorkTask: build.mutation<WorkTask, WorkTaskInput>({
        query: (input) => ({
          url: '/api/work/tasks',
          method: 'POST',
          data: toSaveWorkTaskBody(input),
        }),
        transformResponse: mapWorkTask,
        invalidatesTags: [tasksTag, reportTag],
      }),
      updateMyWorkTask: build.mutation<WorkTask, { id: number; input: WorkTaskInput }>({
        query: ({ id, input }) => ({
          url: `/api/work/tasks/${id}`,
          method: 'PUT',
          data: toSaveWorkTaskBody(input),
        }),
        transformResponse: mapWorkTask,
        invalidatesTags: [tasksTag, reportTag],
      }),
      changeMyWorkTaskStatus: build.mutation<
        WorkTask,
        { id: number; status: WorkTaskStatus; result?: string }
      >({
        query: ({ id, result, status }) => ({
          url: `/api/work/tasks/${id}/status`,
          method: 'PUT',
          data: { status, result: result?.trim() || null } satisfies ChangeWorkTaskStatusBody,
        }),
        transformResponse: mapWorkTask,
        invalidatesTags: [tasksTag, reportTag],
      }),
      deleteMyWorkTask: build.mutation<void, number>({
        query: (id) => ({ url: `/api/work/tasks/${id}`, method: 'DELETE' }),
        invalidatesTags: [tasksTag, reportTag],
      }),
      getMyWorkReport: build.query<WorkReport, WorkPeriod>({
        query: (period) => ({ url: '/api/work/report', method: 'GET', params: period }),
        transformResponse: mapWorkReport,
        providesTags: [reportTag],
      }),
      getAdminWorkReport: build.query<WorkReport, WorkPeriod & { userId: string }>({
        query: (params) => ({ url: '/api/admin/work/report', method: 'GET', params }),
        transformResponse: mapWorkReport,
        providesTags: [reportTag],
      }),
      createAdminWorkTask: build.mutation<WorkTask, { ownerUserId: string; input: WorkTaskInput }>({
        query: ({ input, ownerUserId }) => ({
          url: '/api/admin/work/tasks',
          method: 'POST',
          data: { ownerUserId, ...toSaveWorkTaskBody(input) } satisfies CreateWorkTaskForUserBody,
        }),
        transformResponse: mapWorkTask,
        invalidatesTags: [tasksTag, reportTag],
      }),
    }),
  });

export const {
  useChangeMyWorkTaskStatusMutation,
  useCreateAdminWorkTaskMutation,
  useCreateMyWorkTaskMutation,
  useDeleteMyWorkTaskMutation,
  useGetAdminWorkReportQuery,
  useGetMyWorkReportQuery,
  useGetMyWorkTasksQuery,
  useUpdateMyWorkTaskMutation,
} = workApi;
