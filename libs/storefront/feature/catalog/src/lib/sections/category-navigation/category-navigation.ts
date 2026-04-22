import { Component, computed, inject, input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { TranslocoService } from '@jsverse/transloco';
import {
  CATALOG_HARDWARE_ORDER,
  CATALOG_HARDWARE_SECTIONS,
} from '@storefront/data-access';

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
};

type SiblingGroupResult = {
  items: FilterMenuItem[];
  parentLabel: string | null;
};

const CATEGORY_IMAGE_FALLBACK = 'assets/images/categories/other.jpg';

const sectionImagesBySlug: Record<string, string> =
  CATALOG_HARDWARE_ORDER.reduce(
    (acc, sectionKey) => {
      const section = CATALOG_HARDWARE_SECTIONS[sectionKey];
      const imageBySectionKey: Record<string, string> = {
        hinges: 'assets/images/categories/hinges.jpg',
        locks: 'assets/images/categories/locks.jpg',
        handles: 'assets/images/categories/handles.jpg',
        cylinders: 'assets/images/categories/cylinders.jpg',
        interiorMechanisms: 'assets/images/categories/interior-mechanisms.jpg',
        other: 'assets/images/categories/other.jpg',
      };

      acc[section.slug] = imageBySectionKey[sectionKey];

      for (const item of section.items) {
        acc[item.slug] = imageBySectionKey[sectionKey];
      }

      return acc;
    },
    {} as Record<string, string>,
  );

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

    const tree = buildCatalogFiltersMenuStructure((key) =>
      this.transloco.translate(key),
    );
    const siblingsGroup = this.findSiblingGroup(this.categorySlug(), tree);

    return siblingsGroup.items
      .filter(
        (item): item is FilterMenuItem & { categorySlug: string } =>
          !!item.categorySlug,
      )
      .map((item) => ({
        slug: item.categorySlug,
        label: item.label ?? item.categorySlug,
        parentLabel:
          siblingsGroup.parentLabel &&
          siblingsGroup.parentLabel !== (item.label ?? item.categorySlug)
            ? siblingsGroup.parentLabel
            : null,
        image:
          sectionImagesBySlug[item.categorySlug] ?? CATEGORY_IMAGE_FALLBACK,
      }));
  });

  public goToCategory(slug: string): void {
    if (!slug || slug === this.categorySlug()) return;
    this.pageState.goToCategory(slug);
  }

  private findSiblingGroup(
    slug: string | null,
    items: FilterMenuItem[],
  ): SiblingGroupResult {
    if (!items.length) return { items: [], parentLabel: null };

    if (!slug) {
      const hardwareRoot = items[0];
      const rootChildren = hardwareRoot?.items as FilterMenuItem[] | undefined;
      return {
        items: rootChildren?.length ? rootChildren : items,
        parentLabel: hardwareRoot?.label ?? null,
      };
    }

    const queue: Array<{
      parentItems: FilterMenuItem[];
      parentNode: FilterMenuItem | null;
      node: FilterMenuItem;
    }> = items.map((node) => ({
      parentItems: items,
      parentNode: null,
      node,
    }));

    while (queue.length) {
      const current = queue.shift();
      if (!current) continue;

      if (current.node.categorySlug === slug) {
        const nodeChildren = current.node.items as FilterMenuItem[] | undefined;
        const isTopLevelCategory = current.parentNode === null;
        if (isTopLevelCategory && nodeChildren?.length) {
          return {
            items: nodeChildren,
            parentLabel: current.node.label ?? null,
          };
        }

        return {
          items: current.parentItems,
          parentLabel: current.parentNode?.label ?? null,
        };
      }

      const childItems = current.node.items as FilterMenuItem[] | undefined;
      if (!childItems?.length) continue;

      for (const child of childItems) {
        queue.push({
          parentItems: childItems,
          parentNode: current.node,
          node: child,
        });
      }
    }

    return { items: [], parentLabel: null };
  }
}
