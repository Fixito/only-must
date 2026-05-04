export default function Footer() {
  return (
    <footer className="container py-12">
      <p className="text-muted-foreground mx-auto text-center text-sm">
        &copy; {new Date().getFullYear()} OnlyMust. All rights reserved.
      </p>
    </footer>
  );
}
