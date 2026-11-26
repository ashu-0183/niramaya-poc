import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { BRANCHES } from "@/content/branches";
import { SiteProvider } from "@/content/SiteProvider";
import Landing from "./Landing";

const BranchSEO = ({ branch }) => {
  useEffect(() => {
    const canonicalUrl = `https://physiohelp.in/branches/${branch.slug}`;
    const prevTitle = document.title;
    document.title = branch.seo.title;

    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    const prevDesc = metaDesc.content;
    metaDesc.content = branch.seo.description;

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    const prevCanonical = canonical.href;
    canonical.href = canonicalUrl;

    const schemaId = "branch-jsonld-schema";
    let script = document.getElementById(schemaId);
    if (!script) {
      script = document.createElement("script");
      script.id = schemaId;
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }

    script.textContent = JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "MedicalClinic",
        name: `Niramaya Physiotherapy - ${branch.name}`,
        url: canonicalUrl,
        telephone: branch.phone,
        address: {
          "@type": "PostalAddress",
          streetAddress: branch.address,
          addressLocality: "Pune",
          addressRegion: "Maharashtra",
          postalCode: branch.pincode,
          addressCountry: "IN",
        },
        geo: {
          "@type": "GeoCoordinates",
          latitude: branch.geo.latitude,
          longitude: branch.geo.longitude,
        },
        openingHours: "Mo-Su 07:30-21:00",
        medicalSpecialty: "Physiotherapy",
      },
      {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Where is Niramaya Physiotherapy ${branch.shortName} located?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `Our ${branch.name} is located at ${branch.address}.`,
            },
          },
          {
            "@type": "Question",
            name: `What are the clinic timings for Niramaya Physiotherapy in ${branch.shortName}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: `The ${branch.name} is open daily from ${branch.hours}.`,
            },
          },
        ],
      },
    ]);

    return () => {
      document.title = prevTitle;
      metaDesc.content = prevDesc;
      if (prevCanonical) canonical.href = prevCanonical;
      if (script) script.remove();
    };
  }, [branch]);

  return null;
};

export default function BranchPage() {
  const { slug } = useParams();
  const branch = BRANCHES[slug?.toLowerCase()];

  if (!branch) return <Navigate to="/" replace />;

  return (
    <SiteProvider branch={branch}>
      <BranchSEO branch={branch} />
      <nav aria-label="Breadcrumb" className="bg-[#052f36] px-4 py-2 text-xs text-white/80">
        <div className="shell flex items-center gap-2">
          <Link to="/" className="hover:text-[#8be04e]">Home</Link>
          <span>/</span>
          <span>Branches</span>
          <span>/</span>
          <span className="font-semibold text-[#8be04e]">{branch.name}</span>
        </div>
      </nav>
      <Landing />
    </SiteProvider>
  );
}