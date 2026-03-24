import { SlicePipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';

import { BLOGS, Blog } from './article-list.data';

@Component({
  selector: 'lib-article-list.page',
  imports: [PageHeader, SlicePipe, RouterLink],
  templateUrl: './article-list.page.html',
  styleUrl: './article-list.page.css',
})
export class ArticleListPage {
  headerConfig: PageHeaderConfig = {
    title: 'Статті',
    breadcrumbs: [{ label: 'Про нас' }, { label: 'Статті' }],
    showSearch: false,
  };

  blogs: Blog[] = BLOGS;
}
