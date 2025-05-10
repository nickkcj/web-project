import React from "react";
import { PageLayout } from "../components/layout/PageLayout";
import { RegisterForm } from "../components/auth/RegisterForm";

const RegisterPage: React.FC = () => (
  <PageLayout>
    <section
      className="w-full min-h-screen flex items-center justify-center"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80')",
        backgroundSize: "cover",
        backgroundPosition: "center"
      }}
    >
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

