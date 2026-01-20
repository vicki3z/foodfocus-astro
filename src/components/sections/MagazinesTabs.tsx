import { TabsRoot, TabsList, TabsTrigger, TabsContent } from "../ui/Tabs";
import { MagazineCard } from "../ui/MagazineCard";

interface Magazine {
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  link: string;
  magazineNo: number;
  magazineType: string;
}

interface MagazinesTabsProps {
  magazines: Magazine[];
}

export function MagazinesTabs({ magazines }: MagazinesTabsProps) {
  // Sort magazines by date in descending order (newest first)
  const sortedMagazines = [...magazines].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Split magazines into two categories based on magazineType taxonomy
  const foodFocusMagazines = sortedMagazines.filter(
    (mag) => mag.magazineType === "fft"
  );

  const specialSupplementsMagazines = sortedMagazines.filter(
    (mag) => mag.magazineType === "supplement"
  );

  return (
    <TabsRoot defaultValue="food-focus" className="w-full">
      <TabsList className="w-full justify-center mb-8">
        <TabsTrigger value="food-focus">Food Focus Thailand</TabsTrigger>
        <TabsTrigger value="special-supplements">Special Supplements</TabsTrigger>
      </TabsList>

      <TabsContent value="food-focus">
        {foodFocusMagazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {foodFocusMagazines.map((magazine, index) => (
              <MagazineCard
                key={`${magazine.magazineNo}-${index}`}
                title={magazine.title}
                date={magazine.date}
                image={magazine.image}
                imageAlt={magazine.imageAlt}
                link={magazine.link}
                magazineNo={magazine.magazineNo}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-text-muted)] py-12">
            No Food Focus Thailand magazines found.
          </p>
        )}
      </TabsContent>

      <TabsContent value="special-supplements">
        {specialSupplementsMagazines.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialSupplementsMagazines.map((magazine, index) => (
              <MagazineCard
                key={`${magazine.magazineNo}-${index}`}
                title={magazine.title}
                date={magazine.date}
                image={magazine.image}
                imageAlt={magazine.imageAlt}
                link={magazine.link}
                magazineNo={magazine.magazineNo}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-text-muted)] py-12">
            No Special Supplements magazines found.
          </p>
        )}
      </TabsContent>
    </TabsRoot>
  );
}
