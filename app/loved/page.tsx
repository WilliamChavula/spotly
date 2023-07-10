import fetchLovedSongs from "@/actions/fetchLovedSongs";
import Header from "@/components/Header";
import Image from "next/image";
import LovedSongsPlaylist from "@/components/LovedSongsPlaylist";

export const revalidate = 0;
const LovedSongsPage = async () => {
  const songs = await fetchLovedSongs();
  return (
    <div className="bg-neutral-900 h-full w-full overflow-hidden overflow-y-auto rounded-lg">
      <Header>
        <div className="mt-5">
          <div className="flex flex-col md:flex-row items-center gap-x-4">
            <div className="relative h-32 w-32 lg:h-44 lg:w-44">
              <Image
                src="/images/liked.png"
                alt="Loved songs"
                fill
                className="object-cover rounded-md"
              />
            </div>
            <div className="flex flex-col gap-y-2 mt-4 md:mt-0">
              <p className="hidden md:block font-semibold text-sm">PlayList</p>
              <h1 className="text-white text-4xl lg:text-7xl font-bold">
                Loved Songs
              </h1>
            </div>
          </div>
        </div>
      </Header>
      <LovedSongsPlaylist songs={songs} />
    </div>
  );
};

export default LovedSongsPage;
