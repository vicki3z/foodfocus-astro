interface MagazineCardProps {
  title: string;
  date: string;
  image: string;
  imageAlt: string;
  link: string;
  magazineNo: number;
}

export function MagazineCard({
  title,
  date,
  image,
  imageAlt,
  link,
  magazineNo,
}: MagazineCardProps) {
  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group block bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Magazine Cover Image */}
      <div className="overflow-hidden bg-gray-100 h-[270px] flex items-center justify-center" style={{ textAlign: 'center' }}>
        <img
          src={image}
          alt={imageAlt || title}
          className="object-contain group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            margin: '0 auto',
            display: 'block'
          }}
        />
      </div>

      {/* Magazine Info */}
      <div className="p-4">
        <p className="text-sm font-semibold text-[var(--color-text-dark)] mb-1">
          No. {magazineNo}
        </p>
        <p className="text-sm text-[var(--color-text-muted)] flex items-center gap-2">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
          {title}
        </p>
      </div>
    </a>
  );
}
