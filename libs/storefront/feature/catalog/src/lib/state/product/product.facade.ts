import { Injectable, inject, signal } from '@angular/core';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { ProductBySlugDto, ProductRepository } from '@storefront/data-access';
import { map } from 'rxjs';

@Injectable()
export class ProductFacade {
  private readonly productRepository = inject(ProductRepository);
  private route = inject(ActivatedRoute);
  private readonly refreshToken = signal(0);

  readonly productSlug = toSignal(
    this.route.paramMap.pipe(map((pm) => pm.get('productSlug') ?? undefined)),
    { initialValue: undefined },
  );

  readonly productResource = rxResource<
    ProductBySlugDto,
    { slug: string; refresh: number } | undefined
  >({
    params: () => {
      const slug = this.productSlug();
      return slug ? { slug, refresh: this.refreshToken() } : undefined;
    },
    stream: ({ params }) => {
      return this.productRepository.getProductWithRetailPrice(params.slug);
    },
  });

  public refresh(): void {
    this.refreshToken.update((v) => v + 1);
  }
}
