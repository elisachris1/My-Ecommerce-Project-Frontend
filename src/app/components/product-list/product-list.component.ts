import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  searchMode: boolean = false;

  // new properties for pagination
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0; 

  
 

  constructor(private productService: ProductService,  
      private cartService: CartService,
      private route: ActivatedRoute){}
   

  ngOnInit() {

    this.route.paramMap.subscribe(()=>{

      this.searchMode = this.route.snapshot.paramMap.has('keyword');

      if(this.searchMode){
        this.handleSearchProducts();
      }
      else{
        this.handleListProducts();
      }

      })
     
      }

      listProducts(){

        this.handleListProducts();
  }

  handleSearchProducts(){
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    this.productService.searchProducts(theKeyword).subscribe(
      data =>{
        this.products = data;
      }
    )
  }

  handleListProducts(){
    //check if "id" parameter is avaiable

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if (hasCategoryId){
      // get the "id" param String. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      // not category id avaiable...default to category id 1
      this.currentCategoryId=1;
    }

    ///
    ///Check if we have a different category than previous
    ///
    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber=1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    

    
    //now get the products for the given category id

    this.productService.getProductListPaginate(this.thePageNumber -1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(data => {
                                                this.products  = data._embedded.products;
                                                this.thePageNumber = data.page.number + 1;
                                                this.thePageSize = data.page.size;
                                                this.theTotalElements = data.page.totalElements;      
                                              });
 
  }

  processResult(){
    return (data: { _embedded: { products: Product[]; }; page: { number: number; size: number; theTotalElements: number; }; })=>{
      this.products=data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.theTotalElements;
    }
  }

  updatePageSize(pageSize: number){
    this.thePageSize=pageSize;
    this.thePageNumber=1;
    this.listProducts()
  }

  addToCart(theProduct: Product){
    console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

    //TODO...do the real work
    const theCartItem = new CartItem(theProduct);

    this.cartService.AddToCart(theCartItem);
  }
}
