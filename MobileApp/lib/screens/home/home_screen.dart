import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:google_fonts/google_fonts.dart';
import '../../models/product.dart';
import '../../services/auth_service.dart';
import '../../theme/app_theme.dart';

class HomeScreen extends StatefulWidget {
  final VoidCallback onNavigateToDashboard;

  const HomeScreen({super.key, required this.onNavigateToDashboard});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> with SingleTickerProviderStateMixin {
  late AnimationController _animationController;
  final ScrollController _scrollController = ScrollController();
  final GlobalKey _productsKey = GlobalKey();
  
  // Interactive Hydroponic Calculator State
  double _numPlants = 40;
  double _currentWaterLitresPerMonth = 500;

  @override
  void initState() {
    super.initState();
    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 4),
    )..repeat(reverse: true);
  }

  @override
  void dispose() {
    _animationController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToProducts() {
    final targetContext = _productsKey.currentContext;
    if (targetContext != null) {
      Scrollable.ensureVisible(
        targetContext,
        duration: const Duration(milliseconds: 600),
        curve: Curves.easeInOut,
      );
    }
  }

  void _showOrderBottomSheet(Product product) {
    final authService = Provider.of<AuthService>(context, listen: false);
    final user = authService.currentUser;

    final nameController = TextEditingController(text: user?.name ?? '');
    final phoneController = TextEditingController(text: user?.phoneNumber ?? '');
    final addressController = TextEditingController(text: user?.deliveryAddress ?? '');
    String selectedPaymentMethod = 'Cash on Delivery';

    showModalBottomSheet(
      context: context,
      backgroundColor: AppColors.surface,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: EdgeInsets.only(
                top: 24,
                left: 24,
                right: 24,
                bottom: MediaQuery.of(context).viewInsets.bottom + 24,
              ),
              child: SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Expanded(
                          child: Text(
                            'Order ${product.title}',
                            style: GoogleFonts.inter(
                              fontSize: 18,
                              fontWeight: FontWeight.bold,
                              color: Colors.white,
                            ),
                          ),
                        ),
                        IconButton(
                          icon: const Icon(Icons.close, color: AppColors.textSecondary),
                          onPressed: () => Navigator.pop(context),
                        ),
                      ],
                    ),
                    Text(
                      'Price: ${product.price}',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        color: AppColors.primaryLight,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 16),
                    TextField(
                      controller: nameController,
                      style: GoogleFonts.inter(color: Colors.white),
                      decoration: const InputDecoration(
                        labelText: 'Customer Name',
                        prefixIcon: Icon(Icons.person_outline),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: phoneController,
                      keyboardType: TextInputType.phone,
                      style: GoogleFonts.inter(color: Colors.white),
                      decoration: const InputDecoration(
                        labelText: 'Phone Number',
                        prefixIcon: Icon(Icons.phone_outlined),
                      ),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: addressController,
                      maxLines: 2,
                      style: GoogleFonts.inter(color: Colors.white),
                      decoration: const InputDecoration(
                        labelText: 'Delivery Address',
                        prefixIcon: Icon(Icons.location_on_outlined),
                      ),
                    ),
                    const SizedBox(height: 12),
                    DropdownButtonFormField<String>(
                      initialValue: selectedPaymentMethod,
                      dropdownColor: AppColors.surfaceLight,
                      style: GoogleFonts.inter(color: Colors.white, fontSize: 14),
                      decoration: const InputDecoration(
                        labelText: 'Payment Method',
                        prefixIcon: Icon(Icons.payment_outlined),
                      ),
                      items: const [
                        DropdownMenuItem(value: 'Cash on Delivery', child: Text('Cash on Delivery')),
                        DropdownMenuItem(value: 'Bank Transfer / Direct Deposit', child: Text('Bank Transfer / Direct Deposit')),
                        DropdownMenuItem(value: 'Online Card Payment', child: Text('Online Credit / Debit Card')),
                      ],
                      onChanged: (val) {
                        if (val != null) {
                          setModalState(() => selectedPaymentMethod = val);
                        }
                      },
                    ),
                    const SizedBox(height: 24),
                    SizedBox(
                      width: double.infinity,
                      height: 52,
                      child: ElevatedButton(
                        onPressed: () {
                          final messenger = ScaffoldMessenger.of(context);
                          Navigator.pop(context);
                          messenger.showSnackBar(
                            SnackBar(
                              content: Text('Thank you! Order inquiry for ${product.title} (${product.price}) submitted via $selectedPaymentMethod.'),
                              backgroundColor: AppColors.primary,
                            ),
                          );
                        },
                        child: const Text('Confirm Order Inquiry'),
                      ),
                    ),
                  ],
                ),
              ),
            );
          },
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.surface : AppColors.lightSurface;
    final cardBorder = isDark ? AppColors.surfaceBorder : AppColors.lightSurfaceBorder;
    final textColor = isDark ? Colors.white : AppColors.lightTextPrimary;
    final secondaryTextColor = isDark ? AppColors.textSecondary : AppColors.lightTextSecondary;

    // Calculator outputs
    final waterSaved = (_currentWaterLitresPerMonth * 0.95).round();
    final estimatedYieldKg = (_numPlants * 0.4).toStringAsFixed(1);

    return Scaffold(
      body: SingleChildScrollView(
        controller: _scrollController,
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Header / Hero Section
            Container(
              padding: const EdgeInsets.only(top: 24, left: 20, right: 20, bottom: 40),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [AppColors.background, Color(0xFF0D1B2A)],
                  begin: Alignment.topCenter,
                  end: Alignment.bottomCenter,
                ),
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // Badge tag
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 6),
                    decoration: BoxDecoration(
                      color: AppColors.primary.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.primary.withValues(alpha: 0.4)),
                    ),
                    child: Row(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        const Icon(Icons.bolt_rounded, size: 16, color: AppColors.primaryLight),
                        const SizedBox(width: 6),
                        Text(
                          'NEXT-GEN HYDROPONIC SYSTEMS',
                          style: GoogleFonts.inter(
                            fontSize: 11,
                            fontWeight: FontWeight.bold,
                            color: AppColors.primaryLight,
                            letterSpacing: 0.5,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 18),
                  
                  // Main Headline
                  RichText(
                    text: TextSpan(
                      style: GoogleFonts.inter(
                        fontSize: 34,
                        fontWeight: FontWeight.w900,
                        height: 1.15,
                        color: Colors.white,
                      ),
                      children: const [
                        TextSpan(text: 'Cultivate the Future with '),
                        TextSpan(
                          text: 'Gravity-Defying Tech',
                          style: TextStyle(
                            color: AppColors.primaryLight,
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Text(
                    'Grow premium, high-yield organic crops indoors or outdoors. Our fully automated Hydroponic Towers optimize nutrient delivery using IoT sensors and AI-driven growth telemetry.',
                    style: GoogleFonts.inter(
                      fontSize: 14,
                      color: AppColors.textSecondary,
                      height: 1.5,
                    ),
                  ),
                  const SizedBox(height: 24),

                  // Hero Action Buttons
                  Row(
                    children: [
                      Expanded(
                        child: ElevatedButton(
                          onPressed: _scrollToProducts,
                          child: const FittedBox(
                            child: Text('Get Tower Now'),
                          ),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: OutlinedButton(
                          onPressed: widget.onNavigateToDashboard,
                          style: OutlinedButton.styleFrom(
                            padding: const EdgeInsets.symmetric(vertical: 16),
                            side: const BorderSide(color: AppColors.primaryLight, width: 1.5),
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                          ),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.center,
                            children: [
                              const Icon(Icons.sensors_rounded, size: 18, color: AppColors.primaryLight),
                              const SizedBox(width: 6),
                              FittedBox(
                                child: Text(
                                  'Live Telemetry',
                                  style: GoogleFonts.inter(
                                    color: AppColors.primaryLight,
                                    fontWeight: FontWeight.bold,
                                  ),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 32),

                  // Trust Metrics Grid
                  Container(
                    padding: const EdgeInsets.all(20),
                    decoration: BoxDecoration(
                      color: AppColors.surface.withValues(alpha: 0.6),
                      borderRadius: BorderRadius.circular(20),
                      border: Border.all(color: AppColors.surfaceBorder),
                    ),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceAround,
                      children: [
                        _buildTrustMetric(context, '95%', 'Water Saved'),
                        Container(width: 1, height: 36, color: AppColors.surfaceBorder),
                        _buildTrustMetric(context, '3x', 'Faster Growth'),
                        Container(width: 1, height: 36, color: AppColors.surfaceBorder),
                        _buildTrustMetric(context, '100%', 'Organic Yield'),
                      ],
                    ),
                  ),
                ],
              ),
            ),

            // Animated Interactive Tower Graphic
            Padding(
              padding: const EdgeInsets.all(20),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  color: cardBg,
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: cardBorder),
                ),
                child: Column(
                  children: [
                    Text(
                      'Interactive Hydroponic Tower Visualization',
                      style: GoogleFonts.inter(
                        fontSize: 16,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Real-time nutrient flow & IoT sensor node mapping',
                      style: GoogleFonts.inter(
                        fontSize: 12,
                        color: secondaryTextColor,
                      ),
                    ),
                    const SizedBox(height: 24),
                    AnimatedBuilder(
                      animation: _animationController,
                      builder: (context, child) {
                        return CustomPaint(
                          size: const Size(double.infinity, 220),
                          painter: HydroponicTowerPainter(
                            animationValue: _animationController.value,
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ),
            ),

            // Products Showcase Section
            Padding(
              key: _productsKey,
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Our Hydroponic Systems',
                    style: GoogleFonts.inter(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                  const SizedBox(height: 6),
                  Text(
                    'Choose the ideal setup for home, garden, or commercial farm',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      color: secondaryTextColor,
                    ),
                  ),
                  const SizedBox(height: 16),
                  ...Product.catalog.map((product) => _buildProductCard(context, product)),
                ],
              ),
            ),

            // Interactive Yield & Savings Calculator
            Padding(
              padding: const EdgeInsets.all(20),
              child: Container(
                padding: const EdgeInsets.all(24),
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    colors: [
                      cardBg,
                      AppColors.primary.withValues(alpha: isDark ? 0.15 : 0.08),
                    ],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: AppColors.primary.withValues(alpha: 0.3)),
                ),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        const Icon(Icons.calculate_outlined, color: AppColors.primary, size: 28),
                        const SizedBox(width: 10),
                        Text(
                          'Yield & Water Savings Calculator',
                          style: GoogleFonts.inter(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                            color: textColor,
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),
                    Text(
                      'Number of Plant Sites: ${_numPlants.round()}',
                      style: GoogleFonts.inter(color: textColor, fontWeight: FontWeight.w600),
                    ),
                    Slider(
                      value: _numPlants,
                      min: 10,
                      max: 200,
                      divisions: 19,
                      activeColor: AppColors.primary,
                      onChanged: (val) => setState(() => _numPlants = val),
                    ),
                    const SizedBox(height: 12),
                    Text(
                      'Traditional Water Use: ${_currentWaterLitresPerMonth.round()} Litres / Mo',
                      style: GoogleFonts.inter(color: textColor, fontWeight: FontWeight.w600),
                    ),
                    Slider(
                      value: _currentWaterLitresPerMonth,
                      min: 100,
                      max: 2000,
                      divisions: 19,
                      activeColor: AppColors.cyanAccent,
                      onChanged: (val) => setState(() => _currentWaterLitresPerMonth = val),
                    ),
                    const SizedBox(height: 20),
                    Container(
                      padding: const EdgeInsets.all(16),
                      decoration: BoxDecoration(
                        color: isDark ? AppColors.background.withValues(alpha: 0.7) : AppColors.lightSurfaceCard,
                        borderRadius: BorderRadius.circular(16),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceAround,
                        children: [
                          Column(
                            children: [
                              Text(
                                '$waterSaved L',
                                style: GoogleFonts.inter(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.cyanAccent,
                                ),
                              ),
                              Text(
                                'Water Saved / Mo',
                                style: GoogleFonts.inter(fontSize: 11, color: secondaryTextColor),
                              ),
                            ],
                          ),
                          Container(width: 1, height: 32, color: cardBorder),
                          Column(
                            children: [
                              Text(
                                '$estimatedYieldKg kg',
                                style: GoogleFonts.inter(
                                  fontSize: 22,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.primary,
                                ),
                              ),
                              Text(
                                'Monthly Harvest',
                                style: GoogleFonts.inter(fontSize: 11, color: secondaryTextColor),
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 30),
          ],
        ),
      ),
    );
  }

  Widget _buildTrustMetric(BuildContext context, String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.bold,
            color: Colors.white,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 11,
            color: AppColors.textSecondary,
          ),
        ),
      ],
    );
  }

  Widget _buildProductCard(BuildContext context, Product product) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardBg = isDark ? AppColors.surface : AppColors.lightSurface;
    final cardBorder = isDark ? AppColors.surfaceBorder : AppColors.lightSurfaceBorder;
    final textColor = isDark ? Colors.white : AppColors.lightTextPrimary;
    final secondaryTextColor = isDark ? AppColors.textSecondary : AppColors.lightTextSecondary;

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: cardBg,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(
          color: product.isPopular ? AppColors.primary.withValues(alpha: 0.5) : cardBorder,
          width: product.isPopular ? 1.5 : 1,
        ),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          if (product.isPopular)
            Container(
              margin: const EdgeInsets.only(bottom: 12),
              padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: AppColors.primary.withValues(alpha: 0.2),
                borderRadius: BorderRadius.circular(12),
              ),
              child: Text(
                'MOST POPULAR',
                style: GoogleFonts.inter(
                  fontSize: 10,
                  fontWeight: FontWeight.bold,
                  color: AppColors.primary,
                ),
              ),
            ),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                product.title,
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                ),
              ),
              Text(
                product.price,
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w800,
                  color: AppColors.primary,
                ),
              ),
            ],
          ),
          const SizedBox(height: 4),
          Text(
            product.tagline,
            style: GoogleFonts.inter(
              fontSize: 12,
              color: secondaryTextColor,
            ),
          ),
          const SizedBox(height: 12),
          Text(
            product.description,
            style: GoogleFonts.inter(
              fontSize: 13,
              color: textColor,
              height: 1.4,
            ),
          ),
          const SizedBox(height: 16),
          ...product.features.map(
            (feat) => Padding(
              padding: const EdgeInsets.only(bottom: 6),
              child: Row(
                children: [
                  const Icon(Icons.check_circle_rounded, size: 16, color: AppColors.primary),
                  const SizedBox(width: 8),
                  Text(
                    feat,
                    style: GoogleFonts.inter(fontSize: 12, color: secondaryTextColor),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 16),
          SizedBox(
            width: double.infinity,
            height: 46,
            child: ElevatedButton(
              onPressed: () => _showOrderBottomSheet(product),
              child: const Text('Inquire / Order Now'),
            ),
          ),
        ],
      ),
    );
  }
}

// Custom Painter for Hydroponic Tower Visualization
class HydroponicTowerPainter extends CustomPainter {
  final double animationValue;

  HydroponicTowerPainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final center = Offset(size.width / 2, size.height / 2);
    
    // Tower vertical column
    final towerPaint = Paint()
      ..color = const Color(0xFF334155)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 32
      ..strokeCap = StrokeCap.round;

    canvas.drawLine(
      Offset(center.dx, 30),
      Offset(center.dx, size.height - 30),
      towerPaint,
    );

    // Water flow animation line down center
    final waterPaint = Paint()
      ..color = AppColors.cyanAccent.withValues(alpha: 0.8)
      ..style = PaintingStyle.stroke
      ..strokeWidth = 6
      ..strokeCap = StrokeCap.round;

    final startY = 30 + (animationValue * 40);
    canvas.drawLine(
      Offset(center.dx, startY),
      Offset(center.dx, size.height - 30),
      waterPaint,
    );

    // Plant sites on sides
    final plantPaint = Paint()
      ..color = AppColors.primaryLight
      ..style = PaintingStyle.fill;

    final angles = [60.0, 100.0, 140.0, 180.0];
    for (var y in angles) {
      // Left plant pod
      canvas.drawCircle(Offset(center.dx - 28, y), 10, plantPaint);
      // Right plant pod
      canvas.drawCircle(Offset(center.dx + 28, y + 10), 10, plantPaint);
    }
  }

  @override
  bool shouldRepaint(covariant HydroponicTowerPainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
