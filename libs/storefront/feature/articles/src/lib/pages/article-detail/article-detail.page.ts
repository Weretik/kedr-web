import { NgStyle } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { map } from 'rxjs';

import { BLOGS } from '../article-list/article-list.data';

@Component({
  selector: 'lib-article-detail.page',
  imports: [NgStyle, RouterLink],
  templateUrl: './article-detail.page.html',
  styleUrl: './article-detail.page.css',
})
export class ArticleDetailPage {
  private readonly route = inject(ActivatedRoute);

  private readonly articleId = toSignal(
    this.route.paramMap.pipe(map((params) => Number(params.get('id')))),
    { initialValue: Number(this.route.snapshot.paramMap.get('id')) },
  );

  readonly article = computed(() =>
    BLOGS.find((item) => item.id === this.articleId()),
  );

  readonly otherArticles = computed(() => {
    const currentId = this.article()?.id;
    return BLOGS.filter((item) => item.id !== currentId);
  });

  readonly paragraphs = computed(
    () => this.article()?.content.split('\n\n').filter(Boolean) ?? [],
  );
}
