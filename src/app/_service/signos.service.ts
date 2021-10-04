import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Signos } from '../_model/signos';
import { environment } from 'src/environments/environment';
import { Subject } from 'rxjs';
import { GenericService } from './generic.service';

@Injectable({
  providedIn: 'root'
})
export class SignosService extends GenericService<Signos>{

  private SignosCambio: Subject<Signos[]> = new Subject<Signos[]>();
  private mensajeCambio: Subject<string> = new Subject<string>();  

  constructor(protected http: HttpClient) {
    super(
      http,
      `${environment.HOST}/signos`);
  }

  listarPageable(p: number, s:number){
    return this.http.get<any>(`${this.url}/pageable?page=${p}&size=${s}`);
  }

  //private url: string = `${environment.HOST}/Signoss`;
  
  //constructor(private http: HttpClient) { }

  /*listar() { //: Observable<Signos[]>
    return this.http.get<Signos[]>(this.url);
  }

  listarPorId(id: number) {
    return this.http.get<Signos>(`${this.url}/${id}`);
  }

  registrar(Signos: Signos) {
    return this.http.post(`${this.url}`, Signos);
  }

  modificar(Signos: Signos) {
    return this.http.put(`${this.url}`, Signos);
  }

  eliminar(id: number) {
    return this.http.delete(`${this.url}/${id}`);
  }*/

  ///////////////////////
  getSignosCambio(){
    return this.SignosCambio.asObservable();
  }

  setSignosCambio(lista: Signos[]){
    this.SignosCambio.next(lista);
  }

  getMensajeCambio(){
    return this.mensajeCambio.asObservable();
  }

  setMensajeCambio(texto: string){
    this.mensajeCambio.next(texto);
  }
}
