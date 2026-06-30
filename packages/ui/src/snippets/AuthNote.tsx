/**
 * Short reminder used on any page that makes authenticated requests.
 * Edit here to update the wording everywhere it appears.
 */
export function AuthNote() {
  return (
    <p>
      All requests require an <code>Authorization: Bearer YOUR_API_KEY</code> header.
      See <a href="/api/how-to-authenticate">How to Authenticate</a> for setup instructions.
    </p>
  );
}
