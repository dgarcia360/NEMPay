import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ContactProvider {

  // public properties

  db: SQLiteObject = null;

  constructor() {}

  setDatabase(db: SQLiteObject){
    if(this.db === null){
      this.db = db;
    }
  }

  create(owner: string, name: string, address: string){
    let sql = 'INSERT INTO contact(owner, name, address) VALUES(?,?,?)';
    return this.db.executeSql(sql, [owner, name, address]);
  }

  createTable(){
    let sql = 'CREATE TABLE IF NOT EXISTS contact(id INTEGER PRIMARY KEY AUTOINCREMENT, owner TEXT, name TEXT, address TEXT)';
    return this.db.executeSql(sql, []);
  }

  delete(id: number){
    let sql = 'DELETE FROM contact WHERE id=?';
    return this.db.executeSql(sql, [id]);
  }

  getAllByOwner(owner: string){
    let sql = 'SELECT * FROM contact WHERE owner = ?';
    return this.db.executeSql(sql, [owner])
    .then(response => {
      let contacts = [];
      for (let index = 0; index < response.rows.length; index++) {
        contacts.push( response.rows.item(index) );
      }
      return Promise.resolve( contacts );
    })
    .catch(error => Promise.reject(error));
  }

  update(id: number, name: string, address: string){
    let sql = 'UPDATE contact SET name=?, address=? WHERE id=?';
    return this.db.executeSql(sql, [name, address, id]);
  }

  searchContactName(owner:string, address:string){
    let sql = 'SELECT * FROM contact WHERE owner = ? AND address=?';
      return this.db.executeSql(sql, [owner, address])
      .then(response => {
        let contacts = [];
        for (let index = 0; index < response.rows.length; index++) {
          contacts.push( response.rows.item(index) );
        }
        return Promise.resolve( contacts );
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }
}