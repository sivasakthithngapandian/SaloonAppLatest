import { Injectable } from '@angular/core';
import { User,Services} from '../models/user';
import { ApiService } from './api.service';
import { HttpClient } from '@angular/common/http';
import { Plugins, CameraResultType, CameraSource } from '@capacitor/core';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { StorageService } from '../services/firestorage.service';
import { UUID } from 'angular2-uuid';
const { Storage, Camera } = Plugins;

@Injectable({
  providedIn: 'root'
})
export class UserproviderService {

  public loggedUser: User;
  public serviceDetails:Services;
  public loadPhoto:boolean;
  public placeImage:any;
  public placeId:any;

  constructor(private api: ApiService,
              private http: HttpClient,
              private navCtrl: NavController,
              private loadCtrl: LoadingController,
              private toastCtrl: ToastController,
              private fireStorage: StorageService) { }


   getUserData(): User{
      return this.loggedUser;
  }
  getServiceDetails(): Services{
    return this.serviceDetails;
  }
  emtyUser(){
    this.loggedUser = {
      id: null,
      name: '',
      mobile: '',
      bussinessname: ''
    }
  }

  async load(){
    return new Promise((resolve, rejected) => {
       this.getItem().then(uid => {
          this.api.updateID(uid);
          this.api.getUser().subscribe((usr: any) => {
             if(usr){
               this.setLoggedInUser(usr);
             }
             resolve(true);
          }, err => { 
            resolve(true);
            console.log(err);
           });
       }); 
    });
  }

  goForward(page){
     this.navCtrl.navigateForward(page); 
  }

  goBackward(page){
    this.navCtrl.navigateBack(page);
  }

  goToNew(page){
     this.navCtrl.navigateRoot(page); 
  }

  validateEmail(email) {
    const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }

  async getJSON(){
     return new Promise((resolve, reject) => {
        this.http.get("assets/services/input.json").subscribe((response) => {
          resolve(response);
        });
     });
  }

  async setItem(value): Promise<void>{
    this.api.updateID(value);
    console.log('value',value)
    await Storage.set({
       key: 'uid' ,
       value: JSON.stringify(value)
    });
  }

  async getItem(){
    const item = await Storage.get({
      key: 'uid'
    });
    return JSON.parse(item.value);
  }

  async logout(): Promise<any>{
    this.emtyUser();
    await this.api.logout();
    await Storage.clear();
  }

  async setLoggedInUser(user){
    this.loggedUser = user;
    console.log('Logged In User', this.loggedUser);
  }

  //setservice
  async setservice(user){
    this.serviceDetails = user;
    console.log('Logged In User', this.loggedUser);
  }


  async createLoader(message): Promise<HTMLIonLoadingElement>{
    const load = await this.loadCtrl.create({
      message
    });
    return load;
  }

  async createToast(message, showCloseButton = false, position="top" as "top" | "middle" | "bottom", duration=3500,cssClass?): Promise<HTMLIonToastElement>{
    const toast = await this.toastCtrl.create({
      message,
      position,
      duration,
      cssClass,
      buttons:[{
        text: 'Done',
        role: 'cancel',
        handler: () => {
          console.log('clear toast');
        }
      }]
    })
    return toast;
  }

  async openCamera(){
    const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Camera,
        resultType: CameraResultType.Base64,
        allowEditing: false
    });

    const raw = atob(image.base64String);
    const bytes = new Array(raw.length);
    for(var i=0; i<raw.length; i++){
      bytes[i] = raw.charCodeAt(i);
    }
    
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], { type: 'image/jpeg' });

    const filename = UUID.UUID();
    this.fireStorage.uploadContent(blob, filename).then(async success => {
       console.log(success);
       this.api.updateUser(this.loggedUser.id, { profile_img: success.url }).subscribe(res => {
         this.loggedUser.profile_img = success.url;
         this.api.img_load = true;
      }); 
    });
  }

  async openAlbum(){
      const image = await Camera.getPhoto({
        quality: 90,
        source: CameraSource.Photos,
        resultType: CameraResultType.Base64,
        allowEditing: false
    });

    const raw = atob(image.base64String);
    const bytes = new Array(raw.length);
    for(var i=0; i<raw.length; i++){
      bytes[i] = raw.charCodeAt(i);
    }
    
    const arr = new Uint8Array(bytes);
    const blob = new Blob([arr], { type: 'image/jpeg' });

    const filename = UUID.UUID();
    this.fireStorage.uploadContent(blob, filename).then(async success => {
       console.log(success);
       this.api.updateUser(this.loggedUser.id, { profile_img: success.url }).subscribe(res => {
         this.loggedUser.profile_img = success.url;
         this.api.img_load = true;
       });
    });
  }

  async openCameraForWorkPlace(){
    let id;
    this.placeImage = '';
    this.placeId = '';
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Camera,
      resultType: CameraResultType.Base64,
      allowEditing: false
  });

  const raw = atob(image.base64String);
  const bytes = new Array(raw.length);
  for(var i=0; i<raw.length; i++){
    bytes[i] = raw.charCodeAt(i);
  }
  
  const arr = new Uint8Array(bytes);
  const blob = new Blob([arr], { type: 'image/jpeg' });
  const filename = UUID.UUID();
  var random =  '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for(var i=0; i<10; i++){
    random += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  this.fireStorage.uploadContent(blob, filename).then(async success => {
     console.log(success);
     this.placeId = random;
     this.api.createWorkPhotos(this.loggedUser.id, this.placeId, { place_img: success.url }).subscribe(res => {
      //  this.loggedUser.profile_img = success.url;
      //  this.api.img_load = true;
      this.placeImage = success.url;
       this.loadPhoto = true;
    }); 
  });

  }

  async openAlbumForWorkPlace(){
    let id;
    this.placeImage = '';
    this.placeId = '';
    const image = await Camera.getPhoto({
      quality: 90,
      source: CameraSource.Photos,
      resultType: CameraResultType.Base64,
      allowEditing: false
  });

  const raw = atob(image.base64String);
  const bytes = new Array(raw.length);
  for(var i=0; i<raw.length; i++){
    bytes[i] = raw.charCodeAt(i);
  }
  
  const arr = new Uint8Array(bytes);
  const blob = new Blob([arr], { type: 'image/jpeg' });
  const filename = UUID.UUID();
  var random =  '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  for(var i=0; i<10; i++){
    random += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  this.fireStorage.uploadContent(blob, filename).then(async success => {
     console.log(success);
     this.placeId = random;
     this.api.createWorkPhotos(this.loggedUser.id, this.placeId ,{ place_img: success.url }).subscribe(res => {
      //  this.loggedUser.profile_img = success.url;
      //  this.api.img_load = true;
      this.placeImage = success.url;
      this.loadPhoto = true;
     });
  });
  }

}
