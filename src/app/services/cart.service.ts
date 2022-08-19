import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { CartItem } from '../common/cart-item';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  decrementQuantity(theCartItem: CartItem) {
    theCartItem.quantity--;

    if(theCartItem.quantity===0){
      this.remove(theCartItem);
    }
    else{
      this.computerCartTotals();
    }
  }
  remove(theCartItem: CartItem) {
    //get index of the item in the array
    const itemIndex = this.cartItems.findIndex(
      tempCartItem => tempCartItem.id == theCartItem.id);

    // if found, remove the item from the array at the given index

    if (itemIndex >-1){
      this.cartItems.splice(itemIndex, 1);
    }
    this.computerCartTotals();
    
  }

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject <number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject <number>(0);

  storage: Storage = localStorage;
  //storage: Storage = sessionStorage;

    constructor() {

      let data = JSON.parse(this.storage.getItem('cartItems'));

      if(data != null){
        this.cartItems = data;

        this.computerCartTotals();
      }

     }

    AddToCart(theCartItem: CartItem){

      // check if we already have the item in our cart
      let alreadyExistisInCart: boolean = false;
      let existingCartItem: CartItem = undefined;

      if(this.cartItems.length > 0){

      // find the item in the cart based on item id

     existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);

      // check if we found it
      alreadyExistisInCart = (existingCartItem != undefined);

      }

      if (alreadyExistisInCart){
        // increment the quantity

      existingCartItem.quantity++;
      }
      else{
        //just add the item to the array
        this.cartItems.push(theCartItem);
      }

      //compute cart total price and total quantity
      this.computerCartTotals();

      

    }
  computerCartTotals() {
    let totalPriceValue: number = 0;
    let totalQuantityValue: number = 0;

    for (let currentCartItem of this.cartItems){
      totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
      totalQuantityValue += currentCartItem.quantity;
    }

    // publish the new values...all subscribers will receive the new data
    this.totalPrice.next(totalPriceValue);
    this.totalQuantity.next(totalQuantityValue);

    // log cart data just for debugging purposes
    this.logCartData(totalPriceValue,totalQuantityValue);

    this.persistCartItems();
    }



    persistCartItems(){
      this.storage.setItem('cartItems', JSON.stringify(this.cartItems));
    }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
    console.log('Contents of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.quantity*tempCartItem.unitPrice;
      console.log(`name: ${tempCartItem.name}, quantity=${tempCartItem.quantity}, unitPrice=${tempCartItem.unitPrice}, subTotalPrice=${subTotalPrice}`);
    }
    
    console.log(`totalPrivce: ${totalPriceValue.toFixed(2)}, totalQuantity: ${totalQuantityValue}`);
    console.log('----');
  }
}
