import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { OpeningPageRoutingModule } from './opening-routing.module';

import { OpeningPage } from './opening.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    IonicModule,
    OpeningPageRoutingModule
  ],
  declarations: [OpeningPage]
})
export class OpeningPageModule {}
