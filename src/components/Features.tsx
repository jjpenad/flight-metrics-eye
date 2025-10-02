import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Shield, Clock, BarChart3, Users, Cloud } from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Digital MTR Management",
    description: "Digitize all maintenance records with smart organization and instant access to aircraft history.",
  },
  {
    icon: Shield,
    title: "Compliance Tracking",
    description: "Stay FAA compliant with automated alerts for upcoming inspections and certifications.",
  },
  {
    icon: Clock,
    title: "Real-Time Updates",
    description: "Update maintenance records instantly from any device with live synchronization.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Gain insights into maintenance trends, costs, and aircraft availability.",
  },
  {
    icon: Users,
    title: "Team Collaboration",
    description: "Enable seamless collaboration between mechanics, inspectors, and management.",
  },
  {
    icon: Cloud,
    title: "Secure Cloud Storage",
    description: "Enterprise-grade security with automatic backups and disaster recovery.",
  },
];

const Features = () => {
  return (
    <section id="features" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Powerful Features for Aviation Excellence</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Everything you need to manage aircraft maintenance records efficiently and professionally.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} className="hover-lift border-border">
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
