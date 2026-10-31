import { LanguageProvider } from "@/i18n";
import Landing from "@/pages/Landing";

function App() {
  return (
    <LanguageProvider>
      <Landing />
    </LanguageProvider>
  );
}

export default App;
