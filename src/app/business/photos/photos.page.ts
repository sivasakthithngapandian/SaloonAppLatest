import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { ActionSheetController } from '@ionic/angular';
import {ApiService} from 'src/app/services/api.service';
import { UserproviderService } from 'src/app/services/userprovider.service';
import { workPhoto } from 'src/app/models/user';
//import {AngularFireStorage} from '@angular/fire/storage'


@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  
  public photos: workPhoto;
  changeUpload = false;
  image:any;
  img_name = '';

  constructor(private camera : Camera,
               private apiserve : ApiService,
               private userProvide: UserproviderService,
               private actionSheetCtrl: ActionSheetController) { }


  async ngOnInit() {
    const load = await this.userProvide.createLoader('Loading...');
    await load.present();
    this.userProvide.loadPhoto = false;
    this.apiserve.getWorkPhotos(this.userProvide.loggedUser.id).subscribe(async data => {
      this.image = data;
      console.log(this.image);
      await load.dismiss();
    });
  }

  toggleUpload(){
    this.changeUpload = !this.changeUpload;
  }

  async presentActionSheet() {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Choose',
      cssClass: 'my-action',
      buttons: [
        {
          text: 'Camera',
          role: 'destructive',
          icon: 'camera',
          cssClass: 'camera-action',
          handler: () => {
            this.Accesscamera()
          }

        }, {
          text: 'Gallery',
          icon: 'image',
          cssClass: 'gallery-action',
          handler: () => {
            this.AccessGallery();
          }
        }, {
          text: 'Cancel',
          role: 'close',
          icon: 'close',
          cssClass: 'close-action',
          handler: () => {
          }
        }
      ],
   });
    await actionSheet.present();
    actionSheet.onWillDismiss().then(() => {
      console.log('the action sheet is about to close');
    });
    actionSheet.onDidDismiss().then(() => {
      console.log('the action sheet has already closed');
    });
  }

  async Accesscamera(){
    this.userProvide.loadPhoto = false;
    await this.userProvide.openCameraForWorkPlace();
  }
  async AccessGallery(){
    this.userProvide.loadPhoto = false;
    await this.userProvide.openAlbumForWorkPlace();
  }

  async save(){
    const load = await this.userProvide.createLoader('Updating....');
    await load.present();
    console.log(this.userProvide.placeId);
    this.apiserve.UpdateWorkPhotos(this.userProvide.loggedUser.id, this.userProvide.placeId, { place_img: this.userProvide.placeImage, place_name: this.img_name }).subscribe(async res => {
        this.userProvide.placeImage = '';
        this.userProvide.loadPhoto = false;
        await load.dismiss();
        this.userProvide.goToNew('/settings');
    });
  }

}
