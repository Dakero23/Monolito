import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Consulta } from 'src/app/_model/consulta';
import { ConsultaListaExamenDTO } from 'src/app/_model/consultaListaExamenDTO';
import { ConsultaService } from 'src/app/_service/consulta.service';

@Component({
  selector: 'app-buscar-dialogo',
  templateUrl: './buscar-dialogo.component.html',
  styleUrls: ['./buscar-dialogo.component.css']
})
export class BuscarDialogoComponent implements OnInit {

  consulta: Consulta;
  examenes: any[];

  constructor(
    private dialogRef: MatDialogRef<BuscarDialogoComponent>,
    @Inject(MAT_DIALOG_DATA) private data: Consulta,
    private consultaService: ConsultaService
  ) { }

  ngOnInit(): void {
    this.consulta = this.data;
    this.listarExamenes();
  }

  cerrar() {
    this.dialogRef.close();
  }

  listarExamenes() {
    this.consultaService.listarExamenPorConsulta(this.consulta.idConsulta).subscribe(data => {
      this.examenes = data;      
      console.log(data);
    })
  }

}
