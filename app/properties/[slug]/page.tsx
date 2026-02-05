import { notFound } from "next/navigation";
import { properties } from "@/data/properties";
import { Property } from "@/data/properties";
import PropertyImage from "@/components/PropertyImage";

interface PropertyDetailPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatPrice(price: number) {
  // Convert USD to AED (approximate rate: 1 USD = 3.67 AED)
  const aedPrice = price * 3.67;
  return `AED ${aedPrice.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;
}

export async function generateStaticParams() {
  return properties.map((property) => ({
    slug: property.slug,
  }));
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property: Property | undefined = properties.find(
    (p) => p.slug === slug
  );

  if (!property) {
    notFound();
  }

  // Generate amenities based on property features
  const amenities = [
    { icon: "🛏️", label: `${property.bedrooms} BEDROOMS` },
    { icon: "🏊", label: "2 SWIMMING POOL" },
    { icon: "🍽️", label: "RESTAURANTS NEARBY" },
    { icon: "🧺", label: "LAUNDRY" },
    { icon: "💪", label: "1 FITNESS GYM" },
    { icon: "🚗", label: "1 GARAGES" },
    { icon: "🚿", label: `${property.bathrooms} BATHROOMS` },
    { icon: "❄️", label: "AIR CONDITIONED" },
  ];

  // Get the primary image URL, ensuring we have a valid URL
  const primaryImage = property.images && property.images.length > 0 
    ? property.images[0] 
    : property.image;

  return (
    <div className="min-h-screen bg-white -mt-20">
      {/* Main Property Image */}
      <section className="relative w-full h-[60vh] min-h-[500px] bg-gray-200">
        <div className="relative w-full h-full">
          <PropertyImage
            src={primaryImage}
            fallbackSrc={property.image}
            alt={property.name}
          />
        </div>
      </section>

      {/* Property Information Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content - Left Side */}
          <div className="lg:col-span-2 space-y-6">
            {/* Price */}
            <div>
              <p className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                {formatPrice(property.price)}
              </p>
            </div>

            {/* Property Icons */}
            <div className="flex items-center gap-6 md:gap-8 mb-6">
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                <span className="text-base font-medium text-gray-700">
                  {property.bedrooms}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M2.5 1a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1V2a1 1 0 00-1-1h-.5zM6 1a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V2a1 1 0 00-1-1H6zM11 1a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1V2a1 1 0 00-1-1h-.5zM16 1a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1V2a1 1 0 00-1-1H16zM2.5 6a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1V7a1 1 0 00-1-1h-.5zM6 6a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1V7a1 1 0 00-1-1H6zM11 6a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1V7a1 1 0 00-1-1h-.5zM16 6a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1V7a1 1 0 00-1-1H16zM2.5 11a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1v-1a1 1 0 00-1-1h-.5zM6 11a1 1 0 00-1 1v1a1 1 0 001 1h1a1 1 0 001-1v-1a1 1 0 00-1-1H6zM11 11a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1v-1a1 1 0 00-1-1h-.5zM16 11a1 1 0 00-1 1v1a1 1 0 001 1h.5a1 1 0 001-1v-1a1 1 0 00-1-1H16z" />
                </svg>
                <span className="text-base font-medium text-gray-700">
                  {property.bathrooms}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  className="w-5 h-5 text-gray-700"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z" clipRule="evenodd" />
                </svg>
                <span className="text-base font-medium text-gray-700">
                  {property.area.toLocaleString()} {property.areaUnit}
                </span>
              </div>
            </div>

            {/* Property Name */}
            <div>
              <h1 className="text-2xl md:text-3xl font-serif text-gray-900 mb-3">
                {property.name.toUpperCase()}
              </h1>
            </div>

            {/* Location */}
            <div>
              <p className="text-base text-gray-600 mb-6">
                {property.location}
              </p>
            </div>

            {/* Description */}
            <div>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {property.description}
              </p>
            </div>
          </div>

          {/* Right Sidebar - Empty space as per design (Agent Details and Property Details are excluded) */}
          <div className="lg:col-span-1"></div>
        </div>
      </section>

      {/* Property Amenities Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-serif text-gray-900 mb-12 text-center">
            PROPERTY AMENITIES
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              {amenities.slice(0, 3).map((amenity, index) => (
                <div key={index} className="flex items-center gap-4">
                  <span className="text-4xl">{amenity.icon}</span>
                  <span className="text-lg font-medium text-gray-700">
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Middle Column */}
            <div className="space-y-6">
              {amenities.slice(3, 6).map((amenity, index) => (
                <div key={index + 3} className="flex items-center gap-4">
                  <span className="text-4xl">{amenity.icon}</span>
                  <span className="text-lg font-medium text-gray-700">
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {amenities.slice(6).map((amenity, index) => (
                <div key={index + 6} className="flex items-center gap-4">
                  <span className="text-4xl">{amenity.icon}</span>
                  <span className="text-lg font-medium text-gray-700">
                    {amenity.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
