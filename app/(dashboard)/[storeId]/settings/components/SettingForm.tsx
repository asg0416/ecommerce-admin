"use client";

import { Store } from "@prisma/client";

interface SettingFormProps {
  initialData: Store;
}

const SettingForm: React.FC<SettingFormProps> = ({ initialData }) => {
  return <div className="flex items-center justify-between">
    {/* <Heading
    title="Settings"
    description="Manage store preferences"
    /> */}
    </div>;
};

export default SettingForm;
