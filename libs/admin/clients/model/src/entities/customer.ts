export interface CustomerListItem {
  counterpartyId: string;
  name: string;
  phone: string | null;
}

export interface CustomerDetail extends CustomerListItem {
  email: string;
  defaultPriceTypeId: number;
  defaultPriceTypeName: string | null;
  categoryPriceTypes: readonly {
    categoryId: number;
    categoryName: string | null;
    priceTypeId: number;
    priceTypeName: string | null;
  }[];
}
