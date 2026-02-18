export default function ContactPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-foreground">Contact</h1>
        <p className="text-muted-foreground mb-8">
          Get in touch — I’d love to hear from you.
        </p>
        <div className="bg-card rounded-lg border border-border p-6 space-y-4">
          <p className="text-foreground">
            <a
              href="https://linkedin.com/in/kate-eyler"
              className="text-primary hover:underline"
            >
              LinkedIn
            </a>
          </p>
          <p className="text-foreground">
            <a
              href="https://github.com/k8eyler"
              className="text-primary hover:underline"
            >
              GitHub
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
