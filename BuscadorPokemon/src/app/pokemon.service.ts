import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, map, switchMap } from 'rxjs';

export interface PokemonType {
  slot: number;
  type: { name: string; url: string };
}

export interface PokemonAbility {
  ability: { name: string; url: string };
  is_hidden: boolean;
}

export interface PokemonStat {
  base_stat: number;
  stat: { name: string };
}

export interface RawPokemon {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    other?: {
      ['official-artwork']?: { front_default: string | null };
      dream_world?: { front_default: string | null };
    };
    front_default: string | null;
  };
  types: PokemonType[];
  abilities: PokemonAbility[];
  stats: PokemonStat[];
}

export interface RawSpecies {
  flavor_text_entries: {
    flavor_text: string;
    language: { name: string };
  }[];
}

export interface Pokemon {
  id: number;
  name: string;
  image: string;
  description: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  stats: { name: string; value: number }[];
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private http = inject(HttpClient);
  private readonly base = 'https://pokeapi.co/api/v2';

  /** Busca un Pokemon por nombre o numero (id). */
  getPokemon(query: string): Observable<Pokemon> {
    const term = query.trim().toLowerCase();

    return this.http.get<RawPokemon>(`${this.base}/pokemon/${term}`).pipe(
      switchMap((raw) =>
        this.http
          .get<RawSpecies>(`${this.base}/pokemon-species/${raw.id}`)
          .pipe(map((species) => this.toPokemon(raw, species)))
      )
    );
  }

  /** Lista inicial de Pokemon populares para mostrar antes de buscar. */
  getFeatured(): Observable<Pokemon[]> {
    const names = ['pikachu', 'charizard', 'bulbasaur', 'squirtle'];
    return forkJoin(names.map((n) => this.getPokemon(n)));
  }

  private toPokemon(raw: RawPokemon, species: RawSpecies): Pokemon {
    const artwork =
      raw.sprites.other?.['official-artwork']?.front_default ??
      raw.sprites.other?.dream_world?.front_default ??
      raw.sprites.front_default ??
      '';

    const flavor =
      species.flavor_text_entries.find((e) => e.language.name === 'es') ??
      species.flavor_text_entries.find((e) => e.language.name === 'en');

    const description = flavor
      ? flavor.flavor_text.replace(/\f|\n|\r/g, ' ').trim()
      : 'Sin descripcion disponible.';

    return {
      id: raw.id,
      name: raw.name,
      image: artwork,
      description,
      types: raw.types.map((t) => t.type.name),
      abilities: raw.abilities.map((a) => a.ability.name),
      height: raw.height / 10,
      weight: raw.weight / 10,
      stats: raw.stats.map((s) => ({ name: s.stat.name, value: s.base_stat })),
    };
  }
}
