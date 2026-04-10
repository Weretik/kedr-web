import { SlicePipe } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { PageHeader, PageHeaderConfig } from '@storefront/ui';
import { LocaleNavigationService } from '@storefront/util';

import { Blog, buildBlogs } from './article-list.data';

@Component({
  selector: 'lib-article-list.page',
  imports: [PageHeader, SlicePipe, RouterLink, TranslocoPipe],
  templateUrl: './article-list.page.html',
  styleUrl: './article-list.page.css',
})
export class ArticleListPage {
  private readonly transloco = inject(TranslocoService);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly headerConfig = computed<PageHeaderConfig>(() => {
    this.activeLang();
    return {
      title: this.transloco.translate('articles.page.title'),
      breadcrumbs: [
        { label: this.transloco.translate('articles.page.breadcrumb.about') },
        {
          label: this.transloco.translate('articles.page.breadcrumb.articles'),
        },
      ],
      showSearch: false,
    };
  });

  readonly blogs = computed<Blog[]>(() => {
    const lang = this.activeLang() === 'ru' ? 'ru' : 'uk';
    return buildBlogs(lang);
  });

  articleLink(id: number): string[] {
    return this.localeNavigation.localizedSegments('articles', String(id));
  }
}
