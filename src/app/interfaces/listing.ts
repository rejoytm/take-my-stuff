export enum ListingCategory {
  Electronics = 'Electronics',
  Furniture = 'Furniture',
  HomeAppliances = 'Home Appliances',
  LightingFixtures = 'Lighting & Fixtures',
  ToolsEquipment = 'Tools & Equipment',
  Other = 'Other',
}

export const listingCategories: ListingCategory[] = [
  ListingCategory.Electronics,
  ListingCategory.Furniture,
  ListingCategory.HomeAppliances,
  ListingCategory.LightingFixtures,
  ListingCategory.ToolsEquipment,
  ListingCategory.Other,
];

export interface Listing {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  imageIds: string[];
  sellerId: string;
  createdAt: number;
  updatedAt: number;
  views: number;
}
