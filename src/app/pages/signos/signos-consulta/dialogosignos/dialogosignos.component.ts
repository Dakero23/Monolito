import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Paciente } from 'src/app/_model/paciente';
import { PacienteService } from 'src/app/_service/paciente.service';
import { switchMap } from 'rxjs/operators';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogosignos',
  templateUrl: './dialogosignos.component.html',
  styleUrls: ['./dialogosignos.component.css']
})
export class DialogosignosComponent implements OnInit {


  form: FormGroup = new FormGroup({});
  id: number = 0;
  edicion: boolean = false;
   

  constructor(
    private route: ActivatedRoute,
    private pacienteService: PacienteService,
    private dialogRef: MatDialogRef<DialogosignosComponent>,
    private router: Router,
    @Inject(MAT_DIALOG_DATA) private data: any
  ) { 
 
  
    console.log(data);
  }

  ngOnInit(): void {
    let nombre = this.data.split(" ",1);
    let apellido = this.data.replace(nombre,"");
    this.form = new FormGroup({
      'id': new FormControl(0),
      'nombres': new FormControl(nombre,[Validators.minLength(3)]),
      'apellidos': new FormControl(apellido,[Validators.minLength(3)]),
      'dni': new FormControl('',[Validators.minLength(8),Validators.maxLength(8)]),
      'telefono': new FormControl('',[Validators.minLength(9),Validators.maxLength(9)]),
      'direccion': new FormControl('',[Validators.minLength(3)]),
      'email': new FormControl('')
    });

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });
  }

  initForm() {
    if (this.edicion) {
      this.pacienteService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idPaciente),
          'nombres': new FormControl(data.nombres),
          'apellidos': new FormControl(data.apellidos),
          'dni': new FormControl(data.dni),
          'telefono': new FormControl(data.telefono),
          'direccion': new FormControl(data.direccion),
          'email': new FormControl(data.email)
        });
      });
    }
  }

  operar() {
    let paciente = new Paciente();
    paciente.idPaciente = this.form.value['id'];
    paciente.nombres = this.form.value['nombres'];
    paciente.apellidos = this.form.value['apellidos'];
    paciente.dni = this.form.value['dni'];
    paciente.telefono = this.form.value['telefono'];
    paciente.direccion = this.form.value['direccion'];
    paciente.email = this.form.value['email'];

    if (this.edicion) {
      //PRACTICA NO IDEAL
      //MODIFICAR
      this.pacienteService.modificar(paciente).subscribe(() => {
        this.pacienteService.listar().subscribe(data => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE MODIFICO');
        });
      });
    } else {
      //PRACTICA IDEAL
      //REGISTRAR
      this.pacienteService.registrar(paciente).pipe(switchMap(() => {
        return this.pacienteService.listar();
      }))
        .subscribe(data => {
          this.pacienteService.setPacienteCambio(data);
          this.pacienteService.setMensajeCambio('SE REGISTRO');
        });
    }
     this.cerrar();  
    
  }

  cerrar() {
    this.dialogRef.close();
  }
}
