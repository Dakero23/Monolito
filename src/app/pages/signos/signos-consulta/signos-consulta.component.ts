import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Signos } from 'src/app/_model/signos';
import { SignosService } from 'src/app/_service/signos.service';

@Component({
  selector: 'app-signos-consulta',
  templateUrl: './signos-consulta.component.html',
  styleUrls: ['./signos-consulta.component.css']
})
export class SignosConsultaComponent implements OnInit {
  
  dataSource: MatTableDataSource<Signos> = new MatTableDataSource();
  displayedColumns: string[] = ['idSignos', 'paciente.dni', 'paciente.nombres', 'paciente.apellidos', 'fecha', 'temperatura', 'pulso', 'ritmoRespiratorio','acciones'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private signosService: SignosService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.signosService.getMensajeCambio().subscribe(texto => {
      this.snackBar.open(texto, 'AVISO', { duration: 2000, horizontalPosition: "right", verticalPosition: "top" });
    });

    this.signosService.getSignosCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.signosService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    /*this.signosService.listar().subscribe(data => {
      this.crearTabla(data);
    });*/
  }

  eliminar(id: number) {
    this.signosService.eliminar(id).pipe(switchMap(() => {
     
      return this.signosService.listar();
    }))
      .subscribe(data => {
        this.crearTabla(data);
      });
      this.signosService.setMensajeCambio("SE ELIMINO EL REGISTRO ");
  }

  crearTabla(data: Signos[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filtrar(e: any) {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        return (
          ele != "actions" &&
          this.getValueFrom(data, ele)
            .toString()
            .toLowerCase()
            .indexOf(filter) != -1
        );
      });
    };
    this.dataSource.filter = e.target.value.trim().toLowerCase();

  }


  getValueFrom(data: any, column: string) {
    console.log(data);
    
    if (column.includes(".")) {
      const nested = column.split(".");
      console.log(nested);
      return nested.reduce((prev, current) => {
        return prev[current];
      }, data);
    }
    return data[column];
  }

  
  /*
    mostrarMas(e: any){
      this.signosService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
        this.cantidad = data.totalElements;
        this.dataSource = new MatTableDataSource(data.content);
      });
    } 
  */
}
