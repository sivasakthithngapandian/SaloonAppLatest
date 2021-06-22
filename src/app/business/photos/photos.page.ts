import { Component, OnInit } from '@angular/core';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import {ApiService} from 'src/app/services/api.service';
import { UserproviderService } from 'src/app/services/userprovider.service';
//import {AngularFireStorage} from '@angular/fire/storage'


@Component({
  selector: 'app-photos',
  templateUrl: './photos.page.html',
  styleUrls: ['./photos.page.scss'],
})
export class PhotosPage implements OnInit {
  

  constructor(private camera : Camera,
               private apiserve : ApiService,
               private userProvide: UserproviderService) { }


  ngOnInit() {
  }
  async Accesscamera(){
     await this.userProvide.openCamera();
  }
  async AccessGallery(){
    await this.userProvide.openAlbum();
  }

}
