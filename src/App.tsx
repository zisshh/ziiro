import { TooltipProvider } from "@/components/ui/tooltip";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const Index = lazy(() => import("./pages/Index"));
const Services = lazy(() => import("./pages/Services"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const Audit = lazy(() => import("./pages/Audit"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark">
    <TooltipProvider>
      <BrowserRouter>
        <Navbar />
        <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
        <Footer />
      </BrowserRouter>
    </TooltipProvider>
  </ThemeProvider>
);

export default App;
