"use client"

import { useState, useEffect, useCallback, useRef } from "react";
import PokemonList from "@/components/pokemon-list";
import { Suspense } from "react";
import { PokemonClient, NamedAPIResource } from "pokenode-ts";

const INITIAL_LIMIT = 100;
const PAGE_SIZE = 50;

export default function Home() {
  const [allPokemons, setAllPokemons] = useState<NamedAPIResource[]>([]);
  const [displayedPokemons, setDisplayedPokemons] = useState<NamedAPIResource[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [offset, setOffset] = useState(0);
  const loader = useRef<HTMLDivElement>(null);

  const fetchPokemons = useCallback(async (limit: number, offset: number) => {
    const api = new PokemonClient();
    const data = await api.listPokemons(offset, limit);
    return data.results;
  }, []);

  useEffect(() => {
    const loadInitialPokemons = async () => {
      setLoading(true);
      const initialPokemons = await fetchPokemons(INITIAL_LIMIT, 0);
      setAllPokemons(initialPokemons);
      setDisplayedPokemons(initialPokemons);
      setLoading(false);
    };

    loadInitialPokemons();
  }, [fetchPokemons]);

  useEffect(() => {
    const loadMorePokemons = async () => {
      if (!hasMore || loading) return;
      setLoading(true);
      const newPokemons = await fetchPokemons(PAGE_SIZE, offset);
      if (newPokemons.length < PAGE_SIZE) {
        setHasMore(false);
      }
      setAllPokemons(prev => [...prev, ...newPokemons]);
      setDisplayedPokemons(prev => [...prev, ...newPokemons]);
      setLoading(false);
    };

    loadMorePokemons();
  }, [offset, fetchPokemons, hasMore, loading]);

  useEffect(() => {
    const handleScroll = () => {
      if (loader.current) {
        const { scrollTop, clientHeight, scrollHeight } = document.documentElement;
        if (scrollHeight - scrollTop <= clientHeight + 10) {
          setOffset(prev => prev + PAGE_SIZE);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Suspense fallback={<div>Loading Pokémon list...</div>}>
        <PokemonList pokemons={displayedPokemons} />
        <div ref={loader} className="text-center p-4">
          {loading && <div>Loading more...</div>}
          {!hasMore && <div>No more Pokémon to load.</div>}
        </div>
      </Suspense>
    </main>
  );
}
