import { useState, useEffect } from "react";
import { LogIn, LogOut, User, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser } from "@supabase/supabase-js";
import logo from "@/assets/logo.png";
import { toast } from "sonner";
import { ThemeToggle } from "./ThemeToggle";

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);
  
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to sign out");
    } else {
      toast.success("Signed out successfully");
      navigate("/");
    }
  };

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/compare", label: "Compare" },
    { path: "/about", label: "About" },
  ];
  
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-border/50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 rounded-lg blur group-hover:blur-md transition-all" />
            <img src={logo} alt="GenCheck Logo" className="w-9 h-9 relative z-10" />
          </div>
          <span className="text-xl font-bold gradient-text">GenCheck</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link key={link.path} to={link.path}>
              <Button 
                variant="ghost" 
                className={`font-medium transition-all ${
                  isActive(link.path) 
                    ? 'text-primary bg-primary/10' 
                    : 'text-foreground/70 hover:text-foreground hover:bg-secondary'
                }`}
              >
                {link.label}
              </Button>
            </Link>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />
          {user ? (
            <>
              <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full">
                <div className="w-7 h-7 rounded-full gradient-bg flex items-center justify-center">
                  <User className="w-4 h-4 text-primary-foreground" />
                </div>
                <span className="text-sm font-medium text-foreground truncate max-w-[120px]">
                  {user.user_metadata?.display_name || user.email?.split('@')[0]}
                </span>
              </div>
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="font-medium"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Link to="/auth">
              <Button className="btn-primary font-medium">
                <LogIn className="w-4 h-4 mr-2" />
                Sign In
              </Button>
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden p-2 text-foreground"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-background border-b border-border shadow-lg animate-slide-up">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <Button 
                  variant="ghost" 
                  className={`w-full justify-start font-medium ${
                    isActive(link.path) 
                      ? 'text-primary bg-primary/10' 
                      : 'text-foreground/70'
                  }`}
                >
                  {link.label}
                </Button>
              </Link>
            ))}
            
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">Theme</span>
              <ThemeToggle />
            </div>
            
            <div className="pt-4 border-t border-border">
              {user ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-xl">
                    <div className="w-8 h-8 rounded-full gradient-bg flex items-center justify-center">
                      <User className="w-4 h-4 text-primary-foreground" />
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user.user_metadata?.display_name || user.email?.split('@')[0]}
                    </span>
                  </div>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      handleSignOut();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full font-medium"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Link to="/auth" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full btn-primary font-medium">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;