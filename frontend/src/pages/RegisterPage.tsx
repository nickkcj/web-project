import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { RegisterForm } from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => (
  <PageLayout>
    <section className="w-full flex items-center justify-center min-h-[600px]">
      <RegisterForm
        onSubmit={(name, email, password) => {
          // handle registration logic here
          console.log(name, email, password);
        }}
        onCancel={() => {
          // handle cancel logic here (e.g., redirect or clear form)
        }}
      />
    </section>
  </PageLayout>
);

export default RegisterPage;

