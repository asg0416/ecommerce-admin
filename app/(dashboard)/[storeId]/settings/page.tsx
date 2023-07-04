import useStoreState from "@/hooks/useStoreState";
import SettingForm from "./components/SettingForm";

interface SettingsPageProps {
  params: {
    storeId: string;
  };
}

const SettingsPage: React.FC<SettingsPageProps> = async ({ params }) => {
  const { store } = await useStoreState(params.storeId);
  
  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <SettingForm initialData={store}/>
      </div>
    </div>
  );
};

export default SettingsPage;
