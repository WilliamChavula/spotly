import React from "react";

import getSongs from "@/actions/getSongs";

import Header from "@/components/Header";
import SearchDisplay from "@/components/SearchDisplay";
import SearchInput from "@/components/SearchInput";

interface SearchPageProps {
  searchParams: { term: string };
}

export const revalidate = 0;
export default async function SearchPage({ searchParams }: SearchPageProps) {
  const matchedSongs = await getSongs(searchParams.term);

  return (
    <div className="bg-neutral-900 overflow-hidden overflow-y-auto rounded-lg w-full h-full">
      <Header className="from-neutral-900">
        <div className="flex flex-col gap-y-4">
          <h1 className="font-semibold text-white text-3xl">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchDisplay songs={matchedSongs} />
    </div>
  );
}
