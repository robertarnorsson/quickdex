import { NamedAPIResource } from "pokenode-ts";
import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Image from "next/image";

export default function PokemonList({ pokemons }: { pokemons: NamedAPIResource[] }) {
  return (
    <div className="w-full grid gap-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-8">
      {pokemons.map((pokemon) => {
        const pokemonUrlPart = pokemon.url.split("/");
        const pokemonId = pokemonUrlPart[pokemonUrlPart.length - 2];
        const imageUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

        return (
          <Link key={pokemon.name} href={`/${pokemon.name}`} passHref>
            <Card className="flex flex-col items-center justify-between p-4 h-full">
              <CardHeader>
                <h2 className="text-lg font-bold capitalize">
                  {pokemon.name.replaceAll("-", " ")}
                </h2>
              </CardHeader>
              <CardContent>
                <Image
                  className="disable-blur"
                  src={imageUrl}
                  alt={pokemon.name}
                  width={250}
                  height={250}
                  loading="lazy"
                  priority={false}
                />
              </CardContent>
            </Card>
          </Link>
        );
      })}
    </div>
  );
}
