import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Params, Router } from '@angular/router';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Paciente } from 'src/app/_model/paciente';
import { Signos } from 'src/app/_model/signos';
import { PacienteService } from 'src/app/_service/paciente.service';
import { SignosService } from 'src/app/_service/signos.service';
import { PacienteEdicionComponent } from '../../paciente/paciente-edicion/paciente-edicion.component';
import { DialogosignosComponent } from '../signos-consulta/dialogosignos/dialogosignos.component';


@Component({
  selector: 'app-signos-edicion',
  templateUrl: './signos-edicion.component.html',
  styleUrls: ['./signos-edicion.component.css']
})
export class SignosEdicionComponent implements OnInit {

  @Input() editable: boolean;
  @Input() crearPaciente: boolean;
  form: FormGroup;
  pacientes: Paciente[];
  pacienteSeleccionado: Paciente;
  id: number = 0;
  edicion: boolean = false;

  fechaSeleccionada: Date = new Date();
  maxFecha: Date = new Date();
  //utiles para autocomplete
  myControlPaciente: FormControl = new FormControl();
  
  //myControlPaciente = new FormControl('',{ validators: [autocompleteObjectValidator()] })  
  
  
  pacientesFiltrados$: Observable<Paciente[]>;

  constructor(private dialog: MatDialog,
    private pacienteService: PacienteService,
    private signosService: SignosService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {

    this.form = new FormGroup({
      'id': new FormControl(0),
      'paciente': this.myControlPaciente,
      'fecha': new FormControl('', [Validators.required]),
      'pulso': new FormControl('', [Validators.minLength(2)]),
      'temperatura': new FormControl('', [Validators.minLength(2)]),
      'ritmoRespiratorio': new FormControl('', [Validators.minLength(2)])
    });
    this.listarPacientes();
    this.pacientesFiltrados$ = this.myControlPaciente
      .valueChanges.pipe(
        map(val => this.filtrarPacientes(val)

        ));
    //this.myControlPaciente.setValidators(ValidatePaciente);

    this.route.params.subscribe((data: Params) => {
      this.id = data['id'];
      this.edicion = data['id'] != null;
      this.initForm();
    });


  }

  initForm() {
    if (this.edicion) {
      this.editable = true;

      this.signosService.listarPorId(this.id).subscribe(data => {
        this.form = new FormGroup({
          'id': new FormControl(data.idSignos),
          'paciente': new FormControl(data.paciente),
          'fecha': new FormControl(data.fecha),
          'pulso': new FormControl(data.pulso),
          'temperatura': new FormControl(data.temperatura),
          'ritmoRespiratorio': new FormControl(data.ritmoRespiratorio)
        });
      });

    }
  }

  filtrarPacientes(val: any) {
    if (val != null && val.idPaciente > 0) {
      return this.pacientes.filter(el =>
        el.nombres.toLowerCase().includes(val.nombres.toLowerCase()) || el.apellidos.toLowerCase().includes(val.apellidos.toLowerCase()) || el.dni.includes(val.dni)
      );
    }

    return this.pacientes.filter(el =>
      el.nombres.toLowerCase().includes(val?.toLowerCase()) || el.apellidos.toLowerCase().includes(val?.toLowerCase()) || el.dni.includes(val)
    );
  }

  mostrarPaciente(val: any) {
    return val ? `${val.nombres} ${val.apellidos}` : val;
  }


  listarPacientes() {
    this.pacienteService.listar().subscribe(data => {
      this.pacientes = data;
    });
  }

  

  aceptar() {

    let signos = new Signos();
    signos.idSignos = this.form.value['id'];
    signos.paciente = this.form.value['paciente'];
    
    console.log(typeof this.form.value['paciente']);
    
    if (!this.pacientes.find(data => {
      return data.idPaciente === signos.paciente.idPaciente ? true : false;
    })) {
      this.signosService.setMensajeCambio("Debe crear el paciente primero");
      this.crearPaciente = true;
      return;
    }
    /*if (true) {
      return;
    }*/

    signos.fecha = moment(this.form.value['fecha']).format('YYYY-MM-DDTHH:mm:ss');
    signos.pulso = this.form.value['pulso']
    signos.temperatura = this.form.value['temperatura']
    signos.ritmoRespiratorio = this.form.value['ritmoRespiratorio']

    if (signos != null && signos.idSignos > 0) {
      //MODIFICAR
      this.signosService.modificar(signos).pipe(switchMap(() => {
        return this.signosService.listar();
      }))
        .subscribe(data => {
          this.signosService.setSignosCambio(data);
          this.signosService.setMensajeCambio("SE MODIFICO");
        });

    } else {
      //REGISTRAR
      this.signosService.registrar(signos).subscribe(() => {
        this.signosService.listar().subscribe(data => {
          this.signosService.setSignosCambio(data);
          this.signosService.setMensajeCambio("SE REGISTRO");

        });
      });
      this.router.navigate(['/pages/signos/consulta']);
    }
  }

  abrirDialogo() {
    const dialogo1 = this.dialog.open(DialogosignosComponent, {
      data: this.form.value['paciente']
    });

    dialogo1.afterClosed().subscribe(art => {
      console.log(art);
      
      if (art != undefined)
        null;
      // this.agregar(art);
    });
  }

  public validation_msgs = {
    'contactAutocompleteControl': [
      { type: 'invalidAutocompleteObject', message: 'No existe paciente con el nombre mencionado debe crearlo'},
      { type: 'required', message: 'paciente es requerido' }
    ]
  }
  
}
 /**
  * Funcion para validar paciente
  * @returns 
  */
  function autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {

        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null
    }
  }
