export function Textarea({ className = "", ...props }) {
  return (
    <textarea
      className={`border p-2 rounded w-full ${className}`}
      rows={4}
      {...props}
    />
  );
}