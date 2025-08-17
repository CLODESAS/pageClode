import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/home.component';
import { CartPage } from './features/cart/cart.page';
import { NotFoundPage } from './features/not-found/not-found.page';

export const routes: Routes = [
	{ path: '', component: HomeComponent },
	{ path: 'products', loadComponent: () => import('./features/products-list/products-list.component').then(m => m.ProductsListComponent) },
	{ path: 'products/:id', loadComponent: () => import('./features/product-detail/product-detail.component').then(m => m.ProductDetailComponent) },
		{ path: 'cart', component: CartPage },
		{ path: 'brands', loadComponent: () => import('./features/brands/brands.page').then(m => m.BrandsPage) },
		{ path: 'brands/:name', loadComponent: () => import('./features/brands/brand-detail.page').then(m => m.BrandDetailPage) },
		{ path: 'wishlist', loadComponent: () => import('./features/wishlist/wishlist.page').then(m => m.WishlistPage) },
		{ path: 'compare', loadComponent: () => import('./features/compare/compare.page').then(m => m.ComparePage) },
		{ path: '**', component: NotFoundPage },
];
