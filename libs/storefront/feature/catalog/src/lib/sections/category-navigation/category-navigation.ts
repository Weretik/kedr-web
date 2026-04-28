import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';

import { ProductListPageState } from '../../pages/product-list/product-list.page-state';
import {
  buildCatalogFiltersMenuStructure,
  type FilterMenuItem,
} from '../product-list-filters-bar/product-list-filters-catalog.builder';

type CategoryNavigationCard = {
  slug: string;
  label: string;
  parentLabel: string | null;
  image: string;
  isSelected: boolean;
  isDisabled: boolean;
};

type SiblingGroupResult = {
  items: FilterMenuItem[];
  parentLabel: string | null;
};

type CategoryNodeContext = {
  node: FilterMenuItem;
  parentNode: FilterMenuItem | null;
  siblingItems: FilterMenuItem[];
};

const CATEGORY_IMAGE_FALLBACK = 'assets/images/categories/other.jpg';

@Component({
  selector: 'lib-category-navigation',
  imports: [],
  templateUrl: './category-navigation.html',
  styleUrl: './category-navigation.css',
})
export class CategoryNavigation {
  readonly categorySlug = input<string | null>(null);

  private readonly pageState = inject(ProductListPageState);
  private readonly transloco = inject(TranslocoService);
  private readonly activeLang = toSignal(this.transloco.langChanges$, {
    initialValue: this.transloco.getActiveLang(),
  });

  readonly cards = computed<CategoryNavigationCard[]>(() => {
    this.activeLang();

    const selectedSlug = this.categorySlug();
    const tree = buildCatalogFiltersMenuStructure((key) =>
      this.transloco.translate(key),
    );
    const navigationGroup = this.resolveNavigationGroup(selectedSlug, tree);
    const selectedContext = selectedSlug
      ? this.findCategoryContext(selectedSlug, tree)
      : null;
    const selectedNodeChildren = selectedContext?.node.items as
      | FilterMenuItem[]
      | undefined;
    const isSelectedLeafCategory =
      !!selectedSlug && !selectedNodeChildren?.length;

    return navigationGroup.items
      .filter(
        (item): item is FilterMenuItem & { categorySlug: string } =>
          !!item.categorySlug,
      )
      .map((item) => {
        const isSelected = item.categorySlug === selectedSlug;
        return {
          slug: item.categorySlug,
          label: item.label ?? item.categorySlug,
          parentLabel:
            navigationGroup.parentLabel &&
            navigationGroup.parentLabel !== (item.label ?? item.categorySlug)
              ? navigationGroup.parentLabel
              : null,
          image: item.image ?? CATEGORY_IMAGE_FALLBACK,
          isSelected,
          isDisabled: isSelectedLeafCategory && isSelected,
        };
      });
  });

  public goToCategory(slug: string): void {
    if (!slug || slug === this.categorySlug()) return;
    this.pageState.goToCategory(slug);
  }

  private resolveNavigationGroup(
    slug: string | null,
    items: FilterMenuItem[],
  ): SiblingGroupResult {
    if (!items.length) return { items: [], parentLabel: null };
    if (!slug) return this.getDefaultGroup(items);

    const context = this.findCategoryContext(slug, items);
    if (!context) return { items: [], parentLabel: null };

    const nodeChildren = context.node.items as FilterMenuItem[] | undefined;
    const hasChildren = !!nodeChildren?.length;

    return hasChildren
      ? {
          items: nodeChildren,
          parentLabel: context.node.label ?? null,
        }
      : {
          items: context.siblingItems,
          parentLabel: context.parentNode?.label ?? null,
        };
  }

  private getDefaultGroup(items: FilterMenuItem[]): SiblingGroupResult {
    const hardwareRoot = items[0];
    const rootChildren = hardwareRoot?.items as FilterMenuItem[] | undefined;
    return {
      items: rootChildren?.length ? rootChildren : items,
      parentLabel: hardwareRoot?.label ?? null,
    };
  }

  private findCategoryContext(
    slug: string,
    items: FilterMenuItem[],
  ): CategoryNodeContext | null {
    const queue: CategoryNodeContext[] = items.map((node) => ({
      node,
      siblingItems: items,
      parentNode: null,
    }));

    while (queue.length) {
      const currentContext = queue.shift();
      if (!currentContext) continue;

      if (currentContext.node.categorySlug === slug) {
        return currentContext;
      }

      const childItems = currentContext.node.items as
        | FilterMenuItem[]
        | undefined;
      if (!childItems?.length) continue;

      for (const child of childItems) {
        queue.push({
          siblingItems: childItems,
          parentNode: currentContext.node,
          node: child,
        });
      }
    }

    return null;
  }
}
