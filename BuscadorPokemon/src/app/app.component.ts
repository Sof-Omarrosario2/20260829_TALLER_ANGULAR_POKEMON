import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Pokemon, PokemonService } from './pokemon.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  private service = inject(PokemonService);

  query = '';
  loading = signal(false);
  error = signal<string | null>(null);
  results = signal<Pokemon[]>([]);
  searched = signal(false);

  constructor() {
    // Carga inicial de Pokemon destacados
    this.loading.set(true);
    this.service.getFeatured().subscribe({
      next: (list) => {
        this.results.set(list);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  search(): void {
    const term = this.query.trim();
    if (!term) {
      this.error.set('Escribe el nombre o numero de un Pokemon.');
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.searched.set(true);

    this.service.getPokemon(term).subscribe({
      next: (pokemon) => {
        this.results.set([pokemon]);
        this.loading.set(false);
      },
      error: () => {
        this.results.set([]);
        this.error.set(
          `No se encontro ningun Pokemon llamado "${term}". Revisa el nombre e intenta de nuevo.`
        );
        this.loading.set(false);
      },
    });
  }

  formatId(id: number): string {
    return '#' + id.toString().padStart(3, '0');
  }

  statLabel(name: string): string {
    const labels: Record<string, string> = {
      hp: 'HP',
      attack: 'Ataque',
      defense: 'Defensa',
      'special-attack': 'At. Esp.',
      'special-defense': 'Def. Esp.',
      speed: 'Velocidad',
    };
    return labels[name] ?? name;
  }
}
