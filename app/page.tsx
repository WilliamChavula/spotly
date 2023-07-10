import Header from "@/components/Header";
import ListItem from "@/components/ListItem";
import getSongs from "@/actions/getSongs";
import SongListGrid from "@/components/SongListGrid";

export const revalidate = 0;
export default async function Home() {
  const songs = await getSongs();
  return (
    <div className="bg-neutral-900 h-full w-full rounded-lg overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="font-semibold text-3xl text-white">Welcome back</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image="/images/liked.png"
              name="Loved Songs"
              href="loved"
            />
          </div>
        </div>
      </Header>
      <div className="mt-2 mb-6 px-6">
        <h1 className="text-white font-semibold text-2xl">Newest Songs</h1>
        <SongListGrid songs={songs} />
      </div>
    </div>
  );
}
