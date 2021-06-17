import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'
import { ApiService } from 'src/app/services/api.service';
import { FirestoreService } from 'src/app/services/firestore.service';
import { PickerController } from '@ionic/angular'
import { PickerOptions } from '@ionic/core'
import { UserproviderService } from 'src/app/services/userprovider.service';

@Component({
  selector: 'app-service',
  templateUrl: './service.page.html',
  styleUrls: ['./service.page.scss'],
})
export class ServicePage implements OnInit {

  public getservice = {
    Servicename: '',
    price: ''
  }

  public services = {
    ServiceName: '',
    categories: '',
    duration: '',
    price: ''
  }
  servicehide = false;
   
  servicedata: any;
  servicedatacopy:any;
  servicelist = [];
  categoriesdata: any;
  categoriesdatalist = [];

  timeget: any[] = [
    [
      '5minutes', '10minutes', '15minutes', '20minutes', '25minutes', '30minutes', '35minutes', '40minutes', '45minutes',
      '50minutes', '55minutes',
    ]
  ]


  value0 = 'Service duration';
  numColumns: number = 1;
  numOptions: number = 10;

  public serviceDatalist: any =[];
  public service2list: any = [];

  constructor(private router: Router,
    private api: ApiService,
    private pickercontrl: PickerController,
    private userProvideserv: UserproviderService,
    private firestore: FirestoreService) { }

  ngOnInit() {
    //this.servicedata = this.userProvideserv.serviceDetails;
      this.servicedetails()
   this.api.getaddservice(this.userProvideserv.loggedUser.id).subscribe(res=>{
     console.log('service get fulll ', res)
   })
   
   this.api.getservice(this.userProvideserv.loggedUser.id).subscribe(data=>{
    this.api.serviceDatalist=data;
    console.log('service register api',this.api.serviceDatalist)
      for(let i of this.api.serviceDatalist)
      this.api.service2list.push(i)
   });
  }
  
  back() {
    this.router.navigate(['/home'])
  }

  getServiceDetails() {
    const serviceInfo = {
      id: this.userProvideserv.loggedUser.id,
      ServiceName: this.services.ServiceName,
      duration: this.value0, 
      price: this.services.price,
    }
    this.firestore.updateField('users', 'service', serviceInfo.id, serviceInfo).then(response => {
      console.log("response", response)
    });
    this.servicehide=false;
    console.log('services', serviceInfo);
    this.api.getaddservice(this.userProvideserv.loggedUser.id).subscribe(res=>{
        //  console.log('service result', res)
        this.servicedata =res
        for(let i of this.servicedata){
          this.servicelist.push(i)
        }
       })
  }

  servicedetails() {
    this.getservice.Servicename = this.api.ServiceName
    this.getservice.price = this.api.price
    //service
    const serviceInfo = {
      id: this.userProvideserv.loggedUser.id,
      ServiceName: this.getservice.Servicename,
      price: this.getservice.price

    }
    //service
    this.firestore.getdata('users', serviceInfo.id, 'service', serviceInfo).subscribe(use => {
      this.servicedata = use
      console.log('servicedetails', this.servicedata)
      for (let i of this.servicedata) {
        console.log("result", i);
        this.servicelist.push(i);
      };
    })
  }

  //hideform
  serviceHideForm() {
    this.servicehide = !this.servicehide
  }

  //duration timepicker
  async Durationtime() {
    let options: PickerOptions = {
      buttons: [
        {
          text: "Cancel",
          role: 'cancel',
        },
        {
          text: 'Ok',
          handler: (value: any) => {
            this.value0 = value['col -0'].text;
            console.log('value', this.value0);
          }
        }
      ],
      columns: this.getcolumns()
    };
    let picker = await this.pickercontrl.create(options);
    picker.present()

  }

  getcolumns() {
    let columns = []
    for (let i = 0; i < this.numColumns; i++) {
      columns.push({
        name: `col -${i}`,
        options: this.getColumnOptions(i)
      })
    }
    return columns;
  }
  getColumnOptions(columIndex: number) {
    let options = []
    for (let i = 0; i < this.numOptions; i++) {
      options.push({
        text: this.timeget[columIndex][i % this.numOptions],
        value: i
      })
    }
    return options;
  }
}
