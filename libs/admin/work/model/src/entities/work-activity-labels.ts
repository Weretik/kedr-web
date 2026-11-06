import type { WorkActivityMethod } from './work-report';

/** Admin sections in Ukrainian by the server area name (controller without `Admin`). */
export const workActivityAreaLabels: Readonly<Record<string, string>> = {
  Articles: 'Статті',
  CatalogAttributes: 'Ознаки',
  Categories: 'Категорії',
  CompanyContacts: 'Контакти',
  CompanyRequisites: 'Реквізити',
  Customers: 'Клієнти',
  Gallery: 'Галерея',
  HomeBlocks: 'Головна сторінка',
  LegalDocuments: 'Документи',
  MediaFiles: 'Медіа: файли',
  MediaFolders: 'Медіа: папки',
  OrderWorkspace: 'Поточне замовлення',
  Orders: 'Замовлення',
  PageSeo: 'SEO сторінок',
  ProductAttributes: 'Властивості товару',
  ProductGroups: 'Групи варіантів',
  Products: 'Товари',
  SiteModels: 'Моделі',
  SiteRefresh: 'Оновлення сайту',
  Users: 'Користувачі',
  WholesalePage: 'Співпраця',
};

export const workActivityMethodLabels: Readonly<Record<WorkActivityMethod, string>> = {
  DELETE: 'видалено',
  PATCH: 'змінено',
  POST: 'додано або виконано',
  PUT: 'змінено',
};
