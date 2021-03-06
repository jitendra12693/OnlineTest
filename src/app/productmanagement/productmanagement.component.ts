import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProductService } from '../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { CategoryService } from '../services/category.service';

@Component({
  selector: 'app-productmanagement',
  templateUrl: './productmanagement.component.html',
  styleUrls: ['./productmanagement.component.css']
})
export class ProductmanagementComponent implements OnInit,OnDestroy {
  product={Category:[],ProductName:'',Description:'',ProductImage:'',Price:0.00,CategoryIds:''}
  private router: Router;
  sub: Subscription;
  categoryList: any;
  Success:string;
  Error:string;
  
  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
  constructor(private productService: ProductService
    ,         private categoryService:CategoryService
    ,         private route: ActivatedRoute
    ) { }

  ngOnInit() {
    this.sub = this.categoryService.geAllCategory({}).subscribe((category: any) => {
      if (category) {
        this.categoryList = category;
      } else {
        console.log(
          `Category not returning the list`
        );
      }
    });
  }
  SaveProduct(){
    this.sub = this.route.params.subscribe(params => {});
    this.product.CategoryIds = this.product.Category.join(',');
    this.productService.saveProduct(this.product).subscribe(result => {
      this.Success="New product added successfully!!!"
      this.gotoList();
    },
    error => {
      this.Error="This product already added in inventory";
      console.error(error)
    });
  }

  gotoList() {
    this.router.navigate(['/product-list']);
  } 

  productImageEvent(fileEvent: any){
    const reader = new FileReader();
    reader.readAsDataURL(fileEvent.target.files[0]);
    reader.onload = (event: Event) => { 
      //this.product.ProductImage = event.target['result']; //reader.result+'';
      this.product.ProductImage = reader.result as string;
    };
  }

  isNumber(evt) {
    evt = (evt) ? evt : window.event;
    var charCode = (evt.which) ? evt.which : evt.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
        return false;
    }
    return true;
}
}
