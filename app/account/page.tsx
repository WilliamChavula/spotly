import Header from "@/components/Header";
import AccountContent from "@/app/account/Components/AccountContent";

const Page = () => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <h1 className="mb-2 text-white text-3xl font-semibold">
          Account Settings
        </h1>
      </Header>
      <AccountContent />
    </div>
  );
};

export default Page;
