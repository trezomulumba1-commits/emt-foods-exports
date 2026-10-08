export default function Settings() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-primary">Settings</h1>
      </div>

      <div className="card p-6 max-w-2xl">
        <h3 className="text-sm font-medium text-primary mb-4">Workspace Preferences</h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between py-2 border-b border-subtle">
            <div>
              <div className="text-sm font-medium">Dark Mode</div>
              <div className="text-xs text-muted">Toggle the dark mode aesthetic</div>
            </div>
            <button 
              onClick={() => {
                const isDark = document.documentElement.classList.toggle('dark');
                localStorage.setItem('emt-admin-theme', isDark ? 'dark' : 'light');
              }}
              className="btn-secondary text-xs"
            >
              Toggle Theme
            </button>
          </div>

          <div className="flex items-center justify-between py-2 border-b border-subtle">
            <div>
              <div className="text-sm font-medium">Cloudinary Uploads</div>
              <div className="text-xs text-muted">Manage your image hosting configuration</div>
            </div>
            <div className="badge">Configured in .env</div>
          </div>
        </div>
      </div>
    </div>
  );
}
