
import { AppLayout } from "@/components/layout/AppLayout";
import { PersonalInfoForm } from "@/components/profile/PersonalInfoForm";
import { PasswordForm } from "@/components/profile/PasswordForm";
import { UserAvatar } from "@/components/profile/UserAvatar";
import { User } from "lucide-react";

const Profile = () => {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <User className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Meu Perfil</h1>
            <p className="text-muted-foreground">
              Gerencie suas informações pessoais e configurações de segurança
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <UserAvatar />
          </div>
          
          <div className="lg:col-span-2 space-y-6">
            <PersonalInfoForm />
            <PasswordForm />
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;
