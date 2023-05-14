import { Component } from '@angular/core';
import { Product } from './product';
import { Comment } from './comment';
import { User } from './user';
import { HttpClient } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Workshop 5';
  public show:boolean = false;
  products: Array<Product> = []
  comments: Array<Comment> = []
  selectedProduct: Product = new Product
  selectedComments: Array<Comment> = []
  categoryCount: Array<string> = []
  hideProductInfo: boolean = true
  constructor() {
    this.fetchData()
  }

  styleBinding(ProductItem: Product) : string {
    if (ProductItem.stock <= 50) {
      return 'table-danger'
    }
    else if (ProductItem.stock <= 100) {
      return 'table-warning'
    }
    else {
      return 'table-success'
    }
  }

  saveComments(){
    if(this.selectedComments.length > 0)
    {
      this.selectedComments.forEach(comment => {
        this.comments[this.comments.indexOf(comment)].body = comment.body;
      });
    }
  }

  public getRandomComments(){
    this.saveComments();
  
    const startIndex = Math.floor(Math.random() * this.comments.length);
    
    const numElements = Math.floor(Math.random() * 10) + 1;
    
    const endIndex = Math.min(startIndex + numElements, this.comments.length);
  
    this.selectedComments =  this.comments.slice(startIndex, endIndex);
  }

  public displayMoreProductInfo(product: Product){
    this.selectedProduct = product;
    this.getRandomComments();
    if(this.hideProductInfo == true)
      this.switchProductInfoValue();
    console.log(this.comments);
  }

  public switchProductInfoValue()
  {
    this.hideProductInfo = !this.hideProductInfo
  }

  CountCategory(){
    this.categoryCount = [];
    var myString='';
    let categoryNumberKVP: { [categoryName: string]: number } = {};

    this.products.forEach(product => {
      if(categoryNumberKVP[product.category] == undefined)
      {
        categoryNumberKVP[product.category] = 0;
      }
      categoryNumberKVP[product.category] += 1;
    })
    Object.entries(categoryNumberKVP).forEach(
      ([key, value]) => myString += key.concat(" - ", value.toString()+"\n")
    );
    alert("Products in each categories: \n"+myString);
  }

  MaxDiscount(){
     var maximumDiscount = Math.max(...this.products.map(p => p.discountPercentage))

    alert("Maximum discount: "+maximumDiscount)
  }

  PriceLevel(){
    var myString = '';
    const sum = this.products.map(p => p.price).reduce((a, b) => a + b, 0);
    const avg = (sum / this.products.length) || 0;
    console.log(avg);
    this.products.forEach(p =>{
      if(p.price > avg)
      {
        myString+= p.id.toString().concat(" - ", p.title)+"\n";
      }
    })
    alert("Products above average price level: \n"+myString);
  }

  deleteProduct(productItem: Product) {
    let index = this.products.findIndex(x => x.id === productItem.id)
    this.products.splice(index, 1)
  }

  async fetchData() {
    const url = 'https://dummyjson.com/products?limit=100'
    let productObjects = (await (await fetch(url)).json()).products

    productObjects.map((x: any) => {
      let t = new Product()
      t.id = x.id
      t.title = x.title
      t.description = x.description
      t.discountPercentage = x.discountPercentage
      t.rating = x.rating
      t.stock = x.stock
      t.brand = x.brand
      t.category = x.category
      t.thumbnail = x.thumbnail
      t.images = x.images

      this.products.push(t)
    })

    console.log(this.products)

    const urlComments = 'https://dummyjson.com/comments?limit=300'
    let commentObjects = (await (await fetch(urlComments)).json()).comments

    commentObjects.map((c: any) => {
      let comment = new Comment()
      comment.id = c.id
      comment.body = c.body
      comment.postId = c.postId

      let user = new User()
      user.id = c.user.id
      user.username = c.user.username

      comment.user = user
      this.comments.push(comment)
    })

    console.log(this.comments)
  }
}
