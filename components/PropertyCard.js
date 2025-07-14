export default function PropertyCard({ title, location, description, price }) {
  return (
    <div className="border p-4 rounded shadow">
      <h3 className="text-xl font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{location}</p>
      <p className="my-2">{description}</p>
      <p className="font-semibold">${price}</p>
    </div>
  );
}