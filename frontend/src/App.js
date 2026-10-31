import { HashRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { SiteProvider } from "@/content/SiteProvider";
import { LanguageProvider } from "@/i18n";
import AdminPage from "@/pages/AdminPage";
import Landing from "@/pages/Landing";

function App() {
  return (
    <SiteProvider>
      <LanguageProvider>
        <HashRouter>
          <Routes>
            <Route path="/admin" element={<AdminPage />} />
            <Route path="*" element={<Landing />} />
          </Routes>
        </HashRouter>
        <Toaster position="top-center" richColors />
      </LanguageProvider>
    </SiteProvider>
  );
}

export default App;