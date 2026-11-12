import AccountBalanceOutlinedIcon from '@mui/icons-material/AccountBalanceOutlined';
import AccountTreeOutlinedIcon from '@mui/icons-material/AccountTreeOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import CollectionsOutlinedIcon from '@mui/icons-material/CollectionsOutlined';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import GavelOutlinedIcon from '@mui/icons-material/GavelOutlined';
import HandshakeOutlinedIcon from '@mui/icons-material/HandshakeOutlined';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import InsightsOutlinedIcon from '@mui/icons-material/InsightsOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import LanguageOutlinedIcon from '@mui/icons-material/LanguageOutlined';
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import PhotoLibraryOutlinedIcon from '@mui/icons-material/PhotoLibraryOutlined';
import ReceiptLongOutlinedIcon from '@mui/icons-material/ReceiptLongOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import ShoppingBagOutlinedIcon from '@mui/icons-material/ShoppingBagOutlined';
import StorefrontOutlinedIcon from '@mui/icons-material/StorefrontOutlined';
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined';
import TravelExploreOutlinedIcon from '@mui/icons-material/TravelExploreOutlined';

import type { ReactNode } from 'react';

export interface NavigationItem {
  /** `admin`: only the Admin role; `userManagement`: whoever may manage users. Omitted: everyone. */
  access?: 'admin' | 'userManagement';
  icon: ReactNode;
  label: string;
  to: string;
}

export interface NavigationGroup {
  /** Shown on the block heading and for every item of the block when the drawer is collapsed. */
  icon: ReactNode;
  id: string;
  items: NavigationItem[];
  label: string;
}

/** Standalone first item, outside every group. */
export const overviewItem: NavigationItem = {
  icon: <DashboardOutlinedIcon />,
  label: 'Огляд',
  to: '/dashboard',
};

/**
 * Menu blocks, see «Navigation blocks» in docs/standards/admin/design-system.md.
 * A new page goes into the block by its subject; a block with no visible items is hidden.
 */
export const navigationGroups: NavigationGroup[] = [
  {
    icon: <ShoppingBagOutlinedIcon />,
    id: 'sales',
    label: 'Продаж',
    items: [
      { icon: <ReceiptLongOutlinedIcon />, label: 'Замовлення', to: '/orders' },
      { icon: <PeopleOutlinedIcon />, label: 'Клієнти', to: '/customers' },
    ],
  },
  {
    icon: <Inventory2OutlinedIcon />,
    id: 'catalog',
    label: 'Каталог',
    items: [
      { icon: <CategoryOutlinedIcon />, label: 'Товари', to: '/catalog' },
      { icon: <StorefrontOutlinedIcon />, label: 'Вітрина сайту', to: '/site-showcase' },
      { icon: <AccountTreeOutlinedIcon />, label: 'Категорії', to: '/categories' },
      { icon: <PhotoLibraryOutlinedIcon />, label: 'Медіа', to: '/media' },
    ],
  },
  {
    icon: <LanguageOutlinedIcon />,
    id: 'site',
    label: 'Сайт',
    items: [
      { icon: <HomeOutlinedIcon />, label: 'Головна сторінка', to: '/home-content' },
      { icon: <HandshakeOutlinedIcon />, label: 'Співпраця', to: '/wholesale-content' },
      { icon: <ArticleOutlinedIcon />, label: 'Статті', to: '/articles' },
      { icon: <ContactPhoneOutlinedIcon />, label: 'Контакти', to: '/company-contacts' },
      { icon: <GavelOutlinedIcon />, label: 'Документи', to: '/documents' },
      { icon: <CollectionsOutlinedIcon />, label: 'Галерея', to: '/gallery' },
      { icon: <TravelExploreOutlinedIcon />, label: 'SEO сторінок', to: '/page-seo' },
      { icon: <InsightsOutlinedIcon />, label: 'Налаштування SEO сайту', to: '/seo-settings' },
    ],
  },
  {
    icon: <AssignmentOutlinedIcon />,
    id: 'work',
    label: 'Робота',
    items: [{ icon: <TaskAltOutlinedIcon />, label: 'Мої задачі', to: '/my-tasks' }],
  },
  {
    icon: <SettingsOutlinedIcon />,
    id: 'system',
    label: 'Система',
    items: [
      {
        access: 'admin',
        icon: <AccountBalanceOutlinedIcon />,
        label: 'Реквізити',
        to: '/company-requisites',
      },
      {
        access: 'userManagement',
        icon: <ManageAccountsOutlinedIcon />,
        label: 'Користувачі',
        to: '/users',
      },
      {
        access: 'userManagement',
        icon: <AssessmentOutlinedIcon />,
        label: 'Звіт роботи',
        to: '/work-report',
      },
    ],
  },
];

export const isItemActive = (pathname: string, to: string) =>
  pathname === to || pathname.startsWith(`${to}/`);
