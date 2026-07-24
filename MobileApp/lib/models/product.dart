class Product {
  final String id;
  final String title;
  final String tagline;
  final String price;
  final String description;
  final List<String> features;
  final String iconName;
  final bool isPopular;

  const Product({
    required this.id,
    required this.title,
    required this.tagline,
    required this.price,
    required this.description,
    required this.features,
    required this.iconName,
    this.isPopular = false,
  });

  static const List<Product> catalog = [
    Product(
      id: 'tower-pro',
      title: 'Gravity Tower Pro',
      tagline: 'Full-Spectrum Hydroponic System',
      price: 'LKR 265,000',
      description: 'Vertical 80-plant site tower with integrated IoT sensors, automated nutrient dosing, and mobile sync.',
      features: [
        '80 Plant Sites',
        'Built-in IoT Sensor Array',
        'Auto Nutrient Dosing Pump',
        'Full-Spectrum LED Grow Lights',
        'Mobile Real-Time Telemetry',
      ],
      iconName: 'sprout',
      isPopular: true,
    ),
    Product(
      id: 'tower-mini',
      title: 'Hydro Tower Mini',
      tagline: 'Compact Home Organic Kit',
      price: 'LKR 135,000',
      description: 'Ideal for indoor kitchens and balconies with 32 plant sites and low-energy silent recirculation pump.',
      features: [
        '32 Plant Sites',
        'Silent Recirculation Water Pump',
        'Compact 2ft Footprint',
        'WiFi Connectivity',
        'Easy Plug-and-Play Setup',
      ],
      iconName: 'droplets',
    ),
    Product(
      id: 'commercial-aeroponic',
      title: 'Commercial Aeroponic Array',
      tagline: 'Industrial High-Yield Farm Scale',
      price: 'LKR 1,050,000',
      description: 'Industrial-grade multi-tower cluster for commercial greenhouses with AI yield optimization and centralized cloud telemetry.',
      features: [
        'Multi-Tower Modular Network (400+ Plants)',
        'Dual Dosing Reservoirs & EC/pH Controls',
        'AI Micro-climate & Automation Hub',
        'Multi-User Cloud Dashboard',
        'Dedicated Technical Support',
      ],
      iconName: 'cpu',
    ),
  ];
}
