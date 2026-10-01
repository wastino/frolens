import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Gallery from "@/components/Gallery";
import CorporatePhotos from "@/components/CorporatePhotos";
import About from "@/components/About";
import Contact from "@/components/Contact";
import { fetchPhotosFromS3 } from "@/lib/s3";
import { localPhotos } from "@/lib/photos";

export const dynamic = "force-dynamic";

export default async function Home() {
  const s3Photos = await fetchPhotosFromS3();
  const s3Categories = new Set(s3Photos.map((photo) => photo.category));
  const photos = [
    ...s3Photos,
    ...localPhotos.filter((photo) => !s3Categories.has(photo.category)),
  ];

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Gallery photos={photos} />
        <CorporatePhotos photos={photos.filter((photo) => photo.category === "corporate")} />
        <About />
        <Contact />
      </main>
    </>
  );
}
