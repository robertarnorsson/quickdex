import { ImageOff } from "lucide-react";
import Image from "next/image";
import { PokemonClient } from "pokenode-ts";

export default async function Page({ params }: { params: { pokemon: string } }) {
  const api = new PokemonClient();

  const pokemon = await api.getPokemonByName(params.pokemon);

  return (
    <div>
      <h1>{pokemon.name}</h1>
      {pokemon.sprites.front_default != null
        ? <Image
            className="disable-blur"
            src={pokemon.sprites.front_default}
            alt={pokemon.name}
            width={250}
            height={250}
            priority
          />
        : <div className="w-[250px] h-[250px] flex items-center justify-center bg-gray-500/5">
            <ImageOff />
          </div>
      }
    </div>
  )
}