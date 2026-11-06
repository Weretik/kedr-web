import type { components } from '@shared/api-contracts';

export type WorkTaskDto = components['schemas']['WorkTask'];
export type WorkReportDto = components['schemas']['WorkReport'];
export type SaveWorkTaskBody = components['schemas']['SaveWorkTaskRequest'];
export type SetWorkTaskStepBody = components['schemas']['SetWorkTaskStepRequest'];
export type ChangeWorkTaskStatusBody = components['schemas']['ChangeWorkTaskStatusRequest'];
export type CreateWorkTaskForUserBody = components['schemas']['CreateWorkTaskForUserRequest'];
