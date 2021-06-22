import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { ApiService } from 'src/app/services/api.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UserproviderService } from 'src/app/services/userprovider.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.page.html',
  styleUrls: ['./inventory.page.scss'],
})
export class InventoryPage implements OnInit {

  public inventory = {
    categor: this.firestore.Category,
    categories: [],
  }

  public category:any = [];
  public services:any = [];
  public choosen:any = [];

  public categories1 = {
    id: '',
    service1: '',
    service2: '',
    service3: '',
    service4: '',
    price: ''
  }
  servicedata: any;
  servicedatalist = [];

  constructor(private router: Router,
    private api: ApiService,
    private firestore: FirestoreService,
    private userProvide: UserproviderService,
    private menuCtrl: MenuController) { }

    async ngOnInit() {
      this.menuCtrl.enable(true);
      this.menuCtrl.swipeGesture(false);
      const loader = await this.userProvide.createLoader('Loading...');
      loader.present();
      this.category = [];
      this.api.choosen = [];
      this.api.category = [];
      this.api.services = [];
      this.api.check = [];
      this.api.getservice(this.userProvide.loggedUser.id).subscribe(data => {
         console.log(data);
         data[0].services.forEach(dat => {
            this.api.choosen.push(dat);
         });
         
         //this.api.services.push(this.choosen);
         this.userProvide.getJSON().then((result) => {
          this.category = result;
          console.log(result);
          this.category.forEach((dat1, index) => {
            this.api.choosen.forEach(dat2 => {
               if(dat1.category === dat2.category){
                  this.category.splice(index, 1);
               }
            });
         });
         console.log(this.category);
          loader.dismiss();
       });
      });
    }
  
  
  
    selectChange(ev:any){
      if(ev.detail.checked === true){
        this.api.category.push(ev.detail.value);
      }else if(ev.detail.checked === false){
        this.api.category.forEach((data, index) => {
           if(data === ev.detail.value) { this.api.category.splice(index, 1);   } 
        })
      }
      //console.log(ev);
      console.log(this.api.category);
    }
  
    next(){
     this.category.forEach(data => {
          this.api.category.forEach(categ => {
              if(data.category === categ){
                this.api.services.push(data);
              }
          });
      });
      console.log(this.api.services);
      this.category = [];
      this.userProvide.getJSON().then((result) => {
        this.category = result;
        //console.log(result);
     });
     console.log(this.api.services);
      this.userProvide.goForward('/services');
    }
  
}
