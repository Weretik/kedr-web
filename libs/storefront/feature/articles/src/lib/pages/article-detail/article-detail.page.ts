import { NgStyle } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { TranslocoPipe, TranslocoService } from '@jsverse/transloco';
import { LocaleNavigationService } from '@storefront/util';
import { map } from 'rxjs';

import { buildBlogs } from '../article-list/article-list.data';

@Component({
  selector: 'lib-article-detail.page',
  imports: [NgStyle, RouterLink, TranslocoPipe],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.css',
})
export class ArticleDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly transloco = inject(TranslocoService);
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  private readonly articleId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  private readonly blogs = computed(() => {
    const lang = this.activeLang() === 'ru' ? 'ru' : 'uk';
    return buildBlogs(lang);
  });

  readonly article = computed(() =>
    this.blogs().find((item) => item.id === this.articleId()),
  );

  readonly otherArticles = computed(() => {
    const currentId = this.article()?.id;
    return this.blogs().filter((item) => item.id !== currentId);
  });

  readonly paragraphs = computed(
    () => this.article()?.content.split('\n\n').filter(Boolean) ?? [],
  );

  articleLink(id: number): string[] {
    return this.localeNavigation.localizedSegments('articles', String(id));
  }
}
