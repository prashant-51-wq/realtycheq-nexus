import { 
  Home, 
  PaintBucket, 
  Calculator, 
  Users, 
  CheckCircle 
} from 'lucide-react';

const FeaturesSection = () => {
  const features = [
    {
      id: 1,
      icon: Home,
      title: "House Plans",
      description: "Custom architectural designs",
      bgColor: "bg-gradient-to-br from-primary/10 to-primary/5",
      bullets: [
        "Modern & Traditional Designs",
        "3D Visualization Available",
        "Vastu Compliant Plans",
        "Customizable Layouts"
      ]
    },
    {
      id: 2,
      icon: PaintBucket,
      title: "Interior Design",
      description: "Complete interior solutions",
      bgColor: "bg-gradient-to-br from-secondary/10 to-secondary/5",
      bullets: [
        "Space Planning & Layout",
        "Material Selection Guide",
        "Color Scheme Consultation",
        "Furniture & Decor Ideas"
      ]
    },
    {
      id: 3,
      icon: Calculator,
      title: "Cost Estimation",
      description: "Accurate project budgeting",
      bgColor: "bg-gradient-to-br from-success/10 to-success/5",
      bullets: [
        "Detailed Material Costing",
        "Labour Cost Analysis",
        "Timeline Estimation",
        "Budget Optimization Tips"
      ]
    },
    {
      id: 4,
      icon: Users,
      title: "Expert Consultation",
      description: "Professional guidance",
      bgColor: "bg-gradient-to-br from-warning/10 to-warning/5",
      bullets: [
        "Experienced Architects",
        "Structural Engineers",
        "Interior Designers",
        "Project Management"
      ]
    }
  ];

  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <h2 className="text-display mb-4 bg-primary-gradient bg-clip-text text-transparent">
            Your One-Stop Destination For Home Plans And Designs
          </h2>
          <p className="text-subheadline max-w-3xl mx-auto">
            We provide end-to-end solutions for your dream home.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {features.map((feature) => {
            const IconComponent = feature.icon;
            return (
              <div
                key={feature.id}
                className={`
                  relative p-6 lg:p-8 
                  ${feature.bgColor}
                  rounded-tl-3xl rounded-br-3xl
                  shadow-soft hover:shadow-medium
                  transition-all duration-300 ease-out
                  hover:scale-105
                  group
                `}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-soft group-hover:shadow-medium transition-all duration-300">
                    <IconComponent className="w-7 h-7 text-primary" />
                  </div>
                </div>

                {/* Title with Pill Background */}
                <div className="mb-4">
                  <div className="inline-block bg-background/90 backdrop-blur-sm rounded-full px-4 py-2 shadow-soft">
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {feature.description}
                  </p>
                </div>

                {/* Bullet Points */}
                <div className="space-y-3 mb-8">
                  {feature.bullets.map((bullet, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-success mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-foreground leading-relaxed">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Brand Logo */}
                <div className="absolute bottom-4 right-6">
                  <div className="text-xs font-semibold text-primary/70 bg-background/50 backdrop-blur-sm rounded-lg px-3 py-1">
                    RealtyCheq
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile Horizontal Scroll Alternative */}
        <div className="block sm:hidden mt-8">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {features.map((feature) => {
              const IconComponent = feature.icon;
              return (
                <div
                  key={`mobile-${feature.id}`}
                  className={`
                    min-w-[280px] p-6 
                    ${feature.bgColor}
                    rounded-tl-3xl rounded-br-3xl
                    shadow-soft
                    relative
                  `}
                >
                  {/* Icon */}
                  <div className="mb-4">
                    <div className="w-12 h-12 rounded-xl bg-background/80 backdrop-blur-sm flex items-center justify-center shadow-soft">
                      <IconComponent className="w-6 h-6 text-primary" />
                    </div>
                  </div>

                  {/* Title with Pill Background */}
                  <div className="mb-4">
                    <div className="inline-block bg-background/90 backdrop-blur-sm rounded-full px-3 py-1.5 shadow-soft">
                      <h3 className="font-display text-base font-bold text-foreground">
                        {feature.title}
                      </h3>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {feature.description}
                    </p>
                  </div>

                  {/* Bullet Points */}
                  <div className="space-y-2 mb-6">
                    {feature.bullets.map((bullet, index) => (
                      <div key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-3.5 h-3.5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-foreground leading-relaxed">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Brand Logo */}
                  <div className="absolute bottom-3 right-4">
                    <div className="text-xs font-semibold text-primary/70 bg-background/50 backdrop-blur-sm rounded-lg px-2 py-1">
                      RealtyCheq
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;