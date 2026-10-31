import { useState } from "react";
import { Fields } from "./FieldTree";
import { Card, LangTabs, PanelHeader } from "./ui";

export const TextPanel = ({ section, title, text, update }) => {
  const [lang, setLang] = useState("en");
  const value = text?.[lang]?.[section];

  return (
    <div data-testid={`admin-text-panel-${section}`}>
      <PanelHeader title={title} desc="Edit the words shown on the website. Switch the language to edit the Hindi and Marathi versions, then press Save.">
        <LangTabs value={lang} onChange={setLang} />
      </PanelHeader>
      {value && (
        <Card>
          <Fields key={lang} obj={value} path={[section]} onChange={(path, v) => update(["text", lang, ...path], v)} />
        </Card>
      )}
    </div>
  );
};
