import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from './../services/db.service';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  mainForm: FormGroup;
  Data: any[] = [];

  constructor(
    private db: DbService,
    public formBuilder: FormBuilder,
    private toast: ToastController,
    private router: Router
  ) {  }

  ngOnInit() {
    this.db.dbState().subscribe((res) => {
      if (res) {
        this.db.fetchUsers().subscribe(item => {
          this.Data = item;
          console.log(this.Data)
        });
      }
    });

    this.mainForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      correo: [''],
      fecha_nacimiento: [''],
      genero: [''],
    });
  }

  storeData() {
    this.db.addUser(
      this.mainForm.value.nombre,
      this.mainForm.value.apellido,
      this.mainForm.value.telefono,
      this.mainForm.value.correo,
      this.mainForm.value.fecha_nacimiento,
      this.mainForm.value.genero,
    ).then((res) => {
      this.mainForm.reset();
    });
  }

  deleteUser(id) {
    this.db.deleteUser(id).then(async (res) => {
      let toast = await this.toast.create({
        message: 'User eliminado',
        duration: 2500
      });
      toast.present();
    });
  }

}
