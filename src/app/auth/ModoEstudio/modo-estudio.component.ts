import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegistroCmrpExamenDTO } from 'src/app/Models/ExamenDTO';
import { DominioService } from 'src/app/shared/Services/Dominio/dominio.service';
import { ExamenService } from 'src/app/shared/Services/Examen/examen.service';

@Component({
  selector: 'app-modo-estudio',
  templateUrl: './modo-estudio.component.html',
  styleUrls: ['./modo-estudio.component.scss']
})
export class ModoEstudioComponent implements OnInit {

  constructor(
    private _router: Router,
    private _ExamenService:ExamenService,
    private _DominioService: DominioService
  ) { }

  public migaPan = [
    {
      titulo: 'Simulador CMRP',
      urlWeb: '/',
    },
    {
      titulo: 'Modo estudio',
      urlWeb: '/ModoEstudio',
    },
  ];
  public RegistrarExamenEnvio:RegistroCmrpExamenDTO={
    id:0,
    idSimuladorCmrpModo:0,
    nombreExamen:'',
    tiempo:0,
    idSimuladorCmrpDominio:0
  }
  public Dominio:any;
  public IdExamen=0;
  public userForm :UntypedFormGroup=new UntypedFormGroup({
    NombreSimulacion: new UntypedFormControl('',Validators.required),
  })
  public DominioSeleccionado=0;
  public SimulacionesTotales=0;
  public SimulacionesInconclusas=0;
  public CantMEstudio=0;
  public ListaEstudio:any;
  public TiempoTotalEstudio=0;
  public Hora=0;
  public Minuto=0;
  public HoraMostrar='';
  public MinutoMostrar='';
  public SimulacionesIncompletas:any;
  public ContSimulacionesIncompletas=0;
  public SimulacionesCompletadas:any;
  public ContSimulacionesCompletadas=0;
  public ResultadosPorDominio:any;
  public BotonResgistrar=false;
  public Take=0;
  public ListaLogo:any;
  ngOnInit(): void {
    this.ObtenerLogo()
    this.ListaDominioCombo();
    this.ListaExamenesPorModo();
    this.ListaExamenesIncompletos();
    this.ListaExamenesConcluidos();
    this.ObtenerPromedioDominioPorModo();
  }

  RegistrarExamen(){
    if(this.userForm.valid && this.DominioSeleccionado!=0){
      this.BotonResgistrar=true;
      this.RegistrarExamenEnvio.id=0,
      this.RegistrarExamenEnvio.idSimuladorCmrpModo=1,
      this.RegistrarExamenEnvio.nombreExamen=this.userForm.get('NombreSimulacion')?.value;
      this.RegistrarExamenEnvio.tiempo=0,
      this.RegistrarExamenEnvio.idSimuladorCmrpDominio=this.DominioSeleccionado;
      this._ExamenService.Registrar(this.RegistrarExamenEnvio).subscribe({
        next:(x)=>{
          this.IdExamen=x.id
          this._router.navigate(['/ModoEstudio/EstudioPregunta/'+this.IdExamen]);
        }
      })
    }
  }
  ListaDominioCombo(){
    this._DominioService.ListaDominioCombo().subscribe({
      next:(x)=>{
        this.Dominio=x;
      }
    })

  }
  ListaExamenesPorModo(){
    this.TiempoTotalEstudio=0;
    this.SimulacionesInconclusas=0;
    this._ExamenService.ResumenSimulacionesPorModo(1).subscribe({
      next:(x)=>{
        this.SimulacionesTotales=x.simulacionesTotales
        this.SimulacionesInconclusas=x.simulacionesInconclusas
        this.TiempoTotalEstudio=x.tiempoPromedio
      },
      complete: () => {
        this.Hora = Math.floor(this.TiempoTotalEstudio / 3600);
        this.HoraMostrar = (this.Hora < 10) ? '0' + this.Hora : this.Hora.toString();
        this.Minuto = Math.floor((this.TiempoTotalEstudio / 60) % 60);
        this.MinutoMostrar = (this.Minuto < 10) ? '0' + this.Minuto : this.Minuto.toString();
      }
    });


  }
  ListaExamenesIncompletos(){
    this._ExamenService.ListaExamenesIncompletos().subscribe({
      next:(x)=>{
        this.SimulacionesIncompletas=x;
        this.SimulacionesIncompletas.forEach((y:any)=>{
          if(y.idEstadoExamen!=3 && y.idSimuladorCmrpModo==1){
            this.ContSimulacionesIncompletas=x.length;
          }
        })
      }
    })
  }
  ListaExamenesConcluidos(){
    this._ExamenService.ListaExamenesConcluidos().subscribe({
      next:(x)=>{
        this.SimulacionesCompletadas=x;
        this.SimulacionesCompletadas.forEach((y:any)=>{
          if(y.idEstadoExamen==3 && y.idSimuladorCmrpModo==1){
            this.ContSimulacionesCompletadas=x.length;
          }
        })
      }
    })
  }
  ObtenerPromedioDominioPorModo(){
    this._ExamenService.ObtenerPromedioDominioPorModo(1,this.Take).subscribe({
      next:(x)=>{
        this.ResultadosPorDominio=x
      }
    })
  }
  ObtenerLogo(){
    this._DominioService.ObtenerLogo().subscribe({
      next:(x)=>{
        this.ListaLogo = x;
      }
    })
  }
}
