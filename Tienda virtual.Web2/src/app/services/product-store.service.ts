import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { Product } from '../models/product';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  constructor(private api: ApiService) {}

  private _products = new BehaviorSubject<Product[]>([]);
  products$ = this._products.asObservable();

  private loading = new BehaviorSubject<boolean>(false);
  loading$ = this.loading.asObservable();

  private error = new BehaviorSubject<string | null>(null);
  error$ = this.error.asObservable();
  private message = new BehaviorSubject<string | null>(null);
  message$ = this.message.asObservable();

  async load() {
    try {
      this.loading.next(true);
      const data = await firstValueFrom(this.api.get('products')) as Product[];
      this._products.next(data || []);
      this.error.next(null);
    } catch (e: any) {
      this.error.next(e.message || 'Load failed');
    } finally {
      this.loading.next(false);
    }
  }

  async add(product: { name: string; price: number }) {
    try {
      this.loading.next(true);
      const created: Product = await firstValueFrom(this.api.post('products', product)) as Product;
      const current = this._products.getValue();
      this._products.next([...current, created]);
  this.error.next(null);
  this.message.next('Producto creado correctamente');
  setTimeout(() => this.message.next(null), 3000);
      return created;
    } catch (e: any) {
      this.error.next(e.message || 'Create failed');
      throw e;
    } finally {
      this.loading.next(false);
    }
  }

  async remove(id: string) {
    try {
      this.loading.next(true);
      await firstValueFrom(this.api.delete(`products/${id}`));
  const current = this._products.getValue();
  this._products.next(current.filter((p) => p._id !== id));
  this.error.next(null);
  this.message.next('Producto eliminado correctamente');
  setTimeout(() => this.message.next(null), 3000);
    } catch (e: any) {
      this.error.next(e.message || 'Delete failed');
      throw e;
    } finally {
      this.loading.next(false);
    }
  }
}
