import { useEffect, useState } from "react";
import { EditorShell } from "@/admin/EditorShell";
import { LoginForm } from "@/admin/LoginForm";
import { useAdminAuth } from "@/admin/useAdminAuth";
import { Splash } from "@/components/site/Splash";
import { useSite } from "@/content/SiteProvider";

const toDraft = (site) => ({
  text: site.text,
  settings: site.settings,
  images: site.images,
  reviews: site.reviews,
  videos: site.videos,
});

export default function AdminPage() {
  const site = useSite();
  const auth = useAdminAuth();
  const [draft, setDraft] = useState(null);
  const [savedJson, setSavedJson] = useState("");

  useEffect(() => {
    const prevTitle = document.title;
    document.title = "Admin · Niramaya Physiotherapy";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex, nofollow";
    document.head.appendChild(meta);
    return () => {
      document.title = prevTitle;
      meta.remove();
    };
  }, []);

  useEffect(() => {
    if (site.loading || draft !== null) return;
    const initial = toDraft(site);
    setDraft(initial);
    setSavedJson(JSON.stringify(initial));
  }, [site, draft]);

  if (auth.user === null || draft === null) return <Splash />;
  if (auth.user === false) return <LoginForm onLogin={auth.login} />;

  return (
    <EditorShell
      user={auth.user}
      onLogout={auth.logout}
      onExpired={() => auth.setUser(false)}
      draft={draft}
      setDraft={setDraft}
      dirty={JSON.stringify(draft) !== savedJson}
      onSaved={(remote) => {
        setSavedJson(JSON.stringify(draft));
        site.setRemote(remote);
      }}
    />
  );
}
