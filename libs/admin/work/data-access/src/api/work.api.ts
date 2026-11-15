import { apiCall, apiClient, baseApi } from '@admin/shared/api-client';

import {
  mapWorkReport,
  mapWorkTask,
  mapWorkTasks,
  toSaveWorkTaskBody,
} from '../mappers/work.mapper';

import type {
  ChangeWorkTaskStatusBody,
  SetWorkTaskStepBody,
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
        queryFn: (_arg, { signal }) =>
          apiCall(apiClient.GET('/api/work/tasks', { signal }), mapWorkTasks),
        providesTags: [tasksTag],
      }),
      createMyWorkTask: build.mutation<WorkTask, WorkTaskInput>({
        queryFn: (input, { signal }) =>
          apiCall(
            apiClient.POST('/api/work/tasks', { body: toSaveWorkTaskBody(input), signal }),
            mapWorkTask,
          ),
        invalidatesTags: [tasksTag, reportTag],
      }),
      updateMyWorkTask: build.mutation<WorkTask, { id: number; input: WorkTaskInput }>({
        queryFn: ({ id, input }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/work/tasks/{id}', {
              params: { path: { id } },
              body: toSaveWorkTaskBody(input),
              signal,
            }),
            mapWorkTask,
          ),
        invalidatesTags: [tasksTag, reportTag],
      }),
      changeMyWorkTaskStatus: build.mutation<
        WorkTask,
        { id: number; status: WorkTaskStatus; result?: string }
      >({
        queryFn: ({ id, result, status }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/work/tasks/{id}/status', {
              params: { path: { id } },
              body: { status, result: result?.trim() || null } satisfies ChangeWorkTaskStatusBody,
              signal,
            }),
            mapWorkTask,
          ),
        invalidatesTags: [tasksTag, reportTag],
      }),
      setMyWorkTaskStep: build.mutation<WorkTask, { id: number; index: number; isDone: boolean }>({
        queryFn: ({ id, index, isDone }, { signal }) =>
          apiCall(
            apiClient.PUT('/api/work/tasks/{id}/steps/{index}', {
              params: { path: { id, index } },
              body: { isDone } satisfies SetWorkTaskStepBody,
              signal,
            }),
            mapWorkTask,
          ),
        invalidatesTags: [tasksTag, reportTag],
      }),
      deleteMyWorkTask: build.mutation<void, number>({
        queryFn: (id, { signal }) =>
          apiCall(apiClient.DELETE('/api/work/tasks/{id}', { params: { path: { id } }, signal })),
        invalidatesTags: [tasksTag, reportTag],
      }),
      getMyWorkReport: build.query<WorkReport, WorkPeriod>({
        queryFn: (period, { signal }) =>
          apiCall(
            apiClient.GET('/api/work/report', { params: { query: period }, signal }),
            mapWorkReport,
          ),
        providesTags: [reportTag],
      }),
      getAdminWorkReport: build.query<WorkReport, WorkPeriod & { userId: string }>({
        queryFn: (params, { signal }) =>
          apiCall(
            apiClient.GET('/api/admin/work/report', { params: { query: params }, signal }),
            mapWorkReport,
          ),
        providesTags: [reportTag],
      }),
      createAdminWorkTask: build.mutation<WorkTask, { ownerUserId: string; input: WorkTaskInput }>({
        queryFn: ({ input, ownerUserId }, { signal }) =>
          apiCall(
            apiClient.POST('/api/admin/work/tasks', {
              body: {
                ownerUserId,
                ...toSaveWorkTaskBody(input),
              } satisfies CreateWorkTaskForUserBody,
              signal,
            }),
            mapWorkTask,
          ),
        invalidatesTags: [tasksTag, reportTag],
      }),
    }),
  });

export const {
  useChangeMyWorkTaskStatusMutation,
  useCreateAdminWorkTaskMutation,
  useCreateMyWorkTaskMutation,
  useDeleteMyWorkTaskMutation,
  useSetMyWorkTaskStepMutation,
  useGetAdminWorkReportQuery,
  useGetMyWorkReportQuery,
  useGetMyWorkTasksQuery,
  useUpdateMyWorkTaskMutation,
} = workApi;
