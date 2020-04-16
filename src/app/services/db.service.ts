import { Injectable } from '@angular/core';
import { Platform, AlertController } from '@ionic/angular';
import { User } from './user';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

@Injectable({
  providedIn: 'root'
})

export class DbService {
  private storage: SQLiteObject;
  usersList = new BehaviorSubject([]);
  private isDbReady: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private platform: Platform,
    private sqlite: SQLite,
    private httpClient: HttpClient,
    private sqlPorter: SQLitePorter,
    public alertctrl: AlertController,
  ) {
    this.platform.ready().then(() => {
      this.sqlite.create({
        name: 'other_db.db',
        location: 'default'
      })
        .then((db: SQLiteObject) => {
          this.storage = db;
          this.getDataFal();
        });
    });
  }

  dbState() {
    return this.isDbReady.asObservable();
  }

  fetchUsers(): Observable<User[]> {
    return this.usersList.asObservable();
  }

  getDataFal() {
    this.httpClient.get(
      'assets/dump.sql',
      { responseType: 'text' }
    ).subscribe(data => {
      this.sqlPorter.importSqlToDb(this.storage, data)
        .then(_ => {
          this.getUsers();
          this.isDbReady.next(true);
        })
        .catch(error => console.error(error));
    });
  }

  getUsers() {
    return this.storage.executeSql('SELECT * FROM usertable', []).then(res => {
      let items: User[] = [];
      if (res.rows.length > 0) {
        for (var i = 0; i < res.rows.length; i++) {
          items.push({
            id: res.rows.item(i).id,
            nombre: res.rows.item(i).nombre,
            apellido: res.rows.item(i).apellido,
            telefono: res.rows.item(i).telefono,
            correo: res.rows.item(i).correo,
            fecha_nacimiento: res.rows.item(i).fecha_nacimiento,
            genero: res.rows.item(i).genero,
          });
        }
      }
      this.usersList.next(items);
    });
  }

  // tslint:disable-next-line: variable-name
  addUser(nombre, apellido, telefono, correo, fecha_nacimiento, genero) {
    let data = [nombre, apellido, telefono, correo, fecha_nacimiento, genero];
    // tslint:disable-next-line: max-line-length
    return this.storage.executeSql('INSERT INTO usertable (nombre, apellido, telefono, correo, fecha_nacimiento, genero) VALUES (?, ?, ?, ?, ?, ?)', data)
    .then(async res => {
      this.getUsers();
      console.log('usuario insertado');
      const alert = await this.alertctrl.create({
      header: 'Aviso',
      subHeader: 'Registrado ' + nombre + ' ' + apellido,
      buttons: [
        {
          text: 'Aceptar',
          cssClass: 'secondary',
        }]
      });
      alert.present();
    });
  }

  getUser(id): Promise<User> {
    return this.storage.executeSql('SELECT * FROM usertable WHERE id = ?', [id]).then(res => {
      return {
        id: res.rows.item(0).id,
        nombre: res.rows.item(0).nombre,
        apellido: res.rows.item(0).apellido,
        telefono: res.rows.item(0).telefono,
        correo: res.rows.item(0).correo,
        fecha_nacimiento: res.rows.item(0).fecha_nacimiento,
        genero: res.rows.item(0).genero,
      };
    });
  }

  updateUser(id, user: User) {
    let data = [user.nombre, user.apellido, user.telefono, user.correo, user.fecha_nacimiento, user.genero];
    // tslint:disable-next-line: max-line-length
    return this.storage.executeSql(`UPDATE usertable SET nombre = ?, apellido = ?, telefono = ?, correo = ?, fecha_nacimiento = ?, genero = ?  WHERE id = ${id}`, data)
      .then(data => {
        this.getUsers();
      })
  }

  deleteUser(id) {
    return this.storage.executeSql('DELETE FROM usertable WHERE id = ?', [id])
    .then(_ => {
      this.getUsers();
    });
  }
}
