import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GenericService<T> {

  constructor(
    protected http: HttpClient,
    @Inject("url") protected url: string
  ) { }

  listar(){
    return this.http.get<T[]>(this.url);
  }

  listarPorId(id: number) {
    console.log(this.http.get<T>(`${this.url}/${id}`));
    return this.http.get<T>(`${this.url}/${id}`);
  }

  registrar(t: T) {
    return this.http.post(this.url, t);
  }

  modificar(t: T) {
    console.log('URL'+this.url);
    console.log('Objeto:'+t);
    return this.http.put(this.url, t);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }
}
