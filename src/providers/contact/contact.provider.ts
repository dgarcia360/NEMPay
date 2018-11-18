/*
 * MIT License
 *
 * Copyright (c) 2017 David Garcia <dgarcia360@outlook.com>
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
import { Injectable } from '@angular/core';
import { SQLiteObject } from '@ionic-native/sqlite';

@Injectable()
export class ContactProvider {

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