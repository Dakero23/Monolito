import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';

@Component({
  selector: 'app-paciente',
  templateUrl: './paciente.component.html',
  styleUrls: ['./paciente.component.css']
})
export class PacienteComponent implements OnInit {

  dataSource: MatTableDataSource<Paciente> = new MatTableDataSource();
  displayedColumns: string[] = ['idPaciente', 'nombres', 'apellidos', 'acciones'];

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  cantidad: number = 0;

  constructor(
    private pacienteService: PacienteService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {

    this.pacienteService.getMensajeCambio().subscribe(texto => {
      this.snackBar.open(texto, 'AVISO', { duration: 2000, horizontalPosition: "right", verticalPosition: "top" });
    });

    this.pacienteService.getPacienteCambio().subscribe(data => {
      this.crearTabla(data);
    });

    this.pacienteService.listarPageable(0, 10).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });

    /*this.pacienteService.listar().subscribe(data => {
      this.crearTabla(data);
    });*/
  }

  eliminar(id: number) {
    this.pacienteService.eliminar(id).pipe(switchMap(() => {
      return this.pacienteService.listar();
    }))
      .subscribe(data => {
        this.crearTabla(data);
      });

  }

  crearTabla(data: Paciente[]) {
    this.dataSource = new MatTableDataSource(data);
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  filtrar(e: any) {
    this.dataSource.filter = e.target.value.trim().toLowerCase();
  }

  mostrarMas(e: any){
    this.pacienteService.listarPageable(e.pageIndex, e.pageSize).subscribe(data => {
      this.cantidad = data.totalElements;
      this.dataSource = new MatTableDataSource(data.content);
    });
  } 
}
