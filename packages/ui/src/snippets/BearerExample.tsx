/**
 * Canonical curl snippet showing bearer auth.
 * Reuse on any page that shows an example request.
 */
export function BearerExample() {
  return (
    <pre>
      <code>{`curl https://api.example.com/v1/widgets \\
  -H "Authorization: Bearer YOUR_API_KEY"`}</code>
    </pre>
  );
}
