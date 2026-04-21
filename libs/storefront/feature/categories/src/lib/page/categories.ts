import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslocoPipe } from '@jsverse/transloco';
import {
  CATALOG_DOOR_ORDER,
  CATALOG_DOOR_SECTION_TRANSLATION_KEYS,
  CATALOG_DOOR_SECTIONS,
  CATALOG_HARDWARE_ORDER,
  CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS,
  CATALOG_HARDWARE_SECTIONS,
  CATALOG_ROOT_TRANSLATION_KEYS,
  ProductListWarmupService,
} from '@storefront/data-access';
import { LocaleNavigationService } from '@storefront/util';
import { ButtonModule } from 'primeng/button';

type ParentCategory = 'hardware' | 'doors';

type ParentTab = {
  id: ParentCategory;
  labelKey: string;
};

type CategoryCard = {
  slug: string;
  labelKey: string;
  image: string;
};

const parentTabs: ParentTab[] = [
  {
    id: 'hardware',
    labelKey: CATALOG_ROOT_TRANSLATION_KEYS.hardware,
  },
  {
    id: 'doors',
    labelKey: CATALOG_ROOT_TRANSLATION_KEYS.doors,
  },
];

const hardwareCardImages: Record<
  keyof typeof CATALOG_HARDWARE_SECTIONS,
  string
> = {
  hinges: 'assets/images/categories/hinges.jpg',
  locks: 'assets/images/categories/locks.jpg',
  handles: 'assets/images/categories/handles.jpg',
  cylinders: 'assets/images/categories/cylinders.jpg',
  interiorMechanisms: 'assets/images/categories/interior-mechanisms.jpg',
  other: 'assets/images/categories/other.jpg',
};

const doorCardImages: Record<keyof typeof CATALOG_DOOR_SECTIONS, string> = {
  entranceDoors: 'assets/images/home-page/Steelguardmain.png',
  interiorDoors: 'assets/images/home-page/Korfad.png',
};

const hardwareCards: CategoryCard[] = CATALOG_HARDWARE_ORDER.map(
  (sectionKey) => ({
    slug: CATALOG_HARDWARE_SECTIONS[sectionKey].slug,
    labelKey: CATALOG_HARDWARE_SECTION_TRANSLATION_KEYS[sectionKey],
    image: hardwareCardImages[sectionKey],
  }),
);

const doorCards: CategoryCard[] = CATALOG_DOOR_ORDER.map((sectionKey) => ({
  slug: CATALOG_DOOR_SECTIONS[sectionKey].slug,
  labelKey: CATALOG_DOOR_SECTION_TRANSLATION_KEYS[sectionKey],
  image: doorCardImages[sectionKey],
}));

@Component({
  selector: 'lib-categories',
  imports: [RouterLink, TranslocoPipe, ButtonModule],
  templateUrl: './categories.html',
  styleUrl: './categories.css',
})
export class Categories {
  private readonly localeNavigation = inject(LocaleNavigationService);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly catalogWarmup = inject(ProductListWarmupService);

  readonly parentTabs = parentTabs;
  readonly activeParent = signal<ParentCategory>('hardware');
  readonly title =
    this.localeNavigation.getCurrentLocale() === 'ru'
      ? 'Категории'
      : 'Категорії';
  readonly cards = computed<CategoryCard[]>(() =>
    this.activeParent() === 'hardware' ? hardwareCards : doorCards,
  );

  constructor() {
    if (!isPlatformBrowser(this.platformId)) return;
    setTimeout(() => this.catalogWarmup.warmUpCatalogList(), 300);
  }

  setParent(parent: ParentCategory): void {
    this.activeParent.set(parent);
  }

  cardLink(slug: string): string[] {
    return this.localeNavigation.localizedSegments('catalog', slug, 'products');
  }
}
