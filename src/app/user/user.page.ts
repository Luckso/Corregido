import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DbService } from './../services/db.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastController } from '@ionic/angular';

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
})
export class UserPage implements OnInit {
  editForm: FormGroup;
  id: any;

  constructor(
    private db: DbService,
    private router: Router,
    public formBuilder: FormBuilder,
    private actRoute: ActivatedRoute,
    private toast: ToastController,
  ) {
    this.id = this.actRoute.snapshot.paramMap.get('id');

    this.db.getUser(this.id).then(res => {
      this.editForm.setValue({
        nombre: res.nombre,
        apellido: res.apellido,
        telefono: res.telefono,
        correo: res.correo,
        fecha_nacimiento: res.fecha_nacimiento,
        genero: res.genero
      });
    });
  }

  ngOnInit() {
    this.editForm = this.formBuilder.group({
      nombre: [''],
      apellido: [''],
      telefono: [''],
      correo: [''],
      fecha_nacimiento: [''],
      genero: ['']
    });
  }

  saveForm() {
    this.db.updateUser(this.id, this.editForm.value)
    .then( async (res) => {
      console.log(res)
      this.router.navigate(['/home']);
      const toast = await this.toast.create({
        message: 'User actualizado',
        duration: 2500
      });
      toast.present();
    });
  }
}
