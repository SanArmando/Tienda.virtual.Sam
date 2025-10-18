import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductStore } from '../../services/product-store.service';

@Component({
  selector: 'product-crud',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './product-crud.html',
  styleUrls: ['./product-crud.css']
})
export class ProductCrud {
  get products$() { return this.store.products$; }
  get loading$() { return this.store.loading$; }
  get error$() { return this.store.error$; }
  get message$() { return this.store.message$; }

  newName: string = '';
  newPrice: number = 0;

  constructor(private store: ProductStore) {
    this.store.load();
  }

  async add() {
    if (!this.newName || !this.newPrice) return;
    try {
      await this.store.add({ name: this.newName, price: this.newPrice });
      this.newName = '';
      this.newPrice = 0;
    } catch (e) {
      // error handled by store
    }
  }

  async remove(id: string | undefined) {
    if (!id) return;
    try {
      await this.store.remove(id);
    } catch (e) {
      // handled by store
    }
  }
}
