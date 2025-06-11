export default function OutlineBorder({ children }: {
  children: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-center bg-transparent border rounded-full w-10 h-10 hover:bg-accent hover:text-accent-foreground">
      {children}
    </div>
  );
}