import { Component, inject } from '@angular/core';
import { NgClass, NgStyle } from '@angular/common';
import { PokemonStorageService } from '../../services/pokemon.storage.service';
import { ResaltarTarjetaDirective } from '../../directivas/resaltar-tarjeta.directive';

@Component({
  selector: 'app-inventario-pokemon',
  standalone: true,
  imports: [NgClass, NgStyle, ResaltarTarjetaDirective],
  templateUrl: './inventario-pokemon.html',
  styleUrls: ['./inventario-pokemon.css']
})
export class InventarioPokemonComponent {
  pokemonService = inject(PokemonStorageService);
}