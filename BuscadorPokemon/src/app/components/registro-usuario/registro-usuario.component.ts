import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

export interface Usuario {
  id: number;
  nombreCompleto: string;
  documento: { tipo: string; num: string };
  celu: string;
  correo: string;
  fecha_nac: string;
  ubicacion: { pais: string; ciudad: string };
  tratamientos: boolean;
}

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './registro-usuario.component.html',
  styleUrl: './registro-usuario.component.css'
})
export class RegistroUsuarioComponent {
  private router = inject(Router);

  nombreCompleto = '';
  documentoTipo = '';
  numeroDocumento = '';
  fecha_nac = '';
  celular = '';
  correo = '';
  pais = '';
  ciudad = '';
  tratamientos = false;

  ultimoUsuario: Usuario | null = null;

  datos_personales(): boolean {
    return this.tratamientos;
  }

  guardarUsuario(): void {
    if (!this.datos_personales()) {
      alert('Debes aceptar el tratamiento de datos personales');
      return;
    }

    const usuarioCreado: Usuario = {
      id: Date.now(),
      nombreCompleto: this.nombreCompleto.trim(),
      documento: {
        tipo: this.documentoTipo,
        num: this.numeroDocumento,
      },
      celu: this.celular,
      correo: this.correo,
      fecha_nac: this.fecha_nac,
      ubicacion: {
        pais: this.pais,
        ciudad: this.ciudad,
      },
      tratamientos: this.tratamientos,
    };

    localStorage.setItem(`usuario_${usuarioCreado.id}`, JSON.stringify(usuarioCreado));
    this.ultimoUsuario = usuarioCreado;
    void this.router.navigateByUrl('/buscador');
  }
}
