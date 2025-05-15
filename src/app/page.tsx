// src/app/page.tsx
import TermsForm from '../components/terms-form';


export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gray-50">
      <div className="w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8">
          Pabbly Integration
        </h1>
        
        <TermsForm />
        
        <p className="mt-6 text-center text-sm text-gray-500">
          This form integrates with Pabbly Connect for automated processing.
        </p>
      </div>
      
    </main>
  );
}